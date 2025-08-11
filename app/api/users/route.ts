import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, addUser, getAllUsers, isAdmin } from '@/lib/auth';
import { User } from '@/types';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdmin(session.user as User)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdmin(session.user as User)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { username, password, email, name, role } = body;

    if (!username || !password || !email || !name || !role) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const success = addUser({ username, password, email, name, role });
    
    if (!success) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
