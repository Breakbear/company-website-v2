export const isUrlOrUploadPath = (value: string): boolean => {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.startsWith('/uploads/')) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

