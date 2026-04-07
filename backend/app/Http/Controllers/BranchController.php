<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BranchController extends Controller
{
    public function index() { return Branch::orderBy('id','desc')->get(); }
    public function store(Request $r) { 
        try {
            $r->validate(['name' => 'required|string|max:255']);
            return Branch::create($r->all());
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json(['message' => 'فشل حفظ الفرع: تأكد من إدخال جميع البيانات المطلوبة', 'error' => $e->getMessage()], 500);
        }
    }
    public function show($id) { return Branch::with('attachments')->findOrFail($id); }
    public function update(Request $r, $id) { 
        try {
            $m = Branch::findOrFail($id); 
            $r->validate(['name' => 'required|string|max:255']);
            $m->update($r->all()); 
            return $m; 
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json(['message' => 'فشل تحديث الفرع: تأكد من صحة البيانات', 'error' => $e->getMessage()], 500);
        }
    }
    public function destroy($id) { $m = Branch::findOrFail($id); $m->delete(); return response()->json(['deleted'=>true]); }

    public function attach(Request $r, $id)
    {
        $branch = Branch::findOrFail($id);
        $file = $r->file('file');
        if (!$file) return response()->json(['error' => 'no_file'], 422);
        $category = $r->get('category');
        $path = $file->store('attachments', 'public');
        $attachment = Attachment::create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => auth()->id() ?? null,
            'attachable_type' => Branch::class,
            'attachable_id' => $branch->id,
            'category' => $category,
        ]);
        return response()->json([
            'id' => $attachment->id,
            'branch_id' => $branch->id,
            'path' => $path,
            'url' => Storage::url($path),
            'name' => $attachment->file_name,
            'type' => $attachment->mime_type,
            'size' => $attachment->size,
            'category' => $attachment->category
        ]);
    }
}
