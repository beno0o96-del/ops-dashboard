<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title','description','status','priority','due_date','assigned_to','created_by','branch_id'
    ];

    protected $casts = [
        'due_date' => 'date:Y-m-d',
    ];

    public function branch() {
        return $this->belongsTo(Branch::class);
    }

    public function comments() {
        return $this->hasMany(TaskComment::class);
    }

    public function attachments() {
        return $this->hasMany(TaskAttachment::class);
    }

    public function assignee() {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
