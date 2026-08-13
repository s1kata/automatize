import type { Request, Response } from 'express';
import type { Tour } from '../types/tour';
import { formatTourPost } from '../utils/formatter';
import { postToGroupWall, randomDelayBetween } from '../services/vkService';
import { toursBodySchema } from '../validation/tourSchemas';
import type { PublishResultItem } from '../types/tour';

export async function postPublish(req: Request, res: Response): Promise<void> {
  try {
    const parsed = toursBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: 'Ошибка проверки данных',
        details: parsed.error.flatten(),
      });
      return;
    }

    const { tours } = parsed.data;
    const results: PublishResultItem[] = [];

    for (let i = 0; i < tours.length; i++) {
      const tour = tours[i] as Tour;
      const message = formatTourPost(tour);
      console.log(`[publish] Публикация тура ${tour.id} в VK...`);

      const vkResult = await postToGroupWall(message);

      if ('postId' in vkResult && vkResult.postId != null) {
        results.push({ tourId: tour.id, success: true, postId: vkResult.postId });
        console.log(`[publish] Тур ${tour.id} опубликован, post_id=${vkResult.postId}`);
      } else {
        const errMsg = 'error' in vkResult ? vkResult.error : 'Неизвестная ошибка VK';
        results.push({ tourId: tour.id, success: false, error: errMsg });
        console.error(`[publish] Тур ${tour.id} — ошибка:`, errMsg);
      }

      if (i < tours.length - 1) {
        await randomDelayBetween(500, 1000);
      }
    }

    const allOk = results.every((r) => r.success);
    res.status(allOk ? 200 : 207).json({
      success: allOk,
      results,
      message: allOk ? 'Все туры опубликованы' : 'Часть туров не удалось опубликовать',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    console.error('[publishController] postPublish:', message);
    res.status(500).json({ success: false, error: message });
  }
}

export function postPreview(req: Request, res: Response): void {
  try {
    const parsed = toursBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: 'Ошибка проверки данных',
        details: parsed.error.flatten(),
      });
      return;
    }

    const previews = parsed.data.tours.map((t) => ({
      tourId: t.id,
      text: formatTourPost(t as Tour),
    }));

    res.json({ success: true, previews });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    console.error('[publishController] postPreview:', message);
    res.status(500).json({ success: false, error: message });
  }
}
