<?php

namespace source\Controller;

use Source\Core\JWTToken;

class Api
{
    protected $response = [];
    protected $userAuthId = null;

    public function hello()
    {
        echo "Olá, mundo! Estamos com a API funcionando, graças a Deus!";
    }

    protected function call($code, $status = null, $message = null, $type = null)
    {
        http_response_code($code);
        if (!empty($status)) {
            $this->response = [
                "code" => $code,
                "type" => $type,
                "status" => $status,
                "message" => (!empty($message) ? $message : null)
            ];
        }
        return $this;
    }

    protected function back($data = null)
    {
        header('Content-Type: application/json');
        if ($data !== null) {
            $this->response["data"] = $data;
        }
        echo json_encode($this->response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $this;
    }

    protected function authToken($requiredType = 2)
    {
        $token = null;

        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        } elseif (function_exists('getallheaders') && !empty(getallheaders()['Authorization'])) {
            $token = str_replace('Bearer ', '', getallheaders()['Authorization']);
        } elseif (!empty($_GET['token'])) {
            $token = $_GET['token'];
        } elseif (!empty($_POST['token'])) {
            $token = $_POST['token'];
        }

        if (empty($token)) {
            return false;
        }

        $jwt = new JWTToken();
        $decoded = $jwt->decode($token);

        if ($decoded === false || !isset($decoded->data)) {
            return false;
        }

        $authData = is_object($decoded->data) ? get_object_vars($decoded->data) : $decoded->data;
        if (!is_array($authData)) {
            return false;
        }

        $this->userAuthId = (int)($authData['id'] ?? 0);

        if ($this->userAuthId <= 0) {
            return false;
        }

        if (!empty($requiredType) && isset($authData['type_id']) && (int)$authData['type_id'] !== (int)$requiredType) {
            return false;
        }

        return true;
    }
}