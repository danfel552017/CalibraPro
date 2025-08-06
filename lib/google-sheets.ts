import { google } from 'googleapis';
import { SHEET_NAMES, SHEET_HEADERS } from '@/types';

// Configuración de autenticación para Google Sheets
export function getGoogleSheetsAuth() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

// Cliente de Google Sheets
export async function getSheetsClient() {
  const auth = getGoogleSheetsAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Obtener el ID de la hoja de cálculo
export function getSpreadsheetId(): string {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) {
    throw new Error('GOOGLE_SHEETS_ID no está configurado');
  }
  return sheetId;
}

// Función para inicializar las pestañas de la base de datos
export async function initializeDatabase() {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Verificar si las pestañas existen
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheets = spreadsheet.data.sheets?.map(sheet => sheet.properties?.title) || [];
    
    // Crear pestañas faltantes
    const requests = [];
    
    for (const sheetName of Object.values(SHEET_NAMES)) {
      if (!existingSheets.includes(sheetName)) {
        requests.push({
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        });
      }
    }

    // Crear pestañas si no existen
    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests,
        },
      });
    }

    // Agregar headers a cada pestaña si están vacías
    for (const [sheetName, headers] of Object.entries(SHEET_HEADERS)) {
      try {
        // Verificar si la pestaña tiene datos
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A1:Z1`,
        });

        // Si no hay datos, agregar headers
        if (!response.data.values || response.data.values.length === 0) {
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [[...headers]],
            },
          });
        }
      } catch (error) {
        console.error(`Error inicializando ${sheetName}:`, error);
      }
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
}

// Función genérica para leer datos de una pestaña
export async function readSheetData(sheetName: string, range?: string): Promise<any[][]> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    
    const fullRange = range ? `${sheetName}!${range}` : `${sheetName}!A:Z`;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`Error leyendo datos de ${sheetName}:`, error);
    throw error;
  }
}

// Función genérica para escribir datos a una pestaña
export async function writeSheetData(
  sheetName: string, 
  data: any[][], 
  range?: string
): Promise<void> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    
    const fullRange = range ? `${sheetName}!${range}` : `${sheetName}!A1`;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: fullRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: data,
      },
    });
  } catch (error) {
    console.error(`Error escribiendo datos a ${sheetName}:`, error);
    throw error;
  }
}

// Función para agregar una fila a una pestaña
export async function appendSheetData(sheetName: string, data: any[]): Promise<void> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [data],
      },
    });
  } catch (error) {
    console.error(`Error agregando datos a ${sheetName}:`, error);
    throw error;
  }
}

// Función para actualizar una fila específica
export async function updateSheetRow(
  sheetName: string, 
  rowIndex: number, 
  data: any[]
): Promise<void> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    
    const range = `${sheetName}!A${rowIndex + 1}:Z${rowIndex + 1}`;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [data],
      },
    });
  } catch (error) {
    console.error(`Error actualizando fila en ${sheetName}:`, error);
    throw error;
  }
}

// Función para generar IDs únicos
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
}

// Función para convertir datos de hoja a objetos
export function rowsToObjects<T>(rows: any[][], headers: readonly string[]): T[] {
  if (!rows || rows.length === 0) return [];
  
  // Usar headers predefinidos o la primera fila como headers
  const headerRow = [...headers];
  const dataRows = rows.slice(1); // Omitir la primera fila (headers)
  
  return dataRows.map(row => {
    const obj: any = {};
    headerRow.forEach((header, index) => {
      // Convertir headers de formato CSV a formato de objeto
      const key = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
      obj[key] = row[index] || '';
    });
    return obj as T;
  });
}

// Función para convertir objetos a filas
export function objectsToRows<T extends Record<string, any>>(
  objects: T[], 
  headers: readonly string[]
): any[][] {
  if (!objects || objects.length === 0) return [];
  
  return objects.map(obj => {
    return [...headers].map(header => {
      const key = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return obj[key] || '';
    });
  });
}