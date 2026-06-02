// ═══════════════════════════════════════════════
//  supabase.js — Supabase Bağlantı Ayarları
//  !! KURULUMDAN SONRA BURAYA KENDİ BİLGİLERİNİ GİR !!
// ═══════════════════════════════════════════════

const SUPABASE_URL  = 'https://fqkoixutvmhkasrhxgwi.supabase.co';       // örn: https://xyzabc.supabase.co
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa29peHV0dm1oa2Fzcmh4Z3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDA0MTgsImV4cCI6MjA5NTkxNjQxOH0.P2bDhDD_l-OuPVGnn-E_F_1HEmhUB6md22yiLGtOHuI';  // Project Settings > API > anon public

// Supabase istemcisini global yap (CDN'den gelecek)
// index.html ve admin.html'de <script> ile yükleniyor
window.SB_URL  = SUPABASE_URL;
window.SB_ANON = SUPABASE_ANON;
