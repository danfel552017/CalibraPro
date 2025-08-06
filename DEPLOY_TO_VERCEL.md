# 🚀 Deploy a Vercel (Opción Recomendada)

## Ventajas de Vercel:
- ✅ **GRATIS** para proyectos personales
- ✅ **Optimizado** para Next.js
- ✅ **Deploy automático** desde GitHub
- ✅ **URL pública** automática
- ✅ **SSL/HTTPS** incluido

## Pasos para Deploy:

### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

### 2. Login en Vercel
```bash
vercel login
```

### 3. Deploy desde la carpeta del proyecto
```bash
cd /Users/daniel.perez/CalibraPro
vercel
```

### 4. Configurar Variables de Entorno en Vercel
- Ir a dashboard.vercel.com
- Seleccionar tu proyecto
- Settings → Environment Variables
- Agregar todas las variables del archivo .env

### 5. ¡Listo!
Tu aplicación estará disponible en: `https://tu-proyecto.vercel.app`

## Alternativa: GitHub + Vercel (Automático)

1. **Subir código a GitHub:**
```bash
git init
git add .
git commit -m "Initial CalibraPro deployment"
git remote add origin https://github.com/tu-usuario/calibrapro.git
git push -u origin main
```

2. **Conectar Vercel a GitHub:**
- Ir a vercel.com
- "Import Git Repository"
- Seleccionar tu repo
- Deploy automático

## Resultado Final:
- 🌐 **URL pública:** `https://calibrapro-tu-usuario.vercel.app`
- 🔐 **Solo usuarios @nubank.com.br** pueden acceder
- 🚀 **Actualizaciones automáticas** cuando cambies código