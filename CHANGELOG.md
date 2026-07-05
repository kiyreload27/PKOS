# Changelog

All notable changes to the PKOS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Phase D (Advanced Graph Visualization & Navigation) - *Pending*

## [1.1.0] - 2026-07-05
### Added
- **Phase C (Intelligence UX)**
- Command Palette UI (`Cmd+K`) using `cmdk`.
- Daily Briefing rendering on the Home page.
- AI Inbox for reviewing Provisional Entities.
- Knowledge Health Dashboard to track pending AI tasks.
- Timeline rendering for narrative projection of PKOSEvents.
- Inline Project deletion confirmation to prevent automated testing deadlocks.

### Fixed
- Fixed Project dropdown menu CSS clipping issue.
- Replaced native `window.confirm` with inline project deletion to fix headless testing blockages.

### Changed
- Froze Core Architecture at v1.1 to optimize for UX and reduce cognitive load.
