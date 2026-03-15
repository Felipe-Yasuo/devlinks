"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const form = e.currentTarget
        const formData = new FormData(form)

        const result = await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirect: false,
        })

        if (result?.error) {
            setError("Email ou senha inválidos")
            setLoading(false)
            return
        }

        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" fill="white" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h1>
                    <p className="text-zinc-500 text-sm mt-1">Entre na sua conta DevLinks</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-sm">Senha</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 text-sm transition-colors mt-2"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="text-center text-zinc-600 text-sm mt-6">
                    Não tem conta?{" "}
                    <a href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
                        Cadastrar
                    </a>
                </p>

            </div>
        </div>
    )
}