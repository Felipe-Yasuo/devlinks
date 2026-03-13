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
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                        {user.name[0].toUpperCase()}
                    </div>
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    {user.bio && <p className="text-gray-500 text-sm text-center">{user.bio}</p>}
                </div>

                <ul className="w-full flex flex-col gap-3">
                    {user.links.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center border p-3 rounded-lg hover:bg-gray-50 transition"
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}
                </ul>

                {user.links.length === 0 && (
                    <p className="text-gray-400">Nenhum link cadastrado ainda.</p>
                )}
            </div>
        </div >
    )
}