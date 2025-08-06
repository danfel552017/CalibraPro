'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { canLeadSessions } from '@/lib/auth'
import { User, SesionCalibracion } from '@/types'
import { 
  Plus, 
  Users, 
  Calendar, 
  BarChart3,
  Clock,
  CheckCircle,
  Search,
  Eye,
  Play
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

// Mock data
const mockSessions: SesionCalibracion[] = [
  {
    id_sesion: 'SES001',
    fecha: '2024-01-20',
    lider_sesion: 'maria.silva@nubank.com.br',
    id_scorecard_usado: 'SC001',
    id_interaccion_evaluada: 'INT-2024-0156',
    participantes: '["ana.costa@nubank.com.br", "carlos.santos@nubank.com.br", "lucia.fernandez@nubank.com.br"]',
    kappa_score: 0.78,
    estado: 'Finalizada'
  },
  {
    id_sesion: 'SES002',
    fecha: '2024-01-18',
    lider_sesion: 'joao.oliveira@nubank.com.br',
    id_scorecard_usado: 'SC002',
    id_interaccion_evaluada: 'INT-2024-0142',
    participantes: '["pedro.lima@nubank.com.br", "sofia.rodriguez@nubank.com.br"]',
    estado: 'En_Progreso'
  },
  {
    id_sesion: 'SES003',
    fecha: '2024-01-15',
    lider_sesion: 'maria.silva@nubank.com.br',
    id_scorecard_usado: 'SC001',
    id_interaccion_evaluada: 'INT-2024-0128',
    participantes: '["ana.costa@nubank.com.br", "carlos.santos@nubank.com.br"]',
    kappa_score: 0.85,
    estado: 'Finalizada'
  },
  {
    id_sesion: 'SES004',
    fecha: '2024-01-22',
    lider_sesion: 'ricardo.perez@nubank.com.br',
    id_scorecard_usado: 'SC001',
    id_interaccion_evaluada: 'INT-2024-0163',
    participantes: '["lucia.fernandez@nubank.com.br", "marcos.silva@nubank.com.br", "ana.costa@nubank.com.br"]',
    estado: 'Configurada'
  }
]

export default function SessionsPage() {
  const { data: session } = useSession()
  const user = session?.user as User
  const [sessions, setSessions] = useState<SesionCalibracion[]>(mockSessions)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'mine' | 'leading'>('all')

  // Filter sessions based on user participation
  const getFilteredSessions = () => {
    let filtered = sessions.filter(session => {
      const participants = JSON.parse(session.participantes)
      const matchesSearch = 
        session.id_sesion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id_interaccion_evaluada.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      switch (filterStatus) {
        case 'mine':
          return participants.includes(user?.email) || session.lider_sesion === user?.email
        case 'leading':
          return session.lider_sesion === user?.email
        default:
          return participants.includes(user?.email) || session.lider_sesion === user?.email
      }
    })

    return filtered
  }

  const filteredSessions = getFilteredSessions()

  const getStatusIcon = (estado: SesionCalibracion['estado']) => {
    switch (estado) {
      case 'Configurada':
        return <Clock className="w-4 h-4" />
      case 'En_Progreso':
        return <Play className="w-4 h-4" />
      case 'Finalizada':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusBadge = (estado: SesionCalibracion['estado']) => {
    switch (estado) {
      case 'Configurada':
        return 'status-pending'
      case 'En_Progreso':
        return 'status-in-progress'
      case 'Finalizada':
        return 'status-completed'
      default:
        return 'status-pending'
    }
  }

  const canParticipate = (session: SesionCalibracion) => {
    const participants = JSON.parse(session.participantes)
    return participants.includes(user?.email) && session.estado === 'En_Progreso'
  }

  const canView = (session: SesionCalibracion) => {
    const participants = JSON.parse(session.participantes)
    return participants.includes(user?.email) || session.lider_sesion === user?.email
  }

  const isLeader = (session: SesionCalibracion) => {
    return session.lider_sesion === user?.email
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Sesiones de Calibración</h1>
            <p className="text-muted-foreground mt-2">
              Sesiones donde participas como evaluador o líder
            </p>
          </div>
          
          {canLeadSessions(user) && (
            <Button asChild variant="nubank">
              <Link href="/sessions/new">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Sesión
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID de sesión o interacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Todas
            </Button>
            <Button 
              variant={filterStatus === 'mine' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('mine')}
              size="sm"
            >
              Participo
            </Button>
            {canLeadSessions(user) && (
              <Button 
                variant={filterStatus === 'leading' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('leading')}
                size="sm"
              >
                Lidero
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sesiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredSessions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {filteredSessions.filter(s => s.estado === 'En_Progreso').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Finalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredSessions.filter(s => s.estado === 'Finalizada').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kappa Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {filteredSessions.filter(s => s.kappa_score).length > 0 
                  ? (filteredSessions
                      .filter(s => s.kappa_score)
                      .reduce((acc, s) => acc + (s.kappa_score || 0), 0) / 
                    filteredSessions.filter(s => s.kappa_score).length).toFixed(2)
                  : '—'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const participants = JSON.parse(session.participantes)
            const canPart = canParticipate(session)
            const canSee = canView(session)
            const isLead = isLeader(session)
            
            return (
              <Card key={session.id_sesion} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          Sesión {session.id_sesion}
                        </h3>
                        <Badge className={getStatusBadge(session.estado)}>
                          {getStatusIcon(session.estado)}
                          <span className="ml-1">{session.estado.replace('_', ' ')}</span>
                        </Badge>
                        {isLead && (
                          <Badge variant="secondary">
                            Líder
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(session.fecha)}
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {participants.length} participantes
                        </div>
                        
                        {session.kappa_score && (
                          <div className="flex items-center text-muted-foreground">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Kappa: {session.kappa_score.toFixed(3)}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          <strong>Interacción:</strong> {session.id_interaccion_evaluada}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Líder:</strong> {session.lider_sesion.split('@')[0]}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {participants.map((participant: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className={participant === user?.email ? 'border-nubank-purple' : ''}
                          >
                            {participant.split('@')[0]}
                            {participant === user?.email && ' (tú)'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {canPart && (
                        <Button asChild variant="nubank" size="sm">
                          <Link href={`/sessions/${session.id_sesion}/evaluate`}>
                            <Play className="w-4 h-4 mr-2" />
                            Evaluar
                          </Link>
                        </Button>
                      )}
                      
                      {canSee && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/sessions/${session.id_sesion}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron sesiones' : 'No tienes sesiones aún'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Las sesiones aparecerán aquí cuando seas invitado a participar o cuando lideres una'
              }
            </p>
            {!searchTerm && canLeadSessions(user) && (
              <Button asChild variant="nubank">
                <Link href="/sessions/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Sesión
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}