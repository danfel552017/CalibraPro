# 🚀 CalibraPro v1.0 - Producción

**Plataforma para Gestión de Calibraciones de Calidad**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://calibrapro.vercel.app)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/danfel552017/CalibraPro)
[![Status](https://img.shields.io/badge/Status-Production-green)](https://calibrapro.vercel.app)

## 🌐 Acceso Directo

**URL de Producción:** [https://calibrapro.vercel.app](https://calibrapro.vercel.app)

### 🔐 Credenciales de Administrador Maestro

```
Usuario: admin_calibrapro
Contraseña: CalibraPro2024!Admin
Rol: Administrador
```

### 👥 Usuarios Demo Disponibles

```
🔧 Administrador:
   Usuario: admin_calibrapro
   Contraseña: CalibraPro2024!Admin

👤 Analista Demo:
   Usuario: analista_demo  
   Contraseña: demo123

👨‍💼 Líder Demo:
   Usuario: lider_demo
   Contraseña: demo123
```

---

## 📋 Descripción

CalibraPro v1.0 es una aplicación web diseñada para gestionar sesiones de calibración de calidad, permitiendo:

- **Gestión de Scorecards:** Crear y administrar plantillas de evaluación
- **Sesiones de Calibración:** Evaluaciones ciegas colaborativas entre analistas
- **Análisis Kappa:** Métricas automáticas de concordancia entre evaluadores
- **Planes de Acción:** Seguimiento de tareas derivadas de sesiones
- **Sistema de Usuarios:** Autenticación local con roles (Admin/Analista/Líder)

## 🔧 Tecnologías

- **Frontend:** Next.js 14, React 18, TypeScript
- **Autenticación:** NextAuth.js con credenciales locales
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **Base de Datos:** Google Sheets (como backend)
- **Deployment:** Vercel

## 🚀 Instalación Local

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta Google Cloud (para Google Sheets API)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/danfel552017/CalibraPro.git
cd CalibraPro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

### Variables de Entorno Requeridas

```env
# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key

# Google Sheets API
GOOGLE_SHEET_ID=tu-google-sheets-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

## 👥 Gestión de Usuarios

### Agregar Nuevos Usuarios

Solo los administradores pueden crear nuevos usuarios. Accede con las credenciales de administrador y ve a la sección de configuración.

### Roles Disponibles

- **Admin:** Acceso completo, gestión de usuarios, configuración del sistema
- **Lider:** Puede crear y liderar sesiones de calibración
- **Analista:** Puede participar en sesiones como evaluador

## 📊 Funcionalidades Principales

### 1. Gestión de Scorecards
- Crear plantillas de evaluación personalizadas
- Organizar preguntas por secciones
- Definir tipos de error (Crítico/No Crítico)
- Agregar guías de aplicación

### 2. Sesiones de Calibración
- Evaluación ciega entre múltiples analistas
- Calificación binaria (0=No cumple, 1=Cumple)
- Cálculo automático de métricas Kappa
- Análisis de discrepancias entre evaluadores

### 3. Planes de Acción
- Crear tareas derivadas de sesiones
- Asignar responsables y fechas límite
- Seguimiento de estado (Pendiente/En Progreso/Completado)
- Dashboard de tareas personales

### 4. Analytics y Reportes
- Métricas de concordancia entre evaluadores
- Identificación de preguntas problemáticas
- Análisis de tendencias por analista
- Exportación de resultados

## 🛠️ Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar versión de producción
npm run start

# Linting
npm run lint

# Verificación de tipos
npm run type-check
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
│   ├── layout/           # Components de layout
│   └── ui/               # UI components (Shadcn)
├── lib/                  # Utilidades y servicios
│   ├── auth.ts           # Sistema de autenticación
│   ├── google-sheets.ts  # Cliente Google Sheets
│   └── kappa-calculator.ts # Cálculos estadísticos
├── types/                # Definiciones TypeScript
└── README.md             # Esta documentación
```

## 🔐 Seguridad

- **Autenticación:** Sistema local con contraseñas hasheadas (bcrypt)
- **Autorización:** Control de acceso basado en roles
- **Sesiones:** JWT con NextAuth.js
- **Variables de Entorno:** Configuración sensible protegida

## 📈 Performance

- **SSR/SSG:** Optimización con Next.js
- **Lazy Loading:** Carga bajo demanda de componentes
- **Caching:** Estrategias de cache para datos estáticos
- **Bundle Size:** Optimización automática de JavaScript

## 🌐 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en dashboard de Vercel
```

### Variables de Entorno en Producción

1. Ir al dashboard de Vercel
2. Seleccionar el proyecto CalibraPro
3. Settings → Environment Variables
4. Agregar todas las variables requeridas

## 🐛 Troubleshooting

### Problemas Comunes

**Error de autenticación:**
- Verificar que las credenciales sean correctas
- Revisar que NEXTAUTH_SECRET esté configurado
- Comprobar que NEXTAUTH_URL apunte al dominio correcto

**Error de Google Sheets:**
- Verificar que GOOGLE_SHEET_ID sea correcto
- Comprobar permisos del Service Account
- Validar formato de GOOGLE_PRIVATE_KEY

**Error en desarrollo:**
```bash
rm -rf .next
npm run dev
```

## 📞 Soporte

Para soporte técnico o reportar bugs:
- **GitHub Issues:** [Crear issue](https://github.com/danfel552017/CalibraPro/issues)
- **Email:** Contactar al administrador del sistema

## 📋 Changelog

### v1.0.0 (Actual)
- ✅ Sistema de autenticación local con usuario/contraseña
- ✅ Usuario administrador maestro configurado
- ✅ Eliminación de dependencia de Google OAuth
- ✅ Interfaz de login renovada
- ✅ Versión de producción estable
- ✅ Deploy automático en Vercel

### Versiones Anteriores
- v0.9.x: Versión beta con Google OAuth
- v0.8.x: Funcionalidades core implementadas
- v0.7.x: Prototipo inicial

---

## 📄 Licencia

Este proyecto es de uso interno. Todos los derechos reservados.

---

**CalibraPro v1.0** - Sistema de Gestión de Calibraciones de Calidad
🚀 **Desplegado en:** [https://calibrapro.vercel.app](https://calibrapro.vercel.app)