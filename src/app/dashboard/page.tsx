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
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Meus Links</h1>
            <LinkForm />
            <LinkList links={links} />
        </div>
    )
}   