export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          role: 'attendee' | 'dj'
          name: string | null
          avatar_url: string | null
          balance: number
          venue_code: string | null
        }
        Insert: {
          id: string
          created_at?: string
          role?: 'attendee' | 'dj'
          name?: string | null
          avatar_url?: string | null
          balance?: number
          venue_code?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          role?: 'attendee' | 'dj'
          name?: string | null
          avatar_url?: string | null
          balance?: number
          venue_code?: string | null
        }
      }
      requests: {
        Row: {
          id: string
          created_at: string
          attendee_id: string
          dj_id: string | null
          song_title: string
          song_artist: string
          song_art_url: string | null
          fee_amount: number
          status: 'pending' | 'accepted' | 'played' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          attendee_id: string
          dj_id?: string | null
          song_title: string
          song_artist: string
          song_art_url?: string | null
          fee_amount?: number
          status?: 'pending' | 'accepted' | 'played' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          attendee_id?: string
          dj_id?: string | null
          song_title?: string
          song_artist?: string
          song_art_url?: string | null
          fee_amount?: number
          status?: 'pending' | 'accepted' | 'played' | 'rejected'
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          request_id: string
          dj_id: string
          total_amount: number
          dj_amount: number
          platform_amount: number
        }
        Insert: {
          id?: string
          created_at?: string
          request_id: string
          dj_id: string
          total_amount: number
          dj_amount: number
          platform_amount: number
        }
        Update: {
          id?: string
          created_at?: string
          request_id?: string
          dj_id?: string
          total_amount?: number
          dj_amount?: number
          platform_amount?: number
        }
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
