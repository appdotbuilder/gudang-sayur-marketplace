<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->json('images')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('sold_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('category_id');
            $table->index('is_active');
            $table->index('rating');
            $table->index('sold_count');
            $table->index(['is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};