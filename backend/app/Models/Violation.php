<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    protected $fillable = [
        'branch',
        'branch_id',
        'cost_center',
        'type',
        'description',
        'region',
        'vio_no',
        'efaa_no',
        'payment_no',
        'amount',
        'paid',
        'date',
        'archived',
        'appeal_status',
        'appeal_number',
        'appeal_date',
        'finance_date'
    ];
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
