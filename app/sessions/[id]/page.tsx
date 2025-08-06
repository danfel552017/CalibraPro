'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SesionCalibracion, ResultadoDetallado, Pregunta, Scorecard, KappaResult } from '@/types'
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

// Mock data
const mockSession: SesionCalibracion = {
  id_sesion: 'SES001',
  fecha: '2024-01-20',
  lider_sesion: 'maria.silva@nubank.com.br',
  id_scorecard_usado: 'SC001',
  id_interaccion_evaluada: 'INT-2024-0156',
  participantes: '["ana.costa@nubank.com.br", "carlos.santos@nubank.com.br", "lucia.fernandez@nubank.com.br"]',
  kappa_score: 0.78,
  estado: 'Finalizada'
}

const mockScorecard: Scorecard = {
  id_scorecard: 'SC001',
  nombre_scorecard: 'Scorecard Atención Telefónica Q1 2024',
  descripcion: 'Evaluación de calidad para atención telefónica del primer trimestre',
  fecha_creacion: '2024-01-15',
  estado: 'Activo'
}

const mockQuestions: Pregunta[] = [
  {
    id_pregunta: 'Q001',
    id_scorecard: 'SC001',
    seccion: 'Saludo y Apertura',
    texto_pregunta: '¿El analista se identifica correctamente al inicio de la llamada?',
    guia_aplicacion: 'Debe mencionar su nombre y la empresa. Ej: "Hola, mi nombre es Juan de Nubank"',
    tipo_error: 'Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q002',
    id_scorecard: 'SC001',
    seccion: 'Saludo y Apertura',
    texto_pregunta: '¿El analista utiliza un tono de voz apropiado y profesional?',
    guia_aplicacion: 'Tono amigable, claro y profesional durante toda la interacción',
    tipo_error: 'No Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q003',
    id_scorecard: 'SC001',
    seccion: 'Desarrollo de la Llamada',
    texto_pregunta: '¿El analista comprende correctamente la solicitud del cliente?',
    guia_aplicacion: 'Demuestra entendimiento reformulando o haciendo preguntas clarificadoras',
    tipo_error: 'Crítico',
    estado: 'Activo'
  },
  {
    id_pregunta: 'Q004',
    id_scorecard: 'SC001',
    seccion: 'Cierre',
    texto_pregunta: '¿El analista realiza un cierre adecuado de la llamada?',
    guia_aplicacion: 'Pregunta si el cliente tiene más dudas y se despide cordialmente',
    tipo_error: 'No Crítico',
    estado: 'Activo'
  }
]

