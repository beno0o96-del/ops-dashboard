<?php

namespace App\Http\Controllers;

use App\Models\Housing;
use Illuminate\Http\Request;
use App\Traits\LinksToBranch;

class HousingController extends Controller
{
    use LinksToBranch;

    public function index() { return Housing::orderBy('id','desc')->get(); }
    public function store(Request $r) { 
        $data = $this->linkToBranch($r->all());
        return Housing::create($data); 
    }
    public function show($id) { return Housing::findOrFail($id); }
    public function update(Request $r, $id) { 
        $m = Housing::findOrFail($id); 
        $data = $this->linkToBranch($r->all());
        $m->update($data); 
        return $m; 
    }
    public function destroy($id) { $m = Housing::findOrFail($id); $m->delete(); return response()->json(['deleted'=>true]); }
}
