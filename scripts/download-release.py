#!/usr/bin/env python3
"""
Descargador de releases del songbook (Astro → GitHub Releases).

Uso:
  python3 scripts/download-release.py                       # latest → ./chords-release/
  python3 scripts/download-release.py --dest ./site         # custom dir
  python3 scripts/download-release.py --tag nightly/20240620-130000
  python3 scripts/download-release.py --list                # lista releases disponibles
  python3 scripts/download-release.py --list --nightlies   # solo nightlies
  python3 scripts/download-release.py --repo owner/other    # otro repo

Solo stdlib (urllib, zipfile, json, argparse). Sin dependencias externas.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DEST = ROOT / "chords-release"
API = "https://api.github.com"
ASSET_NAME = "chords-dist.zip"
UA = "chords-release-downloader/0.1 (+https://github.com)"


# ────────────────────────── Repo resolution ──────────────────────────

def detect_repo() -> str:
    """Reads OWNER/REPO from `git remote get-url origin` or GITHUB_REPOSITORY env."""
    env_repo = __import__("os").environ.get("GITHUB_REPOSITORY")
    if env_repo:
        return env_repo
    try:
        out = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip()
    except Exception:
        return ""
    m = re.search(r"github\.com[:/]([^/]+)/([^/.]+?)(?:\.git)?$", out)
    return f"{m.group(1)}/{m.group(2)}" if m else ""


# ────────────────────────── HTTP helpers ──────────────────────────

def http_json(url: str, *, token: str | None = None):
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": UA,
        "X-GitHub-Api-Version": "2022-11-28",
    })
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def http_download(url: str, dest: Path, *, token: str | None = None, label: str = "") -> None:
    req = urllib.request.Request(url, headers={
        "Accept": "application/octet-stream",
        "User-Agent": UA,
    })
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=120) as r:
        total = int(r.headers.get("Content-Length") or 0)
        chunk = 64 * 1024
        written = 0
        with dest.open("wb") as f:
            while True:
                buf = r.read(chunk)
                if not buf:
                    break
                f.write(buf)
                written += len(buf)
                if total:
                    pct = written * 100 / total
                    sys.stdout.write(
                        f"\r  ↓ {label} {written/1024:.0f} / {total/1024:.0f} KiB ({pct:.0f}%)"
                    )
                    sys.stdout.flush()
        if total:
            sys.stdout.write("\n")


# ────────────────────────── Release API ──────────────────────────

def list_releases(repo: str, *, limit: int = 30, nightlies_only: bool = False):
    url = f"{API}/repos/{repo}/releases?per_page={min(limit, 100)}"
    try:
        data = http_json(url)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"! Repo '{repo}' no trobat o sense releases.", file=sys.stderr)
            sys.exit(2)
        raise
    out = []
    for r in data:
        if nightlies_only and not r["tag_name"].startswith("nightly/"):
            continue
        asset = next((a for a in r.get("assets", []) if a["name"] == ASSET_NAME), None)
        out.append({
            "tag": r["tag_name"],
            "name": r["name"],
            "published_at": r["published_at"],
            "prerelease": r.get("prerelease", False),
            "draft": r.get("draft", False),
            "asset_url": asset["browser_download_url"] if asset else None,
            "asset_size": asset["size"] if asset else 0,
        })
    return out


def resolve_release(repo: str, tag: str) -> dict:
    if tag == "latest":
        url = f"{API}/repos/{repo}/releases/latest"
    else:
        url = f"{API}/repos/{repo}/releases/tags/{urllib.parse.quote(tag)}"
    try:
        data = http_json(url)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"! Release '{tag}' no trobada a {repo}.", file=sys.stderr)
            sys.exit(2)
        raise
    asset = next((a for a in data.get("assets", []) if a["name"] == ASSET_NAME), None)
    if not asset:
        print(
            f"! La release '{data['tag_name']}' no conté l'asset '{ASSET_NAME}'.",
            file=sys.stderr,
        )
        sys.exit(3)
    return {
        "tag": data["tag_name"],
        "name": data["name"],
        "published_at": data["published_at"],
        "asset_url": asset["browser_download_url"],
        "asset_size": asset["size"],
    }


# ────────────────────────── Download & extract ──────────────────────────

def download_and_extract(repo: str, tag: str, dest: Path, *, token: str | None) -> None:
    rel = resolve_release(repo, tag)
    print(f"Repo      : {repo}")
    print(f"Release   : {rel['tag']} — {rel['name']}")
    print(f"Publicat  : {rel['published_at']}")
    print(f"Mida zip  : {rel['asset_size']/1024:.1f} KiB")
    print(f"Destí     : {dest}")

    dest.mkdir(parents=True, exist_ok=True)
    zip_path = dest / ASSET_NAME

    t0 = time.time()
    print(f"\n→ Descarregant {ASSET_NAME}…")
    http_download(rel["asset_url"], zip_path, token=token, label=ASSET_NAME)
    dt = time.time() - t0
    print(f"  ✓ {zip_path} ({zip_path.stat().st_size/1024:.1f} KiB en {dt:.1f}s)")

    print("→ Extraient…")
    with zipfile.ZipFile(zip_path) as zf:
        members = zf.namelist()
        zf.extractall(dest)
    print(f"  ✓ {len(members)} fitxers → {dest}/")

    stamp = dest / ".release.json"
    stamp.write_text(
        json.dumps(
            {
                "repo": repo,
                "tag": rel["tag"],
                "name": rel["name"],
                "published_at": rel["published_at"],
                "asset_size": rel["asset_size"],
                "downloaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            },
            indent=2,
            ensure_ascii=False,
        )
    )
    print(f"  ✓ marca → {stamp}")


# ────────────────────────── Main ──────────────────────────

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", default=detect_repo(), help="OWNER/REPO (default: del git remote)")
    ap.add_argument("--tag", default="latest", help="tag de la release (default: latest)")
    ap.add_argument("--dest", type=Path, default=DEFAULT_DEST, help=f"directori destí (default: {DEFAULT_DEST})")
    ap.add_argument("--list", action="store_true", help="llistar releases en lloc de descarregar")
    ap.add_argument("--nightlies", action="store_true", help="(amb --list) filtrar només nightly/*")
    ap.add_argument("--limit", type=int, default=20, help="(amb --list) quantes releases mostrar")
    ap.add_argument("--token", default=__import__("os").environ.get("GITHUB_TOKEN"), help="token GitHub (opcional)")
    args = ap.parse_args()

    if not args.repo:
        print("! No s'ha pogut detectar el repo. Passa --repo OWNER/REPO.", file=sys.stderr)
        return 2

    if args.list:
        releases = list_releases(args.repo, limit=args.limit, nightlies_only=args.nightlies)
        if not releases:
            print(f"(cap release per mostrar a {args.repo})")
            return 0
        print(f"{'TAG':<40} {'MIDA':>10}  PUBLICAT")
        print("-" * 72)
        for r in releases:
            size = f"{r['asset_size']/1024:.0f} KiB" if r["asset_size"] else "—"
            pub = r["published_at"][:10]
            print(f"{r['tag']:<40} {size:>10}  {pub}")
        return 0

    download_and_extract(args.repo, args.tag, args.dest, token=args.token)
    print(f"\n✓ Llest. Per servir localment:  cd {args.dest} && python3 -m http.server")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n! Cancel·lat.", file=sys.stderr)
        sys.exit(130)
