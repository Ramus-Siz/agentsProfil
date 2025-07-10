import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const funcFile = path.resolve(process.cwd(), 'src/data/function.json');

export async function GET() {
  const content = await fs.readFile(funcFile, 'utf-8');
  console.log('Reading functions from file:', JSON.stringify(JSON.parse(content)));
  return NextResponse.json(JSON.parse(content));
}

export async function POST(req: Request) {
  const newItem = await req.json();
  const list = JSON.parse(await fs.readFile(funcFile, 'utf-8'));
  newItem.id = list.length > 0 ? list[list.length - 1].id + 1 : 1;
  list.push(newItem);
  await fs.writeFile(funcFile, JSON.stringify(list, null, 2));
  return NextResponse.json(newItem);
}

export async function PUT(req: Request) {
  const updatedItem = await req.json();
  const list = JSON.parse(await fs.readFile(funcFile, 'utf-8'));
  const index = list.findIndex((d: any) => d.id === updatedItem.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  list[index] = updatedItem;
  await fs.writeFile(funcFile, JSON.stringify(list, null, 2));
  return NextResponse.json(updatedItem);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  let list = JSON.parse(await fs.readFile(funcFile, 'utf-8'));
  list = list.filter((d: any) => d.id !== id);
  await fs.writeFile(funcFile, JSON.stringify(list, null, 2));
  return NextResponse.json({ success: true });
}