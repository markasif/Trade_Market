'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase-client';
import { UserRole } from '@/lib/types';

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  session: Session | null;
  userRole: UserRole;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Supabase client on the client-side
    const supabaseClient = getSupabase();
    setSupabase(supabaseClient);

    const getSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      if (session) {
        await fetchUserRole(supabaseClient, session.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await fetchUserRole(supabaseClient, session.user.id);
        } else {
          setUserRole(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (client: SupabaseClient, userId: string) => {
    // Check admins table
    const { data: admin, error: adminError } = await client
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (admin) {
      setUserRole('admin');
      return;
    }

    // Check suppliers table
    const { data: supplier, error: supplierError } = await client
      .from('suppliers')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (supplier) {
        setUserRole('supplier');
        return;
    }

    // Check buyers table
    const { data: buyer, error: buyerError } = await client
        .from('buyers')
        .select('user_id')
        .eq('user_id', userId)
        .single();
    
    if (buyer) {
        setUserRole('buyer');
        return;
    }

    setUserRole(null);
  };

  const value = {
    supabase,
    session,
    userRole,
    isLoading,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  if (context.supabase === null) {
      // This can happen briefly on the first render, so we'll handle it gracefully
      // in components, but for hooks that absolutely need it, we could throw.
      // For now, we'll allow it to be null initially.
  }
  // We cast to remove null, as components will be structured to handle the loading state.
  return context as SupabaseContextType & { supabase: SupabaseClient };
};
