# 🔑 Guía Completa: Configuración de Google Cloud

## 📋 **Resumen rápido:**
Necesitas 2 cosas de Google:
1. **OAuth Client** (para login de usuarios)
2. **Service Account** (para acceder a Google Sheets)

---

## 🚀 **PASO 1: Crear Proyecto en Google Cloud**

1. **Ir a Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **Crear nuevo proyecto:**
   - Clic en "Select a project" (arriba)
   - Clic en "NEW PROJECT"
   - Nombre: `CalibraPro-Nubank`
   - Clic en "CREATE"

3. **Seleccionar el proyecto** que acabas de crear

---

## 🔌 **PASO 2: Habilitar APIs necesarias**

1. **Ir a APIs & Services → Library:**
   ```
   https://console.cloud.google.com/apis/library
   ```

2. **Habilitar estas 3 APIs:**
   - Buscar "Google Sheets API" → ENABLE
   - Buscar "Google Drive API" → ENABLE  
   - Buscar "Google+ API" → ENABLE

---

## 🔐 **PASO 3: Crear OAuth Client (para login)**

1. **Ir a APIs & Services → Credentials:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Configurar OAuth consent screen PRIMERO:**
   - Clic en "OAuth consent screen"
   - User Type: **Internal** (solo para tu organización)
   - Application name: `CalibraPro`
   - User support email: tu email
   - Developer contact: tu email
   - Clic en "SAVE AND CONTINUE"
   - Scopes: dejar por defecto → "SAVE AND CONTINUE"
   - Test users: agregar tu email → "SAVE AND CONTINUE"

3. **Crear OAuth Client ID:**
   - Volver a "Credentials"
   - Clic en "CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `CalibraPro-Web`
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Clic en "CREATE"

4. **¡GUARDAR ESTAS CREDENCIALES!**
   ```
   Client ID: algo como 123456789-abc.apps.googleusercontent.com
   Client Secret: algo como ABC123-xyz789
   ```

---

## 🤖 **PASO 4: Crear Service Account (para Google Sheets)**

1. **En la misma página de Credentials:**
   - Clic en "CREATE CREDENTIALS" → "Service account"
   - Service account name: `calibrapro-sheets`
   - Service account ID: se genera automático
   - Clic en "CREATE AND CONTINUE"
   - Role: **Editor**
   - Clic en "CONTINUE" → "DONE"

2. **Generar clave privada:**
   - Clic en el Service Account que creaste
   - Ir a pestaña "KEYS"
   - Clic en "ADD KEY" → "Create new key"
   - Key type: **JSON**
   - Clic en "CREATE"
   - Se descarga un archivo JSON

3. **Del archivo JSON necesitas:**
   ```json
   {
     "client_email": "calibrapro-sheets@tu-proyecto.iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   }
   ```

---

## 📊 **PASO 5: Crear Google Sheet**

1. **Crear nueva hoja:**
   ```
   https://sheets.google.com/
   ```
   - Crear hoja nueva
   - Nombrarla: "CalibraPro Database"

2. **Obtener ID de la hoja:**
   De la URL: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`

3. **Compartir con Service Account:**
   - Clic en "Share" (arriba derecha)
   - Agregar el email del Service Account
   - Permisos: **Editor**
   - Clic en "Share"

---

## ⚙️ **PASO 6: Configurar archivo .env**

```bash
# En tu terminal:
cd /Users/daniel.perez/CalibraPro
cp .env.example .env
```

**Editar el archivo .env con:**

```env
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=cualquier-texto-largo-minimo-32-caracteres-secreto

# Google OAuth (del Paso 3)
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ABC123-xyz789

# Google Sheets (del Paso 4 y 5)
GOOGLE_SHEETS_ID=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T
GOOGLE_SERVICE_ACCOUNT_EMAIL=calibrapro-sheets@tu-proyecto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...tu clave...9ABC\n-----END PRIVATE KEY-----\n"

# Administradores
ADMIN_EMAILS=tu-email@nubank.com.br
```

---

## 🎯 **PASO 7: Probar la aplicación**

```bash
# Reiniciar el servidor
npm run dev
```

1. **Ir a:** `http://localhost:3000`
2. **Hacer login** con tu cuenta Google
3. **Como admin, ir a Settings** → "Inicializar Base de Datos"
4. **¡Listo!** Ya puedes usar CalibraPro

---

## ⚠️ **Problemas comunes:**

### Error: "redirect_uri_mismatch"
- Verificar que la URI en Google Cloud sea exactamente: `http://localhost:3000/api/auth/callback/google`

### Error: "access_denied"
- Verificar que tu email esté en ADMIN_EMAILS
- Verificar que el OAuth consent screen esté configurado

### Error: "insufficient permissions"
- Verificar que el Service Account tenga acceso Editor a la Google Sheet
- Verificar que las APIs estén habilitadas

---

## 📞 **¿Necesitas ayuda?**

Si tienes problemas en algún paso, puedo ayudarte paso a paso. ¡Solo dime en qué paso te atoraste!