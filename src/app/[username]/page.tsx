import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

type Props = {
    params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: Props) {
    const { username } = await params

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            links: {
                orderBy: { order: "asc" },
            },
        },
    })

    if (!user) notFound()

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm flex flex-col items-center gap-6">

                <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-violet-600 flex items-center justify-center">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-white">
                                {user.name[0].toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-white">{user.name}</h1>
                        <p className="text-zinc-500 text-sm">@{user.username}</p>
                        {user.bio && (
                            <p className="text-zinc-400 text-sm mt-2 text-center">{user.bio}</p>
                        )}
                    </div>
                </div>

                <ul className="w-full flex flex-col gap-3">
                    {user.links.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/50 text-white px-5 py-4 rounded-xl transition-all group"
                            >
                                <span className="font-medium text-sm">{link.title}</span>
                                <span className="text-zinc-600 group-hover:text-violet-400 transition-colors text-sm">→</span>
                            </a>
                        </li>
                    ))}
                </ul>

                {user.links.length === 0 && (
                    <p className="text-zinc-600 text-sm">Nenhum link cadastrado ainda.</p>
                )}

                <p className="text-zinc-700 text-xs mt-4">
                    feito com <span className="text-violet-500">DevLinks</span>
                </p>

            </div>
        </div >
    )
}