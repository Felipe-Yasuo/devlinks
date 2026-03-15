import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import LinkForm from "@/components/LinkForm"
import LinkList from "@/components/LinkList"

export default async function DashboardPage() {
    const session = await auth()

    const links = await prisma.link.findMany({
        where: { userId: session?.user?.id as string },
        orderBy: { order: "asc" },
    })

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <header className="border-b border-zinc-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" fill="white" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold">DevLinks</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={`/${session?.user?.username}`}
                            target="_blank"
                            className="text-zinc-400 hover:text-white text-sm transition-colors"
                        >
                            Ver perfil →
                        </a>
                    </div>
                </div>
            </header >

            <main className="max-w-2xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Meus Links</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Gerencie os links do seu perfil público
                    </p>
                </div>

                <LinkForm />
                <LinkList links={links} />
            </main>
        </div >
    )
}