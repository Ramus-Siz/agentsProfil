// 📁 /app/api/login/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// const adminPath = path.resolve(process.cwd(), 'data/admin.json');

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Login attempt:', body);
  
//   const admin = JSON.parse(await fs.readFile(adminPath, 'utf-8'));
  const passwordEnv = process.env.ADMIN_PASSWORD;
  const usernameEnv = process.env.ADMIN_USERNAME;


  if (body.email === usernameEnv && body.password === passwordEnv) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: 'Identifiants invalides' }, { status: 401 });
  }
}
