#!/bin/bash

# Script para build e deploy do Altona System
set -e

echo "🐳 Altona System Docker Deploy Script"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    error "Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Menu de opções
echo ""
echo "Escolha uma opção:"
echo "1) Build e rodar em produção (porta 3000)"
echo "2) Rodar em modo desenvolvimento (porta 5173)"
echo "3) Parar todos os containers"
echo "4) Ver logs dos containers"
echo "5) Limpar imagens não utilizadas"
echo ""

read -p "Digite sua escolha [1-5]: " choice

case $choice in
    1)
        log "Iniciando build de produção..."
        docker-compose down 2>/dev/null || true
        docker-compose build --no-cache altona-system
        docker-compose up -d altona-system
        log "✅ Aplicação rodando em http://localhost:3000"
        log "💡 Use 'docker-compose logs -f altona-system' para ver os logs"
        ;;
    2)
        log "Iniciando modo desenvolvimento..."
        docker-compose --profile dev down 2>/dev/null || true
        docker-compose --profile dev build --no-cache altona-dev
        docker-compose --profile dev up -d altona-dev
        log "✅ Aplicação de desenvolvimento rodando em http://localhost:5173"
        log "💡 Use 'docker-compose logs -f altona-dev' para ver os logs"
        ;;
    3)
        log "Parando todos os containers..."
        docker-compose down
        docker-compose --profile dev down 2>/dev/null || true
        log "✅ Todos os containers foram parados"
        ;;
    4)
        info "Logs dos containers ativos:"
        docker-compose logs --tail=50 -f
        ;;
    5)
        log "Limpando imagens não utilizadas..."
        docker system prune -f
        docker image prune -f
        log "✅ Limpeza concluída"
        ;;
    *)
        error "Opção inválida!"
        exit 1
        ;;
esac

echo ""
info "Script concluído! 🚀"