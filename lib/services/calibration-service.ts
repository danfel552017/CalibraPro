import {
  SesionCalibracion,
  ResultadoDetallado,
  SessionFormData,
  CalibrationSession,
  AnalysisResult,
  SHEET_NAMES,
  SHEET_HEADERS,
  Pregunta
} from '@/types';
import {
  readSheetData,
  appendSheetData,
  updateSheetRow,
  generateId,
  rowsToObjects,
  objectsToRows
} from '@/lib/google-sheets';
import {
  calculateKappa,
  calculateDiscrepancies,
  validateResultsForKappa,
  calculateCOPCScore
} from '@/lib/kappa-calculator';
import { ScorecardService } from './scorecard-service';

// Verificar si estamos en modo demo
const isDemoMode = process.env.DEMO_MODE === 'true';

// Datos mock para demo
const MOCK_SESSIONS: SesionCalibracion[] = [
  {
    id_sesion: 'SES001',
    fecha: '2024-12-14',
    lider_sesion: 'demo@nubank.com.br',
    id_scorecard_usado: 'SC001',
    id_interaccion_evaluada: 'INT-20241214-001',
    participantes: 'ana.silva@nubank.com.br,carlos.santos@nubank.com.br,maria.lopez@nubank.com.br',
    kappa_score: 0.75,
    estado: 'Finalizada'
  },
  {
    id_sesion: 'SES002',
    fecha: '2024-12-10',
    lider_sesion: 'demo@nubank.com.br',
    id_scorecard_usado: 'SC001',
    id_interaccion_evaluada: 'INT-20241210-001',
    participantes: 'ana.silva@nubank.com.br,carlos.santos@nubank.com.br',
    kappa_score: 0.82,
    estado: 'Finalizada'
  }
];

const MOCK_RESULTS: ResultadoDetallado[] = [
  // Resultados de SES001
  {
    id_resultado: 'R001',
    id_sesion: 'SES001',
    email_analista: 'ana.silva@nubank.com.br',
    id_pregunta: 'P001',
    calificacion: 1,
    timestamp: '2024-12-14T09:30:00Z'
  },
  {
    id_resultado: 'R002',
    id_sesion: 'SES001',
    email_analista: 'carlos.santos@nubank.com.br',
    id_pregunta: 'P001',
    calificacion: 1,
    timestamp: '2024-12-14T09:32:00Z'
  },
  {
    id_resultado: 'R003',
    id_sesion: 'SES001',
    email_analista: 'maria.lopez@nubank.com.br',
    id_pregunta: 'P001',
    calificacion: 0,
    timestamp: '2024-12-14T09:35:00Z'
  },
  {
    id_resultado: 'R004',
    id_sesion: 'SES001',
    email_analista: 'ana.silva@nubank.com.br',
    id_pregunta: 'P002',
    calificacion: 1,
    timestamp: '2024-12-14T09:30:00Z'
  },
  {
    id_resultado: 'R005',
    id_sesion: 'SES001',
    email_analista: 'carlos.santos@nubank.com.br',
    id_pregunta: 'P002',
    calificacion: 1,
    timestamp: '2024-12-14T09:32:00Z'
  },
  {
    id_resultado: 'R006',
    id_sesion: 'SES001',
    email_analista: 'maria.lopez@nubank.com.br',
    id_pregunta: 'P002',
    calificacion: 1,
    timestamp: '2024-12-14T09:35:00Z'
  }
];

export class CalibrationService {
  // Crear nueva sesión de calibración
  static async createSession(data: SessionFormData, leaderEmail: string): Promise<SesionCalibracion> {
    try {
      // Validar scorecard antes de crear sesión
      const validation = await ScorecardService.validateScorecardForSession(data.id_scorecard_usado);
      if (!validation.valid) {
        throw new Error(`Scorecard inválido: ${validation.issues.join(', ')}`);
      }

      const newSession: SesionCalibracion = {
        id_sesion: generateId('SES'),
        fecha: new Date().toISOString().split('T')[0],
        lider_sesion: leaderEmail,
        id_scorecard_usado: data.id_scorecard_usado,
        id_interaccion_evaluada: data.id_interaccion_evaluada,
        participantes: JSON.stringify(data.participantes),
        estado: 'Configurada',
      };

      const headers = SHEET_HEADERS[SHEET_NAMES.SESIONES];
      const row = objectsToRows([newSession], headers)[0];
      
      await appendSheetData(SHEET_NAMES.SESIONES, row);
      
      return newSession;
    } catch (error) {
      console.error('Error creando sesión:', error);
      throw new Error('No se pudo crear la sesión de calibración');
    }
  }

