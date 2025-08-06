# CalibraPro - Plataforma de Calibración de Calidad Nubank

## 🎯 Visión del Proyecto

**CalibraPro** es una plataforma web interna de vanguardia diseñada específicamente para el equipo de Calidad de Nubank. Su objetivo es transformar un proceso manual y fragmentado en un ecosistema digital centralizado, intuitivo y data-driven que abarca todo el ciclo de vida de la calidad: desde la creación de scorecards hasta la ejecución de calibraciones y el seguimiento de mejoras.

### 🔬 Metodología de Calibración

La plataforma implementa una metodología de calibración basada en el **Coeficiente Kappa de Cohen**, que es el estándar de la industria para medir la concordancia entre evaluadores en procesos de control de calidad. Este coeficiente proporciona una medida estadísticamente robusta del nivel de acuerdo entre analistas, corrigiendo por el acuerdo esperado por azar.

**Interpretación del Kappa:**
- 0.81-1.00: Acuerdo Casi Perfecto
- 0.61-0.80: Acuerdo Sustancial  
- 0.41-0.60: Acuerdo Moderado
- 0.21-0.40: Acuerdo Justo
- 0.01-0.20: Acuerdo Ligero
- ≤0.00: Acuerdo Pobre

### 🏗️ Arquitectura Tecnológica

**Frontend:**
- Next.js 14 con App Router
- TypeScript para type safety
- Tailwind CSS + Shadcn/ui para diseño moderno
- NextAuth.js para autenticación con Google

**Backend:**
- Next.js API Routes (Full-stack)
- Google Sheets API como base de datos
- Google OAuth para autenticación

**Despliegue:**
- Vercel (recomendado para Next.js)
- Variables de entorno para configuración

## 📚 Guía del Administrador

### Gestión de Scorecards

Los administradores pueden crear, editar y gestionar scorecards que definen los criterios de evaluación.

#### Crear un Nuevo Scorecard

1. **Acceder al módulo:** Navega a "Scorecards" en el menú lateral
2. **Iniciar creación:** Haz clic en "Nuevo Scorecard"
3. **Completar información básica:**
   - **Nombre:** Identificador único del scorecard
   - **Descripción:** Propósito y contexto de uso

4. **Configurar preguntas por sección:**
   - Organiza preguntas en secciones lógicas
   - Define el tipo de error (Crítico/No Crítico)
   - Incluye guías de aplicación detalladas

#### Lógica COPC + Errores Críticos

⚠️ **Importante:** Cualquier pregunta marcada como "Crítica" con calificación 0 anula automáticamente toda la evaluación (resultado final = 0%).

#### Clonar Scorecards

Para agilizar la creación de nuevos scorecards basados en existentes:
1. Selecciona el scorecard base
2. Usa la opción "Clonar"
3. Modifica según necesidades específicas

### Configuración del Sistema

#### Variables de Entorno Requeridas

```env
# Next.js Configuration
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-clave-secreta-super-segura

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Google Sheets
GOOGLE_SHEETS_ID=tu-google-sheets-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Administradores
ADMIN_EMAILS=admin1@nubank.com.br,admin2@nubank.com.br
```

#### Configuración de Google Sheets

1. **Crear Google Sheet:** Crea una nueva hoja de cálculo en Google Drive
2. **Configurar Service Account:** 
   - Ve a Google Cloud Console
   - Crea un Service Account
   - Genera clave privada JSON
   - Comparte la hoja con el email del Service Account

3. **Estructura automática:** La aplicación creará automáticamente las siguientes pestañas:
   - `Scorecards_Maestros`
   - `Banco_Preguntas`
   - `Sesiones_Calibracion`
   - `Resultados_Detallados`
   - `Planes_Accion`

## 👥 Guía del Usuario

### Participar en Sesiones de Calibración

#### Como Participante (Analista)

1. **Recibir invitación:** Los líderes te invitarán a sesiones específicas
2. **Acceder a la sesión:** Ve a "Mis Sesiones" y selecciona la sesión activa
3. **Realizar evaluación ciega:**
   - Lee cuidadosamente cada pregunta
   - Consulta las guías de aplicación si es necesario
   - Califica binariamente (0 = No cumple, 1 = Cumple)
   - **⚠️ Importante:** No puedes cambiar respuestas una vez enviadas

4. **Enviar resultados:** Confirma y envía tu evaluación

#### Como Líder de Sesión

1. **Crear nueva sesión:**
   - Selecciona el scorecard a usar
   - Define la interacción a evaluar
   - Invita a los participantes

2. **Gestionar la sesión:**
   - Monitorea el progreso de participantes
   - Finaliza cuando todos hayan completado
   - Revisa los resultados y métricas Kappa

3. **Analizar resultados:**
   - Revisa discrepancias entre evaluadores
   - Identifica áreas de mejora
   - Crea planes de acción según necesidad

