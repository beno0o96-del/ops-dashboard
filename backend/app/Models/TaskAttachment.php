<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class TaskAttachment extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'task_comment_id','original_name','mime_type','size','path'];

    public function comment() {
        return $this->belongsTo(TaskComment::class, 'task_comment_id');
    }

    public function task() {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function url(): string {
        return Storage::disk('public')->url($this->path);
    }
}