  // Obtener todas las sesiones
  static async getAllSessions(): Promise<SesionCalibracion[]> {
    if (isDemoMode) {
      // En modo demo, devolver datos mock
      return Promise.resolve(MOCK_SESSIONS);
    }
    
    try {
      const rows = await readSheetData(SHEET_NAMES.SESIONES);
      const headers = SHEET_HEADERS[SHEET_NAMES.SESIONES];
      return rowsToObjects<SesionCalibracion>(rows, headers);
    } catch (error) {
      console.error('Error obteniendo sesiones:', error);
      throw new Error('No se pudieron obtener las sesiones');
    }
  }

  // Obtener sesión por ID
  static async getSessionById(id: string): Promise<SesionCalibracion | null> {
    try {
      const sessions = await this.getAllSessions();
      return sessions.find(s => s.id_sesion === id) || null;
    } catch (error) {
      console.error('Error obteniendo sesión por ID:', error);
      throw new Error('No se pudo obtener la sesión');
    }
  }

  // Obtener sesión completa con scorecard y preguntas
  static async getCompleteSession(id: string): Promise<CalibrationSession | null> {
    try {
      const session = await this.getSessionById(id);
      if (!session) return null;

      const scorecard = await ScorecardService.getScorecardById(session.id_scorecard_usado);
      if (!scorecard) throw new Error('Scorecard no encontrado');

      const questions = await ScorecardService.getQuestionsByScorecard(session.id_scorecard_usado);
      const results = await this.getSessionResults(id);
      const participants = JSON.parse(session.participantes);

      // Calcular Kappa si la sesión está finalizada
      let kappa_result;
      if (session.estado === 'Finalizada' && results.length > 0) {
        try {
          kappa_result = calculateKappa(results);
        } catch (error) {
          console.warn('No se pudo calcular Kappa:', error);
        }
      }

      return {
        session,
        scorecard,
        questions,
        results,
        participants,
        kappa_result,
      };
    } catch (error) {
      console.error('Error obteniendo sesión completa:', error);
      throw new Error('No se pudo obtener la sesión completa');
    }
  }

  // Iniciar sesión (cambiar estado a En_Progreso)
  static async startSession(id: string): Promise<void> {
    try {
      await this.updateSessionStatus(id, 'En_Progreso');
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      throw new Error('No se pudo iniciar la sesión');
    }
  }

  // Finalizar sesión y calcular Kappa
  static async finalizeSession(id: string): Promise<AnalysisResult> {
    try {
      const session = await this.getSessionById(id);
      if (!session) throw new Error('Sesión no encontrada');

      const results = await this.getSessionResults(id);
      
      // Validar que todos los participantes hayan completado sus evaluaciones
      const participants = JSON.parse(session.participantes);
      const evaluators = Array.from(new Set(results.map(r => r.email_analista)));
      
      if (evaluators.length !== participants.length) {
        throw new Error('No todos los participantes han completado sus evaluaciones');
      }

      // Validar resultados para Kappa
      const validation = validateResultsForKappa(results);
      if (!validation.isValid) {
        throw new Error(`Resultados inválidos para Kappa: ${validation.issues.join(', ')}`);
      }

      // Calcular Kappa
      const kappaResult = calculateKappa(results);
      
      // Actualizar sesión con Kappa score
      await this.updateSession(id, {
        estado: 'Finalizada',
        kappa_score: kappaResult.kappa,
      });

      // Calcular discrepancias
      const discrepancies = calculateDiscrepancies(results);
      
      // Obtener texto de preguntas
      const questions = await ScorecardService.getQuestionsByScorecard(session.id_scorecard_usado);
      const enrichedDiscrepancies = discrepancies.map(disc => {
        const question = questions.find(q => q.id_pregunta === disc.question_id);
        return {
          ...disc,
          question_text: question?.texto_pregunta || 'Pregunta no encontrada',
        };
      });

      return {
        session_id: id,
        kappa_score: kappaResult.kappa,
        interpretation: kappaResult.interpretation,
        discrepancies: enrichedDiscrepancies,
      };
    } catch (error) {
      console.error('Error finalizando sesión:', error);
      throw new Error('No se pudo finalizar la sesión');
    }
  }

