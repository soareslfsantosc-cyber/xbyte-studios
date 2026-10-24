# Segundo site — versão modernizada

**Branch:** [`xbyte-games-studios`](https://github.com/soareslfsantosc-cyber/xbyte-studios/tree/xbyte-games-studios)

**Página inicial:** `index.html`

Esta é a versão final integrada do segundo site da Xbyte Studios. A página inicial e os recursos estáticos ficam diretamente na raiz da branch, sem uma pasta `xbyte_modernized/` duplicada. A vitrine apresenta três jogos e conserva os comentários em português adicionados aos pontos de integração.

## Estrutura

- `index.html` — página principal e seção “Jogos Disponíveis”.
- `style.css` e `script.js` — layout responsivo, interações e efeitos visuais.
- `assets/demos/` e `assets/images/` — demonstrações, logotipo e imagens do site.
- `games/lost-deity/` — jogo Lost Deity, com seus próprios scripts, estilos e recursos.
- `games/memoria/` — jogo da memória com personagens históricos.
- `games/tennis/` — jogo Ping Pong.
- `LEIA-ME-INTEGRACAO.md` — notas sobre a integração dos jogos.

## Jogos integrados

| Jogo | Página |
|---|---|
| Lost Deity | `games/lost-deity/index.html` |
| Jogo da Memória — Personagens Históricos | `games/memoria/index.html` |
| Ping Pong | `games/tennis/index.html` |

## Executar localmente

Não é necessário build. Na raiz do repositório, selecione a branch e inicie um servidor estático:

```bash
git switch xbyte-games-studios
python3 -m http.server 8000
```

Acesse <http://localhost:8000>. O Lost Deity usa bibliotecas Three.js via CDN para alguns efeitos, portanto esses efeitos precisam de conexão com a internet.

## Navegar entre versões

A versão original está na branch [`main`](https://github.com/soareslfsantosc-cyber/xbyte-studios/tree/main). Consulte o [README do primeiro site](https://github.com/soareslfsantosc-cyber/xbyte-studios/blob/main/README_SITE_1.md).
