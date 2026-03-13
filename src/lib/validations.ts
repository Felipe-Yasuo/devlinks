import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    username: z
        .string()
        .min(3, "Username deve ter pelo menos 3 caracteres")
        .max(20, "Username deve ter no máximo 20 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "Username só pode ter letras, números e _"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const linkSchema = z.object({
    title: z.string().min(1, "Título é obrigatório").max(50, "Título muito longo"),
    url: z.string().url("URL inválida"),
})

export type LinkSchema = z.infer<typeof linkSchema>