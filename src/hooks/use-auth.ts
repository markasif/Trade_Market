
'use client';

import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { supabase, session, userRole, isLoading } = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/');
  };

  return {
    supabase,
    session,
    user: session?.user ?? null,
    userRole,
    isLoading,
    handleLogout,
  };
};
