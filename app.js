// ═══════════════════════════════════════════════
//  app.js — Ridvanify Ana Uygulama Mantığı
//  Bağımlılık: data.js (Supabase)
// ═══════════════════════════════════════════════

const CATEGORIES = ["Tümü","ridvani","pop","soul","rnb","funk","hiphop","deephouse","afrohouse","afro","electronic","jazz","reggaeton","latin","classical"];
const CAT_LABELS = {
  "Tümü":"🔥 Tümü","ridvani":"👑 Ridvani","pop":"🎤 Pop","soul":"🎶 Soul",
  "rnb":"🎵 R&B","funk":"🎸 Funk","hiphop":"🎧 Hip Hop",
  "deephouse":"🌊 Deep House","afrohouse":"🌍 Afro House","afro":"🥁 Afro",
  "electronic":"⚡ Electronic","jazz":"🎷 Jazz","reggaeton":"🔥 Reggaeton",
  "latin":"💃 Latin","classical":"🎻 Classical"
};

// ─── STATE ───────────────────────────────────────
let playlist       = [];
let idx            = 0;
let playing        = false;
let liked          = new Set();
let shuffle        = false;
let repeat         = false;
let lyricsOpen     = false;
let activeCategory = "Tümü";

const audio = new Audio();
audio.volume = 0.75;

// ─── GREETING ────────────────────────────────────
(function setGreeting() {
  const h = new Date().getHours();
  const el = document.getElementById('greetingText');
  if (!el) return;
  if (h < 12) el.textContent = "Günaydın 🌅";
  else if (h < 18) el.textContent = "İyi öğlenler ☀️";
  else el.textContent = "İyi akşamlar 🌙";
})();

