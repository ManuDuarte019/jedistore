# 📁 ACME - Projeto Didático MVC

## Programação Web II — Técnico em Informática

---

### 🎯 Objetivo do Projeto

Este projeto tem como objetivo ensinar o padrão de arquitetura **MVC (Model-View-Controller)** utilizando
**PHP** no back-end e **HTML, CSS e JavaScript** no front-end.

---

### 🧱 O que é MVC?

O **MVC** é um padrão de arquitetura de software que separa a aplicação em três camadas principais:

| Camada         | Responsabilidade                                                                 |
|----------------|----------------------------------------------------------------------------------|
| **Model**      | Representa os dados e as regras de negócio. Faz a comunicação com o banco de dados. |
| **View**       | É a interface do usuário. Tudo que o usuário vê (HTML, CSS, JS).                 |
| **Controller** | Recebe as requisições, processa a lógica e decide qual resposta enviar.          |

```
Usuário → [View] → [Controller] → [Model] → Banco de Dados
                                      ↓
                              Resposta ao Usuário
```

---

### 📂 Estrutura de Pastas do Projeto

```
acme-3am-g1/
│
├── index.html          ← Página inicial (ponto de entrada do front-end)
├── README.MD           ← Este arquivo (documentação geral do projeto)
│
├── api/                ← Back-end: API REST em PHP (onde mora o MVC)
│   ├── index.php       ← Ponto de entrada da API (Front Controller)
│   ├── .htaccess       ← Reescrita de URLs amigáveis (Apache)
│   ├── composer.json   ← Gerenciador de dependências PHP
│   ├── vendor/         ← Bibliotecas de terceiros (autoload do Composer)
│   └── source/         ← Código-fonte organizado em MVC
│       ├── Config/     ← Configurações (banco de dados, constantes, etc.)
│       ├── Controller/ ← Controllers — lógica das rotas da API
│       ├── Core/       ← Núcleo do sistema (conexão com BD, roteador)
│       ├── Models/     ← Models — representação das tabelas do banco
│       └── Support/    ← Funções auxiliares (helpers)
│
├── data-base/          ← Scripts SQL para criação do banco de dados
│
├── storage/            ← Armazenamento de arquivos (uploads, logs, etc.)
│
└── views/              ← Front-end: Interfaces do usuário
    └── assets/         ← Recursos estáticos (CSS, JS, imagens)
        ├── _common/    ← Recursos compartilhados entre todas as views
        ├── admin/      ← Recursos do painel administrativo
        ├── app/        ← Recursos da área logada (aplicação)
        └── public/     ← Recursos da área pública (visitante)
```

---

### 🚀 Como funciona o fluxo?

1. O **usuário** acessa a página pelo navegador (`index.html` ou uma view).
2. O **JavaScript** do front-end faz requisições para a **API** (`api/`).
3. O **Router** (`Core/Router.php`) recebe a URL e direciona para o **Controller** correto.
4. O **Controller** (`Controller/Api.php`) processa a requisição e consulta o **Model**.
5. O **Model** (`Models/User.php`) busca ou salva dados no **banco de dados**.
6. A resposta é enviada em **JSON** de volta ao front-end.
7. O **JavaScript** atualiza a tela com os dados recebidos.

---

### 📚 Tecnologias Utilizadas

| Tecnologia   | Uso                              |
|--------------|----------------------------------|
| **PHP**      | Back-end (API REST com MVC)      |
| **HTML**     | Estrutura das páginas            |
| **CSS**      | Estilização das páginas          |
| **JavaScript** | Interatividade e consumo da API |
| **MySQL**    | Banco de dados relacional        |
| **Composer** | Gerenciador de dependências PHP  |
| **Apache**   | Servidor web com reescrita de URL|

---

> 💡 **Dica:** Cada pasta possui seu próprio `README.MD` com explicações detalhadas.
> Navegue pelas pastas para aprender mais sobre cada parte do projeto!

---

## SE2 — Etapa 05: integração frontend e backend

O frontend usa `HttpClientBase` para todas as requisições e a API local em
`http://localhost/jedi_pw/api`. As respostas são lidas no formato `data` e
respostas HTTP de erro exibem a mensagem retornada pelo backend.

### Autenticação e sessão

| Fluxo | Método e rota | Resultado |
|---|---|---|
| Cadastro | `POST /users/register` | Cria usuário comum; não armazena senha nem cria sessão |
| Login | `POST /users/login` | Salva `data.token` em `running_power_token` |
| Login administrativo | `POST /users/login-admin` | Salva sessão administrativa em `running_power_admin_token` |
| Logout | ação `data-logout` | Remove token e usuário do `localStorage` |

A tela administrativa exige sessão local e o backend exige token de
administrador nas operações de escrita. A sessão local não substitui a
validação do JWT no backend.

