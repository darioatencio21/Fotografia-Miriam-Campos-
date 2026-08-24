export interface Service {
  id: number;
  slug: string;
  title: string;
  title_en: string;
  tagline: string;
  tagline_en: string;
  description: string;
  description_en: string;
  image_url: string;
  duration: string;
  duration_en: string;
  location_note: string;
  location_note_en: string;
  deliverables: { es: string[]; en: string[] };
  price_from: number;
}

export interface Testimonial {
  id: number;
  author: string;
  session_type: string;
  session_type_en: string;
  quote: string;
  quote_en: string;
  rating: number;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  label_en: string;
  description: string;
  description_en: string;
}

export interface GalleryCategory {
  id: number;
  slug: string;
  label: string;
  label_en: string;
}
export interface Photo {
  id: number;
  src: string;
  alt: string;
  alt_en: string;
  orientation: 'portrait' | 'landscape';
  width?: number | null;
  height?: number | null;
  category_id: number;
  category_slug: string;
  category_label: string;
  category_label_en?: string | null;
}

export type InquiryStatus = 'pending' | 'accepted' | 'declined';

export interface AdminTestimonial extends Testimonial {
  approved: boolean;
  created_at: string;
}

export interface AdminInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  session_type: string;
  event_date: string | null;
  message: string;
  lang: 'en' | 'es';
  status: InquiryStatus;
  admin_note: string | null;
  responded_at: string | null;
  created_at: string;
}