// ─── UTILS ───────────────────────────────────────
function fmt(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}
function esc(str) {
  return String(str || '').replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// ─── LOADING STATE ───────────────────────────────
function showLoading() {
  const g1 = document.getElementById('grid1');
  const g2 = document.getElementById('grid2');
  const loadHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  `;
  if (g1) g1.innerHTML = loadHTML;
  if (g2) g2.innerHTML = '';
}

// ─── LIBRARY SIDEBAR ─────────────────────────────
function renderLibrary() {
  const el = document.getElementById('libraryList');
  if (!el) return;
  el.innerHTML = window.SONGS.slice(0, 8).map(s => `
    <div class="lib-item" data-sid="${s.id}">
      <div class="lib-icon ${s.exclusive ? 'special' : 'regular'}">
        <i class="fas ${s.icon || 'fa-music'}"></i>
      </div>
      <div class="lib-info">
        <div class="lib-title">${esc(s.title)}</div>
        <div class="lib-sub">${esc(s.artist)}</div>
      </div>
    </div>
  `).join('');
  el.querySelectorAll('.lib-item').forEach(li =>
    li.addEventListener('click', () => playSongById(li.dataset.sid))
  );
}

// ─── CATEGORIES ──────────────────────────────────
function renderCategories() {
  const row = document.getElementById('catRow');
  if (!row) return;
  row.innerHTML = CATEGORIES.map(c => `
    <button class="cat-pill ${activeCategory === c ? 'active' : ''}" data-cat="${c}">
      ${CAT_LABELS[c] || c}
    </button>
  `).join('');
  row.querySelectorAll('.cat-pill').forEach(btn =>
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderCategories();
      renderGrids();
    })
  );
}

// ─── GRID RENDERING ──────────────────────────────
function filtered() {
  let list = [...window.SONGS];
  if (activeCategory !== "Tümü") list = list.filter(s => s.category === activeCategory);
  const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  if (q) list = list.filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
  return list;
}

function cardHTML(s, animDelay = 0) {
  const isCurrent = playlist[idx]?.id === s.id;
  return `
    <div class="music-card ${isCurrent ? 'is-playing' : ''}" data-sid="${s.id}" style="animation-delay:${animDelay}ms">
      <div class="card-thumb">
        ${s.img ? `<img src="${esc(s.img)}" alt="${esc(s.title)}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
        <div class="thumb-placeholder" ${s.img ? 'style="display:none"' : ''}>
          <i class="fas ${s.icon || 'fa-music'}"></i>
        </div>
        <div class="badge-row">
          ${s.exclusive ? '<span class="badge badge-exclusive">Exclusive</span>' : ''}
          ${s.diss ? '<span class="badge badge-diss">Diss</span>' : ''}
        </div>
        <div class="play-overlay ${isCurrent ? 'playing-indicator' : ''}">
          ${isCurrent
            ? `<div class="playing-bars ${playing ? '' : 'paused'}">
                <div class="playing-bar"></div><div class="playing-bar"></div><div class="playing-bar"></div>
               </div>`
            : `<i class="fas fa-play" style="margin-left:2px"></i>`}
        </div>
      </div>
      <div class="card-title">${esc(s.title)}</div>
      <div class="card-artist">${esc(s.artist)}</div>
    </div>
  `;
}

function renderGrids() {
  const list    = filtered();
  const g1      = document.getElementById('grid1');
  const g2      = document.getElementById('grid2');
  const sec2    = document.getElementById('section2Wrap');
  const s1title = document.getElementById('section1Title');
  if (!g1) return;

  const ridvani = list.filter(s => s.category === 'ridvani');
  const others  = list.filter(s => s.category !== 'ridvani');

  if (activeCategory === 'ridvani' || activeCategory === 'Tümü') {
    if (s1title) s1title.textContent = '🔥 Ridvani Exclusive';
    g1.innerHTML = (ridvani.length ? ridvani : list).map((s,i) => cardHTML(s, i*40)).join('');
    if (others.length && activeCategory === 'Tümü') {
      if (sec2) sec2.style.display = '';
      if (g2) g2.innerHTML = others.map((s,i) => cardHTML(s, i*40)).join('');
    } else {
      if (sec2) sec2.style.display = 'none';
    }
  } else {
    if (s1title) s1title.textContent = '🎧 Keşfet';
    g1.innerHTML = list.length
      ? list.map((s,i) => cardHTML(s, i*40)).join('')
      : `<div class="no-results"><i class="fas fa-search"></i><br>Sonuç bulunamadı</div>`;
    if (sec2) sec2.style.display = 'none';
  }

  document.querySelectorAll('.music-card[data-sid]').forEach(card =>
    card.addEventListener('click', () => playSongById(card.dataset.sid))
  );
}

// ─── PLAYER LOGIC ────────────────────────────────
function playSongById(sid) {
  // sid string veya number olabilir, id'ler Supabase'de integer
  const sidNum = parseInt(sid);
  const list = filtered().length ? filtered() : window.SONGS;
  const newIdx = list.findIndex(s => s.id === sidNum);
  if (newIdx === -1) return;
  playlist = [...list];
  idx = newIdx;
  loadSong(true);
}

function loadSong(autoPlay = false) {
  const song = playlist[idx];
  if (!song) return;
  audio.src = song.src;
  audio.load();
  updatePlayerUI(song);
  if (autoPlay) {
    audio.play()
      .then(() => { playing = true; updatePlayBtnIcon(); renderGrids(); })
      .catch(() => {});
  } else {
    renderGrids();
  }
  if (lyricsOpen) renderLyricsContent(song);
}

function updatePlayerUI(song) {
  setText('playerSong', song.title);
  setText('playerArtist', song.artist);
  setText('lyricsPanelSong', song.title);
  setText('lyricsPanelArtist', song.artist);
  setText('lyricsSongName', song.title);
  setText('lyricsArtistName', song.artist);

  const artEl  = document.getElementById('playerArt');
  const lyrArt = document.getElementById('lyricsArt');
  const icon   = song.icon || 'fa-music';

  if (artEl) artEl.innerHTML = song.img
    ? `<img src="${esc(song.img)}" alt="" onerror="this.parentElement.innerHTML='<div class=player-art-icon><i class=fas\\ ${icon}></i></div>'">`
    : `<div class="player-art-icon"><i class="fas ${icon}"></i></div>`;
  if (lyrArt) lyrArt.innerHTML = song.img
    ? `<img src="${esc(song.img)}" alt="" onerror="this.parentElement.innerHTML='<div class=lyrics-art-icon><i class=fas\\ ${icon}></i></div>'">`
    : `<div class="lyrics-art-icon"><i class="fas ${icon}"></i></div>`;

  const heartBtn = document.getElementById('heartBtn');
  if (heartBtn) heartBtn.className = `heart-btn${liked.has(song.id) ? ' liked' : ''}`;

  setText('timeCurrent', '0:00');
  setText('timeTotal', song.duration ? fmt(song.duration) : '0:00');
  const pf = document.getElementById('progressFill');
  if (pf) pf.style.width = '0%';
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function updatePlayBtnIcon() {
  const btn = document.getElementById('playBtn');
  if (btn) btn.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}
function togglePlay() {
  if (!playlist.length) return;
  if (!audio.src || audio.src === window.location.href) { loadSong(true); return; }
  if (playing) { audio.pause(); playing = false; }
  else { audio.play(); playing = true; }
  updatePlayBtnIcon();
  renderGrids();
}
function next() {
  if (!playlist.length) return;
  if (shuffle) idx = Math.floor(Math.random() * playlist.length);
  else idx = (idx + 1) % playlist.length;
  loadSong(playing);
}
function prev() {
  if (!playlist.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  idx = (idx - 1 + playlist.length) % playlist.length;
  loadSong(playing);
}

// ─── AUDIO EVENTS ────────────────────────────────
audio.addEventListener('timeupdate', () => {
  if (!audio.duration || isNaN(audio.duration)) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  const pf = document.getElementById('progressFill');
  if (pf) pf.style.width = pct + '%';
  setText('timeCurrent', fmt(audio.currentTime));
  setText('timeTotal', fmt(audio.duration));
});
audio.addEventListener('ended', () => { if (repeat) { audio.currentTime = 0; audio.play(); } else next(); });
audio.addEventListener('play',  () => { playing = true;  updatePlayBtnIcon(); renderGrids(); });
audio.addEventListener('pause', () => { playing = false; updatePlayBtnIcon(); renderGrids(); });

// ─── CONTROL BINDINGS ────────────────────────────
function bindEl(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', fn);
}
bindEl('playBtn', togglePlay);
bindEl('prevBtn', prev);
bindEl('nextBtn', next);
bindEl('shuffleBtn', () => {
  shuffle = !shuffle;
  document.getElementById('shuffleBtn')?.classList.toggle('active', shuffle);
});
bindEl('repeatBtn', () => {
  repeat = !repeat;
  document.getElementById('repeatBtn')?.classList.toggle('active', repeat);
});
bindEl('heartBtn', () => {
  const song = playlist[idx];
  if (!song) return;
  if (liked.has(song.id)) liked.delete(song.id); else liked.add(song.id);
  document.getElementById('heartBtn')?.classList.toggle('liked', liked.has(song.id));
});

const progressTrack = document.getElementById('progressTrack');
if (progressTrack) {
  progressTrack.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
}

const volSlider = document.getElementById('volSlider');
const volIcon   = document.getElementById('volIcon');
let lastVol = 75;
function updateVolIcon(v) {
  const i = volIcon?.querySelector('i');
  if (!i) return;
  if (v === 0) i.className = 'fas fa-volume-xmark';
  else if (v < 40) i.className = 'fas fa-volume-low';
  else i.className = 'fas fa-volume-high';
}
if (volSlider) volSlider.addEventListener('input', e => {
  audio.volume = e.target.value / 100;
  lastVol = +e.target.value;
  updateVolIcon(+e.target.value);
});
if (volIcon) volIcon.addEventListener('click', () => {
  if (audio.volume > 0) { audio.volume = 0; if (volSlider) volSlider.value = 0; updateVolIcon(0); }
  else { audio.volume = lastVol / 100; if (volSlider) volSlider.value = lastVol; updateVolIcon(lastVol); }
});

const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('input', renderGrids);

// ─── LYRICS PANEL ────────────────────────────────
const lyricsPanel     = document.getElementById('lyricsPanel');
const lyricsToggleBtn = document.getElementById('lyricsToggleBtn');
const lyricsClose     = document.getElementById('lyricsClose');

function toggleLyrics() {
  lyricsOpen = !lyricsOpen;
  lyricsPanel?.classList.toggle('open', lyricsOpen);
  lyricsToggleBtn?.classList.toggle('open', lyricsOpen);
  if (lyricsOpen) renderLyricsContent(playlist[idx]);
}
lyricsToggleBtn?.addEventListener('click', toggleLyrics);
lyricsClose?.addEventListener('click', toggleLyrics);

function renderLyricsContent(song) {
  const content = document.getElementById('lyricsContent');
  if (!content) return;
  if (!song) { content.innerHTML = `<div class="lyrics-empty"><i class="fas fa-microphone-slash"></i><p>Bir şarkı seçerek<br>sözleri görüntüle.</p></div>`; return; }
  if (!song.lyrics || song.lyrics.length === 0) { content.innerHTML = `<div class="lyrics-empty"><i class="fas fa-music"></i><p>Bu şarkı için henüz<br>söz eklenmemiş.</p></div>`; return; }
  content.innerHTML = `<div class="lyrics-verses">${
    song.lyrics.map((verse, vi) => `
      <div class="verse-block" style="animation-delay:${vi * 80}ms">
        <div class="verse-label">${esc(verse.label || 'Bölüm')}</div>
        <div class="verse-lines">${verse.lines.map(line =>
          line.trim() ? `<div class="lyric-line">${esc(line)}</div>` : `<div class="lyric-line" style="height:6px;"></div>`
        ).join('')}</div>
      </div>`).join('')
  }</div>`;
}

// ─── INIT (async) ────────────────────────────────
async function init() {
  showLoading();
  renderCategories();

  try {
    window.SONGS = await window.loadSongsFromDB();
  } catch (e) {
    console.error('Şarkılar yüklenemedi:', e);
    window.SONGS = [];
  }

  playlist = [...window.SONGS];
  renderLibrary();
  renderGrids();
  if (playlist.length) updatePlayerUI(playlist[0]);
}

// Supabase Realtime: admin'den eklenen/silinen şarkılar
// anlık yansısın (ayrı sekme veya cihazda)
function setupRealtime() {
  try {
    const sb = supabase.createClient(window.SB_URL, window.SB_ANON);
    sb.channel('songs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, async () => {
        const currentId = playlist[idx]?.id ?? null;
        window.SONGS = await window.loadSongsFromDB();
        playlist = [...window.SONGS];
        if (currentId !== null) {
          const newIdx = playlist.findIndex(s => s.id === currentId);
          if (newIdx !== -1) idx = newIdx;
        }
        renderLibrary();
        renderGrids();
      })
      .subscribe();
  } catch(e) {
    // Realtime isteğe bağlı, hata olursa sessizce geç
  }
}

init().then(() => setupRealtime());
