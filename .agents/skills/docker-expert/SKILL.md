---
name: docker-expert
description: Boas práticas de conteinerização multi-stage e Nginx para SPAs no Chopits.
---

# 🐳 Docker & Nginx SPA Guidelines

1. **Multi-Stage Build:**
   - Estágio de compilação em `node:22-alpine` (`npm run build`).
   - Estágio de produção ultraleve em `nginx:1.27-alpine` (~25 MB).
2. **Regra de Roteamento SPA no Nginx:**
   - Em SPAs com React Router, qualquer sub-rota direta (como `/produtos` ou `/admin`) precisa cair no `index.html`:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
3. **Proxy Reverso:**
   - O tráfego para `/api/` é redirecionado internamente para o contêiner `api:3001` (JSON-Server).
