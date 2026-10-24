# XBYTE Games Studios — site com jogos integrados

## O que foi integrado

- **Jogo da Memória — Personagens Históricos:** substituído pela versão mais recente enviada. Os arquivos antigos da pasta `games/memoria/` foram removidos e trocados pelos arquivos do novo ZIP.
- **Ping Pong:** adicionado em `games/tennis/`.
- **Lost Deity:** adicionado em `games/lost-deity/`, com suas imagens, scripts e estilos preservados em uma pasta isolada.

A seção “Jogos Disponíveis” da página inicial agora apresenta os três jogos e abre cada um em uma nova aba. O layout de jogo único foi removido para que os cartões possam se organizar em grade responsiva.

## Como abrir

Nesta branch, o conteúdo da pasta `xbyte_modernized/` do ZIP foi colocado diretamente na raiz do repositório. Abra `index.html` ou inicie um servidor estático na raiz, por exemplo com `python3 -m http.server 8000`. O Lost Deity usa bibliotecas Three.js carregadas de CDN e, portanto, requer conexão com a internet para esses efeitos.

## Comentários no código

As alterações de integração na página e no CSS estão identificadas com comentários em português. Os HTMLs de entrada dos jogos receberam comentários explicando seus pontos de entrada e a organização dos recursos. Os scripts e estilos originais dos jogos foram mantidos sem reescrita linha a linha para preservar o funcionamento e a autoria do código recebido; eles contêm a lógica do jogo e devem ser comentados adicionalmente se você desejar documentação detalhada de cada função.
