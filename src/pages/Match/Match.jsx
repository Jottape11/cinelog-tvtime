import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getRecomendacoes, getImageUrl } from "../../services/tmdb";
import {
  IconStar,
  IconHeart,
  IconClose,
  IconPlay,
  IconFilm,
  IconFlame,
} from "../../components/Icons";
import "./Match.css";

export default function Match() {
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [stamp, setStamp] = useState(null); // 'like' | 'pass'
  const [filaHoje, setFilaHoje] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function carregarFila() {
      setCarregando(true);
      const salvosAssistidos =
        JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
      const salvosFila =
        JSON.parse(localStorage.getItem("cinelog_quero_assistir")) || [];
      setFilaHoje(salvosFila);

      const sementeId =
        salvosAssistidos.length > 0 ? salvosAssistidos[0].id : null;
      const dados = await getRecomendacoes(sementeId);

      const assistidosIds = new Set(salvosAssistidos.map((f) => f.id));
      const filtrados = dados.filter((f) => !assistidosIds.has(f.id));

      setRecomendacoes(filtrados);
      setIndexAtual(0);
      setCarregando(false);
    }

    carregarFila();
  }, []);

  // Atalhos de teclado (seta esquerda e direita)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        handleAction("pass");
      } else if (e.key === "ArrowRight") {
        handleAction("like");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [indexAtual, recomendacoes]);

  const filmeAtual = recomendacoes[indexAtual];

  function handleAction(tipo) {
    if (!filmeAtual) return;

    setStamp(tipo);

    setTimeout(() => {
      if (tipo === "like") {
        const lista =
          JSON.parse(localStorage.getItem("cinelog_quero_assistir")) || [];
        if (!lista.some((f) => f.id === filmeAtual.id)) {
          const novaLista = [filmeAtual, ...lista];
          localStorage.setItem(
            "cinelog_quero_assistir",
            JSON.stringify(novaLista),
          );
          setFilaHoje(novaLista);
        }
        setToast(`"${filmeAtual.title}" adicionado à sua fila!`);
      }

      setIndexAtual((prev) => prev + 1);
      setStamp(null);
      setTimeout(() => setToast(null), 2000);
    }, 280);
  }

  function handleRecarregar() {
    setIndexAtual(0);
  }

  const proximoFilme1 = recomendacoes[indexAtual + 1];
  const proximoFilme2 = recomendacoes[indexAtual + 2];

  return (
    <div className="cinelog-match-page container-max">
      {/* Header do CineMatch */}
      <div className="match-hero-header">
        <div className="match-title-group">
          <div className="match-badge-row">
            <span className="badge-red">
              <IconFlame size={13} color="#ffffff" /> Algoritmo Preditivo
            </span>
            <span className="session-tag">Sessão CineMatch #4092</span>
          </div>
          <h1 className="match-main-heading">
            Cine<span className="text-red">Match</span>
          </h1>
          <p className="match-subtitle-desc">
            Encontre seu próximo filme em segundos. Deslize para a direita para{" "}
            <strong className="text-green">Quero Assistir</strong> ou para a
            esquerda para <strong className="text-red">Passar</strong>.
          </p>
        </div>

        <div className="match-stats-pill">
          <div className="stats-pill-icon">
            <IconFilm size={20} color="#e50914" />
          </div>
          <div className="stats-pill-info">
            <span className="pill-number">{filaHoje.length} filmes</span>
            <span className="pill-label">na sua fila para maratonar</span>
          </div>
        </div>
      </div>

      {carregando && (
        <div className="loading-box">
          <div className="loading-spinner" />
          <p>Preparando a sua pilha personalizada de recomendações...</p>
        </div>
      )}

      {!carregando && (
        <div className="match-bento-grid">
          {/* COLUNA ESQUERDA: Pilha de Cartas Swipe */}
          <div className="swipe-deck-column">
            {filmeAtual ? (
              <div className="tinder-deck-container">
                {/* Cartas de Fundo Empilhadas */}
                {proximoFilme2 && (
                  <div className="deck-stack-card stack-depth-2" />
                )}
                {proximoFilme1 && (
                  <div className="deck-stack-card stack-depth-1">
                    <img
                      src={getImageUrl(proximoFilme1.poster_path)}
                      alt="Next"
                      className="stack-img"
                    />
                  </div>
                )}

                {/* Carta Ativa */}
                <div
                  className={`tinder-active-card ${stamp ? `stamp-${stamp}` : ""}`}
                >
                  <img
                    src={getImageUrl(filmeAtual.poster_path)}
                    alt={filmeAtual.title}
                    className="tinder-card-cover"
                  />
                  <div className="card-gradient-top" />
                  <div className="card-gradient-bottom" />

                  {/* Carimbos Animados */}
                  {stamp === "like" && (
                    <div className="stamp-badge like-stamp">QUERO ASSISTIR</div>
                  )}
                  {stamp === "pass" && (
                    <div className="stamp-badge pass-stamp">PASSAR</div>
                  )}

                  {/* Top Bar da Carta */}
                  <div className="card-top-badges">
                    <span className="badge-tmdb-gold">
                      <IconStar size={13} color="#0c0e11" filled />
                      {filmeAtual.vote_average
                        ? filmeAtual.vote_average.toFixed(1)
                        : "8.4"}
                    </span>
                    <span className="badge-green">
                      <span className="green-pulse-dot" />
                      97% Match com Você
                    </span>
                  </div>

                  {/* Bottom Bar da Carta com Infos */}
                  <div className="card-bottom-info">
                    <div className="card-genre-tags">
                      {(filmeAtual.genres || [{ name: "Cinema" }])
                        .slice(0, 2)
                        .map((g, i) => (
                          <span key={i} className="mini-genre-pill">
                            {g.name}
                          </span>
                        ))}
                      <span className="mini-genre-pill">
                        {filmeAtual.release_date?.split("-")[0] || "2025"}
                      </span>
                    </div>

                    <h2 className="card-movie-name">{filmeAtual.title}</h2>
                    <span className="card-director-sub">
                      Duração: {filmeAtual.runtime || 135} min • Alta Resolução
                    </span>

                    <div className="card-streaming-box">
                      <span className="stream-brasil-label">
                        Disponível no Brasil:
                      </span>
                      <strong className="stream-brasil-providers">
                        {filmeAtual.providers && filmeAtual.providers.length > 0
                          ? filmeAtual.providers.map((p) => p.nome).join(" • ")
                          : "Max • Prime Video • Netflix"}
                      </strong>
                    </div>

                    <p className="card-synopsis-snippet">
                      {filmeAtual.overview}
                    </p>
                  </div>
                </div>

                {/* Botoes de Controle da Pilha */}
                <div className="tinder-controls-bar">
                  <button
                    type="button"
                    className="control-btn btn-pass"
                    onClick={() => handleAction("pass")}
                    title="Passar filme (←)"
                  >
                    <IconClose size={28} color="#e50914" />
                  </button>

                  <Link
                    to={`/filme/${filmeAtual.id}`}
                    className="control-btn btn-info"
                    title="Ver Ficha Completa"
                  >
                    <IconPlay size={20} color="#a7c8ff" />
                  </Link>

                  <button
                    type="button"
                    className="control-btn btn-like"
                    onClick={() => handleAction("like")}
                    title="Quero Assistir (→)"
                  >
                    <IconHeart size={32} color="#0c0e11" filled />
                  </button>
                </div>

                {/* Legenda dos Teclados */}
                <div className="keyboard-hints-row">
                  <span>
                    <kbd>←</kbd> Passar
                  </span>
                  <span>
                    <kbd>→</kbd> Match
                  </span>
                </div>
              </div>
            ) : (
              <div className="empty-box match-finished-box">
                <h3>Você explorou toda a lista de hoje!</h3>
                <p>
                  Parabéns! Você analisou todas as recomendações do momento.
                  Navegue pelos filmes que salvou na sua fila ou reinicie a
                  rodada.
                </p>
                <div className="finished-actions">
                  <button
                    type="button"
                    className="btn-cinelog-primary"
                    onClick={handleRecarregar}
                  >
                    Recarregar Fila
                  </button>
                  <Link to="/perfil" className="btn-cinelog-secondary">
                    Ir para Meu Perfil
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: Fila CineMatch de Hoje */}
          <aside className="match-queue-column">
            <div className="queue-card-panel">
              <div className="queue-header-row">
                <div className="queue-title-group">
                  <span className="queue-icon">▶</span>
                  <h3 className="queue-title">Fila CineMatch de Hoje</h3>
                </div>
                <span className="queue-count-pill">
                  {filaHoje.length} salvos
                </span>
              </div>
              <p className="queue-desc">
                Últimos favoritados prontos para dar play:
              </p>

              <div className="queue-items-list">
                {filaHoje.length > 0 ? (
                  filaHoje.map((item) => (
                    <Link
                      key={item.id}
                      to={`/filme/${item.id}`}
                      className="queue-item-row"
                    >
                      <div className="queue-item-thumb">
                        <img
                          src={getImageUrl(item.poster_path)}
                          alt={item.title}
                        />
                        <span className="queue-thumb-score">
                          {item.vote_average
                            ? item.vote_average.toFixed(1)
                            : "8.5"}
                        </span>
                      </div>
                      <div className="queue-item-details">
                        <h4 className="queue-item-title">{item.title}</h4>
                        <span className="queue-item-meta">
                          {item.release_date?.split("-")[0] || "2025"} •{" "}
                          {item.runtime || 120}m
                        </span>
                        <div className="queue-item-providers">
                          <span className="queue-provider-tag">
                            {item.providers && item.providers[0]
                              ? item.providers[0].nome
                              : "Streaming"}
                          </span>
                        </div>
                      </div>
                      <span className="queue-item-arrow">→</span>
                    </Link>
                  ))
                ) : (
                  <div className="queue-empty-note">
                    <p>
                      Sua fila está vazia. Dê Match nos filmes para adicioná-los
                      aqui!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {toast && <div className="details-toast">{toast}</div>}
    </div>
  );
}
