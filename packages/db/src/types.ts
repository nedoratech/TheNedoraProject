/**
 * Supabase Database types.
 * Regenerate after migrations: yarn db:types (then restore Relationships if stripped).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type EncryptedField = string | null

export type LeadStatus = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type ProjectType =
  | 'new_application'
  | 'integration_modernisation'
  | 'support_evolution'
  | 'not_sure'
export type CrmRequestStatus =
  | 'new'
  | 'in_review'
  | 'responded'
  | 'converted'
  | 'archived'
  | 'spam'
export type CrmInquiryType = 'contact' | 'project_request'
export type EngagementModel = 'fixed_scope' | 'time_based' | 'not_sure'
export type TimelineOption = 'ready_now' | '1_3_months' | '3_6_months' | 'exploring'
export type InteractionType =
  | 'form_submission'
  | 'email_sent'
  | 'email_received'
  | 'call'
  | 'meeting'
  | 'note'
  | 'status_change'
  | 'proposal_sent'
  | 'contract_signed'

export type Database = {
  public: {
    Tables: {
      cms_pages: {
        Row: {
          id: string
          slug: string
          locale: string
          title: string | null
          published: boolean
          meta_title: string | null
          meta_desc: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          locale?: string
          title?: string | null
          published?: boolean
          meta_title?: string | null
          meta_desc?: string | null
        }
        Update: {
          slug?: string
          locale?: string
          title?: string | null
          published?: boolean
          meta_title?: string | null
          meta_desc?: string | null
        }
        Relationships: []
      }
      cms_content_blocks: {
        Row: {
          id: string
          page_slug: string
          block_key: string
          locale: string
          value: string | null
          type: string
          updated_at: string
        }
        Insert: {
          page_slug: string
          block_key: string
          locale?: string
          value?: string | null
          type?: string
        }
        Update: {
          page_slug?: string
          block_key?: string
          locale?: string
          value?: string | null
          type?: string
        }
        Relationships: []
      }
      cms_feature_flags: {
        Row: {
          id: string
          flag_key: string
          enabled: boolean
          description: string | null
          updated_at: string
        }
        Insert: {
          flag_key: string
          enabled?: boolean
          description?: string | null
        }
        Update: {
          flag_key?: string
          enabled?: boolean
          description?: string | null
        }
        Relationships: []
      }
      cms_navigation: {
        Row: {
          id: string
          location: string
          label: string
          href: string
          locale: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          location: string
          label: string
          href: string
          locale?: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          location?: string
          label?: string
          href?: string
          locale?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      cms_media: {
        Row: {
          id: string
          media_key: string
          storage_path: string
          alt_text: string | null
          uploaded_at: string
        }
        Insert: {
          media_key: string
          storage_path: string
          alt_text?: string | null
        }
        Update: {
          media_key?: string
          storage_path?: string
          alt_text?: string | null
        }
        Relationships: []
      }
      nedora_encryption_store: {
        Row: {
          subject_id: string
          dek_b64: string
          created_at: string
          updated_at: string
        }
        Insert: {
          subject_id: string
          dek_b64: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          subject_id?: string
          dek_b64?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          id: string
          subject_id: string | null
          email_hash: string | null
          email_ciphertext: string
          first_name_ciphertext: EncryptedField
          last_name_ciphertext: EncryptedField
          company_ciphertext: EncryptedField
          role: string | null
          phone_ciphertext: EncryptedField
          address_line1_ciphertext: EncryptedField
          address_line2_ciphertext: EncryptedField
          city_ciphertext: EncryptedField
          postal_code_ciphertext: EncryptedField
          country_ciphertext: EncryptedField
          source: string | null
          tags: string[]
          notes_ciphertext: EncryptedField
          created_at: string
          updated_at: string
        }
        Insert: {
          subject_id?: string | null
          email_hash: string
          email_ciphertext: string
          first_name_ciphertext?: EncryptedField
          last_name_ciphertext?: EncryptedField
          company_ciphertext?: EncryptedField
          role?: string | null
          phone_ciphertext?: EncryptedField
          address_line1_ciphertext?: EncryptedField
          address_line2_ciphertext?: EncryptedField
          city_ciphertext?: EncryptedField
          postal_code_ciphertext?: EncryptedField
          country_ciphertext?: EncryptedField
          source?: string | null
          tags?: string[]
          notes_ciphertext?: EncryptedField
        }
        Update: {
          subject_id?: string | null
          email_hash?: string
          email_ciphertext?: string
          first_name_ciphertext?: EncryptedField
          last_name_ciphertext?: EncryptedField
          company_ciphertext?: EncryptedField
          role?: string | null
          phone_ciphertext?: EncryptedField
          address_line1_ciphertext?: EncryptedField
          address_line2_ciphertext?: EncryptedField
          city_ciphertext?: EncryptedField
          postal_code_ciphertext?: EncryptedField
          country_ciphertext?: EncryptedField
          source?: string | null
          tags?: string[]
          notes_ciphertext?: EncryptedField
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          id: string
          contact_id: string
          status: LeadStatus
          priority: string | null
          project_type: ProjectType | null
          engagement_model: EngagementModel | null
          timeline: TimelineOption | null
          estimated_value: number | null
          currency: string
          assigned_to: string | null
          closed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          status?: LeadStatus
          priority?: string | null
          project_type?: ProjectType | null
          engagement_model?: EngagementModel | null
          timeline?: TimelineOption | null
          estimated_value?: number | null
          currency?: string
          assigned_to?: string | null
          closed_at?: string | null
        }
        Update: {
          contact_id?: string
          status?: LeadStatus
          priority?: string | null
          project_type?: ProjectType | null
          engagement_model?: EngagementModel | null
          timeline?: TimelineOption | null
          estimated_value?: number | null
          currency?: string
          assigned_to?: string | null
          closed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'crm_leads_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'crm_contacts'
            referencedColumns: ['id']
          },
        ]
      }
      crm_project_requests: {
        Row: {
          id: string
          contact_id: string | null
          lead_id: string | null
          subject_id: string | null
          email_hash: string | null
          first_name_ciphertext: string
          last_name_ciphertext: string
          email_ciphertext: string
          company_ciphertext: EncryptedField
          address_line1_ciphertext: EncryptedField
          address_line2_ciphertext: EncryptedField
          city_ciphertext: EncryptedField
          postal_code_ciphertext: EncryptedField
          country_ciphertext: EncryptedField
          project_type: ProjectType | null
          engagement_model: EngagementModel | null
          timeline: TimelineOption | null
          message_ciphertext: EncryptedField
          locale: string
          ip_address: string | null
          read: boolean
          status: CrmRequestStatus
          source: string
          inquiry_type: CrmInquiryType
          updated_at: string
          assigned_to: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          contact_id?: string | null
          lead_id?: string | null
          subject_id?: string | null
          email_hash?: string | null
          first_name_ciphertext: string
          last_name_ciphertext: string
          email_ciphertext: string
          company_ciphertext?: EncryptedField
          address_line1_ciphertext?: EncryptedField
          address_line2_ciphertext?: EncryptedField
          city_ciphertext?: EncryptedField
          postal_code_ciphertext?: EncryptedField
          country_ciphertext?: EncryptedField
          project_type?: ProjectType | null
          engagement_model?: EngagementModel | null
          timeline?: TimelineOption | null
          message_ciphertext?: EncryptedField
          locale?: string
          ip_address?: string | null
          read?: boolean
          status?: CrmRequestStatus
          source?: string
          inquiry_type?: CrmInquiryType
          updated_at?: string
          assigned_to?: string | null
          read_at?: string | null
        }
        Update: {
          contact_id?: string | null
          lead_id?: string | null
          subject_id?: string | null
          email_hash?: string | null
          first_name_ciphertext?: string
          last_name_ciphertext?: string
          email_ciphertext?: string
          company_ciphertext?: EncryptedField
          message_ciphertext?: EncryptedField
          read?: boolean
          status?: CrmRequestStatus
          source?: string
          inquiry_type?: CrmInquiryType
          updated_at?: string
          assigned_to?: string | null
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'crm_project_requests_contact_id_fkey'
            columns: ['contact_id']
            isOneToOne: false
            referencedRelation: 'crm_contacts'
            referencedColumns: ['id']
          },
        ]
      }
      crm_interactions: {
        Row: {
          id: string
          contact_id: string | null
          lead_id: string | null
          type: InteractionType
          title: string
          body: string | null
          metadata: Json
          created_by: string | null
          created_at: string
        }
        Insert: {
          contact_id?: string | null
          lead_id?: string | null
          type: InteractionType
          title: string
          body?: string | null
          metadata?: Json
          created_by?: string | null
        }
        Update: {
          contact_id?: string | null
          lead_id?: string | null
          type?: InteractionType
          title?: string
          body?: string | null
          metadata?: Json
        }
        Relationships: []
      }
      crm_newsletter_subscribers: {
        Row: {
          id: string
          subject_id: string | null
          email_hash: string | null
          email_ciphertext: string
          first_name_ciphertext: EncryptedField
          last_name_ciphertext: EncryptedField
          locale: string
          status: string
          consent_given_at: string | null
          unsubscribed_at: string | null
          source: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          subject_id?: string | null
          email_hash: string
          email_ciphertext: string
          first_name_ciphertext?: EncryptedField
          last_name_ciphertext?: EncryptedField
          locale?: string
          status?: string
          consent_given_at?: string | null
          source?: string | null
          tags?: string[]
        }
        Update: {
          subject_id?: string | null
          email_hash?: string
          email_ciphertext?: string
          first_name_ciphertext?: EncryptedField
          last_name_ciphertext?: EncryptedField
          status?: string
          consent_given_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      crm_newsletter_campaigns: {
        Row: {
          id: string
          title: string
          subject: string | null
          status: string
          segment: string
          sent_count: number
          open_count: number
          click_count: number
          unsub_count: number
          scheduled_at: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          title: string
          subject?: string | null
          status?: string
          segment?: string
          sent_count?: number
          open_count?: number
          click_count?: number
          unsub_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
        }
        Update: {
          title?: string
          subject?: string | null
          status?: string
          segment?: string
          sent_count?: number
          open_count?: number
          click_count?: number
          unsub_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lead_status: LeadStatus
      project_type: ProjectType
      engagement_model: EngagementModel
      timeline_option: TimelineOption
      interaction_type: InteractionType
      crm_request_status: CrmRequestStatus
      crm_inquiry_type: CrmInquiryType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
