/**
 * Detect a video URL's platform and produce an embed URL where possible.
 * Returns:
 *   - { kind: 'iframe', src }    — embed inside <iframe>
 *   - { kind: 'video',  src }    — <video> with src
 *   - { kind: 'external', src }  — open in new tab (no inline embed possible)
 */
export type VideoEmbed =
  | { kind: 'iframe'; src: string; aspect: 'portrait' | 'landscape' }
  | { kind: 'video'; src: string }
  | { kind: 'external'; src: string }

const tiktokVideoRe = /tiktok\.com\/@[^/]+\/video\/(\d+)/i
const tiktokShortRe = /vm\.tiktok\.com\/(\w+)/i
const instagramRe = /instagram\.com\/(?:p|reel|reels|tv)\/([^/?#]+)/i
const youtubeWatchRe = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/i
const youtubeShortRe = /youtube\.com\/shorts\/([\w-]{11})/i
const vimeoRe = /vimeo\.com\/(?:video\/)?(\d+)/i
const xStatusRe = /(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/i
const directVideoRe = /\.(mp4|webm|mov|m4v)(\?|#|$)/i

export function resolveEmbed(url: string): VideoEmbed {
  // TikTok video → portrait iframe
  let m = url.match(tiktokVideoRe)
  if (m) {
    return { kind: 'iframe', src: `https://www.tiktok.com/embed/v2/${m[1]}`, aspect: 'portrait' }
  }
  if (tiktokShortRe.test(url)) {
    // short URLs need resolution server-side; fall back to external
    return { kind: 'external', src: url }
  }

  // Instagram p/reel
  m = url.match(instagramRe)
  if (m) {
    return { kind: 'iframe', src: `https://www.instagram.com/p/${m[1]}/embed`, aspect: 'portrait' }
  }

  // YouTube
  m = url.match(youtubeWatchRe) || url.match(youtubeShortRe)
  if (m) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${m[1]}`, aspect: 'landscape' }
  }

  // Vimeo
  m = url.match(vimeoRe)
  if (m) {
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${m[1]}`, aspect: 'landscape' }
  }

  // X / Twitter status — use platform's tweet renderer (portrait works well)
  m = url.match(xStatusRe)
  if (m) {
    return {
      kind: 'iframe',
      src: `https://platform.twitter.com/embed/Tweet.html?id=${m[1]}&theme=light`,
      aspect: 'portrait',
    }
  }

  // Direct video file
  if (directVideoRe.test(url)) {
    return { kind: 'video', src: url }
  }

  // TikTok / Snapchat profile, search pages, savvyworld → just external
  return { kind: 'external', src: url }
}
