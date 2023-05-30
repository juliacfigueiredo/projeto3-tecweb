import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const serverSession = await getServerSession()
    
    if (!serverSession?.user?.name) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: 'Unauthorized',
            }),
            { status: 403 }
        );
    }

    try{
        const {namechat} = (await req.json()) as {
            namechat: string;
        };

        const myself = await prisma.user.findUnique({
            where: {
                username: serverSession?.user?.name
            }
        })

        if (!myself) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: 'Unauthorized',
                }),
                { status: 403 }
            );
        }

        const chat = await prisma.chat.create({
            data: {
                name: namechat.toLowerCase(),
                members: {
                    create: [
                        {
                            user_id: myself.id
                        }
                    ]
            },
        }});

        return NextResponse.json({
            chat: {
                id: chat.id,
                namechat: chat.name,
            },
        });
    } catch (error: any) {
        console.error(error)
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: error.message,
            }),
            { status: 500 }
        );
        }
}    
