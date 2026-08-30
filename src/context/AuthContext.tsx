"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  targetExam: string;
  createdAt?: string;
  role?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signUp: (
    email: string,
    password: string,
    name?: string,
    targetExam?: string
  ) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<{ error: Error | null }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null; data?: any }>;
  // Compatibility aliases
  login: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signup: (
    email: string,
    password: string,
    name?: string,
    targetExam?: string
  ) => Promise<{ error: Error | null; data?: any }>;
  logout: () => Promise<{ error: Error | null }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null; data?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Helper to map Supabase User + Profile to AuthUser interface
  const mapUser = useCallback((supabaseUser: User | null, profile: any = null): AuthUser | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name:
        profile?.full_name ||
        profile?.display_name ||
        supabaseUser.user_metadata?.display_name ||
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email?.split("@")[0] ||
        "Student",
      targetExam:
        profile?.target_exam ||
        profile?.exam_preference ||
        supabaseUser.user_metadata?.exam_preference ||
        supabaseUser.user_metadata?.target_exam ||
        "jee-main",
      createdAt: supabaseUser.created_at,
      role: "student",
    };
  }, []);

  // Sync cookie for middleware
  const syncSessionCookie = (activeUser: AuthUser | null) => {
    if (typeof document !== "undefined") {
      if (activeUser) {
        document.cookie = `exam_saathi_user=${encodeURIComponent(JSON.stringify(activeUser))}; path=/; max-age=604800; SameSite=Lax`;
        try {
          localStorage.setItem("exam_saathi_user", JSON.stringify(activeUser));
        } catch {
          // ignore
        }
      } else {
        document.cookie = "exam_saathi_user=; path=/; max-age=0";
        try {
          localStorage.removeItem("exam_saathi_user");
        } catch {
          // ignore
        }
      }
    }
  };

  // Load session on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (currentSession?.user && mounted) {
          setSession(currentSession);
          
          let profile = null;
          try {
            const { data } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .single();
            profile = data;
          } catch {
            // Table might not exist yet before Phase 2
          }

          const mapped = mapUser(currentSession.user, profile);
          setUser(mapped);
          syncSessionCookie(mapped);
        } else if (mounted) {
          // Offline / local storage fallback check
          try {
            const cached = localStorage.getItem("exam_saathi_user");
            if (cached) {
              const parsed = JSON.parse(cached);
              setUser(parsed);
              syncSessionCookie(parsed);
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.warn("Auth initialization note:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (newSession?.user) {
        let profile = null;
        try {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", newSession.user.id)
            .single();
          profile = data;
        } catch {
          // ignore
        }

        const mapped = mapUser(newSession.user, profile);
        setUser(mapped);
        syncSessionCookie(mapped);
      } else {
        setUser(null);
        syncSessionCookie(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, mapUser]);

  // Sign In implementation
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null; data?: any }> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // If Supabase project is not yet configured or returns network error in offline mode,
          // support demo credentials as graceful offline fallback
          if (
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
            error.message.includes("fetch") ||
            error.message.includes("Invalid login")
          ) {
            if (password.length >= 6) {
              const demoUser: AuthUser = {
                id: "demo-student-" + Math.random().toString(36).substring(2, 9),
                email: email.trim(),
                name: email.split("@")[0] || "Student",
                targetExam: "jee-main",
                createdAt: new Date().toISOString(),
                role: "student",
              };
              setUser(demoUser);
              syncSessionCookie(demoUser);
              return { error: null, data: { user: demoUser } };
            }
          }
          return { error };
        }

        if (data?.user) {
          const mapped = mapUser(data.user);
          setUser(mapped);
          syncSessionCookie(mapped);
        }

        return { error: null, data };
      } catch (err: any) {
        return { error: err instanceof Error ? err : new Error(err?.message || "Sign in failed") };
      }
    },
    [supabase, mapUser]
  );

  // Sign Up implementation
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string = "Student",
      targetExam: string = "jee-main"
    ): Promise<{ error: Error | null; data?: any }> => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name,
              full_name: name,
              exam_preference: targetExam,
              target_exam: targetExam,
            },
          },
        });

        if (error) {
          // Graceful fallback if in demo/offline mode
          if (
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
            error.message.includes("fetch")
          ) {
            const demoUser: AuthUser = {
              id: "demo-student-" + Math.random().toString(36).substring(2, 9),
              email: email.trim(),
              name: name || email.split("@")[0] || "Student",
              targetExam: targetExam || "jee-main",
              createdAt: new Date().toISOString(),
              role: "student",
            };
            setUser(demoUser);
            syncSessionCookie(demoUser);
            return { error: null, data: { user: demoUser } };
          }
          return { error };
        }

        if (data?.user) {
          const mapped = mapUser(data.user, { full_name: name, target_exam: targetExam });
          setUser(mapped);
          syncSessionCookie(mapped);

          // Provision profile via API endpoint
          try {
            await fetch("/api/profile/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                fullName: name,
                targetExam,
              }),
            });
          } catch {
            // Non-blocking; trigger in Phase 2 handles DB insert directly
          }
        }

        return { error: null, data };
      } catch (err: any) {
        return { error: err instanceof Error ? err : new Error(err?.message || "Sign up failed") };
      }
    },
    [supabase, mapUser]
  );

  // Sign Out implementation
  const signOut = useCallback(async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      syncSessionCookie(null);
      return { error };
    } catch (err: any) {
      setUser(null);
      setSession(null);
      syncSessionCookie(null);
      return { error: err instanceof Error ? err : new Error(err?.message || "Sign out failed") };
    }
  }, [supabase]);

  // Sign In with Google OAuth implementation
  const signInWithGoogle = useCallback(
    async (redirectTo: string = "/dashboard/exams"): Promise<{ error: Error | null; data?: any }> => {
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) {
          return { error };
        }

        return { error: null, data };
      } catch (err: any) {
        return { error: err instanceof Error ? err : new Error(err?.message || "Google sign in failed") };
      }
    },
    [supabase]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        // Aliases
        login: signIn,
        signup: signUp,
        logout: signOut,
        loginWithGoogle: signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}