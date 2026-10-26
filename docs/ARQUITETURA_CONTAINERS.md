# 🐳 Arquitetura de Containers & Dockerização Fullstack

Esta documentação detalha a arquitetura de conteinerização do projeto **Chopits**, projetada sob padrões profissionais de engenharia de software para portfólio e ambientes de produção.

---

## 🏗️ 1. Diagrama de Arquitetura

A aplicação opera através de dois serviços orquestrados via **Docker Compose**, isolados em uma rede bridge dedicada:

```mermaid
flowchart TD
    subgraph Host ["💻 Host Machine (Navegador / Avaliador)"]
        Browser["🌐 Navegador Web (http://localhost)"]
        LocalFile["📁 jsonserver/dados.json"]
    end

    subgraph DockerBridge ["🌐 Docker Network (chopits-network)"]
        subgraph FrontContainer ["📦 Frontend Service (chopits-frontend)"]
            Nginx["⚡ Nginx Alpine (Port 80)\n- Roteamento SPA (try_files)\n- Compressão Gzip\n- Headers OWASP\n- Cache de Assets Estáticos"]
        end

        subgraph ApiContainer ["📦 Backend Mock Service (chopits-api)"]
            JsonServer["🚀 JSON-Server Node 22 (Port 3001)\n- Endpoints REST (/usuarios, /produtos)\n- Healthcheck Ativo"]
        end
    end

    Browser -->|Porta 80 (Frontend)| Nginx
    Browser -->|Proxy /api/ (Chamadas Axios)| Nginx
    Nginx -->|Rede Interna (api:3001)| JsonServer
    Browser -.->|Porta 3002 Opcional no Host| JsonServer
    JsonServer <-->|Bind Mount Volume| LocalFile
```

---

## 🎯 2. Decisões Arquiteturais e Boas Práticas

### 2.1 Multi-Stage Build no Frontend (`Dockerfile`)
Em vez de servir a aplicação React em produção utilizando o servidor de desenvolvimento do Vite (que consumiria ~1.2 GB com `node_modules` e compiladores TypeScript/Babel em memória), adotamos um **Multi-stage Dockerfile**:

1. **Estágio `builder` (Node 22 Alpine):** Responsável por instalar dependências e compilar a aplicação (`npm run build`).
2. **Estágio `production` (Nginx 1.27 Alpine):** O artefato gerado na pasta `dist` é copiado para um servidor Nginx ultraleve.
   - **Tamanho da imagem final:** Redução de **~1.3 GB** para apenas **~25 MB**.
   - **Segurança:** Zero ferramentas de build ou compiladores em produção.

### 2.2 Servidor Nginx Especializado para SPAs
Aplicações de Página Única (*Single Page Applications*) que utilizam **React Router DOM** necessitam de tratamento especial no servidor web. Sem isso, recarregar rotas diretas como `/produtos` ou `/usuarios` resultaria em erro `404 Not Found`.

Nosso `nginx/default.conf` implementa:
- **Fallback de Roteamento:** `try_files $uri $uri/ /index.html;` redireciona todas as rotas de navegação para o entrypoint do React.
- **Compressão Gzip Ativa:** Redução no consumo de banda para arquivos CSS, JS, JSON e SVG.
- **Headers de Segurança (OWASP):** Inclusão de `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection` e `Referrer-Policy`.
- **Cache Estático Imutável:** Cache de 1 ano (`Cache-Control: immutable`) para os arquivos hash versionados gerados pelo Vite em `assets/`.
- **Proxy Reverso `/api/`:** Permite que chamadas ao backend sejam encaminhadas internamente na rede Docker.

### 2.3 Persistência de Dados via Bind Mount (`dados.json`)
O JSON-Server funciona simulando um banco de dados relacional/documental a partir do arquivo `jsonserver/dados.json`. 

No `docker-compose.yml`, configuramos um **volume mapeado (bind mount)**:
```yaml
volumes:
  - ./jsonserver/dados.json:/app/jsonserver/dados.json
```
**Benefício:** Qualquer operação de escrita (cadastrar novo usuário, atualizar produto ou excluir registro via UI) é persistida instantaneamente no arquivo do host. Ao reiniciar ou recriar os containers, os dados permanecem intactos.

### 2.4 Healthchecks e Resiliência
O serviço `frontend` depende diretamente do status de saúde do serviço `api`:
```yaml
depends_on:
  api:
    condition: service_healthy
```
O container da API executa periodicamente um comando `wget --spider` verificando a integridade da rota `/usuarios`. O Nginx só inicia após o backend estar 100% pronto para responder requisições HTTP.

---

## 🚀 3. Guia de Execução

### 3.1 Modo Produção (Recomendado para Apresentação e Avaliação)

Sobe toda a aplicação compilada e otimizada em Nginx com um único comando:

```bash
docker compose up --build -d
```

- **Frontend:** Acesse [http://localhost](http://localhost)
- **API REST (JSON-Server):** Acesse [http://localhost/api/usuarios](http://localhost/api/usuarios) (via proxy Nginx) ou diretamente na porta mapeada [http://localhost:3002/usuarios](http://localhost:3002/usuarios)

Para parar os serviços:
```bash
docker compose down
```

---

### 3.2 Modo Desenvolvimento (Live Reload e HMR)

Caso deseje trabalhar no código com Hot Module Replacement dentro de containers:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Neste modo, as pastas `src/` e `public/` são montadas dinamicamente no container, refletindo alterações instantaneamente no navegador.

---

## 📊 4. Matriz Comparativa: Local vs. Docker

| Métrica / Critério | Execução Nativa Local | Docker Produção (Nginx) | Docker Dev |
| :--- | :--- | :--- | :--- |
| **Dependência do Host** | Exige Node.js 20+ e NPM instalados | Apenas Docker instalado | Apenas Docker instalado |
| **Isolamento de Ambiente** | Risco de conflito de versões e permissões | 100% isolado e reprodutível | 100% isolado |
| **Tamanho em Memória (RAM)** | ~250MB (Vite + Node) | **~35MB** (Nginx + Alpine Node) | ~250MB |
| **Roteamento SPA** | Tratado pelo Vite dev server | Tratado por Nginx (`try_files`) | Tratado pelo Vite dev server |
| **Persistência de Dados** | Direta no arquivo local | Direta via volume montado | Direta via volume montado |
