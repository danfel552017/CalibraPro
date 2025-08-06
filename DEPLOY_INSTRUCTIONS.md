# 🚀 Instrucciones de Deploy para CalibraPro

## 🎯 Deploy en Vercel (Recomendado)

### Paso 1: Acceder a Vercel
1. Ve a: https://vercel.com/new
2. Conecta con tu cuenta de GitHub

### Paso 2: Import Project
1. En "Import Git Repository"
2. Busca: `danfel552017/CalibraPro`
3. Click "Import"

### Paso 3: Configure Project
```
Project Name: calibrapro-demo
Framework Preset: Next.js (auto-detectado)
Root Directory: ./ (dejar por defecto)
Build and Output Settings: (dejar por defecto)
```

### Paso 4: Environment Variables
Vercel tomará automáticamente las variables de `vercel.json`, pero puedes verificar:

```
DEMO_MODE = true
DEMO_USER_EMAIL = demo@nubank.com.br
DEMO_USER_NAME = Usuario Demo
NEXTAUTH_SECRET = calibrapro-demo-secret-2024-nubank-quality-platform
(... las demás se configuran automáticamente)
```

### Paso 5: Deploy
1. Click "Deploy"
2. Esperar 2-3 minutos
3. ¡Listo! Tendrás una URL como: `https://calibrapro-demo.vercel.app`

## 🌐 Resultado Final

### Lo que obtienes:
- ✅ **URL pública:** Cualquiera puede acceder
- ✅ **HTTPS automático:** Seguro por defecto
- ✅ **Deploy automático:** Cada push a GitHub se deploya automáticamente
- ✅ **Demo completo:** Modo demo habilitado sin credenciales
- ✅ **Performance:** CDN global de Vercel
- ✅ **Escalabilidad:** Se adapta automáticamente al tráfico

### Funcionalidades disponibles públicamente:
- 🎭 **Login Demo:** Sin credenciales requeridas
- 📊 **Dashboard completo:** Con datos precargados
- 📝 **Gestión de Scorecards:** Ver y navegar scorecards
- 👥 **Sesiones de Calibración:** Con análisis Kappa
- 📈 **Analytics:** Métricas y concordancia
- ✅ **Action Plans:** Planes de seguimiento
- ⚙️ **Settings:** Configuraciones del sistema

## 🔄 Actualizaciones Automáticas

Una vez desplegado:
1. **Haces cambios** en el código local
2. **Git commit + push** a GitHub
3. **Vercel deploya automáticamente** la nueva versión
4. **URL se actualiza** en 1-2 minutos

## 📱 Compartir la Demo

Una vez desplegado, puedes compartir la URL con:
- ✅ **Stakeholders de Nubank**
- ✅ **Equipo de Quality**
- ✅ **Management**
- ✅ **Cualquier persona interesada**

### Instrucciones para usuarios:
1. Ir a la URL del deploy
2. Click en "🎭 Entrar como Demo"
3. Explorar todas las funcionalidades
4. ¡No necesitan configurar nada!

## 🎯 Beneficios del Deploy Público

### Para ti:
- 📈 **Portfolio:** Proyecto visible públicamente
- 🚀 **Experiencia:** Deploy en producción real
- 🔄 **CI/CD:** Pipeline automático configurado

### Para Nubank:
- 👀 **Visibilidad:** Stakeholders pueden ver el progreso
- 🎭 **Demo fácil:** Sin necesidad de setup local
- 📊 **Feedback:** Usuarios pueden probar y dar feedback
- 🚀 **Escalabilidad:** Listo para migrar a producción real

## 🔧 Troubleshooting

### Si el deploy falla:
1. Verificar que `npm run build` funciona localmente
2. Revisar logs en Vercel dashboard
3. Verificar variables de entorno

### Si la app no carga:
1. Verificar que DEMO_MODE=true
2. Revisar la URL de NEXTAUTH_URL en Vercel
3. Verificar Function Logs en Vercel

## 🎉 ¡Success!

Una vez completado, tendrás:
- 🌐 **URL pública funcionando**
- 🎭 **Demo accesible para todos**
- 🚀 **Deploy automático configurado**
- 📱 **Listo para compartir**