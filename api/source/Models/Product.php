<?php

namespace Source\Models;

use PDOException;
use Source\Core\Connect;
use Source\Core\Model;

class Product extends Model
{
    private ?int $id;
    private ?int $categoryId;
    private ?string $sku;
    private ?string $name;
    private ?string $slug;
    private ?float $price;
    private ?string $image;
    private ?string $description;
    private ?int $stock;
    private ?int $isActive;

public function __construct(
    ?int $id = null,
    ?int $categoryId = null,
    ?string $sku = null,
    ?string $name = null,
    ?string $slug = null,
    ?float $price = null,
    ?string $image = null,
    ?string $description = null,
    ?int $stock = null,
    ?int $isActive = 1
)
{
    $this->id = $id;
    $this->categoryId = $categoryId;
    $this->sku = $sku;
    $this->name = $name;
    $this->slug = $slug;
    $this->price = $price;
    $this->image = $image;
    $this->description = $description;
    $this->stock = $stock;
    $this->isActive = $isActive;

    $this->table = 'products'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['categoryId', 'sku', 'name', 'slug', 'price', 'image', 'description', 'stock', 'isActive']; 
}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    public function setCategoryId(int $categoryId): void
    {
        $this->categoryId = $categoryId;
    }

    public function getSku(): ?string
    {
        return $this->sku;
    }

    public function setSku(string $sku): void
    {
        $this->sku = $sku;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): void
    {
        $this->slug = $slug;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): void
    {
        $this->image = $image;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): void
    {
        $this->stock = $stock;
    }

    public function getIsActive(): ?int
    {
        return $this->isActive;
    }

    public function setIsActive(int $isActive): void
    {
        $this->isActive = $isActive;
    }


    public function listAll (): array
    {
        $query = "SELECT products.*, products_categories.name as 'category_name'
                  FROM products
                  JOIN products_categories ON products.category_id = products_categories.id
                  WHERE products.is_active = 1";
        $stmt = Connect::getInstance()->query($query);
        return $stmt->fetchAll();
    }

    public function listById (int $id): object | false
    {
        $query = "SELECT * FROM products WHERE id = :id AND is_active = 1";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function update(array $data): bool
    {
        if (!isset($data["productId"])) {
            $this->errorMessage = "ID do produto é obrigatório";
            return false;
        }

        $productId = $data["productId"];

        // Hidrata o objeto com os dados fornecidos
        if (isset($data["category_id"])) {
            $this->setCategoryId($data["category_id"]);
        }
        if (isset($data["sku"])) {
            $this->setSku($data["sku"]);
        }
        if (isset($data["name"])) {
            $this->setName($data["name"]);
        }
        if (isset($data["slug"])) {
            $this->setSlug($data["slug"]);
        }
        if (isset($data["price"])) {
            $this->setPrice($data["price"]);
        }
        if (isset($data["image"])) {
            $this->setImage($data["image"]);
        }
        if (isset($data["description"])) {
            $this->setDescription($data["description"]);
        }
        if (isset($data["stock"])) {
            $this->setStock($data["stock"]);
        }
        if (isset($data["isActive"]) || isset($data["is_active"])) {
            $isActive = $data["isActive"] ?? $data["is_active"];
            $this->setIsActive($isActive);
        }

        // Chama o updateById herdado do Model
        return $this->updateById($productId);
    }

    private function performSoftDelete(int $id): bool
    {
        try {
            $query = "UPDATE {$this->table} SET is_active = 0 WHERE {$this->primaryKey} = :id";
            $stmt = Connect::getInstance()->prepare($query);
            $stmt->bindValue(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() < 1) {
                $this->errorMessage = "Registro não encontrado ou já inativo.";
                return false;
            }
            return true;

        } catch (PDOException $e) {
            $this->errorMessage = $e->getMessage();
            return false;
        }
    }

    public function delete(int $id): bool
    {
        return $this->deleteById($id);
    }

    public function softDeleteById(int $id): bool
    {
        return $this->performSoftDelete($id);
    }

}