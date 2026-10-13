# Segundo site — versão modernizada

**Branch:** [`xbyte-games-studios`](https://github.com/soareslfsantosc-cyber/xbyte-studios/tree/xbyte-games-studios)

**Página inicial:** `index.html`

Esta versão moderniza a apresentação da Xbyte Studios com identidade visual azul/neon, animações e uma área para projetos e jogos. Os arquivos do site ficam na raiz desta branch.

## Estrutura

- `index.html` — página principal.
- `style.css` — estilos e layout responsivo.
- `script.js` — interações, animações e efeitos visuais.
- `assets/images/` — logotipo e imagens utilizadas pelo site.
- `games/memoria/` — jogo da memória histórico integrado, com HTML, CSS, JavaScript e imagens próprios.

## Recursos

- Seções de apresentação, projetos, jogos, serviços, depoimentos, contato e referências.
- Navegação adaptável, revelação de conteúdo durante a rolagem e animações.
- Campo visual animado no destaque inicial, com alternativa em canvas 2D caso Three.js não esteja disponível.
- Jogo da memória com personagens históricos, acessível em `games/memoria/index.html`.
- Respeito à preferência do navegador por movimento reduzido em parte dos efeitos.

## Executar localmente

Não é necessário build. Na raiz do repositório, selecione esta branch e inicie um servidor estático:

```bash
git switch xbyte-games-studios
python3 -m http.server 8000
```

Acesse <http://localhost:8000>. O jogo da memória pode ser aberto em <http://localhost:8000/games/memoria/>.

A página usa bibliotecas e fontes externas via CDN — entre elas Three.js, GSAP, Font Awesome e Google Fonts — para alguns efeitos e recursos visuais. Uma conexão com a internet é necessária para carregá-las; o código inclui alternativas para parte das animações quando as bibliotecas de movimento não estão disponíveis.

## Navegar entre versões

A versão original está na branch [`main`](https://github.com/soareslfsantosc-cyber/xbyte-studios/tree/main). Consulte o [README do primeiro site](https://github.com/soareslfsantosc-cyber/xbyte-studios/blob/main/README_SITE_1.md).
