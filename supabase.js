// ═══════════════════════════════════════════════
//  supabase.js — Supabase Bağlantı Ayarları
//  !! KURULUMDAN SONRA BURAYA KENDİ BİLGİLERİNİ GİR !!
// ═══════════════════════════════════════════════

const SUPABASE_URL  = 'https://fqkoixutvmhkasrhxgwi.supabase.co/rest/v1/';       // örn: https://xyzabc.supabase.co
const SUPABASE_ANON = 'BURAYA_SUPABASE_ANON_KEY';  // Project Settings > API > anon public

// Supabase istemcisini global yap (CDN'den gelecek)
// index.html ve admin.html'de <script> ile yükleniyor
window.SB_URL  = SUPABASE_URL;
window.SB_ANON = SUPABASE_ANON;
