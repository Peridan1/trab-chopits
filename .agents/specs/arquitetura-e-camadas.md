# 🏛️ Arquitetura em Camadas (Chopits)

```mermaid
flowchart TD
    App["src/App.tsx"] --> Provider["src/context/StoreContext.tsx"]
    Provider --> Routes["src/routes/index.tsx"]
    Routes --> Pages["src/pages/ (Home, Produtos, ProdutoDetalhe, Carrinho, Admin, Sobre, Login, Usuarios)"]
    Pages --> Components["src/components/ (ProductCard, Navbar, Modais, ChopitsKPIs)"]
    Provider --> API["src/services/api.ts (Axios Client)"]
    API --> Backend["jsonserver/dados.json (JSON-Server REST API)"]
```

## Responsabilidades de Cada Camada:
1. **`src/types/`**: Define contratos estritos de dados (`Produto`, `Usuario`, `ItemCarrinho`, `Cupom`, `HomeBannerConfig`).
2. **`src/services/`**: Instância Axios com `baseURL` dinâmica e validação de variáveis de ambiente.
3. **`src/context/`**: Hub reativo com Context API que unifica carrinho, cupons, wishlist e ações do catálogo.
4. **`src/pages/`**: Telas completas roteadas pelo React Router v7.
5. **`src/components/`**: Peças de interface reutilizáveis e componíveis.
