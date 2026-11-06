<?php

namespace Source\Controller;

use Source\Models\OrderStatus;

class OrderStatuses extends Api
{
    public function orderStatusList(array $data): void
    {
        $orderStatus = new OrderStatus();
        $this->call(200, "success", "Lista de status de pedidos", "success")->back($orderStatus->listAll());
    }

    public function orderStatusById(array $data): void
    {
        if (!isset($data['statusId']) || !filter_var($data['statusId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID de status inválido", "error")->back();
            return;
        }

        $orderStatus = new OrderStatus();
        if (!$orderStatus->listById($data['statusId'])) {
            $this->call(404, "not_found", "Status não encontrado", "error")->back();
            return;
        }

        $this->call(200, "success", "Status encontrado", "success")->back($orderStatus);
    }

    public function orderStatusCreate(array $data): void
    {
        if (!isset($data['name']) || empty(trim($data['name']))) {
            $this->call(400, "bad_request", "O nome do status é obrigatório", "error")->back();
            return;
        }

        $orderStatus = new OrderStatus(null, trim($data['name']));
        if (!$orderStatus->insert()) {
            $this->call(500, "internal_server_error", $orderStatus->getErrorMessage(), "error")->back();
            return;
        }

        $response = [
            'id' => $orderStatus->getId(),
            'name' => $orderStatus->getName()
        ];

        $this->call(201, "created", "Status de pedido criado com sucesso", "success")->back($response);
    }

    public function orderStatusUpdate(array $data): void
    {
        if (!isset($data['statusId']) || !filter_var($data['statusId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID de status inválido", "error")->back();
            return;
        }

        if (!isset($data['name']) || empty(trim($data['name']))) {
            $this->call(400, "bad_request", "O nome do status é obrigatório", "error")->back();
            return;
        }

        $orderStatus = new OrderStatus();
        $orderStatus->setName(trim($data['name']));
        if (!$orderStatus->updateById($data['statusId'])) {
            $this->call(500, "internal_server_error", $orderStatus->getErrorMessage(), "error")->back();
            return;
        }

        $response = [
            'id' => $data['statusId'],
            'name' => trim($data['name'])
        ];

        $this->call(200, "success", "Status de pedido atualizado com sucesso", "success")->back($response);
    }

    public function orderStatusDelete(array $data): void
    {
        if (!isset($data['statusId']) || !filter_var($data['statusId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID de status inválido", "error")->back();
            return;
        }

        $orderStatus = new OrderStatus();
        if (!$orderStatus->deleteById($data['statusId'])) {
            $this->call(500, "internal_server_error", $orderStatus->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Status de pedido excluído com sucesso", "success")->back();
    }
}
