'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { isAdmin } from '@/lib/auth'
import { User, Scorecard, Pregunta } from '@/types'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

// Mock data
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

export default function ScorecardDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const user = session?.user as User
  const scorecardId = params.id as string
  
  const [scorecard, setScorecard] = useState<Scorecard>(mockScorecard)
  const [questions, setQuestions] = useState<Pregunta[]>(mockQuestions)
  const [isEditingScorecard, setIsEditingScorecard] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Pregunta | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    seccion: '',
    texto_pregunta: '',
    guia_aplicacion: '',
    tipo_error: 'No Crítico' as 'Crítico' | 'No Crítico'
  })

  const sections = [...new Set(questions.map(q => q.seccion))]

  const handleSaveScorecard = () => {
    // In real app, make API call
    setIsEditingScorecard(false)
  }

  const handleAddQuestion = () => {
    const newQuestionData: Pregunta = {
      id_pregunta: `Q${(questions.length + 1).toString().padStart(3, '0')}`,
      id_scorecard: scorecardId,
      ...newQuestion,
      estado: 'Activo'
    }
    
    setQuestions([...questions, newQuestionData])
    setNewQuestion({
      seccion: '',
      texto_pregunta: '',
      guia_aplicacion: '',
      tipo_error: 'No Crítico'
    })
    setIsAddQuestionOpen(false)
  }

  const handleEditQuestion = (question: Pregunta) => {
    setEditingQuestion(question)
    setNewQuestion({
      seccion: question.seccion,
      texto_pregunta: question.texto_pregunta,
      guia_aplicacion: question.guia_aplicacion || '',
      tipo_error: question.tipo_error
    })
    setIsAddQuestionOpen(true)
  }

  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return
    
    setQuestions(questions.map(q => 
      q.id_pregunta === editingQuestion.id_pregunta 
        ? { ...q, ...newQuestion }
        : q
    ))
    setEditingQuestion(null)
    setNewQuestion({
      seccion: '',
      texto_pregunta: '',
      guia_aplicacion: '',
      tipo_error: 'No Crítico'
    })
    setIsAddQuestionOpen(false)
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id_pregunta !== id))
  }

  if (!isAdmin(user)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso Restringido
          </h3>
          <p className="text-muted-foreground">
            Solo los administradores pueden gestionar scorecards.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/scorecards">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Scorecard</h1>
              <p className="text-muted-foreground">
                ID: {scorecard.id_scorecard}
              </p>
            </div>
          </div>
          
          <Badge className={scorecard.estado === 'Activo' ? 'status-active' : 'status-inactive'}>
            {scorecard.estado}
          </Badge>
        </div>

        {/* Scorecard Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Información del Scorecard</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setIsEditingScorecard(!isEditingScorecard)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditingScorecard ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              {isEditingScorecard ? (
                <Input
                  id="nombre"
                  value={scorecard.nombre_scorecard}
                  onChange={(e) => setScorecard({
                    ...scorecard,
                    nombre_scorecard: e.target.value
                  })}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {scorecard.nombre_scorecard}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              {isEditingScorecard ? (
                <Textarea
                  id="descripcion"
                  value={scorecard.descripcion}
                  onChange={(e) => setScorecard({
                    ...scorecard,
                    descripcion: e.target.value
                  })}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {scorecard.descripcion}
                </p>
              )}
            </div>
            
            {isEditingScorecard && (
              <div className="flex gap-2">
                <Button variant="nubank" onClick={handleSaveScorecard}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preguntas del Scorecard</CardTitle>
                <CardDescription>
                  {questions.length} preguntas organizadas en {sections.length} secciones
                </CardDescription>
              </div>
              
              <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
                <DialogTrigger asChild>
                  <Button variant="nubank">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Pregunta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingQuestion 
                        ? 'Modifica los datos de la pregunta'
                        : 'Agrega una nueva pregunta de evaluación'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="seccion">Sección</Label>
                      <Select 
                        value={newQuestion.seccion} 
                        onValueChange={(value) => setNewQuestion({
                          ...newQuestion,
                          seccion: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona o escribe una sección" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map(section => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="O escribe una nueva sección"
                        value={newQuestion.seccion}
                        onChange={(e) => setNewQuestion({
                          ...newQuestion,
                          seccion: e.target.value
                        })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pregunta">Texto de la Pregunta</Label>
                      <Textarea
                        id="pregunta"
                        value={newQuestion.texto_pregunta}
                        onChange={(e) => setNewQuestion({
                          ...newQuestion,
                          texto_pregunta: e.target.value
                        })}
                        placeholder="Escribe la pregunta de evaluación"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guia">Guía de Aplicación (Opcional)</Label>
                      <Textarea
                        id="guia"
                        value={newQuestion.guia_aplicacion}
                        onChange={(e) => setNewQuestion({
                          ...newQuestion,
                          guia_aplicacion: e.target.value
                        })}
                        placeholder="Notas, ejemplos o aclaraciones para los evaluadores"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tipo">Tipo de Error</Label>
                      <Select 
                        value={newQuestion.tipo_error} 
                        onValueChange={(value: 'Crítico' | 'No Crítico') => setNewQuestion({
                          ...newQuestion,
                          tipo_error: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No Crítico">No Crítico</SelectItem>
                          <SelectItem value="Crítico">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Los errores críticos anulan automáticamente toda la evaluación
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddQuestionOpen(false)
                        setEditingQuestion(null)
                        setNewQuestion({
                          seccion: '',
                          texto_pregunta: '',
                          guia_aplicacion: '',
                          tipo_error: 'No Crítico'
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="nubank"
                      onClick={editingQuestion ? handleSaveEditedQuestion : handleAddQuestion}
                      disabled={!newQuestion.seccion || !newQuestion.texto_pregunta}
                    >
                      {editingQuestion ? 'Guardar Cambios' : 'Crear Pregunta'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay preguntas aún
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comienza agregando preguntas para definir los criterios de evaluación
                </p>
                <Button variant="nubank" onClick={() => setIsAddQuestionOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Pregunta
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map(section => (
                  <div key={section}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      {section}
                      <Badge variant="secondary" className="ml-2">
                        {questions.filter(q => q.seccion === section).length} preguntas
                      </Badge>
                    </h3>
                    
                    <div className="space-y-3">
                      {questions
                        .filter(q => q.seccion === section)
                        .map((question, index) => (
                          <Card key={question.id_pregunta} className="border-l-4 border-l-nubank-purple">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {index + 1}.
                                    </span>
                                    <p className="font-medium">{question.texto_pregunta}</p>
                                    <Badge 
                                      className={
                                        question.tipo_error === 'Crítico' 
                                          ? 'status-critical' 
                                          : 'status-active'
                                      }
                                    >
                                      {question.tipo_error === 'Crítico' && (
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                      )}
                                      {question.tipo_error}
                                    </Badge>
                                  </div>
                                  
                                  {question.guia_aplicacion && (
                                    <div className="pl-6">
                                      <p className="text-sm text-muted-foreground italic">
                                        📋 {question.guia_aplicacion}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-1 ml-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteQuestion(question.id_pregunta)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}