# Use Node.js 18 Alpine como base para uma imagem mais leve
FROM node:18-alpine as builder

# Defina o diretório de trabalho
WORKDIR /app

# Configure variáveis de ambiente para evitar problemas de conectividade
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173

# Copie os arquivos de dependências
COPY package*.json ./

# Configure npm para usar registries seguros e instale dependências
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm ci --only=production --silent

# Copie todo o código fonte
COPY . .

# Build da aplicação
RUN npm run build -- --config vite.config.docker.ts

# Estágio de produção usando nginx
FROM nginx:alpine

# Copie os arquivos buildados para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie configuração customizada do nginx para SPA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    
    # Configurações para melhor performance em VPN
    client_max_body_size 50M;
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # Configurações de cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }
    
    # Configuração para SPA - todas as rotas apontam para index.html
    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
        
        # Headers para evitar problemas de CORS
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Exponha a porta 80
EXPOSE 80

# Inicie o nginx
CMD ["nginx", "-g", "daemon off;"]