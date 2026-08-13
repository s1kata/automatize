import type { Tour } from '../types/tour';

export type FormatterExtras = Record<string, string | number | undefined>;

/** Текст поста VK по туру. Расширяйте через `extras` или обёртку над функцией. */
export function formatTourPost(tour: Tour, extras?: FormatterExtras): string {
  const lines = [
    '🔥 Горящий тур',
    `📍 ${tour.country}, ${tour.city}`,
    `🏨 ${tour.hotel}`,
    `📅 ${tour.dates}`,
    `💰 ${tour.price} ₽`,
  ];

  if (extras && Object.keys(extras).length > 0) {
    for (const [key, value] of Object.entries(extras)) {
      if (value !== undefined && value !== '') {
        lines.push(`${key}: ${value}`);
      }
    }
  }

  return lines.join('\n');
}
