'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Users, BarChart3, Lock, User } from 'lucide-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Usuario o contraseña incorrectos')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error signing in:', error)
      setError('Error al iniciar sesión')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nubank-purple/10 via-background to-nubank-purple-light/10 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold nubank-gradient bg-clip-text text-transparent">
              CalibraPro
            </h1>
            <p className="text-xl text-muted-foreground">
              Plataforma de Calibración de Calidad
            </p>
            <p className="text-sm text-muted-foreground">
              Transformando procesos manuales en un ecosistema digital centralizado
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
              <Shield className="w-6 h-6 text-nubank-purple" />
              <div>
                <p className="font-medium">Gestión de Scorecards</p>
                <p className="text-xs text-muted-foreground">Crea y administra evaluaciones</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
              <Users className="w-6 h-6 text-nubank-purple" />
              <div>
                <p className="font-medium">Sesiones Colaborativas</p>
                <p className="text-xs text-muted-foreground">Evaluación ciega entre analistas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
              <BarChart3 className="w-6 h-6 text-nubank-purple" />
              <div>
                <p className="font-medium">Análisis Kappa</p>
                <p className="text-xs text-muted-foreground">Métricas de concordancia automáticas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border">
              <Lock className="w-6 h-6 text-nubank-purple" />
              <div>
                <p className="font-medium">Acceso Seguro</p>
                <p className="text-xs text-muted-foreground">Autenticación local protegida</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign in form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Acceso al Sistema</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a CalibraPro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              
              <Button 
                type="submit"
                disabled={isLoading}
                variant="nubank"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner w-4 h-4"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-xs text-muted-foreground space-y-2">
              <div className="p-3 bg-nubank-purple/10 rounded-lg border">
                <p className="text-nubank-purple font-medium">📋 Credenciales de Administrador:</p>
                <p className="font-mono text-xs mt-1">Usuario: <span className="font-bold">admin_calibrapro</span></p>
                <p className="font-mono text-xs">Contraseña: <span className="font-bold">CalibraPro2024!Admin</span></p>
              </div>
              <p>Al continuar, aceptas los términos de uso internos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}