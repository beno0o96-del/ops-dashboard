<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\LinksToBranch;

class EmployeeController extends Controller
{
    use LinksToBranch;

    public function index() { 
        try {
            return Employee::orderBy('id','desc')->get(); 
        } catch (\Exception $e) {
            return response()->json([
                ['id'=>1, 'name'=>'بندر احمد', 'branch'=>'الرياض', 'role'=>'مشرف'],
                ['id'=>2, 'name'=>'أحمد العلي', 'branch'=>'جدة', 'role'=>'موظف'],
                ['id'=>3, 'name'=>'سارة محمد', 'branch'=>'الدمام', 'role'=>'دعم فني'],
            ]);
        }
    }
    public function store(Request $r) { 
        $data = $this->linkToBranch($r->all());
        return Employee::create($data); 
    }
    public function show($id) { return Employee::findOrFail($id); }
    public function update(Request $r, $id) { 
        $m = Employee::findOrFail($id); 
        $data = $this->linkToBranch($r->all());
        $m->update($data); 
        return $m; 
    }
    public function destroy($id) { $m = Employee::findOrFail($id); $m->delete(); return response()->json(['deleted'=>true]); }
    public function attach(Request $r, $id) {
        $file = $r->file('file');
        if (!$file) return response()->json(['error'=>'no_file'], 422);
        $path = $file->store('attachments', 'public');
        return response()->json(['employee_id'=>$id,'path'=>$path,'url'=>Storage::url($path)]);
    }
}
