# AGENT de Frontend Design

## Objetivo deste arquivo
Use este documento para orientar o planejamento visual e estrutural do frontend do sistema. Ele deve ajudar **estudantes** a descrever suas decisões de interface e também orientar **agentes de IA** a propor telas, componentes e organização de arquivos sem quebrar as convenções do projeto.

## Como preencher
- Substitua cada conteúdo entre colchetes por informações do seu sistema.
- Escreva descrições curtas, objetivas e úteis para implementação.
- Registre primeiro o **layout estático**; o consumo da API e a renderização dinâmica virão depois.

## Regras do projeto que devem ser respeitadas
- O conteúdo deve ser escrito em **Português do Brasil**.
- O código, nomes de arquivos, classes, funções e identificadores devem ficar em **English**.
- O frontend deve usar **HTML semântico**.
- Não utilizar `<div>` e não utilizar `<table>` para montar interface.
- Não utilizar `jQuery`.
- Não utilizar eventos inline no HTML.
- Usar `document.querySelector` no JavaScript.
- Requisições HTTP devem usar `HttpClientBase.js` quando a integração com API começar.
- Arquivos compartilhados devem ir em `views/assets/_common/`; arquivos específicos devem ficar em `views/assets/public/`, `views/assets/app/` ou `views/assets/admin/`.

## Escopo inicial do frontend
- Nesta etapa, os dados serão exibidos de forma **estática**.
- O JavaScript poderá ser usado para comportamentos como `[menu responsivo]`, `[abrir e fechar painéis]`, `[alternar listas]`, `[máscaras visuais]` e `[interações de navegação]`.
- Não planeje regra de negócio no frontend; a View apenas apresenta dados e interações da interface.

## Contexto geral da interface
- Nome do sistema: `[Ordem Jedi Store]`
- Objetivo principal: `[Criar uma experiência digital premium para fãs de ficção científica e colecionáveis, combinando loja virtual e sistema de assinatura em uma interface cinematográfica e sofisticada.]`
- Público principal: `[Jovens e adultos fãs de Star Wars, cultura geek e produtos colecionáveis premium.]`
- Dispositivos prioritários: `[Desktop com adaptação responsiva para mobile.]`
- Estilo desejado: `[Retrô futurista, cinematográfico, minimalista, premium e inspirado em ficção científica clássica espacial.]`

## Área Pública (`public`)
- Quem acessa: `[visitantes sem login]`
- Objetivo da área: `[Permitir que visitantes explorem produtos normalmente, conheçam a marca e descubram os benefícios da membership premium.]`
- Telas previstas: `[Home]`, `[Coleção]`, `[Produtos]`, `[Detalhes do produto]`, `[Membership]`, `[Sobre]`, `[Contato]`, `[Login]`, `[Cadastro]`
- Componentes principais: `[Cabeçalho minimalista]`, `[menu superior]`, `[banner cinematográfico]`, `[cards premium de colecionáveis]`, `[seção de destaques]`, `[categorias]`, `[benefícios da assinatura]`, `[rodapé elegante]`
- Ação principal esperada do usuário: `[Explorar produtos, visualizar coleções exclusivas e tornar-se membro da plataforma.]`

## Área de Aplicação (`app`)
- Quem acessa: `[Usuários autenticados e membros assinantes.]`
- Objetivo da área: `[Permitir acesso à conta do usuário, acompanhar pedidos, visualizar benefícios exclusivos e acessar produtos especiais para membros.]`
- Telas previstas: `[Dashboard]`, `[Perfil]`, `[Meus pedidos]`, `[Produtos exclusivos]`, `[Carrinho]`, `[Favoritos]`, `[Configurações]`
- Componentes principais: `[Menu lateral discreto]`, `[cards premium]`, `[listas minimalistas]`, `[área de benefícios exclusivos]`, `[formulários elegantes]`
- Ação principal esperada do usuário: `[Comprar produtos, acompanhar pedidos e acessar vantagens da membership.]`

## Área Administrativa (`admin`)
- Quem acessa: `[Administrador do sistema e atendimento ao cliente]`
- Objetivo da área: `[Gerenciar produtos, usuários, pedidos, estoque e informações da plataforma.]`
- Telas previstas: `[Painel administrativo]`, `[Gestão de produtos]`, `[Pedidos]`, `[Usuários]`, `[Relatórios]`, `[Configurações]`
- Componentes principais: `[Filtros]`, `[indicadores]`, `[formulários administrativos]`, `[listas organizadas]`, `[tabelas semânticas para dados reais]`
- Ação principal esperada do usuário: `[Controlar catálogo, pedidos e funcionamento geral da plataforma.]`

