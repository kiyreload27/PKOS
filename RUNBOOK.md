# PKOS Operational Runbook

This document covers operational commands for the PKOS ecosystem.

## 1. Starting Services
Start the databases via Docker, then start the monorepo in dev mode.
```bash
docker compose up -d
pnpm dev
# In a new terminal:
pnpm worker
```

## 2. Stopping Services
```bash
# Gracefully stop dev servers
Ctrl+C
# Stop docker containers
docker compose down
```

## 3. Database Management
Push the Prisma schema to the database (used for projection tables and the event store).
```bash
pnpm db:push
```

## 4. Rebuilding Projections (Future capability)
When a projection is out of sync or the schema changes, it can be dropped and rebuilt from the `PKOSEvent` store.
*(Command to be implemented via CLI)*

## 5. Clearing BullMQ Queues
If the worker queue is deadlocked or filled with poison pills during development:
```bash
# Access redis CLI and flush queues
docker exec -it pkos-redis redis-cli FLUSHALL
```

## 6. Backing up PostgreSQL
```bash
docker exec -t pkos-postgres pg_dumpall -c -U postgres > pkos_dump_`date +%Y-%m-%d`.sql
```

## 7. Restoring PostgreSQL
```bash
cat pkos_dump_YYYY-MM-DD.sql | docker exec -i pkos-postgres psql -U postgres
```
