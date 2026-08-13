import { z } from 'zod';

export const tourSchema = z.object({
  id: z.string().min(1, 'Укажите id'),
  country: z.string().min(1, 'Укажите страну'),
  city: z.string().min(1, 'Укажите город'),
  hotel: z.string().min(1, 'Укажите отель'),
  price: z.number().finite().nonnegative('Цена должна быть неотрицательным числом'),
  dates: z.string().min(1, 'Укажите даты'),
  image: z.string().optional().default(''),
});

export const toursBodySchema = z.object({
  tours: z.array(tourSchema).min(1, 'Нужен хотя бы один тур'),
});

export const toursQuerySchema = z.object({
  maxPrice: z.coerce.number().finite().optional(),
  minPrice: z.coerce.number().finite().optional(),
  country: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
});

export type ToursBody = z.infer<typeof toursBodySchema>;
export type TourInput = z.infer<typeof tourSchema>;
