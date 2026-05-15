const PLACEHOLDER =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80";

export function apiBaseUrl() {
  return String(import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com").replace(/\/$/, "");
}

/** Build absolute URL for API-hosted uploads and relative paths */
export function toAbsUrl(url) {
  if (!url || typeof url !== "string") return "";
  const s = url.trim();
  if (!s) return "";
  if (s.startsWith("http") || s.startsWith("data:") || s.startsWith("//")) {
    return s.startsWith("//") ? `https:${s}` : s;
  }
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${apiBaseUrl()}${path}`;
}

function extractImagesFromHtml(html) {
  if (!html || typeof html !== "string") return [];
  const out = [];
  const reDouble = /<img[^>]+src="([^"]+)"/gi;
  const reSingle = /<img[^>]+src='([^']+)'/gi;
  let m;
  while ((m = reDouble.exec(html)) !== null) out.push(m[1]);
  while ((m = reSingle.exec(html)) !== null) out.push(m[1]);
  return [...new Set(out)];
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url || "");
}

/** Ordered unique image URLs for a spare part (handles lean() media without reliable `type`) */
export function collectPartImageUrls(part) {
  if (!part) return [];
  const urls = [];

  if (Array.isArray(part.media)) {
    for (const raw of part.media) {
      if (!raw) continue;
      const url = raw.url || raw.thumbnail;
      if (!url || typeof url !== "string") continue;
      if (isVideoUrl(url)) continue;
      const kind = raw.type ?? raw.mediaType;
      if (kind === "video") continue;
      if (kind === "image" || /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url) || /^data:image\//i.test(url)) {
        urls.push(url.trim());
      }
    }
  }

  if (Array.isArray(part.images)) {
    for (const u of part.images) {
      if (typeof u === "string" && u && !isVideoUrl(u)) urls.push(u.trim());
    }
  }

  if (typeof part.thumbnailUrl === "string" && part.thumbnailUrl) {
    urls.unshift(part.thumbnailUrl.trim());
  }

  urls.push(...extractImagesFromHtml(part.descriptionHtml));

  return [...new Set(urls.filter(Boolean))];
}

export function partHeroImageSrc(part) {
  const first = collectPartImageUrls(part)[0];
  return first ? toAbsUrl(first) : PLACEHOLDER;
}

export { PLACEHOLDER as PART_IMAGE_PLACEHOLDER };
