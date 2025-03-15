import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // For Facebook's verification of the endpoint
  const confirmationCode = request.nextUrl.searchParams.get('confirmation_code');
  
  if (confirmationCode) {
    return NextResponse.json({ confirmation_code: confirmationCode });
  }
  
  return NextResponse.json({ success: false, error: 'Missing confirmation code' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Facebook sends a signed_request that contains user_id
    const signedRequest = body.signed_request;
    
    if (!signedRequest) {
      return NextResponse.json({ success: false, error: 'Missing signed_request' }, { status: 400 });
    }
    
    // In a real implementation, you would:
    // 1. Parse and verify the signed_request (it's base64url encoded and signed with your app secret)
    // 2. Extract the user_id from the decoded payload
    // 3. Delete the user's data from your database
    
    // For now, we'll just log the request and return success
    console.log('Received data deletion request:', body);
    
    // In a real implementation, you would delete user data here
    // const supabase = await createClient();
    // await supabase.from('your_table').delete().eq('facebook_id', userId);
    
    // Return a success response to Facebook
    return NextResponse.json({ 
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy/data-deletion-confirmation`,
      confirmation_code: body.confirmation_code || 'confirmed'
    });
    
  } catch (error) {
    console.error('Error processing Facebook data deletion request:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 