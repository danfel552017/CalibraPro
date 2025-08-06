// Tipos para la base de datos de CalibraPro
// Corresponden a las pestañas de Google Sheets

export interface Scorecard {
  id_scorecard: string;
  nombre_scorecard: string;
  descripcion: string;
  fecha_creacion: string;
  estado: 'Activo' | 'Inactivo';
}

export interface Pregunta {
  id_pregunta: string;
  id_scorecard: string; // FK a Scorecard
  seccion: string;
  texto_pregunta: string;
  guia_aplicacion?: string;
  tipo_error: 'Crítico' | 'No Crítico';
  estado: 'Activo' | 'Inactivo';
}

export interface SesionCalibracion {
  id_sesion: string;
  fecha: string;
  lider_sesion: string;
  id_scorecard_usado: string; // FK a Scorecard
  id_interaccion_evaluada: string;
  participantes: string; // JSON array de emails
  kappa_score?: number;
  estado: 'Configurada' | 'En_Progreso' | 'Finalizada';
}

export interface ResultadoDetallado {
  id_resultado: string;
  id_sesion: string; // FK a SesionCalibracion
  email_analista: string;
  id_pregunta: string; // FK a Pregunta
  calificacion: 0 | 1; // Binario: 0 = No cumple, 1 = Cumple
  timestamp: string;
}

export interface PlanAccion {
  id_tarea: string;
  id_sesion: string; // FK a SesionCalibracion
  tarea_descripcion: string;
  responsable: string;
  fecha_creacion: string;
  fecha_vencimiento: string;
  estado: 'Pendiente' | 'En_Progreso' | 'Completado';
}

// Tipos para la aplicación
export interface User {
  email: string;
  name: string;
  image?: string;
  role: 'Admin' | 'Analista' | 'Lider';
}

export interface KappaResult {
  kappa: number;
  interpretation: string;
  agreement_matrix: number[][];
  observed_agreement: number;
  expected_agreement: number;
}

export interface CalibrationSession {
  session: SesionCalibracion;
  scorecard: Scorecard;
  questions: Pregunta[];
  results: ResultadoDetallado[];
  participants: string[];
  kappa_result?: KappaResult;
}

export interface AnalysisResult {
  session_id: string;
  kappa_score: number;
  interpretation: string;
  discrepancies: {
    question_id: string;
    question_text: string;
    evaluator_scores: { [email: string]: number };
    agreement_rate: number;
  }[];
}

// Tipos para formularios
export interface ScorecardFormData {
  nombre_scorecard: string;
  descripcion: string;
}

export interface PreguntaFormData {
  seccion: string;
  texto_pregunta: string;
  guia_aplicacion?: string;
  tipo_error: 'Crítico' | 'No Crítico';
}

export interface SessionFormData {
  id_scorecard_usado: string;
  id_interaccion_evaluada: string;
  participantes: string[];
}

export interface TaskFormData {
  tarea_descripcion: string;
  responsable: string;
  fecha_vencimiento: string;
}

// Constantes para la base de datos
export const SHEET_NAMES = {
  SCORECARDS: 'Scorecards_Maestros',
  PREGUNTAS: 'Banco_Preguntas', 
  SESIONES: 'Sesiones_Calibracion',
  RESULTADOS: 'Resultados_Detallados',
  PLANES: 'Planes_Accion'
} as const;

// Configuración de columnas para cada pestaña
export const SHEET_HEADERS = {
  [SHEET_NAMES.SCORECARDS]: [
    'ID_Scorecard',
    'Nombre_Scorecard', 
    'Descripcion',
    'Fecha_Creacion',
    'Estado'
  ],
  [SHEET_NAMES.PREGUNTAS]: [
    'ID_Pregunta',
    'ID_Scorecard',
    'Seccion',
    'Texto_Pregunta',
    'Guia_Aplicacion',
    'Tipo_Error',
    'Estado'
  ],
  [SHEET_NAMES.SESIONES]: [
    'ID_Sesion',
    'Fecha',
    'Lider_Sesion',
    'ID_Scorecard_Usado',
    'ID_Interaccion_Evaluada',
    'Participantes',
    'Kappa_Score',
    'Estado'
  ],
  [SHEET_NAMES.RESULTADOS]: [
    'ID_Resultado',
    'ID_Sesion',
    'Email_Analista',
    'ID_Pregunta',
    'Calificacion',
    'Timestamp'
  ],
  [SHEET_NAMES.PLANES]: [
    'ID_Tarea',
    'ID_Sesion',
    'Tarea_Descripcion',
    'Responsable',
    'Fecha_Creacion',
    'Fecha_Vencimiento',
    'Estado'
  ]
} as const;