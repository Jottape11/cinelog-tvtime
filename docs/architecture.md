# Architecture — CineLog (O Novo TV Time)

> **Checkpoint 1 — Web Development (2º Trimestre / 2026)**  
> **Instituição:** FIAP — Turma: 1ESPW  
> **Professor:** Caio Oliveira  
> **Integrantes:** João Pedro Sá e Gustavo Rezende Louro

O **CineLog** é desenvolvido como uma Single Page Application (SPA) em React utilizando o Vite como ferramenta de empacotamento e build rápido. A navegação entre as telas é gerenciada pela biblioteca `react-router` no **modo Data** com `createBrowserRouter` e `RouterProvider`, mantendo a hierarquia de rotas com layout base (`App.jsx`), `Navbar`, `Outlet` e `Footer`.

Toda a arquitetura visual e organização dos componentes foi projetada previamente através do protótipo no **Google Stitch** (`https://stitch.withgoogle.com/projects/17388927452232081278`), sendo transposta para componentes React puros estilizados com CSS modular/nativo, sem bibliotecas externas proibidas (como Tailwind CSS, Bootstrap, Axios ou Lucide), respeitando 100% dos ensinamentos do Prof. Caio Oliveira (FIAP / 1ESPW).

A persistência dos dados do usuário (filmes assistidos, notas, resenhas escritas e lista CineMatch) ocorre no `localStorage` do navegador de forma reativa.

---

## 2. Estrutura de Pastas

```text
src/
├── components/
│   ├── Navbar/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── MovieCard/
│   │   ├── MovieCard.jsx
│   │   └── MovieCard.css
│   ├── StarRating/
│   │   ├── StarRating.jsx
│   │   └── StarRating.css
│   ├── WatchProviders/
│   │   ├── WatchProviders.jsx
│   │   ├── ProviderLogos.jsx
│   │   └── WatchProviders.css
│   ├── CineMatchCard/
│   │   ├── CineMatchCard.jsx
│   │   └── CineMatchCard.css
│   ├── TopActors/
│   │   ├── TopActors.jsx
│   │   └── TopActors.css
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   └── Icons.jsx
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── Details/
│   │   ├── Details.jsx
│   │   └── Details.css
│   ├── Match/
│   │   ├── Match.jsx
│   │   └── Match.css
│   ├── Profile/
│   │   ├── Profile.jsx
│   │   └── Profile.css
│   └── NotFound/
│       ├── NotFound.jsx
│       └── NotFound.css
├── services/
│   ├── catalogData.js
│   └── tmdb.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 3. Páginas e Rotas (React Router — Modo Data)

| Página                    | Rota         | Objetivo                                                                                                                                                                                                        |
| :------------------------ | :----------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**                  | `/`          | Hero section com Destaque da Semana, filtro por streaming no Brasil, grid Bento do catálogo e widget de atalho para o CineMatch.                                                                                |
| **Detalhes**              | `/filme/:id` | Rota dinâmica com backdrop imersivo, pôster 2:3, sinopse, provedores de streaming (Assinatura e Aluguel), elenco com fotos circulares, formulário de crítica/review e estatísticas comunitárias com histograma. |
| **CineMatch**             | `/match`     | Descoberta gamificada estilo Tinder com pilha de cartas, carimbos visuais ("QUERO ASSISTIR" / "PASSAR"), atalhos de teclado e fila de reprodução lateral.                                                       |
| **Meu Perfil**            | `/perfil`    | Header PRO com dados do usuário, Hero Card de "Horas de Vida Gastas" (dias, horas e minutos com progress bars), Hall da Fama com Top 3 Atores e diário de filmes com notas e resenhas.                          |
| **Página Não Encontrada** | `*`          | Tratamento amigável para URLs inexistentes (404 Not Found).                                                                                                                                                     |

---

## 4. Componentes e Responsabilidades

| Componente       | Responsabilidade                                                                                                                               | Props                                                    |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| `Navbar`         | Cabeçalho fixo com logotipo CineLog do Stitch, links de navegação, campo de busca com atalho `⌘K`, widget de horas e avatar com status online. | `onBuscar`                                               |
| `MovieCard`      | Card de filme na proporção 2:3 com nota TMDB, botão rápido de assistido, pílula de streaming e avaliação em estrelas verdes.                   | `filme`, `assistido`, `notaUsuario`, `onToggleAssistido` |
| `StarRating`     | Seletor interativo de notas de 1 a 5 estrelas no padrão Letterboxd (`#00e054`).                                                                | `notaAtual`, `onAvaliar`, `readonly`, `tamanho`, `cor`   |
| `WatchProviders` | Apresenta os serviços de streaming no Brasil divididos entre _Incluso na Assinatura_ e _Aluguel & Compra Digital_.                             | `providers`                                              |
| `TopActors`      | Hall da Fama pessoal exibindo os 3 atores mais presentes nos filmes assistidos com medalhas de 1º Ouro, 2º Prata e 3º Bronze.                  | `atores`                                                 |
| `Footer`         | Rodapé com 4 colunas estilizadas: Identidade e versão do CineLog, dados acadêmicos (FIAP 1ESPW), fontes de dados (TMDB) e links rápidos.       | Nenhuma                                                  |

