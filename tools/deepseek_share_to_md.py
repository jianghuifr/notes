#!/usr/bin/env python3
"""Fetch a DeepSeek shared conversation and render it as a Hexo draft.

Usage:
    python3 tools/deepseek_share_to_md.py <URL_OR_SHARE_ID> [--out-dir DIR]

On success, prints the absolute path of the written draft as the last stdout line.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

API_URL = "https://chat.deepseek.com/api/v0/share/content"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
CST = timezone(timedelta(hours=8))
SHARE_ID_RE = re.compile(r"/share/([A-Za-z0-9_-]+)")
CITATION_RE = re.compile(r"\[!?citation:(\d+)\]")
DEFAULT_OUT_DIR = Path("source/_drafts")


def extract_share_id(raw: str) -> str:
    raw = raw.strip()
    m = SHARE_ID_RE.search(raw)
    if m:
        return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]+", raw):
        return raw
    raise ValueError(f"cannot extract share_id from input: {raw!r}")


def fetch_share(share_id: str) -> dict[str, Any]:
    url = f"{API_URL}?share_id={share_id}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} from DeepSeek API: {e.reason}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"network error contacting DeepSeek: {e.reason}") from e

    if payload.get("code") != 0:
        raise RuntimeError(f"API error code={payload.get('code')} msg={payload.get('msg')!r}")
    data = payload.get("data") or {}
    if data.get("biz_code") != 0:
        raise RuntimeError(
            f"share not accessible: biz_code={data.get('biz_code')} biz_msg={data.get('biz_msg')!r}"
        )
    biz = data.get("biz_data") or {}
    if not biz.get("messages"):
        raise RuntimeError("empty conversation returned")
    return biz


def derive_title(messages: list[dict[str, Any]], share_id: str) -> str:
    for m in messages:
        if m.get("role") == "USER" and m.get("content"):
            first_line = m["content"].strip().splitlines()[0]
            cleaned = re.sub(r"^[#>\s*\-`]+", "", first_line).strip()
            cleaned = re.sub(r"\s+", " ", cleaned)
            if len(cleaned) > 40:
                cleaned = cleaned[:40].rstrip() + "…"
            if cleaned:
                return cleaned
    return f"DeepSeek 对话 {share_id}"


def format_ts(ts: float | int | None) -> str:
    if ts is None:
        ts = datetime.now(tz=CST).timestamp()
    return datetime.fromtimestamp(float(ts), tz=CST).strftime("%Y-%m-%d %H:%M:%S")


def yaml_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def render_citations(content: str, msg_id: int) -> str:
    return CITATION_RE.sub(lambda m: f"[\\[{m.group(1)}\\]](#ref-{msg_id}-{m.group(1)})", content)


def render_message(msg: dict[str, Any]) -> str:
    role = msg.get("role", "?")
    heading = "## 🧑 用户" if role == "USER" else "## 🤖 DeepSeek"
    parts: list[str] = [heading, ""]

    content = (msg.get("content") or "").rstrip()
    msg_id = msg.get("message_id", 0)
    if content:
        parts.append(render_citations(content, msg_id))
        parts.append("")

    thinking = (msg.get("thinking_content") or "").strip()
    if thinking:
        elapsed = msg.get("thinking_elapsed_secs")
        summary = f"💭 思考过程 ({elapsed}s)" if elapsed else "💭 思考过程"
        parts.extend(
            [
                f"<details><summary>{summary}</summary>",
                "",
                thinking,
                "",
                "</details>",
                "",
            ]
        )

    refs = msg.get("search_results") or []
    if refs:
        parts.append("**参考来源**")
        parts.append("")
        for r in sorted(refs, key=lambda x: x.get("cite_index", 0)):
            idx = r.get("cite_index")
            title = (r.get("title") or "").strip() or "(无标题)"
            url = r.get("url") or ""
            site = (r.get("site_name") or "").strip()
            suffix = f" — {site}" if site else ""
            parts.append(f'- <a id="ref-{msg_id}-{idx}"></a>[{idx}] [{title}]({url}){suffix}')
        parts.append("")

    return "\n".join(parts)


def render_markdown(share_id: str, share_url: str, biz: dict[str, Any]) -> str:
    messages: list[dict[str, Any]] = biz["messages"]
    title = derive_title(messages, share_id)
    first_ts = messages[0].get("inserted_at")

    front_matter = "\n".join(
        [
            "---",
            f'title: "{yaml_escape(title)}"',
            f"date: {format_ts(first_ts)}",
            "source: deepseek-share",
            f"share_id: {share_id}",
            f"share_url: {share_url}",
            "published: false",
            "---",
            "",
        ]
    )

    header = (
        f"> 来源：[DeepSeek 分享]({share_url})　消息数：{len(messages)}　"
        f"起始：{format_ts(first_ts)}\n"
    )

    body = "\n".join(render_message(m) for m in messages)
    return front_matter + "\n" + header + "\n" + body


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("share", help="DeepSeek share URL or bare share_id")
    ap.add_argument(
        "--out-dir",
        default=str(DEFAULT_OUT_DIR),
        help=f"output directory (default: {DEFAULT_OUT_DIR})",
    )
    args = ap.parse_args()

    try:
        share_id = extract_share_id(args.share)
        share_url = f"https://chat.deepseek.com/share/{share_id}"
        print(f"→ share_id: {share_id}", file=sys.stderr)
        print(f"→ fetching {API_URL}?share_id={share_id}", file=sys.stderr)
        biz = fetch_share(share_id)
        print(f"→ got {len(biz['messages'])} messages", file=sys.stderr)
        md = render_markdown(share_id, share_url, biz)
    except (ValueError, RuntimeError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 1

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = (out_dir / f"deepseek-{share_id}.md").resolve()
    out_path.write_text(md, encoding="utf-8")
    print(f"→ wrote {out_path.stat().st_size} bytes", file=sys.stderr)
    print(out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
