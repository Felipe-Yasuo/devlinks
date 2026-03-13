"use server"

import { prisma } from "@/lib/prisma"
import { linkSchema } from "@/lib/validations"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

async function getSession() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Não autenticado")
    return session
}

export async function createLinkAction(data: unknown) {
    const session = await getSession()
    const parsed = linkSchema.safeParse(data)

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { title, url } = parsed.data

    await prisma.link.create({
        data: {
            title,
            url,
            userId: session.user.id as string,
        },
    })

    revalidatePath("/dashboard")
    return { success: true }
}

export async function updateLinkAction(id: string, data: unknown) {
    await getSession()
    const parsed = linkSchema.safeParse(data)

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { title, url } = parsed.data

    await prisma.link.update({
        where: { id },
        data: { title, url },
    })

    revalidatePath("/dashboard")
    return { success: true }
}

export async function deleteLinkAction(id: string) {
    await getSession()

    await prisma.link.delete({
        where: { id },
    })

    revalidatePath("/dashboard")
    return { success: true }
}