## Navegação e organização visual
- Estrutura de navegação principal: `[Menu superior fixo na área pública, navegação minimalista inspirada em interfaces espaciais clássicas, layout focado em experiência visual cinematográfica e estrutura simples e organizada.]`
- Fluxo entre telas: `[O visitante acessa a home, visualiza produtos em destaque, explora coleções, conhece os benefícios da membership e pode acessar login ou cadastro.]`
- Hierarquia visual: `[Banner principal deve possuir maior destaque visual, produtos e coleções devem aparecer acima da dobra da tela, cards devem possuir leitura rápida e aparência premium, botões principais devem receber destaque visual e imagens dos colecionáveis devem chamar atenção.]`
- Estados importantes da interface: `[vazio]`, `[carregando]`, `[erro visual]`, `[sucesso]`, `[hover suave em cards e botões]`

## Responsividade e acessibilidade
- Breakpoints desejados: `[mobile: até 768px]`, `[tablet: entre 768px e 1024px]`, `[desktop: acima de 1024px]`
- Ajustes esperados por tela:`[menu hamburguer no mobile]`, `[cards reorganizados em coluna]`, `[banners adaptáveis]`, `[formulários ocupando largura total em telas menores]`
- Cuidados de acessibilidade: `[alto contraste entre fundo escuro e textos claros]`, `[fontes legíveis]`, `[ordem lógica de navegação]`, `[textos claros e objetivos]`, `[uso correto de elementos semânticos HTML]`
- Elementos semânticos esperados: `[header]`, `[nav]`, `[main]`, `[section]`, `[article]`, `[aside]`, `[footer]`, `[form]`, `[label]`

## Identidade visual
- Paleta principal:  `[Preto espacial — #0E090C]`, `[Azul profundo — #2B5279]`, `[Azul acinzentado — #5B54A0]`, `[Azul petróleo escuro — #1E2527]`, `[Laranja queimado — #C05212]`, `[Laranja sci-fi — #D55A2B]`, `[Vermelho escuro — #B13214]`, `[Marrom ferrugem — #7B6552]`, `[Bege envelhecido — #DACAAB]`
- Tipografia:  `[Fonte retrô futurista inspirada em pôsteres clássicos de sci-fi para títulos]`, `[Fonte moderna minimalista para textos e navegação]`, `[Tipografia grande e impactante em banners principais]`
- Referências visuais: `[Pôsteres clássicos de Star Wars dos anos 70/80]`, `[Pôsteres de Back to the Future]`, `[Capas vintage de ficção científica]`, `[Interfaces espaciais cinematográficas]`, `[Layouts editoriais premium]`, `[Catálogos modernos de colecionáveis]`
- Sensação que a interface deve transmitir: - `[Exclusividade]`,`[Nostalgia cinematográfica]`,`[Imersão espacial]`,`[Sofisticação]`,`[Atmosfera retrofuturista]`,`[Sensação de coleção rara premium]`

- Direção artística: `[Mistura entre ficção científica clássica e interface moderna minimalista]`,`[Contraste entre fundos escuros e cores quentes vibrantes]`,`[Visual inspirado em pôsteres antigos de cinema sci-fi]`,`[Composição cinematográfica com destaque para imagens grandes]`,`[Uso de brilho suave e sombras discretas]`

- Estilo visual dos elementos:`[Cards inspirados em vitrines premium de colecionáveis]`,`[Banners cinematográficos com imagens impactantes]`,`[Botões minimalistas com destaque em cores quentes]`,`[Muito espaço vazio para valorizar os elementos visuais]`,`[Layout organizado e elegante]`

- Uso de cores:`[Fundos principais utilizando preto espacial e azul escuro]`,`[Laranja, vermelho e amarelo utilizados para destaque visual]`,`[Tons bege e metálicos utilizados para equilíbrio visual vintage]`,`[Azuis utilizados para transmitir profundidade espacial e contraste]`


## Organização de arquivos esperada
- Estilos compartilhados: `views/assets/_common/styles/[arquivo.css]`
- Scripts compartilhados: `views/assets/_common/scripts/[arquivo.js]`
- Estilos da área pública: `views/assets/public/styles/[arquivo.css]`
- Scripts da área pública: `views/assets/public/scripts/[arquivo.js]`
- Estilos da aplicação: `views/assets/app/styles/[arquivo.css]`
- Scripts da aplicação: `views/assets/app/scripts/[arquivo.js]`
- Estilos da área administrativa: `views/assets/admin/styles/[arquivo.css]`
- Scripts da área administrativa: `views/assets/admin/scripts/[arquivo.js]`

## Limite entre etapa atual e integração futura
- Agora: criar HTML semântico, CSS e interações estáticas em JavaScript.
- Depois: integrar com a API usando `HttpClientBase.js`, tratar erros assíncronos e renderizar dados dinamicamente.
- Ao propor código, a IA deve separar o que é **mock estático** do que será substituído por dados reais depois.

## Instrução final para estudantes e IA
Antes de implementar qualquer tela, preencha este arquivo com o máximo de clareza possível. Se uma informação ainda não estiver decidida, registre como `[a definir]` em vez de inventar requisitos.

