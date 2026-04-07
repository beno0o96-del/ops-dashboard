<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Contract extends Model
{
    protected $fillable = [
        'branch_id','type','title','vendor_name','contract_no','start_date','expiry_date','value','notes','archived_at','archive_reason'
    ];
    
    protected $dates = ['start_date','expiry_date','archived_at'];
    
    protected $appends = ['computed_status'];
    
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
    
    public function getComputedStatusAttribute()
    {
        if ($this->archived_at) return 'archived';
        if (!$this->expiry_date) return 'active';
        $days = now()->startOfDay()->diffInDays(\Carbon\Carbon::parse($this->expiry_date), false);
        if ($days < 0) return 'expired';
        if ($days <= 30) return 'expiring';
        return 'active';
    }
}
