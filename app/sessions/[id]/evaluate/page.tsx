'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { SesionCalibracion, Pregunta, Scorecard } from '@/types'
import { 
  ArrowLeft, 
  CheckCircle,
  X,
  AlertTriangle,
  HelpCircle,
  Send,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockSession: SesionCalibracion = {
  id_sesion: 'SES002',
  fecha: '2024-01-18',
  lider_sesion: 'joao.oliveira@nubank.com.br',
  id_scorecard_usado: 'SC002',
  id_interaccion_evaluada: 'INT-2024-0142',
  participantes: '["pedro.lima@nubank.com.br", "sofia.rodriguez@nubank.com.br"]',
  estado: 'En_Progreso'
}

const mockScorecard: Scorecard = {
  id_scorecard: 'SC002',
  nombre_scorecard: 'Scorecard Chat Digital',
  descripcion: 'Criterios de evaluación para atención vía chat y canales digitales',
  fecha_creacion: '2024-01-10',
  estado: 'Activo'
}

const mockQuestions: Pregunta[] = [
  {
    id_pregunta: 'Q001',
    id_scorecard: 'SC002',
    seccion: 'Saludo Inicial',
    texto_pregunta: '¿El analista saluda al cliente de manera amigable y profesional?',
    guia_aplicacion: 'El saludo debe ser cordial, incluir identificación personal y de la empresa',
    tipo_error: 'No Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q002',
    id_scorecard: 'SC002',
    seccion: 'Saludo Inicial',
    texto_pregunta: '¿El analista verifica la identidad del cliente según protocolo?',
    guia_aplicacion: 'Debe solicitar información específica para confirmar identidad (ej: CPF, datos personales)',
    tipo_error: 'Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q003',
    id_scorecard: 'SC002',
    seccion: 'Desarrollo',
    texto_pregunta: '¿El analista demuestra comprensión del problema del cliente?',
    guia_aplicacion: 'Reformula o resume la consulta para confirmar entendimiento',
    tipo_error: 'Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q004',
    id_scorecard: 'SC002',
    seccion: 'Desarrollo',
    texto_pregunta: '¿El analista proporciona información clara y precisa?',
    guia_aplicacion: 'Las respuestas deben ser específicas, correctas y fáciles de entender',
    tipo_error: 'No Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q005',
    id_scorecard: 'SC002',
    seccion: 'Cierre',
    texto_pregunta: '¿El analista verifica si el cliente tiene dudas adicionales?',
    guia_aplicacion: 'Pregunta explícitamente si hay otras consultas antes de finalizar',
    tipo_error: 'No Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q006',
    id_scorecard: 'SC002',
    seccion: 'Cierre',
    texto_pregunta: '¿El analista se despide de forma cordial y profesional?',
    guia_aplicacion: 'Despedida apropiada que genere buena impresión final',
    tipo_error: 'No Crítico',
    estado: 'Activo'
  }
]

export default function EvaluateSessionPage() {
  const { data: userSession } = useSession()
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  
  const [session, setSession] = useState<SesionCalibracion>(mockSession)
  const [scorecard, setScorecard] = useState<Scorecard>(mockScorecard)
  const [questions, setQuestions] = useState<Pregunta[]>(mockQuestions)
  const [answers, setAnswers] = useState<{ [questionId: string]: 0 | 1 | null }>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showGuide, setShowGuide] = useState<{ [questionId: string]: boolean }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const sections = [...new Set(questions.map(q => q.seccion))]
  const answeredCount = Object.values(answers).filter(a => a !== null).length
  const progressPercentage = (answeredCount / questions.length) * 100

  const handleAnswer = (questionId: string, answer: 0 | 1) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const toggleGuide = (questionId: string) => {
    setShowGuide({ 
      ...showGuide, 
      [questionId]: !showGuide[questionId] 
    })
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitEvaluation = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => answers[q.id_pregunta] === null || answers[q.id_pregunta] === undefined)
    if (unanswered.length > 0) {
      alert(`Por favor responde todas las preguntas. Faltan ${unanswered.length} preguntas.`)
      return
    }

    setIsSubmitting(true)
    
    try {
      // In real app, make API call to submit evaluation
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      // Redirect to session details
      router.push(`/sessions/${sessionId}`)
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      alert('Error al enviar la evaluación. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = questions.every(q => answers[q.id_pregunta] !== null && answers[q.id_pregunta] !== undefined)

  // Check if user can evaluate this session
  const participants = JSON.parse(session.participantes)
  const canEvaluate = participants.includes(userSession?.user?.email) && session.estado === 'En_Progreso'

  if (!canEvaluate) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No puedes evaluar esta sesión
          </h3>
          <p className="text-muted-foreground mb-4">
            Solo los participantes pueden evaluar cuando la sesión está en progreso.
          </p>
          <Button asChild variant="outline">
            <Link href="/sessions">Volver a Sesiones</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="icon">
              <Link href={`/sessions/${sessionId}`}>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Evaluación Ciega</h1>
              <p className="text-muted-foreground">
                {session.id_interaccion_evaluada} • {scorecard.nombre_scorecard}
              </p>
            </div>
          </div>
          
          <Badge className="status-in-progress">
            Evaluando...
          </Badge>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Progreso de Evaluación</h3>
                <span className="text-sm text-muted-foreground">
                  {answeredCount}/{questions.length} preguntas
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {progressPercentage === 100 ? 
                  '¡Todas las preguntas respondidas! Puedes revisar y enviar tu evaluación.' :
                  `${Math.round(progressPercentage)}% completado`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Navegación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map(section => (
                <div key={section}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {section}
                  </h4>
                  <div className="space-y-1">
                    {questions
                      .filter(q => q.seccion === section)
                      .map((question, sectionIndex) => {
                        const globalIndex = questions.findIndex(q => q.id_pregunta === question.id_pregunta)
                        const isAnswered = answers[question.id_pregunta] !== null && answers[question.id_pregunta] !== undefined
                        const isCurrent = globalIndex === currentQuestionIndex
                        
                        return (
                          <button
                            key={question.id_pregunta}
                            onClick={() => goToQuestion(globalIndex)}
                            className={`w-full text-left p-2 rounded text-sm transition-colors ${
                              isCurrent 
                                ? 'bg-nubank-purple text-white' 
                                : isAnswered 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{sectionIndex + 1}</span>
                              {isAnswered && <CheckCircle className="w-3 h-3" />}
                              {question.tipo_error === 'Crítico' && (
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Question */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Pregunta {currentQuestionIndex + 1} de {questions.length}
                    {currentQuestion.tipo_error === 'Crítico' && (
                      <Badge className="status-critical">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Crítico
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{currentQuestion.seccion}</CardDescription>
                </div>
                
                {currentQuestion.guia_aplicacion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleGuide(currentQuestion.id_pregunta)}
                  >
                    {showGuide[currentQuestion.id_pregunta] ? (
                      <EyeOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {showGuide[currentQuestion.id_pregunta] ? 'Ocultar' : 'Ver'} Guía
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  {currentQuestion.texto_pregunta}
                </h3>
                
                {showGuide[currentQuestion.id_pregunta] && currentQuestion.guia_aplicacion && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                          Guía de Aplicación
                        </h4>
                        <p className="text-sm text-blue-800">
                          {currentQuestion.guia_aplicacion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentQuestion.tipo_error === 'Crítico' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-900 mb-1">
                          ⚠️ Pregunta Crítica
                        </h4>
                        <p className="text-sm text-red-800">
                          Si esta pregunta no se cumple (No = 0), la evaluación completa será 0%.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Selecciona tu evaluación:</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(currentQuestion.id_pregunta, 1)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      answers[currentQuestion.id_pregunta] === 1
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">SÍ - Cumple (1)</div>
                        <div className="text-sm text-muted-foreground">
                          El criterio se cumple satisfactoriamente
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAnswer(currentQuestion.id_pregunta, 0)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      answers[currentQuestion.id_pregunta] === 0
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <X className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-semibold">NO - No Cumple (0)</div>
                        <div className="text-sm text-muted-foreground">
                          El criterio no se cumple
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Anterior
                </Button>
                
                <div className="flex gap-2">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button 
                      variant="nubank"
                      onClick={goToNext}
                    >
                      Siguiente →
                    </Button>
                  ) : (
                    <Button 
                      variant="nubank"
                      onClick={handleSubmitEvaluation}
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Evaluación
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Summary */}
        {canSubmit && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Evaluación Completa
                    </h3>
                    <p className="text-sm text-green-700">
                      Has respondido todas las preguntas. Puedes enviar tu evaluación.
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="default"
                  onClick={handleSubmitEvaluation}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Evaluación
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}