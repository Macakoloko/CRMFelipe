import { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, teamId: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyTeamId: (teamId: string) => Promise<boolean>;
  createTeam: (name: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Inicialize o cliente Supabase com suas credenciais
const supabase = createClient(
  'https://yuensysrmxqhzirqyuej.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZW5zeXNybXhxaHppcnF5dWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzgyMzUsImV4cCI6MjA1OTAxNDIzNX0.wqjmuhRKjvWJ7u0virPUGJk-kbf4oWwIC8MbUAjCWQU'
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const savedUser = localStorage.getItem('user');
  let initialUser = null;
  try {
    if (savedUser && savedUser !== 'undefined') {
      initialUser = JSON.parse(savedUser);
    }
  } catch {
    initialUser = null;
  }
  const [user, setUser] = useState<User | null>(initialUser);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const userData = data.user;
      const mappedUser = {
        id: userData.id,
        name: userData.user_metadata?.name || '',
        email: userData.email,
        role: userData.user_metadata?.role || 'user',
        teamId: userData.user_metadata?.teamId || null,
      };
      localStorage.setItem('user', JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, teamId: string) => {
    try {
      const response = await supabase.auth.signUp({ email, password, options: { data: { name, teamId } } });
      const userData = response.user;
      const mappedUser = {
        id: userData?.id || '',
        name: userData?.user_metadata?.name || name || '',
        email: userData?.email || email,
        role: userData?.user_metadata?.role || 'user',
        teamId: userData?.user_metadata?.teamId || teamId || null,
      };
      localStorage.setItem('user', JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server request fails
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const verifyTeamId = async (teamId: string): Promise<boolean> => {
    try {
      const response = await supabase.from('teams').select('*').eq('id', teamId);
      return response.data.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const createTeam = async (name: string): Promise<string> => {
    try {
      const response = await supabase.from('teams').insert([{ name }]).select('id');
      return response.data[0].id;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyTeamId, createTeam }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 