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
  
  // Use the correct Supabase callback URL
  const redirectUrl = 'https://bsyrobgaeadswftzzvay.supabase.co/auth/v1/callback'
  console.log("Redirect URL:", redirectUrl)
  
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

    // Log the URL that the user should be redirected to
    console.log("Auth URL to redirect to:", data?.url)
    
    return { data }
  } catch (e) {
    console.error("Exception during OAuth setup:", e)
    return { error: e instanceof Error ? e.message : 'Unknown error occurred' }
  }
}

export async function signInWithApple() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'https://bsyrobgaeadswftzzvay.supabase.co/auth/v1/callback',
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
  
  const redirectUrl = 'https://bsyrobgaeadswftzzvay.supabase.co/auth/v1/callback'
  
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
    
    console.log("Facebook auth URL to redirect to:", data?.url)
    return { data }
  } catch (e) {
    console.error("Exception during Facebook OAuth setup:", e)
    return { error: e instanceof Error ? e.message : 'Unknown error occurred' }
  }
} 