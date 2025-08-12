import { 
  Scorecard, 
  Pregunta, 
  ScorecardFormData, 
  PreguntaFormData,
  SHEET_NAMES,
  SHEET_HEADERS
} from '@/types';
import { 
  readSheetData, 
  appendSheetData, 
  generateId, 
  rowsToObjects, 
  objectsToRows 
} from '@/lib/google-sheets';

// Configuración de producción

export class ScorecardService {
  // Obtener todos los scorecards
  static async getAllScorecards(): Promise<Scorecard[]> {
    try {
      const rows = await readSheetData(SHEET_NAMES.SCORECARDS);
      const headers = SHEET_HEADERS[SHEET_NAMES.SCORECARDS];
      return rowsToObjects<Scorecard>(rows, headers);
    } catch (error) {
      console.error('Error obteniendo scorecards:', error);
      throw new Error('No se pudieron obtener los scorecards');
    }
  }

  // Obtener scorecard por ID
  static async getScorecardById(id: string): Promise<Scorecard | null> {
    try {
      const scorecards = await this.getAllScorecards();
      return scorecards.find(s => s.id_scorecard === id) || null;
    } catch (error) {
      console.error('Error obteniendo scorecard:', error);
      return null;
    }
  }

  // Crear nuevo scorecard
  static async createScorecard(data: ScorecardFormData): Promise<Scorecard> {
    try {
      const newScorecard: Scorecard = {
        id_scorecard: generateId('SC'),
        nombre_scorecard: data.nombre_scorecard,
        descripcion: data.descripcion,
        fecha_creacion: new Date().toISOString().split('T')[0],
        estado: 'Activo',
      };

      const headers = SHEET_HEADERS[SHEET_NAMES.SCORECARDS];
      const row = objectsToRows([newScorecard], headers)[0];
      
      await appendSheetData(SHEET_NAMES.SCORECARDS, row);
      
      return newScorecard;
    } catch (error) {
      console.error('Error creando scorecard:', error);
      throw new Error('No se pudo crear el scorecard');
    }
  }

  // Actualizar scorecard
  static async updateScorecard(id: string, data: Partial<ScorecardFormData>): Promise<Scorecard> {
    try {
      const scorecard = await this.getScorecardById(id);
      if (!scorecard) {
        throw new Error('Scorecard no encontrado');
      }

      const updatedScorecard: Scorecard = {
        ...scorecard,
        ...data,
      };

      // TODO: Implementar updateSheetData en google-sheets.ts para actualizaciones
      console.log('Actualización de scorecard pendiente de implementar:', updatedScorecard);
      
      return updatedScorecard;
    } catch (error) {
      console.error('Error actualizando scorecard:', error);
      throw new Error('No se pudo actualizar el scorecard');
    }
  }

  // Desactivar scorecard
  static async deactivateScorecard(id: string): Promise<void> {
    try {
      await this.updateScorecard(id, { estado: 'Inactivo' } as any);
    } catch (error) {
      console.error('Error desactivando scorecard:', error);
      throw new Error('No se pudo desactivar el scorecard');
    }
  }

  // Obtener preguntas de un scorecard
  static async getScorecardQuestions(scorecardId: string): Promise<Pregunta[]> {
    try {
      const rows = await readSheetData(SHEET_NAMES.PREGUNTAS);
      const headers = SHEET_HEADERS[SHEET_NAMES.PREGUNTAS];
      const allQuestions = rowsToObjects<Pregunta>(rows, headers);
      
      return allQuestions.filter(q => q.id_scorecard === scorecardId && q.estado === 'Activo');
    } catch (error) {
      console.error('Error obteniendo preguntas:', error);
      throw new Error('No se pudieron obtener las preguntas');
    }
  }

  // Agregar pregunta a scorecard
  static async addQuestion(scorecardId: string, data: PreguntaFormData): Promise<Pregunta> {
    try {
      // Verificar que el scorecard existe
      const scorecard = await this.getScorecardById(scorecardId);
      if (!scorecard) {
        throw new Error('Scorecard no encontrado');
      }

      const newQuestion: Pregunta = {
        id_pregunta: generateId('P'),
        id_scorecard: scorecardId,
        seccion: data.seccion,
        texto_pregunta: data.texto_pregunta,
        guia_aplicacion: data.guia_aplicacion,
        tipo_error: data.tipo_error,
        estado: 'Activo',
      };

      const headers = SHEET_HEADERS[SHEET_NAMES.PREGUNTAS];
      const row = objectsToRows([newQuestion], headers)[0];
      
      await appendSheetData(SHEET_NAMES.PREGUNTAS, row);
      
      return newQuestion;
    } catch (error) {
      console.error('Error agregando pregunta:', error);
      throw new Error('No se pudo agregar la pregunta');
    }
  }

  // Actualizar pregunta
  static async updateQuestion(id: string, data: Partial<PreguntaFormData>): Promise<Pregunta> {
    try {
      const rows = await readSheetData(SHEET_NAMES.PREGUNTAS);
      const headers = SHEET_HEADERS[SHEET_NAMES.PREGUNTAS];
      const questions = rowsToObjects<Pregunta>(rows, headers);
      
      const question = questions.find(q => q.id_pregunta === id);
      if (!question) {
        throw new Error('Pregunta no encontrada');
      }

      const updatedQuestion: Pregunta = {
        ...question,
        ...data,
      };

      // TODO: Implementar updateSheetData en google-sheets.ts para actualizaciones
      console.log('Actualización de pregunta pendiente de implementar:', updatedQuestion);
      
      return updatedQuestion;
    } catch (error) {
      console.error('Error actualizando pregunta:', error);
      throw new Error('No se pudo actualizar la pregunta');
    }
  }

  // Validar scorecard para uso en sesión
  static async validateScorecardForSession(scorecardId: string): Promise<{
    isValid: boolean;
    issues: string[];
  }> {
    try {
      const scorecard = await this.getScorecardById(scorecardId);
      if (!scorecard) {
        return {
          isValid: false,
          issues: ['Scorecard no encontrado']
        };
      }

      if (scorecard.estado !== 'Activo') {
        return {
          isValid: false,
          issues: ['Scorecard no está activo']
        };
      }

      const questions = await this.getScorecardQuestions(scorecardId);
      if (questions.length === 0) {
        return {
          isValid: false,
          issues: ['El scorecard no tiene preguntas activas']
        };
      }

      return {
        isValid: true,
        issues: []
      };
    } catch (error) {
      console.error('Error validando scorecard:', error);
      return {
        isValid: false,
        issues: ['Error al validar scorecard']
      };
    }
  }

  // Obtener estadísticas del scorecard
  static async getScorecardStats(scorecardId: string): Promise<{
    totalQuestions: number;
    criticalQuestions: number;
    nonCriticalQuestions: number;
    activeSessions: number;
  }> {
    try {
      const questions = await this.getScorecardQuestions(scorecardId);
      
      return {
        totalQuestions: questions.length,
        criticalQuestions: questions.filter(q => q.tipo_error === 'Crítico').length,
        nonCriticalQuestions: questions.filter(q => q.tipo_error === 'No Crítico').length,
        activeSessions: 0 // TODO: implementar cuando tengamos CalibrationService
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }
}