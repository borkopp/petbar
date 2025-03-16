import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {createClient} from "@supabase/supabase-js";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function DELETE() {
  try {
    // Create a regular client to get the current user
    const supabase = createRouteHandlerClient({cookies});
    
    // Get the current user
    
    const {data: {user}, error: userError} = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        {message: "Неуспешно бришење на сметка"},
        {status: 401}
      );
    }
    
    // Delete user profile first (if exists)
    // Note: If you've set up cascade deletion in Supabase, this step might be unnecessary
    await supabase.from("profiles").delete().eq("id", user.id);
    
    // Create an admin client with service role key
    // This should only be done on the server side
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Delete the user account
    const {error: deleteError} = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return NextResponse.json(
        {message: "Failed to delete account: " + deleteError.message},
        {status: 500}
      );
    }
    
    return NextResponse.json({message: "Account deleted successfully"});
  } catch (error) {
    console.error("Error in delete account API:", error);
    return NextResponse.json(
      {message: "An unexpected error occurred"},
      {status: 500}
    );
  }
} 