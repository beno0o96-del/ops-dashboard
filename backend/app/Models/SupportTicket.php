<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'subject',
        'category',
        'desc',
        'attachments',
        'status',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];
}

