<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\UserType;

class UserTypes extends Api
{
    public function userTypesList()
    {
        $userTypes = new UserType();
        $this->call(200, "success", "Lista de tipos de usuário", "success")->back($userTypes->listAll());
    }

    public function userTypesListById(array $data): void
    {
        if (!filter_var($data['typeId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID do tipo é obrigatório e deve ser um número inteiro", "error")->back();
            return;
        }

        $userType = new UserType();
        $userType = $userType->listById($data['typeId']);

        if (!$userType) {
            $this->call(404, "not_found", "Tipo de usuário não encontrado", "error")->back();
            return;
        }

        $this->call(200, "success", "Tipo encontrado", "success")->back($userType);
    }

    public function userTypesCreate(array $data): void
    {
        if (empty(trim($data['name'] ?? ''))) {
            $this->call(400, "bad_request", "O campo name é obrigatório", "error")->back();
            return;
        }

        $userType = new UserType(null, $data['name']);

        if (!$userType->insert()) {
            $this->call(500, "internal_server_error", "Não foi possível cadastrar o tipo", "error")->back();
            return;
        }

        $response = [
            'id' => $userType->getId(),
            'name' => $userType->getName()
        ];

        $this->call(201, "created", "Tipo criado com sucesso", "success")->back($response);
    }

    public function userTypesUpdate(array $data): void
    {
        if (!filter_var($data['typeId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID do tipo é obrigatório e deve ser um número inteiro", "error")->back();
            return;
        }

        if (empty(trim($data['name'] ?? ''))) {
            $this->call(400, "bad_request", "O campo name é obrigatório", "error")->back();
            return;
        }

        $userType = new UserType(null, $data['name']);

        if (!$userType->updateById($data['typeId'])) {
            $this->call(404, "not_found", "Tipo não encontrado para atualização", "error")->back();
            return;
        }

        $response = [
            'id' => $data['typeId'],
            'name' => $data['name']
        ];

        $this->call(200, "success", "Tipo atualizado com sucesso", "success")->back($response);
    }

    public function userTypesDelete(array $data): void
    {
        if (!filter_var($data['typeId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID do tipo é obrigatório e deve ser um número inteiro", "error")->back();
            return;
        }

        $userType = new UserType();

        if (!$userType->deleteById($data['typeId'])) {
            $this->call(404, "not_found", "Tipo não encontrado para exclusão", "error")->back();
            return;
        }

        $this->call(200, "success", "Tipo excluído com sucesso", "success")->back();
    }
}
