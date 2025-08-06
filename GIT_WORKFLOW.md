# 🔄 Flujo de Trabajo Git para CalibraPro

## 📝 Comandos Diarios

### Después de hacer cambios:
```bash
# Ver estado actual
git status

# Agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "✨ feat: nueva funcionalidad de X"

# Subir a GitHub
git push origin main
```

### Tipos de commit (convenciones):
- `✨ feat:` Nueva funcionalidad
- `🐛 fix:` Corrección de bugs
- `📝 docs:` Actualización de documentación
- `🎨 style:` Cambios de estilo/formato
- `♻️ refactor:` Refactorización de código
- `⚡ perf:` Mejora de rendimiento
- `✅ test:` Agregar o actualizar tests
- `🔧 config:` Cambios de configuración

### Comandos útiles:
```bash
# Ver historial de commits
git log --oneline

# Ver diferencias antes de commit
git diff

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Sincronizar con GitHub (traer cambios)
git pull origin main

# Ver ramas
git branch -a

# Crear nueva rama para features
git checkout -b feature/nueva-funcionalidad
```

## 🔧 Configuración en Cursor

### 1. Git Panel (Ctrl/Cmd + Shift + G)
- Ver archivos modificados
- Hacer commits visuales
- Ver historial

### 2. Terminal Integrado (Ctrl/Cmd + `)
- Comandos Git directos
- Mayor control

### 3. Extensions útiles:
- GitLens (extensión recomendada)
- Git Graph
- Git History

## 🚀 Flujo para nuevas features:

1. **Crear rama:**
   ```bash
   git checkout -b feature/nombre-feature
   ```

2. **Desarrollar y commit:**
   ```bash
   git add .
   git commit -m "✨ feat: nueva feature"
   ```

3. **Subir rama:**
   ```bash
   git push origin feature/nombre-feature
   ```

4. **Crear Pull Request** en GitHub

5. **Merge y cleanup:**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/nombre-feature
   ```

## 📦 Deploy automático

Cada push a `main` puede configurarse para:
- ✅ Deploy automático a Vercel
- ✅ Ejecutar tests
- ✅ Verificar build

¡Ya tienes todo configurado para un flujo profesional! 🎉