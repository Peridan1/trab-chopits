# 🛍️ Chopits - Plataforma de E-Commerce Interativa

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JSON Server](https://img.shields.io/badge/JSON_Server-000000?style=for-the-badge&logo=json&logoColor=white)

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

Siga o passo a passo abaixo para executar a aplicação no seu ambiente local:

### 1. Clonar o repositório e instalar as dependências

```bash
git clone https://github.com/Peridan1/trab-chopits.git
cd trab-chopits
npm install
```

### 2. Iniciar o Projeto Fullstack (Servidor + Frontend em Um Só Comando)

```bash
npm start
```

> **💡 O que o `npm start` faz:**
> 1. Executa o **JSON-Server** no backend com busca automática de porta livre (ex: `3001` ou `3002`).
> 2. Executa o **Vite** no frontend simultaneamente.
> 3. Abre a aplicação pronta para uso em `http://localhost:5173`.

---

Caso prefira rodar em dois terminais separados:
- **Backend (JSON-Server):** `npm run server`
- **Frontend (Vite):** `npm run dev`

---

## 📚 Documentação Técnica Completa

Nossa documentação técnica complementar está mantida na pasta [`docs/`](file:///home/danielpereira/projetos/pessoal/trab-chopits/docs):

- 🔄 [**01. Transição Hardcoded para API REST**](file:///home/danielpereira/projetos/pessoal/trab-chopits/docs/TRANSICAO_API.md) — Explicativo técnico mostrando a evolução do código estático `const usuarios = [...]` para chamadas assíncronas HTTP com Axios e JSON-Server.
- ⚔️ [**02. Comparativo Tecnológico: React + Vite vs. Next.js**](file:///home/danielpereira/projetos/pessoal/trab-chopits/docs/COMPARATIVO_STACK.md) — Estudo detalhado abordando diferenças de roteamento, SEO, renderização (CSR vs SSR), vantagens e desvantagens de cada stack.

---

_Documentação reestruturada segundo os mais altos padrões de Engenharia de Software._
