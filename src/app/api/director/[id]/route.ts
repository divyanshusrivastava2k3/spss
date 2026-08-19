import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dm = await prisma.directorMessage.findUnique({
      where: { id },
    });
    if (!dm) return new NextResponse("Not Found", { status: 404 });
    return NextResponse.json(dm);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { directorName, directorNameHi, directorTitle, directorTitleHi, message, messageHi, photoUrl, signatureUrl, isActive } = body;

    const dm = await prisma.directorMessage.update({
      where: { id },
      data: { 
        directorName, 
        directorNameHi: directorNameHi || "", 
        directorTitle: directorTitle || "", 
        directorTitleHi: directorTitleHi || "", 
        message, 
        messageHi: messageHi || "", 
        photoUrl: photoUrl || "", 
        signatureUrl: signatureUrl || "", 
        isActive 
      },
    });

    return NextResponse.json(dm);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    await prisma.directorMessage.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}