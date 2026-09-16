import { Link } from "react-router";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="cinelog-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Coluna 1: Marca & Missao */}
          <div className="footer-col">
            <div className="footer-brand-title">
              <span className="brand-logo-text">
                Cine<span className="brand-highlight">Log</span>
              </span>
              <span className="footer-version-tag">v2.6</span>
            </div>
            <p className="footer-desc">
              O Novo TV Time para cinéfilos apaixonados. Acompanhe, descubra e
              organize suas jornadas cinematográficas com precisão e
              inteligência comunitária.
            </p>
            <div className="footer-status-pill">
              <span className="status-indicator-dot" />
              <span>Watch Providers Brasil Ativos</span>
            </div>
          </div>

          {/* Coluna 2: Identificacao Academica */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Projeto Acadêmico</h4>
            <p className="footer-text-light">
              Checkpoint 1 de Web Development (2º Trimestre / 2026)
            </p>
            <p className="footer-text-muted">
              FIAP — Faculdade de Informática e Administração Paulista
            </p>
            <p className="footer-text-muted">
              <strong>Grupo (Turma 1ESPW):</strong>
              <br />• João Pedro Sá
              <br />• Gustavo Rezende Louro
            </p>
            <p className="footer-text-muted">Orientação: Prof. Caio Oliveira</p>
          </div>

          {/* Coluna 3: Dados & Integracoes */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Dados &amp; Integrações</h4>
            <p className="footer-text-muted">
              Metadados de filmes, elenco e avaliações sincronizados via The
              Movie Database (TMDB).
            </p>
            <p className="footer-text-muted">
              Disponibilidade em streaming atualizada conforme catálogo
              brasileiro (Netflix, Prime Video, Max, Disney+ e Apple TV+).
            </p>
          </div>

          {/* Coluna 4: Acesso Rapido & Metodologia */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Acesso Rápido</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/">Explorar Catálogo</Link>
              </li>
              <li>
                <Link to="/match">CineMatch (Modo Descoberta)</Link>
              </li>
              <li>
                <Link to="/perfil">Meu Perfil &amp; Horas de Vida</Link>
              </li>
              <li>
                <a
                  href="https://stitch.withgoogle.com/projects/17388927452232081278"
                  target="_blank"
                  rel="noreferrer"
                >
                  Protótipo Google Stitch ↗
                </a>
              </li>
              <li>
                <Link to="/simular-erro-404" className="footer-test-404-link">
                  Testar Página 404 (Erro) ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha inferior de copyright e disclaimers */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © 2026 CineLog — Desenvolvido por João Pedro Sá e Gustavo Rezende
            Louro | Turma 1ESPW FIAP.
          </p>
          <p className="disclaimer-text">
            Este produto utiliza a API do TMDB, mas não é endossado ou
            certificado pelo TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
