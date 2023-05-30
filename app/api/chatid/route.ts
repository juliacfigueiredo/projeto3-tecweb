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

        const {messageuser, chatid} = (await req.json()) as {
            messageuser: string;
            chatid: string;
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

        const message = await prisma.message.create({
            data: {
                text: messageuser,
                chat_id: chatid,
                user_id: myself.id,
            },
        });

        return NextResponse.json({
            message: {
                id: message.id,
                text: message.text,
                user: {
                    id: myself.id,
                    username: myself.username,
                },
            },
        });
    } catch (error: any) {
        console.error(error)
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: 'Unauthorized',
            }),
            { status: 403 }
        );
    }
}
