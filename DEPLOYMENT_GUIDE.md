# Guía de Despliegue - CalibraPro

## Resumen del Proyecto

**CalibraPro** es una plataforma web completa para gestión de calibraciones de calidad desarrollada específicamente para Nubank. El proyecto incluye:

### ✅ Funcionalidades Implementadas

1. **🔐 Autenticación Completa**
   - Google OAuth con NextAuth.js
   - Restricción a usuarios @nubank.com.br
   - Sistema de roles (Admin, Líder, Analista)

2. **📊 Gestión de Scorecards**
   - CRUD completo de scorecards
   - Gestión de preguntas por secciones
   - Tipos de error (Crítico/No Crítico)
   - Sistema de clonado

3. **👥 Sesiones de Calibración**
   - Creación y gestión de sesiones
   - Evaluación ciega entre analistas
   - Lógica COPC con errores críticos
   - Seguimiento de progreso

4. **📈 Análisis Kappa de Cohen**
   - Cálculo automático del coeficiente
   - Interpretación estándar del nivel de acuerdo
   - Análisis de discrepancias por pregunta
   - Validación de datos para cálculos

5. **✅ Planes de Acción**
   - Creación y seguimiento de tareas
   - Estados y responsables
   - Fechas de vencimiento
   - Estadísticas de cumplimiento

6. **🎨 Interfaz Moderna**
   - Diseño responsivo con Tailwind CSS
   - Componentes con Shadcn/ui
   - Tema Nubank con colores corporativos
   - UX optimizada para productividad

7. **💾 Base de Datos Google Sheets**
   - 5 pestañas relacionales
   - Inicialización automática
   - Estructura de datos optimizada
   - Integración nativa con Google Workspace

### 🏗️ Arquitectura Técnica

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Google Sheets API
- **Autenticación**: NextAuth.js + Google OAuth
- **Base de Datos**: Google Sheets como capa de persistencia
- **Despliegue**: Optimizado para Vercel

## Pasos para Despliegue

### 1. Configuración de Google Cloud

```bash
# 1. Crear proyecto en Google Cloud Console
# 2. Habilitar APIs:
#    - Google Sheets API
#    - Google Drive API
#    - Google OAuth2 API

# 3. Crear OAuth Client ID
#    - Tipo: Web Application
#    - URIs autorizadas: 
#      - http://localhost:3000/api/auth/callback/google (dev)
#      - https://tu-dominio.com/api/auth/callback/google (prod)

# 4. Crear Service Account
#    - Descargar JSON key
#    - Extraer email y private key
```

### 2. Configuración de Google Sheets

```bash
# 1. Crear nueva hoja de cálculo en Google Drive
# 2. Copiar ID de la URL (GOOGLE_SHEETS_ID)
# 3. Compartir con Service Account email (permisos de Editor)
# 4. La aplicación creará automáticamente las pestañas necesarias
```

### 3. Variables de Entorno

Configurar en Vercel o servidor:

```env
# Aplicación
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=clave-super-secreta-64-caracteres

# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# Google Sheets
GOOGLE_SHEETS_ID=1A2B3C4D5E6F7G8H9I0J
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nKEY\n-----END PRIVATE KEY-----\n"

# Administradores
ADMIN_EMAILS=admin1@nubank.com.br,admin2@nubank.com.br
```

### 4. Despliegue en Vercel

```bash
# Instalación
npm i -g vercel

# Deploy
vercel

# Configurar variables en dashboard de Vercel
# Verificar build successful
```

### 5. Verificación Post-Despliegue

1. **✅ Autenticación**: Probar login con cuenta @nubank.com.br
2. **✅ Base de Datos**: Acceder como admin → Configuración → Inicializar DB
3. **✅ Scorecards**: Crear scorecard de prueba
4. **✅ Sesión**: Crear sesión de calibración
5. **✅ Análisis**: Verificar cálculo de Kappa

## Estructura de Archivos Principales

```
CalibraPro/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth configuration
│   ├── api/scorecards/             # Scorecard API endpoints
│   ├── api/sessions/               # Session API endpoints
│   ├── auth/signin/                # Sign in page
│   ├── dashboard/                  # Main dashboard
│   └── globals.css                 # Global styles
├── components/
│   ├── layout/                     # Layout components
│   └── ui/                         # Reusable UI components
├── lib/
│   ├── services/                   # Business logic services
│   ├── auth.ts                     # Authentication configuration
│   ├── google-sheets.ts            # Google Sheets client
│   ├── kappa-calculator.ts         # Statistical calculations
│   └── utils.ts                    # Utility functions
├── types/
│   └── index.ts                    # TypeScript definitions
├── README.md                       # Complete documentation
└── DEPLOYMENT_GUIDE.md             # This file
```

## Mantenimiento y Monitoreo

### Logs y Debugging
- Vercel provee logs automáticos
- Console.log para debugging en desarrollo
- Error boundaries implementados

### Backup
- Google Sheets provee backup automático
- Historial de versiones nativo
- Export manual disponible

### Escalabilidad
- Rate limits de Google Sheets API: 1000 requests/100 segundos
- Para uso intensivo considerar migrar a base de datos tradicional
- Caching implementado donde sea posible

### Seguridad
- HTTPS obligatorio en producción
- Validación de dominios @nubank.com.br
- Variables de entorno seguras
- Service Account con permisos mínimos

## Soporte y Troubleshooting

### Problemas Comunes

1. **Error "GOOGLE_SHEETS_ID not configured"**
   - Verificar variable de entorno
   - Reiniciar aplicación

2. **Error de autenticación**
   - Verificar URIs de redirect en Google Cloud
   - Confirmar client ID y secret

3. **Error de permisos en Google Sheets**
   - Verificar que Service Account tenga acceso
   - Compartir hoja con email correcto

### Contacto
- Equipo de desarrollo interno Nubank
- Documentación completa en README.md

---

**Status del Proyecto**: ✅ **COMPLETO Y LISTO PARA DESPLIEGUE**

- ✅ Arquitectura completa implementada
- ✅ Todas las funcionalidades requeridas
- ✅ Documentación exhaustiva
- ✅ Build exitoso sin errores
- ✅ TypeScript type-safe
- ✅ Optimizado para producción