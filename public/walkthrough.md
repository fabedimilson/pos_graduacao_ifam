# Atualização do Portal SouPós IFAM

Finalizamos uma grande atualização no sistema com base nas suas referências de grandes universidades (Unisinos e MBA USP/ESALQ) e exigências institucionais.

## 1. Destaque Dinâmico do Menu Ativo (Header)

Corrigimos o problema em que o botão "Início" permanecia destacado mesmo ao rolar a página ou acessar outras seções:
- **Estado Reativo e Listener ([App.tsx](file:///c:/Users/otran/Documents/Pos_graduacao/src/App.tsx)):** Adicionamos o estado `activeTab` e criamos um listener para o evento `hashchange` da janela do navegador. Agora, ao carregar a página ou clicar nos links internos (`#programas`, `#editais`, `#eventos`), o menu correspondente ganha o destaque visual imediatamente (fundo verde ou glow neon), e o botão "Início" é desmarcado de forma automática.
- **Scroll para Todas as Seções:** Adicionamos as âncoras `id="sobre"` (na seção de diferenciais) e `id="contato"` (no rodapé institucional), permitindo que todos os menus da barra redirecionem o usuário para o local correto ao serem clicados.

## 2. Preparação do Servidor e Banco de Dados Local (Express + SQLite)

Iniciamos a estruturação técnica para mover os dados mockados em memória para um banco de dados local físico e persistente:
- **Banco de Dados SQLite Físico ([database.db](file:///c:/Users/otran/Documents/Pos_graduacao/server/database.db)):** Criamos uma base de dados local SQLite3 rodando diretamente em arquivo no projeto.
- **Estruturação de Schema SQL ([schema.sql](file:///c:/Users/otran/Documents/Pos_graduacao/server/schema.sql)):** Definimos a modelagem de tabelas completas para cursos, disciplinas, editais, candidatos, professores, alunos, sugestões e configurações de certificados.
- **Script de Inicialização e População Automática ([db.js](file:///c:/Users/otran/Documents/Pos_graduacao/server/db.js) e [seed.js](file:///c:/Users/otran/Documents/Pos_graduacao/server/seed.js)):** Ao rodar o servidor, a estrutura do banco é verificada e os dados iniciais do projeto são importados automaticamente do arquivo de mock.
- **Servidor Express.js Ativo ([server.js](file:///c:/Users/otran/Documents/Pos_graduacao/server/server.js)):** Criamos APIs completas de consulta e modificação dos registros (endpoints `/api/...`).
- **Integração Concorrente via Proxy ([vite.config.ts](file:///c:/Users/otran/Documents/Pos_graduacao/vite.config.ts) e [package.json](file:///c:/Users/otran/Documents/Pos_graduacao/package.json)):**
  - O comando `npm run dev` agora inicia o servidor de banco de dados (porta 3000) e o cliente Vite (porta 5174) de forma paralela via `concurrently`.
  - Configuramos um proxy no Vite para encaminhar automaticamente todas as chamadas de `/api` para a API Express de forma transparente e livre de CORS.

## 3. Ajuste de Tamanho e Fixação do Cabeçalho

Corrigimos a espessura do cabeçalho e otimizamos o layout fixo para torná-lo mais robusto, visível e equilibrado:
- **Aumento de Altura ([App.tsx](file:///c:/Users/otran/Documents/Pos_graduacao/src/App.tsx)):** Mudamos o preenchimento vertical e horizontal do cabeçalho para `py-5 px-8`, deixando a barra mais encorpada e valorizando melhor o espaço do topo.
- **Cabeçalho Sticky Fixo:** O cabeçalho é configurado com `fixed-header` no topo, garantindo que ele permaneça perfeitamente fixado no topo de forma legível e premium.
- **Compensação no Banner Hero ([index.css](file:///c:/Users/otran/Documents/Pos_graduacao/src/index.css)):** Aumentamos o desconto no cálculo de altura do hero para `calc(100vh - 78px)` (com altura máxima ajustada para `615px`), mantendo a garantia de que o banner, os botões e a faixa de estatísticas caibam na tela de visualização sem rolagem.

## 4. Alteração de Idioma (Evitar Sugestão de Tradução)

- **Correção no HTML ([index.html](file:///c:/Users/otran/Documents/Pos_graduacao/index.html)):** Alteramos a tag `<html lang="en">` para `<html lang="pt-BR">`. Isso corrige o problema do navegador identificar o site como em inglês e sugerir a tradução automática.
