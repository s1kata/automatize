import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[http] ${method} ${originalUrl} → ${res.statusCode} (${ms} мс)`);
  });

  next();
}
