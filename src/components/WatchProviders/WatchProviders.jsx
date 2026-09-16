import { renderLogo } from "./ProviderLogos";
import "./WatchProviders.css";

export default function WatchProviders({ providers = [] }) {
  if (!providers || providers.length === 0) {
    return (
      <div className="providers-card-wrapper">
        <div className="providers-header-bar">
          <div className="providers-title-group">
            <span className="providers-play-icon">▶</span>
            <h3 className="providers-heading">Onde Assistir no Brasil</h3>
          </div>
          <div className="providers-source-tag">
            <span>via</span>
            <strong>Watch Providers Brasil</strong>
            <span className="live-dot" />
          </div>
        </div>
        <div className="providers-empty-state">
          <p>
            Disponibilidade em streaming sendo atualizada pela curadoria do
            TMDB.
          </p>
        </div>
      </div>
    );
  }

  // Se nao houver divisao explicita, usamos os streamings como assinatura e geramos os de aluguel
  const assinatura = providers.filter(
    (p) =>
      !String(p.nome).toLowerCase().includes("aluguel") &&
      !String(p.nome).toLowerCase().includes("google"),
  );

  const aluguel = [
    { id: "apple", nome: "Apple TV", detalhe: "Aluguel em 4K HDR • R$ 14,90" },
    {
      id: "google",
      nome: "Google Play Filmes",
      detalhe: "Aluguel & Compra SD/HD/UHD",
    },
  ];

  return (
    <div className="providers-card-wrapper">
      <div className="providers-header-bar">
        <div className="providers-title-group">
          <span className="providers-play-icon">▶</span>
          <h3 className="providers-heading">Onde Assistir no Brasil</h3>
        </div>
        <div className="providers-source-tag">
          <span>via</span>
          <strong>Watch Providers Brasil</strong>
          <span className="live-dot" />
        </div>
      </div>

      <div className="providers-bento-grid">
        {/* Incluso na Assinatura */}
        <div className="provider-category-box">
          <div className="category-top-row">
            <span className="category-title tag-green">
              Incluso na Assinatura
            </span>
            <span className="category-subtitle">Streaming 4K</span>
          </div>

          <div className="providers-rows-list">
            {assinatura.length > 0 ? (
              assinatura.map((p, index) => (
                <div key={p.id || index} className="provider-service-row">
                  <div className="service-info-group">
                    {renderLogo(p.id, 36)}
                    <div className="service-text-group">
                      <span className="service-title">{p.nome}</span>
                      <span className="service-plan">
                        {p.tipo === "flatrate" || !p.tipo
                          ? "Incluso no plano ativo"
                          : p.tipo}
                      </span>
                    </div>
                  </div>
                  <span className="service-action-hint">Assistir ↗</span>
                </div>
              ))
            ) : (
              <div className="service-empty-note">
                <span>
                  Disponível exclusivamente para aluguel digital no momento.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Aluguel & Compra Digital */}
        <div className="provider-category-box">
          <div className="category-top-row">
            <span className="category-title tag-amber">
              Aluguel &amp; Compra Digital
            </span>
            <span className="category-subtitle">A partir de R$ 14,90</span>
          </div>

          <div className="providers-rows-list">
            {aluguel.map((p, index) => (
              <div key={p.id || index} className="provider-service-row">
                <div className="service-info-group">
                  {renderLogo(p.id, 36)}
                  <div className="service-text-group">
                    <span className="service-title">{p.nome}</span>
                    <span className="service-plan">{p.detalhe}</span>
                  </div>
                </div>
                <span className="service-action-hint">Alugar ↗</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
