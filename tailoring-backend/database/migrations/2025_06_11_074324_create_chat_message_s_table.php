<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChatMessageSTable extends Migration
{
    public function up()
    {
        Schema::create('chat_message_s', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chat_id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('msg_type')->default('text');
            $table->text('message');
            $table->text('other_msg')->nullable();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedTinyInteger('sender_role_id');
            $table->unsignedBigInteger('receiver_id');
            $table->boolean('is_deleted')->default(false);
            $table->tinyInteger('read_status')->default(0);
            $table->string('chat_type')->nullable();
            $table->unsignedBigInteger('announcement_id')->nullable();
            $table->unsignedBigInteger('audio_story_id')->nullable();
            $table->unsignedBigInteger('post_id')->nullable();
            $table->timestamps();

            $table->foreign('chat_id')->references('id')->on('chat_s')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('chat_message_s');
    }
}
