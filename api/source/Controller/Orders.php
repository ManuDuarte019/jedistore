<?php

namespace Source\Controller;

use Source\Models\Order;
use Source\Models\OrderItem;

class Orders extends Api
{
    public function orderList(array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        $order = new Order();
        $this->call(200, "success", "Lista de pedidos", "success")
            ->back($order->listAllByUser($this->userAuthId));
    }

    public function orderById(array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        if (!isset($data['orderId']) || !filter_var($data['orderId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID do pedido inválido", "error")->back();
            return;
        }

        $order = new Order();
        if (!$order->selectById($data['orderId'])) {
            $this->call(404, "not_found", "Pedido não encontrado", "error")->back();
            return;
        }

        if ($order->getUserId() !== $this->userAuthId) {
            $this->call(403, "forbidden", "Acesso negado ao pedido", "error")->back();
            return;
        }

        $items = (new OrderItem())->listByOrderId($order->getId());
        $response = [
            'order' => $order,
            'items' => $items
        ];

        $this->call(200, "success", "Pedido encontrado", "success")->back($response);
    }

    public function orderCreate(array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        if (empty($data['addressId']) || empty($data['subtotal']) || empty($data['grandTotal'])) {
            $this->call(400, "bad_request", "Os campos addressId, subtotal e grandTotal são obrigatórios", "error")->back();
            return;
        }

        $order = new Order(
            null,
            $this->userAuthId,
            $data['addressId'],
            $data['currentStatusId'] ?? 1,
            (float)$data['subtotal'],
            (float)$data['grandTotal'],
            isset($data['shippingTotal']) ? (float)$data['shippingTotal'] : 0.00
        );

        if (!$order->insert()) {
            $this->call(500, "internal_server_error", $order->getErrorMessage(), "error")->back();
            return;
        }

        if (!empty($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $itemData) {
                if (empty($itemData['productId']) || empty($itemData['quantity']) || empty($itemData['unitPrice'])) {
                    continue;
                }

                $item = new OrderItem(
                    null,
                    $order->getId(),
                    $itemData['productId'],
                    $itemData['quantity'],
                    (float)$itemData['unitPrice']
                );

                if (!$item->insert()) {
                    $this->call(500, "internal_server_error", "Erro ao salvar item do pedido: {$item->getErrorMessage()}", "error")->back();
                    return;
                }
            }
        }

        $this->call(201, "created", "Pedido criado com sucesso", "success")->back([
            'orderId' => $order->getId()
        ]);
    }

    public function orderUpdate(array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        if (!isset($data['orderId']) || !filter_var($data['orderId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID do pedido inválido", "error")->back();
            return;
        }

        $order = new Order();
        if (!$order->selectById($data['orderId'])) {
            $this->call(404, "not_found", "Pedido não encontrado", "error")->back();
            return;
        }

        if ($order->getUserId() !== $this->userAuthId) {
            $this->call(403, "forbidden", "Acesso negado ao pedido", "error")->back();
            return;
        }

        if (isset($data['addressId'])) {
            $order->setAddressId((int)$data['addressId']);
        }
        if (isset($data['currentStatusId'])) {
            $order->setCurrentStatusId((int)$data['currentStatusId']);
        }
        if (isset($data['subtotal'])) {
            $order->setSubtotal((float)$data['subtotal']);
        }
        if (isset($data['grandTotal'])) {
            $order->setGrandTotal((float)$data['grandTotal']);
        }
        if (isset($data['shippingTotal'])) {
            $order->setShippingTotal((float)$data['shippingTotal']);
        }

        if (!$order->updateById($data['orderId'])) {
            $this->call(500, "internal_server_error", $order->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Pedido atualizado com sucesso", "success")->back();
    }

    public function orderDelete(array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        if (!isset($data['orderId']) || !filter_var($data['orderId'], FILTER_VALIDATE_INT)) {
            $this->call(400, "bad_request", "ID do pedido inválido", "error")->back();
            return;
        }

        $order = new Order();
        if (!$order->selectById($data['orderId'])) {
            $this->call(404, "not_found", "Pedido não encontrado", "error")->back();
            return;
        }

        if ($order->getUserId() !== $this->userAuthId) {
            $this->call(403, "forbidden", "Acesso negado ao pedido", "error")->back();
            return;
        }

        if (!$order->deleteById($data['orderId'])) {
            $this->call(500, "internal_server_error", $order->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200, "success", "Pedido excluído com sucesso", "success")->back();
    }

}
