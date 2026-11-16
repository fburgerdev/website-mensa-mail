# website-mensa-mail

Eine Seite, auf der Studierende in einer Minute eine kurze Lob-Mail an die Mensa-Küche des Kölner Studierendenwerks zusammenstellen, für ein veganes Gericht, das ihnen geschmeckt hat. Die Mail geht aus dem eigenen Mail-Programm raus (`mailto:`). In der Mail steht nur, was angekreuzt oder selbst geschrieben wurde.

Eine Seite von Plant-based Universities Köln.

## Dateien

- `index.html`: die ganze Seite. Einstellungen ganz oben im `<script>` unter `CONFIG`.
- `counter/worker.js`: der Wochenzähler (Cloudflare Worker), für das Limit von Mails pro Woche.
- `tests/mail.test.js`: prüft, wie die Mail zusammengesetzt wird. `npm test`.

## Einstellungen in `CONFIG`

- `recipient`: Empfängeradresse. Leer = Testmodus, die Mail öffnet sich ohne Empfänger und oben steht ein Hinweis.
- `weeklyLimit`: Mails pro Woche, zurzeit 3.
- `counterUrl`: Adresse des Zählers. Leer = kein Limit.

## Veröffentlichen mit GitHub Pages

1. Repo auf GitHub öffnen, **Settings → Pages**.
2. Unter **Build and deployment**: Source **Deploy from a branch**, Branch **main**, Ordner **/ (root)**, **Save**.
3. Nach ein bis zwei Minuten ist die Seite unter `https://fburgerdev.github.io/website-mensa-mail/` erreichbar.

Pages für ein privates Repo geht nur mit einem bezahlten GitHub-Plan. Bei einem kostenlosen Konto das Repo unter **Settings → General → Danger Zone → Change visibility** öffentlich stellen. Im Repo steht nichts Vertrauliches.

## Den Wochenzähler einrichten (Cloudflare, kostenlos)

1. Konto auf dash.cloudflare.com anlegen.
2. **Storage & Databases → KV → Create**, Name `mensa-lob-counts`.
3. **Compute → Workers & Pages → Create → Worker**, Name `mensa-lob`, **Deploy**, dann **Edit code**, den Inhalt von `counter/worker.js` einfügen, **Deploy**.
4. Im Worker: **Settings → Bindings → Add → KV namespace**, Variablenname `COUNTS`, Namespace `mensa-lob-counts`.
5. Die Adresse des Workers (`https://mensa-lob.<name>.workers.dev`) in `index.html` bei `counterUrl` eintragen.
