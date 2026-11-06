<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
// timezone para São Paulo América
date_default_timezone_set('America/Sao_Paulo');

ob_start();

require  __DIR__ . "/vendor/autoload.php";

// os headers abaixo são necessários para permitir o acesso a API por clientes externos ao domínio
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Credentials: true'); // Permitir credenciais

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use CoffeeCode\Router\Router;
// localhost/acme-3am/api
$route = new Router(url("api"),":");

$route->namespace("source\Controller");
// localhost/acme-3am/api/hello

// ============= PRODUCTS ================

$route->get("/hello", "Api:hello");
$route->get("/products/list", "Products:productsList");
$route->get("/products/list/{productId}","Products:productsListById");
$route->post("/products","Products:insert"); // insert
$route->put("/products/{productId}","Products:update");
$route->delete("/products/{productId}","Products:delete");

// ============= PRODUCTS CATEGORIES ================

$route->get("/products-categories/list", "ProductsCategories:productsCategoryList");
$route->get("/products-categories/list/{categoryId}", "ProductsCategories:productsCategoryListById");
$route->post("/products-categories", "ProductsCategories:productsCategoryCreate");
$route->put("/products-categories/{categoryId}", "ProductsCategories:productsCategoryUpdate");
$route->delete("/products-categories/{categoryId}", "ProductsCategories:productsCategoryDelete");

// ============= USER TYPES ================

$route->get("/user-types/list", "UserTypes:userTypesList");
$route->get("/user-types/list/{typeId}", "UserTypes:userTypesListById");
$route->post("/user-types", "UserTypes:userTypesCreate");
$route->put("/user-types/{typeId}", "UserTypes:userTypesUpdate");
$route->delete("/user-types/{typeId}", "UserTypes:userTypesDelete");
$route->get("/users/list", "Users:usersList");

/* ============== FAQS ================*/
$route->get("/faqs-categories/list", "Faqs\FaqsCategories:faqsCategoryList");
$route->get("/faqs-categories/list/{categoryId}", "Faqs\FaqsCategories:faqsCategoryListById");

$route->get("/faqs/list", "Faqs\Faqs:faqsListAll");
$route->get("/faqs/list/{faqId}", "Faqs\Faqs:faqsListById");

$route->post("/faqs-categories/create", "Faqs\FaqsCategories:faqsCategoriesCreate");
$route->post("/faqs/insert", "Faqs\Faqs:faqInsert");

$route->put("/faqs/update/{faqId}", "Faqs\Faqs:faqUpdate");
$route->put("/faqs-categories/update/{categoryId}", "Faqs\FaqsCategories:faqCategoryUpdate");

$route->delete("/faqs/{faqId}", "Faqs\Faqs:faqDelete");
$route->delete("/faqs-categories/{categoryId}", "Faqs\FaqsCategories:faqCategoryDelete");

// ============= ADDRESSES ================
$route->group("/addresses");
$route->post("/register","Addresses:register"); // Registrar endereço
$route->put("/update","Addresses:update"); // update de endereço
$route->get("/list","Addresses:selectByUser"); // listar endereços do usuário
$route->group(null);

// ============= USERS ================
$route->group("/users");
$route->post("/register","Users:register"); // Registrar usuário comum
$route->post("/login","Users:auth"); // login de usuário comum
$route->put("/update","Users:update"); // update de usuário comum
$route->post("/register-admin","Users:registerAdmin"); // Registrar usuário admin
$route->post("/login-admin","Users:authAdmin"); // login de usuário admin
$route->put("/update-admin","Users:updateAdmin"); // update de usuário admin
$route->group(null);

// ============= ORDERS ================
$route->group("/orders");
$route->get("/list", "Orders:orderList");
$route->get("/list/{orderId}", "Orders:orderById");
$route->post("/create", "Orders:orderCreate");
$route->put("/update", "Orders:orderUpdate");
$route->delete("/delete/{orderId}", "Orders:orderDelete");
$route->group(null);

// ============= ORDER STATUS ================
$route->group("/order-statuses");
$route->get("/list", "OrderStatuses:orderStatusList");
$route->get("/list/{statusId}", "OrderStatuses:orderStatusById");
$route->post("/create", "OrderStatuses:orderStatusCreate");
$route->put("/update/{statusId}", "OrderStatuses:orderStatusUpdate");
$route->delete("/delete/{statusId}", "OrderStatuses:orderStatusDelete");
$route->group(null);


$route->dispatch();

/** ERROR REDIRECT */
if ($route->error()) {
    header('Content-Type: application/json; charset=UTF-8');
    //http_response_code(404);

    echo json_encode([
        "code" => 404,
        "status" => "not_found",
        "message" => "URL não encontrada"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

}

ob_end_flush();