import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, requireAuth } from '@/lib/auth'
import { CalibrationService } from '@/lib/services/calibration-service'
import { initializeDatabase } from '@/lib/google-sheets'

export async function GET() {
  return requireAuth(async (req: NextRequest, res: NextResponse, session: any) => {
    try {
      await initializeDatabase()
      
      const sessions = await CalibrationService.getAllSessions()
      return NextResponse.json(sessions)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json(
        { error: 'No se pudieron obtener las sesiones' },
        { status: 500 }
      )
    }
  })(NextRequest.prototype, NextResponse.next())
}

export async function POST(request: NextRequest) {
  return requireAuth(async (req: NextRequest, res: NextResponse, session: any) => {
    try {
      const data = await request.json()
      const userEmail = session.user.email
      
      const newSession = await CalibrationService.createSession(data, userEmail)
      return NextResponse.json(newSession, { status: 201 })
    } catch (error) {
      console.error('Error creating session:', error)
      return NextResponse.json(
        { error: 'No se pudo crear la sesión' },
        { status: 500 }
      )
    }
  })(request, NextResponse.next())
}