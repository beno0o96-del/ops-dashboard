<?php

namespace App\Http\Controllers;

use App\Models\Violation;
use App\Models\Attachment;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Traits\LinksToBranch;

class ViolationController extends Controller
{
    use LinksToBranch;

    /**
     * جلب قائمة المخالفات
     */
    public function index()
    {
        return Violation::where('archived', false)
            ->with('attachments')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * إنشاء مخالفة جديدة
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch' => 'nullable|string',
            'branch_id' => 'nullable|integer|exists:branches,id',
            'cost_center' => 'required|string',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'region' => 'nullable|string',
            'vio_no' => 'nullable|string',
            'efaa_no' => 'nullable|string',
            'payment_no' => 'nullable|string',
            'amount' => 'required|numeric',
            'paid' => 'boolean',
            'date' => 'nullable|date',
            'appeal_status' => 'nullable|string',
            'appeal_number' => 'nullable|string',
            'appeal_date' => 'nullable|date',
            'finance_date' => 'nullable|date',
            'attachment_ids' => 'nullable|array',
            'attachment_ids.*' => 'integer|exists:attachments,id'
        ]);

        $validated = $this->linkToBranch($validated);
        $violation = Violation::create($validated);

        if ($request->has('attachment_ids')) {
            Attachment::whereIn('id', $request->attachment_ids)->update([
                'attachable_type' => Violation::class,
                'attachable_id' => $violation->id
            ]);
        }

        return response()->json($violation->load(['attachments']), 201);
    }

    /**
     * عرض مخالفة واحدة
     */
    public function show($id)
    {
        return Violation::with('attachments')->findOrFail($id);
    }

    /**
     * تحديث مخالفة
     */
    public function update(Request $request, $id)
    {
        $violation = Violation::findOrFail($id);
        
        $validated = $request->validate([
            'branch' => 'nullable|string',
            'branch_id' => 'nullable|integer|exists:branches,id',
            'cost_center' => 'nullable|string',
            'type' => 'nullable|string',
            'description' => 'nullable|string',
            'region' => 'nullable|string',
            'vio_no' => 'nullable|string',
            'efaa_no' => 'nullable|string',
            'payment_no' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'paid' => 'nullable|boolean',
            'date' => 'nullable|date',
            'appeal_status' => 'nullable|string',
            'appeal_number' => 'nullable|string',
            'appeal_date' => 'nullable|date',
            'finance_date' => 'nullable|date',
            'attachment_ids' => 'nullable|array',
            'attachment_ids.*' => 'integer|exists:attachments,id'
        ]);

        $validated = $this->linkToBranch($validated);
        $violation->update($validated);

        if ($request->has('attachment_ids')) {
            Attachment::whereIn('id', $request->attachment_ids)->update([
                'attachable_type' => Violation::class,
                'attachable_id' => $violation->id
            ]);
        }

        return response()->json($violation->load(['attachments']));
    }

    /**
     * حذف مخالفة
     */
    public function destroy($id)
    {
        $violation = Violation::findOrFail($id);
        $violation->delete();
        return response()->json(['message' => 'تم حذف المخالفة بنجاح']);
    }

    /**
     * تحديث حالة المخالفة إلى مدفوعة
     */
    public function markPaid($id)
    {
        $violation = Violation::findOrFail($id);
        $violation->paid = true;
        $violation->save();

        return response()->json([
            'message' => 'تم تحديث حالة المخالفة بنجاح',
            'data' => $violation
        ]);
    }

    /**
     * أرشفة مخالفة
     */
    public function archive($id)
    {
        $violation = Violation::findOrFail($id);
        $violation->archived = true;
        $violation->save();
        return response()->json($violation);
    }

    /**
     * رفع مرفق
     */
    public function attach(Request $r, $id)
    {
        try {
            $violation = Violation::findOrFail($id);
            $file = $r->file('file');
            if (!$file) return response()->json(['error' => 'no_file'], 422);
            
            $path = $file->store('attachments', 'public');

            $attachmentData = [
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'uploaded_by' => optional(Auth::user())->id,
                'attachable_type' => Violation::class,
                'attachable_id' => $violation->id,
            ];

            if (Schema::hasColumn('attachments', 'cost_center')) {
                $attachmentData['cost_center'] = $r->input('cost_center') ?: $violation->cost_center;
            }

            $attachment = Attachment::create($attachmentData);

            return response()->json([
                'id' => $attachment->id,
                'violation_id' => $id,
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
