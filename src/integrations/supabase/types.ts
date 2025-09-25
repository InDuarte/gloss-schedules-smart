export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_id: string
          created_at: string
          data_agendamento: string
          hora_fim: string
          hora_inicio: string
          id: string
          observacoes: string | null
          profissional_id: string
          salao_id: string
          servico_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string
          valor_pago: number | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_agendamento: string
          hora_fim: string
          hora_inicio: string
          id?: string
          observacoes?: string | null
          profissional_id: string
          salao_id: string
          servico_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string
          valor_pago?: number | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_agendamento?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          observacoes?: string | null
          profissional_id?: string
          salao_id?: string
          servico_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          plano: Database["public"]["Enums"]["plan_type"]
          salao_id: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          valor_mensal: number
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          plano?: Database["public"]["Enums"]["plan_type"]
          salao_id: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          valor_mensal: number
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          plano?: Database["public"]["Enums"]["plan_type"]
          salao_id?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          data_nascimento: string | null
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          salao_id: string
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          salao_id: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          salao_id?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_globais: {
        Row: {
          email_suporte: string | null
          id: string
          preco_avancado: number | null
          preco_basico: number | null
          preco_premium: number | null
          texto_landing: string | null
          updated_at: string
          whatsapp_suporte: string | null
        }
        Insert: {
          email_suporte?: string | null
          id?: string
          preco_avancado?: number | null
          preco_basico?: number | null
          preco_premium?: number | null
          texto_landing?: string | null
          updated_at?: string
          whatsapp_suporte?: string | null
        }
        Update: {
          email_suporte?: string | null
          id?: string
          preco_avancado?: number | null
          preco_basico?: number | null
          preco_premium?: number | null
          texto_landing?: string | null
          updated_at?: string
          whatsapp_suporte?: string | null
        }
        Relationships: []
      }
      cupons: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string
          global: boolean | null
          id: string
          limite_uso: number | null
          salao_id: string | null
          tipo: Database["public"]["Enums"]["coupon_type"]
          updated_at: string
          usado_vezes: number | null
          validade: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string
          global?: boolean | null
          id?: string
          limite_uso?: number | null
          salao_id?: string | null
          tipo: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usado_vezes?: number | null
          validade?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string
          global?: boolean | null
          id?: string
          limite_uso?: number | null
          salao_id?: string | null
          tipo?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usado_vezes?: number | null
          validade?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "cupons_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens_suporte: {
        Row: {
          created_at: string
          id: string
          mensagem: string
          respondido: boolean | null
          resposta: string | null
          salao_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem: string
          respondido?: boolean | null
          resposta?: string | null
          salao_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string
          respondido?: boolean | null
          resposta?: string | null
          salao_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_suporte_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome: string
          salao_id: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["user_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          salao_id?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          salao_id?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profissionais: {
        Row: {
          ativo: boolean | null
          created_at: string
          especialidades: string[] | null
          foto_url: string | null
          id: string
          nome: string
          salao_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          especialidades?: string[] | null
          foto_url?: string | null
          id?: string
          nome: string
          salao_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          especialidades?: string[] | null
          foto_url?: string | null
          id?: string
          nome?: string
          salao_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profissionais_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
        ]
      }
      saloes: {
        Row: {
          admin_id: string | null
          ativo: boolean | null
          created_at: string
          email: string | null
          endereco: string | null
          horario_funcionamento: Json | null
          id: string
          link_personalizado: string | null
          logo_url: string | null
          mensagens_whatsapp: Json | null
          nome: string
          politica_cancelamento: string | null
          telefone: string | null
          tema_cores: Json | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          admin_id?: string | null
          ativo?: boolean | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          horario_funcionamento?: Json | null
          id?: string
          link_personalizado?: string | null
          logo_url?: string | null
          mensagens_whatsapp?: Json | null
          nome: string
          politica_cancelamento?: string | null
          telefone?: string | null
          tema_cores?: Json | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          admin_id?: string | null
          ativo?: boolean | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          horario_funcionamento?: Json | null
          id?: string
          link_personalizado?: string | null
          logo_url?: string | null
          mensagens_whatsapp?: Json | null
          nome?: string
          politica_cancelamento?: string | null
          telefone?: string | null
          tema_cores?: Json | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string | null
          duracao_minutos: number
          id: string
          nome: string
          preco: number
          profissional_id: string | null
          salao_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number
          id?: string
          nome: string
          preco: number
          profissional_id?: string | null
          salao_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number
          id?: string
          nome?: string
          preco?: number
          profissional_id?: string | null
          salao_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_salao_id_fkey"
            columns: ["salao_id"]
            isOneToOne: false
            referencedRelation: "saloes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_type: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_type"]
      }
      is_super_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      user_belongs_to_salao: {
        Args: { salao_uuid: string; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status:
        | "agendado"
        | "confirmado"
        | "cancelado"
        | "concluido"
        | "falta"
      coupon_type: "percentual" | "valor_fixo"
      plan_type: "basico" | "avancado" | "premium"
      subscription_status: "ativo" | "cancelado" | "pausado" | "vencido"
      user_type: "cliente" | "profissional" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "agendado",
        "confirmado",
        "cancelado",
        "concluido",
        "falta",
      ],
      coupon_type: ["percentual", "valor_fixo"],
      plan_type: ["basico", "avancado", "premium"],
      subscription_status: ["ativo", "cancelado", "pausado", "vencido"],
      user_type: ["cliente", "profissional", "admin", "super_admin"],
    },
  },
} as const
