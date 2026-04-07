<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transport extends Model
{
    protected $fillable = [
        'plate_number', 'type', 'capacity', 'status', 'notes', 
        'branch_id', 'cost_center'
    ];
}
