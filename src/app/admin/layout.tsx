import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { RenderMounted } from '@/components/render-mounted';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = createClient();

  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    console.log('No authenticated user found');
    return redirect('/auth');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (error || !data) {
    console.log('Error fetching user data:', error?.message);
    return redirect('/auth');
  }

  return (
    <RenderMounted>
      <Header />
      <main className='min-h-[calc(100svh-128px)] py-3'>{children}</main>
      <Footer />
    </RenderMounted>
  );
}
