import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const isSignUpConfirmation = type === 'signup'

  
  if (code) {
    try {
      const supabase = await createClient()
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        // Still redirect to origin, but could add an error parameter
        return NextResponse.redirect(`${requestUrl.origin}?auth_error=${encodeURIComponent(error.message)}`)
      }
      
      
      // For email confirmations, redirect to the verified page
      if (isSignUpConfirmation || (data.user && data.user.email_confirmed_at)) {
        return NextResponse.redirect(`${requestUrl.origin}/auth/verified`)
      }
    } catch (e) {
      console.error("Exception in auth callback:", e)
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=unexpected_error`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
} 