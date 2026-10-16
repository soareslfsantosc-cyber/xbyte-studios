# Desafio DIO: Planejando Automações com n8n Usando Apenas Bons Prompts

**Projeto:** Xbyte FlowDesk, automação de solicitações de suporte  
**Autor:** Lucas Fabiano  
**Objetivo:** demonstrar como um prompt bem estruturado pode orientar uma IA no planejamento de uma automação no n8n, com requisitos claros, validações e tratamento de falhas.

---

## 1. Definição da automação

### Problema

Uma empresa de tecnologia recebe solicitações de suporte por diferentes canais. O registro manual pode causar atrasos, perda de informações, chamados duplicados e falta de acompanhamento.

A proposta é planejar um workflow no n8n que receba solicitações por webhook, valide os dados, normalize as informações, classifique a prioridade, registre o chamado em uma base de dados e notifique a equipe responsável.

### Usuários

- Clientes que precisam solicitar suporte.
- Equipe técnica que recebe e acompanha os chamados.
- Administradores que precisam de um histórico organizado.

### Resultado esperado

Cada solicitação válida deve gerar um registro rastreável, com identificador, data de abertura, categoria, prioridade e status inicial. Solicitações inválidas devem receber uma resposta clara, sem criar registros incompletos. Falhas técnicas devem ser registradas e sinalizadas sem expor dados sensíveis.

### Escopo inicial

A primeira versão é uma prova de conceito. Não exige um portal completo, autenticação de clientes ou serviços pagos. O fluxo deve ser modular para permitir futuras integrações.

---

## 2. Contexto, ferramentas e regras

### Ferramentas previstas

- **n8n:** orquestração do workflow.
- **Webhook:** entrada para receber dados em JSON.
- **Edit Fields (Set) e/ou Code:** normalização e validação, escolhendo a alternativa mais simples e segura.
- **IF ou Switch:** separar solicitações válidas e inválidas e rotear por prioridade.
- **PostgreSQL:** armazenamento preferencial. Se não houver uma instância disponível, a IA deve sugerir uma alternativa de demonstração e explicar suas limitações.
- **E-mail ou outro canal configurável:** notificação da equipe, sem presumir que credenciais estejam conectadas.
- **Error Trigger ou workflow de erro:** monitoramento de falhas, quando adequado à versão e à configuração do n8n.

### Dados de entrada esperados

O webhook deve receber um objeto JSON semelhante a este. Os dados são fictícios e servem apenas como exemplo:

```json
{
  "nome": "Marina Souza",
  "email": "marina@example.com",
  "assunto": "Não consigo acessar minha conta",
  "descricao": "Ao tentar entrar, recebo uma mensagem de erro.",
  "categoria": "acesso",
  "impacto": "alto",
  "origem": "site"
}
```

### Regras de validação

1. `nome`, `email`, `assunto` e `descricao` são obrigatórios.
2. O e-mail deve apresentar um formato plausível. A validação não deve afirmar que o endereço realmente existe.
3. Remover espaços desnecessários no início e no fim dos campos de texto.
4. Limitar o tamanho dos campos para evitar entradas excessivas.
5. Aceitar as categorias `acesso`, `hardware`, `software`, `rede` e `outros`. Valores desconhecidos devem ser normalizados para `outros` ou rejeitados, conforme regra documentada.
6. Calcular a prioridade por regras explícitas: impacto `alto` gera prioridade `alta`; `medio`, prioridade `media`; `baixo`, prioridade `baixa`. A IA deve explicar como tratar valores ausentes ou inesperados.
7. Cada chamado válido deve receber identificador único, data de criação e status inicial `aberto`.
8. Não registrar credenciais, senhas ou dados pessoais desnecessários nos logs.
9. Evitar criar um segundo chamado quando a mesma requisição for repetida. A IA deve propor uma estratégia de idempotência e explicar quais dados ou identificadores serão usados.
10. Nunca colocar credenciais, tokens ou segredos diretamente no código ou no prompt. Usar o gerenciamento seguro de credenciais oferecido pelo n8n.

### Fluxo lógico desejado

1. Receber a requisição no Webhook.
2. Verificar se o corpo está no formato esperado.
3. Normalizar os campos.
4. Validar os campos obrigatórios e o formato do e-mail.
5. Se os dados forem inválidos, responder com HTTP 400 e mensagem objetiva, sem gravar o chamado.
6. Se forem válidos, determinar a categoria e a prioridade.
7. Gerar ou validar uma chave de idempotência.
8. Registrar o chamado no banco de dados.
9. Enviar uma notificação à equipe após a gravação bem-sucedida.
10. Responder com HTTP 201 e o identificador do chamado criado.
11. Em caso de falha técnica, não retornar sucesso falso. Registrar o erro de maneira segura e responder com status apropriado.
12. Separar erros de validação de erros técnicos.

### Critérios de sucesso

- Requisições válidas criam um único chamado.
- Requisições inválidas não geram registros.
- O cliente recebe uma resposta HTTP coerente com o resultado.
- O registro contém os campos necessários para acompanhar o chamado.
- A equipe recebe notificação após o registro do chamado.
- Falhas podem ser identificadas sem expor dados sensíveis.
- O workflow pode ser testado com cenários de sucesso, validação e erro.

---

## 3. Prompt final para orientar uma IA

Copie e utilize o prompt abaixo em uma IA capaz de auxiliar no planejamento de workflows do n8n.

