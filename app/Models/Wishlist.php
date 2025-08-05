<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Wishlist
 *
 * @property int $id
 * @property int $user_id
 * @property int $product_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Product $product
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Wishlist newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Wishlist newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Wishlist query()
 * @method static \Database\Factories\WishlistFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Wishlist extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
    ];

    /**
     * Get the user that owns the wishlist item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that belongs to the wishlist item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}