"use client"

import { useState, useEffect } from "react"
import { deleteLinkAction, updateLinkAction, reorderLinksAction } from "@/actions/links"
import { useRouter } from "next/navigation"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Link = {
    id: string
    title: string
    url: string
    order: number
}

function SortableLink({
    link,
    onEditStart,
    onDelete,
    editingId,
    editTitle,
    editUrl,
    setEditTitle,
    setEditUrl,
    onEditSave,
    onEditCancel,
}: {
    link: Link
    onEditStart: (link: Link) => void
    onDelete: (id: string) => void
    editingId: string | null
    editTitle: string
    editUrl: string
    setEditTitle: (v: string) => void
    setEditUrl: (v: string) => void
    onEditSave: (id: string) => void
    onEditCancel: () => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
        >
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
                            onClick={() => onEditSave(link.id)}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            Salvar
                        </button>
                        <button
                            onClick={onEditCancel}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors px-1"
                    >
                        ⠿
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-medium text-sm">{link.title}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{link.url}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEditStart(link)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => onDelete(link.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs transition-colors"
                        >
                            Deletar
                        </button>
                    </div>
                </div>
            )}
        </li>
    )
}

export default function LinkList({ links: initialLinks }: { links: Link[] }) {
    const router = useRouter()
    const [links, setLinks] = useState(initialLinks)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editUrl, setEditUrl] = useState("")
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = links.findIndex((l) => l.id === active.id)
        const newIndex = links.findIndex((l) => l.id === over.id)

        const reordered = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
            ...link,
            order: index,
        }))

        setLinks(reordered)
        await reorderLinksAction(reordered.map((l) => ({ id: l.id, order: l.order })))
    }

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
        await updateLinkAction(id, { title: editTitle, url: editUrl })
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

    if (!isMounted) {
        return (
            <ul className="flex flex-col gap-3">
                {links.map((link) => (
                    <li key={link.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium text-sm">{link.title}</p>
                                <p className="text-zinc-500 text-xs mt-0.5">{link.url}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <ul className="flex flex-col gap-3">
                    {links.map((link) => (
                        <SortableLink
                            key={link.id}
                            link={link}
                            onEditStart={handleEditStart}
                            onDelete={handleDelete}
                            editingId={editingId}
                            editTitle={editTitle}
                            editUrl={editUrl}
                            setEditTitle={setEditTitle}
                            setEditUrl={setEditUrl}
                            onEditSave={handleEditSave}
                            onEditCancel={() => setEditingId(null)}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    )
}