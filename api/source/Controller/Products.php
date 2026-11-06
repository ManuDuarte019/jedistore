<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\Product;

class Products extends Api
{

    public function productsList (array $data)
    {
        $product = new Product();
        $response = $product->listAll();

        $this->call("200","success","Lista de produtos","success"
        )->back($response);
    }

    public function productsListById (array $data): void
    {
        //var_dump($data);
        if(!filter_var($data["productId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do produto é obrigatório e deve ser um número inteiro",
                "error"
            )
                ->back(null);
            return;
        }

        $product = new Product();
        /*$this->call("200","success","Produto encontrado","success")
            ->back();*/
        $product = $product->listById($data["productId"]);
        if(!$product) {
            $this->call(
                404,
                "not_found",
                "Produto não encontrado",
                "error"
            )->back(null);
            return;
        }

        $this->call("200","success","Produto encontrado","success")
            ->back($product);
    }

    public function insert (array $data): void
    {
        if (!$this->authToken(1)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        if (!isset($data["category_id"]) || !isset($data["name"]) || !isset($data["price"]) ||
            empty($data["category_id"]) || trim($data["name"]) === '' || !is_numeric($data["price"])) {
            $this->call(
                400,
                "bad_request",
                "Os campos category_id, name e price são obrigatórios",
                "error"
            )->back();
            return;
        }

        $stock = ($data["stock"] ?? "") === "" ? 0 : (int)$data["stock"];

        $product = new Product(
            null,
            $data["category_id"],
            $data["sku"] ?? null,
            $data["name"],
            $data["slug"] ?? null,
            $data["price"],
            $data["image"] ?? null,
            $data["description"] ?? null,
            $stock,
            $data["isActive"] ?? $data["is_active"] ?? 1
        );
        
        if(!$product->insert()) {
            $this->call(
                500,
                "internal_server_error",
                "Erro ao inserir produto no banco de dados",
                "error"
            )->back();
            return;
        }


        
        $productData = [
            "id" => $product->getId(),
            "category_id" => $product->getCategoryId(),
            "sku" => $product->getSku(),
            "name" => $product->getName(),
            "slug" => $product->getSlug(),
            "price" => $product->getPrice(),
            "image" => $product->getImage(),
            "description" => $product->getDescription(),
            "stock" => $product->getStock(),
            "isActive" => $product->getIsActive()
        ];
        $this->call("201","created","Produto inserido com sucesso","success")
            ->back($productData);
    }

    public function update (array $data)
    {
       if (!$this->authToken(1)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        //echo "Atualizar produto ";
       // var_dump($data);

       if(!filter_var($data["productId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do produto é obrigatório e deve ser um número inteiro",
                "error"
            )
                ->back(null);
            return;
        }

        $product = new Product();

        if($product->update($data) === false) {
            $this->call(
                404,
                "not_found",
                "Produto não encontrado para atualização",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $data["productId"],
            "category_id" => $data["category_id"] ?? null,
            "sku" => $data["sku"] ?? null,
            "name" => $data["name"] ?? null,
            "slug" => $data["slug"] ?? null,
            "price" => $data["price"] ?? null,
            "image" => $data["image"] ?? null,
            "description" => $data["description"] ?? null,
            "stock" => $data["stock"] ?? null,
            "isActive" => $data["isActive"] ?? $data["is_active"] ?? null
        ];
        $this->call(
            200,
            "success",
            "Produto atualizado com sucesso",
            "success"
            )->back($response);

    }

    public function delete (array $data)
    {
        if (!$this->authToken(1)) {
            $this->call(401, "unauthorized", "Acesso negado", "error")->back();
            return;
        }

        //echo "Deletar produto ";
        //var_dump($data);

        if(!filter_var($data["productId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do produto é obrigatório e deve ser um número inteiro",
                "error"
            )
                ->back();
            return;
        }

        $product = new Product();

        if($product->delete($data["productId"]) === false) {
            $errorMessage = (string)$product->getErrorMessage();
            $isReferencedByOrder = str_contains($errorMessage, "23000") || stripos($errorMessage, "foreign key") !== false;
            $this->call(
                $isReferencedByOrder ? 409 : 404,
                $isReferencedByOrder ? "conflict" : "not_found",
                $isReferencedByOrder
                    ? "Este produto está vinculado a um pedido e não pode ser excluído."
                    : "Produto não encontrado para exclusão",
                "error"
            )->back();
            return;
        }

        $this->call(
            200,
            "success",
            "Produto deletado com sucesso",
            "success"
        )->back();

    }

}