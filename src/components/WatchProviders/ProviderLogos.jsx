// Logos oficiais vetorizados com as cores e tipografia de streaming
export function LogoNetflix({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#141414",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.75}
        viewBox="0 0 16 24"
        fill="none"
      >
        <path d="M0 0h4v24H0V0zm12 0h4v24h-4V0z" fill="#E50914" />
        <path d="M0 0l12 24h4L4 0H0z" fill="#B81D24" />
      </svg>
    </div>
  );
}

export function LogoPrimeVideo({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#00A8E1",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        color: "#ffffff",
        fontWeight: 800,
        fontSize: size * 0.32,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: "-0.5px",
        flexShrink: 0,
      }}
    >
      prime
    </div>
  );
}

export function LogoMax({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#002BE7",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        color: "#ffffff",
        fontWeight: 900,
        fontSize: size * 0.34,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: "0.5px",
        flexShrink: 0,
      }}
    >
      MAX
    </div>
  );
}

export function LogoDisney({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#113CCF",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        color: "#ffffff",
        fontWeight: 800,
        fontSize: size * 0.35,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      D+
    </div>
  );
}

export function LogoAppleTV({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#282a2d",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        color: "#f4f5f7",
        fontWeight: 700,
        fontSize: size * 0.34,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      tv+
    </div>
  );
}

export function LogoGooglePlay({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#282a2d",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        color: "#f5c518",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
  );
}

export function LogoCinema({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#1e2023",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        color: "#ffb870",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
      </svg>
    </div>
  );
}

export function renderLogo(providerId, size = 36) {
  const id = String(providerId).toLowerCase();
  if (id.includes("netflix") || id === "8") return <LogoNetflix size={size} />;
  if (id.includes("prime") || id === "119")
    return <LogoPrimeVideo size={size} />;
  if (id.includes("disney") || id === "337") return <LogoDisney size={size} />;
  if (id.includes("max") || id.includes("hbo") || id === "384")
    return <LogoMax size={size} />;
  if (id.includes("apple") || id === "2") return <LogoAppleTV size={size} />;
  if (id.includes("google") || id.includes("play") || id === "3")
    return <LogoGooglePlay size={size} />;
  return <LogoCinema size={size} />;
}
