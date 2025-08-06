import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, requireAdmin } from '@/lib/auth'
import { ScorecardService } from '@/lib/services/scorecard-service'
import { initializeDatabase } from '@/lib/google-sheets'

export async function GET() {
  try {
    // Initialize database if needed
    await initializeDatabase()
    
    const scorecards = await ScorecardService.getAllScorecards()
    return NextResponse.json(scorecards)
  } catch (error) {
    console.error('Error fetching scorecards:', error)
    return NextResponse.json(
      { error: 'No se pudieron obtener los scorecards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return requireAdmin(async (req: NextRequest, res: NextResponse, session: any) => {
    try {
      const data = await request.json()
      
      const newScorecard = await ScorecardService.createScorecard(data)
      return NextResponse.json(newScorecard, { status: 201 })
    } catch (error) {
      console.error('Error creating scorecard:', error)
      return NextResponse.json(
        { error: 'No se pudo crear el scorecard' },
        { status: 500 }
      )
    }
  })(request, NextResponse.next())
}