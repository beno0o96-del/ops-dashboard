<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Quote::orderBy('id', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'text_ar' => 'required|string',
            'text_en' => 'nullable|string',
        ]);

        return Quote::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Quote::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $quote = Quote::findOrFail($id);
        
        $request->validate([
            'text_ar' => 'required|string',
            'text_en' => 'nullable|string',
        ]);

        $quote->update($request->all());
        return $quote;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $quote = Quote::findOrFail($id);
        $quote->delete();
        return response()->noContent();
    }
}
