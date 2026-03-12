"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerAction } from "@/actions/register"

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)

        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            username: formData.get("username") as string,
            password: formData.get("password") as string,
        }

        const result = await registerAction(data)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        router.push("/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <h1 className="text-2xl font-bold">Criar conta</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input name="name" placeholder="Nome" required
                    className="border p-2 rounded" />
                <input name="email" type="email" placeholder="Email" required
                    className="border p-2 rounded" />
                <input name="username" placeholder="Username" required
                    className="border p-2 rounded" />
                <input name="password" type="password" placeholder="Senha" required
                    className="border p-2 rounded" />

                <button type="submit" disabled={loading}
                    className="bg-black text-white p-2 rounded disabled:opacity-50">
                    {loading ? "Criando conta..." : "Criar conta"}
                </button>

                <a href="/login" className="text-sm text-center text-gray-500">
                    Já tem conta? Entrar
                </a>
            </form>
        </div>
    )
}