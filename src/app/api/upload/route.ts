import { auth } from "@/auth"
import cloudinary from "@/lib/cloudinary"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
        return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "devlinks/avatars",
                transformation: [{ width: 200, height: 200, crop: "fill" }],
            },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        ).end(buffer)
    })

    const { secure_url } = result as { secure_url: string }

    return NextResponse.json({ url: secure_url })
}