// Wochenzähler für die Mensa-Lob-Seite. Läuft als Cloudflare Worker mit einem KV-Speicher namens COUNTS.
// Speichert nur eine Zahl pro Kalenderwoche, nichts über die Leute.
//   GET  ?week=2026-W47  ->  {"count": 2}
//   POST ?week=2026-W47  ->  zählt eins hoch, {"count": 3}

const ALLOWED_ORIGIN = "*"; // nach dem Start auf "https://fburgerdev.github.io" setzen

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "access-control-allow-origin": ALLOWED_ORIGIN,
      "access-control-allow-methods": "GET, POST, OPTIONS"
    }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return reply({});
    const week = new URL(request.url).searchParams.get("week") || "";
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
