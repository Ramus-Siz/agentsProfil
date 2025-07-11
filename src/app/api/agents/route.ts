import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const agentFile = path.resolve(process.cwd(), 'src/data/agents.json');

export async function GET() {
  const content = await fs.readFile(agentFile, 'utf-8');
  console.log('Reading agents from file:', JSON.stringify(JSON.parse(content)));
  
  return NextResponse.json(JSON.parse(content));
}

export async function POST(req: Request) {  
  const newAgent = await req.json();
  const agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));
  newAgent.id = agents.length > 0 ? agents[agents.length - 1].id + 1 : 1;
  agents.push(newAgent);
  await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));
  return NextResponse.json(newAgent);
}

export async function PUT(req: Request) {
  const updatedAgent = await req.json();
  const agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));
  const index = agents.findIndex((a: any) => a.id === updatedAgent.id);
  if (index === -1) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  agents[index] = updatedAgent;
  await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));
  return NextResponse.json(updatedAgent);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  let agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));
  agents = agents.filter((a: any) => a.id !== id);
  await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  console.log('Updating agent status:', { id, status });
  

  if (typeof id === 'undefined' || typeof status === 'undefined') {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));

  const index = agents.findIndex((a: any) => a.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  agents[index].status = status;

  await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));

  return NextResponse.json(agents[index]);
}
