/**
 * The base contract for all persistence mechanisms in PKOS.
 * 
 * Why: Hides the complexity of Prisma, Redis, or memory stores from the domain.
 * Domain Services only depend on these contracts, making the database an implementation detail.
 * 
 * Invariants:
 * - Implementations must throw domain-specific errors (e.g. EntityNotFoundError) instead of ORM errors.
 * 
 * Owner: The Persistence Layer contract definition.
 */
export interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: ID): Promise<void>;
}
