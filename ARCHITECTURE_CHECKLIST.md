# Architecture Compliance Checklist

Every Pull Request or AI-Agent implementation step MUST satisfy the following checklist before being merged. This enforces the v1.1 Architecture Freeze.

- [ ] Does this introduce a new abstraction? (If yes, requires a `DECISIONS.md` entry).
- [ ] Does this bypass the Event Bus? (Must be NO).
- [ ] Does this write directly to a projection table? (Must be NO).
- [ ] Does this introduce runtime dependencies into `@pkos/domain`? (Must be NO).
- [ ] Does this require a change to `PKOS_AI_HANDOVER.md`?
- [ ] Does this require an entry in `DECISIONS.md`?
- [ ] Does it change a user-facing workflow that requires a `QA_REPORT.md` update?
- [ ] Does the UI read exclusively from Projection tables for this feature? (Must be YES).
