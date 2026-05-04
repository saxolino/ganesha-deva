/* Shared utilities for /api/ functions: in-memory rate limit, CORS, honeypot. */

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function clientIp(req) {
  return (
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function rateLimited(req) {
  const ip = clientIp(req);
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + WINDOW_MS;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  return bucket.count > MAX_REQUESTS;
}

function applyCors(req, res) {
  const allowed = process.env.SITE_ORIGIN || "https://www.ganeshaexperience.it";
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

function isBot(body) {
  return Boolean(body && body.website_url);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = { applyCors, rateLimited, isBot, escapeHtml };
