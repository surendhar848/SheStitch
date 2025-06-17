<?php

namespace App\Http\Controllers;

use App\Models\ChatS;
use App\Models\ChatMessageS;
use Illuminate\Http\Request;

class ChatSController extends Controller
{
    // Get all chats for a user (as sender or receiver)
    public function userChats($user_id)
    {
        $chats = ChatS::where('sender_id', $user_id)
            ->orWhere('receiver_id', $user_id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($chats);
    }

    // Get all chats for a seller (as sender or receiver)
    public function sellerChats($seller_id)
    {
        $chats = ChatS::where('sender_id', $seller_id)
            ->orWhere('receiver_id', $seller_id)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($chats);
    }

    // Create a new chat room if one does not exist
    public function store(Request $request)
    {
        $data = $request->validate([
            'sender_id'      => 'required|integer',
            'receiver_id'    => 'required|integer',
            'sender_role_id' => 'required|integer',
            'created_by'     => 'required|integer'
        ]);

        // Prevent duplicate chat between same two users
        $existing = ChatS::where(function($q) use ($data) {
                $q->where('sender_id', $data['sender_id'])
                ->where('receiver_id', $data['receiver_id']);
            })
            ->orWhere(function($q) use ($data) {
                $q->where('sender_id', $data['receiver_id'])
                ->where('receiver_id', $data['sender_id']);
            })
            ->first();

        if ($existing) {
            return response()->json($existing, 200);
        }

        $chat = ChatS::create($data);
        return response()->json($chat, 201);
    }

    // Get all messages for a specific chat
    public function messages($chatId)
    {
        $messages = ChatMessageS::where('chat_id', $chatId)
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    // Send a message in a chat
    public function sendMessage(Request $request, $chatId)
    {
        $data = $request->validate([
            'message'        => 'required|string',
            'msg_type'       => 'nullable|string',
            'sender_id'      => 'required|integer',
            'sender_role_id' => 'required|integer',
            'receiver_id'    => 'required|integer',
        ]);
        $data['chat_id'] = $chatId;

        $msg = ChatMessageS::create($data);

        // Update chat's updated_at timestamp
        ChatS::where('id', $chatId)->update(['updated_at' => now()]);

        return response()->json($msg, 201);
    }
    public function sellerChatPartners($sellerId)
{
    // Get distinct customer IDs who have chatted with this seller (role_id = 1 for customer)
    $chats = \App\Models\ChatS::where(function($q) use ($sellerId) {
            $q->where('sender_id', $sellerId)
              ->orWhere('receiver_id', $sellerId);
        })
        ->get();

    // Collect unique customer IDs from chats
    $customerIds = [];
    foreach ($chats as $chat) {
        if ($chat->sender_id != $sellerId && $chat->sender_role_id == 1) {
            $customerIds[$chat->sender_id] = $chat->id;
        }
        if ($chat->receiver_id != $sellerId && $chat->receiver_role_id == 1) {
            $customerIds[$chat->receiver_id] = $chat->id;
        }
    }

    $customers = [];
    foreach ($customerIds as $customerId => $chatId) {
        $customer = \App\Models\User::find($customerId);
        $lastMsg = \App\Models\ChatMessageS::where('chat_id', $chatId)
            ->orderBy('created_at', 'desc')
            ->first();

        $customers[] = [
            'customer_id' => $customerId,
            'customer_name' => $customer ? ($customer->name ?? $customer->email ?? "Customer #$customerId") : "Customer #$customerId",
            'last_message' => $lastMsg ? $lastMsg->message : null,
        ];
    }

    return response()->json($customers);
}
}
