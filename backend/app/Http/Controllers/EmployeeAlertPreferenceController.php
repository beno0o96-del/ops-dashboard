<?php

namespace App\Http\Controllers;

use App\Models\EmployeeAlertPreference;
use Illuminate\Http\Request;

class EmployeeAlertPreferenceController extends Controller
{
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'alert_type' => 'required|string',
            'receive_alerts' => 'required|boolean',
        ]);

        $preference = EmployeeAlertPreference::updateOrCreate(
            [
                'employee_id' => $request->employee_id,
                'alert_type' => $request->alert_type,
            ],
            [
                'receive_alerts' => $request->receive_alerts,
            ]
        );

        return response()->json(['message' => 'Preference updated successfully', 'preference' => $preference]);
    }

    public function getPreferences($employeeId)
    {
        $preferences = EmployeeAlertPreference::where('employee_id', $employeeId)->get();
        return response()->json($preferences);
    }
}
