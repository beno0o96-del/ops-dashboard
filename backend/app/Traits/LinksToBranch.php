<?php

namespace App\Traits;

use App\Models\Branch;

trait LinksToBranch
{
    /**
     * Automatically link data to a branch based on cost_center or name.
     * Also syncs branch_id and cost_center fields.
     */
    protected function linkToBranch(array $data)
    {
        try {
            // 1. If branch_id is missing, try to find it
            if (empty($data['branch_id'])) {
                $br = null;
                
                // Try by cost_center first (primary key for user)
                if (!empty($data['cost_center'])) {
                    $br = Branch::where('cost_center', $data['cost_center'])->first();
                }
                
                // Try by branch name if cost_center failed
                if (!$br && !empty($data['branch'])) {
                    $br = Branch::where('name', $data['branch'])->first();
                }

                // If found, set ID and ensure name/cost_center are consistent
                if ($br) {
                    $data['branch_id'] = $br->id;
                    if (empty($data['branch'])) {
                        $data['branch'] = $br->name;
                    }
                    if (empty($data['cost_center'])) {
                        $data['cost_center'] = $br->cost_center;
                    }
                }
            } 
            // 2. If branch_id is present, ensure cost_center is set if missing
            else {
                $br = Branch::find($data['branch_id']);
                if ($br) {
                    if (empty($data['branch'])) {
                        $data['branch'] = $br->name;
                    }
                    if (empty($data['cost_center'])) {
                        $data['cost_center'] = $br->cost_center;
                    }
                }
            }
        } catch (\Throwable $e) {
            // Log error or ignore
        }
        
        return $data;
    }
}
