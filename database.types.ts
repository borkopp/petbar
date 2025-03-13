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
      bookmarks: {
        Row: {
          created_at: string | null
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      breeds: {
        Row: {
          category_id: number
          id: number
          name: string
          type: string
        }
        Insert: {
          category_id: number
          id?: number
          name: string
          type?: string
        }
        Update: {
          category_id?: number
          id?: number
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeds_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: number
          latitude: number | null
          longitude: number | null
          name: string
        }
        Insert: {
          id?: number
          latitude?: number | null
          longitude?: number | null
          name: string
        }
        Update: {
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          listing_id: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          listing_id?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          listing_id?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_images: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          listing_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          listing_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          listing_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "partner_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_listings: {
        Row: {
          breeding_experience: string | null
          category: string
          created_at: string | null
          description: string | null
          desired_age_range: Json | null
          desired_breed: string | null
          desired_gender: string
          dog_age: number | null
          dog_breed: string | null
          dog_description: string | null
          dog_gender: string | null
          dog_pedigree: boolean | null
          dog_vaccinated: boolean | null
          health_requirements: string[] | null
          id: string
          is_price_negotiable: boolean
          location: string
          pedigree_required: boolean | null
          pet_listing_id: string | null
          preferred_meeting_location: string | null
          price: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          vaccination_required: boolean | null
        }
        Insert: {
          breeding_experience?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          desired_age_range?: Json | null
          desired_breed?: string | null
          desired_gender: string
          dog_age?: number | null
          dog_breed?: string | null
          dog_description?: string | null
          dog_gender?: string | null
          dog_pedigree?: boolean | null
          dog_vaccinated?: boolean | null
          health_requirements?: string[] | null
          id?: string
          is_price_negotiable?: boolean
          location: string
          pedigree_required?: boolean | null
          pet_listing_id?: string | null
          preferred_meeting_location?: string | null
          price?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          vaccination_required?: boolean | null
        }
        Update: {
          breeding_experience?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          desired_age_range?: Json | null
          desired_breed?: string | null
          desired_gender?: string
          dog_age?: number | null
          dog_breed?: string | null
          dog_description?: string | null
          dog_gender?: string | null
          dog_pedigree?: boolean | null
          dog_vaccinated?: boolean | null
          health_requirements?: string[] | null
          id?: string
          is_price_negotiable?: boolean
          location?: string
          pedigree_required?: boolean | null
          pet_listing_id?: string | null
          preferred_meeting_location?: string | null
          price?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          vaccination_required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pet_listing"
            columns: ["pet_listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_images: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          listing_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          listing_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          listing_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_listings: {
        Row: {
          age: number | null
          breed: string | null
          breed_id: number | null
          category: string
          color: string | null
          created_at: string | null
          description: string | null
          gender: string | null
          id: string
          listing_type: string
          location: string
          pedigree: boolean | null
          phone: string | null
          price: number | null
          title: string
          updated_at: string | null
          user_id: string
          vaccine: boolean | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          breed?: string | null
          breed_id?: number | null
          category: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          listing_type: string
          location: string
          pedigree?: boolean | null
          phone?: string | null
          price?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          vaccine?: boolean | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          breed?: string | null
          breed_id?: number | null
          category?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          listing_type?: string
          location?: string
          pedigree?: boolean | null
          phone?: string | null
          price?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          vaccine?: boolean | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_listings_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reported_listing_id: string | null
          reported_user_id: string | null
          reporter_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reported_listing_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reported_listing_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_listing_id_fkey"
            columns: ["reported_listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
