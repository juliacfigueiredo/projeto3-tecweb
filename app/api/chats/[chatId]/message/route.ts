import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    const nomeUsuario = session?.user?.name

    if (!nomeUsuario) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Unauthorized"
        }),
        { status: 401 }
      )
    }

    const body: { text: string } = await req.json()
    const chatId = params.chatId

    const message = await prisma.message.create({
      data: {
        chat: {
          connect: {
            id: chatId
          }
        },
        user: {
          connect: {
            username: nomeUsuario
          }
        },
        text: body.text,
      }, 
      include: {
        user: true
      }
    })

    if (!message) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: 'Internal Server Error',
        }),
        { status: 500 }
      );
    }

    return NextResponse.json(message);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}