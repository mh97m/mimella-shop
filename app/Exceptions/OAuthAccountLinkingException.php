<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class OAuthAccountLinkingException extends Exception
{
    public const string EXISTING_CONNECTION_ERROR_MESSAGE = 'Please login with your existing authentication method.';

    public static function mobileMismatch(string $provider): self
    {
        return new self(__('The mobile address from this :provider does not match your account mobile.', ['provider' => $provider]));
    }

    public static function existingConnection(): self
    {
        return new self(self::EXISTING_CONNECTION_ERROR_MESSAGE);
    }
}
