// Public configuration. Only the PUBLISHABLE (anon) key belongs here — never the secret/service-role key.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

export const SUPABASE_URL = 'https://mbkvafbsbhrbevznhzyq.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_eSxhlRHorHMLxDU4pq0rhg_ZOIbIfIf';

// Easy-to-edit site identity. Fill from your CV (no private contact details).
export const SITE = {
  name: "Dr. Kaleab A.",
  title: 'Medical Insights',
  portrait: 'assets/img/portrait.png',
  cv: 'assets/cv.pdf',
  bioShort: 'Medical doctor dedicated to evidence-based education on oncology, cardiometabolic disease, hypertension, diabetes, and preventive medicine.',
  links: { linkedin: '', orcid: '' }
};

export const configured = !SUPABASE_URL.includes('YOUR-PROJECT');
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
