
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  userData: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, userData: any) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Initializing Supabase Auth Provider...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setUserData(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to retrieve session. Please try logging in again.",
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Fallback to user metadata if profile doesn't exist
        const role = user?.user_metadata?.role || "user";
        setUserRole(role as UserRole);
        setUserData({
          id: userId,
          name: user?.email?.split('@')[0] || 'User',
          role: role
        });
      } else if (data) {
        console.log("Profile found:", data);
        const role = (data.role || "user") as UserRole;
        setUserRole(role);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      toast({
        title: "Success",
        description: "You have been signed in successfully",
      });

      return { error: null, data };
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Attempting sign up for:", email, userData);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      toast({
        title: "Success",
        description: "Account created successfully. Please check your email to confirm your registration.",
      });

      return { error: null, data };
    } catch (error: any) {
      console.error("Unexpected sign up error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });

      return { error: null };
    } catch (error: any) {
      console.error("Unexpected sign out error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign out",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    session,
    user,
    userRole,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default SupabaseAuthProvider;
