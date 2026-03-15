"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLinkAction } from "@/actions/links"

export default function LinkForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const form = e.currentTarget
        const formData = new FormData(form)

        const result = await createLinkAction({
            title: formData.get("title") as string,
            url: formData.get("url") as string,
        })

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        form.reset()
        setLoading(false)
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
            <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Adicionar link</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <input
                name="title"
                placeholder="Título (ex: GitHub)"
                required
                className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
            <input
                name="url"
                type="url"
                placeholder="URL (ex: https://github.com/...)"
                required
                className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
            >
                {loading ? "Adicionando..." : "Adicionar link"}
            </button>
        </form>
    )
}