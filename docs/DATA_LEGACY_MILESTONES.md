# Data — Legacy Milestones (Current)

This catalog defines legacy milestone targets and cash rewards. Values mirror `src/config.js`.

## Legacy Milestones

| id | label | type | threshold | rewardCash |
| --- | --- | --- | --- | --- |
| legacy_revenue_250k | $250k MRR | mrr | 250000 | 5000 |
| legacy_subscribers_1500 | 1,500 Subscribers | subscribers | 1500 | 4000 |
| legacy_reputation_80 | Reputation 80 | reputation | 80 | 6000 |
| legacy_story_complete | Complete Act 3 Story | storyComplete | 1 | 8000 |

## Behavior Notes
- Legacy milestones auto‑complete once thresholds are met and pay rewards once.
- Story completion triggers when the Day 270 Act 3 event fires.

## Config Mapping
Values map to:
- `CONFIG.legacyMilestones.milestoneOrder`
- `CONFIG.legacyMilestones.milestones.*`
