
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface Manager {
  id: string;
  user_id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  current_club_id: string | null;
  salary: number;
  reputation: number;
}

export class AuthService {
  static async signUp(email: string, password: string, name: string) {
    try {
      // Use o domínio público correto ao invés de localhost
      const redirectUrl = window.location.origin.includes('localhost') 
        ? `${window.location.origin}/`
        : `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      // Criar manager após signup bem-sucedido
      if (data.user) {
        const { error: managerError } = await supabase
          .from('managers')
          .insert([{
            user_id: data.user.id,
            name: name,
            email: email
          }]);

        if (managerError) {
          console.error('Erro ao criar manager:', managerError);
        }
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { user: data.user, session: data.session, error: error };
    } catch (error) {
      return { user: null, session: null, error };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  static async getManagerByUserId(userId: string): Promise<Manager | null> {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar manager:', error);
      return null;
    }
  }

  static async updateManager(managerId: string, updates: Partial<Manager>) {
    try {
      const { data, error } = await supabase
        .from('managers')
        .update(updates)
        .eq('id', managerId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}
