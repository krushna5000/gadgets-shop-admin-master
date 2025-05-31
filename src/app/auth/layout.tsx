import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = createClient();

  const { data: authData } = await supabase.auth.getUser();

  // If user is authenticated, redirect to admin
  if (authData?.user) {
    return redirect('/admin');
  }

  return <>{children}</>;
}
