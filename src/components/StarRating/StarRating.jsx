import { useState } from "react";
import { IconStar } from "../Icons";
import "./StarRating.css";

export default function StarRating({
  notaAtual = 0,
  onAvaliar,
  readonly = false,
  tamanho = 20,
  cor = "#00e054",
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((estrela) => {
        const preenchida = hover ? estrela <= hover : estrela <= notaAtual;
        return (
          <button
            key={estrela}
            type="button"
            className={`star-btn ${readonly ? "readonly" : ""}`}
            onClick={() => !readonly && onAvaliar && onAvaliar(estrela)}
            onMouseEnter={() => !readonly && setHover(estrela)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            title={
              readonly
                ? `Nota: ${notaAtual}/5`
                : `Avaliar com ${estrela} estrela(s)`
            }
          >
            <IconStar size={tamanho} color={cor} filled={preenchida} />
          </button>
        );
      })}
    </div>
  );
}
