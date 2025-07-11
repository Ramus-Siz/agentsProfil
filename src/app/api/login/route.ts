import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'advan$@200';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Créer token JWT valide 1h
    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600, // 1 heure
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }

  return NextResponse.json({ success: false, error: 'Identifiants invalides' }, { status: 401 });
}
