<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\ChatSController;

// User Auth & Profile
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::put('/users/{id}', [UserController::class, 'update']);

// Customers (optional)
Route::get('/customers', [UserController::class, 'customers']);
Route::get('/customers/{id}', [UserController::class, 'showCustomer']);

// Sellers
Route::get('/sellers', [SellerController::class, 'index']);
Route::get('/sellers/{id}', [SellerController::class, 'show']);
Route::get('/sellers/user/{user_id}', [SellerController::class, 'byUserId']);
Route::put('/sellers/{id}', [SellerController::class, 'update']);

// Portfolios
Route::post('/portfolios', [PortfolioController::class, 'store']);
Route::put('/portfolios/{id}', [PortfolioController::class, 'update']);
Route::delete('/portfolios/{id}', [PortfolioController::class, 'destroy']);

//chat

Route::get('/chat_s/user/{user_id}', [ChatSController::class, 'userChats']);
Route::get('/chat_s/seller/{seller_id}', [ChatSController::class, 'sellerChats']);
Route::post('/chat_s', [ChatSController::class, 'store']); // Create a new chat
Route::get('/chat_message_s/{chatId}', [ChatSController::class, 'messages']);
Route::post('/chat_message_s/{chatId}', [ChatSController::class, 'sendMessage']);
Route::get('/seller_chats/{sellerId}', [ChatSController::class, 'sellerChatPartners']);
