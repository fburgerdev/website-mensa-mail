// Cloudflare Worker für die Mensa-Lob-Seite.
// Die Seite selbst (public/) liefert Cloudflare direkt aus. Hier landet nur, was keine Datei ist:
//   GET  /api/count?week=2026-W47  ->  {"count": 2}
//   POST /api/count?week=2026-W47  ->  zählt eins hoch, {"count": 3}
// Gespeichert wird nur eine Zahl pro Kalenderwoche im KV-Speicher COUNTS, nichts über die Leute.

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/count") return env.ASSETS.fetch(request);

    const week = url.searchParams.get("week") || "";
    if (!/^\d{4}-W\d{2}$/.test(week)) return reply({ error: "week fehlt" }, 400);

    const key = "week:" + week;
    let count = parseInt((await env.COUNTS.get(key)) || "0", 10) || 0;

    if (request.method === "POST") {
      count += 1;
      // nach 60 Tagen von selbst gelöscht
      await env.COUNTS.put(key, String(count), { expirationTtl: 60 * 24 * 3600 });
    } else if (request.method !== "GET") {
      return reply({ error: "nur GET und POST" }, 405);
    }
    return reply({ count });
  }
};
