'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { canLeadSessions } from '@/lib/auth'
import { User, Scorecard } from '@/types'
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Plus,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockScorecards: Scorecard[] = [
  {
    id_scorecard: 'SC001',
    nombre_scorecard: 'Scorecard Atención Telefónica Q1 2024',
    descripcion: 'Evaluación de calidad para atención telefónica del primer trimestre',
    fecha_creacion: '2024-01-15',
    estado: 'Activo'
  },
  {
    id_scorecard: 'SC002',
    nombre_scorecard: 'Scorecard Chat Digital',
    descripcion: 'Criterios de evaluación para atención vía chat y canales digitales',
    fecha_creacion: '2024-01-10',
    estado: 'Activo'
  }
]

export default function NewSessionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as User
  
  const [sessionData, setSessionData] = useState({
    id_scorecard_usado: '',
    id_interaccion_evaluada: '',
    participantes: [] as string[],
    participante_input: ''
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    return email.endsWith('@nubank.com.br') && email.includes('@')
  }

  const addParticipant = () => {
    const email = sessionData.participante_input.trim().toLowerCase()
    
    if (!email) return
    
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'El email debe ser @nubank.com.br' })
      return
    }
    
    if (sessionData.participantes.includes(email)) {
      setErrors({ ...errors, email: 'Este participante ya fue agregado' })
      return
    }
    
    if (email === user?.email) {
      setErrors({ ...errors, email: 'No puedes agregarte a ti mismo' })
      return
    }
    
    setSessionData({
      ...sessionData,
      participantes: [...sessionData.participantes, email],
      participante_input: ''
    })
    
    // Clear email error
    const newErrors = { ...errors }
    delete newErrors.email
    setErrors(newErrors)
  }

  const removeParticipant = (email: string) => {
    setSessionData({
      ...sessionData,
      participantes: sessionData.participantes.filter(p => p !== email)
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!sessionData.id_scorecard_usado) {
      newErrors.scorecard = 'Selecciona un scorecard'
    }
    
    if (!sessionData.id_interaccion_evaluada) {
      newErrors.interaccion = 'Ingresa el ID de la interacción'
    }
    
    if (sessionData.participantes.length < 2) {
      newErrors.participantes = 'Se necesitan al menos 2 participantes'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateSession = async () => {
    if (!validateForm()) return
    
    setIsCreating(true)
    
    try {
      // In real app, make API call
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      // Redirect to sessions list
      router.push('/sessions')
    } catch (error) {
      console.error('Error creating session:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!canLeadSessions(user)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso Restringido
          </h3>
          <p className="text-muted-foreground">
            Solo los líderes y administradores pueden crear sesiones de calibración.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/sessions">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nueva Sesión de Calibración</h1>
            <p className="text-muted-foreground">
              Configura una nueva sesión para evaluar la concordancia entre analistas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scorecard Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Seleccionar Scorecard
                </CardTitle>
                <CardDescription>
                  Elige el scorecard que se usará para la evaluación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Select
                    value={sessionData.id_scorecard_usado}
                    onValueChange={(value) => setSessionData({
                      ...sessionData,
                      id_scorecard_usado: value
                    })}
                  >
                    <SelectTrigger className={errors.scorecard ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona un scorecard" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockScorecards.map(scorecard => (
                        <SelectItem key={scorecard.id_scorecard} value={scorecard.id_scorecard}>
                          <div className="flex flex-col">
                            <span className="font-medium">{scorecard.nombre_scorecard}</span>
                            <span className="text-xs text-muted-foreground">
                              {scorecard.descripcion}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.scorecard && (
                    <p className="text-sm text-red-500 mt-1">{errors.scorecard}</p>
                  )}
                </div>
                
                {sessionData.id_scorecard_usado && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Scorecard seleccionado correctamente
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interaction ID */}
            <Card>
              <CardHeader>
                <CardTitle>ID de Interacción</CardTitle>
                <CardDescription>
                  Especifica qué interacción será evaluada en esta sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="interaccion">ID de la Interacción</Label>
                  <Input
                    id="interaccion"
                    value={sessionData.id_interaccion_evaluada}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      id_interaccion_evaluada: e.target.value
                    })}
                    placeholder="Ej: INT-2024-0156"
                    className={errors.interaccion ? 'border-red-500' : ''}
                  />
                  {errors.interaccion && (
                    <p className="text-sm text-red-500 mt-1">{errors.interaccion}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Este ID debe corresponder a una interacción específica que todos los participantes evaluarán
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participantes
                </CardTitle>
                <CardDescription>
                  Agrega los analistas que participarán en la evaluación ciega
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={sessionData.participante_input}
                      onChange={(e) => setSessionData({
                        ...sessionData,
                        participante_input: e.target.value
                      })}
                      placeholder="email@nubank.com.br"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addParticipant()
                        }
                      }}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <Button onClick={addParticipant} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {sessionData.participantes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Participantes agregados ({sessionData.participantes.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {sessionData.participantes.map((participant, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {participant}
                          <button
                            onClick={() => removeParticipant(participant)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {errors.participantes && (
                  <p className="text-sm text-red-500">{errors.participantes}</p>
                )}
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start text-blue-800">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Importante:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Se necesitan mínimo 2 participantes para calcular el Kappa</li>
                        <li>• Todos los participantes deben evaluar la misma interacción</li>
                        <li>• Las evaluaciones son ciegas (no se ven entre participantes)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Sesión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Líder</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.name} ({user?.email})
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Scorecard</Label>
                  <p className="text-sm text-muted-foreground">
                    {sessionData.id_scorecard_usado || 'No seleccionado'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Interacción</Label>
                  <p className="text-sm text-muted-foreground">
                    {sessionData.id_interaccion_evaluada || 'No especificada'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Participantes</Label>
                  <p className="text-sm text-muted-foreground">
                    {sessionData.participantes.length} analistas
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="nubank" 
                    className="w-full"
                    onClick={handleCreateSession}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creando...' : 'Crear Sesión'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-nubank-purple">1.</span>
                  <p>Los participantes recibirán notificación de la nueva sesión</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-nubank-purple">2.</span>
                  <p>Cada analista evaluará la interacción de forma independiente</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-nubank-purple">3.</span>
                  <p>El sistema calculará automáticamente las métricas de concordancia</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}