### Gestión de Planes de Acción

#### Crear Tareas

1. Después de una sesión finalizada, identifica oportunidades de mejora
2. Crea tareas específicas con:
   - Descripción clara del objetivo
   - Responsable asignado
   - Fecha de vencimiento realista

#### Seguimiento

- **Dashboard:** Visualiza todas tus tareas pendientes
- **Estados:** Pendiente → En Progreso → Completado
- **Notificaciones:** Recibe alertas de tareas próximas a vencer

## 🔧 Guía Técnica

### Prerrequisitos de Software

- **Node.js 18+** (recomendado: usar nvm)
- **npm o yarn** para gestión de paquetes
- **Cuenta Google Cloud** con APIs habilitadas
- **Google Workspace** para autenticación

### Configuración del Entorno de Desarrollo

#### 1. Clonar y Configurar

```bash
# Clonar el repositorio
git clone <repository-url>
cd CalibraPro

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
```

#### 2. Configurar Google Cloud

**Habilitar APIs:**
```bash
# Google Cloud Console → APIs & Services → Enable APIs
- Google Sheets API
- Google Drive API  
- Google OAuth2 API
```

**Crear OAuth Client:**
1. Google Cloud Console → Credentials → Create Credentials → OAuth Client ID
2. Application Type: Web Application
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

**Crear Service Account:**
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create Service Account
3. Download JSON key file
4. Extract email and private key para `.env`

#### 3. Configurar Google Sheet

```bash
# Crear nueva hoja de cálculo
# Copiar ID de la URL: docs.google.com/spreadsheets/d/{SHEET_ID}/edit
# Compartir con Service Account email (Editor permissions)
```

#### 4. Variables de Entorno

Completa el archivo `.env` con todos los valores requeridos según el ejemplo anterior.

### Comandos de Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build para producción
npm run build

# Ejecutar versión de producción
npm run start
```

### Estructura del Proyecto

```
CalibraPro/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── layout/           # Layout components
│   └── ui/               # UI components (Shadcn)
├── lib/                  # Utilidades y servicios
│   ├── services/         # Lógica de negocio
│   ├── google-sheets.ts  # Cliente Google Sheets
│   ├── kappa-calculator.ts # Cálculos estadísticos
│   └── auth.ts           # Configuración NextAuth
├── types/                # Definiciones TypeScript
└── README.md             # Esta documentación
```

### Despliegue a Producción

#### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en dashboard de Vercel
# Configurar dominio custom si es necesario
```

#### Opción 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

#### Consideraciones de Seguridad

- **Variables de entorno:** Nunca commitear claves en el repositorio
- **Service Account:** Usar principio de menor privilegio
- **HTTPS:** Obligatorio en producción
- **CORS:** Configurar dominios permitidos
- **Validación:** Implementar validación robusta en APIs

### Monitoreo y Logging

```typescript
// Ejemplo de logging estructurado
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Session created successfully',
  sessionId: session.id_sesion,
  userId: user.email
}))
```

### Backup y Recuperación

**Google Sheets como DB:**
- ✅ Backup automático por Google
- ✅ Historial de versiones
- ✅ Acceso desde múltiples interfaces
- ⚠️ Considerar rate limits para uso intensivo

### Troubleshooting Común

**Error: "GOOGLE_SHEETS_ID not configured"**
```bash
# Verificar que la variable esté en .env
echo $GOOGLE_SHEETS_ID

# Reiniciar servidor de desarrollo
npm run dev
```

**Error de autenticación Google:**
```bash
# Verificar que las URIs de redirect estén correctas
# Local: http://localhost:3000/api/auth/callback/google
# Prod: https://tu-dominio.com/api/auth/callback/google
```

**Error de permisos en Google Sheets:**
```bash
# Verificar que Service Account tenga acceso a la hoja
# Compartir hoja → Agregar email del Service Account → Editor
```

### Performance y Optimización

- **Caching:** Next.js ISR para datos estáticos
- **Lazy Loading:** Componentes y rutas
- **Optimización de imágenes:** Next.js Image component
- **Bundle Analysis:** `npm run build && npx @next/bundle-analyzer`

---

## 🚀 Puesta en Marcha Rápida

1. **Clonar repositorio**
2. **Instalar dependencias:** `npm install`
3. **Configurar `.env`** con todas las variables
4. **Ejecutar:** `npm run dev`
5. **Abrir:** http://localhost:3000
6. **Inicializar DB:** Acceder como admin → Configuración → Inicializar Base de Datos

## 📞 Soporte

Para soporte técnico o consultas sobre funcionalidades, contacta al equipo de desarrollo interno de Nubank.

---

*CalibraPro v1.0 - Desarrollado para Nubank Quality Team*# 🌐 CalibraPro ya está desplegado en: https://calibrapro.vercel.app
