import z from 'zod';
export const branchSchema = z.object({
  name: z.string().trim().min(2, 'Branch name must be at least 2 characters'),

  address: z.string().trim().min(5, 'Address must be at least 5 characters'),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\- ]{7,15}$/, 'Invalid phone number'),
});

export type BranchForm = z.infer<typeof branchSchema>;
