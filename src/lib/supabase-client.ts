
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
    if (supabaseInstance) {
        return supabaseInstance;
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL')
    }
    if (!supabaseAnonKey) {
        throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

// For backwards compatibility, we export a "supabase" object that lazily gets the instance.
export const supabase = {
    auth: {
        signUp: (...args: any[]) => (getSupabase().auth.signUp as any)(...args),
        signInWithPassword: (...args: any[]) => getSupabase().auth.signInWithPassword(...args),
        getSession: (...args: any[]) => getSupabase().auth.getSession(...args),
        onAuthStateChange: (...args: any[]) => getSupabase().auth.onAuthStateChange(...args),
        signOut: (...args: any[]) => getSupabase().auth.signOut(...args),
    },
    storage: {
        from: (bucket: string) => {
            const client = getSupabase();
            const from = client.storage.from(bucket);
            return {
                upload: from.upload.bind(from),
                getPublicUrl: from.getPublicUrl.bind(from),
            }
        }
    },
    from: (...args: any[]) => (getSupabase().from as any)(...args),
}
