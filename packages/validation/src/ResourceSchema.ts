import { z } from "zod";

/**
 * Validates the registration of an external resource.
 */
export const RegisterResourceSchema = z.object({
  entityId: z.string().uuid("entityId must be a valid UUID"),
  type: z.string().min(1),
  uri: z.string().url("Must be a valid URL/URI format"),
  source: z.string().min(1),
  rawMetadata: z.record(z.unknown()).default({}),
});

export type RegisterResourceInput = z.infer<typeof RegisterResourceSchema>;
