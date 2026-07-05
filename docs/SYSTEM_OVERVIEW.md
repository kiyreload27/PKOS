# SYSTEM OVERVIEW

## What PKOS Is
PKOS (Personal Knowledge Operating System) is a knowledge graph application that automatically organizes user data. Instead of forcing users to manually categorize notes or bookmarks into folders, PKOS uses background AI processing to parse, classify, and connect information.

## What Problem It Solves
It solves the problem of manual knowledge organization. Users typically abandon note-taking systems because the friction of organizing, tagging, and linking data outweighs the benefits. PKOS removes this friction by pushing organization into an asynchronous background pipeline, surfacing only relevant, synthesized knowledge when needed.

## Main User Flow
1. **Capture:** User pastes text, a URL, or types a note into the Universal Capture box and submits.
2. **Enrich (Background):** The system asynchronously parses the capture, extracts entities, finds relationships, and generates summaries using AI.
3. **Store:** The results are immutably stored as events and instantly materialized into fast database projection tables.
4. **Rediscover:** The user sees a Daily Briefing, browses their Timeline, or searches the graph to rediscover connected knowledge without having explicitly tagged anything.

## Core Components
- **Web App (`apps/web`):** The Next.js frontend that renders the UI, handles user sessions, accepts capture input, and queries read-only projection tables.
- **Worker App (`apps/worker`):** The background service (BullMQ/Redis) that listens for new captures and runs the AI enrichment pipelines.
- **Domain (`packages/domain`):** Pure TypeScript logic containing the definitions and rules for Entities, Observations, and Relationships.
- **Database (`packages/database`):** The Prisma-managed PostgreSQL database storing the immutable Event Log and the fast-read Projection Tables.
