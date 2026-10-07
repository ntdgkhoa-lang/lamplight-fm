(function () {
  const S = window.SITE;
  const $ = (sel) => document.querySelector(sel);

  // ---- Fill in name / tagline / links from config ----
  document.title = S.name;
  document.querySelectorAll('[data-site="name"]').forEach((el) => (el.textContent = S.name));
  document.querySelectorAll('[data-site="tagline"]').forEach((el) => (el.textContent = S.tagline));
  document.querySelectorAll("[data-yt-link]").forEach((a) => {
    a.href = S.youtubeChannelUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });

  const isLive = Boolean(S.youtubeChannelId);
  if (!isLive) {
    $("#liveLabel").textContent = "Stream starting soon";
    document.querySelector(".eyebrow .dot").classList.add("soon");
  }

  // ---- Channel clock & current scene ----
  function channelHour() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: S.timeZone, hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date());
    const h = +parts.find((p) => p.type === "hour").value % 24;
    const m = +parts.find((p) => p.type === "minute").value;
    return { h, m, label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
  }
  function inSlot(slot, h) {
    return slot.start < slot.end ? h >= slot.start && h < slot.end : h >= slot.start || h < slot.end;
  }
  const fmt = (h) => `${String(h).padStart(2, "0")}:00`;

  let current = null;
  function setHero(slot) {
    $("#heroBg").style.backgroundImage = `url("${slot.image}")`;
    $("#sceneNow").textContent = slot.title;
    rain.setActive(slot.id === "rain" || slot.id === "night");
  }

  function renderSchedule() {
    const { h, label } = channelHour();
    $("#clock").textContent = label;
    const now = S.schedule.find((s) => inSlot(s, h)) || S.schedule[0];
    if (current && current.id === now.id) return;
    current = now;
    setHero(now);

    const ol = $("#slots");
    ol.innerHTML = "";
    S.schedule.forEach((s) => {
      const li = document.createElement("li");
      li.className = "slot" + (s.id === now.id ? " current" : "");
      li.tabIndex = 0;
      li.innerHTML = `
        ${s.id === now.id ? '<span class="badge">ON NOW</span>' : ""}
        <img src="${s.image}" alt="${s.title} scene" loading="lazy">
        <div class="body">
          <p class="time">${fmt(s.start)} – ${fmt(s.end)}</p>
          <h3>${s.title}</h3>
          <p class="mood">${s.mood}</p>
        </div>`;
      const preview = () => { setHero(s); window.scrollTo({ top: 0, behavior: "smooth" }); };
      li.addEventListener("click", preview);
      li.addEventListener("keydown", (e) => { if (e.key === "Enter") preview(); });
      ol.appendChild(li);
    });
  }

  // ---- Player ----
  function renderPlayer() {
    const el = $("#player");
    if (isLive) {
      el.innerHTML = `<iframe src="https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(S.youtubeChannelId)}&autoplay=0"
        title="${S.name} live stream" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    } else {
      el.innerHTML = `
        <div class="player-placeholder" style="background-image:url('assets/rain.jpg')"></div>
        <div class="player-msg">
          <h3>The lamp's on. The stream is almost here.</h3>
          <p>Subscribe on YouTube to catch the first broadcast.</p>
          <a class="btn" href="${S.youtubeChannelUrl}" target="_blank" rel="noopener">Subscribe</a>
        </div>`;
      $("#watchNote").textContent = "Going live soon. One room, one playlist, never off the air.";
    }
  }

  // ---- Artists ----
  function renderArtists() {
    $("#artistGrid").innerHTML = S.artists.map((a) => `
      <article class="artist-card">
        <img src="${a.image}" alt="Portrait of ${a.name}" loading="lazy">
        <div class="body">
          <p class="role">${a.role}</p>
          <h3>${a.name}</h3>
          <p class="bio">${a.bio}</p>
        </div>
      </article>`).join("");
  }

  // ---- Now playing ----
  // The stream server can publish now-playing.json: {"title","artist","next":{"title","artist"}}
  let idx = 0;
  function showTrack(t, next) {
    const title = $("#trackTitle"), artist = $("#trackArtist");
    title.style.opacity = artist.style.opacity = 0;
    setTimeout(() => {
      title.textContent = t.title;
      artist.textContent = t.artist;
      $("#trackNext").textContent = next ? `${next.title} · ${next.artist}` : "—";
      title.style.opacity = artist.style.opacity = 1;
    }, 350);
  }
  async function updateNowPlaying() {
    try {
      const r = await fetch("now-playing.json", { cache: "no-store" });
      if (r.ok) {
        const d = await r.json();
        if (d && d.title) return showTrack(d, d.next);
      }
    } catch (_) { /* fall back to sample list */ }
    const list = S.sampleTracks;
    showTrack(list[idx % list.length], list[(idx + 1) % list.length]);
    idx++;
  }

  // ---- Rain on the hero ----
  const rain = (function () {
    const c = $("#rain");
    const ctx = c.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let drops = [], active = false, raf = null;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((c.clientWidth * c.clientHeight) / 9000);
      drops = Array.from({ length: n }, () => ({
        x: Math.random() * c.clientWidth, y: Math.random() * c.clientHeight,
        l: 8 + Math.random() * 16, v: 4 + Math.random() * 6,
      }));
    }
    function frame() {
      ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
      ctx.strokeStyle = "rgba(200,220,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1.5, d.y + d.l);
        d.y += d.v; d.x -= 0.3;
        if (d.y > c.clientHeight) { d.y = -d.l; d.x = Math.random() * c.clientWidth; }
      }
      ctx.stroke();
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", resize);
    resize();
    return {
      setActive(on) {
        if (reduce) return;
        active = on;
        c.style.display = on ? "block" : "none";
        if (on && !raf) frame();
        if (!on && raf) { cancelAnimationFrame(raf); raf = null; }
      },
    };
  })();

  renderPlayer();
  renderArtists();
  renderSchedule();
  updateNowPlaying();
  setInterval(renderSchedule, 30 * 1000);
  setInterval(updateNowPlaying, 25 * 1000);
})();
