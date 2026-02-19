import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id?: string; role?: string };
    if (!decoded.id || !decoded.role) {
      res.status(401).json({ success: false, message: 'Invalid authentication token' });
      return;
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    const dbUser = db
      .prepare('SELECT id, role, isActive FROM users WHERE id = ?')
      .get(req.user.id) as { id: string; role: string; isActive: number } | undefined;

    if (!dbUser || !dbUser.isActive) {
      res.status(401).json({ success: false, message: 'Account is deactivated or missing' });
      return;
    }

    if (req.user.role !== dbUser.role) {
      res.status(401).json({ success: false, message: 'Role has changed. Please sign in again.' });
      return;
    }

    if (!roles.includes(dbUser.role)) {
      res.status(403).json({ success: false, message: 'Not authorized to perform this action' });
      return;
    }

    req.user.role = dbUser.role;
    next();
  };
};
