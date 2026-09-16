import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  getDetalhesFilme,
  getOndeAssistir,
  getElencoFilme,
  getImageUrl,
  getBackdropUrl,
} from "../../services/tmdb";
import WatchProviders from "../../components/WatchProviders/WatchProviders";
import StarRating from "../../components/StarRating/StarRating";
import {
  IconClock,
  IconStar,
  IconCheck,
  IconHourglass,
  IconShare,
  IconBookmark,
  IconUser,
  IconCalendar,
  IconThumbsUp,
} from "../../components/Icons";
import "./Details.css";

export default function Details() {
  const { id } = useParams();
  const [filme, setFilme] = useState(null);
  const [provedores, setProvedores] = useState([]);
  const [elenco, setElenco] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados de assistido, nota e texto de review
  const [assistido, setAssistido] = useState(false);
  const [nota, setNota] = useState(4.5);
  const [reviewSalva, setReviewSalva] = useState("");
  const [textoReview, setTextoReview] = useState("");
  const [editandoReview, setEditandoReview] = useState(false);
  const [dataRegistro, setDataRegistro] = useState("");
  const [feedbackToast, setFeedbackToast] = useState(null);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
    const encontrado = salvos.find((f) => String(f.id) === String(id));
    if (encontrado) {
      setAssistido(true);
      setNota(encontrado.nota || 4.5);
      setReviewSalva(encontrado.review || "");
      setTextoReview(encontrado.review || "");
      setDataRegistro(encontrado.dataAssistido || "14 de Março de 2026");
    } else {
      setAssistido(false);
      setNota(4.5);
      setReviewSalva("");
      setTextoReview("");
      setDataRegistro(
        new Date().toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    }
  }, [id]);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro(null);
      try {
        const [dadosFilme, dadosProvedores, dadosElenco] = await Promise.all([
          getDetalhesFilme(id),
          getOndeAssistir(id),
          getElencoFilme(id),
        ]);

        if (!dadosFilme) throw new Error("Filme não encontrado");

        setFilme(dadosFilme);
        setProvedores(dadosProvedores);
        setElenco(dadosElenco);
      } catch (err) {
        setErro("Não foi possível carregar os detalhes do filme.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  function salvarNoLocalStorage(novoStatus, novaNota, novoTextoReview) {
    const salvos = JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
    if (!novoStatus) {
      const atualizados = salvos.filter(
        (f) => String(f.id) !== String(filme.id),
      );
      localStorage.setItem("cinelog_assistidos", JSON.stringify(atualizados));
      setAssistido(false);
      setFeedbackToast("Removido dos assistidos");
      setTimeout(() => setFeedbackToast(null), 2000);
      window.dispatchEvent(new Event("cinelog_storage_update"));
      return;
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const itemAtualizado = {
      id: filme.id,
      title: filme.title,
      poster_path: filme.poster_path,
      vote_average: filme.vote_average,
      release_date: filme.release_date,
      runtime: filme.runtime || 135,
      nota: novaNota,
      review: novoTextoReview,
      elenco: elenco.slice(0, 4),
      dataAssistido: dataAtual,
    };

    const atualizados = [
      itemAtualizado,
      ...salvos.filter((f) => String(f.id) !== String(filme.id)),
    ];
    localStorage.setItem("cinelog_assistidos", JSON.stringify(atualizados));
    setAssistido(true);
    setNota(novaNota);
    setReviewSalva(novoTextoReview);
    setDataRegistro(dataAtual);

    setFeedbackToast("Salvo com sucesso no histórico!");
    setTimeout(() => setFeedbackToast(null), 2000);
    window.dispatchEvent(new Event("cinelog_storage_update"));
  }

  function handleToggleAssistido() {
    salvarNoLocalStorage(!assistido, nota, reviewSalva);
  }

  function handleAvaliar(novaNota) {
    salvarNoLocalStorage(true, novaNota, reviewSalva);
  }

  function handleSalvarReview(e) {
    e.preventDefault();
    salvarNoLocalStorage(true, nota, textoReview);
    setEditandoReview(false);
  }

  if (carregando) {
    return (
      <div className="loading-box container-max">
        <div className="loading-spinner" />
        <p>Carregando produção cinematográfica...</p>
      </div>
    );
  }

  if (erro || !filme) {
    return (
      <div className="error-box container-max">
        <h3>Filme não encontrado</h3>
        <p>{erro || "Não encontramos o filme solicitado no catálogo."}</p>
        <Link
          to="/"
          className="btn-cinelog-secondary"
          style={{ marginTop: 16 }}
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const ano = filme.release_date ? filme.release_date.split("-")[0] : "2025";
  const duracaoMinutos = filme.runtime || 135;
  const duracaoHoras = `${Math.floor(duracaoMinutos / 60)}h ${duracaoMinutos % 60}m`;
  const backdropUrl = getBackdropUrl(filme.backdrop_path);

  return (
    <div className="cinelog-details-page">
      {/* 1. BACKDROP CINEMATOGRAFICO EM ALTA RESOLUCAO */}
      <div className="details-hero-bleed">
        <div
          className="details-backdrop-img"
          style={{
            backgroundImage: `url(${backdropUrl || getImageUrl(filme.poster_path)})`,
          }}
        />
        <div className="details-scrim-overlay" />
        <div className="details-radial-glow" />
      </div>

      {/* 2. CONTEUDO PRINCIPAL (Sobrepondo o Backdrop -mt-64) */}
      <div className="details-main-container container-max">
        <div className="details-two-columns">
          {/* COLUNA ESQUERDA (4 cols): Poster, Botoes, Avaliacao e Horas Gastas */}
          <aside className="details-left-column">
            {/* Frame do Poster 2:3 */}
            <div className="details-poster-card">
              <img
                src={getImageUrl(filme.poster_path)}
                alt={`Pôster de ${filme.title}`}
                className="details-poster-img"
              />

              {/* Badges Flutuantes Superiores */}
              <div className="poster-floating-top">
                <span className="badge-tmdb-gold">
                  <IconStar size={12} color="#0c0e11" filled />
                  {filme.vote_average ? filme.vote_average.toFixed(1) : "8.5"}
                </span>
                <div className="poster-tech-badges">
                  <span className="tech-pill">4K HDR</span>
                  <span className="tech-pill">ATMOS</span>
                </div>
              </div>

              {/* Faixa inferior de status */}
              <div className="poster-bottom-status">
                <span className="pulse-green-dot" />
                <span className="status-text">CineLog Top 2025/2026</span>
              </div>
            </div>

            {/* Painel de Controle de Acoes */}
            <div className="details-action-panel">
              {/* Botao de Assistido com Toggle */}
              <button
                type="button"
                className={`btn-main-watched ${assistido ? "watched" : ""}`}
                onClick={handleToggleAssistido}
              >
                <IconCheck
                  size={20}
                  color={assistido ? "#0c0e11" : "#ffffff"}
                />
                <span>{assistido ? "Assistido" : "Marcar como Assistido"}</span>
              </button>

              {/* Data do Registro */}
              {assistido && (
                <div className="watched-date-banner">
                  <span className="calendar-icon">
                    <IconCalendar size={14} color="#9ca3af" />
                  </span>
                  <span className="date-label">
                    Registrado em <strong>{dataRegistro}</strong>
                  </span>
                </div>
              )}

              {/* Seletor de Avaliacao 5 Estrelas (Letterboxd Green) */}
              <div className="star-rating-block">
                <div className="rating-header-row">
                  <span className="rating-title">Sua Avaliação</span>
                  <span className="rating-score-highlight">
                    {Number(nota).toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="rating-stars-interactive">
                  <StarRating
                    notaAtual={nota}
                    onAvaliar={handleAvaliar}
                    tamanho={28}
                    cor="#00e054"
                  />
                </div>
              </div>

              {/* Botoes Secundarios */}
              <div className="secondary-buttons-row">
                <button
                  type="button"
                  className="btn-cinelog-secondary btn-half"
                  onClick={() => alert("Link de compartilhamento copiado!")}
                >
                  <IconShare size={16} />
                  Compartilhar
                </button>
                <button
                  type="button"
                  className="btn-cinelog-secondary btn-half"
                  onClick={() => alert("Adicionado à sua lista!")}
                >
                  <IconBookmark size={16} />
                  Salvar
                </button>
              </div>
            </div>

            {/* Card de Horas de Vida Gastas */}
            <div className="details-life-stat-card">
              <div className="life-stat-icon-box">
                <IconHourglass size={22} color="#ffb870" />
              </div>
              <div className="life-stat-text-box">
                <span className="life-stat-label">
                  Tempo de Vida Registrado
                </span>
                <div className="life-stat-value-row">
                  <span className="life-stat-hours">+{duracaoHoras}</span>
                  <span className="life-stat-subtext">
                    ao seu histórico pessoal
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUNA DIREITA (8 cols): Titulo, Metadados, Streaming, Sinopse, Elenco, Reviews e Estatisticas */}
          <main className="details-right-column">
            {/* Header com Tagline e Titulo Master */}
            <div className="movie-header-section">
              <div className="tagline-row">
                <span className="badge-red">Lançamento Destaque</span>
                <span className="original-title-label">
                  Título original: <em>{filme.title}</em>
                </span>
              </div>

              <h1 className="master-title">{filme.title}</h1>

              <div className="metadata-pills-row">
                <span className="pill-year">{ano}</span>
                <span className="meta-separator">•</span>
                <span className="pill-age">14 ANOS</span>
                <span className="meta-separator">•</span>
                <span className="pill-runtime">
                  <IconClock size={14} color="#9ca3af" />
                  {duracaoMinutos} min ({duracaoHoras})
                </span>
                <span className="meta-separator">•</span>
                <span className="pill-genres">
                  {(filme.genres || [{ name: "Cinema" }])
                    .map((g) => g.name)
                    .join(", ")}
                </span>
                <span className="meta-separator">•</span>
                <span className="pill-director">Dir. Denis Villeneuve</span>
              </div>
            </div>

            {/* Secao: Onde Assistir no Brasil (Stitch Watch Providers) */}
            <section className="movie-section">
              <WatchProviders providers={provedores} />
            </section>

            {/* Secao: Sinopse Oficial */}
            <section className="movie-section synopsis-box">
              <h3 className="section-title">Sinopse Oficial</h3>
              <p className="synopsis-paragraph">{filme.overview}</p>
            </section>

            {/* Secao: Elenco Principal (Cards Circulares do Stitch) */}
            {elenco && elenco.length > 0 && (
              <section className="movie-section">
                <div className="section-header-flex">
                  <h3 className="section-title">Elenco Principal</h3>
                  <span className="section-subtitle">
                    {elenco.length} protagonistas
                  </span>
                </div>

                <div className="cast-cards-grid">
                  {elenco.slice(0, 4).map((ator) => {
                    return (
                      <div
                        key={ator.id || ator.nome}
                        className="actor-profile-card"
                      >
                        <div className="actor-avatar-circle" title={ator.nome}>
                          <IconUser size={34} color="#93c5fd" />
                        </div>
                        <span className="actor-name">{ator.nome}</span>
                        <span className="actor-character">
                          {ator.personagem}
                        </span>
                        <span className="actor-role-tag">Destaque</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Secao: Sua Crítica & Review Pessoal */}
            <section className="movie-section review-container-box">
              <div className="section-header-flex">
                <h3 className="section-title">Sua Crítica / Review Pessoal</h3>
                {reviewSalva && !editandoReview && (
                  <button
                    type="button"
                    className="btn-edit-text"
                    onClick={() => {
                      setTextoReview(reviewSalva);
                      setEditandoReview(true);
                    }}
                  >
                    Editar Resenha
                  </button>
                )}
              </div>

              {!reviewSalva || editandoReview ? (
                <form
                  onSubmit={handleSalvarReview}
                  className="details-review-form"
                >
                  <textarea
                    placeholder="Escreva sua opinião sincera sobre a atuação, fotografia, trilha sonora e ritmo da obra..."
                    value={textoReview}
                    onChange={(e) => setTextoReview(e.target.value)}
                    rows={4}
                  />
                  <div className="review-actions-row">
                    <button type="submit" className="btn-cinelog-primary">
                      Publicar Crítica
                    </button>
                    {editandoReview && (
                      <button
                        type="button"
                        className="btn-cinelog-secondary"
                        onClick={() => {
                          setTextoReview(reviewSalva);
                          setEditandoReview(false);
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="user-saved-review">
                  <p className="saved-review-quote">"{reviewSalva}"</p>
                  <div className="saved-review-footer">
                    <span
                      className="review-stars-tag"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <IconStar size={14} color="#00E054" filled />{" "}
                      {Number(nota).toFixed(1)} / 5.0 estrelas
                    </span>
                    <span className="review-author-tag">
                      Crítica escrita por você no CineLog
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Secao: Estatisticas da Comunidade CineLog */}
            <section className="movie-section community-stats-box">
              <div className="section-header-flex border-bottom-pad">
                <h3 className="section-title">
                  Estatísticas da Comunidade CineLog
                </h3>
                <span className="badge-green">Alta Relevância</span>
              </div>

              <div className="community-metrics-grid">
                {/* Metrica 1 */}
                <div className="community-stat-item">
                  <span className="stat-item-label">Assistiram</span>
                  <div className="stat-item-main">
                    <span className="stat-big-number">124.520</span>
                    <span className="stat-trend-green">
                      ▲ +14.2% esta semana
                    </span>
                  </div>
                </div>

                {/* Metrica 2: Radial Gauge */}
                <div className="community-stat-item flex-between">
                  <div className="stat-col">
                    <span className="stat-item-label">Recomendação</span>
                    <span className="stat-big-number">89%</span>
                    <span className="stat-subtext">dos cinéfilos indicam</span>
                  </div>
                  <div className="radial-mini-chart">
                    <svg className="radial-svg" viewBox="0 0 36 36">
                      <path
                        className="radial-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="radial-fill"
                        strokeDasharray="89, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="radial-center-icon">
                      <IconThumbsUp size={16} color="#00e054" />
                    </span>
                  </div>
                </div>

                {/* Metrica 3 */}
                <div className="community-stat-item">
                  <span className="stat-item-label">Média CineLog</span>
                  <div className="stat-score-row">
                    <span className="stat-big-number">4.4</span>
                    <span className="stat-max-score">/ 5.0</span>
                  </div>
                  <div className="score-progress-bar">
                    <div
                      className="score-progress-fill"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Histograma de Distribuicao de Notas */}
            <section className="community-rating-section">
              <h3 className="section-title">Recepção da Comunidade</h3>
              <div className="histogram-box">
                <span className="histogram-title">
                  Distribuição de Notas dos Críticos &amp; Usuários
                </span>
                <div className="histogram-bars-row">
                  <div
                    className="histogram-bar"
                    style={{ height: "10%" }}
                    title="1.0 estrela (1.200 votos)"
                  />
                  <div
                    className="histogram-bar"
                    style={{ height: "22%" }}
                    title="2.0 estrelas (3.400 votos)"
                  />
                  <div
                    className="histogram-bar"
                    style={{ height: "45%" }}
                    title="3.0 estrelas (11.200 votos)"
                  />
                  <div
                    className="histogram-bar"
                    style={{ height: "78%" }}
                    title="4.0 estrelas (38.900 votos)"
                  />
                  <div
                    className="histogram-bar active"
                    style={{ height: "96%" }}
                    title="5.0 estrelas (69.820 votos)"
                  />
                </div>
                <div className="histogram-labels-row">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <IconStar size={11} color="#6B7280" filled /> 1.0
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <IconStar size={11} color="#6B7280" filled /> 3.0
                  </span>
                  <span
                    className="text-green-bold"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <IconStar size={11} color="#00E054" filled /> 5.0 (Maioria)
                  </span>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {feedbackToast && <div className="details-toast">{feedbackToast}</div>}
    </div>
  );
}
