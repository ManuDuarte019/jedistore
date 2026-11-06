<?php

namespace source\Models;

use Source\Core\Connect;
use Source\Core\Model;

class ProductCategory extends Model
{
    private ?int $id;
    private ?string $name;
    private ?string $slug;

    public function __construct(?int $id = null, ?string $name = null, ?string $slug = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->slug = $slug;

        $this->table = 'products_categories'; // nome da tabela do banco
        $this->primaryKey = 'id';
        $this->fillable = ['name', 'slug'];
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): void
    {
        $this->slug = $slug;
    }

    public function listAll (): array
    {
        $query = "SELECT * FROM products_categories";
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