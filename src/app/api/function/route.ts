import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const functions = await prisma.function.findMany();
    return NextResponse.json(functions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const newFunction = await prisma.function.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(newFunction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const updatedFunction = await prisma.function.update({
      where: { id: body.id },
      data: { name: body.name },
    });
    return NextResponse.json(updatedFunction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
    const { id } = await req.json();
    await prisma.function.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}
