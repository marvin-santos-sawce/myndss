# Mynds®

Site institucional com cérebro 3D holográfico interativo e tela de acesso restrito.

---

## Estrutura de arquivos

```
mynds/
├── index.html          # Página principal (cérebro 3D)
├── password.html       # Tela de acesso restrito
├── css/
│   ├── style.css       # Estilos globais
│   └── password.css    # Estilos da tela de senha
├── js/
│   ├── brain.js        # Renderização 3D (Three.js)
│   ├── main.js         # Interações da página principal
│   └── password.js     # Lógica da tela de senha
└── assets/             # Coloque aqui sua logo e outros arquivos de mídia
```

---

## Como usar

### GitHub Pages

1. Faça o push deste repositório para o GitHub
2. Vá em **Settings → Pages**
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`
4. Aguarde alguns minutos — o site estará disponível em `https://seu-usuario.github.io/nome-do-repo`

### Localmente

Basta abrir o `index.html` em qualquer navegador moderno.  
> Para melhor compatibilidade com módulos e fontes, use um servidor local (ex: extensão **Live Server** no VS Code).

---

## Substituindo a logo

No `index.html` e no `password.html`, localize o comentário:

```html
<!-- Para usar sua logo, substitua a linha abaixo: -->
<span class="footer-logo-text">MYNDS<sup>®</sup></span>
```

Troque por:

```html
<img src="assets/sua-logo.png" alt="Mynds" class="footer-logo" />
```

E adicione o arquivo da logo na pasta `assets/`.

---

## Dependências externas

- [Three.js r128](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js) — carregado via CDN
- [Google Fonts — Orbitron + Share Tech Mono](https://fonts.google.com) — carregado via CDN

Nenhuma instalação ou build necessária.

---

## Personalização

| O que mudar | Onde |
|---|---|
| Cor principal (rosa) | `css/style.css` → variável `--pink` |
| Texto do botão de acesso | `index.html` → `.btn-label` |
| Mensagem de erro da senha | `password.html` → `.error-msg` |
| Intensidade do glow do cérebro | `js/brain.js` → `pinkPoint.intensity` |
| Velocidade de rotação idle | `js/brain.js` → `t * 0.08` no `animate()` |
