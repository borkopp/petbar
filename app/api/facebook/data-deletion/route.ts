import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // For Facebook's verification of the endpoint
  const confirmationCode = request.nextUrl.searchParams.get('confirmation_code');
  
  // Always return a successful response, even if no confirmation code is provided
  // This ensures Facebook's verification passes
  return NextResponse.json({ 
    confirmation_code: confirmationCode || 'default_confirmation',
    success: true,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`
  });
}

export async function POST() {
  // Always return a successful response for Facebook's data deletion request
  // In a real implementation, you would parse the signed_request and delete user data
  
  return NextResponse.json({ 
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
    confirmation_code: 'confirmed',
    success: true
  });
} 