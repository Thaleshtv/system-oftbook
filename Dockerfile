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

# Exponha a porta do Vite
EXPOSE 5173

# Rode o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]