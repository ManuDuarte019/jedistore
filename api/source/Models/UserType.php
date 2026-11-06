<?php

namespace Source\Models;

use Source\Core\Connect;
use Source\Core\Model;

class UserType extends Model
{
    private ?int $id;
    private ?string $name;

    public function __construct(?int $id = null, ?string $name = null)
    {
        $this->id = $id;
        $this->name = $name;

        $this->table = 'user_types';
        $this->primaryKey = 'id';
        $this->fillable = ['name'];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function listAll(): array
    {
        $query = "SELECT * FROM user_types";
        $stmt = Connect::getInstance()->query($query);
        return $stmt->fetchAll();
    }

    public function listById(int $id): object|bool
    {
        if (!$this->selectById($id)) {
            return false;
        }

        return $this;
    }
}