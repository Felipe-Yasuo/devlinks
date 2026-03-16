"use client"

import { useState } from "react"
import { updateProfileAction } from "@/actions/profile"
import { useRouter } from "next/navigation"

type Props = {
    user: {
        name: string
        bio: string | null
        avatar: string | null
    }
}

export default function EditProfileModal({ user }: Props) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const form = e.currentTarget
        const formData = new FormData(form)

        let avatarUrl = user.avatar

        if (avatarFile) {
            const uploadData = new FormData()
            uploadData.append("file", avatarFile)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            })

            const data = await res.json()

            if (data.error) {
                setError("Erro ao fazer upload da imagem")
                setLoading(false)
                return
            }

            avatarUrl = data.url
        }

        const result = await updateProfileAction({
            name: formData.get("name") as string,
            bio: formData.get("bio") as string,
            avatar: avatarUrl,
        })

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        setIsOpen(false)
        setLoading(false)
        router.refresh()
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
                Editar perfil
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-white font-semibold mb-4">Editar perfil</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-3 mb-2">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {user.name[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <label className="text-violet-400 hover:text-violet-300 text-sm cursor-pointer transition-colors">
                                    Trocar foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-zinc-400 text-sm">Nome</label>
                                <input
                                    name="name"
                                    defaultValue={user.name}
                                    required
                                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-zinc-400 text-sm">Bio</label>
                                <textarea
                                    name="bio"
                                    defaultValue={user.bio ?? ""}
                                    rows={3}
                                    placeholder="Conta um pouco sobre você..."
                                    className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                                >
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg py-3 text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}