import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const depFile = path.resolve(process.cwd(), 'src/data/departements.json');

export async function GET() {
  const content = await fs.readFile(depFile, 'utf-8');
  console.log('Reading departements from file:', JSON.stringify(JSON.parse(content)));
  return NextResponse.json(JSON.parse(content));
}

export async function POST(req: Request) {
  const newItem = await req.json();
  const list = JSON.parse(await fs.readFile(depFile, 'utf-8'));
  newItem.id = list.length > 0 ? list[list.length - 1].id + 1 : 1;
  list.push(newItem);
  await fs.writeFile(depFile, JSON.stringify(list, null, 2));
  return NextResponse.json(newItem);
}

export async function PUT(req: Request) {
  const updatedItem = await req.json();
  const list = JSON.parse(await fs.readFile(depFile, 'utf-8'));
  const index = list.findIndex((d: any) => d.id === updatedItem.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  list[index] = updatedItem;
  await fs.writeFile(depFile, JSON.stringify(list, null, 2));
  return NextResponse.json(updatedItem);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, name } = body;
  if (!id || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const list = JSON.parse(await fs.readFile(depFile, 'utf-8'));
  const index = list.findIndex((d: any) => d.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  list[index].name = name;
  await fs.writeFile(depFile, JSON.stringify(list, null, 2));
  return NextResponse.json(list[index]);
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  console.log('Dropping departement with id:', id);
  
  let list = JSON.parse(await fs.readFile(depFile, 'utf-8'));
  list = list.filter((d: any) => d.id !== id);
  await fs.writeFile(depFile, JSON.stringify(list, null, 2));
  return NextResponse.json({ success: true });
}
