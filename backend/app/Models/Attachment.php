<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attachment extends Model
{
    protected $fillable = [
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'attachable_type',
        'attachable_id',
        'cost_center',
        'uploaded_by'
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    /**
     * العلاقة مع الكيان المرتبط (Branch أو أي كيان آخر)
     */
    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * نطاق للبحث حسب مركز التكلفة
     */
    public function scopeByCostCenter($query, string $costCenter)
    {
        return $query->where('cost_center', $costCenter);
    }

    /**
     * نطاق للبحث حسب نوع الكيان ومعرفه
     */
    public function scopeForEntity($query, string $type, int $id)
    {
        return $query->where('attachable_type', $type)
                    ->where('attachable_id', $id);
    }
}