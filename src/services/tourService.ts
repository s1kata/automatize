import axios from 'axios';
import type { Tour } from '../types/tour';
import { MOCK_TOURS } from '../data/mockTours';

function normalizeTour(raw: unknown): Tour | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = o.id != null ? String(o.id) : '';
  const country = typeof o.country === 'string' ? o.country : '';
  const city = typeof o.city === 'string' ? o.city : '';
  const hotel = typeof o.hotel === 'string' ? o.hotel : '';
  const price = typeof o.price === 'number' ? o.price : Number(o.price);
  const dates = typeof o.dates === 'string' ? o.dates : '';
  const image = typeof o.image === 'string' ? o.image : '';
  if (!id || !country || !city || !hotel || Number.isNaN(price) || !dates) {
    return null;
  }
  return { id, country, city, hotel, price, dates, image };
}

function parseToursFromResponse(data: unknown): Tour[] {
  let list: unknown[] = [];
  if (Array.isArray(data)) {
    list = data;
  } else if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.tours)) list = obj.tours;
    else if (Array.isArray(obj.data)) list = obj.data;
    else if (Array.isArray(obj.items)) list = obj.items;
  }
  return list.map(normalizeTour).filter((t): t is Tour => t !== null);
}

export interface TourFilters {
  maxPrice?: number;
  minPrice?: number;
  country?: string;
  city?: string;
}

/** Заголовки авторизации к внешнему API туров из переменных окружения (секрет не уходит клиенту). */
export function buildTourApiHeaders(): Record<string, string> {
  const token = process.env.TOUR_API_TOKEN?.trim();
  if (!token) return {};

  const mode = (process.env.TOUR_API_TOKEN_MODE || 'bearer').toLowerCase().replace(/_/g, '-');

  switch (mode) {
    case 'token':
      return { Authorization: `Token ${token}` };
    case 'x-api-key':
    case 'api-key':
      return { 'X-API-Key': token };
    case 'raw':
      return { Authorization: token };
    case 'bearer':
    default:
      return { Authorization: `Bearer ${token}` };
  }
}

export function applyTourFilters(tours: Tour[], filters: TourFilters): Tour[] {
  return tours.filter((t) => {
    if (filters.maxPrice !== undefined && t.price > filters.maxPrice) return false;
    if (filters.minPrice !== undefined && t.price < filters.minPrice) return false;
    if (filters.country && t.country.toLowerCase() !== filters.country.toLowerCase()) {
      return false;
    }
    if (filters.city && t.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }
    return true;
  });
}

export async function fetchToursFromApi(apiUrl: string): Promise<Tour[]> {
  try {
    const headers = buildTourApiHeaders();
    const response = await axios.get<unknown>(apiUrl, {
      timeout: 15000,
      validateStatus: (s) => s >= 200 && s < 300,
      headers: Object.keys(headers).length ? headers : undefined,
    });
    const parsed = parseToursFromResponse(response.data);
    if (parsed.length === 0) {
      console.warn('[tourService] API не вернул валидные туры, подставляем тестовые данные');
      return [...MOCK_TOURS];
    }
    return parsed;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[tourService] API недоступен, подставляем тестовые данные:', msg);
    return [...MOCK_TOURS];
  }
}
