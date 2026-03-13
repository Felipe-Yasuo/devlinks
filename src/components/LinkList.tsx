"use client"

import { useState } from "react"
import { deleteLinkAction, updateLinkAction } from "@/actions/links"

type Link = {
    id: string
    title: string
    url: string
    order: number
}

export default function LinkList({ links }: { links: Link[] }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editUrl, setEditUrl] = useState("")

    async function handleDelete(id: string) {
        await deleteLinkAction(id)
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
    }

    if (links.length === 0) {
        return <p className="text-gray-500">Nenhum link ainda. Adicione um!</p>
    }

    return (
        <ul className="flex flex-col gap-4">
            {links.map((link) => (
                <li key={link.id} className="border p-4 rounded flex flex-col gap-2">
                    {editingId === link.id ? (
                        <>
                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                                className="border p-2 rounded" />
                            <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)}
                                className="border p-2 rounded" />
                            <div className="flex gap-2">
                                <button onClick={() => handleEditSave(link.id)}
                                    className="bg-black text-white px-4 py-1 rounded">
                                    Salvar
                                </button>
                                <button onClick={() => setEditingId(null)}
                                    className="border px-4 py-1 rounded">
                                    Cancelar
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold">{link.title}</p>
                            <p className="text-gray-500 text-sm">{link.url}</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditStart(link)}
                                    className="border px-4 py-1 rounded text-sm">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(link.id)}
                                    className="text-red-500 border border-red-500 px-4 py-1 rounded text-sm">
                                    Deletar
                                </button>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
}