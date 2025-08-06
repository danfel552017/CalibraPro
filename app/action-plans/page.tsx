'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import MainLayout from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { PlanAccion } from '@/types'
import { 
  Plus, 
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Search,
  Filter,
  Play,
  CheckCircle,
  X
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Mock data
const mockTasks: PlanAccion[] = [
  {
    id_tarea: 'TASK001',
    id_sesion: 'SES001',
    tarea_descripcion: 'Revisar proceso de evaluación de llamadas telefónicas con enfoque en identificación de cliente',
    responsable: 'ana.costa@nubank.com.br',
    fecha_creacion: '2024-01-20',
    fecha_vencimiento: '2024-01-27',
    estado: 'En_Progreso'
  },
  {
    id_tarea: 'TASK002',
    id_sesion: 'SES001',
    tarea_descripcion: 'Capacitación en nuevos criterios de calidad para comprensión de solicitudes',
    responsable: 'carlos.santos@nubank.com.br',
    fecha_creacion: '2024-01-20',
    fecha_vencimiento: '2024-01-25',
    estado: 'Completado'
  },
  {
    id_tarea: 'TASK003',
    id_sesion: 'SES002',
    tarea_descripcion: 'Implementar checklist de verificación de identidad en canal digital',
    responsable: 'lucia.fernandez@nubank.com.br',
    fecha_creacion: '2024-01-18',
    fecha_vencimiento: '2024-01-30',
    estado: 'Pendiente'
  },
  {
    id_tarea: 'TASK004',
    id_sesion: 'SES003',
    tarea_descripcion: 'Actualizar guías de aplicación para criterios de cierre de llamada',
    responsable: 'pedro.lima@nubank.com.br',
    fecha_creacion: '2024-01-15',
    fecha_vencimiento: '2024-01-22',
    estado: 'Pendiente'
  },
  {
    id_tarea: 'TASK005',
    id_sesion: 'SES001',
    tarea_descripcion: 'Realizar sesión de feedback grupal sobre discrepancias encontradas',
    responsable: 'maria.silva@nubank.com.br',
    fecha_creacion: '2024-01-20',
    fecha_vencimiento: '2024-02-01',
    estado: 'En_Progreso'
  }
]

const mockSessions = [
  { id: 'SES001', name: 'Sesión Atención Telefónica - INT-2024-0156' },
  { id: 'SES002', name: 'Sesión Chat Digital - INT-2024-0142' },
  { id: 'SES003', name: 'Sesión Atención Telefónica - INT-2024-0128' }
]

export default function ActionPlansPage() {
  const { data: session } = useSession()
  const user = session?.user
  
  const [tasks, setTasks] = useState<PlanAccion[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'mine' | 'pending' | 'overdue'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    id_sesion: '',
    tarea_descripcion: '',
    responsable: '',
    fecha_vencimiento: ''
  })

  // Get filtered tasks
  const getFilteredTasks = () => {
    const today = new Date().toISOString().split('T')[0]
    
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = 
        task.tarea_descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id_sesion.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      // Status filter
      switch (filterStatus) {
        case 'mine':
          return task.responsable === user?.email
        case 'pending':
          return task.estado === 'Pendiente'
        case 'overdue':
          return task.estado !== 'Completado' && task.fecha_vencimiento < today
        default:
          return true
      }
    })
  }

  const filteredTasks = getFilteredTasks()

  // Calculate stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.estado === 'Pendiente').length,
    inProgress: tasks.filter(t => t.estado === 'En_Progreso').length,
    completed: tasks.filter(t => t.estado === 'Completado').length,
    overdue: tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0]
      return t.estado !== 'Completado' && t.fecha_vencimiento < today
    }).length,
    myTasks: tasks.filter(t => t.responsable === user?.email).length
  }

  const getStatusIcon = (estado: PlanAccion['estado']) => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className="w-4 h-4" />
      case 'En_Progreso':
        return <Play className="w-4 h-4" />
      case 'Completado':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusBadge = (estado: PlanAccion['estado']) => {
    switch (estado) {
      case 'Pendiente':
        return 'status-pending'
      case 'En_Progreso':
        return 'status-in-progress'
      case 'Completado':
        return 'status-completed'
      default:
        return 'status-pending'
    }
  }

  const isOverdue = (task: PlanAccion) => {
    const today = new Date().toISOString().split('T')[0]
    return task.estado !== 'Completado' && task.fecha_vencimiento < today
  }

  const handleCreateTask = () => {
    const task: PlanAccion = {
      id_tarea: `TASK${(tasks.length + 1).toString().padStart(3, '0')}`,
      ...newTask,
      fecha_creacion: new Date().toISOString().split('T')[0],
      estado: 'Pendiente'
    }
    
    setTasks([...tasks, task])
    setNewTask({
      id_sesion: '',
      tarea_descripcion: '',
      responsable: '',
      fecha_vencimiento: ''
    })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTaskStatus = (taskId: string, newStatus: PlanAccion['estado']) => {
    setTasks(tasks.map(task => 
      task.id_tarea === taskId ? { ...task, estado: newStatus } : task
    ))
  }

  const canManageTasks = user?.email // Any authenticated user can manage tasks

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Planes de Acción</h1>
            <p className="text-muted-foreground mt-2">
              Seguimiento de tareas y mejoras derivadas de sesiones de calibración
            </p>
          </div>
          
          {canManageTasks && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="nubank">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Tarea</DialogTitle>
                  <DialogDescription>
                    Agrega una tarea de seguimiento relacionada con una sesión de calibración
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sesion">Sesión Origen</Label>
                    <Select 
                      value={newTask.id_sesion} 
                      onValueChange={(value) => setNewTask({
                        ...newTask,
                        id_sesion: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la sesión" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSessions.map(session => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="descripcion">Descripción de la Tarea</Label>
                    <Textarea
                      id="descripcion"
                      value={newTask.tarea_descripcion}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        tarea_descripcion: e.target.value
                      })}
                      placeholder="Describe detalladamente qué se debe hacer"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="responsable">Responsable</Label>
                    <Input
                      id="responsable"
                      value={newTask.responsable}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        responsable: e.target.value
                      })}
                      placeholder="email@nubank.com.br"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vencimiento">Fecha de Vencimiento</Label>
                    <Input
                      id="vencimiento"
                      type="date"
                      value={newTask.fecha_vencimiento}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        fecha_vencimiento: e.target.value
                      })}
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
                    onClick={handleCreateTask}
                    disabled={!newTask.id_sesion || !newTask.tarea_descripcion || !newTask.responsable || !newTask.fecha_vencimiento}
                  >
                    Crear Tarea
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tareas, responsables o sesiones..."
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
              Mis Tareas
            </Button>
            <Button 
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              Pendientes
            </Button>
            <Button 
              variant={filterStatus === 'overdue' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('overdue')}
              size="sm"
            >
              Vencidas
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vencidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mis Tareas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.myTasks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id_tarea} className={`hover:shadow-md transition-shadow ${isOverdue(task) ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {task.tarea_descripcion}
                      </h3>
                      <Badge className={getStatusBadge(task.estado)}>
                        {getStatusIcon(task.estado)}
                        <span className="ml-1">{task.estado.replace('_', ' ')}</span>
                      </Badge>
                      {isOverdue(task) && (
                        <Badge className="status-critical">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Vencida
                        </Badge>
                      )}
                      {task.responsable === user?.email && (
                        <Badge variant="secondary">
                          Mi Tarea
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <User className="w-4 h-4 mr-2" />
                        {task.responsable.split('@')[0]}
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Vence: {formatDate(task.fecha_vencimiento)}
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Sesión: {task.id_sesion}
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Creada: {formatDate(task.fecha_creacion)}
                      </div>
                    </div>
                  </div>
                  
                  {task.responsable === user?.email && task.estado !== 'Completado' && (
                    <div className="flex gap-2 ml-4">
                      {task.estado === 'Pendiente' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id_tarea, 'En_Progreso')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar
                        </Button>
                      )}
                      
                      {task.estado === 'En_Progreso' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id_tarea, 'Completado')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron tareas' : 'No hay tareas registradas'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Las tareas aparecerán aquí cuando se creen planes de acción después de las sesiones'
              }
            </p>
            {!searchTerm && canManageTasks && (
              <Button variant="nubank" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Tarea
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}