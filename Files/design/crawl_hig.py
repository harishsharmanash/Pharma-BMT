"""Crawl Apple's Human Interface Guidelines into one markdown reference.

Apple's doc site is JS-rendered, but every page has a JSON twin under
/tutorials/data/<path>.json. We walk the topic tree from the section hubs,
follow one level into the Components sub-hubs, and flatten each page's prose.

Output: hig-full.md  (plus hig-raw.json for re-processing without refetching)
"""
import json, urllib.request, time, sys, os

BASE = "https://developer.apple.com/tutorials/data"
OUT = os.path.dirname(os.path.abspath(__file__))

# Skip platform surfaces we can never ship to. Keeping these would bloat the
# reference with watch complications and tvOS remotes nobody here will read.
SKIP = {
    "immersive-experiences", "spatial-layout", "workouts", "playing-audio",
    "playing-video", "playing-haptics", "printing", "ratings-and-reviews",
    "going-full-screen", "live-viewing-apps", "apple-pencil-and-scribble",
    "camera-control", "digital-crown", "eyes", "game-controls", "remotes",
    "nearby-interactions", "gyro-and-accelerometer", "action-button",
}

def get(path, tries=3):
    for n in range(tries):
        try:
            req = urllib.request.Request(
                BASE + path + ".json",
                headers={"Accept": "application/json", "User-Agent": "Mozilla/5.0"},
            )
            return json.load(urllib.request.urlopen(req, timeout=30))
        except Exception as e:
            if n == tries - 1:
                return {"__err": str(e)}
            time.sleep(1.5 * (n + 1))

def inline(items):
    out = []
    for it in items or []:
        t = it.get("type")
        if t == "text":
            out.append(it.get("text", ""))
        elif t == "codeVoice":
            out.append("`" + it.get("code", "") + "`")
        elif t in ("emphasis", "strong", "inlineHead"):
            out.append(inline(it.get("inlineContent")))
        elif t == "reference":
            out.append(inline(it.get("inlineContent")) or "")
    return "".join(out)

def blocks(content, buf):
    for b in content or []:
        k = b.get("type")
        if k == "heading":
            buf.append("\n" + "#" * min(b.get("level", 3) + 1, 6) + " " + b.get("text", ""))
        elif k == "paragraph":
            s = inline(b.get("inlineContent"))
            if s.strip():
                buf.append(s)
        elif k == "unorderedList":
            for li in b.get("items", []):
                parts = [inline(p.get("inlineContent")) for p in li.get("content", []) if p.get("type") == "paragraph"]
                s = " ".join(x for x in parts if x)
                if s.strip():
                    buf.append("- " + s)
        elif k == "termList":
            for li in b.get("items", []):
                term = inline((li.get("term") or {}).get("inlineContent"))
                defs = [inline(p.get("inlineContent")) for p in (li.get("definition") or {}).get("content", []) if p.get("type") == "paragraph"]
                buf.append(f"- **{term}** — " + " ".join(defs))
        elif k == "aside":
            parts = [inline(p.get("inlineContent")) for p in b.get("content", []) if p.get("type") == "paragraph"]
            buf.append(f"> [{b.get('style','note').upper()}] " + " ".join(parts))

def page_md(path, d):
    title = d.get("metadata", {}).get("title") or path
    buf = [f"\n\n---\n\n## {title}\n\n`{path}`"]
    ab = "".join(x.get("text", "") for x in d.get("abstract", []) or [])
    if ab:
        buf.append("_" + ab + "_")
    for sec in d.get("primaryContentSections", []) or []:
        blocks(sec.get("content"), buf)
    return "\n\n".join(buf)

def children(d):
    refs = d.get("references", {})
    out = []
    for s in d.get("topicSections", []) or []:
        for i in s.get("identifiers", []):
            r = refs.get(i, {})
            u = r.get("url")
            if u and u.startswith("/design/human-interface-guidelines"):
                out.append(u)
    return out

index = json.load(open("/tmp/hig_index.json"))
targets = []
for sec, kids in index.items():
    for _t, u in kids:
        if u.rsplit("/", 1)[-1] not in SKIP:
            targets.append(u)

raw, md, seen = {}, [], set()
queue = list(targets)
while queue:
    p = queue.pop(0)
    if p in seen:
        continue
    seen.add(p)
    d = get(p)
    if "__err" in d:
        print("ERR", p, d["__err"], file=sys.stderr)
        continue
    raw[p] = d
    md.append(page_md(p, d))
    # One level deeper: the Components hubs list the real component pages.
    for c in children(d):
        if c not in seen and c.rsplit("/", 1)[-1] not in SKIP:
            queue.append(c)
    time.sleep(0.12)
    if len(seen) % 25 == 0:
        print(f"...{len(seen)} pages", file=sys.stderr)

open(os.path.join(OUT, "hig-full.md"), "w").write(
    "# Apple Human Interface Guidelines — extracted reference\n\n"
    f"Crawled from developer.apple.com JSON API. {len(md)} pages.\n"
    + "".join(md)
)
json.dump(raw, open(os.path.join(OUT, "hig-raw.json"), "w"))
print(f"DONE: {len(md)} pages")
