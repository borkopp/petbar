'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

type State = {
  error: string | null;
  redirectTo?: string;
}

export async function login(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const redirectTo = formData.get('redirectTo') as string

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect(redirectTo || '/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // Use your domain for the callback URL
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile',
      },
    })

    if (error) {
      console.error("Supabase OAuth error:", error)
      return { error: error.message }
    }

    
    return { data }
  } catch (e) {
    console.error("Exception during OAuth setup:", e)
    return { error: e instanceof Error ? e.message : 'Unknown error occurred' }
  }
}

export async function signInWithApple() {
  const supabase = await createClient()

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: redirectUrl,
      scopes: 'name email',
      queryParams: {
        response_mode: 'form_post'
      }
    },
  })

  if (error) {
    console.error("Apple sign-in error:", error)
    return { error: error.message }
  }

  return { data }
}

export async function signInWithFacebook() {
  const supabase = await createClient()
  
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl,
        scopes: 'email,public_profile',
      },
    })

    if (error) {
      console.error("Facebook sign-in error:", error)
      return { error: error.message }
    }
    
    return { data }
  } catch (e) {
    console.error("Exception during Facebook OAuth setup:", e)
    return { error: e instanceof Error ? e.message : 'Unknown error occurred' }
  }
} 