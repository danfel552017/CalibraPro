import {
  PlanAccion,
  TaskFormData,
  SHEET_NAMES,
  SHEET_HEADERS
} from '@/types';
import {
  readSheetData,
  appendSheetData,
  updateSheetRow,
  generateId,
  rowsToObjects,
  objectsToRows
} from '@/lib/google-sheets';

export class ActionPlanService {
  // Crear nueva tarea
  static async createTask(sessionId: string, data: TaskFormData, creatorEmail: string): Promise<PlanAccion> {
    try {
      const newTask: PlanAccion = {
        id_tarea: generateId('TASK'),
        id_sesion: sessionId,
        tarea_descripcion: data.tarea_descripcion,
        responsable: data.responsable,
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_vencimiento: data.fecha_vencimiento,
        estado: 'Pendiente',
      };

      const headers = SHEET_HEADERS[SHEET_NAMES.PLANES];
      const row = objectsToRows([newTask], headers)[0];
      
      await appendSheetData(SHEET_NAMES.PLANES, row);
      
      return newTask;
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw new Error('No se pudo crear la tarea');
    }
  }

  // Obtener todas las tareas
  static async getAllTasks(): Promise<PlanAccion[]> {
    try {
      const rows = await readSheetData(SHEET_NAMES.PLANES);
      const headers = SHEET_HEADERS[SHEET_NAMES.PLANES];
      return rowsToObjects<PlanAccion>(rows, headers);
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      throw new Error('No se pudieron obtener las tareas');
    }
  }

  // Obtener tareas por sesión
  static async getTasksBySession(sessionId: string): Promise<PlanAccion[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.id_sesion === sessionId);
    } catch (error) {
      console.error('Error obteniendo tareas por sesión:', error);
      throw new Error('No se pudieron obtener las tareas de la sesión');
    }
  }

  // Obtener tareas por responsable
  static async getTasksByResponsible(email: string): Promise<PlanAccion[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.responsable === email);
    } catch (error) {
      console.error('Error obteniendo tareas por responsable:', error);
      throw new Error('No se pudieron obtener las tareas del responsable');
    }
  }

  // Obtener tarea por ID
  static async getTaskById(id: string): Promise<PlanAccion | null> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.find(task => task.id_tarea === id) || null;
    } catch (error) {
      console.error('Error obteniendo tarea por ID:', error);
      throw new Error('No se pudo obtener la tarea');
    }
  }

  // Actualizar estado de tarea
  static async updateTaskStatus(id: string, status: PlanAccion['estado']): Promise<PlanAccion> {
    try {
      return await this.updateTask(id, { estado: status });
    } catch (error) {
      console.error('Error actualizando estado de tarea:', error);
      throw new Error('No se pudo actualizar el estado de la tarea');
    }
  }

  // Actualizar tarea completa
  static async updateTask(id: string, data: Partial<TaskFormData & { estado?: PlanAccion['estado'] }>): Promise<PlanAccion> {
    try {
      const rows = await readSheetData(SHEET_NAMES.PLANES);
      const headers = SHEET_HEADERS[SHEET_NAMES.PLANES];
      const tasks = rowsToObjects<PlanAccion>(rows, headers);
      
      const taskIndex = tasks.findIndex(task => task.id_tarea === id);
      if (taskIndex === -1) {
        throw new Error('Tarea no encontrada');
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...data,
      };

      const updatedRow = objectsToRows([updatedTask], headers)[0];
      await updateSheetRow(SHEET_NAMES.PLANES, taskIndex + 1, updatedRow);
      
      return updatedTask;
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw new Error('No se pudo actualizar la tarea');
    }
  }

  // Eliminar tarea (lógicamente)
  static async deleteTask(id: string): Promise<void> {
    try {
      // En lugar de eliminar físicamente, podríamos cambiar a un estado "Cancelado"
      // O implementar eliminación física si es necesario
      await this.updateTaskStatus(id, 'Completado'); // o crear estado "Cancelado"
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw new Error('No se pudo eliminar la tarea');
    }
  }

  // Obtener estadísticas de tareas para una sesión
  static async getTaskStatsBySession(sessionId: string): Promise<{
    total: number;
    pendientes: number;
    en_progreso: number;
    completadas: number;
    vencidas: number;
  }> {
    try {
      const tasks = await this.getTasksBySession(sessionId);
      const today = new Date().toISOString().split('T')[0];
      
      const stats = {
        total: tasks.length,
        pendientes: tasks.filter(t => t.estado === 'Pendiente').length,
        en_progreso: tasks.filter(t => t.estado === 'En_Progreso').length,
        completadas: tasks.filter(t => t.estado === 'Completado').length,
        vencidas: tasks.filter(t => 
          t.estado !== 'Completado' && 
          t.fecha_vencimiento < today
        ).length,
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas de tareas:', error);
      throw new Error('No se pudieron obtener las estadísticas de tareas');
    }
  }

  // Obtener tareas vencidas
  static async getOverdueTasks(): Promise<PlanAccion[]> {
    try {
      const tasks = await this.getAllTasks();
      const today = new Date().toISOString().split('T')[0];
      
      return tasks.filter(task => 
        task.estado !== 'Completado' && 
        task.fecha_vencimiento < today
      );
    } catch (error) {
      console.error('Error obteniendo tareas vencidas:', error);
      throw new Error('No se pudieron obtener las tareas vencidas');
    }
  }

  // Obtener resumen de tareas por responsable
  static async getTaskSummaryByResponsible(): Promise<{
    [email: string]: {
      total: number;
      pendientes: number;
      en_progreso: number;
      completadas: number;
      vencidas: number;
    }
  }> {
    try {
      const tasks = await this.getAllTasks();
      const today = new Date().toISOString().split('T')[0];
      const summary: { [email: string]: any } = {};

      tasks.forEach(task => {
        if (!summary[task.responsable]) {
          summary[task.responsable] = {
            total: 0,
            pendientes: 0,
            en_progreso: 0,
            completadas: 0,
            vencidas: 0,
          };
        }

        summary[task.responsable].total++;

        switch (task.estado) {
          case 'Pendiente':
            summary[task.responsable].pendientes++;
            break;
          case 'En_Progreso':
            summary[task.responsable].en_progreso++;
            break;
          case 'Completado':
            summary[task.responsable].completadas++;
            break;
        }

        if (task.estado !== 'Completado' && task.fecha_vencimiento < today) {
          summary[task.responsable].vencidas++;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error obteniendo resumen de tareas:', error);
      throw new Error('No se pudo obtener el resumen de tareas');
    }
  }

  // Marcar tarea como en progreso
  static async startTask(id: string): Promise<PlanAccion> {
    return await this.updateTaskStatus(id, 'En_Progreso');
  }

  // Marcar tarea como completada
  static async completeTask(id: string): Promise<PlanAccion> {
    return await this.updateTaskStatus(id, 'Completado');
  }

  // Validar fechas de vencimiento
  static validateDueDate(dueDate: string): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    
    // La fecha de vencimiento debe ser en el futuro
    return due >= today;
  }

  // Obtener próximas tareas a vencer (próximos 7 días)
  static async getUpcomingTasks(days: number = 7): Promise<PlanAccion[]> {
    try {
      const tasks = await this.getAllTasks();
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      const todayStr = today.toISOString().split('T')[0];
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      return tasks.filter(task => 
        task.estado !== 'Completado' && 
        task.fecha_vencimiento >= todayStr &&
        task.fecha_vencimiento <= futureDateStr
      );
    } catch (error) {
      console.error('Error obteniendo próximas tareas:', error);
      throw new Error('No se pudieron obtener las próximas tareas');
    }
  }
}