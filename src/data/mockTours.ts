import type { Tour } from '../types/tour';

export const MOCK_TOURS: Tour[] = [
  {
    id: 'mock-1',
    country: 'Таиланд',
    city: 'Пхукет',
    hotel: 'Patong Resort 4*',
    price: 89900,
    dates: '05.04 — 12.04.2026',
    image: 'https://example.com/images/phuket.jpg',
  },
  {
    id: 'mock-2',
    country: 'Турция',
    city: 'Анталья',
    hotel: 'Side Star Beach 5*',
    price: 67500,
    dates: '10.04 — 17.04.2026',
    image: 'https://example.com/images/antalya.jpg',
  },
  {
    id: 'mock-3',
    country: 'Египет',
    city: 'Хургада',
    hotel: 'Coral Sea Sensatori 5*',
    price: 54200,
    dates: '15.04 — 22.04.2026',
    image: 'https://example.com/images/hurghada.jpg',
  },
];
