'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isAdmin, canLeadSessions } from '@/lib/auth'
import { User, SesionCalibracion, PlanAccion } from '@/types'
import {
  FileText,
  Users,
  BarChart3,
  CheckSquare,
  Plus,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

// Mock data - In real app, this would come from API calls
const mockStats = {
  totalSessions: 12,
  activeSessions: 3,
  completedSessions: 9,
  averageKappa: 0.73,
  pendingTasks: 5,
  myTasksCompleted: 8
}

const mockRecentSessions: SesionCalibracion[] = [
  {
    id_sesion: 'SES001',
    fecha: '2024-01-15',
    lider_sesion: 'maria.silva@nubank.com.br',
    id_scorecard_usado: 'SC001',
    id_interaccion_evaluada: 'INT001',
    participantes: '["ana@nubank.com.br", "carlos@nubank.com.br"]',
    kappa_score: 0.85,
    estado: 'Finalizada'
  },
  {
    id_sesion: 'SES002',
    fecha: '2024-01-14',
    lider_sesion: 'joao.santos@nubank.com.br',
    id_scorecard_usado: 'SC002',
    id_interaccion_evaluada: 'INT002',
    participantes: '["lucia@nubank.com.br", "pedro@nubank.com.br"]',
    estado: 'En_Progreso'
  }
]

const mockUpcomingTasks: PlanAccion[] = [
  {
    id_tarea: 'TASK001',
    id_sesion: 'SES001',
    tarea_descripcion: 'Revisar proceso de evaluación de llamadas',
    responsable: 'ana@nubank.com.br',
    fecha_creacion: '2024-01-15',
    fecha_vencimiento: '2024-01-22',
    estado: 'Pendiente'
  },
  {
    id_tarea: 'TASK002',
    id_sesion: 'SES002',
    tarea_descripcion: 'Capacitación en nuevos criterios de calidad',
    responsable: 'carlos@nubank.com.br',
    fecha_creacion: '2024-01-14',
    fecha_vencimiento: '2024-01-20',
    estado: 'En_Progreso'
  }
]

export default function Dashboard() {
  const { data: session } = useSession()
  const user = session?.user as User
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-nubank-purple to-nubank-purple-light rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Bienvenido, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-nubank-purple-light/80 mb-4">
            Aquí tienes un resumen de tu actividad en CalibraPro
          </p>
          
          {(isAdmin(user) || canLeadSessions(user)) && (
            <div className="flex flex-wrap gap-3">
              {isAdmin(user) && (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/scorecards/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Scorecard
                  </Link>
                </Button>
              )}
              {canLeadSessions(user) && (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/sessions/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Sesión
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">
                En progreso actualmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kappa Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.averageKappa}</div>
              <p className="text-xs text-muted-foreground">
                Acuerdo Sustancial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.myTasksCompleted} completadas este mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sesiones Recientes</CardTitle>
                  <CardDescription>
                    Últimas sesiones de calibración
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/sessions">Ver todas</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentSessions.map((session) => (
                  <div key={session.id_sesion} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Sesión {session.id_sesion}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.fecha).toLocaleDateString('pt-BR')}
                      </p>
                      {session.kappa_score && (
                        <p className="text-xs">
                          Kappa: <span className="font-medium">{session.kappa_score}</span>
                        </p>
                      )}
                    </div>
                    <Badge 
                      className={
                        session.estado === 'Finalizada' ? 'status-completed' :
                        session.estado === 'En_Progreso' ? 'status-in-progress' :
                        'status-pending'
                      }
                    >
                      {session.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Próximas Tareas</CardTitle>
                  <CardDescription>
                    Planes de acción programados
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/action-plans">Ver todas</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingTasks.map((task) => (
                  <div key={task.id_tarea} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium">
                        {task.tarea_descripcion}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vence: {new Date(task.fecha_vencimiento).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Responsable: {task.responsable.split('@')[0]}
                      </p>
                    </div>
                    <Badge 
                      className={
                        task.estado === 'Completado' ? 'status-completed' :
                        task.estado === 'En_Progreso' ? 'status-in-progress' :
                        'status-pending'
                      }
                    >
                      {task.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas comunes que puedes realizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/sessions">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Mis Sesiones</span>
                </Link>
              </Button>

              {isAdmin(user) && (
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Link href="/scorecards">
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">Gestionar Scorecards</span>
                  </Link>
                </Button>
              )}

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/analytics">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Ver Análisis</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/action-plans">
                  <CheckSquare className="w-6 h-6" />
                  <span className="text-sm">Planes de Acción</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}