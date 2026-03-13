"use client"

import { useState } from "react"
import { createLinkAction } from "@/actions/links"
import { useRouter } from "next/navigation"

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
            <h2 className="text-lg font-semibold">Adicionar link</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input name="title" placeholder="Título (ex: GitHub)" required
                className="border p-2 rounded" />
            <input name="url" type="url" placeholder="URL (ex: https://github.com/...)" required
                className="border p-2 rounded" />

            <button type="submit" disabled={loading}
                className="bg-black text-white p-2 rounded disabled:opacity-50">
                {loading ? "Adicionando..." : "Adicionar link"}
            </button>
        </form>
    )
}