### CRUD integrado

| Operação | Método e rota | Tela |
|---|---|---|
| Listar produtos | `GET /products/list` | `views/assets/admin/products.html` |
| Detalhar produto | `GET /products/list/{productId}` | Edição |
| Cadastrar produto | `POST /products` | Formulário de produtos |
| Editar produto | `PUT /products/{productId}` | Formulário de produtos |
| Excluir produto | `DELETE /products/{productId}` | Botão de exclusão; remove do banco se não houver pedido relacionado |
| Listar categorias relacionadas | `GET /products-categories/list` | API disponível |
| Listar FAQs relacionadas | `GET /faqs/list` e `GET /faqs-categories/list` | FAQ pública |

Fluxo demonstrado: cadastro → login → token no `Authorization: Bearer` →
acesso ao CRUD protegido → logout. A interface também mostra carregamento,
lista vazia, sucesso e erro sem recarregar a página.

## SE2 — Etapa 06: JavaScript orientado a objetos

### Arquitetura

As entidades JavaScript ficam em `views/assets/_common/classes/`. Elas modelam
os atributos das tabelas e usam construtores, campos privados, getters/setters,
validações e `toJSON()`. Exemplos usados nos fluxos atuais: `Users`, `Products`
e `Faqs`.

Os serviços herdam de `HttpClientBase`, que centraliza as chamadas assíncronas
`get`, `post`, `put`, `delete`, a conversão para `FormData`/`URLSearchParams`,
o cabeçalho de autorização e o tratamento de erros. Os métodos de serviço que
chamam rotas são `async` e retornam a Promise da requisição.

O fluxo de dados é:

```text
Tela HTML → serviço JavaScript → HttpClientBase → rota real da API
        ← resposta JSON ← Controller PHP ← Model PHP ← MySQL
```

O CRUD integrado às telas está disponível para produtos e FAQs. A tela de pedidos
faz somente a listagem dos pedidos pertencentes ao usuário autenticado, usando
`GET /orders/list`. Os serviços de categorias de produtos, categorias de FAQ,
status de pedido, tipos de usuário, endereços e pedidos também têm wrappers para
rotas existentes, mas isso não significa que todos tenham tela CRUD integrada.
Não existem rotas de API próprias para pagamentos, favoritos ou assinaturas.

### Conceitos de POO

**Encapsulamento:** em `Products.js`, atributos como `#name` e `#price` são
privados. A tela não acessa esses campos diretamente; getters e setters controlam
o acesso, e os setters podem validar valores. `Users.js` segue o mesmo padrão.

**Herança:** `Products`, `Users` e `Faqs` estendem `HttpClientBase` e chamam
`super()` no construtor. Assim, reutilizam o cliente HTTP sem duplicar a
implementação de `fetch`. Por exemplo, `Products.update()` encaminha os dados
para `putForm()` herdado.

**Composição:** `AuthGuard` cria um `SessionStorage` e o mantém em
`this.storage`. O guard usa esse componente para consultar ou limpar a sessão;
um objeto é composto pelo uso de outro objeto com responsabilidade própria.

**Protótipos:** em `Toast.js`, `Toast` e `ApiMessageAdapter` são criados com
`Object.create`. Os objetos derivados reaproveitam os métodos pelo protótipo:

```js
const toastA = Object.create(Toast);
const toastB = Object.create(Toast);
console.log(toastA !== toastB); // true
console.log(Object.getPrototypeOf(toastA) === Object.getPrototypeOf(toastB)); // true
console.log("show" in toastA, Object.hasOwn(toastA, "show")); // true, false
```

`Toast.show()` apresenta os tipos `success`, `warning` e `error`. O login e o
cadastro usam sucesso/erro; o painel de produtos e o painel de FAQ mostram
carregamento, sucesso e erro nas operações correspondentes. O tipo `warning`
está implementado no Toast, mas não é disparado automaticamente por essas telas.

### CRUD e evidências

| Entidade/tela | Evidência no Network | Resultado esperado |
|---|---|---|
| Produtos — listar | `GET /api/products/list` | `200`; tabela atualizada |
| Produtos — detalhe | `GET /api/products/list/{productId}` | `200`; formulário preenchido ao editar |
| Produtos — criar | `POST /api/products` | `201`; novo produto aparece na lista e no banco |
| Produtos — editar | `PUT /api/products/{productId}` | `200`; alterações aparecem na lista e no banco |
| Produtos — excluir | `DELETE /api/products/{productId}` | `200`; remove fisicamente se não houver pedido relacionado |
| FAQ — listar | `GET /api/faqs/list` e `GET /api/faqs-categories/list` | `200`; perguntas e opções de categoria carregadas |
| FAQ — detalhe | `GET /api/faqs/list/{faqId}` | `200`; formulário preenchido ao editar |
| FAQ — criar | `POST /api/faqs/insert` | `201`; pergunta aparece na lista pública/admin |
| FAQ — editar | `PUT /api/faqs/update/{faqId}` | `200`; pergunta atualizada |
| FAQ — excluir | `DELETE /api/faqs/{faqId}` | `200`; pergunta fica inativa (`active = 0`) |
| Pedidos — listar | `GET /api/orders/list` | `200`; apenas pedidos do usuário do token |

