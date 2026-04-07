<?php

namespace App\Http\Controllers;

use App\Models\InboxMessage;
use Illuminate\Http\Request;

class InboxMessageController extends Controller
{
    public function index()
    {
        return InboxMessage::orderBy('id','desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'from_name' => 'nullable|string|max:255',
            'from_id' => 'nullable|string|max:100',
            'from_type' => 'nullable|string|max:50',
            'to_name' => 'nullable|string|max:255',
            'to_id' => 'nullable|string|max:100',
            'to_type' => 'nullable|string|max:50',
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'priority' => 'nullable|string|max:20',
            'status' => 'nullable|string|max:20',
        ]);
        $msg = InboxMessage::create($data);
        return response()->json($msg, 201);
    }

    public function show($id)
    {
        return InboxMessage::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $msg = InboxMessage::findOrFail($id);
        $data = $request->validate([
            'from_name' => 'sometimes|nullable|string|max:255',
            'from_id' => 'sometimes|nullable|string|max:100',
            'from_type' => 'sometimes|nullable|string|max:50',
            'to_name' => 'sometimes|nullable|string|max:255',
            'to_id' => 'sometimes|nullable|string|max:100',
            'to_type' => 'sometimes|nullable|string|max:50',
            'title' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
            'priority' => 'sometimes|nullable|string|max:20',
            'status' => 'sometimes|nullable|string|max:20',
        ]);
        $msg->update($data);
        return $msg;
    }

    public function destroy($id)
    {
        $msg = InboxMessage::findOrFail($id);
        $msg->delete();
        return response()->json(['deleted' => true]);
    }
}

