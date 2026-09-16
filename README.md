# CineLog — O Novo TV Time

Aplicação web cinematográfica desenvolvida para o **Checkpoint 1 de Web Development (2º Trimestre / 2026)** da FIAP.

- **Instituição:** FIAP — Faculdade de Informática e Administração Paulista
- **Curso:** Engenharia de Software / Análise e Desenvolvimento de Sistemas (Turma 1ESPW)
- **Professor:** Caio Oliveira
- **Integrantes do Grupo:**
  - João Pedro Sá
  - Gustavo Rezende Louro

---

## 1. O Problema

Com o encerramento definitivo das operações do **TV Time** em julho de 2026, milhões de cinéfilos e maratonistas no mundo todo ficaram sem sua ferramenta diária de acompanhamento. Surgiram quatro dores críticas:

1. **Onde Assistir no Brasil:** Grande parte das plataformas internacionais não informa com precisão a disponibilidade nos catálogos brasileiros (Netflix, Prime Video, Max, Disney+, Apple TV+, etc.), nem diferencia o que está incluso na assinatura do que exige aluguel digital.
2. **Perda de Histórico e Horas de Vida:** Usuários gostavam de acompanhar o cálculo de quantas horas e dias da sua vida já dedicaram ao cinema e às séries.
3. **Avaliação com Opinião Crítica:** Necessidade de registrar não apenas uma nota em estrelas (estilo Letterboxd), mas também escrever resenhas e críticas pessoais de cada obra.
4. **Fadiga de Decisão:** Dificuldade em escolher o que assistir em meio a catálogos gigantes, precisando de um recomendador ágil e divertido.

---

## 2. A Solução (CineLog)

O **CineLog** foi concebido como o verdadeiro sucessor do TV Time, reunindo o melhor da experiência cinematográfica com uma interface escura sólida e moderna:

- **Catálogo 2025 & 2026:** Mais de 45 produções contemporâneas com dados sincronizados via API oficial do TMDB (The Movie Database).
- **Onde Assistir no Brasil:** Seção com badges vetorizados oficiais dividida entre _Incluso na Assinatura_ e _Aluguel & Compra Digital_.
- **Calculadora de "Horas de Vida Gastas":** Soma a duração oficial (`runtime`) em minutos de todos os filmes marcados como assistidos, convertendo em Dias, Horas Consecutivas e Minutos de Imersão.
- **Avaliação em 5 Estrelas & Crítica Pessoal:** Seletor interativo em verde Letterboxd (`#00e054`) acompanhado de campo de texto para redigir e editar sua resenha pessoal, salva no `localStorage`.
- **CineMatch (Descoberta estilo Tinder):** Recomendador com cartas empilhadas em profundidade 3D, carimbos visuais de "QUERO ASSISTIR" e "PASSAR", atalhos pelo teclado (setas) e fila acumulada para maratonar.
- **Hall da Fama (Top 3 Atores):** Identificação e exibição dos 3 atores mais presentes nas produções assistidas pelo usuário, com medalhas de 1º Ouro, 2º Prata e 3º Bronze.

---

## 3. Metodologia Spec-Driven Development (SDD) & Google Stitch

Em total conformidade com as orientações do professor Caio Oliveira, o projeto foi desenvolvido seguindo a metodologia **Spec-Driven Development (SDD)**:

1. **Especificação Prévia:** Elaboração dos documentos formais em `docs/` (`requirements.md`, `architecture.md`, `references.md`) antes de qualquer linha de código React.
2. **Prototipagem Rápida no Google Stitch:** Desenvolvemos um protótipo interativo no **Google Stitch** ([Acessar Projeto Stitch](https://stitch.withgoogle.com/projects/17388927452232081278)) para definir o design cinematográfico, hierarquia visual dos cards 2:3, estrutura Bento Grid e separação dos provedores de streaming.
3. **Implementação Fiel em React Puro:** Todo o protótipo visual foi transcrito para código React limpo com CSS modular, respeitando estritamente o que foi ensinado em sala de aula.

---

## 4. Tecnologias Utilizadas

Utilizamos exclusivamente as tecnologias e padrões permitidos na disciplina (sem Tailwind, sem Bootstrap, sem Axios e sem bibliotecas externas de componentes):

- **React 19** com componentes funcionais e JSX.
- **Vite** como ferramenta de empacotamento e servidor de desenvolvimento ágil.
- **React Router (v7)** configurado no modo Data (`createBrowserRouter`, `RouterProvider`, `Outlet`, `Link`, `useParams`).
- **Hooks nativos:** `useState` para estado reativo local e `useEffect` para consumo assíncrono e sincronização.
- **CSS Puro:** Estilização modular com variáveis de design tokens, CSS Flexbox e CSS Grid responsivo.
- **Ícones SVG Reicon:** Ícones limpos vetorizados baseados na extensão Reicon (`devchauhan.reicon`).
- **Consumo de API:** The Movie Database (TMDB) através de `fetch()` nativo com a regra dos dois `await`.
- **Persistência Local:** `localStorage` do navegador para manter o diário de filmes, notas, resenhas e fila do CineMatch.

---

## 5. Estrutura de Pastas

```text
proximo-tv-time/
├── docs/
│   ├── requirements.md              # Requisitos de produto, critérios e estados
│   ├── architecture.md              # Rotas, componentes, estado e dependências
│   └── references/
│       ├── references.md            # Análise das referências (Letterboxd, Ingresso, Spotify, Tinder, Stitch)
│       └── imagens/                 # Prints comprobatórios das referências visuais
├── public/
│   └── favicon.svg                  # Favicon oficial do CineLog
├── src/
│   ├── components/
│   │   ├── Navbar/                  # Cabeçalho com busca ⌘K, métricas ao vivo e logo
│   │   ├── MovieCard/               # Card de filme 2:3 com badges e pílula de streaming
│   │   ├── StarRating/              # Seletor interativo em estrelas verdes Letterboxd
│   │   ├── WatchProviders/          # Logos e divisão de streaming no Brasil
│   │   ├── CineMatchCard/           # Card para o recomendador interativo
│   │   ├── TopActors/               # Hall da Fama pessoal (Ouro, Prata, Bronze)
│   │   ├── Footer/                  # Rodapé completo institucional e acadêmico
│   │   └── Icons.jsx                # Biblioteca de ícones SVG Reicon
│   ├── pages/
│   │   ├── Home/                    # Hero Destaque, filtro Brasil e Bento Grid
│   │   ├── Details/                 # Rota dinâmica (/filme/:id) com streaming, elenco e crítica
│   │   ├── Match/                   # CineMatch com swipe estilo Tinder e fila do dia
│   │   ├── Profile/                 # Horas de vida gastas, Hall da Fama e histórico
│   │   └── NotFound/                # Página 404 para rotas não mapeadas
│   ├── services/
│   │   ├── catalogData.js           # Base curada de filmes 2025/2026 com metadados
│   │   └── tmdb.js                  # Métodos de consumo e busca do TMDB
│   ├── App.jsx                      # Layout raiz com Navbar, Outlet e Footer
│   ├── main.jsx                     # createBrowserRouter e RouterProvider
│   └── index.css                    # Tokens de cor cinematográficos e utilitários
├── package.json
└── README.md
```

---

## 6. Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js instalado (versão 18 ou superior).

### Instruções:

1. Abra o terminal na pasta do projeto:
   ```bash
   cd proximo-tv-time
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local com o Vite:
   ```bash
   npm run dev
   ```
4. Acesse o endereço no seu navegador (geralmente `http://localhost:5173`).
5. Para testar o build de produção:
   ```bash
   npm run build
   ```

---

## 7. Uso Ético e Transparência no Uso de IA

Seguindo as diretrizes de transparência do Checkpoint de Web Development:

- A inteligência artificial foi empregada como ferramenta de suporte metodológico no fluxo de **Spec-Driven Development**, auxiliando na estruturação textual dos arquivos da pasta `docs/`, refinamento de lógica matemática para conversão de minutos em horas/dias e sugestões de arquitetura de pastas.
- O aluno foi o responsável direto por todas as decisões de produto (escolha do problema deixado pelo TV Time, definição do nome CineLog, inclusão do CineMatch com dinâmica do Tinder, separação dos provedores de streaming no Brasil), aprovação do protótipo no Google Stitch e revisão linha a linha de cada componente e estilo CSS para garantir autenticidade acadêmica total.