const mockResults: ResultadoDetallado[] = [
  { id_resultado: 'R001', id_sesion: 'SES001', email_analista: 'ana.costa@nubank.com.br', id_pregunta: 'Q001', calificacion: 1, timestamp: '2024-01-20T10:00:00Z' },
  { id_resultado: 'R002', id_sesion: 'SES001', email_analista: 'ana.costa@nubank.com.br', id_pregunta: 'Q002', calificacion: 1, timestamp: '2024-01-20T10:00:00Z' },
  { id_resultado: 'R003', id_sesion: 'SES001', email_analista: 'ana.costa@nubank.com.br', id_pregunta: 'Q003', calificacion: 0, timestamp: '2024-01-20T10:00:00Z' },
  { id_resultado: 'R004', id_sesion: 'SES001', email_analista: 'ana.costa@nubank.com.br', id_pregunta: 'Q004', calificacion: 1, timestamp: '2024-01-20T10:00:00Z' },
  
  { id_resultado: 'R005', id_sesion: 'SES001', email_analista: 'carlos.santos@nubank.com.br', id_pregunta: 'Q001', calificacion: 1, timestamp: '2024-01-20T10:15:00Z' },
  { id_resultado: 'R006', id_sesion: 'SES001', email_analista: 'carlos.santos@nubank.com.br', id_pregunta: 'Q002', calificacion: 0, timestamp: '2024-01-20T10:15:00Z' },
  { id_resultado: 'R007', id_sesion: 'SES001', email_analista: 'carlos.santos@nubank.com.br', id_pregunta: 'Q003', calificacion: 1, timestamp: '2024-01-20T10:15:00Z' },
  { id_resultado: 'R008', id_sesion: 'SES001', email_analista: 'carlos.santos@nubank.com.br', id_pregunta: 'Q004', calificacion: 1, timestamp: '2024-01-20T10:15:00Z' },
  
  { id_resultado: 'R009', id_sesion: 'SES001', email_analista: 'lucia.fernandez@nubank.com.br', id_pregunta: 'Q001', calificacion: 1, timestamp: '2024-01-20T10:30:00Z' },
  { id_resultado: 'R010', id_sesion: 'SES001', email_analista: 'lucia.fernandez@nubank.com.br', id_pregunta: 'Q002', calificacion: 1, timestamp: '2024-01-20T10:30:00Z' },
  { id_resultado: 'R011', id_sesion: 'SES001', email_analista: 'lucia.fernandez@nubank.com.br', id_pregunta: 'Q003', calificacion: 0, timestamp: '2024-01-20T10:30:00Z' },
  { id_resultado: 'R012', id_sesion: 'SES001', email_analista: 'lucia.fernandez@nubank.com.br', id_pregunta: 'Q004', calificacion: 1, timestamp: '2024-01-20T10:30:00Z' }
]

const mockKappaResult: KappaResult = {
  kappa: 0.78,
  interpretation: 'Acuerdo Sustancial',
  agreement_matrix: [[1, 1], [2, 8]],
  observed_agreement: 0.83,
  expected_agreement: 0.52
}

