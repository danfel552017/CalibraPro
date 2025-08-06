'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome, Shield, Users, BarChart3 } from 'lucide-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Error signing in:', error)
    }
    setIsLoading(false)
  }

  const handleDemoSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('demo', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Error signing in with demo:', error)
    }
    setIsLoading(false)
  }

  // Verificar si estamos en modo demo
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                    typeof window !== 'undefined' && window.location.search.includes('demo=true')

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
              <Chrome className="w-6 h-6 text-nubank-purple" />
              <div>
                <p className="font-medium">Google Workspace</p>
                <p className="text-xs text-muted-foreground">Integración nativa completa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign in form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Acceso al Sistema</CardTitle>
            <CardDescription>
              Inicia sesión con tu cuenta de Nubank para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botón de Demo Mode - siempre visible */}
            <Button 
              onClick={handleDemoSignIn}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-full border-2 border-nubank-purple hover:bg-nubank-purple hover:text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner w-4 h-4"></div>
                  <span>Conectando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>🎭 Entrar como Demo</span>
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">o</span>
              </div>
            </div>
            
            <Button 
              onClick={handleSignIn}
              disabled={isLoading}
              variant="nubank"
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner w-4 h-4"></div>
                  <span>Conectando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Chrome className="w-5 h-5" />
                  <span>Continuar con Google</span>
                </div>
              )}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p className="text-nubank-purple font-medium">🎭 Demo Mode: Explora todas las funcionalidades sin credenciales</p>
              <p>Solo usuarios con email @nubank.com.br pueden acceder al modo producción</p>
              <p>Al continuar, aceptas los términos de uso internos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}