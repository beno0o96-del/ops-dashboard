<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'type',
        'brand',
        'email',
        'cost_center',
        'ops1',
        'kpi_target',
        'kpi_value',
        'kpi_score',
        'opening_date_expected',
        'close_date',
        'region',
        'city',
        'notes',
        'hidden',
        'award_star_manual',
        'store_license',
        'store_license_expiry',
        'civil_defense',
        'civil_defense_expiry',
        'vertical_sign_exists',
        'vertical_sign_length',
        'vertical_sign_width',
        'vertical_sign_unit',
        'permit_24h',
        'permit_24h_expiry',
        'permit_24h_cost',
        'delivery_permit',
        'delivery_permit_expiry',
        'delivery_permit_cost',
        'outdoor_permit',
        'outdoor_permit_expiry',
        'outdoor_area',
        'outdoor_permit_cost',
        'ad_permits',
    ];

    protected $casts = [
        'kpi_target' => 'float',
        'kpi_value' => 'float',
        'kpi_score' => 'float',
        'hidden' => 'boolean',
        'award_star_manual' => 'boolean',
        'vertical_sign_exists' => 'boolean',
        'store_license_expiry' => 'date:Y-m-d',
        'civil_defense_expiry' => 'date:Y-m-d',
        'permit_24h_expiry' => 'date:Y-m-d',
        'delivery_permit_expiry' => 'date:Y-m-d',
        'outdoor_permit_expiry' => 'date:Y-m-d',
        'ad_permits' => 'array',
    ];

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
