FROM node:18-alpine

WORKDIR /app

# Configurações para VPN
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copie package.json
COPY package*.json ./

# Configure npm para VPN e instale dependências
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install

# Copie o código
COPY . .

# Build da aplicação
RUN npm run build

# Use nginx para servir
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Configuração simples do nginx
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]