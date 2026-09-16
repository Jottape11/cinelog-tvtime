# Requirements — CineLog (O Novo TV Time)

> **Checkpoint 1 — Web Development (2º Trimestre / 2026)**  
> **Instituição:** FIAP — Turma: 1ESPW  
> **Professor:** Caio Oliveira  
> **Integrantes:** João Pedro Sá e Gustavo Rezende Louro

### Nome

**CineLog** (Subtítulo: _O Novo TV Time_)

### Problema

Com o encerramento das operações do TV Time em 2026, milhões de cinéfilos e maratonistas de séries perderam seu histórico e ficaram sem uma plataforma moderna e unificada para descobrir o que assistir, verificar em quais serviços de streaming as produções estão disponíveis no Brasil e calcular com exatidão suas horas de vida gastas assistindo filmes.

### Público

Fãs de cinema e audiovisual que buscam uma alternativa limpa, cinematográfica e sem poluição comercial para registrar filmes vistos, escrever críticas pessoais, acompanhar onde assistir no streaming brasileiro e descobrir novas produções de forma dinâmica.

### Proposta de solução

Uma aplicação web responsiva em React que consome a API do TMDB (The Movie Database), oferecendo catálogo com lançamentos de 2025/2026, busca instantânea, página de detalhes com divisão de streaming (_Incluso na Assinatura_ e _Aluguel & Compra Digital_), recomendador interativo no formato **CineMatch** (swipe de cartas inspirado no Tinder), avaliação de 1 a 5 estrelas acompanhada de campo para escrita de resenhas/críticas, cálculo do tempo de vida gasto assistindo filmes (em dias, horas e minutos) e Hall da Fama com os Top 3 atores mais assistidos.

---

## 2. Objetivo do MVP

Entregar uma Single Page Application (SPA) em React plenamente funcional, responsiva e alinhada com as diretrizes do Prof. Caio Oliveira (FIAP 1ESPW), permitindo:

1. **Exploração do Catálogo & Filtro Streaming:** Navegar por títulos do cinema e filtrar por plataformas brasileiras (Netflix, Prime Video, Max, Disney+, Apple TV+);
2. **Ficha Técnica & Onde Assistir:** Visualizar detalhes, pôster 2:3, sinopse, duração, classificação indicativa, elenco principal com fotos e provedores de streaming divididos por modelo de acesso;
3. **Avaliação & Crítica Pessoal:** Marcar filmes como assistidos, atribuir notas de 1 a 5 estrelas e redigir resenhas pessoais salvas localmente no `localStorage`;
4. **Calculadora de Horas de Vida Gastas:** Computar a soma da minutagem oficial de todos os filmes assistidos e exibir estatísticas consolidadas (dias, horas consecutivas e minutos de imersão);
5. **CineMatch (Modo Descoberta):** Descobrir filmes através de cartas empilhadas com opções de passar ou dar match para alimentar a fila do dia;
6. **Hall da Fama (Top 3 Atores):** Destacar os 3 atores mais assistidos no perfil pessoal com medalhas de Ouro, Prata e Bronze.

---

## 3. Metodologia SDD & Protótipo Google Stitch

Antes da implementação em React, o design do sistema foi desenvolvido e prototipado no **Google Stitch** (`https://stitch.withgoogle.com/projects/17388927452232081278`), estabelecendo as especificações visuais exatas:

- Paleta cinematográfica escura: `#0D0F12` (superfície), `#161A20` (cards elevados), `#212730` (bordas), `#E50914` (destaque de ação), `#00E054` (verde Letterboxd), `#F5C518` (amarelo de avaliação).
- Proporção estrita de pôster 2:3 para todos os cards do catálogo.
- Componente Bento Grid para divisão equilibrada entre títulos em alta e teaser do CineMatch.

---

## 4. Funcionalidades Detalhadas

### F01 — Catálogo e Busca de Filmes

**Descrição:** Exibe produções cinematográficas em alta e permite pesquisar por título, diretor ou ator em tempo real.

- [x] Grid responsivo com proporção 2:3, nota TMDB e pílula de streaming;
- [x] Barra de pesquisa rápida com atalho visual `⌘K`;
- [x] Filtros ágeis por provedor de streaming no Brasil.

**Estados:**

- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio
- [x] Erro

---

### F02 — Detalhes do Filme & Onde Assistir no Brasil

**Descrição:** Rota dinâmica (`/filme/:id`) com backdrop amplo, dados técnicos e seção onde assistir dividida entre _Incluso na Assinatura_ e _Aluguel & Compra Digital_.

- [x] Carregamento dinâmico baseado no `:id` da rota;
- [x] Logos e badges vetorizados oficiais de cada plataforma de streaming;
- [x] Elenco principal com fotos circulares, nomes dos personagens e tags de destaque;
- [x] Duração oficial em minutos e horas formatadas.

**Estados:**

- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio
- [x] Erro

---

### F03 — Avaliação, Crítica Pessoal e Registro de Assistidos

**Descrição:** Permite ao usuário registrar que assistiu ao filme, selecionar nota de 1 a 5 estrelas e escrever sua crítica pessoal.

- [x] Seletor de estrelas interativo no estilo Letterboxd;
- [x] Campo de formulário para escrita e edição de resenhas críticas;
- [x] Persistência automática no `localStorage`.

**Estados:**

- [x] Inicial
- [x] Sucesso
- [x] Vazio
- [x] Erro

---

### F04 — Calculadora de Horas de Vida Gastas

**Descrição:** Soma os minutos de duração de todos os títulos marcados como assistidos e decompõe o total em dias, horas consecutivas e minutos de imersão.

- [x] Cálculo cumulativo preciso;
- [x] Barras de progresso visual de tempo dedicado ao cinema;
- [x] Atualização reativa e instantânea na Navbar e na página de Perfil.

**Estados:**

- [x] Inicial
- [x] Sucesso
- [x] Vazio

---

### F05 — CineMatch (Recomendações Estilo Tinder)

**Descrição:** Descoberta gamificada de títulos com cartas empilhadas em profundidade, carimbos visuais de "QUERO ASSISTIR" e "PASSAR", atalhos pelo teclado e fila acumulada.

- [x] Pilha com profundidade 3D e carta ativa destacada;
- [x] Botões circulares de ação rápida e atalhos de teclado (seta esquerda / seta direita);
- [x] Painel lateral com a "Fila CineMatch de Hoje".

**Estados:**

- [x] Inicial
- [x] Carregando
- [x] Sucesso
- [x] Vazio (quando todas as sugestões forem avaliadas)
- [x] Erro

---

### F06 — Perfil com Hall da Fama (Top 3 Atores)

**Descrição:** Perfil do cinéfilo com avatar PRO, biografia, resumo das horas de vida, listagem dos títulos assistidos com notas/críticas e pódio dos atores mais assistidos.

- [x] Pódio com medalhas de 1º Ouro, 2º Prata e 3º Bronze;
- [x] Abas para alternar entre "Filmes Assistidos & Reviews" e "Quero Assistir / Matches";
- [x] Opção para editar nota ou remover título.

**Estados:**

- [x] Inicial
- [x] Sucesso
- [x] Vazio

---

## 5. Fora do Escopo

- Reprodução direta ou streaming pirata de vídeo no próprio app (o CineLog atua como guia e diário, indicando as plataformas legais);
- Backend com banco de dados relacional e cadastro de senhas (toda a persistência necessária para o MVP é gerida via `localStorage`);
- Chat síncrono multiusuário em tempo real;
- Aplicativo móvel nativo (iOS/Android) — foco total em web responsiva compatível com todos os navegadores modernos.
