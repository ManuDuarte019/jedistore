# 📁 api/

## O Back-End — A API REST em PHP

---

### 🎯 Para que serve esta pasta?

A pasta `api/` contém todo o **código do servidor** (back-end). Aqui é onde o PHP processa as
requisições vindas do front-end e retorna respostas, geralmente em formato **JSON**.

Esta pasta funciona como uma **API REST** — ou seja, ela **não gera HTML**. Ela apenas recebe
requisições e devolve dados, sendo assim, aqui é necessário esquecer que existe `echo` ou `var_dump` — tudo deve ser retornado em JSON.

---

### 📦 O que é uma API REST?

**API** (Application Programming Interface) é uma interface que permite a comunicação entre sistemas.

**REST** (Representational State Transfer) é um padrão que utiliza os métodos HTTP:

| Método HTTP | Ação no banco de dados | Exemplo                    |
|-------------|------------------------|----------------------------|
| `GET`       | **Ler** dados          | Buscar lista de usuários   |
| `POST`      | **Criar** dados        | Cadastrar um novo usuário  |
| `PUT`       | **Atualizar** dados    | Editar dados de um usuário |
| `DELETE`    | **Excluir** dados      | Remover um usuário         |

> 💡 Esses 4 métodos formam o famoso **CRUD** (Create, Read, Update, Delete).

---

### 📂 Estrutura desta pasta

```
api/
├── .htaccess        ← Configuração do Apache para URLs amigáveis
├── composer.json    ← Arquivo de configuração do Composer (dependências)
├── index.php        ← Front Controller — ponto de entrada de TODAS as requisições
├── vendor/          ← Bibliotecas instaladas pelo Composer (NÃO editar!)
└── source/          ← Código-fonte da API
```

---

### 🔑 Arquivos importantes

#### `index.php` — Front Controller
Este é o **ponto de entrada** da API. Toda requisição que chega ao servidor passa por aqui primeiro.
Ele é responsável por:
- Carregar o autoload do Composer
- Iniciar o roteamento (Router)
- Direcionar a requisição para o Controller correto

#### `.htaccess` — Reescrita de URL
Este arquivo configura o Apache para redirecionar **todas** as requisições para o `index.php`.
Por exemplo, ao acessar `api/usuarios`, o Apache reescreve internamente para `api/index.php?route=/usuarios`.

```apache
RewriteEngine On
RewriteCond %{SCRIPT_FILENAME} !-f
RewriteCond %{SCRIPT_FILENAME} !-d
RewriteRule ^(.*)$ index.php?route=/$1 [L,QSA]
```

#### `composer.json` — Gerenciador de Dependências
O Composer é o gerenciador de pacotes do PHP (similar ao `npm` do JavaScript).
Aqui definimos as dependências do projeto e o **autoload** das classes.

---

### 🔗 Relação com o MVC

```
index.php (Front Controller)
    ↓
Router (Core/Router.php) → identifica a rota
    ↓
Controller (Controller/Api.php) → processa a lógica
    ↓
Model (Models/User.php) → acessa o banco de dados
    ↓
Resposta JSON → enviada ao front-end
```

---

> 📚 Acesse a pasta `source/` para entender cada camada do MVC em detalhes.

---

### 🧭 Rotas implementadas

