<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Role::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles',
            'permissions' => 'nullable|array'
        ]);

        $role = Role::create($validated);
        return response()->json($role, 201);
    }

    public function show($id)
    {
        return Role::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|unique:roles,name,' . $id,
            'permissions' => 'nullable|array'
        ]);

        $role->update($validated);
        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(['deleted' => true]);
    }
}
