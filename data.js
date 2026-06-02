// ═══════════════════════════════════════════════
//  data.js — Şarkı Verisi
//  Admin panelinden (admin.html) düzenlenebilir.
//  localStorage'a kaydedilir; yoksa bu liste kullanılır.
// ═══════════════════════════════════════════════

const DEFAULT_SONGS = [
  {
    id: 1,
    title: "Patlaticam",
    artist: "Ridvani",
    category: "ridvani",
    src: "https://files.catbox.moe/bkxltz.mp3",
    icon: "fa-bomb",
    img: "",
    exclusive: true,
    diss: false,
    lyrics: [
      {
        label: "Verse",
        lines: [
          "ridvani patlaticam",
          "ridvani patlaticam",
          "pat-pat-pat-pat-patlaticam!",
          "",
          "ridvani patlaticam",
          "ridvani patlaticam",
          "ridvani patlaticam",
          "",
          "(pat-pat-pat-pat-pat-pat)",
          "pat-pat-patlaticam",
          "",
          "ridvani patlaticam",
          "ridvani patlaticam",
          "ridvani patlaticam",
          "pat-pat-pat-pat-patlaticam",
          "",
          "♫",
          "",
          "patlaticam!",
          "",
          "♫",
          "",
          "(pat-pat-pat-pat) pat-patlaticam!"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Lovesmasher",
    artist: "Enes",
    category: "ridvani",
    src: "https://files.catbox.moe/opqrw6.mp3",
    icon: "fa-heart-crack",
    img: "",
    exclusive: true,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["Aşk ezilir", "Kalpler kırılır", "Ridvan vurur", "Lovesmasher"]
      }
    ]
  },
  {
    id: 3,
    title: "Rido & Enes Diss",
    artist: "Rido, Enes",
    category: "ridvani",
    src: "https://files.catbox.moe/v3zmt1.mp3",
    icon: "fa-skull-crossbones",
    img: "",
    exclusive: true,
    diss: true,
    lyrics: [
      {
        label: "Diss",
        lines: ["Sokak konuşur", "Rido ve Enes", "Beat çarpar", "Sözler sert"]
      }
    ]
  },
  {
    id: 4,
    title: "Zindan Senfonisi",
    artist: "Berkay",
    category: "ridvani",
    src: "https://files.catbox.moe/ybvp1z.mp3",
    icon: "fa-dungeon",
    img: "",
    exclusive: true,
    diss: false,
    lyrics: [
      {
        label: "Verse 1",
        lines: [
          "Rıdvan sokaklarda dolaşır sessiz adım,",
          "Ayak parmağı taşta, yine de devam yarın.",
          "Garanti banka ekranında rakamlar akar,",
          "Paribu ve Binance arasında döviz savrular.",
          "",
          "İzolasyon odasında düşünceler zindan,",
          "Aptal kararlar bıraktı izleri her yandan.",
          "Carpediem derken geçti yıllar bir anda,",
          "Papatya soldu bazen betonun yanında."
        ]
      },
      {
        label: "Nakarat",
        lines: [
          "Bu bir parti değil, hayatın provası,",
          "Savaş gibi günler, yok bunun molası.",
          "Willy Wonka düşleri gerçeklere çarpar,",
          "Karanlıkta yürürken umut yine parlar."
        ]
      },
      {
        label: "Verse 2",
        lines: [
          "Anneler bekler hâlâ ışığı pencerede,",
          "Kimi kaybolmuş gider kendi bilmecesinde.",
          "Sürtük dedikleri sözler havada kalır,",
          "İnsan insanı kırar, sonra yalnız kalır.",
          "",
          "Döviz yükselir, düşer, şehir aynı şehir,",
          "Zindan gibi sokaklar bazen ağır gelir.",
          "Papatya filiz verir çatlamış asfaltta,",
          "Carpediem yankılanır gecenin ortasında."
        ]
      },
      {
        label: "Bridge",
        lines: [
          "Bir adım ileri, iki adım geri,",
          "Kimse bilmiyor sonunu bu filmin.",
          "Savaş içimizde, sessiz ve derin,",
          "Yine de devam eder hikâyemiz."
        ]
      },
      {
        label: "Nakarat",
        lines: [
          "Bu bir parti değil, hayatın provası,",
          "Savaş gibi günler, yok bunun molası.",
          "Willy Wonka düşleri gerçeklere çarpar,",
          "Karanlıkta yürürken umut yine parlar."
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Blinding Lights",
    artist: "The Weeknd",
    category: "pop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    icon: "fa-sun",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Kıta",
        lines: ["I'm blinded by the lights", "No, I can't sleep until I feel your touch"]
      }
    ]
  },
  {
    id: 6,
    title: "Rolling in the Deep",
    artist: "Adele",
    category: "pop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    icon: "fa-water",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["We could have had it all", "Rolling in the deep"]
      }
    ]
  },
  {
    id: 7,
    title: "Lose Control",
    artist: "Teddy Swims",
    category: "soul",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    icon: "fa-heart",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Verse",
        lines: ["Losing control", "Can't help myself"]
      }
    ]
  },
  {
    id: 8,
    title: "Houdini",
    artist: "Dua Lipa",
    category: "pop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    icon: "fa-wand-sparkles",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["Houdini, I come and go"]
      }
    ]
  },
  {
    id: 9,
    title: "Starboy",
    artist: "The Weeknd",
    category: "rnb",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    icon: "fa-rocket",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["I'm a Starboy", "Look what you've done"]
      }
    ]
  },
  {
    id: 10,
    title: "Levitating",
    artist: "Dua Lipa",
    category: "pop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    icon: "fa-star",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["You got me levitating", "Baby, let me take you high"]
      }
    ]
  },
  {
    id: 11,
    title: "Uptown Funk",
    artist: "Bruno Mars",
    category: "funk",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    icon: "fa-drumstick-bite",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["Uptown funk you up"]
      }
    ]
  },
  {
    id: 12,
    title: "Rockstar",
    artist: "Post Malone",
    category: "hiphop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    icon: "fa-guitar",
    img: "",
    exclusive: false,
    diss: false,
    lyrics: [
      {
        label: "Nakarat",
        lines: ["I feel just like a rockstar"]
      }
    ]
  }
];

// localStorage'dan yükle, yoksa default'u kullan
function loadSongs() {
  try {
    const stored = localStorage.getItem("ridvanify_songs");
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return DEFAULT_SONGS;
}

function saveSongs(songs) {
  localStorage.setItem("ridvanify_songs", JSON.stringify(songs));
}

// Global SONGS dizisi
window.SONGS = loadSongs();
window.saveSongs = saveSongs;
window.DEFAULT_SONGS = DEFAULT_SONGS;
