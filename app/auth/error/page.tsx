'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Acceso Denegado',
          description: 'Solo usuarios con email @nubank.com.br pueden acceder al sistema.',
          suggestion: 'Verifica que estés usando tu cuenta corporativa de Nubank.'
        }
      case 'Configuration':
        return {
          title: 'Error de Configuración',
          description: 'Hay un problema con la configuración del sistema.',
          suggestion: 'Contacta al administrador del sistema para resolver este problema.'
        }
      case 'Verification':
        return {
          title: 'Error de Verificación',
          description: 'No se pudo verificar tu identidad.',
          suggestion: 'Intenta iniciar sesión nuevamente o contacta soporte.'
        }
      default:
        return {
          title: 'Error de Autenticación',
          description: 'Ocurrió un error inesperado durante el inicio de sesión.',
          suggestion: 'Intenta nuevamente o contacta al administrador si el problema persiste.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-background to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">{errorInfo.title}</CardTitle>
          <CardDescription className="text-red-700">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Sugerencia:</strong> {errorInfo.suggestion}
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild variant="nubank" className="w-full">
              <Link href="/auth/signin">
                Intentar Nuevamente
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
          </div>

          {error && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Código de error: {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}