---

## 5. Estado da Aplicação e Persistência

| Estado                             | Onde é controlado?                        | Motivo e Justificativa                                                                                        |
| :--------------------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `todosFilmes` / `filmesExibidos`   | `Home.jsx`                                | Armazena o catálogo e aplica filtros instantâneos por texto ou streaming sem recarregar.                      |
| `assistidos` (com notas e reviews) | `localStorage` (`cinelog_assistidos`)     | Registra os filmes vistos pelo usuário, suas notas de 1 a 5 estrelas, a resenha escrita e a data de registro. |
| `queroAssistir`                    | `localStorage` (`cinelog_quero_assistir`) | Armazena a fila de filmes favoritados durante a sessão no CineMatch.                                          |
| `carregando` / `erro`              | Páginas (`Home`, `Details`, `Match`)      | Garante o controle dos 5 estados obrigatórios ensinados em aula (Inicial, Carregando, Sucesso, Vazio e Erro). |
| `indexAtual` / `stamp`             | `Match.jsx`                               | Controla qual carta da pilha está ativa e qual carimbo visual exibir no swipe.                                |

---

## 6. Ciclo de Vida e `useEffect`

| Efeito                        | Quando acontece?                      | O que faz?                                                                               |
| :---------------------------- | :------------------------------------ | :--------------------------------------------------------------------------------------- |
| Carregamento do Catálogo      | Montagem da `Home` (`[queryParam]`)   | Dispara busca dos títulos em alta ou pesquisa filtrada por termo.                        |
| Sincronização de Estatísticas | Montagem da `Navbar` e `Profile`      | Lê a minutagem de todos os assistidos no `localStorage` e calcula o total de horas/dias. |
| Detalhes da Produção          | Mudança do `:id` na rota de `Details` | Carrega dados completos do filme, elenco com fotos e disponibilidade de streaming.       |
| Pilha do CineMatch            | Montagem da página `Match`            | Carrega recomendações excluindo os títulos que o usuário já marcou como vistos.          |

---

## 7. Dependências e Padrões Técnicos

| Dependência                 | Uso                                   | Motivo de Escolha                                                               |
| :-------------------------- | :------------------------------------ | :------------------------------------------------------------------------------ |
| `react` & `react-dom` (v19) | Componentização e renderização do DOM | Tecnologia principal da disciplina de Web Development.                          |
| `react-router` (v7)         | Roteamento dinâmico SPA no modo data  | Padrão obrigatório ensinado pelo Prof. Caio Oliveira com `createBrowserRouter`. |
| `vite` (v6)                 | Bundler e ferramenta de build         | Ambiente de desenvolvimento ultra-rápido recomendado no curso.                  |

---

## 8. Integração com a API TMDB e Resiliência de Dados (Fallback Local)

A aplicação consome a API oficial do **The Movie Database (TMDB v3)** através de funções assíncronas nativas com `fetch()` e a regra dos dois `await` ensinada pelo Prof. Caio Oliveira em [`src/services/tmdb.js`](file:///c:/Users/jpmas/Downloads/CP1-WebDev/proximo-tv-time/src/services/tmdb.js).

Como boa prática de engenharia de software e resiliência de frontend (**Graceful Degradation**):

- Caso a chave de API (`VITE_TMDB_API_KEY`) esteja configurada no `.env`, as requisições buscam dados em tempo real nos servidores do TMDB;
- Caso a chave não tenha sido informada ou a rede do ambiente de apresentação/avaliação sofra instabilidade ou bloqueio de firewall, o serviço aciona de forma transparente o catálogo local auditado em [`src/services/catalogData.js`](file:///c:/Users/jpmas/Downloads/CP1-WebDev/proximo-tv-time/src/services/catalogData.js) (com 45 produções reais de 2025/2026 e imagens oficiais). Isso assegura que a aplicação permaneça 100% funcional e estável durante a avaliação acadêmica.
