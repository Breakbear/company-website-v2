import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

const parseOrigins = (rawOrigins: string | undefined): string[] => {
  if (!rawOrigins) {
    return ['http://localhost:3000'];
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parsePort = (rawPort: string | undefined): number => {
  const fallbackPort = 5000;
  if (!rawPort) {
    return fallbackPort;
  }

  const port = Number(rawPort);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Invalid PORT value. PORT must be a positive integer.');
  }

  return port;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parsePort(process.env.PORT),
  JWT_SECRET: jwtSecret,
  CORS_ORIGIN: parseOrigins(process.env.CORS_ORIGIN),
};

