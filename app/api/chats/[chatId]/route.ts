import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
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

    const chat = await prisma.chat.findFirst({
      where: {
        id: params.chatId,
        members: {
          some: {
            user: {
              username: nomeUsuario
            }
          }
        }
      },
      include: {
        messages: {
          include: {
            user: true
          }
        }
      }
    })

    if (!chat) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: 'Not Found',
        }),
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
    
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