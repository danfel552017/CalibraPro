import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { initializeDatabase } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  return requireAdmin(async (req: NextRequest, res: NextResponse, session: any) => {
    try {
      await initializeDatabase()
      
      return NextResponse.json({ 
        message: 'Base de datos inicializada correctamente' 
      })
    } catch (error) {
      console.error('Error initializing database:', error)
      return NextResponse.json(
        { error: 'No se pudo inicializar la base de datos' },
        { status: 500 }
      )
    }
  })(request, NextResponse.next())
}