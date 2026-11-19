import type { RequestHandler } from "express";

/**
 * Simple in-memory sliding-window rate limiter, keyed by client IP.
 * Resets when the server restarts; fine for a single-instance prototype.
 */
export function rateLimit({ max, windowMs }: { max: number; windowMs: number }): RequestHandler {
  const hits = new Map<string, number[]>();

  const cleanup = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, times] of hits) {
      const recent = times.filter((t) => t > cutoff);
      if (recent.length) hits.set(ip, recent);
      else hits.delete(ip);
    }
  }, 10 * 60 * 1000);
  cleanup.unref();

  return (req, res, next) => {
    const ip = req.ip ?? "unknown";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => t > now - windowMs);

    if (recent.length >= max) {
      const retryAfterSec = Math.ceil((recent[0]! + windowMs - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    recent.push(now);
    hits.set(ip, recent);
    next();
  };
}
