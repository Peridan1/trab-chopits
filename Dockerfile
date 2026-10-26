# ========================================================
# Estágio 1: Dependências e Build da Aplicação React/Vite
# ========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copia manifestos de dependências
COPY package.json package-lock.json* ./

# Instala todas as dependências
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia todo o código-fonte
COPY . .

# Argumento para customização de API_BASE_URL no build
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Executa o build da aplicação React + TypeScript
RUN npm run build

# ========================================================
# Estágio 2: Ambiente de Desenvolvimento (Vite Dev Server)
# ========================================================
FROM node:22-alpine AS dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# ========================================================
# Estágio 3: Produção Otimizada com Nginx Alpine (~25MB)
# ========================================================
FROM nginx:1.27-alpine AS production

# Remove a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia a configuração customizada para React Router SPA + Proxy Reverso
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados (HTML/CSS/JS) do estágio de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta HTTP padrão
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
