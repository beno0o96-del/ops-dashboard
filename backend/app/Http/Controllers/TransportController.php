<?php

namespace App\Http\Controllers;

use App\Models\Transport;
use Illuminate\Http\Request;
use App\Traits\LinksToBranch;

class TransportController extends Controller
{
    use LinksToBranch;

    public function index() { return Transport::orderBy('id','desc')->get(); }
    public function store(Request $r) { 
        $data = $this->linkToBranch($r->all());
        return Transport::create($data); 
    }
    public function show($id) { return Transport::findOrFail($id); }
    public function update(Request $r, $id) { 
        $m = Transport::findOrFail($id); 
        $data = $this->linkToBranch($r->all());
        $m->update($data); 
        return $m; 
    }
    public function destroy($id) { $m = Transport::findOrFail($id); $m->delete(); return response()->json(['deleted'=>true]); }
}
