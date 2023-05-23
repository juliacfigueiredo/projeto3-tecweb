import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const {namechat,member} = (await req.json()) as {
            namechat: string;
            member: string;
        };
        const chat = await prisma.chat.create({
            data: {
                name: namechat.toLowerCase(),
                members: {
                    connect: [
                        {
                            id: member,
                        },
                    ],
            },
        }})
        ;
        return NextResponse.json({
            chat: {
                id: chat.id,
                namechat: chat.name,
            },
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
