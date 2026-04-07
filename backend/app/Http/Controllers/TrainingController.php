<?php

namespace App\Http\Controllers;

use App\Models\Training;
use Illuminate\Http\Request;
use App\Traits\LinksToBranch;

class TrainingController extends Controller
{
    use LinksToBranch;

    public function index()
    {
        return Training::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_name' => 'nullable|string',
            'title' => 'nullable|string',
            'date' => 'nullable|date',
            'trainer' => 'nullable|string',
            'branch' => 'nullable|string',
            'location' => 'nullable|string',
            'cost_center' => 'nullable|string',
            'branch_id' => 'nullable|integer',
        ]);

        $data = $this->linkToBranch($validated);
        $training = Training::create($data);
        return response()->json($training, 201);
    }

    public function show(Training $training)
    {
        return $training;
    }

    public function update(Request $request, Training $training)
    {
        $data = $this->linkToBranch($request->all());
        $training->update($data);
        return $training;
    }

    public function destroy(Training $training)
    {
        $training->delete();
        return response()->json(null, 204);
    }
}
