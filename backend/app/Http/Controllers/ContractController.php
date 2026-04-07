<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Attachment;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index(Request $r)
    {
        $q = Contract::with('branch')->orderBy('id','desc');
        if ($r->filled('only_archived')) $q->whereNotNull('archived_at');
        else $q->whereNull('archived_at');
        if ($r->filled('type')) $q->where('type', $r->get('type'));
        if ($r->filled('branch_id')) $q->where('branch_id', $r->get('branch_id'));
        if ($r->filled('status')) {
            $s = $r->get('status');
            if ($s === 'archived') $q->whereNotNull('archived_at');
            if ($s === 'expired') $q->whereDate('expiry_date','<', now()->toDateString())->whereNull('archived_at');
            if ($s === 'expiring') $q->whereBetween('expiry_date', [now()->toDateString(), now()->copy()->addDays(30)->toDateString()])->whereNull('archived_at');
            if ($s === 'active') $q->where(function($qq){
                $qq->whereNull('expiry_date')->orWhereDate('expiry_date','>', now()->copy()->addDays(30)->toDateString());
            })->whereNull('archived_at');
        }
        if ($r->filled('q') || $r->filled('brand') || $r->filled('city') || $r->filled('region')) {
            $q->leftJoin('branches','contracts.branch_id','=','branches.id')
              ->select('contracts.*');
            if ($r->filled('brand')) $q->where('branches.brand',$r->get('brand'));
            if ($r->filled('city')) $q->where('branches.city',$r->get('city'));
            if ($r->filled('region')) $q->where('branches.region',$r->get('region'));
            if ($r->filled('q')) {
                $term = '%'.$r->get('q').'%';
                $q->where(function($qq) use ($term){
                    $qq->where('contracts.title','like',$term)
                       ->orWhere('contracts.contract_no','like',$term)
                       ->orWhere('contracts.vendor_name','like',$term)
                       ->orWhere('branches.name','like',$term)
                       ->orWhere('branches.cost_center','like',$term);
                });
            }
        }
        return $q->get();
    }
    
    public function store(Request $r)
    {
        $data = $r->only(['branch_id','type','title','vendor_name','contract_no','start_date','expiry_date','value','notes','archive_reason']);
        return Contract::create($data);
    }
    
    public function show($id) { return Contract::with('branch','attachments')->findOrFail($id); }
    
    public function update(Request $r, $id)
    {
        $m = Contract::findOrFail($id);
        $m->update($r->only(['branch_id','type','title','vendor_name','contract_no','start_date','expiry_date','value','notes','archived_at','archive_reason']));
        return $m;
    }
    
    public function destroy($id) { $m = Contract::findOrFail($id); $m->delete(); return response()->json(['deleted'=>true]); }
    
    public function archive($id)
    {
        $m = Contract::findOrFail($id);
        $m->archived_at = now();
        $m->save();
        return $m;
    }
    
    public function restore($id)
    {
        $m = Contract::findOrFail($id);
        $m->archived_at = null;
        $m->save();
        return $m;
    }
    
    public function attach(Request $r, $id)
    {
        $m = Contract::findOrFail($id);
        $a = new Attachment($r->only(['file_path','file_name','mime_type','size','uploaded_by']));
        $m->attachments()->save($a);
        return $a;
    }
}
