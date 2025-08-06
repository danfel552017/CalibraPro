import { KappaResult, ResultadoDetallado } from '@/types';

/**
 * Calcula el coeficiente Kappa de Cohen para una sesión de calibración
 * @param results - Array de resultados detallados de la sesión
 * @returns Objeto con el resultado del Kappa y métricas asociadas
 */
export function calculateKappa(results: ResultadoDetallado[]): KappaResult {
  if (!results || results.length === 0) {
    throw new Error('No hay resultados para calcular Kappa');
  }

  // Obtener evaluadores únicos
  const evaluators = Array.from(new Set(results.map(r => r.email_analista)));
  
  if (evaluators.length < 2) {
    throw new Error('Se necesitan al menos 2 evaluadores para calcular Kappa');
  }

  // Obtener preguntas únicas
  const questions = Array.from(new Set(results.map(r => r.id_pregunta)));

  // Crear matriz de acuerdos (2x2 para evaluaciones binarias)
  const agreementMatrix = [[0, 0], [0, 0]]; // [0,0][0,1][1,0][1,1]
  
  let totalComparisons = 0;
  let agreements = 0;

  // Para cada pregunta, comparar las evaluaciones de todos los pares de evaluadores
  questions.forEach(questionId => {
    const questionResults = results.filter(r => r.id_pregunta === questionId);
    
    // Si no todos los evaluadores respondieron esta pregunta, omitir
    if (questionResults.length !== evaluators.length) {
      return;
    }

    // Comparar todos los pares de evaluadores para esta pregunta
    for (let i = 0; i < evaluators.length; i++) {
      for (let j = i + 1; j < evaluators.length; j++) {
        const eval1 = questionResults.find(r => r.email_analista === evaluators[i]);
        const eval2 = questionResults.find(r => r.email_analista === evaluators[j]);

        if (eval1 && eval2) {
          const score1 = eval1.calificacion;
          const score2 = eval2.calificacion;

          // Actualizar matriz de acuerdos
          agreementMatrix[score1][score2]++;
          
          totalComparisons++;
          
          // Contar acuerdos
          if (score1 === score2) {
            agreements++;
          }
        }
      }
    }
  });

  if (totalComparisons === 0) {
    throw new Error('No hay comparaciones válidas para calcular Kappa');
  }

  // Calcular acuerdo observado
  const observedAgreement = agreements / totalComparisons;

  // Calcular acuerdo esperado por azar
  const total = agreementMatrix[0][0] + agreementMatrix[0][1] + agreementMatrix[1][0] + agreementMatrix[1][1];
  
  if (total === 0) {
    throw new Error('No hay datos suficientes para calcular Kappa');
  }

  // Probabilidades marginales
  const p1_pos = (agreementMatrix[1][0] + agreementMatrix[1][1]) / total; // P(evaluador 1 = 1)
  const p1_neg = (agreementMatrix[0][0] + agreementMatrix[0][1]) / total; // P(evaluador 1 = 0)
  const p2_pos = (agreementMatrix[0][1] + agreementMatrix[1][1]) / total; // P(evaluador 2 = 1)
  const p2_neg = (agreementMatrix[0][0] + agreementMatrix[1][0]) / total; // P(evaluador 2 = 0)

  // Acuerdo esperado
  const expectedAgreement = (p1_pos * p2_pos) + (p1_neg * p2_neg);

  // Coeficiente Kappa
  const kappa = expectedAgreement === 1 ? 1 : (observedAgreement - expectedAgreement) / (1 - expectedAgreement);

  // Interpretación del Kappa según escalas estándar
  const interpretation = interpretKappa(kappa);

  return {
    kappa: Math.round(kappa * 1000) / 1000, // Redondear a 3 decimales
    interpretation,
    agreement_matrix: agreementMatrix,
    observed_agreement: Math.round(observedAgreement * 1000) / 1000,
    expected_agreement: Math.round(expectedAgreement * 1000) / 1000,
  };
}

/**
 * Interpreta el valor de Kappa según la escala estándar
 * @param kappa - Valor del coeficiente Kappa
 * @returns Interpretación textual del nivel de acuerdo
 */
