import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import toursRouter from './routes/tours.routes';
import publishRouter from './routes/publish.routes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use('/tours', toursRouter);
app.use('/', publishRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ошибка]', err);
  const message = err instanceof Error ? err.message : 'Внутренняя ошибка сервера';
  if (!res.headersSent) {
    res.status(500).json({ success: false, error: message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[сервер] Слушаю порт ${port} (0.0.0.0 — доступ с телефона в той же Wi‑Fi сети)`);
  console.log('[сервер] Токен VK только на сервере, клиентам не передаётся');
});
