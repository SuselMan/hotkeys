# Tasks

Source-of-truth task tracker. One markdown file per task.

- `todo/` — not started or in progress.
- `done/` — shipped. Each file describes what was actually delivered, not the original spec.

When a task is finished, move (`git mv`) the file from `todo/` to `done/` and rewrite it from "what to build" to "what was delivered".

Numbering is global and stable — never renumber, even if a task is split or deleted (just delete the file). Keep new tasks monotonically increasing.

See `doc/project/project.md` for the overall design.
