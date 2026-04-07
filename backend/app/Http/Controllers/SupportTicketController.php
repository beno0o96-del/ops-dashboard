<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index()
    {
        return SupportTicket::orderBy('id','desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'subject' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'desc' => 'nullable|string',
            'attachments' => 'nullable|array',
            'status' => 'nullable|string|max:50',
        ]);
        $ticket = SupportTicket::create($data);
        return response()->json($ticket, 201);
    }

    public function show($id)
    {
        return SupportTicket::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'phone' => 'sometimes|nullable|string|max:100',
            'email' => 'sometimes|nullable|email|max:255',
            'subject' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|nullable|string|max:100',
            'desc' => 'sometimes|nullable|string',
            'attachments' => 'sometimes|nullable|array',
            'status' => 'sometimes|nullable|string|max:50',
        ]);
        $ticket->update($data);
        return $ticket;
    }

    public function destroy($id)
    {
        $ticket = SupportTicket::findOrFail($id);
        $ticket->delete();
        return response()->json(['deleted' => true]);
    }
}

