'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase-client';
import { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  userRole: UserRole;
  isLoading: boolean;
  setRedirectTo: (shouldRedirect: boolean) => void;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

const Redirector = ({ user, role, shouldRedirect, setShouldRedirect }: { user: User | null, role: UserRole, shouldRedirect: boolean, setShouldRedirect: (v:boolean) => void }) => {
    const router = useRouter();

    useEffect(() => {
        if (!shouldRedirect || !user || !role) return;

        let path = '/';
        if (role === 'admin') path = '/admin/dashboard';
        else if (role === 'supplier') path = '/supplier/dashboard';
        else if (role === 'buyer') path = '/buyer/dashboard';
        
        router.push(path);
        setShouldRedirect(false); // Reset redirect trigger
    }, [user, role, shouldRedirect, router, setShouldRedirect]);
    
    return null; // This component does not render anything
}

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const fetchUserRole = useCallback(async (client: SupabaseClient, userId: string) => {
    // Check admins table
    const { data: admin } = await client.from('admins').select('id').eq('id', userId).single();
    if (admin) {
      setUserRole('admin');
      return 'admin';
    }
    // Check suppliers table
    const { data: supplier } = await client.from('suppliers').select('id').eq('id', userId).single();
    if (supplier) {
        setUserRole('supplier');
        return 'supplier';
    }
    // Check buyers table
    const { data: buyer } = await client.from('buyers').select('id').eq('id', userId).single();
    if (buyer) {
        setUserRole('buyer');
        return 'buyer';
    }

    setUserRole(null);
    return null;
  }, []);

  useEffect(() => {
    const supabaseClient = getSupabase();
    setSupabase(supabaseClient);

    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabaseClient.auth.getSession();
      setSession(initialSession);
      if (initialSession) {
        await fetchUserRole(supabaseClient, initialSession.user.id);
      }
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, newSession) => {
        setIsLoading(true);
        setSession(newSession);
        if (newSession) {
          await fetchUserRole(supabaseClient, newSession.user.id);
        } else {
          setUserRole(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const value = {
    supabase,
    session,
    user: session?.user ?? null,
    userRole,
    isLoading,
    setRedirectTo: setShouldRedirect,
  };

  return (
    <SupabaseContext.Provider value={value}>
      <Redirector user={value.user} role={userRole} shouldRedirect={shouldRedirect} setShouldRedirect={setShouldRedirect} />
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
