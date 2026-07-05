import { z } from "zod";

/**
 * Validates the creation payload for a new Entity.
 * 
 * Why: This schema runs at the API boundary (e.g., Next.js App Router).
 * It ensures that garbage data never reaches the Domain. 
 * Once validated, this payload is passed to the Domain to instantiate
 * the actual Value Objects and Interfaces.
 */
export const CreateEntitySchema = z.object({
  typeId: z.string().min(1, "typeId is required"),
  owner: z.string().min(1, "owner is required"),
  spaceId: z.string().optional(),
  
  externalIds: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  
  traits: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
});

export type CreateEntityInput = z.infer<typeof CreateEntitySchema>;
