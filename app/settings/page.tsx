'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isAdmin } from '@/lib/auth'
import { User } from '@/types'
import { 
  Settings, 
  Database,
  Users,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as User
  const [isInitializing, setIsInitializing] = useState(false)
  const [initStatus, setInitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInitializeDatabase = async () => {
    setIsInitializing(true)
    setInitStatus('idle')
    
    try {
      // In real app, make API call to initialize database
      const response = await fetch('/api/sheets/init', {
        method: 'POST',
      })
      
      if (response.ok) {
        setInitStatus('success')
      } else {
        setInitStatus('error')
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      setInitStatus('error')
    } finally {
      setIsInitializing(false)
    }
  }

  if (!isAdmin(user)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso Restringido
          </h3>
          <p className="text-muted-foreground">
            Solo los administradores pueden acceder a la configuración del sistema.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona la configuración y mantenimiento de CalibraPro
          </p>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Estado del Sistema
            </CardTitle>
            <CardDescription>
              Información del estado actual de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Base de Datos</p>
                  <p className="text-xs text-muted-foreground">Google Sheets</p>
                </div>
                <Badge className="status-active">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Activa
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Autenticación</p>
                  <p className="text-xs text-muted-foreground">Google OAuth</p>
                </div>
                <Badge className="status-active">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Activa
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-muted-foreground">Endpoints</p>
                </div>
                <Badge className="status-active">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operacional
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Versión</p>
                  <p className="text-xs text-muted-foreground">CalibraPro</p>
                </div>
                <Badge variant="secondary">
                  v1.0.0
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Gestión de Base de Datos
            </CardTitle>
            <CardDescription>
              Inicialización y mantenimiento de la estructura de datos en Google Sheets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Inicializar Base de Datos</h4>
              <p className="text-sm text-blue-800 mb-3">
                Crea automáticamente las pestañas necesarias en Google Sheets si no existen:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 mb-4">
                <li>• Scorecards_Maestros</li>
                <li>• Banco_Preguntas</li>
                <li>• Sesiones_Calibracion</li>
                <li>• Resultados_Detallados</li>
                <li>• Planes_Accion</li>
              </ul>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="default"
                  onClick={handleInitializeDatabase}
                  disabled={isInitializing}
                >
                  {isInitializing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Inicializando...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Inicializar Base de Datos
                    </>
                  )}
                </Button>
                
                {initStatus === 'success' && (
                  <Badge className="status-completed">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Inicializada correctamente
                  </Badge>
                )}
                
                {initStatus === 'error' && (
                  <Badge className="status-critical">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Error en inicialización
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">⚠️ Importante</h4>
              <p className="text-sm text-amber-800">
                Asegúrate de que el Service Account tenga permisos de edición en la hoja de Google Sheets 
                configurada en las variables de entorno.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Configuración de roles y permisos de usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-emails">Emails de Administradores</Label>
              <Input
                id="admin-emails"
                value={process.env.ADMIN_EMAILS || 'Configurado en variables de entorno'}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Los emails de administradores se configuran en las variables de entorno del servidor
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Roles del Sistema</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Administrador</p>
                    <p className="text-sm text-muted-foreground">
                      Acceso completo: gestión de scorecards, configuración del sistema
                    </p>
                  </div>
                  <Badge className="status-critical">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Líder</p>
                    <p className="text-sm text-muted-foreground">
                      Puede crear y gestionar sesiones de calibración
                    </p>
                  </div>
                  <Badge className="status-in-progress">
                    <Users className="w-3 h-3 mr-1" />
                    Líder
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Analista</p>
                    <p className="text-sm text-muted-foreground">
                      Participa en sesiones de evaluación y ve sus resultados
                    </p>
                  </div>
                  <Badge className="status-active">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Analista
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">ID de Google Sheets</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {process.env.GOOGLE_SHEETS_ID ? 
                    `${process.env.GOOGLE_SHEETS_ID.substring(0, 8)}...` : 
                    'Configurado en variables de entorno'
                  }
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Service Account</Label>
                <p className="text-sm text-muted-foreground">
                  {process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 
                    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.split('@')[0] + '@...' :
                    'Configurado en variables de entorno'
                  }
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Entorno</Label>
                <p className="text-sm text-muted-foreground">
                  {process.env.NODE_ENV || 'Desarrollo'}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">URL de la Aplicación</Label>
                <p className="text-sm text-muted-foreground">
                  {process.env.NEXTAUTH_URL || 'http://localhost:3000'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones del Sistema</CardTitle>
            <CardDescription>
              Utilidades y herramientas de mantenimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpiar Caché
              </Button>
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Configuración
              </Button>
              
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Verificar Conexiones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}