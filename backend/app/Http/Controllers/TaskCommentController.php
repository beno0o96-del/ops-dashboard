<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskCommentController extends Controller
{
    public function storeChat(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);
        
        $task = Task::findOrFail($request->task_id);
        
        return $this->store($request, $task);
    }

    public function store(Request $request, Task $task)
    {
        // Update 1: Validation to accept 'message' as alias for 'body' + 'file'
        $data = $request->validate([
            'body' => ['nullable','string'],
            'message' => ['nullable','string'], // Alias
            'attachments.*' => ['file','max:10240'],
            'file' => ['nullable', 'file', 'max:10240'], // Single file support
            'title' => ['nullable', 'string'] // For updating task title
        ]);

        $body = $data['body'] ?? $data['message'] ?? null;
        $hasFile = $request->hasFile('attachments') || $request->hasFile('file');

        if (empty($body) && !$hasFile) {
            return response()->json(['message' => 'Body/Message or attachments/file required'], 422);
        }

        // Auto-update task title if not set or generic, using the first message
        if (empty($task->title) || $task->title === 'New Task' || $task->title === 'مهمة جديدة') {
            if ($body) {
                $task->title = \Illuminate\Support\Str::limit($body, 30);
                $task->save();
            }
        }

        $comment = TaskComment::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'body' => $body,
        ]);

        $saved = [];

        // Handle 'attachments' array
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store("task-comments/{$comment->id}", 'public');
                $att = TaskAttachment::create([
                    'task_comment_id' => $comment->id,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'path' => $path,
                ]);
                $att->url = Storage::disk('public')->url($att->path);
                $saved[] = $att;
            }
        }

        // Handle single 'file' (User request)
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store("task-comments/{$comment->id}", 'public');
            $att = TaskAttachment::create([
                'task_comment_id' => $comment->id,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'path' => $path,
            ]);
            $att->url = Storage::disk('public')->url($att->path);
            $saved[] = $att;
        }

        $comment->load('user:id,name');
        
        // Transform response to match User's desired JSON structure
        // { "id": 25, "message": "...", "title": "...", "attachment": "...", "attachment_name": "..." }
        
        $response = [
            'id' => $comment->id,
            'message' => $comment->body,
            'title' => $task->title, // Return task title
            'by' => $comment->user->name,
            'at' => $comment->created_at->format('Y-m-d H:i'),
            // Attachments
            'attachments' => $saved, // Keep original array for robustness
        ];

        // Add flat fields for first attachment (User requirement)
        if (!empty($saved)) {
            $first = $saved[0];
            $response['attachment'] = $first->url; // Full URL or relative path? User said "storage/chat/..."
            $response['attachment_name'] = $first->original_name;
        } else {
            $response['attachment'] = null;
            $response['attachment_name'] = null;
        }

        return response()->json($response, 201);
    }
}
