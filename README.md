# website-mensa-mail

Eine Seite, auf der Studierende in einer Minute eine kurze Lob-Mail an die Mensa-Küche des Kölner Studierendenwerks zusammenstellen, für ein veganes Gericht, das ihnen geschmeckt hat. Die Mail geht aus dem eigenen Mail-Programm raus (`mailto:`). In der Mail steht nur, was angekreuzt oder selbst geschrieben wurde.

Eine Seite von Plant-based Universities Köln.

Live: https://website-mensa-mail.florianburger03.workers.dev

## Dateien

- `public/index.html`: die ganze Seite. Einstellungen ganz oben im `<script>` unter `CONFIG`.
- `counter/worker.js`: zählt unter `/api/count`, wie viele Mails pro Woche gestartet werden, für das Wochenlimit. Speichert nur eine Zahl pro Woche.
- `wrangler.jsonc`: Cloudflare-Einstellungen, mit dem KV-Speicher `COUNTS`.
- `tests/mail.test.js`: prüft, wie die Mail zusammengesetzt wird. `npm test`.

## Einstellungen in `CONFIG`

- `recipient`: Empfängeradresse. Leer = Testmodus, die Mail öffnet sich ohne Empfänger und oben steht ein Hinweis.
- `weeklyLimit`: Mails pro Woche, zurzeit 3.
- `counterUrl`: Adresse des Zählers, `/api/count`. Ist er nicht erreichbar, bleibt die Seite offen.

## Veröffentlichen

Cloudflare Workers ist mit diesem Repo verbunden und veröffentlicht jede Änderung auf `main` von selbst. GitHub Pages wird nicht gebraucht.

Den Zählerstand dieser Woche sieht man unter `/api/count?week=2026-W47` (Kalenderwoche anpassen).
