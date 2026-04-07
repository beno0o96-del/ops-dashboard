<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ExpiryAlertLog extends Model
{
    protected $fillable = [
        'alertable_id',
        'alertable_type',
        'alert_type',
        'expiry_date',
        'days_remaining',
        'recipients',
        'sent_at',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'recipients' => 'array',
        'sent_at' => 'datetime',
    ];

    public function alertable(): MorphTo
    {
        return $this->morphTo();
    }
}
