<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InboxMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_name', 'from_id', 'from_type',
        'to_name', 'to_id', 'to_type',
        'title', 'body', 'priority', 'status'
    ];
}

