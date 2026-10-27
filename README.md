# 🛍️ Chopits - Plataforma de E-Commerce Interativa

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JSON Server](https://img.shields.io/badge/JSON_Server-000000?style=for-the-badge&logo=json&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![CI Pipeline](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

Plataforma de e-commerce e sistema interativo desenvolvido como projeto acadêmico do 4º semestre de Análise e Desenvolvimento de Sistemas. O projeto foca em interatividade do usuário, componentização em React 19, roteamento dinamizado com React Router DOM v7, consumo de API REST assíncrona com Axios e validação através de tipagem estática robusta com TypeScript.

---

### 👨‍💻 Autoria e Propriedade

- **Projeto:** Chopits E-Commerce (Trabalho Acadêmico - 4º Semestre)
- **Desenvolvimento & Arquitetura:** Daniel Satel Pereira
- **Repositório:** [Peridan1/trab-chopits](https://github.com/Peridan1/trab-chopits)
- **Ano:** 2026

---

## 🛠️ Stack Tecnológica Atualizada

O sistema utiliza uma arquitetura moderna para Aplicações de Página Única (SPA):

- **Front-end UI:** React 19 com suporte a componentes funcionais e TypeScript.
- **Ferramenta de Build & HMR:** Vite 7 (compilação ultrarrápida e Hot Module Replacement).
- **Roteamento SPA:** React Router DOM v7 (navegação cliente com parâmetros dinâmicos e suporte a rotas flexíveis).
- **Estilização & Responsividade:** Bootstrap 5 e React-Bootstrap para layout adaptável e modais elegantes.
- **Cliente HTTP:** Axios para comunicação assíncrona com rotas REST.
- **Backend Mock & Persistência:** JSON-Server operado via script em Node.js com detecção automática de porta disponível.

---

## ✨ Features Principais

O sistema possui as seguintes funcionalidades e módulos interativos:

### 🛍️ Catálogo de Produtos Interativo (`/produtos`)

- **Filtros e Busca em Tempo Real:** Pesquisa dinâmica por nome/descrição e categorização (Eletrônicos, Acessórios, Moda).
- **Parâmetros Dinâmicos de URL:** Suporte a URLs diretas como `/produtos/eletronicos` ou `/produtos/1`.
- **Simulador de Carrinho:** Adição de produtos com contador responsivo e notificações.

### 👤 Gerenciador CRUD de Usuários (`/usuarios`)

- **Integração com API REST:** Operações de Leitura (GET), Cadastro (POST), Edição (PUT) e Remoção (DELETE) persistidas em `jsonserver/dados.json`.
- **Modais e Formulários Interativos:** Validação de campos (nome, e-mail) e estados de carregamento.
- **Resiliência a Erros:** Fallback gracioso para dados locais caso o backend esteja temporariamente indisponível.

### 📌 Central de Lembretes & Tarefas (`/home`)

- **Gerenciador de Tarefas:** Adição e exclusão de lembretes em tempo real.
- **Persistência Local:** Sincronização automática com o `localStorage` do navegador.

### ℹ️ Apresentação & Autenticação (`/sobre` e `/login`)

- **Página Sobre Flexível:** Informações do projeto com tratamento de parâmetros como `/sobre/equipe` ou `/sobre/historia`.
- **Tela de Login:** Formulário estilizado com simulação de autenticação e navegação guiada.

---

## 🚀 Quick Start (Como Rodar o Projeto)

### Opção 1: Execução com Docker (Recomendada / 1 Comando) 🐳

Se você possui o **Docker** e o **Docker Compose** instalados, basta executar:

```bash
docker compose up --build -d
```

- **Frontend (Nginx Produção):** Acesse [http://localhost](http://localhost)
- **Backend Mock (JSON-Server):** Acesse [http://localhost/api/usuarios](http://localhost/api/usuarios) (via Nginx) ou na porta direta [http://localhost:3002/usuarios](http://localhost:3002/usuarios)

Para parar os containers:

```bash
docker compose down
```

---

### Opção 2: Execução Local Nativa com Node.js

#### 1. Instalar as dependências

```bash
npm install
```

#### 2. Iniciar o Projeto Fullstack (Servidor + Frontend em Um Só Comando)

```bash
npm start
```

> **💡 O que o `npm start` faz:**
>
> 1. Executa o **JSON-Server** no backend com busca automática de porta livre (ex: `3001` ou `3002`).
> 2. Executa o **Vite** no frontend simultaneamente.
> 3. Abre a aplicação pronta para uso em `http://localhost:5173`.

Caso prefira rodar em dois terminais separados:

- **Backend (JSON-Server):** `npm run server`
- **Frontend (Vite):** `npm run dev`

---

### ⌨️ Tabela de Scripts Disponíveis

| Comando               | Descrição                                                                        |
| :-------------------- | :------------------------------------------------------------------------------- |
| `npm run docker:up`   | Sobe a aplicação conteinerizada completa em produção (Nginx + API) em background |
| `npm run docker:down` | Encerra e remove os containers e redes do projeto                                |
| `npm run docker:dev`  | Inicia o ambiente conteinerizado com Hot Module Reloading (HMR)                  |
| `npm run docker:logs` | Acompanha os logs em tempo real dos containers em execução                       |
| `npm start`           | Inicia JSON-Server e Vite localmente com detecção automática de porta livre      |
| `npm run build`       | Validação de tipos TypeScript (`tsc -b`) e compilação de produção com Vite       |
| `npm run lint`        | Executa o linter ESLint em todo o código-fonte                                   |

---

## 📚 Documentação Técnica & Acadêmica Completa

Nossa documentação técnica e pedagógica complementar está mantida na pasta [`docs/`](docs):

- 🎓 [**01. Relatório Técnico & Documentação Acadêmica**](docs/DOCUMENTACAO_ACADEMICA.md) — **(Novo!)** Registro dos conceitos lecionados pelo professor: Fundamentos e motivação dos Hooks (`useState`, `useEffect`, `useCallback`, `useRef`), rastreabilidade no código-fonte, arquitetura de software e roadmap de evolução para marketplace.
- 🔄 [**02. Transição Hardcoded para API REST**](docs/TRANSICAO_API.md) — Explicativo técnico mostrando a evolução do código estático `const usuarios = [...]` para chamadas assíncronas HTTP com Axios e JSON-Server.
- ⚔️ [**03. Comparativo Tecnológico: React + Vite vs. Next.js**](docs/COMPARATIVO_STACK.md) — Estudo detalhado abordando diferenças de roteamento, SEO, renderização (CSR vs SSR), vantagens e desvantagens de cada stack.
- 🐳 [**04. Arquitetura de Containers & Dockerização Fullstack**](docs/ARQUITETURA_CONTAINERS.md) — Guia aprofundado cobrindo o Multi-stage Build, Nginx de alta performance, persistência de dados via volumes e matriz comparativa.

---

_Documentação reestruturada segundo os mais altos padrões de Engenharia de Software._
