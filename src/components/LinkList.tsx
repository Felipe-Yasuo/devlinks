"use client"

import { useState } from "react"
import { deleteLinkAction, updateLinkAction } from "@/actions/links"
import { useRouter } from "next/navigation"

type Link = {
    id: string
    title: string
    url: string
    order: number
}

export default function LinkList({ links }: { links: Link[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editUrl, setEditUrl] = useState("")

    async function handleDelete(id: string) {
        await deleteLinkAction(id)
        router.refresh()
    }

    function handleEditStart(link: Link) {
        setEditingId(link.id)
        setEditTitle(link.title)
        setEditUrl(link.url)
    }

    async function handleEditSave(id: string) {
        await updateLinkAction(id, {
            title: editTitle,
            url: editUrl,
        })
        setEditingId(null)
        router.refresh()
    }

    if (links.length === 0) {
        return (
            <div className="border border-dashed border-zinc-800 rounded-xl p-10 text-center">
                <p className="text-zinc-600 text-sm">Nenhum link ainda. Adicione um acima!</p>
            </div>
        )
    }

    return (
        <ul className="flex flex-col gap-3">
            {links.map((link) => (
                <li key={link.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    {editingId === link.id ? (
                        <div className="flex flex-col gap-3">
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            <input
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditSave(link.id)}
                                    className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium text-sm">{link.title}</p>
                                <p className="text-zinc-500 text-xs mt-0.5">{link.url}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditStart(link)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs transition-colors"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )
}