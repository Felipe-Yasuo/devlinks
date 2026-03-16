"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    bio: z.string().max(160, "Bio deve ter no máximo 160 caracteres").optional(),
})

export async function updateProfileAction(data: unknown) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Não autenticado")

    const parsed = profileSchema.safeParse(data)
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { name, bio } = parsed.data

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name, bio },
    })

    revalidatePath("/dashboard")
    return { success: true }
}