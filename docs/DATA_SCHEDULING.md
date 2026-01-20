# Data — Scheduling Rules (Act 3)

This catalog defines Act 3 scheduling rules. Values mirror `config.toml` and are read-only until Act 3 is in scope.

---

## Act 3 Scheduling Defaults

| key | value | meaning |
| --- | --- | --- |
| enabled | false | Enable advanced scheduling queue. |
| maxQueueSize | 3 | Maximum queued bookings. |
| resolvePerDay | 1 | Bookings resolved per day. |

---

## Config Mapping
Values map to:
- `CONFIG.schedule.*`
