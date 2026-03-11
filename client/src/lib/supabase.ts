// Supabase stub - not used in this application
// Authentication is handled via custom API endpoints

export const supabase = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => { } } }
        }),
        signOut: async () => ({ error: null })
    }
};
