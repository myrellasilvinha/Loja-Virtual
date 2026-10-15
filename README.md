# StyleHub — Loja Virtual Demonstrativa

Loja de roupas moderna, responsiva e 100% estática, pronta para publicar no **GitHub Pages** ou **Vercel**.

## Funcionalidades

- Página inicial com identidade visual
- Catálogo com 12 produtos (Feminino, Masculino e Acessórios)
- Filtros por categoria
- Modal de visualização do produto + seleção de tamanho
- Carrinho lateral com localStorage (persiste ao recarregar)
- Botão de compra (simulado)
- Layout 100% responsivo (mobile + desktop)
- Integração pronta com **Google Analytics 4**
- Eventos GA4: `add_to_cart` e `purchase`

## Como rodar localmente

Basta abrir o arquivo `index.html` no navegador ou usar um servidor local:

```bash
# Com Python
python -m http.server 8000

# Com Node (npx)
npx serve .
```

Acesse: http://localhost:8000

## Configurar Google Analytics 4

1. Acesse [analytics.google.com](https://analytics.google.com) e crie uma propriedade **GA4**.
2. Copie o **Measurement ID** (formato `G-XXXXXXXXXX`).
3. Abra o arquivo `index.html` e substitua as duas ocorrências de `G-XXXXXXXXXX` pelo seu ID real:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU_ID_AQUI"></script>
...
gtag('config', 'G-SEU_ID_AQUI');
```

Pronto! Os eventos de adicionar ao carrinho e finalizar compra já estão implementados.

## Publicar de graça

### Opção 1 — GitHub Pages (recomendado)

1. Crie um repositório no GitHub (ex: `stylehub-loja`).
2. Faça upload de todos os arquivos desta pasta (ou use Git):

```bash
git init
git add .
git commit -m "Loja virtual StyleHub"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/stylehub-loja.git
git push -u origin main
```

3. No repositório → **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main` / root → Save.
4. Aguarde 1–2 minutos. Sua loja estará em:  
   `https://SEU_USUARIO.github.io/stylehub-loja/`

### Opção 2 — Vercel (ainda mais fácil)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub.
2. Clique em **Add New Project** → Import o repositório.
3. Deixe as configurações padrão e clique em **Deploy**.
4. Em segundos você terá uma URL tipo: `https://stylehub-loja.vercel.app`

## Estrutura de arquivos

```
loja-virtual/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos responsivos
├── js/
│   ├── products.js     # Dados dos produtos
│   └── app.js          # Lógica do carrinho, modal e filtros
└── README.md
```

## Personalização rápida

- **Produtos**: edite o array em `js/products.js`
- **Cores**: altere as variáveis CSS em `:root` no arquivo `styles.css`
- **Nome da loja**: procure por "StyleHub" nos arquivos

---

Feito com HTML, CSS e JavaScript puro. Sem frameworks, sem build, sem dependências.
