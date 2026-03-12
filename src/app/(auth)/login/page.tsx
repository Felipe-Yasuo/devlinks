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

        const formData = new FormData(e.currentTarget)

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
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <h1 className="text-2xl font-bold">Entrar</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input name="email" type="email" placeholder="Email" required
                    className="border p-2 rounded" />
                <input name="password" type="password" placeholder="Senha" required
                    className="border p-2 rounded" />

                <button type="submit" disabled={loading}
                    className="bg-black text-white p-2 rounded disabled:opacity-50">
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                <a href="/register" className="text-sm text-center text-gray-500">
                    Não tem conta? Cadastrar
                </a>
            </form>
        </div>
    )
}