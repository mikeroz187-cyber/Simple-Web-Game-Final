# Data — Automation Rules (Act 3)

This catalog defines Act 3 automation rules. Values mirror `config.toml` and are read-only until Act 3 is in scope.

---

## Act 3 Automation Defaults

| key | value | meaning |
| --- | --- | --- |
| enabled | false | Global automation toggle. |
| maxActionsPerDay | 1 | Maximum automated actions per day. |
| minCashReserve | 1000 | Cash buffer required before auto-booking. |

---

## Config Mapping
Values map to:
- `CONFIG.automation.*`
