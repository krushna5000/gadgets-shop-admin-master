'use server';

import { createClient } from '@/supabase/server';

export const authenticate = async (email: string, password: string) => {
  const supabase = createClient();
  try {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    // Check if user exists in public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // If user doesn't exist in public.users, create them
    if (!userData && !userError && authData.user.email) {
      const { error: createError } = await supabase.from('users').insert([{
        id: authData.user.id,
        email: authData.user.email,
        avatar_url: 'https://example.com/default-avatar.png',
        type: 'admin'
      }]);

      if (createError) throw createError;
    }
  } catch (error) {
    console.log('AUTHENTICATION ERROR', error);
    throw error;
  }
};

export const getLatestUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(`Error fetching latest users: ${error.message}`);

  return data.map(
    (user: { id: string; email: string; created_at: string | null }) => ({
      id: user.id,
      email: user.email,
      date: user.created_at,
    })
  );
};
