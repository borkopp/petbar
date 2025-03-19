'use server'

import { createClient } from '@/lib/supabase/server'

type PasswordResetResult = {
  success: boolean;
  error?: string;
};

export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/update`,
    })
    
    if (error) {
      console.error('Error requesting password reset:', error)
      return {
        success: false,
        error: error.message
      }
    }
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error during password reset request:', error)
    return {
      success: false,
      error: 'Се случи неочекувана грешка'
    }
  }
}

export async function updatePassword(password: string): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.updateUser({
      password: password,
    })
    
    if (error) {
      console.error('Error updating password:', error)
      return {
        success: false,
        error: error.message
      }
    }
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error during password update:', error)
    return {
      success: false,
      error: 'Се случи неочекувана грешка'
    }
  }
} 