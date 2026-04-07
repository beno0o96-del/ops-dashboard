<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class AlertController extends Controller
{
    public function attach(Request $request, $id)
    {
        try {
            $alert = Alert::findOrFail($id);
            $file = $request->file('file');
            
            if (!$file) {
                return response()->json(['error' => 'no_file'], 422);
            }
            
            $path = $file->store('attachments', 'public');

            $attachmentData = [
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'uploaded_by' => optional(Auth::user())->id,
                'attachable_type' => Alert::class,
                'attachable_id' => $alert->id,
            ];

            if (Schema::hasColumn('attachments', 'cost_center')) {
                $attachmentData['cost_center'] = $request->input('cost_center') ?: $alert->cost_center;
            }

            $attachment = Attachment::create($attachmentData);

            return response()->json([
                'id' => $attachment->id,
                'alert_id' => $id,
                'path' => $path,
                'url' => Storage::url($path),
                'name' => $attachment->file_name,
                'type' => $attachment->mime_type,
                'size' => $attachment->size
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'upload_failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}