export default function SessionDetailPage() {
  const { data: userSession } = useSession()
  const params = useParams()
  const sessionId = params.id as string
  
  const [session, setSession] = useState<SesionCalibracion>(mockSession)
  const [scorecard, setScorecard] = useState<Scorecard>(mockScorecard)
  const [questions, setQuestions] = useState<Pregunta[]>(mockQuestions)
  const [results, setResults] = useState<ResultadoDetallado[]>(mockResults)
  const [kappaResult, setKappaResult] = useState<KappaResult>(mockKappaResult)

  const participants = JSON.parse(session.participantes)
  const sections = [...new Set(questions.map(q => q.seccion))]

  // Calculate progress
  const totalEvaluations = participants.length * questions.length
  const completedEvaluations = results.length
  const progressPercentage = (completedEvaluations / totalEvaluations) * 100

  // Calculate individual scores
  const getParticipantScore = (email: string) => {
    const participantResults = results.filter(r => r.email_analista === email)
    if (participantResults.length === 0) return null
    
    // Check for critical errors first
    const criticalErrors = participantResults.filter(r => {
      const question = questions.find(q => q.id_pregunta === r.id_pregunta)
      return question?.tipo_error === 'Crítico' && r.calificacion === 0
    })
    
    if (criticalErrors.length > 0) return 0
    
    const correctAnswers = participantResults.filter(r => r.calificacion === 1).length
    return Math.round((correctAnswers / participantResults.length) * 100)
  }

  // Calculate agreement by question
  const getQuestionAgreement = (questionId: string) => {
    const questionResults = results.filter(r => r.id_pregunta === questionId)
    if (questionResults.length === 0) return 0
    
    const scores = questionResults.map(r => r.calificacion)
    const agreements = scores.filter(score => score === scores[0]).length
    return (agreements / scores.length) * 100
  }

  const getKappaColor = (kappa: number) => {
    if (kappa >= 0.81) return 'text-purple-600'
    if (kappa >= 0.61) return 'text-green-600'
    if (kappa >= 0.41) return 'text-blue-600'
    if (kappa >= 0.21) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/sessions">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Sesión {session.id_sesion}</h1>
              <p className="text-muted-foreground">
                {session.id_interaccion_evaluada} • {formatDate(session.fecha)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={
              session.estado === 'Finalizada' ? 'status-completed' :
              session.estado === 'En_Progreso' ? 'status-in-progress' :
              'status-pending'
            }>
              {session.estado === 'Finalizada' && <CheckCircle className="w-4 h-4 mr-1" />}
              {session.estado === 'En_Progreso' && <Clock className="w-4 h-4 mr-1" />}
              {session.estado.replace('_', ' ')}
            </Badge>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Líder:</span>
                <p className="font-medium">{session.lider_sesion.split('@')[0]}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Scorecard:</span>
                <p className="font-medium">{scorecard.nombre_scorecard}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Participantes:</span>
                <p className="font-medium">{participants.length} analistas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Progreso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Evaluaciones completadas</span>
                  <span>{completedEvaluations}/{totalEvaluations}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                {progressPercentage === 100 ? 'Todas las evaluaciones completadas' : 
                 `${Math.round(progressPercentage)}% completado`}
              </p>
            </CardContent>
          </Card>
          
          {session.estado === 'Finalizada' && kappaResult && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Concordancia (Kappa)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getKappaColor(kappaResult.kappa)}`}>
                    {kappaResult.kappa.toFixed(3)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {kappaResult.interpretation}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Acuerdo observado: {(kappaResult.observed_agreement * 100).toFixed(1)}%</div>
                  <div>Acuerdo esperado: {(kappaResult.expected_agreement * 100).toFixed(1)}%</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Participants Results */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados por Participante</CardTitle>
            <CardDescription>
              Puntuaciones individuales y estado de evaluación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants.map((participant: string) => {
                const score = getParticipantScore(participant)
                const hasCompleted = results.filter(r => r.email_analista === participant).length === questions.length
                
                return (
                  <div key={participant} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{participant.split('@')[0]}</p>
                        <p className="text-sm text-muted-foreground">{participant}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {hasCompleted ? (
                        <>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{score}%</p>
                            <p className="text-xs text-muted-foreground">Score COPC</p>
                          </div>
                          <Badge className="status-completed">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completado
                          </Badge>
                        </>
                      ) : (
                        <Badge className="status-pending">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Questions Analysis */}
        {session.estado === 'Finalizada' && (
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Pregunta</CardTitle>
              <CardDescription>
                Nivel de acuerdo entre evaluadores para cada pregunta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sections.map(section => (
                  <div key={section}>
                    <h3 className="text-lg font-semibold mb-3">{section}</h3>
                    <div className="space-y-3">
                      {questions
                        .filter(q => q.seccion === section)
                        .map((question, index) => {
                          const agreement = getQuestionAgreement(question.id_pregunta)
                          const questionResults = results.filter(r => r.id_pregunta === question.id_pregunta)
                          
                          return (
                            <div key={question.id_pregunta} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {index + 1}.
                                    </span>
                                    <p className="font-medium">{question.texto_pregunta}</p>
                                    <Badge className={question.tipo_error === 'Crítico' ? 'status-critical' : 'status-active'}>
                                      {question.tipo_error === 'Crítico' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                      {question.tipo_error}
                                    </Badge>
                                  </div>
                                  
                                  {question.guia_aplicacion && (
                                    <p className="text-sm text-muted-foreground italic pl-6">
                                      📋 {question.guia_aplicacion}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="text-right ml-4">
                                  <div className="text-lg font-bold">{agreement.toFixed(0)}%</div>
                                  <div className="text-xs text-muted-foreground">Acuerdo</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                {participants.map((participant: string) => {
                                  const result = questionResults.find(r => r.email_analista === participant)
                                  return (
                                    <div key={participant} className="flex justify-between">
                                      <span className="text-muted-foreground">{participant.split('@')[0]}</span>
                                      <Badge variant={result?.calificacion === 1 ? 'default' : 'destructive'}>
                                        {result?.calificacion === 1 ? 'Cumple' : 'No Cumple'}
                                      </Badge>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}