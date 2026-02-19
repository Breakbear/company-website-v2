interface OptimizeImageOptions {
  width?: number;
  quality?: number;
}

const isUnsplashImage = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('images.unsplash.com');
  } catch {
    return false;
  }
};

export const optimizeImageUrl = (url: string, options: OptimizeImageOptions = {}): string => {
  if (!url || !isUnsplashImage(url)) {
    return url;
  }

  const width = options.width ?? 1200;
  const quality = options.quality ?? 75;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('q', String(quality));
    return parsed.toString();
  } catch {
    return url;
  }
};

export const buildUnsplashSrcSet = (
  url: string,
  widths: number[],
  quality = 75
): string | undefined => {
  if (!url || !isUnsplashImage(url)) {
    return undefined;
  }

  return widths
    .map((width) => `${optimizeImageUrl(url, { width, quality })} ${width}w`)
    .join(', ');
};
