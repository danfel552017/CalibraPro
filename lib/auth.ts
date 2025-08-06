import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/types';

// Verificar si estamos en modo demo
const isDemoMode = process.env.DEMO_MODE === 'true';

// Lista de administradores (desde variable de entorno)
function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS;
  return adminEmails ? adminEmails.split(',').map(email => email.trim()) : [];
}

// Determinar rol del usuario
function getUserRole(email: string): 'Admin' | 'Analista' | 'Lider' {
  const adminEmails = getAdminEmails();
  
  if (adminEmails.includes(email)) {
    return 'Admin';
  }
  
  // Por ahora, todos los no-admin son Analistas
  // En el futuro se puede implementar lógica más compleja
  return 'Analista';
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Provider demo para desarrollo sin credenciales
    ...(isDemoMode ? [
      CredentialsProvider({
        id: 'demo',
        name: 'Demo Login',
        credentials: {},
        async authorize() {
          return {
            id: 'demo-user',
            email: process.env.DEMO_USER_EMAIL || 'demo@nubank.com.br',
            name: process.env.DEMO_USER_NAME || 'Usuario Demo',
            image: 'https://ui-avatars.com/api/?name=Demo+User&background=8A2BE2&color=fff'
          };
        },
      })
    ] : []),
    // Provider Google para producción
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/spreadsheets',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // En modo demo, permitir acceso siempre
      if (isDemoMode && account?.provider === 'demo') {
        return true;
      }
      
      // Verificar que es un usuario de Nubank
      if (user.email && user.email.endsWith('@nubank.com.br')) {
        return true;
      }
      
      // Rechazar usuarios que no sean de Nubank
      return false;
    },
    async jwt({ token, account, user }) {
      // Guardar tokens de acceso para usar con Google Sheets API
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }
      
      // Agregar rol del usuario
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
      
      // Incluir tokens para API calls
      (session as any).access_token = token.access_token;
      (session as any).refresh_token = token.refresh_token;
      
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