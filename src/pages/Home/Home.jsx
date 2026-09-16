import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import {
  getFilmesPopulares,
  pesquisarFilmes,
  getBackdropUrl,
} from "../../services/tmdb";
import MovieCard from "../../components/MovieCard/MovieCard";
import {
  IconStar,
  IconCheck,
  IconPlay,
  IconBookmark,
  IconSearch,
  IconFlame,
  IconClose,
  IconHeart,
} from "../../components/Icons";
import "./Home.css";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [todosFilmes, setTodosFilmes] = useState([]);
  const [filmesExibidos, setFilmesExibidos] = useState([]);
  const [provedorFiltro, setProvedorFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [assistidos, setAssistidos] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [deckActionFeedback, setDeckActionFeedback] = useState(null);

  // Carregar dados salvos no localStorage
  useEffect(() => {
    function carregarSalvos() {
      const salvosAssistidos =
        JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
      const salvosWatchlist =
        JSON.parse(localStorage.getItem("cinelog_watchlist")) || [];
      setAssistidos(salvosAssistidos);
      setWatchlist(salvosWatchlist);
    }
    carregarSalvos();
    window.addEventListener("storage", carregarSalvos);
    return () => window.removeEventListener("storage", carregarSalvos);
  }, []);

  // Carregar filmes da API / Catalogo
  useEffect(() => {
    async function carregarFilmes() {
      setCarregando(true);
      setErro(null);
      try {
        let dados = [];
        if (queryParam.trim()) {
          dados = await pesquisarFilmes(queryParam);
        } else {
          dados = await getFilmesPopulares();
        }
        setTodosFilmes(dados);
        setFilmesExibidos(dados);
      } catch (err) {
        setErro("Não foi possível carregar os títulos do catálogo.");
      } finally {
        setCarregando(false);
      }
    }

    carregarFilmes();
  }, [queryParam]);

  // Filme destaque para o Hero (Duna Parte 2 ou primeiro do catalogo)
  const filmeHero =
    todosFilmes.find((f) => String(f.id) === "693134") ||
    todosFilmes[0] ||
    null;

  const isHeroAssistido =
    filmeHero && assistidos.some((f) => f.id === filmeHero.id);
  const isHeroWatchlist =
    filmeHero && watchlist.some((f) => f.id === filmeHero.id);

  function toggleHeroAssistido() {
    if (!filmeHero) return;
    const salvos = JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
    let atualizados = [];

    if (isHeroAssistido) {
      atualizados = salvos.filter((f) => f.id !== filmeHero.id);
    } else {
      atualizados = [
        {
          id: filmeHero.id,
          title: filmeHero.title,
          poster_path: filmeHero.poster_path,
          vote_average: filmeHero.vote_average,
          release_date: filmeHero.release_date,
          runtime: filmeHero.runtime || 166,
          nota: 0,
          review: "",
          dataAssistido: new Date().toLocaleDateString("pt-BR"),
        },
        ...salvos,
      ];
    }
    localStorage.setItem("cinelog_assistidos", JSON.stringify(atualizados));
    window.dispatchEvent(new Event("cinelog_storage_update"));
    setAssistidos(atualizados);
  }

  function toggleHeroWatchlist() {
    if (!filmeHero) return;
    const salvos = JSON.parse(localStorage.getItem("cinelog_watchlist")) || [];
    let atualizados = [];

    if (isHeroWatchlist) {
      atualizados = salvos.filter((f) => f.id !== filmeHero.id);
    } else {
      atualizados = [filmeHero, ...salvos];
    }
    localStorage.setItem("cinelog_watchlist", JSON.stringify(atualizados));
    window.dispatchEvent(new Event("cinelog_storage_update"));
    setWatchlist(atualizados);
  }

  function handleToggleAssistidoCard(filme) {
    const salvos = JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
    const existe = salvos.some((f) => f.id === filme.id);
    let atualizados = [];

    if (existe) {
      atualizados = salvos.filter((f) => f.id !== filme.id);
    } else {
      atualizados = [
        {
          id: filme.id,
          title: filme.title,
          poster_path: filme.poster_path,
          vote_average: filme.vote_average,
          release_date: filme.release_date,
          runtime: filme.runtime || 120,
          nota: 0,
          review: "",
          dataAssistido: new Date().toLocaleDateString("pt-BR"),
        },
        ...salvos,
      ];
    }
    localStorage.setItem("cinelog_assistidos", JSON.stringify(atualizados));
    window.dispatchEvent(new Event("cinelog_storage_update"));
    setAssistidos(atualizados);
  }

  // Filtragem por provedor de streaming
  function filtrarPorProvedor(idProvedor) {
    setProvedorFiltro(idProvedor);
    if (idProvedor === "todos") {
      setFilmesExibidos(todosFilmes);
    } else {
      const filtrados = todosFilmes.filter((f) =>
        f.providers?.some((p) => p.id === idProvedor),
      );
      setFilmesExibidos(filtrados);
    }
  }

  function getNotaFilme(id) {
    const item = assistidos.find((f) => f.id === id);
    return item ? item.nota : 0;
  }

  function isAssistido(id) {
    return assistidos.some((f) => f.id === id);
  }

  function handleTriggerDeck(action) {
    setDeckActionFeedback(
      action === "match" ? "Filme adicionado à sua Fila!" : "Filme descartado",
    );
    setTimeout(() => setDeckActionFeedback(null), 1800);
  }

  return (
    <div className="cinelog-home">
      {/* 1. HERO SECTION CINEMATOGRAFICA DO STITCH (com Destaque da Semana) */}
      {filmeHero && !queryParam && (
        <section className="cinelog-hero">
          <div
            className="hero-backdrop-img"
            style={{
              backgroundImage: `url(${getBackdropUrl(filmeHero.backdrop_path)})`,
            }}
          />
          <div className="hero-gradient-overlay" />
          <div className="hero-ambient-glow" />

          <div className="hero-content container-max">
            {/* Tag do topo */}
            <div className="hero-tag-row">
              <span className="badge-red">
                <IconFlame size={12} color="#ffffff" /> Destaque da Semana
              </span>
              <span className="hero-subtag">Top 1 Brasil no TMDB</span>
            </div>

            {/* Titulo */}
            <h1 className="hero-title">{filmeHero.title}</h1>

            {/* Ficha e Metadados */}
            <div className="hero-meta-strip">
              <span className="badge-gold">
                TMDB{" "}
                {filmeHero.vote_average
                  ? filmeHero.vote_average.toFixed(1)
                  : "8.5"}
                /10
              </span>
              <span className="badge-green">
                <IconStar size={12} color="#00e054" filled /> 94% Crítica
              </span>
              <span className="meta-dot">•</span>
              <span>{filmeHero.release_date?.split("-")[0] || "2024"}</span>
              <span className="meta-dot">•</span>
              <span>{filmeHero.runtime || 166} min (2h 46m)</span>
              <span className="meta-dot">•</span>
              <span className="hero-genre-pill">14+ Sci-Fi</span>
            </div>

            {/* Sinopse */}
            <p className="hero-synopsis">{filmeHero.overview}</p>

            {/* Onde Assistir Agora Pills */}
            <div className="hero-streaming-strip">
              <span className="streaming-label">Onde assistir agora:</span>
              <div className="hero-stream-pill max-pill">
                <span className="dot-indicator blue" />
                <span className="stream-name">Max</span>
                <span className="stream-badge">4K HDR</span>
              </div>
              <div className="hero-stream-pill prime-pill">
                <span className="dot-indicator cyan" />
                <span className="stream-name">Prime Video</span>
                <span className="stream-badge muted">Incluso</span>
              </div>
            </div>

            {/* Botoes de Acao Interativa */}
            <div className="hero-actions-strip">
              <button
                type="button"
                className={`hero-btn-seen ${isHeroAssistido ? "watched" : ""}`}
                onClick={toggleHeroAssistido}
              >
                <IconCheck
                  size={18}
                  color={isHeroAssistido ? "#ffffff" : "#0c0e11"}
                />
                <span>
                  {isHeroAssistido ? "Assistido" : "Marcar como Assistido"}
                </span>
              </button>

              <Link to={`/filme/${filmeHero.id}`} className="hero-btn-rate">
                <IconStar size={18} color="#f5c518" filled />
                <span>Avaliar</span>
                <span
                  className="rate-stars-preview"
                  style={{
                    display: "inline-flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <IconStar size={12} color="#00E054" filled />
                  <IconStar size={12} color="#00E054" filled />
                  <IconStar size={12} color="#00E054" filled />
                  <IconStar size={12} color="#00E054" filled />
                  <IconStar size={12} color="#00E054" filled />
                </span>
              </Link>

              <a
                href="https://www.youtube.com/results?search_query=duna+parte+2+trailer+oficial+brasil"
                target="_blank"
                rel="noreferrer"
                className="hero-btn-trailer"
              >
                <IconPlay size={16} color="#e50914" />
                <span>Assistir Trailer</span>
              </a>

              <button
                type="button"
                className={`hero-btn-watchlist ${isHeroWatchlist ? "active" : ""}`}
                onClick={toggleHeroWatchlist}
                title={
                  isHeroWatchlist
                    ? "Remover da Watchlist"
                    : "Salvar na Watchlist"
                }
              >
                <IconBookmark
                  size={18}
                  filled={isHeroWatchlist}
                  color={isHeroWatchlist ? "#e50914" : "#9ca3af"}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. BARRA DE FILTROS RAPIDOS STREAMING BRASIL */}
      <section className="cinelog-filter-rail" id="catalogo">
        <div className="filter-rail-inner container-max">
          <div className="rail-label-group">
            <span className="rail-title">Catálogo Brasil:</span>
          </div>

          <div className="rail-chips-list">
            <button
              type="button"
              className={`provider-chip ${provedorFiltro === "todos" ? "active" : ""}`}
              onClick={() => filtrarPorProvedor("todos")}
            >
              Todos ({todosFilmes.length})
            </button>
            <button
              type="button"
              className={`provider-chip ${provedorFiltro === "netflix" ? "active" : ""}`}
              onClick={() => filtrarPorProvedor("netflix")}
            >
              <span className="chip-dot red" />
              Netflix
            </button>
            <button
              type="button"
              className={`provider-chip ${provedorFiltro === "prime" ? "active" : ""}`}
              onClick={() => filtrarPorProvedor("prime")}
            >
              <span className="chip-dot cyan" />
              Prime Video
            </button>
            <button
              type="button"
              className={`provider-chip ${provedorFiltro === "max" ? "active" : ""}`}
              onClick={() => filtrarPorProvedor("max")}
            >
              <span className="chip-dot purple" />
              Max
            </button>
            <button
              type="button"
              className={`provider-chip ${provedorFiltro === "disney" ? "active" : ""}`}
              onClick={() => filtrarPorProvedor("disney")}
            >
              <span className="chip-dot blue" />
              Disney+
            </button>
            <button
              type="button"
              className={`provider-chip ${provedorFiltro === "apple" ? "active" : ""}`}
              onClick={() => filtrarPorProvedor("apple")}
            >
              <span className="chip-dot gray" />
              Apple TV+
            </button>
          </div>

          <div className="rail-sync-status">
            <span className="sync-dot" />
            <span>Sincronizado há 14 min com TMDB</span>
          </div>
        </div>
      </section>

      {/* 3. CONTEUDO PRINCIPAL: BENTO GRID (Em Alta no Brasil + Widget CineMatch) */}
      <main className="cinelog-main-bento container-max">
        <div className="bento-split-layout">
          {/* Coluna Esquerda (8 cols): Catalogo de Filmes */}
          <section className="catalog-shelf-col">
            <div className="shelf-header">
              <div className="shelf-title-group">
                <h2 className="shelf-title">
                  {queryParam
                    ? `Resultados para "${queryParam}"`
                    : "Em Alta no Brasil"}
                </h2>
                <span className="shelf-tag">TMDB Trends</span>
              </div>
              <span className="shelf-counter">
                {filmesExibidos.length} filmes disponíveis
              </span>
            </div>

            {carregando && (
              <div className="loading-box">
                <div className="loading-spinner" />
                <p>Carregando filmes...</p>
              </div>
            )}

            {erro && (
              <div className="error-box">
                <h3>Erro ao carregar</h3>
                <p>{erro}</p>
              </div>
            )}

            {!carregando && !erro && filmesExibidos.length === 0 && (
              <div className="empty-box">
                <IconSearch size={36} color="#6b7280" />
                <h3>Nenhum título encontrado</h3>
                <p>
                  Tente selecionar outro streaming ou limpar o termo de busca.
                </p>
              </div>
            )}

            {!carregando && !erro && filmesExibidos.length > 0 && (
              <div className="cards-grid-23">
                {filmesExibidos.map((filme) => (
                  <MovieCard
                    key={filme.id}
                    filme={filme}
                    assistido={isAssistido(filme.id)}
                    notaUsuario={getNotaFilme(filme.id)}
                    onToggleAssistido={handleToggleAssistidoCard}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Coluna Direita (4 cols): CineMatch Teaser & Estatistica Pessoal */}
          <aside className="cinematch-aside-col">
            {/* Card Teaser do CineMatch */}
            <div className="cinematch-deck-teaser">
              <div className="teaser-ambient-1" />
              <div className="teaser-ambient-2" />

              <div className="teaser-top-row">
                <span className="badge-red">
                  <IconFlame size={12} color="#ffffff" /> Modo Descoberta
                </span>
                <span className="match-percent-tag">98% Match Algorítmico</span>
              </div>

              <h3 className="teaser-headline">
                Cansado de escolher o que ver?
              </h3>
              <p className="teaser-desc">
                Experimente o <strong>CineMatch</strong>: nosso recomendador
                estilo Tinder que cruza seu histórico com os maiores sucessos do
                cinema.
              </p>

              {/* Preview da Carta Simulada */}
              <div className="teaser-card-preview">
                <div className="preview-stack-2" />
                <div className="preview-stack-1" />
                <div className="preview-active-card">
                  <img
                    src="https://image.tmdb.org/t/p/w500/cJFqqiDYprqExaXatu4AaoMzDG2.jpg"
                    alt="Deadpool & Wolverine Preview"
                    className="preview-card-img"
                  />
                  <div className="preview-card-overlay">
                    <span className="preview-genre-tag">Ação • Comédia</span>
                    <h4 className="preview-movie-title">
                      Deadpool &amp; Wolverine
                    </h4>
                    <div className="preview-bottom-meta">
                      <span>Disponível no Disney+</span>
                      <strong className="text-green">97%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {deckActionFeedback && (
                <div className="deck-feedback-toast">{deckActionFeedback}</div>
              )}

              {/* Controles de Acao Rapida */}
              <div className="teaser-actions-row">
                <button
                  type="button"
                  className="round-btn pass"
                  onClick={() => handleTriggerDeck("pass")}
                  title="Passar Filme"
                >
                  <IconClose size={20} color="#ef4444" />
                </button>
                <Link
                  to="/match"
                  className="btn-cinelog-primary full-match-cta"
                >
                  Abrir CineMatch Full
                </Link>
                <button
                  type="button"
                  className="round-btn like"
                  onClick={() => handleTriggerDeck("match")}
                  title="Adicionar à Fila"
                >
                  <IconHeart size={20} color="#00e054" filled />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
