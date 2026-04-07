<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::query()
            ->with([
                'assignee:id,name', 
                'creator:id,name', 
                'branch:id,name',
                'comments.user:id,name', 
                'comments.attachments',
                'attachments'
            ])
            ->latest()
            ->get();

        // Add attachment URLs
        $tasks->each(function ($task) {
            $task->attachments->each(function ($a) {
                $a->url = Storage::disk('public')->url($a->path);
                $a->dataUrl = $a->url; 
            });

            $task->comments->each(function ($c) {
                $c->attachments->each(function ($a) {
                    $a->url = Storage::disk('public')->url($a->path);
                    $a->dataUrl = $a->url; 
                });
            });
        });

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'status' => ['required','in:pending,in_progress,done,progress,completed,review'],
            'priority' => ['required','in:low,medium,high'],
            'due_date' => ['nullable','date'],
            'assigned_to' => ['nullable','exists:users,id'],
            'branch_id' => ['nullable','exists:branches,id'],
            'attachments' => ['nullable', 'array'],
        ]);

        // Map frontend status to backend enum
        if ($data['status'] === 'progress') $data['status'] = 'in_progress';
        if ($data['status'] === 'completed') $data['status'] = 'done';

        $data['created_by'] = $request->user()->id;

        $task = Task::create($data);

        if (!empty($request->attachments)) {
            foreach ($request->attachments as $file) {
                if (isset($file['dataUrl']) && str_starts_with($file['dataUrl'], 'data:')) {
                    $this->saveAttachment($task, $file);
                }
            }
        }

        return response()->json($task->load(['assignee:id,name','creator:id,name','branch:id,name','attachments']), 201);
    }

    public function show(Task $task)
    {
        $task->load([
            'assignee:id,name',
            'creator:id,name',
            'branch:id,name',
            'comments.user:id,name',
            'comments.attachments',
            'attachments'
        ]);

        $task->attachments->each(function ($a) {
             $a->url = Storage::disk('public')->url($a->path);
        });

        $task->comments->each(function ($c) {
            $c->attachments->each(function ($a) {
                $a->url = Storage::disk('public')->url($a->path);
            });
        });

        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'title' => ['sometimes','required','string','max:255'],
            'description' => ['sometimes','nullable','string'],
            'status' => ['sometimes','required','in:pending,in_progress,done,progress,completed,review'],
            'priority' => ['sometimes','required','in:low,medium,high'],
            'due_date' => ['sometimes','nullable','date'],
            'assigned_to' => ['sometimes','nullable','exists:users,id'],
            'branch_id' => ['sometimes','nullable','exists:branches,id'],
            'attachments' => ['nullable', 'array'],
        ]);

        // Map frontend status to backend enum
        if (isset($data['status'])) {
            if ($data['status'] === 'progress') $data['status'] = 'in_progress';
            if ($data['status'] === 'completed') $data['status'] = 'done';
        }

        $task->update($data);

        if (!empty($request->attachments)) {
            foreach ($request->attachments as $file) {
                // Only save new files (Base64)
                if (isset($file['dataUrl']) && str_starts_with($file['dataUrl'], 'data:')) {
                    $this->saveAttachment($task, $file);
                }
            }
        }

        return response()->json($task->load(['assignee:id,name','creator:id,name','branch:id,name','attachments']));
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['ok' => true]);
    }

    private function saveAttachment($task, $file) {
        @list($type, $data) = explode(';', $file['dataUrl']);
        @list(, $data)      = explode(',', $data);
        $content = base64_decode($data);
        
        // Clean filename
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name'] ?? 'file');
        $path = 'attachments/' . uniqid() . '_' . $filename;
        
        Storage::disk('public')->put($path, $content);
        
        $task->attachments()->create([
            'original_name' => $file['name'] ?? 'file',
            'mime_type' => str_replace('data:', '', $type),
            'size' => strlen($content),
            'path' => $path
        ]);
   }
}