As operações de escrita em produtos e FAQs exigem sessão administrativa. O FAQ
é uma exclusão lógica; produto é exclusão física, mas o banco pode impedir se o
produto já estiver referenciado por um item de pedido.

#### Preparar a execução

1. Inicie Apache e MySQL pelo WampServer.
2. Confira em `api/source/Config/Config.php` a conexão esperada: host `localhost`,
  banco `storejedi`, usuário `root`, porta `3306` e senha vazia (ajuste ao seu
  ambiente, se necessário).
3. Se o banco ainda não existir, importe `data-base/dmp.sql` pelo phpMyAdmin.
  **Atenção:** o script começa com `DROP DATABASE`; importar novamente apaga e
  recria o banco. Não o execute sobre dados que queira preservar.
4. Acesse pelo Apache, por exemplo `http://localhost/jedi_pw/`. Não abra as
  páginas com `file://`, pois os módulos JavaScript precisam do servidor.
5. Para escrever em Produtos ou FAQ, entre com uma conta admin. As telas usam a
  sessão admin e o backend valida o JWT.

#### Evidência do CRUD de produtos

1. Entre como admin e abra `http://localhost/jedi_pw/views/assets/admin/products.html`.
2. Abra as ferramentas do navegador com **F12 → Rede → Fetch/XHR** e recarregue.
  Clique na requisição `list` para ver `GET /api/products/list` e status `200`.
3. Preencha categoria existente, nome, SKU único, slug único e preço. Clique em
  **Salvar produto**; confira `POST /api/products` com status `201`.
4. Clique em **Editar**, altere um campo e salve. Confira o `GET` do detalhe e o
  `PUT /api/products/{productId}` com status `200`.
5. Clique em **Excluir** e confirme. Confira o `DELETE /api/products/{productId}`.
  Confirme no phpMyAdmin com `SELECT id, name, sku FROM products WHERE sku =
  'SEU-SKU';`; se a exclusão foi permitida, não deve retornar o produto.

#### Evidência do CRUD de FAQ

1. Entre como admin e abra `http://localhost/jedi_pw/views/assets/admin/faq.html`.
2. Em **Rede → Fetch/XHR**, confirme `GET /api/faqs/list` e
  `GET /api/faqs-categories/list` com status `200`.
3. Clique em **Nova pergunta**, selecione uma categoria, preencha pergunta e
  resposta e clique em **Salvar pergunta**. Confira `POST /api/faqs/insert`
  com status `201`.
4. Clique em **Editar**, altere a pergunta e salve. Confira
  `GET /api/faqs/list/{faqId}` e `PUT /api/faqs/update/{faqId}`.
5. Clique em **Excluir** e confirme. Confira `DELETE /api/faqs/{faqId}`; a FAQ
  deixa de aparecer por ficar com `active = 0`, mas sua linha permanece no banco.

#### Evidência da listagem de pedidos

1. Entre com uma conta de cliente e abra
  `http://localhost/jedi_pw/views/assets/app/orders.html`.
2. Em **Rede → Fetch/XHR**, confirme `GET /api/orders/list` com status `200`.
3. A tabela exibe somente os pedidos associados ao usuário autenticado, com
  número, status, subtotal, frete, total e data. Sem pedidos, mostra uma
  mensagem de lista vazia; sem sessão ou com token expirado, pede novo login.

#### Evidência dos protótipos

Abra uma página do projeto servida pelo Apache, pressione **F12 → Console** e
execute:

```js
const { Toast, ApiMessageAdapter } = await import(
  "/jedi_pw/views/assets/_common/classes/Toast.js"
);
const toastA = Object.create(Toast);
const toastB = Object.create(Toast);
console.log(toastA !== toastB);
console.log(Object.getPrototypeOf(toastA) === Object.getPrototypeOf(toastB));
console.log("show" in toastA, Object.hasOwn(toastA, "show"));
toastA.show("Teste de sucesso", "success");
toastA.show("Teste de aviso", "warning");
toastA.show("Teste de erro", "error");

const adapter = Object.create(ApiMessageAdapter);
console.log(adapter.normalize({ type: "warning", message: "Aviso de teste" }));
```

Os resultados são `true`, `true` e `true false`: são instâncias distintas,
compartilham o protótipo e `show` é herdado, não recriado em cada Toast.
