'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/')
}

export async function isBookmarked(listingId: string) {
  const supabase = await createClient();
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { isBookmarked: false, needsAuth: true };
  }
  
  // Check if the listing is already bookmarked
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "No rows returned"
    console.error('Error checking bookmark status:', error);
    return { isBookmarked: false, error: error.message };
  }
  
  return { isBookmarked: !!data };
}

export async function toggleBookmark(listingId: string) {
  const supabase = await createClient();
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'You must be logged in to bookmark listings', needsAuth: true };
  }
  
  // Check if the listing is already bookmarked
  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single();
  
  if (existingBookmark) {
    // Remove bookmark if it exists
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    revalidatePath(`/listings/${listingId}`);
    return { success: true, action: 'removed' };
  } else {
    // Add bookmark if it doesn't exist
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        listing_id: listingId,
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    revalidatePath(`/listings/${listingId}`);
    return { success: true, action: 'added' };
  }
} 