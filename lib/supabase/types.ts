export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          brand: string;
          model: string;
          variant: string;
          year: number;
          price: number;
          location: string;
          mileage: number;
          fuel: "Petrol" | "Diesel" | "CNG" | "EV";
          transmission: "Manual" | "Automatic";
          ownership: "1st owner" | "2nd owner" | "3rd owner" | "4th+ owner";
          value_score: number;
          market_delta: number;
          added_label: string;
          body_type: "Hatchback" | "Sedan" | "SUV" | "EV";
          color: string;
          source_platform: string;
          source_listing_url: string;
          dealer_name: string;
          insurance_valid: boolean;
          service_history: "full" | "partial" | "missing";
          accident_history: "none" | "minor" | "major";
          image_urls: string[];
          price_dropped: boolean;
          image_position: string;
          highlights: string[];
          inspection: {
            engine: number;
            exterior: number;
            tyres: number;
            documents: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          brand: string;
          model: string;
          variant: string;
          year: number;
          price: number;
          location: string;
          mileage: number;
          fuel: "Petrol" | "Diesel" | "CNG" | "EV";
          transmission: "Manual" | "Automatic";
          ownership: "1st owner" | "2nd owner" | "3rd owner" | "4th+ owner";
          value_score: number;
          market_delta?: number;
          added_label?: string;
          body_type: "Hatchback" | "Sedan" | "SUV" | "EV";
          color?: string;
          source_platform?: string;
          source_listing_url?: string;
          dealer_name?: string;
          insurance_valid?: boolean;
          service_history?: "full" | "partial" | "missing";
          accident_history?: "none" | "minor" | "major";
          image_urls?: string[];
          price_dropped?: boolean;
          image_position?: string;
          highlights?: string[];
          inspection?: {
            engine: number;
            exterior: number;
            tyres: number;
            documents: number;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cars"]["Insert"]>;
        Relationships: [];
      };
      saved_cars: {
        Row: {
          id: string;
          user_id: string;
          car_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          car_id: string;
          created_at?: string;
        };
        Update: {
          car_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_cars_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          }
        ];
      };
      price_alerts: {
        Row: {
          id: string;
          user_id: string;
          car_id: string;
          target_price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          car_id: string;
          target_price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          car_id?: string;
          target_price?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "price_alerts_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type CarRow = Database["public"]["Tables"]["cars"]["Row"];
export type SavedCarRow = Database["public"]["Tables"]["saved_cars"]["Row"];
export type PriceAlertRow = Database["public"]["Tables"]["price_alerts"]["Row"];
