'use server'

import { createClient } from '@/lib/supabase/server'

type ResendVerificationResult = {
  success: boolean;
  error?: string;
};

export async function resendVerificationEmail(email: string): Promise<ResendVerificationResult> {
  try {
    const supabase = await createClient()
    
    // Get the current session, if any
    const { data: { session } } = await supabase.auth.getSession()
    
    // If there's no session or the email doesn't match, use the provided email
    const targetEmail = session?.user?.email || email
    
    if (!targetEmail) {
      return {
        success: false,
        error: 'Нема валидна е-пошта за испраќање на потврда'
      }
    }
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: targetEmail,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    
    if (error) {
      console.error('Error resending verification email:', error)
      return {
        success: false,
        error: error.message
      }
    }
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error resending verification email:', error)
    return {
      success: false,
      error: 'Се случи неочекувана грешка'
    }
  }
} 