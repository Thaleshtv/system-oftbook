# Multi-stage build
# Estágio 1: Build da aplicação
FROM node:18-alpine AS builder

# Aumenta limite de memória do Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (melhora cache)
COPY package*.json ./

# Configura o npm para conexões lentas e instala dependências
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install

# ⚠️ Ignora erro de certificado SSL e instala TypeScript globalmente
RUN npm config set strict-ssl false \
    && npm install -g typescript

# 🧩 Instala os tipos que estavam faltando (para evitar erros TS2688)
RUN npm install --save-dev @types/react @types/react-dom @types/js-cookie @types/babel__core @types/babel__generator @types/babel__template @types/babel__traverse @types/debug @types/estree @types/estree-jsx @types/hast @types/json-schema @types/mdast @types/ms @types/unist

# Copia o restante dos arquivos do projeto para o container
COPY . .

# Compila a aplicação (TypeScript + Vite)
RUN npm run build

# Estágio 2: Servidor Nginx para produção
FROM nginx:alpine

# Copia os arquivos buildados para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração personalizada do nginx (se necessário)
COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]