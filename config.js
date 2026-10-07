// Everything you'd normally want to change lives here.
window.SITE = {
  name: "Lamplight FM",
  tagline: "Cozy 3D rooms and slow music, live around the clock.",

  // Paste your YouTube channel ID (starts with "UC...") when the channel exists.
  // The site then embeds whatever you're streaming live, automatically.
  youtubeChannelId: "",
  youtubeChannelUrl: "https://www.youtube.com/",

  // Channel time zone: the schedule follows this clock.
  timeZone: "Asia/Bangkok",

  // Scenes rotate through the day. start/end are hours in the channel time zone.
  schedule: [
    { id: "morning", start: 6,  end: 11, title: "Morning Café",   mood: "Warm keys, soft brushes, first coffee.", image: "assets/morning.jpg" },
    { id: "study",   start: 11, end: 17, title: "Attic Study",    mood: "Steady beats for focus. No vocals.",      image: "assets/study.jpg" },
    { id: "golden",  start: 17, end: 20, title: "Golden Hour",    mood: "Acoustic guitar over the rooftops.",      image: "assets/golden.jpg" },
    { id: "rain",    start: 20, end: 2,  title: "Rainy Loft",     mood: "Rain on the window, vinyl crackle.",      image: "assets/rain.jpg" },
    { id: "night",   start: 2,  end: 6,  title: "3 AM Quiet",     mood: "Ambient, slow, almost asleep.",           image: "assets/night.jpg" }
  ],

  // The house artists. Invented characters, each with their own sound.
  artists: [
    { name: "Mây Chiều", role: "Lo-fi piano", bio: "Records late-afternoon piano loops in a room full of plants. Plays mornings and study hours.", image: "assets/artist-may.jpg" },
    { name: "Uncle Hùng", role: "Jazz-hop saxophone", bio: "Forty years of bar gigs, now slowed down to 72 BPM. Owns the golden hour.", image: "assets/artist-hung.jpg" },
    { name: "Mochi", role: "Beats & vinyl", bio: "A tabby who only works nights. Nobody knows who taught him to scratch.", image: "assets/artist-mochi.jpg" }
  ],

  // Shown until the stream server starts publishing now-playing.json.
  sampleTracks: [
    { title: "Window Seat", artist: "Mây Chiều" },
    { title: "Last Tram Home", artist: "Uncle Hùng" },
    { title: "Purr Loop No. 4", artist: "Mochi" },
    { title: "Steam & Sugar", artist: "Mây Chiều" },
    { title: "Monsoon Notes", artist: "Uncle Hùng" }
  ]
};
