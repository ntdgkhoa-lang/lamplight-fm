# Lamplight FM — channel website

Static site for a 24/7 chill music YouTube channel. Served by GitHub Pages.

## Change things

Everything editable is in `config.js`:

- `name`, `tagline` — channel name and one-liner
- `youtubeChannelId` — paste your `UC...` channel ID; the site then embeds your live stream automatically
- `youtubeChannelUrl` — link for the Subscribe buttons
- `schedule` — scenes by hour (channel time zone, default Asia/Bangkok)
- `artists`, `sampleTracks`

Images live in `assets/`.

## Now playing

The stream server can overwrite `now-playing.json` with:

```json
{ "title": "Window Seat", "artist": "Mây Chiều", "next": { "title": "Last Tram Home", "artist": "Uncle Hùng" } }
```

Until then the site cycles through `sampleTracks`.
