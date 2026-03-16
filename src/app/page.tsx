import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">

      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" fill="white" />
            </svg>
          </div>
          <span className="text-white font-semibold" style={{ fontFamily: "var(--font-syne)" }}>
            DevLinks
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-400 text-xs">Grátis para sempre</span>
        </div>

        <h1
          className="text-5xl sm:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-3xl mb-6"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Todos os seus links{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
            em um só lugar
          </span>
        </h1>

        <p
          className="text-zinc-400 text-lg max-w-md mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Crie seu perfil, adicione seus links e compartilhe tudo com uma única URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Criar meu perfil grátis →
          </Link>
          <Link
            href="/login"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Mock profile card */}
        <div className="mt-20 w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne)" }}>
            Y
          </div>
          <div className="text-center">
            <p className="text-white font-semibold" style={{ fontFamily: "var(--font-syne)" }}>Yasuo Dev</p>
            <p className="text-zinc-500 text-sm">@yasuo</p>
          </div>
          <div className="w-full flex flex-col gap-2">
            {["GitHub", "LinkedIn", "Portfolio"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl text-sm"
              >
                <span>{label}</span>
                <span className="text-zinc-600">→</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8">
        <p className="text-zinc-700 text-xs">
          feito com <span className="text-violet-500">DevLinks</span>
        </p>
      </footer>

    </div>
  )
}