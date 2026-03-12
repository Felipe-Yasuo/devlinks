"use server"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function registerAction(data: unknown) {
    const parsed = registerSchema.safeParse(data)

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { name, email, username, password } = parsed.data

    const existingEmail = await prisma.user.findUnique({
        where: { email },
    })

    if (existingEmail) {
        return { error: "Email já cadastrado" }
    }

    const existingUsername = await prisma.user.findUnique({
        where: { username },
    })

    if (existingUsername) {
        return { error: "Username já está em uso" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            username,
            password: hashedPassword,
        },
    })

    return { success: true }
}