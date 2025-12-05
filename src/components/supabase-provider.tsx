'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { UserRole } from '@/lib/types';

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  userRole: UserRole;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchUserRole(session.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await fetchUserRole(session.user.id);
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

  const fetchUserRole = async (userId: string) => {
    // Check admins table
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (admin) {
      setUserRole('admin');
      return;
    }

    // Check suppliers table
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (supplier) {
        setUserRole('supplier');
        return;
    }

    // Check buyers table
    const { data: buyer, error: buyerError } = await supabase
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
  return context;
};
