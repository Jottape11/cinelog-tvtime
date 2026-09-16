import { IconUser, IconMedal } from "../Icons";
import "./TopActors.css";

const DEFAULT_HALL_OF_FAME = [
  {
    id: 1,
    nome: "Cillian Murphy",
    aparicoes: 18,
    favorito: "Oppenheimer",
    rank: "1º Ouro",
    badgeClass: "badge-gold-star",
  },
  {
    id: 2,
    nome: "Florence Pugh",
    aparicoes: 14,
    favorito: "Duna: Parte 2",
    rank: "2º Prata",
    badgeClass: "badge-silver-star",
  },
  {
    id: 3,
    nome: "Timothée Chalamet",
    aparicoes: 12,
    favorito: "Wonka",
    rank: "3º Bronze",
    badgeClass: "badge-bronze-star",
  },
];

export default function TopActors({ atores = [] }) {
  // Se o usuario ja tiver dados calculados, usa os dele; senao usa o Hall da Fama padrao do Stitch
  const listaExibida =
    atores && atores.length >= 3
      ? atores.slice(0, 3).map((ator, i) => ({
          ...ator,
          rank: i === 0 ? "1º Ouro" : i === 1 ? "2º Prata" : "3º Bronze",
          badgeClass:
            i === 0
              ? "badge-gold-star"
              : i === 1
                ? "badge-silver-star"
                : "badge-bronze-star",
          favorito: ator.favorito || "Filme em Destaque",
        }))
      : DEFAULT_HALL_OF_FAME;

  return (
    <div className="hall-of-fame-card">
      <div className="hall-header-row">
        <div className="hall-title-group">
          <div className="hall-tag-row">
            <span className="hall-medal-icon">
              <IconMedal size={16} color="#ffb870" />
            </span>
            <span className="hall-tag-text">Hall da Fama Pessoal</span>
          </div>
          <h3 className="hall-main-title">Top 3 Atores Mais Assistidos</h3>
        </div>
        <span className="hall-history-pill">Histórico Total</span>
      </div>

      <div className="hall-actors-grid">
        {listaExibida.map((ator) => (
          <div key={ator.id || ator.nome} className="hall-actor-card">
            <div className={`hall-rank-badge ${ator.badgeClass}`}>
              {ator.rank}
            </div>

            <div className="hall-avatar-circle" title={ator.nome}>
              <IconUser
                size={38}
                color={
                  ator.rank.includes("Ouro")
                    ? "#f5c518"
                    : ator.rank.includes("Prata")
                      ? "#cbd5e1"
                      : "#d97706"
                }
              />
            </div>

            <h4 className="hall-actor-name">{ator.nome}</h4>
            <span className="hall-actor-count">{ator.aparicoes} produções</span>
            <span className="hall-actor-fav">Favorito: {ator.favorito}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
