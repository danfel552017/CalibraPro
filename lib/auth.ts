import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/types';
import bcrypt from 'bcryptjs';

// Base de datos de usuarios (en producción esto vendría de una base de datos real)
interface UserCredentials {
  username: string;
  password: string; // Hash de la contraseña
  email: string;
  name: string;
  role: 'Admin' | 'Analista' | 'Lider';
}

// Usuario administrador maestro
const MASTER_ADMIN_USERNAME = 'admin_calibrapro';
const MASTER_ADMIN_PASSWORD = 'CalibraPro2024!Admin';
const MASTER_ADMIN_EMAIL = 'admin@calibrapro.nubank.com.br';

// Hash de la contraseña del administrador maestro (generado con bcrypt)
const MASTER_ADMIN_PASSWORD_HASH = bcrypt.hashSync(MASTER_ADMIN_PASSWORD, 12);

// Base de datos de usuarios en memoria (en producción esto sería una BD real)
const USERS_DB: UserCredentials[] = [
  {
    username: MASTER_ADMIN_USERNAME,
    password: MASTER_ADMIN_PASSWORD_HASH,
    email: MASTER_ADMIN_EMAIL,
    name: 'Administrador Maestro',
    role: 'Admin'
  },
  // Aquí se pueden agregar más usuarios
  {
    username: 'analista_demo',
    password: bcrypt.hashSync('demo123', 12),
    email: 'analista@calibrapro.nubank.com.br',
    name: 'Analista Demo',
    role: 'Analista'
  },
  {
    username: 'lider_demo',
    password: bcrypt.hashSync('demo123', 12),
    email: 'lider@calibrapro.nubank.com.br',
    name: 'Líder Demo',
    role: 'Lider'
  }
];

// Función para buscar usuario por username
function findUser(username: string): UserCredentials | undefined {
  return USERS_DB.find(user => user.username === username);
}

// Función para verificar contraseña
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Determinar rol del usuario
function getUserRole(email: string): 'Admin' | 'Analista' | 'Lider' {
  const user = USERS_DB.find(u => u.email === email);
  return user?.role || 'Analista';
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'CalibraPro Login',
      credentials: {
        username: { label: 'Usuario', type: 'text', placeholder: 'Nombre de usuario' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = findUser(credentials.username);
        if (!user) {
          return null;
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.username,
          email: user.email,
          name: user.name,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8A2BE2&color=fff`
        };
      },
    })
  ],
  callbacks: {
    async signIn({ user }) {
      // Permitir acceso a todos los usuarios autenticados con credenciales válidas
      return true;
    },
    async jwt({ token, user }) {
      // Agregar rol del usuario al token
      if (user?.email) {
        token.role = getUserRole(user.email);
      }
      
      return token;
    },
    async session({ session, token }) {
      // Enviar propiedades al cliente
      if (session.user?.email) {
        (session.user as User).role = token.role as 'Admin' | 'Analista' | 'Lider';
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Función para verificar si el usuario es admin
export function isAdmin(user: User | null): boolean {
  return user?.role === 'Admin';
}

// Función para verificar si el usuario puede liderar sesiones
export function canLeadSessions(user: User | null): boolean {
  return user?.role === 'Admin' || user?.role === 'Lider';
}

// Middleware para verificar autenticación
export function requireAuth(handler: any) {
  return async (req: any, res: any) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    return handler(req, res, session);
  };
}

// Middleware para verificar permisos de admin
export function requireAdmin(handler: any) {
  return async (req: any, res: any) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !isAdmin(session.user as User)) {
      return res.status(403).json({ error: 'Se requieren permisos de administrador' });
    }
    
    return handler(req, res, session);
  };
}

// Import necesario que faltaba
import { getServerSession } from 'next-auth/next';

// Exportar credenciales del administrador maestro (para mostrar al usuario)
export const MASTER_ADMIN_CREDENTIALS = {
  username: MASTER_ADMIN_USERNAME,
  password: MASTER_ADMIN_PASSWORD,
  email: MASTER_ADMIN_EMAIL
};

// Función para agregar un nuevo usuario (solo para administradores)
export function addUser(userData: {
  username: string;
  password: string;
  email: string;
  name: string;
  role: 'Admin' | 'Analista' | 'Lider';
}): boolean {
  // Verificar si el usuario ya existe
  if (findUser(userData.username)) {
    return false;
  }

  // Hash de la contraseña
  const hashedPassword = bcrypt.hashSync(userData.password, 12);

  // Agregar usuario a la base de datos
  USERS_DB.push({
    username: userData.username,
    password: hashedPassword,
    email: userData.email,
    name: userData.name,
    role: userData.role
  });

  return true;
}

// Función para obtener todos los usuarios (sin contraseñas)
export function getAllUsers(): Omit<UserCredentials, 'password'>[] {
  return USERS_DB.map(({ password, ...user }) => user);
}