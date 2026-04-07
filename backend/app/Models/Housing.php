<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Housing extends Model
{
    protected $fillable = [
        'name',
        'location',
        'capacity',
        'type',
        'rent_amount',
        'owner',
        'contact_phone',
        'status',
        'notes',
        'city',
        'supervisor',
        'rooms_count',
        'beds_capacity',
        'occupants_count',
        'monthly_expense_total',
        'monthly_expenses',
        'municipality_expiry_days',
        'civil_defense_expiry_days',
        'municipality_license_number',
        'municipality_expiry_date',
        'civil_defense_license_number',
        'civil_defense_expiry_date',
        'cost_centers',
        'image',
        'image_data',
        'images',
        'images_data',
        'assigned_employees',
        'expenses',
        'civil_defense_status',
        'branch_id',
        'cost_center'
    ];

    protected $casts = [
        'cost_centers' => 'array',
        'assigned_employees' => 'array',
        'monthly_expense_total' => 'decimal:2',
        'monthly_expenses' => 'decimal:2',
        'images' => 'array',
        'images_data' => 'array',
        'municipality_expiry_date' => 'date',
        'civil_defense_expiry_date' => 'date',
        'expenses' => 'array',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
