# 🎨 Palette Visualizer

Uma aplicação web para visualizar e analisar paletas de cores de forma interativa e intuitiva.

## 📋 Sobre o Projeto

O **Palette Visualizer** é uma ferramenta desenvolvida em Angular 20 que permite:

- **Importar paletas de cores** via JSON
- **Visualizar cores em um espaço HSL** (matiz, saturação, luminosidade)
- **Analisar a distribuição de cores** através de gráficos visuais
- **Desenhar curvas de interpolação** entre cores usando splines Catmull-Rom e Bézier

A aplicação converte cores hexadecimais para o espaço HSL, calcula a matiz média da paleta e renderiza um plano bidimensional interativo que mostra como as cores se distribuem em relação à saturação e luminosidade.

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- pnpm

### Instalação

`bash
pnpm install
`

### Servidor de Desenvolvimento

Para iniciar o servidor local:

`bash
pnpm start
`

A aplicação estará disponível em <http://localhost:4200/>. O navegador recarregará automaticamente quando você modificar os arquivos.

### Como Usar

1. Prepare um JSON com suas paletas de cores no formato:

```json
{
  "palettes": {
    "primary": {
      "50": "#f5f3ff",
      "100": "#ede9fe",
      "200": "#ddd6fe"
    },
    "secondary": {
      "50": "#fef2f2",
      "100": "#fee2e2"
    }
  }
}
```

```json
{
  "shell-colors": {
    "yellow": {
      "base": "#FFD500",
      "tint80": "#FFE14C",
      "tint60": "#FFEF99",
      "tint40": "#FFFCD1",
      "tint20": "#FFFFF2"
    },
    "red": {
      "base": "#ED1C24",
      "tint80": "#F53B3F",
      "tint60": "#F98E8F",
      "tint40": "#FDCBCB",
      "tint20": "#FFEAEA"
    }
  }
}
```

2. Cole o JSON na aplicação
3. Clique em "Gerar" para visualizar as paletas

## 🏗️ Estrutura do Projeto

`
src/
├── app/
│   ├── app.ts              # Componente raiz
│   ├── app.routes.ts       # Configuração de rotas
│   └── pallete-visualizer/ # Componente principal
│       ├── pallete-visualizer.ts
│       ├── pallete-visualizer.html
│       └── pallete-visualizer.scss
`

## 🛠️ Scripts Disponíveis

- pnpm start - Inicia o servidor de desenvolvimento
- pnpm build - Compila para produção
- pnpm watch - Compila em modo watch
- pnpm test - Executa testes unitários

## 📦 Tecnologias

- **Angular 20** - Framework web moderno
- **TypeScript** - Linguagem tipada
- **Canvas API** - Renderização dos gráficos
- **SCSS** - Estilização

## ✨ Features Principais

- ✅ Parsing de JSON de paletas
- ✅ Renderização de espaço HSL em Canvas
- ✅ Cálculo de matiz média circular
- ✅ Interpolação com curvas Catmull-Rom e Bézier
- ✅ Interface responsiva e intuitiva

## 📄 Licença

Este projeto está disponível sob licença MIT.
