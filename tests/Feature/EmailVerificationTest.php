<?php

declare(strict_types=1);

use App\Models\User;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;

test('mobile verification screen can be rendered', function (): void {
    $user = User::factory()->withPersonalTeam()->create([
        'mobile_verified_at' => null,
    ]);

    $response = $this->actingAs($user)->get('/mobile/verify');

    $response->assertStatus(200);
})->skip(fn (): bool => ! Features::enabled(Features::emailVerification()), 'Mobile verification not enabled.');

test('mobile can be verified', function (): void {
    Event::fake();

    $user = User::factory()->create([
        'mobile_verified_at' => null,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->mobile)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    Event::assertDispatched(Verified::class);

    expect($user->fresh()->hasVerifiedMobile())->toBeTrue();
    $response->assertRedirect(route('dashboard', absolute: false).'?verified=1');
})->skip(fn (): bool => ! Features::enabled(Features::emailVerification()), 'Mobile verification not enabled.');

test('mobile can not verified with invalid hash', function (): void {
    $user = User::factory()->create([
        'mobile_verified_at' => null,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-mobile')]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedMobile())->toBeFalse();
})->skip(fn (): bool => ! Features::enabled(Features::emailVerification()), 'Mobile verification not enabled.');
