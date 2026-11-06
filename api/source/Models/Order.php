<?php

namespace Source\Models;

use Source\Core\Connect;
use Source\Core\Model;

class Order extends Model
{
    private ?int $id;
    private ?int $userId;
    private ?int $addressId;
    private ?int $currentStatusId;
    private ?float $subtotal;
    private ?float $grandTotal;
    private ?float $shippingTotal;
    private ?string $createdAt;

    public function __construct(
        ?int $id = null,
        ?int $userId = null,
        ?int $addressId = null,
        ?int $currentStatusId = null,
        ?float $subtotal = null,
        ?float $grandTotal = null,
        ?float $shippingTotal = null
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->addressId = $addressId;
        $this->currentStatusId = $currentStatusId;
        $this->subtotal = $subtotal;
        $this->grandTotal = $grandTotal;
        $this->shippingTotal = $shippingTotal;

        $this->table = 'orders';
        $this->primaryKey = 'id';
        $this->fillable = ['userId', 'addressId', 'currentStatusId', 'subtotal', 'grandTotal', 'shippingTotal'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): void
    {
        $this->userId = $userId;
    }

    public function getAddressId(): ?int
    {
        return $this->addressId;
    }

    public function setAddressId(?int $addressId): void
    {
        $this->addressId = $addressId;
    }

    public function getCurrentStatusId(): ?int
    {
        return $this->currentStatusId;
    }

    public function setCurrentStatusId(?int $currentStatusId): void
    {
        $this->currentStatusId = $currentStatusId;
    }

    public function getSubtotal(): ?float
    {
        return $this->subtotal;
    }

    public function setSubtotal(?float $subtotal): void
    {
        $this->subtotal = $subtotal;
    }

    public function getGrandTotal(): ?float
    {
        return $this->grandTotal;
    }

    public function setGrandTotal(?float $grandTotal): void
    {
        $this->grandTotal = $grandTotal;
    }

    public function getShippingTotal(): ?float
    {
        return $this->shippingTotal;
    }

    public function setShippingTotal(?float $shippingTotal): void
    {
        $this->shippingTotal = $shippingTotal;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?string $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function listAllByUser(int $userId): array
    {
        $query = "SELECT o.*, os.name AS status_name
                  FROM orders o
                  JOIN order_statuses os ON o.current_status_id = os.id
                  WHERE o.user_id = :user_id
                  ORDER BY o.created_at DESC";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listById(int $id): object|false
    {
        if (!$this->selectById($id)) {
            return false;
        }
        return $this;
    }
}
