import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { IconSearch, IconCineLogLogo } from "../Icons";
import "./Navbar.css";

export default function Navbar({ onBuscar }) {
  const [busca, setBusca] = useState("");
  const [totalAssistidos, setTotalAssistidos] = useState(0);
  const [horasGastas, setHorasGastas] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function atualizarEstatisticas() {
      const salvos =
        JSON.parse(localStorage.getItem("cinelog_assistidos")) || [];
      setTotalAssistidos(salvos.length);

      const totalMinutos = salvos.reduce(
        (acc, f) => acc + (f.runtime || 120),
        0,
      );
      const horas = Math.floor(totalMinutos / 60);
      setHorasGastas(horas);
    }

    atualizarEstatisticas();
    window.addEventListener("storage", atualizarEstatisticas);
    window.addEventListener("cinelog_storage_update", atualizarEstatisticas);
    return () => {
      window.removeEventListener("storage", atualizarEstatisticas);
      window.removeEventListener(
        "cinelog_storage_update",
        atualizarEstatisticas,
      );
    };
  }, [location.pathname]);

  function handleSubmit(e) {
    e.preventDefault();
    if (busca.trim()) {
      if (onBuscar) onBuscar(busca.trim());
      navigate(`/?q=${encodeURIComponent(busca.trim())}`);
    }
  }

  function handleFilterStreaming() {
    navigate("/?filtro=streaming#catalogo");
  }

  return (
    <header className="cinelog-header">
      <div className="cinelog-header-inner">
        {/* Marca e Logotipo Oficial Stitch */}
        <div className="header-brand-group">
          <Link
            to="/"
            className="cinelog-brand"
            title="CineLog - O Novo TV Time"
          >
            <IconCineLogLogo />
          </Link>

          <nav className="cinelog-nav">
            <Link
              to="/"
              className={`cinelog-nav-link ${location.pathname === "/" && !location.search.includes("streaming") ? "active" : ""}`}
            >
              Explorar
            </Link>
            <Link
              to="/match"
              className={`cinelog-nav-link ${location.pathname === "/match" ? "active" : ""}`}
            >
              CineMatch
              <span className="badge-new-pill">NOVO</span>
            </Link>
            <button
              type="button"
              onClick={handleFilterStreaming}
              className={`cinelog-nav-link ${location.search.includes("streaming") ? "active" : ""}`}
            >
              Onde Assistir
            </button>
            <Link
              to="/perfil"
              className={`cinelog-nav-link ${location.pathname === "/perfil" ? "active" : ""}`}
            >
              Meu Perfil
            </Link>
            <Link
              to="/simular-erro-404"
              className={`cinelog-nav-link cinelog-nav-404 ${location.pathname === "/simular-erro-404" ? "active" : ""}`}
              title="Testar página de Erro 404 (Rota Inexistente)"
            >
              <span className="badge-404-pill">404</span>
              <span>Testar Erro</span>
            </Link>
          </nav>
        </div>

        {/* Barra de Pesquisa com atalho de teclado */}
        <form onSubmit={handleSubmit} className="cinelog-search-box">
          <IconSearch size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Buscar filmes por título, diretor ou ator..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="search-kbd-hint">⌘K</span>
        </form>

        {/* Painel de Metricas Rapidas de Tempo de Vida e Avatar */}
        <div className="header-actions-group">
          <Link
            to="/perfil"
            className="quick-life-widget"
            title="Ver cálculo detalhado de horas de vida"
          >
            <div className="life-widget-metric">
              <span className="metric-value">{totalAssistidos} filmes</span>
              <span className="metric-label">assistidos</span>
            </div>
            <div className="life-widget-divider" />
            <div className="life-widget-metric">
              <span className="metric-value metric-gold">
                {horasGastas}h de tela
              </span>
              <span className="metric-label">vida gasta</span>
            </div>
          </Link>

          <Link
            to="/perfil"
            className="user-avatar-button"
            title="Perfil de Prof. Caio Oliveira"
          >
            <img
              src="/professor-caio.png"
              alt="Prof. Caio Oliveira"
              className="user-avatar-img"
            />
            <span className="online-indicator-dot" />
          </Link>
        </div>
      </div>
    </header>
  );
}
