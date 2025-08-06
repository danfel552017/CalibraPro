'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { isAdmin } from '@/lib/auth'
import { User, Scorecard } from '@/types'
import { 
  Plus, 
  Edit, 
  Copy, 
  Archive, 
  Search, 
  FileText,
  Calendar,
  MoreVertical
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

// Mock data - in real app this would come from API
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
  },
  {
    id_scorecard: 'SC003',
    nombre_scorecard: 'Scorecard Cobranzas',
    descripcion: 'Evaluación especializada para el área de cobranzas',
    fecha_creacion: '2023-12-20',
    estado: 'Inactivo'
  }
]

export default function ScorecardsPage() {
  const { data: session } = useSession()
  const user = session?.user as User
  const [scorecards, setScorecards] = useState<Scorecard[]>(mockScorecards)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newScorecard, setNewScorecard] = useState({
    nombre_scorecard: '',
    descripcion: ''
  })

  const filteredScorecards = scorecards.filter(scorecard =>
    scorecard.nombre_scorecard.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scorecard.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateScorecard = async () => {
    // In real app, this would make API call
    const newScorecardData: Scorecard = {
      id_scorecard: `SC${(scorecards.length + 1).toString().padStart(3, '0')}`,
      ...newScorecard,
      fecha_creacion: new Date().toISOString().split('T')[0],
      estado: 'Activo'
    }
    
    setScorecards([...scorecards, newScorecardData])
    setNewScorecard({ nombre_scorecard: '', descripcion: '' })
    setIsCreateDialogOpen(false)
  }

  const handleCloneScorecard = (scorecard: Scorecard) => {
    const clonedScorecard: Scorecard = {
      ...scorecard,
      id_scorecard: `SC${(scorecards.length + 1).toString().padStart(3, '0')}`,
      nombre_scorecard: `${scorecard.nombre_scorecard} (Copia)`,
      fecha_creacion: new Date().toISOString().split('T')[0]
    }
    setScorecards([...scorecards, clonedScorecard])
  }

  const handleArchiveScorecard = (id: string) => {
    setScorecards(scorecards.map(s => 
      s.id_scorecard === id ? { ...s, estado: 'Inactivo' as const } : s
    ))
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Scorecards</h1>
            <p className="text-muted-foreground mt-2">
              Administra los criterios de evaluación para las sesiones de calibración
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="nubank">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Scorecard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Scorecard</DialogTitle>
                <DialogDescription>
                  Define un nuevo conjunto de criterios para evaluaciones de calidad
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Scorecard</Label>
                  <Input
                    id="nombre"
                    value={newScorecard.nombre_scorecard}
                    onChange={(e) => setNewScorecard({
                      ...newScorecard,
                      nombre_scorecard: e.target.value
                    })}
                    placeholder="Ej: Scorecard Atención Telefónica Q2 2024"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={newScorecard.descripcion}
                    onChange={(e) => setNewScorecard({
                      ...newScorecard,
                      descripcion: e.target.value
                    })}
                    placeholder="Describe el propósito y contexto de este scorecard"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="nubank"
                  onClick={handleCreateScorecard}
                  disabled={!newScorecard.nombre_scorecard || !newScorecard.descripcion}
                >
                  Crear Scorecard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar scorecards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Scorecards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scorecards.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {scorecards.filter(s => s.estado === 'Activo').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Archivados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">
                {scorecards.filter(s => s.estado === 'Inactivo').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scorecards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScorecards.map((scorecard) => (
            <Card key={scorecard.id_scorecard} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {scorecard.nombre_scorecard}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {scorecard.descripcion}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={
                      scorecard.estado === 'Activo' 
                        ? 'status-active' 
                        : 'status-inactive'
                    }
                  >
                    {scorecard.estado}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Creado: {formatDate(scorecard.fecha_creacion)}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    ID: {scorecard.id_scorecard}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={`/scorecards/${scorecard.id_scorecard}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCloneScorecard(scorecard)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    {scorecard.estado === 'Activo' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleArchiveScorecard(scorecard.id_scorecard)}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScorecards.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron scorecards' : 'No hay scorecards creados'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer scorecard para definir criterios de evaluación'
              }
            </p>
            {!searchTerm && (
              <Button variant="nubank" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Scorecard
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}