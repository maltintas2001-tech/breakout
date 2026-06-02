// ═══════════════════════════════════════════════
//  data.js — Supabase entegrasyonlu veri katmanı
//  Şarkılar Supabase'deki "songs" tablosundan gelir.
// ═══════════════════════════════════════════════

// Supabase JS SDK (CDN) global olarak "supabase" namespace'ini açar.
// index.html / admin.html'deki script sırası:
//   1. supabase CDN
//   2. supabase.js  (URL + KEY)
//   3. data.js      (bu dosya)
//   4. app.js / admin script

let _sbClient = null;

function getSB() {
  if (_sbClient) return _sbClient;
  _sbClient = supabase.createClient(window.SB_URL, window.SB_ANON);
  return _sbClient;
}

// ─── OKUMA ──────────────────────────────────────
// Tüm şarkıları Supabase'den çek.
// created_at sütununa göre sıralı döner.
async function loadSongsFromDB() {
  const sb = getSB();
  const { data, error } = await sb
    .from('songs')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase okuma hatası:', error.message);
    return [];
  }

  // Supabase satırlarını uygulama formatına çevir
  return data.map(row => ({
    id:        row.id,
    title:     row.title,
    artist:    row.artist,
    category:  row.category,
    src:       row.src,
    img:       row.img || '',
    icon:      row.icon || 'fa-music',
    exclusive: row.exclusive || false,
    diss:      row.diss || false,
    lyrics:    row.lyrics || [],
    duration:  row.duration || null,
  }));
}

// ─── YAZMA (Admin) ───────────────────────────────
// Yeni şarkı ekle
async function insertSong(songData) {
  const sb = getSB();
  const { data, error } = await sb
    .from('songs')
    .insert([toRow(songData)])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Mevcut şarkıyı güncelle
async function updateSong(id, songData) {
  const sb = getSB();
  const { error } = await sb
    .from('songs')
    .update(toRow(songData))
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// Şarkı sil
async function deleteSongFromDB(id) {
  const sb = getSB();
  const { error } = await sb
    .from('songs')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ─── YARDIMCI ────────────────────────────────────
// Uygulama nesnesini → Supabase satırına dönüştür
function toRow(s) {
  return {
    title:     s.title,
    artist:    s.artist,
    category:  s.category,
    src:       s.src,
    img:       s.img || null,
    icon:      s.icon || 'fa-music',
    exclusive: s.exclusive || false,
    diss:      s.diss || false,
    lyrics:    s.lyrics || [],
    duration:  s.duration || null,
  };
}

// Global erişim
window.loadSongsFromDB = loadSongsFromDB;
window.insertSong      = insertSong;
window.updateSong      = updateSong;
window.deleteSongFromDB = deleteSongFromDB;
window.SONGS = []; // init'te dolacak
