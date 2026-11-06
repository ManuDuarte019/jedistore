<?php

namespace Source\Models;

use Source\Core\Connect;
use Source\Core\Model;

class OrderItem extends Model
{
    private ?int $id;
    private ?int $orderId;
    private ?int $productId;
    private ?int $quantity;
    private ?float $unitPrice;

    public function __construct(
        ?int $id = null,
        ?int $orderId = null,
        ?int $productId = null,
        ?int $quantity = null,
        ?float $unitPrice = null
    ) {
        $this->id = $id;
        $this->orderId = $orderId;
        $this->productId = $productId;
        $this->quantity = $quantity;
        $this->unitPrice = $unitPrice;

        $this->table = 'order_items';
        $this->primaryKey = 'id';
        $this->fillable = ['orderId', 'productId', 'quantity', 'unitPrice'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getOrderId(): ?int
    {
        return $this->orderId;
    }

    public function setOrderId(?int $orderId): void
    {
        $this->orderId = $orderId;
    }

    public function getProductId(): ?int
    {
        return $this->productId;
    }

    public function setProductId(?int $productId): void
    {
        $this->productId = $productId;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(?int $quantity): void
    {
        $this->quantity = $quantity;
    }

    public function getUnitPrice(): ?float
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(?float $unitPrice): void
    {
        $this->unitPrice = $unitPrice;
    }

    public function listByOrderId(int $orderId): array
    {
        $query = "SELECT * FROM order_items WHERE order_id = :order_id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(':order_id', $orderId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
