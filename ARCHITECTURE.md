# PKOS Architecture & Ubiquitous Language

This living document defines the core architecture and ubiquitous language of PKOS. While `VISION.md` explains *why* PKOS exists, this document defines *how* it works. It is entirely agnostic to any specific database or UI technology.

## Core Domain Principles

1. **Separation of Domain and Persistence**: The core domain model dictates reality. The database schema (Prisma) and API layers merely reflect and persist that reality. The `packages/domain` directory will not depend on any specific database implementation, nor any validation library (like Zod) or framework. It is pure TypeScript.
2. **Infinite Composability**: The core `Entity` is intentionally sparse. It acts solely as an identity anchor in the graph. Every semantic feature (e.g., Resources, Relationships, Observations) attaches to the Entity.
3. **Knowledge Provenance**: Every piece of knowledge must answer "Where did this come from?". Nothing exists in isolation.

## The Ubiquitous Language (Domain Objects)

### Value Objects
Small, immutable classes that ensure invalid states are impossible to construct. The domain relies on Value Objects rather than primitive types.
- `EntityId`, `RelationshipId`, `ResourceId`: Typed identifiers.
- `Confidence`: A number strictly between 0 and 1.
- `ResourceUri`: A valid URI string.
- `Slug`: A URL-safe string.
- `Timestamp`: A point in time.

### Entity & Identity
An `Entity` is the root node of the knowledge graph. It is virtually empty and serves only to anchor identity, timestamps, and ownership.
`Identity` separates naming and discovery (external IDs, aliases) from the raw entity.

### Traits & Capabilities
- **Trait**: Describes what something *IS* (e.g., "Physical Resource", "Software", "Runtime").
- **Capability**: Describes what something *CAN DO* (e.g., "Searchable", "Runnable", "Summarisable").

### Source & Resource
- **Source**: A first-class model defining where knowledge came from (e.g., GitHub, Docker, User).
- **Resource**: Everything external is a `Resource`. Resources spawn internal Entities. Includes `SyncState`.

### Context
A first-class citizen driving all recommendations and AI behaviour (e.g., "Current Work Session").

### Graph Connectors: Relationships, Observations & Facts
- **Relationship**: A structured, typed edge (e.g., `references`, `contains`).
- **Observation Lifecycle**: `Observation` (AI conclusion) -> `Hypothesis` (pending verification) -> `Fact` (confirmed truth).

### Confidence & Provenance
Everything the AI touches must expose a `Confidence` score. Everything must track `Provenance`.

## Bounded Contexts & CQRS

### Bounded Contexts
- **Core Domain**: The foundational knowledge graph and object system.
- **AI Domain**: Isolated from the core domain (Inference -> Observations -> Facts). Can be swapped without affecting the core.

### CQRS (Command Query Responsibility Segregation)
- **Commands**: Domain intents (e.g., `RestartContainerCommand` -> `RestartContainerHandler` -> Events).
- **Actions**: UI concerns binding a command to a capability.
- **Read Models (Projections)**: The write models emit events, which are projected into optimized read models (e.g., Activity Feed, Timeline, Search Index, Inspector View).

## Aggregates, Invariants, & Specifications

### Aggregates
Aggregates define transactional consistency boundaries.
- **Entity Aggregate**: Entity, Identity, Traits, Capabilities.
- **Resource Aggregate**: Resource, SyncState, Provenance, Source.
- **Knowledge Aggregate**: Relationships, Observations, Facts, Embeddings.
- **Context Aggregate**: Context, Participants, Active Resources.
- **History Aggregate**: Timeline Events, EntityVersions.

### Invariants
The unbreakable rules of the system:
- **Entity**: Must have exactly one ID. Must reference one EntityType. Cannot exist without an owner.
- **Relationship**: Cannot reference itself. Must reference two existing Entities. Confidence must be between 0 and 1.
- **Resource**: URI must be unique per provider. Must belong to exactly one Entity. Must have one Source.

### Specifications & Policies
- **Specifications**: Reusable business rules (e.g., `CanMergeEntitiesSpecification`, `UniqueIdentitySpecification`).
- **Policies**: System behaviors that evolve independently (e.g., `AutoMergePolicy`, `RetentionPolicy`).

## Plugin Manifest
Plugins dynamically extend PKOS by registering Entity Types, Relationship Types, Capabilities, Commands, and Capture Parsers.

## The Event Lifecycle (Knowledge Pipeline)

Every single mutation or discovery follows an immutable event stream across the `EventBus`.

**The Pipeline:**
`Capture -> Normalisation -> Identity -> Entity Creation -> Timeline Event -> Resource Detection -> Capability Assignment -> Classification -> Relationship Discovery -> Observation Generation -> Embedding -> Summary -> Automation -> Notification -> Graph Update -> Context Update`

## Monorepo Structure & ADRs

```text
docs/
  └── architecture/
      └── adr/       (Architectural Decision Records for every major design choice)
packages/
  ├── domain/        (Pure TypeScript: Interfaces, Value Objects, Specs, Domain Services, Repositories.)
  ├── validation/    (Zod schemas mapping to the domain)
  ├── database/      (Prisma, repository implementations)
  ├── api/           (CQRS command endpoints and read models)
  ├── workers/       (Event handlers, orchestration, AI processing)
  ├── plugins/       (Extensions manifesting capabilities)
  └── ui/            (Visual layer Actions and Projections)
```
