#!/usr/bin/env python3
"""Inject partials/kit.svg (shared pencil characters) into every page.

Pages hold the block between <!-- kit:start --> and <!-- kit:end -->.
Run after editing partials/kit.svg:  python3 tools/build.py
The site itself needs no build step; this only keeps the copies in sync.
"""
import pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
kit = (root / "partials" / "kit.svg").read_text(encoding="utf-8").strip()
pat = re.compile(r"(<!-- kit:start -->)(.*?)(<!-- kit:end -->)", re.S)
changed = 0
for page in sorted(root.rglob("*.html")):
    if any(p in {".git", "partials", "tools"} for p in page.parts):
        continue
    src = page.read_text(encoding="utf-8")
    new, n = pat.subn(lambda m: m.group(1) + "\n" + kit + "\n" + m.group(3), src)
    if n and new != src:
        page.write_text(new, encoding="utf-8")
        changed += 1
        print("updated", page.relative_to(root))
print(f"{changed} page(s) updated")
sys.exit(0)
