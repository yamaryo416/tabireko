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
      icon: {
        Row: {
          created_at: string
          id: number
          name: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          url?: string
        }
        Relationships: []
      }
      marker: {
        Row: {
          content: string | null
          created_at: string
          id: number
          lat: number
          lng: number
          official_description: string | null
          official_google_map_url: string | null
          official_title: string | null
          official_web_url: string | null
          tag_id: number | null
          title: string
          user_id: string
          visited_datetime: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          lat: number
          lng: number
          official_description?: string | null
          official_google_map_url?: string | null
          official_title?: string | null
          official_web_url?: string | null
          tag_id?: number | null
          title: string
          user_id: string
          visited_datetime: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          lat?: number
          lng?: number
          official_description?: string | null
          official_google_map_url?: string | null
          official_title?: string | null
          official_web_url?: string | null
          tag_id?: number | null
          title?: string
          user_id?: string
          visited_datetime?: string
        }
        Relationships: [
          {
            foreignKeyName: "marker_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marker_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marker_img: {
        Row: {
          created_at: string
          id: number
          marker_id: number | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          marker_id?: number | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          marker_id?: number | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marker_img_marker_id_fkey"
            columns: ["marker_id"]
            isOneToOne: false
            referencedRelation: "marker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marker_img_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marker_official_img: {
        Row: {
          created_at: string
          id: number
          marker_id: number | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          marker_id?: number | null
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          marker_id?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "marker_official_img_marker_id_fkey"
            columns: ["marker_id"]
            isOneToOne: false
            referencedRelation: "marker"
            referencedColumns: ["id"]
          },
        ]
      }
      tag: {
        Row: {
          access_token: string | null
          created_at: string
          icon_id: number | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          icon_id?: number | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          icon_id?: number | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
