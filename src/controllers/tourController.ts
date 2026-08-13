import type { Request, Response } from 'express';
import {
  fetchToursFromApi,
  applyTourFilters,
  type TourFilters,
} from '../services/tourService';
import { toursQuerySchema } from '../validation/tourSchemas';

export async function getTours(req: Request, res: Response): Promise<void> {
  try {
    const parsed = toursQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: 'Некорректные параметры запроса',
        details: parsed.error.flatten(),
      });
      return;
    }

    const apiUrl = process.env.TOUR_API_URL;
    if (!apiUrl) {
      res.status(500).json({
        success: false,
        error: 'Не задана переменная TOUR_API_URL',
      });
      return;
    }

    let tours = await fetchToursFromApi(apiUrl);

    const filters: TourFilters = {};
    const q = parsed.data;
    if (q.maxPrice !== undefined) filters.maxPrice = q.maxPrice;
    if (q.minPrice !== undefined) filters.minPrice = q.minPrice;
    if (q.country) filters.country = q.country;
    if (q.city) filters.city = q.city;

    if (Object.keys(filters).length > 0) {
      tours = applyTourFilters(tours, filters);
    }

    res.json(tours);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    console.error('[tourController] getTours:', message);
    res.status(500).json({ success: false, error: message });
  }
}
