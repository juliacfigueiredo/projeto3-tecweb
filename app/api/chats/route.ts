import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, res: Response) {
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

    const chats = await prisma.chat.findMany({
        where: {
            members: {
                some: {
                    user: {
                        username: nomeUsuario
                    }
                }
            }
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            username: true,
                            id: true
                        }
                    }
                }
            }
        }
    })

    return NextResponse.json({
      chats,
    });
    
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