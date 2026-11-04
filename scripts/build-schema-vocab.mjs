/**
 * Regenerates scripts/lib/schema-vocab.json from the published schema.org
 * vocabulary. validate-schema.mjs reads the JSON so the build needs no
 * network; run this only when we start using a type or property newer than
 * the vendored copy (validate-schema names the term when that happens).
 *
 *   node scripts/build-schema-vocab.mjs
 */
import { writeFile } from "node:fs/promises";

const SOURCE = "https://schema.org/version/latest/schemaorg-current-https.jsonld";
const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${SOURCE} returned ${res.status}`);
const { "@graph": graph } = await res.json();

const list = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const name = (id) => id.replace(/^schema:/, "");
const types = (n) => list(n["@type"]);

const classes = {};
const properties = {};
const enumMembers = {};
for (const n of graph) {
  const id = name(n["@id"]);
  if (types(n).includes("rdfs:Class")) {
    classes[id] = list(n["rdfs:subClassOf"]).map((s) => name(s["@id"]));
  }
  if (types(n).includes("rdf:Property")) {
    properties[id] = list(n["schema:domainIncludes"]).map((d) => name(d["@id"]));
  }
  // Enumeration members (https://schema.org/InStock, …) are typed by their
  // enumeration rather than declared as classes.
  for (const t of types(n)) {
    if (t.startsWith("schema:")) enumMembers[id] = name(t);
  }
}

const version = res.headers.get("last-modified") ?? new Date().toISOString();
await writeFile(
  new URL("./lib/schema-vocab.json", import.meta.url),
  JSON.stringify({ source: SOURCE, fetched: version, classes, properties, enumMembers }) + "\n",
);
console.log(
  `✓ ${Object.keys(classes).length} classes, ${Object.keys(properties).length} properties, ` +
    `${Object.keys(enumMembers).length} enumeration members`,
);
