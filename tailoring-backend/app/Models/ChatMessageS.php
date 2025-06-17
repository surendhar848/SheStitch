<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessageS extends Model
{
    protected $table = 'chat_message_s';

    protected $fillable = [
        'chat_id', 'parent_id', 'msg_type', 'message', 'other_msg',
        'sender_id', 'sender_role_id', 'receiver_id',
        'is_deleted', 'read_status', 'chat_type',
        'announcement_id', 'audio_story_id', 'post_id'
    ];

    public function chat()
    {
        return $this->belongsTo(ChatS::class, 'chat_id');
    }
}
