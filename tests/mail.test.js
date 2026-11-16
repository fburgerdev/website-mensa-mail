const fs = require("fs");
const assert = require("assert");
const html = fs.readFileSync(process.argv[2] || "index.html", "utf8");
const pure = html.split("/*PURE-START*/")[1].split("/*PURE-END*/")[0];
const api = new Function(pure + "; return { buildMail, mailtoHref, isoWeek, cleanDish, cleanOwn, joinMissing, MENSEN, PRAISE, ABOUT };")();

// whole script parses
const script = html.split("<script>")[1].split("</script>")[0];
new Function(script);

// 1. full mail, tick order kept, "about" pinned last
let m = api.buildMail({ mensa: "suedstadt", when: "heute", dish: '  „Linsen-Dal“ ', picked: ["oefter", "lecker"], about: ["fleisch"], own: "Die Soße war super.\n\n\n\nGern wieder!", name: " Lena " });
assert.strictEqual(m.ok, true);
assert.strictEqual(m.subject, "Lob für „Linsen-Dal“ in der Mensa Südstadt");
assert.strictEqual(m.body,
  "Hallo,\n\nich habe heute in der Mensa Südstadt das Gericht „Linsen-Dal“ gegessen. Ich würde mich freuen, das öfter auf dem Plan zu sehen. Es hat richtig lecker geschmeckt. Übrigens: Ich esse sonst Fleisch.\n\nDie Soße war super.\n\nGern wieder!\n\nViele Grüße\nLena");
console.log(m.subject + "\n\n" + m.body + "\n");

// 2. nothing added beyond boxes: every sentence in the body is a box text, the intro, greeting, closing
m = api.buildMail({ mensa: "deutz", when: "woche", dish: "Chili sin Carne", picked: ["satt"], about: [], own: "", name: "" });
assert.strictEqual(m.body, "Hallo,\n\nich habe diese Woche in der Mensa Deutz das Gericht „Chili sin Carne“ gegessen. Ich bin gut satt geworden.\n\nViele Grüße");

// 3. validity
assert.deepStrictEqual(api.buildMail({ picked: [], about: [] }).missing, ["die Mensa", "das Gericht", "was gut war"]);
assert.strictEqual(api.buildMail({ mensa: "deutz", dish: "X", picked: [], about: ["fleisch"] }).ok, false, "meat box alone is not praise");
assert.strictEqual(api.buildMail({ mensa: "deutz", dish: "X", picked: [], about: [], own: "War gut" }).ok, true, "own words alone are enough");
assert.strictEqual(api.buildMail({ mensa: "nope", dish: "X", picked: ["satt"] }).ok, false);
assert.strictEqual(api.buildMail({ mensa: "deutz", dish: '""', picked: ["satt"] }).ok, false);

// 4. mailto
const href = api.mailtoHref("kueche@example.org", "Lob für „A & B“", "Zeile 1\nZeile 2 ?&#");
assert.ok(href.startsWith("mailto:kueche@example.org?subject="));
const u = new URL(href);
assert.strictEqual(u.searchParams.get("subject"), "Lob für „A & B“");
assert.strictEqual(u.searchParams.get("body"), "Zeile 1\r\nZeile 2 ?&#");
assert.ok(api.mailtoHref("", "s", "b").startsWith("mailto:?subject="));

// 5. ISO weeks
assert.strictEqual(api.isoWeek(new Date(2026, 10, 16)), "2026-W47");
assert.strictEqual(api.isoWeek(new Date(2026, 10, 22)), "2026-W47");
assert.strictEqual(api.isoWeek(new Date(2026, 10, 23)), "2026-W48");
assert.strictEqual(api.isoWeek(new Date(2027, 0, 1)), "2026-W53");
assert.strictEqual(api.isoWeek(new Date(2027, 0, 4)), "2027-W01");

assert.strictEqual(api.joinMissing(["a", "b", "c"]), "a, b und c");
assert.strictEqual(api.MENSEN.length, 11);
console.log("all checks passed");
