export const parsePositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const parsePage = (value: unknown, fallback = 1): number => {
  return parsePositiveInt(value, fallback);
};

export const parseLimit = (value: unknown, fallback: number, max: number): number => {
  const parsed = parsePositiveInt(value, fallback);
  return Math.min(parsed, max);
};