  // Enviar evaluación de un analista
  static async submitEvaluation(
    sessionId: string,
    analystEmail: string,
    evaluations: { questionId: string; score: 0 | 1 }[]
  ): Promise<void> {
    try {
      const session = await this.getSessionById(sessionId);
      if (!session) throw new Error('Sesión no encontrada');

      if (session.estado !== 'En_Progreso') {
        throw new Error('La sesión no está en progreso');
      }

      // Verificar que el analista esté en la lista de participantes
      const participants = JSON.parse(session.participantes);
      if (!participants.includes(analystEmail)) {
        throw new Error('El analista no está autorizado para esta sesión');
      }

      // Verificar si ya existe una evaluación de este analista
      const existingResults = await this.getSessionResults(sessionId);
      const hasExistingEvaluation = existingResults.some(r => r.email_analista === analystEmail);
      
      if (hasExistingEvaluation) {
        throw new Error('El analista ya ha enviado su evaluación');
      }

      // Crear resultados para cada evaluación
      const timestamp = new Date().toISOString();
      const headers = SHEET_HEADERS[SHEET_NAMES.RESULTADOS];

      for (const evaluation of evaluations) {
        const result: ResultadoDetallado = {
          id_resultado: generateId('RES'),
          id_sesion: sessionId,
          email_analista: analystEmail,
          id_pregunta: evaluation.questionId,
          calificacion: evaluation.score,
          timestamp,
        };

        const row = objectsToRows([result], headers)[0];
        await appendSheetData(SHEET_NAMES.RESULTADOS, row);
      }

      // Verificar si todos los participantes han completado sus evaluaciones
      const updatedResults = await this.getSessionResults(sessionId);
      const evaluators = Array.from(new Set(updatedResults.map(r => r.email_analista)));
      
      if (evaluators.length === participants.length) {
        // Todos completaron, cambiar estado de sesión
        await this.updateSessionStatus(sessionId, 'Finalizada');
      }
    } catch (error) {
      console.error('Error enviando evaluación:', error);
      throw new Error('No se pudo enviar la evaluación');
    }
  }

  // Obtener resultados de una sesión
  static async getSessionResults(sessionId: string): Promise<ResultadoDetallado[]> {
    if (isDemoMode) {
      // En modo demo, devolver datos mock filtrados
      return Promise.resolve(MOCK_RESULTS.filter(r => r.id_sesion === sessionId));
    }
    
    try {
      const rows = await readSheetData(SHEET_NAMES.RESULTADOS);
      const headers = SHEET_HEADERS[SHEET_NAMES.RESULTADOS];
      const allResults = rowsToObjects<ResultadoDetallado>(rows, headers);
      
      return allResults.filter(r => r.id_sesion === sessionId);
    } catch (error) {
      console.error('Error obteniendo resultados de sesión:', error);
      throw new Error('No se pudieron obtener los resultados');
    }
  }

  // Verificar si un analista ya evaluó una sesión
  static async hasAnalystEvaluated(sessionId: string, analystEmail: string): Promise<boolean> {
    try {
      const results = await this.getSessionResults(sessionId);
      return results.some(r => r.email_analista === analystEmail);
    } catch (error) {
      console.error('Error verificando evaluación:', error);
      return false;
    }
  }

  // Obtener score COPC de un evaluador en una sesión
  static async getCOPCScore(sessionId: string, analystEmail: string): Promise<number> {
    try {
      const session = await this.getSessionById(sessionId);
      if (!session) throw new Error('Sesión no encontrada');

      const results = await this.getSessionResults(sessionId);
      const analystResults = results.filter(r => r.email_analista === analystEmail);
      
      if (analystResults.length === 0) {
        throw new Error('No hay resultados para este analista');
      }

      const questions = await ScorecardService.getQuestionsByScorecard(session.id_scorecard_usado);
      
      return calculateCOPCScore(analystResults, questions);
    } catch (error) {
      console.error('Error calculando score COPC:', error);
      throw new Error('No se pudo calcular el score COPC');
    }
  }

  // Obtener sesiones por participante
  static async getSessionsByParticipant(email: string): Promise<SesionCalibracion[]> {
    try {
      const sessions = await this.getAllSessions();
      
      return sessions.filter(session => {
        const participants = JSON.parse(session.participantes);
        return participants.includes(email) || session.lider_sesion === email;
      });
    } catch (error) {
      console.error('Error obteniendo sesiones por participante:', error);
      throw new Error('No se pudieron obtener las sesiones');
    }
  }

  // Actualizar estado de sesión
  private static async updateSessionStatus(id: string, status: SesionCalibracion['estado']): Promise<void> {
    await this.updateSession(id, { estado: status });
  }

  // Actualizar sesión
  private static async updateSession(id: string, data: Partial<SesionCalibracion>): Promise<void> {
    try {
      const rows = await readSheetData(SHEET_NAMES.SESIONES);
      const headers = SHEET_HEADERS[SHEET_NAMES.SESIONES];
      const sessions = rowsToObjects<SesionCalibracion>(rows, headers);
      
      const sessionIndex = sessions.findIndex(s => s.id_sesion === id);
      if (sessionIndex === -1) {
        throw new Error('Sesión no encontrada');
      }

      const updatedSession = {
        ...sessions[sessionIndex],
        ...data,
      };

      const updatedRow = objectsToRows([updatedSession], headers)[0];
      await updateSheetRow(SHEET_NAMES.SESIONES, sessionIndex + 1, updatedRow);
    } catch (error) {
      console.error('Error actualizando sesión:', error);
      throw new Error('No se pudo actualizar la sesión');
    }
  }
}