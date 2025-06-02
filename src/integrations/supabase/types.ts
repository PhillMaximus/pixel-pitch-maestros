export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          manager_id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id: string
          manager_id: string
          name: string
          type: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          manager_id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          budget: number
          created_at: string
          formation: string | null
          id: string
          league: string
          name: string
          pre_talk_type: string | null
          reputation: number
          stadium_capacity: number
          stadium_name: string
          tactic: string | null
          training_type: string | null
          updated_at: string
        }
        Insert: {
          budget: number
          created_at?: string
          formation?: string | null
          id: string
          league: string
          name: string
          pre_talk_type?: string | null
          reputation: number
          stadium_capacity: number
          stadium_name: string
          tactic?: string | null
          training_type?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number
          created_at?: string
          formation?: string | null
          id?: string
          league?: string
          name?: string
          pre_talk_type?: string | null
          reputation?: number
          stadium_capacity?: number
          stadium_name?: string
          tactic?: string | null
          training_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      league_participants: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          league_id: string
          manager_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          league_id: string
          manager_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          league_id?: string
          manager_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_participants_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_participants_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_participants_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      league_standings: {
        Row: {
          club_id: string
          drawn: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string
          league_id: string
          lost: number | null
          played: number | null
          points: number | null
          position: number
          won: number | null
        }
        Insert: {
          club_id: string
          drawn?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          league_id: string
          lost?: number | null
          played?: number | null
          points?: number | null
          position: number
          won?: number | null
        }
        Update: {
          club_id?: string
          drawn?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          league_id?: string
          lost?: number | null
          played?: number | null
          points?: number | null
          position?: number
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_standings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_standings_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          created_by: string
          current_round: number | null
          id: string
          invite_code: string
          max_teams: number
          name: string
          next_match_date: string | null
          season: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_round?: number | null
          id: string
          invite_code: string
          max_teams: number
          name: string
          next_match_date?: string | null
          season: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_round?: number | null
          id?: string
          invite_code?: string
          max_teams?: number
          name?: string
          next_match_date?: string | null
          season?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leagues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      managers: {
        Row: {
          created_at: string
          current_club_id: string | null
          email: string
          experience: number | null
          id: string
          level: number | null
          name: string
          reputation: number | null
          salary: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_club_id?: string | null
          email: string
          experience?: number | null
          id?: string
          level?: number | null
          name: string
          reputation?: number | null
          salary?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_club_id?: string | null
          email?: string
          experience?: number | null
          id?: string
          level?: number | null
          name?: string
          reputation?: number | null
          salary?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string
          created_at: string
          events: Json | null
          home_score: number | null
          home_team_id: string
          id: string
          league_id: string
          round: number
          scheduled_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          away_score?: number | null
          away_team_id: string
          created_at?: string
          events?: Json | null
          home_score?: number | null
          home_team_id: string
          id: string
          league_id: string
          round: number
          scheduled_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          away_score?: number | null
          away_team_id?: string
          created_at?: string
          events?: Json | null
          home_score?: number | null
          home_team_id?: string
          id?: string
          league_id?: string
          round?: number
          scheduled_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          age: number
          club_id: string | null
          created_at: string
          defending: number
          dribbling: number
          id: string
          is_starter: boolean | null
          is_substitute: boolean | null
          morale: number | null
          name: string
          overall: number
          pace: number
          passing: number
          physical: number
          position: string
          potential: number
          price: number
          salary: number
          shooting: number
          stamina: number | null
          updated_at: string
        }
        Insert: {
          age: number
          club_id?: string | null
          created_at?: string
          defending: number
          dribbling: number
          id: string
          is_starter?: boolean | null
          is_substitute?: boolean | null
          morale?: number | null
          name: string
          overall: number
          pace: number
          passing: number
          physical: number
          position: string
          potential: number
          price: number
          salary: number
          shooting: number
          stamina?: number | null
          updated_at?: string
        }
        Update: {
          age?: number
          club_id?: string | null
          created_at?: string
          defending?: number
          dribbling?: number
          id?: string
          is_starter?: boolean | null
          is_substitute?: boolean | null
          morale?: number | null
          name?: string
          overall?: number
          pace?: number
          passing?: number
          physical?: number
          position?: string
          potential?: number
          price?: number
          salary?: number
          shooting?: number
          stamina?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
