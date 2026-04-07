<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Branch;
use App\Models\Violation;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentController extends Controller
{
    /**
     * عرض جميع المرفقات لفرع معين
     */
    public function index($branchId)
    {
        try {
            $branch = Branch::find($branchId);
            if (!$branch) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }
            $attachments = $branch->attachments()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($attachment) {
                    return [
                        'id' => $attachment->id,
                        'file_name' => $attachment->file_name,
                        'file_path' => $attachment->file_path,
                        'mime_type' => $attachment->mime_type,
                        'size' => $attachment->size,
                        'cost_center' => $attachment->cost_center,
                        'uploaded_by' => $attachment->uploaded_by,
                        'created_at' => $attachment->created_at->toISOString(),
                        'updated_at' => $attachment->updated_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $attachments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل جلب المرفقات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * رفع مرفق جديد لفرع معين
     */
    public function store(Request $request, $branchId = null)
    {
        try {
            $request->validate([
                'file' => 'required|file|max:10240', // 10MB max
                'cost_center' => 'nullable|string|max:50',
            ]);

            $file = $request->file('file');

            // توليد اسم ملف فريد
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = $branchId ? ('attachments/' . $branchId) : 'attachments/general';
            $filePath = $file->storeAs($folder, $fileName, 'public');

            $attachmentData = [
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'uploaded_by' => optional(Auth::user())->id,
            ];

            if ($branchId) {
                $branch = Branch::findOrFail($branchId);
                $attachmentData['cost_center'] = $request->cost_center ?? $branch->cost_center;
                $attachment = $branch->attachments()->create($attachmentData);
            } else {
                $resolvedType = null;
                $resolvedId = null;

                $attachableType = (string) $request->input('attachable_type', '');
                $attachableId = $request->input('attachable_id');
                $branchIdFromRequest = $request->input('branch_id');
                $violationIdFromRequest = $request->input('violation_id');

                if (!empty($attachableType) && is_numeric($attachableId)) {
                    $resolvedType = $attachableType;
                    $resolvedId = (int) $attachableId;
                } elseif (is_numeric($branchIdFromRequest)) {
                    $branch = Branch::find((int) $branchIdFromRequest);
                    if ($branch) {
                        $resolvedType = Branch::class;
                        $resolvedId = (int) $branch->id;
                        $attachmentData['cost_center'] = $request->cost_center ?? $branch->cost_center;
                    }
                } elseif (is_numeric($violationIdFromRequest)) {
                    $violation = Violation::find((int) $violationIdFromRequest);
                    if ($violation) {
                        $resolvedType = Violation::class;
                        $resolvedId = (int) $violation->id;
                        if (!isset($attachmentData['cost_center'])) {
                            $attachmentData['cost_center'] = $request->cost_center ?? $violation->cost_center;
                        }
                    }
                }

                if (!$resolvedType || $resolvedId === null) {
                    $resolvedType = Branch::class;
                    $resolvedId = 0;
                }

                $attachmentData['attachable_type'] = $resolvedType;
                $attachmentData['attachable_id'] = $resolvedId;
                if (!isset($attachmentData['cost_center'])) {
                    $attachmentData['cost_center'] = $request->cost_center ?? null;
                }
                $attachment = Attachment::create($attachmentData);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم رفع المرفق بنجاح',
                'data' => [
                    'id' => $attachment->id,
                    'file_name' => $attachment->file_name,
                    'file_path' => $attachment->file_path,
                    'mime_type' => $attachment->mime_type,
                    'size' => $attachment->size,
                    'cost_center' => $attachment->cost_center,
                    'uploaded_by' => $attachment->uploaded_by,
                    'url' => Storage::disk('public')->url($attachment->file_path),
                    'created_at' => $attachment->created_at->toISOString(),
                ]
            ], 201);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'الفرع غير موجود'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل رفع المرفق',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مرفق
     */
    public function destroy($branchId, $attachmentId)
    {
        try {
            $branch = Branch::findOrFail($branchId);
            $attachment = $branch->attachments()->findOrFail($attachmentId);
            
            // حذف الملف من التخزين
            Storage::disk('public')->delete($attachment->file_path);
            
            // حذف سجل المرفق
            $attachment->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المرفق بنجاح'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'الفرع أو المرفق غير موجود'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل حذف المرفق',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحميل ملف مرفق
     */
    public function download($branchId, $attachmentId)
    {
        try {
            $branch = Branch::findOrFail($branchId);
            $attachment = $branch->attachments()->findOrFail($attachmentId);
            
            if (!Storage::disk('public')->exists($attachment->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'الملف غير موجود'
                ], 404);
            }

            return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'الفرع أو المرفق غير موجود'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل تحميل الملف',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب المرفقات حسب مركز التكلفة
     */
    public function byCostCenter($costCenter)
    {
        try {
            $attachments = Attachment::byCostCenter($costCenter)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($attachment) {
                    return [
                        'id' => $attachment->id,
                        'file_name' => $attachment->file_name,
                        'file_path' => $attachment->file_path,
                        'mime_type' => $attachment->mime_type,
                        'size' => $attachment->size,
                        'cost_center' => $attachment->cost_center,
                        'uploaded_by' => $attachment->uploaded_by,
                        'attachable_type' => $attachment->attachable_type,
                        'attachable_id' => $attachment->attachable_id,
                        'created_at' => $attachment->created_at->toISOString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $attachments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل جلب المرفقات',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
