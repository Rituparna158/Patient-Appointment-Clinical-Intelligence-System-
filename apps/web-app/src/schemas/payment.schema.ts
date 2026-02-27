import { z } from 'zod';

export const paymentSchema = z.object({
  card_number: z
    .string()
    .min(16, 'Card number should be 16 digit')
    .max(16, 'Card number should be 16 digit'),

  expiry: z.string().min(5, 'Expiry required'),

  cvv: z.string().min(3, 'CVV must be 3 digit').max(4, 'Invalid CVV'),
});

export type PaymentForm = z.infer<typeof paymentSchema>;
