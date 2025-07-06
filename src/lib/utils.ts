export function validateTikTokUrl(url: string): boolean {
  // Desktop format: https://www.tiktok.com/@username/video/1234567890
  // Mobile format: https://www.tiktok.com/t/ZP8[random characters]/
  const desktopPattern =
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+(\?[\w=&-]+)?$/;
  const mobilePattern =
    /^https?:\/\/(www\.)?tiktok\.com\/t\/Z[A-Za-z0-9]+\/?(\?[\w=&-]+)?$/;

  return desktopPattern.test(url) || mobilePattern.test(url);
}

export function extractVideoId(url: string): string | null {
  // Try desktop format first
  const desktopMatch = url.match(/\/video\/(\d+)/);
  if (desktopMatch) return desktopMatch[1];

  // Try mobile format (ZP8 + random characters, with optional trailing slash)
  const mobileMatch = url.match(/\/t\/(ZP8[A-Za-z0-9]+)\/?/);
  return mobileMatch ? mobileMatch[1] : null;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
