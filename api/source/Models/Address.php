<?php

namespace Source\Models;

use source\Core\Connect;
use Source\Core\Model;

class Address extends Model
{
    private ?int $id = null;
    private ?int $userId = null;
    private ?string $zipcode = null;

    public function __construct(?int $id = null, ?int $userId = null,
                                ?string $zipcode = null)
    {
        $this->id = $id;
        $this->userId = $userId;
        $this->zipcode = $zipcode;

        $this->table = 'addresses'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['userId', 'zipcode']; // camelCase
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

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(?string $zipcode): void
    {
        $this->zipcode = $zipcode;
    }

    public function selectByUserId(int $userId): array
    {
        $query = "SELECT * FROM addresses WHERE user_id = :user_id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

}