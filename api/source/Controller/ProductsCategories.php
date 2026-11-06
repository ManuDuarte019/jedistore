<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\ProductCategory;

class ProductsCategories extends Api
{
    public function productsCategoryList ()
    {
        $productsCategories = new ProductCategory();
        $this->call(200,"success","Lista de Categorias de Produtos","success")->back($productsCategories->listAll());
    }
    public function productsCategoryListById (array $data):void
    {
        if(!filter_var($data['categoryId'], FILTER_VALIDATE_INT)){
            $this->call(
                400,
                "bad_request",
                "ID da categoria do produto é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        $productCategory = new ProductCategory();
        $productCategory = $productCategory->listById($data["categoryId"]);

        if (!$productCategory) {
            $this->call(
                404,
                "not_found",
                "Categoria não encontrada",
                "error"
            )->back();
            return;
        }

        $this->call(200,"success","Categoria encontrada","success")->back($productCategory);
    }

    public function productsCategoryCreate(array $data): void
    {
        if (empty(trim($data['name'])) || empty(trim($data['slug']))) {
            $this->call(
                400,
                "bad_request",
                "Os campos name e slug são obrigatórios",
                "error"
            )->back();
            return;
        }

        $productCategory = new ProductCategory(null, $data['name'], $data['slug']);

        if (!$productCategory->insert()) {
            $this->call(
                500,
                "internal_server_error",
                "Não foi possível cadastrar a categoria",
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $productCategory->getId(),
            "name" => $productCategory->getName(),
            "slug" => $productCategory->getSlug()
        ];

        $this->call(201,"success","Categoria de produto criada com sucesso","created")->back($response);
    }

    public function productsCategoryUpdate(array $data): void
    {
        if (!filter_var($data['categoryId'], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID da categoria do produto é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        if (empty(trim($data['name'])) || empty(trim($data['slug']))) {
            $this->call(
                400,
                "bad_request",
                "Os campos name e slug são obrigatórios",
                "error"
            )->back();
            return;
        }

        $productCategory = new ProductCategory(null, $data['name'], $data['slug']);

        if (!$productCategory->updateById($data['categoryId'])) {
            $this->call(
                404,
                "not_found",
                "Categoria não encontrada para atualização",
                "error"
            )->back();
            return;
        }

        $response = [
            "id" => $data['categoryId'],
            "name" => $data['name'],
            "slug" => $data['slug']
        ];

        $this->call(200,"success","Categoria atualizada com sucesso","success")->back($response);
    }

    public function productsCategoryDelete(array $data): void
    {
        if (!filter_var($data['categoryId'], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID da categoria do produto é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        $productCategory = new ProductCategory();

        if (!$productCategory->deleteById($data['categoryId'])) {
            $this->call(
                404,
                "not_found",
                "Categoria não encontrada para exclusão",
                "error"
            )->back();
            return;
        }

        $this->call(200,"success","Categoria removida com sucesso","success")->back();
    }
}