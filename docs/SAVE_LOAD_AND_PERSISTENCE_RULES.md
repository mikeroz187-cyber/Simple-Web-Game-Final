# Save / Load & Persistence Rules (Canonical)

This is the single source of truth for how **Studio Empire** stores, loads, and resets game progress.

## localStorage Usage
- Saves live in `localStorage` under keys derived from `CONFIG.save.localstorage_key`.
- The default slot uses the base key; additional slots append `_<slotId>`.
- Only the **current slot key** is touched during save/load/reset actions.

## Autosave Behavior
- Autosave runs when `CONFIG.save.autosave_enabled` is true.
- Autosave writes to `CONFIG.save.autosave_slot_id` on a timer (`CONFIG.save.autosave_interval_seconds`) and on key game actions.

## Manual Save / Load
- **Options → Save Now** writes the full `gameState` to the currently selected slot.
- **Options → Load** replaces `gameState` from the currently selected slot (with validation + migration).
- Save schema is versioned (`CONFIG.save.save_schema_version`) with lightweight migration hooks.

## Export / Import
- **Export** writes the full `gameState` to a JSON file.
- **Import** reads a JSON file, validates/migrates it, and replaces `gameState` with the imported data.

## Options → New Game (Reset Current Slot)
- **Confirmation required:** a confirm modal appears before resetting.
- Resets **only** the current save slot (no `localStorage.clear()`).
- Overwrites that slot with a fresh `newGameState()` and immediately persists it.
- Export/import data formats remain unchanged; existing exports still work.
