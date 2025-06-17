<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Register user (customer or seller)
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'phone_number' => 'nullable|string',
            'password' => 'required|min:6',
            'role' => 'required|in:seller,customer',
            'shop_name' => 'required_if:role,seller',
            'shop_address' => 'nullable|string',
            'gst_number' => 'nullable|string',
            'photo_url' => 'nullable|url',
        ]);

        $user = User::create([
            'name' => $validated['email'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        if ($validated['role'] === 'seller') {
            \App\Models\Seller::create([
                'user_id' => $user->id,
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'] ?? null,
                'shop_name' => $validated['shop_name'],
                'shop_address' => $validated['shop_address'] ?? null,
                'gst_number' => $validated['gst_number'] ?? null,
                'photo_url' => $validated['photo_url'] ?? null,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['access_token' => $token, 'user' => $user]);
    }

    // Login
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['access_token' => $token, 'user' => $user]);
    }

    // Update user (customer) profile
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email,'.$id,
            'phone_number' => 'nullable|string',
            'photo_url' => 'nullable|url',
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    // List all customers (optional)
    public function customers()
    {
        return User::where('role', 'customer')->get();
    }

    // Show single customer (optional)
    public function showCustomer($id)
    {
        return User::where('role', 'customer')->findOrFail($id);
    }
}
