# 🚀 Quick Start - CalibraPro

## Ejecución Rápida en Desarrollo

### 1. Configuración Inicial
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local .env
# Editar .env con tus credenciales de Google
```

### 2. Configuración de Google (Mínima para Testing)

**Google Cloud Console:**
1. Crear proyecto
2. Habilitar Google Sheets API
3. Crear OAuth Client ID (Web Application)
4. Crear Service Account y descargar JSON
5. Crear Google Sheet y compartir con Service Account

**Variables críticas:**
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` (del OAuth)
- `GOOGLE_SHEETS_ID` (de la URL de tu hoja)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (del JSON)

### 3. Ejecutar la Aplicación
```bash
# Modo desarrollo
npm run dev

# Abrir en el navegador
open http://localhost:3000
```

### 4. Configuración Inicial en la App
1. Hacer login con cuenta @nubank.com.br
2. Si eres admin, ir a Settings → Inicializar Base de Datos
3. Crear tu primer scorecard
4. Crear una sesión de calibración

## Funcionalidades Principales

### 🔐 **Login**
- Solo usuarios @nubank.com.br
- Roles automáticos: Admin, Líder, Analista

### 📊 **Scorecards** (Solo Admins)
- Crear/editar/clonar scorecards
- Gestionar preguntas por secciones
- Tipos críticos vs no críticos

### 👥 **Sesiones de Calibración**
- Crear sesiones (Líderes/Admins)
- Evaluación ciega independiente
- Cálculo automático de Kappa de Cohen

### 📈 **Analytics**
- Métricas de concordancia
- Tendencias temporales
- Performance por participante

### ✅ **Planes de Acción**
- Tareas de seguimiento
- Asignación de responsables
- Tracking de cumplimiento

## Arquitectura

- **Frontend:** Next.js 14 + TypeScript + Tailwind
- **Backend:** Next.js API Routes
- **Database:** Google Sheets (5 pestañas relacionales)
- **Auth:** NextAuth.js + Google OAuth
- **Deploy:** Optimizado para Vercel

## Estructura de la Base de Datos

La aplicación crea automáticamente estas pestañas:

1. `Scorecards_Maestros` - Definición de scorecards
2. `Banco_Preguntas` - Preguntas por scorecard
3. `Sesiones_Calibracion` - Sesiones de evaluación
4. `Resultados_Detallados` - Respuestas individuales
5. `Planes_Accion` - Tareas de seguimiento

## URLs Principales

- `/dashboard` - Panel principal
- `/scorecards` - Gestión de scorecards (Admin)
- `/sessions` - Mis sesiones
- `/sessions/new` - Nueva sesión (Líder)
- `/analytics` - Reportes y métricas
- `/action-plans` - Tareas y seguimiento
- `/settings` - Configuración (Admin)

## Comandos Útiles

```bash
# Verificar tipos
npm run type-check

# Build de producción
npm run build

# Linting
npm run lint
```

---

**🎯 ¡La aplicación está 100% funcional y lista para usar!**

Con datos mock integrados para facilitar testing y desarrollo.