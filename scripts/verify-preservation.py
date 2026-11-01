"""Compare production HTML with a saved baseline (ignore build asset hashes)."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.in_ld = False
        self.text, self.links, self.fields, self.metadata, self.json_ld = [], [], [], [], []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
        if tag == "a":
            self.links.append(values.get("href"))
        if tag in ("input", "select", "textarea"):
            self.fields.append({key: values.get(key) for key in ("name", "type", "required", "autocomplete")})
        if tag == "meta" or (tag == "link" and values.get("rel") in ("canonical", "alternate", "manifest", "icon")):
            self.metadata.append(values)
        if tag == "script" and values.get("type") == "application/ld+json":
            self.in_ld = True

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1
            self.in_ld = False

    def handle_data(self, data):
        if not self.skip:
            self.text.append(data)
        if self.in_ld:
            self.json_ld.append(json.loads(data))

    def content(self):
        return re.sub(r"\s+", " ", "".join(self.text)).strip()


baseline, candidate = map(Path, sys.argv[1:3])
results = []
for html in sorted(baseline.rglob("*.html")):
    path = html.relative_to(baseline)
    old, new = Page(), Page()
    old.feed(html.read_text())
    new.feed((candidate / path).read_text())
    checks = {key: getattr(old, key) == getattr(new, key) for key in ("links", "fields", "metadata", "json_ld")}
    checks["text"] = old.content() == new.content()
    results.append({"path": str(path), "checks": checks})
Path("docs/motion/content-preservation.json").write_text(json.dumps(results, indent=2) + "\n")
assert all(all(row["checks"].values()) for row in results), results
print(f"All text, links, fields, SEO metadata and structured data match across {len(results)} HTML documents.")
