# PKOS (Personal Knowledge Operating System)

PKOS is an intelligent, event-sourced Personal Knowledge Operating System designed to capture, connect, and enrich your data automatically. It leverages a dynamic entity-relationship knowledge graph to map concepts, observations, and workflows.

## Features

- **Core Domain Model**: Decoupled Entities and Assets to manage everything from simple notes to complex concepts.
- **Knowledge Graph**: Powerful relationships, observations, and tracking between interconnected entities.
- **Intelligence**: Integrated AI memory and suggestions to provide context-aware insights, automate organization, and surface actionable observations.
- **Automations & Workflows**: Robust pipeline for capturing, processing, OCR, and organizing data asynchronously using workers.

## Architecture

This is a monorepo managed with [Turborepo](https://turbo.build/repo), containing the following components:

### Apps

- **`web`**: The main user interface, built with Next.js, featuring an activity stream, global search, and status dock.
- **`worker`**: A background service (powered by BullMQ/Redis) responsible for processing tasks, async workflows, and intelligence functions.
- **`docs`**: Documentation site built with Next.js.

### Packages

- **`@pkos/database`**: The core data layer, powered by Prisma and PostgreSQL.
- **`@repo/ui`**: Shared React component library.
- **`@repo/eslint-config`**: Shared ESLint configurations.
- **`@repo/typescript-config`**: Shared TypeScript configurations.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>=18)
- [pnpm](https://pnpm.io/) (>=9)
- PostgreSQL
- Redis (for BullMQ worker)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Set up the database:
   ```bash
   cd packages/database
   # Ensure your DATABASE_URL is set in your .env
   npx prisma generate
   npx prisma db push
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

This will run all applications and packages in parallel.

## Tooling Integration

- **TypeScript** for static type checking.
- **ESLint** for code linting.
- **Prettier** for code formatting.
