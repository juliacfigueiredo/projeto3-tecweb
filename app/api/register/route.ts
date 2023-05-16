import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as {
      username: string;
      password: string;
    };
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        encrypted_password: hashed_password,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
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