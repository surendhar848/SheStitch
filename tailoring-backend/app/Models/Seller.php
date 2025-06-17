<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    protected $fillable = [
        'user_id', 'email', 'shop_name', 'shop_address', 'gst_number', 'photo_url', 'phone_number'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function portfolios()
{
    return $this->hasMany(Portfolio::class, 'seller_id');
}
}