A API já expõe os endpoints abaixo. Todas as respostas são JSON e usam o formato padrão:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Mensagem de retorno",
  "data": {}
}
```

### Endpoints de usuários

- `POST /api/users/register`
  - Registra um usuário comum.
  - Body JSON: `name`, `email`, `password`.
  - Retorna `id`, `name`, `email`.

- `POST /api/users/login`
  - Faz login de usuário comum.
  - Body JSON: `email`, `password`.
  - Retorna `id`, `name`, `photo`, `token`.

- `PUT /api/users/update`
  - Atualiza o usuário autenticado.
  - Requer header `Authorization: Bearer <token>`.
  - Body JSON: campos a atualizar.

- `POST /api/users/register-admin`
  - Registra um administrador (`type_id = 1`).
  - Body JSON: `name`, `email`, `password`.
  - Retorna `id`, `name`, `email`.

- `POST /api/users/login-admin`
  - Faz login de admin.
  - Body JSON: `email`, `password`.
  - Retorna `id`, `name`, `photo`, `token`.

- `PUT /api/users/update-admin`
  - Atualiza o admin autenticado.
  - Requer header `Authorization: Bearer <token>`.
  - Body JSON: campos a atualizar.

- `GET /api/users/list`
  - Lista usuários (se implementado no controller).

### Endpoints de endereços

- `POST /api/addresses/register`
  - Cria um endereço para o usuário autenticado.
  - Requer `Authorization`.
  - Body JSON: `zipcode`.

- `PUT /api/addresses/update`
  - Atualiza endereço autenticado.
  - Requer `Authorization`.
  - Body JSON: `id`, `zipcode`.

- `GET /api/addresses/list`
  - Lista endereços do usuário autenticado.
  - Requer `Authorization`.

### Endpoints de pedidos

- `GET /api/orders/list`
  - Lista pedidos do usuário autenticado.
  - Requer `Authorization`.

- `GET /api/orders/list/{orderId}`
  - Retorna os dados de um pedido específico e seus itens.
  - Requer `Authorization`.

- `POST /api/orders/create`
  - Cria um pedido com itens.
  - Requer `Authorization`.
  - Body JSON mínimo: `addressId`, `subtotal`, `grandTotal`, `items`.
  - Exemplo de item:
    ```json
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 50.00
    }
    ```

- `PUT /api/orders/update`
  - Atualiza um pedido do usuário autenticado.
  - Requer `Authorization`.
  - Body JSON: `orderId` e campos a atualizar.

- `DELETE /api/orders/delete/{orderId}`
  - Exclui um pedido do usuário autenticado.
  - Requer `Authorization`.

### Endpoints de status de pedido

- `GET /api/order-statuses/list`
  - Lista todos os status de pedido.

- `GET /api/order-statuses/list/{statusId}`
  - Retorna um status específico.

- `POST /api/order-statuses/create`
  - Cria um novo status de pedido.
  - Body JSON: `name`.

- `PUT /api/order-statuses/update/{statusId}`
  - Atualiza o nome de um status.
  - Body JSON: `name`.

- `DELETE /api/order-statuses/delete/{statusId}`
  - Remove um status de pedido.

### Endpoints de tipos de usuário

- `GET /api/user-types/list`
  - Lista todos os tipos de usuário.

- `GET /api/user-types/list/{typeId}`
  - Retorna um tipo de usuário.

- `POST /api/user-types`
  - Cria um tipo de usuário.
  - Body JSON: `name`.

- `PUT /api/user-types/{typeId}`
  - Atualiza um tipo de usuário.
  - Body JSON: `name`.

- `DELETE /api/user-types/{typeId}`
  - Remove um tipo de usuário.

### Endpoints de produtos e categorias

- `GET /api/products/list`
  - Lista produtos ativos.

- `GET /api/products/list/{productId}`
  - Retorna um produto específico.

- `POST /api/products`
  - Cria um produto.

- `PUT /api/products/{productId}`
  - Atualiza um produto.

- `DELETE /api/products/{productId}`
  - Exclui um produto (soft delete).

- `GET /api/products-categories/list`
  - Lista categorias de produto.

- `GET /api/products-categories/list/{categoryId}`
  - Retorna uma categoria.

- `POST /api/products-categories`
  - Cria uma categoria.

- `PUT /api/products-categories/{categoryId}`
  - Atualiza uma categoria.

- `DELETE /api/products-categories/{categoryId}`
  - Remove uma categoria.

### Exemplo de resposta de erro

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Descrição do erro"
}
```

### Observações finais

- Use `Content-Type: application/json` em todas as requisições com corpo JSON.
- Para rotas protegidas, inclua `Authorization: Bearer <token>`.
- O retorno padrão sempre segue o mesmo formato de `code`, `type`, `status`, `message` e `data`.

