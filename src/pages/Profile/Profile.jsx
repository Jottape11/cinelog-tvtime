import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  IconClock,
  IconStar,
  IconFilm,
  IconHeart,
  IconClose,
  IconHourglass,
  IconShare,
  IconPopcorn,
  IconMedal,
  IconMapPin,
} from "../../components/Icons";
import StarRating from "../../components/StarRating/StarRating";
import TopActors from "../../components/TopActors/TopActors";
import { getImageUrl } from "../../services/tmdb";
import "./Profile.css";

export default function Profile() {
  const [assistidos, setAssistidos] = useState([]);
  const [queroAssistir, setQueroAssistir] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("assistidos");

  useEffect(() => {
    carregarDados();
    window.addEventListener("storage", carregarDados);
    window.addEventListener("cinelog_storage_update", carregarDados);
    return () => {
      window.removeEventListener("storage", carregarDados);
      window.removeEventListener("cinelog_storage_update", carregarDados);
    };
  }, []);

  function carregarDados() {
    const salvosAssistidos =
      JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
    const salvosQuero =
      JSON.parse(localStorage.getItem("cinelog_quero_assistir")) || [];
    setAssistidos(salvosAssistidos);
    setQueroAssistir(salvosQuero);
  }

  // Calculo de horas de vida gastas
  const totalMinutos = assistidos.reduce(
    (acc, f) => acc + (f.runtime || 120),
    0,
  );
  const totalHoras = Math.floor(totalMinutos / 60);
  const dias = Math.floor(totalHoras / 24);
  const horasRestantes = totalHoras % 24;
  const minutosRestantes = totalMinutos % 60;

  const totalNotas = assistidos.reduce(
    (acc, f) => acc + (Number(f.nota) || 4.5),
    0,
  );
  const mediaNotas =
    assistidos.length > 0 ? (totalNotas / assistidos.length).toFixed(1) : "4.8";

  function calcularTopAtores() {
    const mapa = {};
    assistidos.forEach((filme) => {
      if (filme.elenco && Array.isArray(filme.elenco)) {
        filme.elenco.forEach((ator) => {
          if (!mapa[ator.nome]) {
            mapa[ator.nome] = {
              id: ator.id || ator.nome,
              nome: ator.nome,
              foto: ator.foto,
              aparicoes: 0,
              favorito: filme.title,
            };
          }
          mapa[ator.nome].aparicoes += 1;
        });
      }
    });

    const lista = Object.values(mapa);
    lista.sort((a, b) => b.aparicoes - a.aparicoes);
    return lista.slice(0, 3);
  }

  const topAtores = calcularTopAtores();

  function handleRemoverAssistido(id) {
    const atualizados = assistidos.filter((f) => f.id !== id);
    localStorage.setItem("cinelog_assistidos", JSON.stringify(atualizados));
    setAssistidos(atualizados);
    window.dispatchEvent(new Event("cinelog_storage_update"));
  }

  function handleRemoverQuero(id) {
    const atualizados = queroAssistir.filter((f) => f.id !== id);
    localStorage.setItem("cinelog_quero_assistir", JSON.stringify(atualizados));
    setQueroAssistir(atualizados);
    window.dispatchEvent(new Event("cinelog_storage_update"));
  }

  function handleAtualizarNota(id, novaNota) {
    const atualizados = assistidos.map((f) => {
      if (f.id === id) {
        return { ...f, nota: novaNota };
      }
      return f;
    });
    localStorage.setItem("cinelog_assistidos", JSON.stringify(atualizados));
    setAssistidos(atualizados);
    window.dispatchEvent(new Event("cinelog_storage_update"));
  }

  return (
    <div className="cinelog-profile-page container-max">
      {/* 1. PROFILE HEADER MODULE DO STITCH (Homenagem ao Prof. Caio Oliveira) */}
      <section className="profile-user-card">
        <div className="user-profile-left">
          <div className="user-avatar-frame">
            <img
              src="/professor-caio.png"
              alt="Prof. Caio Oliveira"
              className="user-profile-img"
            />
            <span className="badge-pro-star">
              <IconStar size={10} color="#0c0e11" filled /> PROF
            </span>
          </div>

          <div className="user-identity-group">
            <div className="user-name-row">
              <h1 className="user-display-name">Prof. Caio Oliveira</h1>
              <span className="user-handle">@prof_caio</span>
              <span className="badge-online">
                <span className="ping-dot" /> Online
              </span>
            </div>

            <p className="user-bio-text">
              Professor de Web Development na FIAP (Turma 1ESPW). Especialista
              em arquiteturas front-end escaláveis, boas práticas em React,
              código limpo e cinéfilo dedicado!
            </p>

            <div className="user-pills-row">
              <span className="user-info-pill">
                <IconClock size={12} color="#a7c8ff" /> Professor FIAP • 1ESPW
              </span>
              <span className="user-info-pill warm">
                <IconMedal size={13} color="#ffb870" /> Membro Honorário CineLog
              </span>
              <span className="user-info-pill">
                <IconMapPin size={13} color="#a7c8ff" /> São Paulo, SP
              </span>
            </div>
          </div>
        </div>

        <div className="user-profile-actions">
          <Link
            to="/editar-perfil"
            className="btn-cinelog-secondary"
            title="Editar Perfil"
          >
            Editar Perfil
          </Link>
          <Link
            to="/compartilhar-perfil"
            className="btn-cinelog-secondary icon-only"
            title="Compartilhar Perfil"
          >
            <IconShare size={16} />
          </Link>
        </div>
      </section>

      {/* 2. HERO CARD: CALCULO DE HORAS DE VIDA GASTAS (A Metrica Lendaria) */}
      <section className="life-hours-hero-card">
        <div className="life-ambient-circle" />

        <div className="life-card-top-row">
          <div className="life-card-title-group">
            <div className="life-metric-badge">
              <IconHourglass size={16} color="#e50914" />
              <span>Métrica Lendária do CineLog</span>
            </div>
            <h2 className="life-master-heading">Horas de Vida Gastas</h2>
            <p className="life-card-desc">
              Tempo computado rigorosamente com base na duração oficial de cada
              produção consumida e auditada na plataforma.
            </p>
          </div>

          <div className="life-total-ribbon">
            <span className="ribbon-hours">{totalHoras}h</span>
            <div className="ribbon-text">
              <span className="ribbon-main">Dedicadas ao Cinema</span>
              <span className="ribbon-sub">Não nos arrependemos de nada!</span>
            </div>
          </div>
        </div>

        {/* 3 Blocos de Segmentos Temporais com Barras de Progresso */}
        <div className="time-segments-grid">
          <div className="segment-card">
            <span className="segment-label">Tempo Bruto</span>
            <div className="segment-value-row">
              <span className="segment-number">{dias}</span>
              <span className="segment-unit">Dias</span>
            </div>
            <div className="segment-bar">
              <div
                className="segment-fill red"
                style={{ width: `${Math.min(100, Math.max(15, dias * 4))}%` }}
              />
            </div>
          </div>

          <div className="segment-card">
            <span className="segment-label">Horas Consecutivas</span>
            <div className="segment-value-row">
              <span className="segment-number">{horasRestantes}</span>
              <span className="segment-unit">Horas</span>
            </div>
            <div className="segment-bar">
              <div
                className="segment-fill warm"
                style={{
                  width: `${Math.min(100, Math.max(15, (horasRestantes / 24) * 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="segment-card">
            <span className="segment-label">Minutos de Imersão</span>
            <div className="segment-value-row">
              <span className="segment-number">{minutosRestantes}</span>
              <span className="segment-unit">Minutos</span>
            </div>
            <div className="segment-bar">
              <div
                className="segment-fill green"
                style={{
                  width: `${Math.min(100, Math.max(15, (minutosRestantes / 60) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sub-Metricas Inferiores */}
        <div className="sub-metrics-row">
          <div className="sub-metric-box">
            <span className="sub-metric-icon">
              <IconFilm size={20} color="#e50914" />
            </span>
            <div className="sub-metric-text">
              <span className="sub-metric-value">{assistidos.length}</span>
              <span className="sub-metric-label">
                Filmes Assistidos e catalogados
              </span>
            </div>
          </div>

          <div className="sub-metric-box">
            <span className="sub-metric-icon">
              <IconStar size={20} color="#ffb870" filled />
            </span>
            <div className="sub-metric-text">
              <span className="sub-metric-value">{mediaNotas} / 5.0</span>
              <span className="sub-metric-label">
                Média ponderada de avaliações
              </span>
            </div>
          </div>

          <div className="sub-metric-box">
            <span className="sub-metric-icon">
              <IconPopcorn size={20} color="#00e054" />
            </span>
            <div className="sub-metric-text">
              <span className="sub-metric-value">18</span>
              <span className="sub-metric-label">Filmes no Cinema em 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOP 3 ATORES MAIS ASSISTIDOS (Hall da Fama) */}
      <section className="profile-section">
        <TopActors atores={topAtores} />
      </section>

      {/* 4. DIARIO DE CINEMA & LISTAS DO USUARIO COM REVIEWS */}
      <section className="diary-section">
        <div className="diary-tabs-bar">
          <button
            type="button"
            className={`diary-tab-btn ${abaAtiva === "assistidos" ? "active" : ""}`}
            onClick={() => setAbaAtiva("assistidos")}
          >
            Filmes Assistidos &amp; Reviews ({assistidos.length})
          </button>
          <button
            type="button"
            className={`diary-tab-btn ${abaAtiva === "quero" ? "active" : ""}`}
            onClick={() => setAbaAtiva("quero")}
          >
            Quero Assistir / Matches ({queroAssistir.length})
          </button>
        </div>

        {abaAtiva === "assistidos" && (
          <div className="diary-content-pane">
            {assistidos.length === 0 ? (
              <div className="empty-box">
                <IconFilm size={36} color="#6b7280" />
                <h3>Nenhum filme registrado ainda</h3>
                <p>
                  Abra qualquer filme no catálogo e clique em "Marcar como
                  Assistido" para começar a computar suas horas de vida!
                </p>
                <Link
                  to="/"
                  className="btn-cinelog-primary"
                  style={{ marginTop: 16 }}
                >
                  Explorar Catálogo
                </Link>
              </div>
            ) : (
              <div className="diary-entries-grid">
                {assistidos.map((filme) => (
                  <article key={filme.id} className="diary-entry-card">
                    <Link
                      to={`/filme/${filme.id}`}
                      className="entry-poster-frame"
                    >
                      <img
                        src={getImageUrl(filme.poster_path)}
                        alt={filme.title}
                      />
                      <span className="entry-runtime-badge">
                        {filme.runtime || 120} min
                      </span>
                    </Link>

                    <div className="entry-content-box">
                      <div className="entry-title-row">
                        <Link to={`/filme/${filme.id}`}>
                          <h4 className="entry-movie-title">{filme.title}</h4>
                        </Link>
                        <span className="entry-date-tag">
                          {filme.dataAssistido || "14 de Março"}
                        </span>
                      </div>

                      <div className="entry-rating-bar">
                        <StarRating
                          notaAtual={filme.nota || 4.5}
                          onAvaliar={(n) => handleAtualizarNota(filme.id, n)}
                          tamanho={18}
                          cor="#00e054"
                        />
                        <span className="entry-score-num">
                          {Number(filme.nota || 4.5).toFixed(1)} / 5.0
                        </span>
                      </div>

                      {filme.review ? (
                        <p className="entry-review-quote">"{filme.review}"</p>
                      ) : (
                        <Link
                          to={`/filme/${filme.id}`}
                          className="entry-add-review-btn"
                        >
                          + Escrever Crítica Pessoal
                        </Link>
                      )}

                      <div className="entry-actions-footer">
                        <Link
                          to={`/filme/${filme.id}`}
                          className="entry-details-link"
                        >
                          Ver Ficha Completa ↗
                        </Link>
                        <button
                          type="button"
                          className="btn-entry-remove"
                          onClick={() => handleRemoverAssistido(filme.id)}
                          title="Remover filme do diário"
                        >
                          <IconClose size={14} />
                          Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === "quero" && (
          <div className="diary-content-pane">
            {queroAssistir.length === 0 ? (
              <div className="empty-box">
                <IconHeart size={36} color="#e50914" />
                <h3>Sua fila de CineMatch está vazia</h3>
                <p>
                  Navegue pelo CineMatch e dê Match para adicionar filmes à sua
                  fila aqui!
                </p>
                <Link
                  to="/match"
                  className="btn-cinelog-primary"
                  style={{ marginTop: 16 }}
                >
                  Abrir CineMatch
                </Link>
              </div>
            ) : (
              <div className="diary-entries-grid">
                {queroAssistir.map((filme) => (
                  <article key={filme.id} className="diary-entry-card">
                    <Link
                      to={`/filme/${filme.id}`}
                      className="entry-poster-frame"
                    >
                      <img
                        src={getImageUrl(filme.poster_path)}
                        alt={filme.title}
                      />
                      <span className="entry-runtime-badge">
                        {filme.runtime || 120} min
                      </span>
                    </Link>

                    <div className="entry-content-box">
                      <div className="entry-title-row">
                        <Link to={`/filme/${filme.id}`}>
                          <h4 className="entry-movie-title">{filme.title}</h4>
                        </Link>
                        <span className="badge-tmdb-gold">
                          <IconStar size={11} color="#0c0e11" filled />{" "}
                          {filme.vote_average?.toFixed(1) || "8.0"}
                        </span>
                      </div>

                      <p className="entry-synopsis-snippet">{filme.overview}</p>

                      <div className="entry-actions-footer">
                        <Link
                          to={`/filme/${filme.id}`}
                          className="btn-cinelog-primary"
                          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                        >
                          Ver Detalhes
                        </Link>
                        <button
                          type="button"
                          className="btn-entry-remove"
                          onClick={() => handleRemoverQuero(filme.id)}
                          title="Remover da fila"
                        >
                          <IconClose size={14} />
                          Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
