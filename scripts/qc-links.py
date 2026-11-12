#!/usr/bin/env python3
"""QC: verify every internal link and referenced asset across all built pages."""
import html.parser
import os
import re
import sys
from urllib.parse import unquote

BASE = "/home/z/my-project/mehraz"
DIST = os.path.join(BASE, "dist")

pages = []
for root, dirs, files in os.walk(DIST):
    dirs[:] = [d for d in dirs if d not in ("assets",)]
    for f in files:
        if f.endswith(".html"):
            pages.append(os.path.join(root, f))

href_re = re.compile(r'(?:href|src)="([^"]+)"')

total, broken, missing = 0, 0, 0
for page in sorted(pages):
    rel = os.path.relpath(page, BASE)
    with open(page, encoding="utf8") as fh:
        content = fh.read()
    for m in href_re.finditer(content):
        target = m.group(1)
        if (
            not target.startswith("/")
            or target.startswith("//")
            or target.endswith((".woff2",))
            and "/src/" in target
        ):
            continue
        if re.match(r"^/[a-z]+:", target):  # proto-relative-ish / tel:
            continue
        total += 1
        # strip fragment and query
        path = target.split("#")[0].split("?")[0]
        if not path:
            continue
        fs = os.path.join(DIST, unquote(path).lstrip("/"))
        if not (os.path.isfile(fs) or os.path.isdir(fs) or os.path.isfile(fs + ".html") or os.path.isfile(os.path.join(fs, "index.html"))):
            broken += 1
            print(f"BROKEN {rel} -> {target}")

# assets referenced by built JS/CSS (images, fonts)
for root, _dirs, files in os.walk(os.path.join(DIST, "assets")):
    for f in files:
        with open(os.path.join(root, f), encoding="utf8", errors="ignore") as fh:
            content = fh.read()
        for m in re.finditer(r'["\']/(images|fonts)/[^"\']+["\']', content):
            total += 1
            fs = os.path.join(DIST, m.group(0).strip("\"'").lstrip("/"))
            if not os.path.isfile(fs):
                missing += 1
                print(f"MISSING ASSET {m.group(0)}")

print(f"\nchecked {total} refs across {len(pages)} pages — broken: {broken}, missing assets: {missing}")
sys.exit(1 if (broken or missing) else 0)
