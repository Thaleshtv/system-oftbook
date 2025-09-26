# 🐳 Docker Setup para Altona System

Este documento explica como executar o Altona System usando Docker, especialmente otimizado para funcionar em ambientes com VPN.

## 📋 Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado (geralmente vem com o Docker Desktop)

## 🚀 Execução Rápida

### Produção (Recomendado)
```bash
# Usando o script automatizado
./deploy.sh

# Ou manualmente
docker-compose up -d altona-system
```

A aplicação estará disponível em: http://localhost:3000

### Desenvolvimento
```bash
# Usando o script automatizado
./deploy.sh

# Ou manualmente
docker-compose --profile dev up -d altona-dev
```

A aplicação estará disponível em: http://localhost:5173

## 📁 Arquivos Docker

- `Dockerfile` - Build de produção com nginx
- `Dockerfile.dev` - Build de desenvolvimento com hot-reload
- `docker-compose.yml` - Orquestração dos containers
- `.dockerignore` - Arquivos ignorados no build
- `deploy.sh` - Script automatizado para deploy

## 🔧 Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Parar todos os containers
docker-compose down

# Rebuild sem cache
docker-compose build --no-cache

# Limpar recursos não utilizados
docker system prune -f

# Executar comandos dentro do container
docker-compose exec altona-system sh
```

## 🌐 Configurações para VPN

O setup foi otimizado para funcionar em ambientes com VPN:

### Dockerfile
- Configurações de timeout estendidas para npm
- Múltiplas tentativas de download
- Registry npm configurado explicitamente
- Cache otimizado para builds mais rápidos

### Nginx (Produção)
- Timeouts de conexão otimizados
- Keep-alive configurado
- Compressão habilitada
- Headers de segurança

### Vite (Desenvolvimento)
- Host configurado como `0.0.0.0`
- Polling habilitado para hot-reload
- Proxy configurado para evitar CORS

## 🔍 Troubleshooting

### Problema: Container não inicia
```bash
# Verificar logs
docker-compose logs altona-system

# Verificar se a porta está em uso
lsof -i :3000
```

### Problema: Build falha por timeout
```bash
# Rebuild com cache limpo
docker-compose build --no-cache --pull

# Verificar conectividade
docker run --rm alpine ping -c 3 registry.npmjs.org
```

### Problema: Hot-reload não funciona
```bash
# Verificar se está usando o profile dev
docker-compose --profile dev up -d

# Verificar se os volumes estão montados
docker-compose --profile dev exec altona-dev ls -la /app
```

## 📊 Monitoramento

### Health Checks
O container de produção inclui health checks automáticos:

```bash
# Verificar status
docker-compose ps

# Testar health check manualmente
curl http://localhost:3000/health
```

### Logs Estruturados
```bash
# Logs apenas de erros
docker-compose logs | grep ERROR

# Logs com timestamp
docker-compose logs -t

# Últimas 100 linhas
docker-compose logs --tail=100
```

## 🚀 Deploy em Produção

### Variáveis de Ambiente
Crie um arquivo `.env.production`:

```env
VITE_BACKEND_URL=https://sua-api.exemplo.com/
NODE_ENV=production
```

### Build Otimizado
```bash
# Build multi-stage otimizado
docker build -t altona-system:latest .

# Tag para registry
docker tag altona-system:latest seu-registry/altona-system:v1.0.0

# Push para registry
docker push seu-registry/altona-system:v1.0.0
```

## 🛡️ Segurança

- Containers rodam como usuário não-root quando possível
- Headers de segurança configurados no nginx
- Apenas portas necessárias expostas
- Imagens baseadas em Alpine Linux (mais seguras e menores)

## 📝 Customização

### Configurar Proxy Reverso
Se você precisar rodar atrás de um proxy reverso, edite o `docker-compose.yml`:

```yaml
environment:
  - VIRTUAL_HOST=altona.exemplo.com
  - LETSENCRYPT_HOST=altona.exemplo.com
```

### Configurar SSL
Para HTTPS local, monte certificados:

```yaml
volumes:
  - ./certs:/etc/nginx/certs:ro
```

## 🆘 Suporte

Se você encontrar problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Teste a conectividade: `docker run --rm alpine ping google.com`
3. Limpe o cache: `docker system prune -f`
4. Rebuild: `docker-compose build --no-cache`

---

💡 **Dica**: Use o script `./deploy.sh` para uma experiência mais amigável!