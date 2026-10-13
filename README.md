# Xbyte Studios

Repositório dos sites da **Xbyte Studios**. Ele contém duas versões do projeto, mantidas em branches separadas para que o site original e sua modernização possam ser consultados sem misturar os arquivos.

## Versões do site

| Versão | Branch | Página inicial | Documentação |
|---|---|---|---|
| Primeiro site — versão original | [`main`](https://github.com/soareslfsantosc-cyber/xbyte-studios/tree/main) | `index.html` | [README do primeiro site](README_SITE_1.md) |
| Segundo site — versão modernizada | [`xbyte-games-studios`](https://github.com/soareslfsantosc-cyber/xbyte-studios/tree/xbyte-games-studios) | `index.html` | [README do segundo site](https://github.com/soareslfsantosc-cyber/xbyte-studios/blob/xbyte-games-studios/README_SITE_2.md) |

> Para ver cada versão no GitHub, abra a branch correspondente. A página inicial de ambas se chama `index.html`, mas o conteúdo e os recursos variam entre as branches.

## Executar localmente

Os dois sites são projetos front-end estáticos e não precisam de etapa de build. Clone o repositório, escolha a branch e inicie um servidor local:

```bash
git clone https://github.com/soareslfsantosc-cyber/xbyte-studios.git
cd xbyte-studios
# Para o primeiro site:
git switch main
# Ou, para o segundo site:
# git switch xbyte-games-studios
python3 -m http.server 8000
```

Acesse <http://localhost:8000>.

## Documentação por versão

- [Primeiro site — versão original (`main`)](README_SITE_1.md)
- [Segundo site — versão modernizada (`xbyte-games-studios`)](https://github.com/soareslfsantosc-cyber/xbyte-studios/blob/xbyte-games-studios/README_SITE_2.md)
