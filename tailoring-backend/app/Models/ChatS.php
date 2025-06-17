<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatS extends Model
{
    protected $table = 'chat_s';

    protected $fillable = [
        'created_by', 'sender_id', 'receiver_id', 'sender_role_id', 'is_deleted'
    ];

    public function messages()
    {
        return $this->hasMany(ChatMessageS::class, 'chat_id');
    }
}
