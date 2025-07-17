// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';
// import { requireAuth } from '@/lib/auth-guard';


// const agentFile = path.resolve(process.cwd(), 'src/data/agents.json');

// export async function GET() {
  
//   const content = await fs.readFile(agentFile, 'utf-8');
  
//   return NextResponse.json(JSON.parse(content));
// }

// export async function POST(req: Request) {  
//   const newAgent = await req.json();
//   const agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));
//   newAgent.id = agents.length > 0 ? agents[agents.length - 1].id + 1 : 1;
//   agents.push(newAgent);
//   await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));
//   return NextResponse.json(newAgent);
// }

// export async function PUT(req: Request) {
//    try {
//     await requireAuth();
//   } catch {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   const updatedAgent = await req.json();
//   const agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));
//   const index = agents.findIndex((a: any) => a.id === updatedAgent.id);
//   if (index === -1) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
//   agents[index] = updatedAgent;
//   await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));
//   return NextResponse.json(updatedAgent);
// }

// export async function DELETE(req: Request) {
//    try {
//     await requireAuth();
//   } catch {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   const { id } = await req.json();
//   let agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));
//   agents = agents.filter((a: any) => a.id !== id);
//   await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));
//   return NextResponse.json({ success: true });
// }

// export async function PATCH(req: Request) {
//    try {
//     await requireAuth();
//   } catch {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   const { id, status } = await req.json();
//   console.log('Updating agent status:', { id, status });
  

//   if (typeof id === 'undefined' || typeof status === 'undefined') {
//     return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
//   }

//   const agents = JSON.parse(await fs.readFile(agentFile, 'utf-8'));

//   const index = agents.findIndex((a: any) => a.id === id);
//   if (index === -1) {
//     return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
//   }

//   agents[index].status = status;

//   await fs.writeFile(agentFile, JSON.stringify(agents, null, 2));

//   return NextResponse.json(agents[index]);
// }


import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { log } from 'console';

export async function GET() {
  const agents = await prisma.agent.findMany();

  return NextResponse.json(agents);
}

async function findProvinceIdByAgenceId(agenceId: number) {
  const agence = await prisma.agence.findUnique({
    where: { id: agenceId },
    select: { provinceId: true },
  });

  return agence?.provinceId;
}


export async function POST(req: Request) {
  const newAgent = await req.json();

  const provinceId = await findProvinceIdByAgenceId(Number(newAgent.agenceId));

  if (!provinceId) {
    return NextResponse.json({ error: 'Province not found for the given agence id' }, { status: 404 });
  }

  newAgent.provinceId = provinceId;

  const created = await prisma.agent.create({
    data: {
      firstName: newAgent.firstName,
      lastName: newAgent.lastName,
      phoneNumbers: newAgent.phoneNumbers,
      photoUrl: newAgent.photoUrl,
      agenceId: Number(newAgent.agenceId),
      provinceId: provinceId,
      departementId: Number(newAgent.departementId),
      functionId: Number(newAgent.functionId),
      engagementDate: newAgent.engagementDate,
      status: newAgent.status,
    },
  });

  return NextResponse.json(created);
}


export async function PUT(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updatedAgent = await req.json();
  const updated = await prisma.agent.update({
    where: { id: updatedAgent.id },
    data: {
      firstName: updatedAgent.firstName,
      lastName: updatedAgent.lastName,
      phoneNumbers: updatedAgent.phoneNumbers,
      photoUrl: updatedAgent.photoUrl,
      departementId: Number(updatedAgent.departementId),
      functionId: Number(updatedAgent.functionId),
      engagementDate: updatedAgent.engagementDate,
      status: updatedAgent.status,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.agent.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (typeof id === 'undefined' || typeof status === 'undefined') {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const updated = await prisma.agent.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