> **Papel e objetivo**
>
> Atue como especialista em automação de processos com n8n, integração de APIs, tratamento de dados e desenho de workflows confiáveis. Quero planejar uma automação chamada **Xbyte FlowDesk**, destinada ao registro inicial de solicitações de suporte de uma empresa de tecnologia.
>
> **Problema**
>
> Solicitações de suporte podem ser perdidas, registradas com dados incompletos ou demorar para chegar à equipe técnica. Quero automatizar a entrada, validação, classificação, gravação e notificação desses chamados.
>
> **Entrada**
>
> O workflow deve começar com um Webhook que receba JSON neste formato:
>
> ```json
> {
>   "nome": "Marina Souza",
>   "email": "marina@example.com",
>   "assunto": "Não consigo acessar minha conta",
>   "descricao": "Ao tentar entrar, recebo uma mensagem de erro.",
>   "categoria": "acesso",
>   "impacto": "alto",
>   "origem": "site"
> }
> ```
>
> Trate os valores como dados fictícios de exemplo.
>
> **Requisitos funcionais**
>
> 1. Receber a requisição via Webhook e explicar como configurar o método HTTP e o caminho do endpoint.
> 2. Normalizar espaços e validar os campos obrigatórios `nome`, `email`, `assunto` e `descricao`.
> 3. Validar o formato plausível do e-mail sem alegar que a caixa postal existe.
> 4. Definir limites razoáveis de tamanho para os campos e explicar como lidar com entradas muito longas.
> 5. Normalizar as categorias para `acesso`, `hardware`, `software`, `rede` ou `outros`.
> 6. Classificar a prioridade a partir do campo `impacto`, usando regras transparentes para `alto`, `medio` e `baixo`. Definir o que acontece com valores ausentes ou inválidos.
> 7. Gerar um identificador único para cada chamado e atribuir data de criação e status `aberto`.
> 8. Gravar os chamados em PostgreSQL. Caso isso exija infraestrutura não disponível, apresentar uma alternativa de teste e explicar suas limitações.
> 9. Propor uma estratégia de idempotência para impedir duplicidade quando a mesma requisição for enviada novamente. Não presumir a existência de um identificador externo que não esteja no JSON: explicar como ele seria acrescentado ou como outra chave segura poderia ser construída.
> 10. Após a gravação bem-sucedida, enviar uma notificação à equipe por um canal configurável, como e-mail. Não presumir que credenciais ou serviços estejam configurados.
> 11. Responder à requisição com HTTP 201 quando o chamado for criado, HTTP 400 quando os dados forem inválidos e um status apropriado para falhas técnicas.
> 12. Criar uma estratégia de tratamento de erros que diferencie validação, falha de banco e falha de notificação. A falha de notificação não deve apagar silenciosamente um chamado já registrado.
> 13. Proteger dados pessoais, não registrar segredos nos logs e utilizar o gerenciamento de credenciais do n8n.
>
> **Ferramentas e desenho**
>
> Escolha os nodes nativos do n8n mais adequados, considerando a versão atual da ferramenta. Considere Webhook, Edit Fields (Set), Code quando realmente necessário, IF/Switch, PostgreSQL, nós de notificação e um mecanismo de tratamento de erros. Não adicione nodes só para tornar o workflow mais complexo.
>
> **O que você deve entregar**
>
> A. Uma visão geral do workflow e do problema que resolve.  
> B. Um diagrama textual da sequência de nodes, com os caminhos de sucesso, validação e falha.  
> C. Uma tabela contendo nome do node, função, configuração principal, entrada e saída esperada.  
> D. O esquema SQL sugerido para a tabela de chamados, com chave primária, datas, status, categoria, prioridade e restrições relevantes.  
> E. As expressões ou o código necessários para normalização e validação, explicando cada parte.  
> F. A configuração de respostas do Webhook e exemplos de respostas JSON para sucesso, dados inválidos e falha técnica.  
> G. Uma proposta de idempotência que possa ser implementada e testada.  
> H. A configuração conceitual da notificação e o comportamento caso ela falhe após a gravação.  
> I. Um plano de testes com pelo menos estes cenários: chamado válido, campo obrigatório ausente, e-mail malformado, categoria desconhecida, impacto inválido, requisição repetida, indisponibilidade do banco e falha de notificação.  
> J. Instruções passo a passo para montar e testar o workflow na interface do n8n.  
> K. Uma lista das credenciais e variáveis que precisam ser configuradas, sem solicitar que eu as compartilhe no chat.
>
> **Restrições e qualidade**
>
> - Não invente credenciais, serviços já conectados ou configurações que não foram informadas.
> - Se uma configuração variar conforme a versão do n8n, identifique a diferença e recomende conferir a documentação oficial correspondente.
> - Explique claramente o que é configuração demonstrativa e o que exige infraestrutura real.
> - Evite expor dados pessoais ou informações sensíveis em logs.
> - Não considere a automação pronta só porque os nodes estão conectados: descreva como comprovar o funcionamento com testes.
> - Priorize clareza, manutenção, segurança e simplicidade.
>
> **Formato da resposta**
>
> Organize a resposta em seções numeradas, use tabelas quando ajudarem e inclua exemplos concretos. Termine com uma checklist de implementação e testes. Se faltar alguma informação essencial, declare a suposição adotada em vez de inventar fatos.

---

## 4. Checklist de entrega

- [ ] O problema e o objetivo da automação estão descritos.
- [ ] Os usuários e o resultado esperado estão definidos.
- [ ] As ferramentas e os dados de entrada estão especificados.
- [ ] As regras de validação e classificação estão claras.
- [ ] O prompt final reúne contexto, requisitos, restrições e formato de saída.
- [ ] O documento foi revisado e salvo em Markdown.
- [ ] O arquivo foi publicado em um local acessível, conforme as instruções da atividade.
- [ ] O link final foi enviado na plataforma da DIO.

## 5. Observação

Este documento apresenta o planejamento da automação por meio de prompt. Ele **não afirma que o workflow já foi implementado ou testado no n8n**. A execução real depende da montagem dos nodes, da configuração das credenciais e da realização dos testes descritos.
