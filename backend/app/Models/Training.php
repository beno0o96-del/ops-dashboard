<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    use HasFactory;

    protected $table = 'trainings'; // Explicitly set table name if needed, assuming 'training' from migration

    protected $fillable = [
        'course_name',
        'title',
        'date',
        'trainer',
        'branch',
        'location',
        'branch_id',
        'cost_center'
    ];
}
