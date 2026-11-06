<?php

namespace Source\Core;

use DateTimeImmutable;
use Exception;

class JWTToken
{
    private $secretKey = JWT_SECRET_KEY;
    private $headerJWT = "HS256";
    private $url = CONF_URL_BASE;

    public function encode(array $payLoad): string
    {
        $issuedAt = new DateTimeImmutable();
        $expire = $issuedAt->modify('+90 minutes')->getTimestamp();

        $data = [
            'iat' => $issuedAt->getTimestamp(),
            'iss' => $this->url,
            'exp' => $expire,
            'data' => $payLoad
        ];

        $header = $this->base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = $this->base64UrlEncode(json_encode($data));
        $signature = $this->base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, $this->secretKey, true));

        return $header . '.' . $payload . '.' . $signature;
    }

    public function decode($token): bool | object
    {
        try {
            if (!is_string($token) || substr_count($token, '.') !== 2) {
                return false;
            }

            [$header, $payload, $signature] = explode('.', $token);
            $expectedSignature = $this->base64UrlEncode(hash_hmac('sha256', $header . '.' . $payload, $this->secretKey, true));

            if (!hash_equals($expectedSignature, $signature)) {
                return false;
            }

            $payloadData = json_decode($this->base64UrlDecode($payload));
            if (!is_object($payloadData)) {
                return false;
            }

            $now = time();
            if (($payloadData->iss ?? null) !== $this->url || ($payloadData->exp ?? 0) < $now) {
                return false;
            }

            return $payloadData;
        } catch (Exception) {
            return false;
        }
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
}