export function interpretKappa(kappa: number): string {
  if (kappa < 0) return 'Acuerdo Pobre (peor que el azar)';
  if (kappa >= 0 && kappa <= 0.20) return 'Acuerdo Ligero';
  if (kappa > 0.20 && kappa <= 0.40) return 'Acuerdo Justo';
  if (kappa > 0.40 && kappa <= 0.60) return 'Acuerdo Moderado';
  if (kappa > 0.60 && kappa <= 0.80) return 'Acuerdo Sustancial';
  if (kappa > 0.80) return 'Acuerdo Casi Perfecto';
  return 'Valor inválido';
}

/**
 * Calcula estadísticas de discrepancias por pregunta
 * @param results - Array de resultados detallados
 * @returns Array con análisis de discrepancias por pregunta
 */
export function calculateDiscrepancies(results: ResultadoDetallado[]) {
  const questions = Array.from(new Set(results.map(r => r.id_pregunta)));
  
  return questions.map(questionId => {
    const questionResults = results.filter(r => r.id_pregunta === questionId);
    
    // Agrupar scores por evaluador
    const evaluatorScores: { [email: string]: number } = {};
    questionResults.forEach(result => {
      evaluatorScores[result.email_analista] = result.calificacion;
    });

    // Calcular tasa de acuerdo para esta pregunta
    const scores = Object.values(evaluatorScores);
    const agreements = scores.filter(score => score === scores[0]).length;
    const agreementRate = scores.length > 0 ? agreements / scores.length : 0;

    return {
      question_id: questionId,
      question_text: '', // Se llenará con datos del scorecard
      evaluator_scores: evaluatorScores,
      agreement_rate: Math.round(agreementRate * 100) / 100,
    };
  }).sort((a, b) => a.agreement_rate - b.agreement_rate); // Ordenar por menor acuerdo primero
}

/**
 * Valida que los resultados sean consistentes para el cálculo de Kappa
 * @param results - Array de resultados detallados
 * @returns Objeto con información de validación
 */
export function validateResultsForKappa(results: ResultadoDetallado[]) {
  const evaluators = Array.from(new Set(results.map(r => r.email_analista)));
  const questions = Array.from(new Set(results.map(r => r.id_pregunta)));
  
  const issues = [];
  
  if (evaluators.length < 2) {
    issues.push('Se necesitan al menos 2 evaluadores');
  }
  
  if (questions.length === 0) {
    issues.push('No hay preguntas evaluadas');
  }

  // Verificar que todos los evaluadores hayan respondido todas las preguntas
  questions.forEach(questionId => {
    const questionResults = results.filter(r => r.id_pregunta === questionId);
    if (questionResults.length !== evaluators.length) {
      issues.push(`La pregunta ${questionId} no fue respondida por todos los evaluadores`);
    }
  });

  // Verificar que todas las calificaciones sean 0 o 1
  const invalidScores = results.filter(r => r.calificacion !== 0 && r.calificacion !== 1);
  if (invalidScores.length > 0) {
    issues.push('Algunas calificaciones no son binarias (0 o 1)');
  }

  return {
    isValid: issues.length === 0,
    issues,
    evaluatorCount: evaluators.length,
    questionCount: questions.length,
    totalResponses: results.length,
  };
}

/**
 * Aplica lógica de puntuación COPC con errores críticos
 * Cualquier pregunta crítica con calificación 0 anula la evaluación completa
 * @param results - Resultados del evaluador
 * @param preguntas - Preguntas del scorecard con tipos de error
 * @returns Score final del evaluador (0-100%)
 */
export function calculateCOPCScore(
  results: ResultadoDetallado[],
  preguntas: { id_pregunta: string; tipo_error: 'Crítico' | 'No Crítico' }[]
): number {
  if (!results || results.length === 0) return 0;

  // Verificar si hay algún error crítico (calificación 0 en pregunta crítica)
  const criticalErrors = results.filter(result => {
    const pregunta = preguntas.find(p => p.id_pregunta === result.id_pregunta);
    return pregunta?.tipo_error === 'Crítico' && result.calificacion === 0;
  });

  // Si hay errores críticos, la calificación es 0%
  if (criticalErrors.length > 0) {
    return 0;
  }

  // Si no hay errores críticos, calcular porcentaje normal
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.calificacion === 1).length;
  
  return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
}