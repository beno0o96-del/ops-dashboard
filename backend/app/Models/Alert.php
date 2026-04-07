<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Alert extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'priority',
        'status',
        'branch_id',
        'cost_center',
        'created_by',
        'assigned_to',
        'due_date',
        'resolved_at'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}