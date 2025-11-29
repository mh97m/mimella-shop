<?php

declare(strict_types=1);

use App\Models\User;

test('profile information can be updated', function (): void {
    $this->actingAs($user = User::factory()->create());

    $this->put('/user/profile-information', [
        'name' => 'Test Name',
        'mobile' => 'test@example.com',
    ]);

    expect($user->fresh())
        ->name->toEqual('Test Name')
        ->mobile->toEqual('test@example.com');
});
