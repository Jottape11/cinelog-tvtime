import { CATALOG_MOVIES } from "./catalogData";

// configuracao de conexao com a api oficial do tmdb
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const ORIGINAL_IMAGE_URL = "https://image.tmdb.org/t/p/original";

// formata url de imagens com fallback automatico
export function getImageUrl(path) {
  if (!path)
    return "https://image.tmdb.org/t/p/w500/zNAw7jK8bwCK56rIW676pdgkwhd.jpg";
  if (path.startsWith("http")) return path;
  return `${BASE_IMAGE_URL}${path}`;
}

export function getBackdropUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${ORIGINAL_IMAGE_URL}${path}`;
}

// busca catalogo completo com os melhores de 2025 e 2026
// busca catalogo de filmes populares
export async function getFilmesPopulares(pagina = 1) {
  // simula um pequeno delay para feedback de carregamento natural
  if (API_KEY) {
    try {
      // padrao dos dois awaits ensinado em aula
      const resposta = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${pagina}`,
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.results && dados.results.length > 0) {
          return dados.results;
        }
      }
    } catch (err) {
      console.warn(
        "Aviso: Falha na API TMDB remota, utilizando catálogo local:",
        err.message,
      );
    }
  }

  // fallback de carregamento local para apresentacao confiavel
  await new Promise((resolve) => setTimeout(resolve, 150));
  return CATALOG_MOVIES;
}

// pesquisa local rápida nos títulos, sinopses e generos
// pesquisa nos titulos, sinopses e generos
export async function pesquisarFilmes(termo) {
  if (!termo.trim()) return CATALOG_MOVIES;

  if (API_KEY) {
    try {
      const resposta = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
          termo,
        )}`,
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.results && dados.results.length > 0) {
          return dados.results;
        }
      }
    } catch (err) {
      console.warn(
        "Aviso: Falha na busca da API TMDB, utilizando catálogo local:",
        err.message,
      );
    }
  }

  const t = termo.toLowerCase().trim();
  return CATALOG_MOVIES.filter((f) => {
    const tituloMatch = f.title.toLowerCase().includes(t);
    const generoMatch = (f.genres || []).some((g) =>
      g.name.toLowerCase().includes(t),
    );
    const sinopseMatch = (f.overview || "").toLowerCase().includes(t);
    return tituloMatch || generoMatch || sinopseMatch;
  });
}

// detalhes completos do filme por id
// busca detalhes completos do filme por id
export async function getDetalhesFilme(id) {
  if (API_KEY) {
    try {
      const resposta = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`,
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        return dados;
      }
    } catch (err) {
      console.warn("Aviso: Falha ao obter detalhes na API TMDB:", err.message);
    }
  }

  const filme = CATALOG_MOVIES.find((f) => String(f.id) === String(id));
  return filme || null;
}

// onde assistir no brasil
// provedores onde assistir no brasil
export async function getOndeAssistir(id) {
  if (API_KEY) {
    try {
      const resposta = await fetch(
        `${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`,
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        const br = dados.results?.BR;
        if (br && br.flatrate) {
          return br.flatrate.map((p) => ({
            id: p.provider_id,
            nome: p.provider_name,
            logo: `${BASE_IMAGE_URL}${p.logo_path}`,
          }));
        }
      }
    } catch (err) {
      console.warn(
        "Aviso: Falha ao buscar provedores na API TMDB:",
        err.message,
      );
    }
  }

  const filme = CATALOG_MOVIES.find((f) => String(f.id) === String(id));
  if (filme && filme.providers) {
    return filme.providers;
  }
  return [
    { id: "netflix", nome: "Netflix" },
    { id: "prime", nome: "Prime Video" },
  ];
}

// elenco do filme
// elenco principal do filme
export async function getElencoFilme(id) {
  if (API_KEY) {
    try {
      const resposta = await fetch(
        `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=pt-BR`,
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.cast) {
          return dados.cast.slice(0, 8).map((c) => ({
            id: c.id,
            nome: c.name,
            personagem: c.character,
            foto: c.profile_path ? `${BASE_IMAGE_URL}${c.profile_path}` : null,
          }));
        }
      }
    } catch (err) {
      console.warn("Aviso: Falha ao buscar elenco na API TMDB:", err.message);
    }
  }

  const filme = CATALOG_MOVIES.find((f) => String(f.id) === String(id));
  if (filme && filme.cast) {
    return filme.cast;
  }
  return [];
}

// recomendacoes para o CineMatch
// recomendacoes para o cinematch
export async function getRecomendacoes(filmeId) {
  if (API_KEY && filmeId) {
    try {
      const resposta = await fetch(
        `${BASE_URL}/movie/${filmeId}/recommendations?api_key=${API_KEY}&language=pt-BR`,
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.results && dados.results.length > 3) {
          return dados.results;
        }
      }
    } catch (err) {
      console.warn(
        "Aviso: Falha ao buscar recomendacoes na API TMDB:",
        err.message,
      );
    }
  }

  if (filmeId) {
    const semente = CATALOG_MOVIES.find(
      (f) => String(f.id) === String(filmeId),
    );
    if (semente && semente.genres && semente.genres[0]) {
      const gNome = semente.genres[0].name;
      const similares = CATALOG_MOVIES.filter(
        (f) =>
          String(f.id) !== String(filmeId) &&
          f.genres.some((g) => g.name === gNome),
      );
      if (similares.length > 3) return similares;
    }
  }
  // baralha um pouco para variedade

  return [...CATALOG_MOVIES].reverse();
}
