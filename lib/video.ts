export type Embed = {
  kind: "iframe" | "file";
  src: string;
  open: string; // the link for "open in a new tab"
};

export function toEmbed(url: string): Embed | null {
  if (!url) return null;

  const drive = /drive\.google\.com\/file\/d\/([\w-]+)/.exec(url);
  if (drive) {
    return {
      kind: "iframe",
      src: `https://drive.google.com/file/d/${drive[1]}/preview`,
      open: `https://drive.google.com/file/d/${drive[1]}/view`,
    };
  }

  const yt =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/.exec(
      url
    );
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`,
      open: `https://youtu.be/${yt[1]}`,
    };
  }

  if (url.startsWith("/") || /\.(mp4|webm|mov)(\?|$)/i.test(url)) {
    return { kind: "file", src: url, open: url };
  }

  return null;
}