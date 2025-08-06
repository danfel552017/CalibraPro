'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Target,
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Mock data for analytics
const mockAnalytics = {
  overview: {
    totalSessions: 15,
    averageKappa: 0.73,
    participationRate: 87,
    improvementTrend: 12 // percentage
  },
  kappaHistory: [
    { month: 'Oct 2023', kappa: 0.65, sessions: 8 },
    { month: 'Nov 2023', kappa: 0.68, sessions: 12 },
    { month: 'Dec 2023', kappa: 0.71, sessions: 10 },
    { month: 'Jan 2024', kappa: 0.73, sessions: 15 }
  ],
  participantStats: [
    { name: 'Ana Costa', email: 'ana.costa@nubank.com.br', sessions: 8, avgScore: 92, lastKappa: 0.78 },
    { name: 'Carlos Santos', email: 'carlos.santos@nubank.com.br', sessions: 12, avgScore: 88, lastKappa: 0.75 },
    { name: 'Lucia Fernandez', email: 'lucia.fernandez@nubank.com.br', sessions: 6, avgScore: 95, lastKappa: 0.82 },
    { name: 'Pedro Lima', email: 'pedro.lima@nubank.com.br', sessions: 9, avgScore: 85, lastKappa: 0.68 },
    { name: 'Sofia Rodriguez', email: 'sofia.rodriguez@nubank.com.br', sessions: 7, avgScore: 91, lastKappa: 0.71 }
  ],
  scorecardPerformance: [
    { 
      id: 'SC001', 
      name: 'Scorecard Atención Telefónica Q1 2024', 
      sessions: 8, 
      avgKappa: 0.76,
      criticalErrorRate: 12,
      mostProblematicQuestion: '¿El analista comprende correctamente la solicitud del cliente?'
    },
    { 
      id: 'SC002', 
      name: 'Scorecard Chat Digital', 
      sessions: 5, 
      avgKappa: 0.69,
      criticalErrorRate: 18,
      mostProblematicQuestion: '¿El analista verifica la identidad del cliente según protocolo?'
    },
    { 
      id: 'SC003', 
      name: 'Scorecard Cobranzas', 
      sessions: 2, 
      avgKappa: 0.82,
      criticalErrorRate: 8,
      mostProblematicQuestion: '¿El analista mantiene el tono empático durante la llamada?'
    }
  ],
  weeklyTrends: [
    { week: 'Sem 1', sessions: 3, avgKappa: 0.71 },
    { week: 'Sem 2', sessions: 4, avgKappa: 0.74 },
    { week: 'Sem 3', sessions: 5, avgKappa: 0.75 },
    { week: 'Sem 4', sessions: 3, avgKappa: 0.73 }
  ]
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [timeRange, setTimeRange] = useState('last-month')
  const [selectedScorecard, setSelectedScorecard] = useState('all')

  const getKappaInterpretation = (kappa: number) => {
    if (kappa >= 0.81) return { text: 'Casi Perfecto', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (kappa >= 0.61) return { text: 'Sustancial', color: 'text-green-600', bg: 'bg-green-100' }
    if (kappa >= 0.41) return { text: 'Moderado', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (kappa >= 0.21) return { text: 'Justo', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { text: 'Ligero', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <BarChart3 className="w-4 h-4 text-gray-600" />
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Análisis y Reportes</h1>
            <p className="text-muted-foreground mt-2">
              Métricas de concordancia y tendencias de calidad
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Última semana</SelectItem>
              <SelectItem value="last-month">Último mes</SelectItem>
              <SelectItem value="last-quarter">Último trimestre</SelectItem>
              <SelectItem value="last-year">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedScorecard} onValueChange={setSelectedScorecard}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los scorecards</SelectItem>
              <SelectItem value="SC001">Scorecard Atención Telefónica</SelectItem>
              <SelectItem value="SC002">Scorecard Chat Digital</SelectItem>
              <SelectItem value="SC003">Scorecard Cobranzas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Sesiones Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{mockAnalytics.overview.totalSessions}</div>
                <div className="flex items-center text-green-600">
                  {getTrendIcon(5)}
                  <span className="text-xs ml-1">+5</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Kappa Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{mockAnalytics.overview.averageKappa}</div>
                <div className="flex items-center text-green-600">
                  {getTrendIcon(mockAnalytics.overview.improvementTrend)}
                  <span className="text-xs ml-1">+{mockAnalytics.overview.improvementTrend}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getKappaInterpretation(mockAnalytics.overview.averageKappa).text}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Tasa de Participación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{mockAnalytics.overview.participationRate}%</div>
                <div className="flex items-center text-green-600">
                  {getTrendIcon(3)}
                  <span className="text-xs ml-1">+3%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                analistas activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Mejora Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">
                  +{mockAnalytics.overview.improvementTrend}%
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                en concordancia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kappa Evolution */}
          <Card>
            <CardHeader>
              <CardTitle>Evolución del Kappa</CardTitle>
              <CardDescription>
                Tendencia de concordancia en los últimos meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.kappaHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.month}</p>
                      <p className="text-sm text-muted-foreground">{item.sessions} sesiones</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{item.kappa.toFixed(3)}</div>
                      <Badge className={getKappaInterpretation(item.kappa).bg + ' ' + getKappaInterpretation(item.kappa).color}>
                        {getKappaInterpretation(item.kappa).text}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencias Semanales</CardTitle>
              <CardDescription>
                Actividad y concordancia por semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.weeklyTrends.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.week}</span>
                      <div className="text-right">
                        <span className="text-sm">{item.sessions} sesiones</span>
                        <span className="text-sm ml-2 font-bold">{item.avgKappa.toFixed(2)}</span>
                      </div>
                    </div>
                    <Progress value={item.avgKappa * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participant Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Participante</CardTitle>
            <CardDescription>
              Estadísticas individuales de analistas activos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Analista</th>
                    <th className="text-center p-2">Sesiones</th>
                    <th className="text-center p-2">Score Promedio</th>
                    <th className="text-center p-2">Último Kappa</th>
                    <th className="text-center p-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAnalytics.participantStats.map((participant, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.email.split('@')[0]}
                          </p>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="outline">{participant.sessions}</Badge>
                      </td>
                      <td className="text-center p-3">
                        <div className="font-medium">{participant.avgScore}%</div>
                      </td>
                      <td className="text-center p-3">
                        <div className="font-bold">{participant.lastKappa.toFixed(3)}</div>
                        <div className="text-xs text-muted-foreground">
                          {getKappaInterpretation(participant.lastKappa).text}
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge className={
                          participant.avgScore >= 90 ? 'status-completed' :
                          participant.avgScore >= 80 ? 'status-active' :
                          'status-pending'
                        }>
                          {participant.avgScore >= 90 ? 'Excelente' :
                           participant.avgScore >= 80 ? 'Bueno' :
                           'En Mejora'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Scorecard Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Scorecard</CardTitle>
            <CardDescription>
              Análisis de efectividad de cada conjunto de criterios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.scorecardPerformance.map((scorecard, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{scorecard.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {scorecard.id}</p>
                    </div>
                    <Badge className={getKappaInterpretation(scorecard.avgKappa).bg + ' ' + getKappaInterpretation(scorecard.avgKappa).color}>
                      Kappa: {scorecard.avgKappa.toFixed(3)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Sesiones:</span>
                      <p className="font-medium">{scorecard.sessions}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errores Críticos:</span>
                      <p className="font-medium text-red-600">{scorecard.criticalErrorRate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mayor Discrepancia:</span>
                      <p className="font-medium text-xs">{scorecard.mostProblematicQuestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Insights y Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <p className="text-sm">
                <strong>Mejora general:</strong> El Kappa promedio ha aumentado un 12% en el último mes, 
                indicando mejor alineación entre evaluadores.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <p className="text-sm">
                <strong>Área de oportunidad:</strong> El "Scorecard Chat Digital" presenta la mayor tasa 
                de errores críticos (18%). Se recomienda capacitación específica.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <p className="text-sm">
                <strong>Participación activa:</strong> 87% de tasa de participación, pero se puede mejorar 
                con recordatorios automáticos y gamificación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}