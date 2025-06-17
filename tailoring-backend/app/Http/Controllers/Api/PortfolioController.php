<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    // Create a new portfolio (design) for a seller
    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id' => 'required|exists:sellers,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'required|string',
            'contact' => 'required|string|max:255',
        ]);
        $portfolio = Portfolio::create($validated);
        return response()->json($portfolio, 201);
    }

    // Update a portfolio (design) for a seller
    public function update(Request $request, $id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $validated = $request->validate([
            'seller_id' => 'required|exists:sellers,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'required|string',
            'contact' => 'required|string|max:255',
        ]);
        $portfolio->update($validated);
        return response()->json($portfolio);
    }

    // Delete a portfolio
    public function destroy($id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->delete();
        return response()->json(['message' => 'Portfolio deleted']);
    }
}
