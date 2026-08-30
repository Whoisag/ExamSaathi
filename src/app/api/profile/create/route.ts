import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, email, fullName, targetExam, preferredExams } = body

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required profile fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Try to insert/upsert into profiles table
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id,
          email,
          full_name: fullName || email.split('@')[0],
          target_exam: targetExam || 'jee-main',
          preferred_exams: preferredExams || [targetExam || 'jee-main'],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (error) {
      // Table might not exist yet before Phase 2 schema migration
      console.warn('Profile upsert notice:', error.message)
      return NextResponse.json({ success: true, warning: error.message })
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (err: any) {
    console.error('Profile creation error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to create profile' },
      { status: 500 }
    )
  }
}
