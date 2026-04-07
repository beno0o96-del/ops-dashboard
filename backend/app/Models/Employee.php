<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Employee extends Model
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'branch', 'role', 'id_number', 'cost_center', 
        'training_data', 'photo', 'branch_id', 
        'tcoe_expiry', 'health_expiry', 'airport_expiry', 'municipality_card_expiry',
        'advertisement_license_expiry', 'airport_permit_expiry'
    ];

    protected $casts = [
        'training_data' => 'array',
        'tcoe_expiry' => 'date',
        'health_expiry' => 'date',
        'airport_expiry' => 'date',
        'municipality_card_expiry' => 'date',
        'advertisement_license_expiry' => 'date',
        'airport_permit_expiry' => 'date',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function alertPreferences()
    {
        return $this->hasMany(EmployeeAlertPreference::class);
    }
}
