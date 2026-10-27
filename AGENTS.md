# 🛍️ Chopits — Diretrizes Gerais para Agentes de IA

Este repositório contém a **Chopits Store**, um e-commerce interativo moderno construído com **React 19**, **TypeScript**, **Vite**, **Bootstrap 5 customizado** e persistência mock via **JSON-Server**, com suporte a conteinerização em **Docker + Nginx**.

---

## 🎯 Regras Centrais do Projeto

1. **Stack Tecnológica Estrita:**
   * **Framework:** React 19 (Componentes Funcionais + Hooks nativos).
   * **Tipagem:** TypeScript rigoroso (`src/types/index.ts`). Não utilize `any`.
   * **Build Tool:** Vite 7 (Hot Module Replacement ultrarrápido).
   * **Estilização:** Bootstrap 5 com tema customizado em `src/styles/chopits-theme.css` (Paleta Tech Violet & Mint).
   * **Roteamento:** React Router DOM v7 (SPAs com rotas aninhadas e dinâmicas).
   * **Cliente HTTP:** Axios com cliente centralizado em `src/services/api.ts`.
   * **Backend:** JSON-Server operando em `jsonserver/dados.json`.

2. **Preservação Acadêmica & Branching:**
   * A entrega acadêmica original do 4º semestre está congelada na branch **`pratica-academica`**.
   * Na branch **`main`**, o foco é excelência para **portfólio profissional de e-commerce**, mantendo os exercícios de referência acessíveis dentro da rota `/admin`.

3. **Arquitetura em Camadas (Separation of Concerns):**
   * `src/components/`: Componentes reutilizáveis puros (Cards, Modais, Navbar, KPIs).
   * `src/pages/`: Visões de página conectadas a rotas específicas (`Home`, `Produtos`, `ProdutoDetalhe`, `Carrinho`, `Admin`, `Sobre`, `Login`, `Usuarios`).
   * `src/context/`: Estado global do marketplace (`StoreContext.tsx`) gerenciando catálogo, carrinho, wishlist (`localStorage`) e cupons.
   * `src/services/`: Configuração de comunicação HTTP externa.
   * `src/types/`: Modelos e interfaces TypeScript centralizados.

4. **Verificação Obrigatória Antes de Concluir Tarefas:**
   * Sempre execute `npm run build` (`tsc -b && vite build`) e `npm run lint` para garantir compilação sem erros.
