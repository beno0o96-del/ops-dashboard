<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeAlertPreference extends Model
{
    protected $fillable = ['employee_id', 'alert_type', 'receive_alerts'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
