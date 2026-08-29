import type {
  AdminInquiry,
  AdminTestimonial,
  GalleryCategory,
  Photo,
  Service,
  Stat,
  Testimonial,
} from '../types';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`La petición falló (${res.status})`);
  return (await res.json()) as T;
}

export const fetchServices = (): Promise<Service[]> => request('/api/services');
export const fetchTestimonials = (): Promise<Testimonial[]> => request('/api/testimonials');
export const fetchStats = (): Promise<Stat[]> => request('/api/stats');
export const fetchPhotos = (): Promise<Photo[]> => request('/api/photos');
export const fetchCategories = (): Promise<GalleryCategory[]> =>
  request<GalleryCategory[]>('/api/photos/categories');

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  sessionType: string;
  eventDate?: string;
  message: string;
  lang?: 'en' | 'es';
  website?: string;
}

export interface SendInquiryResult {
  ok: boolean;
  /** Segundos restantes si el mismo correo ya envió hace poco (devolverá false). */
  blockedUntil?: number;
  error?: string;
}

export async function sendInquiry(payload: InquiryPayload): Promise<SendInquiryResult> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (res.ok) return { ok: true };

  const obj = (data ?? {}) as {
    errors?: string[];
    retryAfter?: number;
  };
  const errors = Array.isArray(obj.errors) ? obj.errors : null;

  if (res.status === 429 && obj.retryAfter) {
    return {
      ok: false,
      blockedUntil: obj.retryAfter,
      error: errors ? errors.join(' ') : 'You have already sent a request recently. Please wait a few minutes.',
    };
  }

  return {
    ok: false,
    error: errors ? errors.join(' ') : 'We could not send your message. Please try again.',
  };
}

export async function fetchAvailability(): Promise<string[]> {
  try {
    const res = await fetch('/api/availability');
    if (!res.ok) return [];
    return (await res.json()) as string[];
  } catch {
    return [];
  }
}

const ADMIN_KEY_STORAGE = 'mc-admin-key';

export class AdminAuthError extends Error {
  constructor() {
    super('No autorizado');
  }
}

function adminHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-admin-key': sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? '',
  };
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { ...options, headers: adminHeaders() });
  if (res.status === 401) throw new AdminAuthError();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data === 'object' && data !== null && typeof (data as { error?: string }).error === 'string'
        ? (data as { error: string }).error
        : 'Ocurrió un error. Intenta de nuevo.'
    );
  }
  return data as T;
}

export function saveAdminKey(key: string): void {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey(): void {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
}

export function getStoredAdminKey(): string {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? '';
}

export function adminFetchInquiries(): Promise<AdminInquiry[]> {
  return adminRequest<AdminInquiry[]>('/api/admin/inquiries');
}

export function adminDecideInquiry(
  id: number,
  status: 'accepted' | 'declined',
  note?: string
): Promise<unknown> {
  return adminRequest(`/api/admin/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

export function adminSendCustomMail(id: number, message: string): Promise<unknown> {
  return adminRequest(`/api/admin/inquiries/${id}/custom-mail`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

/* ---------- Reseñas ---------- */

export interface ReviewPayload {
  author: string;
  rating: number;
  quote: string;
}

export async function submitTestimonial(payload: ReviewPayload): Promise<void> {
  const res = await fetch('/api/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('No se pudo enviar la reseña.');
}

export function adminFetchTestimonials(): Promise<AdminTestimonial[]> {
  return adminRequest<AdminTestimonial[]>('/api/admin/testimonials');
}

export function adminSetTestimonialApproved(id: number, approved: boolean): Promise<unknown> {
  return adminRequest(`/api/admin/testimonials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ approved }),
  });
}

export function adminDeleteTestimonial(id: number): Promise<unknown> {
  return adminRequest(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
}

/* ---------- Excel ---------- */

export async function downloadInquiriesExcel(): Promise<void> {
  const res = await fetch('/api/admin/inquiries.xlsx', { headers: adminHeaders() });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error('No se pudo generar el Excel.');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Fotos (subida desde el panel) ---------- */

export interface UploadPhotoInput {
  file: File;
  categoryId: number;
  alt: string;
  altEn: string;
  orientation: 'portrait' | 'landscape';
  width?: number;
  height?: number;
}

export async function adminUploadPhoto(input: UploadPhotoInput): Promise<Photo> {
  const body = new FormData();
  body.append('photo', input.file);
  body.append('categoryId', String(input.categoryId));
  body.append('alt', input.alt);
  body.append('altEn', input.altEn);
  body.append('orientation', input.orientation);
  if (input.width && input.width > 0) body.append('width', String(input.width));
  if (input.height && input.height > 0) body.append('height', String(input.height));

  const res = await fetch('/api/admin/photos', {
    method: 'POST',
    headers: { 'x-admin-key': sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? '' },
    body,
  });
  if (res.status === 401) throw new AdminAuthError();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data === 'object' && data !== null && typeof (data as { error?: string }).error === 'string'
        ? (data as { error: string }).error
        : 'No se pudo subir la foto.'
    );
  }
  return data as Photo;
}

export function adminDeletePhoto(id: number): Promise<unknown> {
  return adminRequest(`/api/admin/photos/${id}`, { method: 'DELETE' });
}
