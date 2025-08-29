#!/usr/bin/env bash

# Recebe o nome da pasta como argumento
NOME_DA_PASTA=$1

if [ -z "$NOME_DA_PASTA" ]; then
  echo "Uso: $0 <nome_da_pasta>"
  exit 1
fi

# Capitaliza a primeira letra
NOME_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${NOME_DA_PASTA:0:1})${NOME_DA_PASTA:1}"

# Cria a pasta
mkdir -p "$NOME_DA_PASTA"
cd "$NOME_DA_PASTA" || exit

# Cria os arquivos
cat > index.tsx <<EOF
import { use${NOME_CAPITALIZED} } from './model'
import { ${NOME_CAPITALIZED}View } from './view'

export const ${NOME_CAPITALIZED} = () => {
  const model${NOME_CAPITALIZED} = use${NOME_CAPITALIZED}()

  return <${NOME_CAPITALIZED}View {...model${NOME_CAPITALIZED}} />
}
EOF

cat > model.tsx <<EOF
export const use${NOME_CAPITALIZED} = () => {
  return {}
}
EOF

cat > view.tsx <<EOF
import './style.scss'
import { use${NOME_CAPITALIZED} } from './model'
import * as Styled from './style'

export const ${NOME_CAPITALIZED}View = (props: ReturnType<typeof use${NOME_CAPITALIZED}>) => {
  return (
    <Styled.Container>
      <h1>${NOME_CAPITALIZED}</h1>
    </Styled.Container>
  )
}
EOF

cat > style.ts <<EOF
import styled from 'styled-components'

export const Container = styled.div\`
  padding: 16px;
\`
EOF

echo "Página $NOME_DA_PASTA criada com sucesso!"
