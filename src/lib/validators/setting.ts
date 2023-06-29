import { z } from 'zod';

export const SettingValidator = z.object({
  name: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/)
});

export type SettingRequest = z.infer<typeof SettingValidator>;