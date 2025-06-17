<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    // List all sellers with portfolios
    public function index()
    {
        return Seller::with('portfolios')->get();
    }

    // Show seller by seller id, with portfolios
    public function show($id)
    {
        return Seller::with('portfolios')->findOrFail($id);
    }

    // Show seller by user id (for login/profile fetch)
    public function byUserId($user_id)
    {
        return Seller::where('user_id', $user_id)->firstOrFail();
    }

    // Update seller profile
    public function update(Request $request, $id)
    {
        $seller = Seller::findOrFail($id);

        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone_number' => 'nullable|string',
            'shop_name' => 'nullable|string',
            'shop_address' => 'nullable|string',
            'gst_number' => 'nullable|string',
            'photo_url' => 'nullable|url',
        ]);

        $seller->update($validated);

        return response()->json($seller);
    }
}
