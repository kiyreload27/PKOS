# Phase D Strategy: The Daily Briefing & UX Refinement

**The North Star:**
*PKOS should help users remember, understand, and reconnect knowledge with less effort than they would spend organizing it manually.*

**The Phase D Mantra:**
*Every improvement in Phase D should make the Daily Briefing better without changing the Daily Briefing itself.*

---

## 1. The Centerpiece: The Daily Briefing
The Daily Briefing is the highest-priority feature for Phase D. Instead of a grid of disconnected modules, the briefing must be structured around answering core user questions:

- **What deserves my attention today?** (Backed by Observations, Tasks, Contexts)
- **What changed since yesterday?** (Backed by Timeline, PKOSEvents)
- **What should I remember?** (Backed by Memory Cards)
- **What connections did PKOS discover?** (Backed by Relationship Engine)
- **What needs my input?** (Backed by AI Inbox)
- **What have I been working on?** (Backed by Active Context + Recent Activity)

### The Central Ranking Layer (The "Newspaper Editor")
No engine is allowed to place itself directly into the briefing. Every engine (Timeline, Relationships, Observations, Memory Cards) produces candidates. The ranking layer acts as the newspaper editor, evaluating candidates based on Recency, Context Relevance, Relationship Density, and Knowledge Confidence.

### Anti-Goals (What the Briefing Must Never Do)
The Daily Briefing must never:
- Become a dashboard of dozens of widgets.
- Require configuration before it becomes useful.
- Surface low-confidence AI suggestions as if they were facts.
- Overwhelm the user with everything that changed.
- Duplicate information already shown elsewhere (It is not "Timeline Lite").

## 2. Memory Card Emergence & Knowledge Confidence

**Strict Memory Cards:** Memory Cards must *earn* their existence. They emerge because multiple signals indicate importance (e.g., referenced across captures, frequent search retrieval, heavily connected).

**Knowledge Confidence Score:** Entities will receive a computed "Knowledge Confidence" score. This is an internal ranking signal representing completeness and evidence. 
*Crucially, this will not be exposed as a raw percentage to prevent users from inferring false statistical probability. If exposed in the UI, it will use qualitative bands:*
- Emerging
- Developing
- Established
- Well Supported

## 3. Defining Success: User Outcomes
Phase D evaluates success not just by engineering capabilities, but by tangible user outcomes:

| Outcome | Example Indicator |
|---------|-------------------|
| Users rediscover forgotten knowledge | Briefing items are opened/expanded regularly |
| Users trust automatic organization | Few manual edits to AI-generated entities |
| Users spend less time searching | Average search session becomes shorter |
| Users return daily | Daily Briefing becomes the primary entry point |

**The Ultimate Metric: Dismissal Rate**
If users continually dismiss briefing items without opening them, the ranking is poor. If users consistently expand them, follow relationships, or jump into contexts, PKOS is succeeding. This metric tells us more about the "magic" of PKOS than shaving 100ms off render times.

## 4. Phase D Sequencing

To minimize risk and ensure the UI consumes the existing graph, implementation must follow this order:
1. **Golden Path Dataset:** Build deterministic seed data (People, Books, Meetings, Notes).
2. **First Milestone: Daily Briefing v1:** *Must render entirely from existing projection data without introducing new infrastructure.* This proves if PKOS can already tell a useful story.
3. **Quality Improvements:** Enhance Identity resolution, Relationship discovery, and Summaries. The Briefing visibly improves as a consequence.
4. **Memory Card Emergence:** Introduce evidence-based generation.
5. **Hybrid Search Refinement:** Fine-tune ranking and relevance based on the central ranking layer.

## 5. Engineering & QA Initiatives
- **CI Enforcement:** Automate the `ARCHITECTURE_CHECKLIST.md`.
- **Living Test Suite:** Convert manual QA workflows into Playwright automated tests.
- **Pipeline Observability:** Track worker failures, event creation latency, queue depth, and merge acceptance rates.
