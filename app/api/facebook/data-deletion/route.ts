import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper function to decode base64url
function base64UrlDecode(input: string): Buffer {
  // Replace URL-safe characters
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, 'base64');
}

// Parse and verify the signed request from Facebook
function parseSignedRequest(signedRequest: string, appSecret: string) {
  const [encodedSig, payload] = signedRequest.split('.');
  
  // Decode the signature and data
  const sig = base64UrlDecode(encodedSig);
  const data = JSON.parse(base64UrlDecode(payload).toString('utf-8'));
  
  // Calculate expected signature
  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest();
  
  // Verify signature
  if (!crypto.timingSafeEqual(sig, expectedSig)) {
    console.error('Bad Signed JSON signature!');
    return null;
  }
  
  return data;
}

// For Facebook's verification of the endpoint
export async function GET(request: NextRequest) {
  const confirmationCode = request.nextUrl.searchParams.get('confirmation_code');
  
  // Always return a successful response for verification
  return NextResponse.json({ 
    confirmation_code: confirmationCode || 'default_confirmation',
    success: true,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`
  });
}

// Handle the actual data deletion request from Facebook
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.formData();
    const signedRequest = body.get('signed_request') as string;
    
    if (!signedRequest) {
      console.error('Missing signed_request parameter');
      // Still return success to avoid Facebook retrying
      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
        confirmation_code: 'error_missing_signed_request'
      });
    }
    
    // Get the app secret from environment variables
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    
    if (!appSecret) {
      console.error('Facebook app secret not configured');
      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
        confirmation_code: 'error_missing_app_secret'
      });
    }
    
    // Parse and verify the signed request
    const data = parseSignedRequest(signedRequest, appSecret);
    
    if (!data) {
      console.error('Invalid signed request');
      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
        confirmation_code: 'error_invalid_signed_request'
      });
    }
    
    // Extract the user ID from the parsed data
    const userId = data.user_id;
    
    if (!userId) {
      console.error('Missing user_id in signed request');
      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
        confirmation_code: 'error_missing_user_id'
      });
    }
    
    console.log(`Received data deletion request for user ID: ${userId}`);
    
    // Generate a unique confirmation code
    const confirmationCode = `fb_${userId}_${Date.now()}`;
    
    // TODO: Implement actual data deletion logic here
    // Example:
    // const supabase = await createClient();
    // await supabase.from('users').delete().eq('facebook_id', userId);
    
    // Return the required response format
    return NextResponse.json({ 
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation?code=${confirmationCode}`,
      confirmation_code: confirmationCode
    });
    
  } catch (error) {
    console.error('Error processing Facebook data deletion request:', error);
    
    // Even in case of error, return a valid response to Facebook
    return NextResponse.json({ 
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
      confirmation_code: `error_${Date.now()}`
    });
  }
} 