---
name: Client IP behind Replit proxy
description: How to get the real client IP in the API server (for rate limiting etc.)
---

Replit's edge overwrites any client-supplied X-Forwarded-For (a spoofed value was dropped in testing on 2026-11-19), so the leftmost XFF entry is the real client. The API server uses `trust proxy: true`.

**Why:** observed XFF via the dev domain was "client, internal-hop, 127.0.0.1"; a numeric hop count would be fragile across dev/prod.
**How to apply:** use `req.ip` for per-IP limits; re-verify if a deployment shows every request from the same IP.
