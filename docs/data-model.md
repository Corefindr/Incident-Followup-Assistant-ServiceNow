# Data Model

Table and field names below are generic recommendations. Use your scoped app prefix and organization naming standards in a real implementation.

## Follow-up Table

Recommended table: `x_scope_incident_followup`

| Field | Type | Purpose |
| --- | --- | --- |
| `incident` | Reference: Incident | Incident being tracked |
| `assigned_to` | Reference: User | Current follow-up owner |
| `assignment_group` | Reference: Group | Team responsible |
| `status` | Choice | Upcoming, Due, Overdue, Complete, Cancelled |
| `due_at` | Date/Time | Next expected follow-up date/time |
| `last_attempt_at` | Date/Time | Most recent attempt |
| `attempt_count` | Integer | Number of follow-up attempts |
| `repeat_cycle_count` | Integer | Times incident returned to Awaiting Caller |
| `caller_response_outcome` | Choice | Outcome from most recent attempt |
| `age_days` | Integer | Age of current pending cycle |
| `active` | Boolean | Whether follow-up is active |
| `notes` | String/Journal | Internal follow-up notes |

## Follow-up Attempt Table

Recommended table: `x_scope_followup_attempt`

| Field | Type | Purpose |
| --- | --- | --- |
| `followup` | Reference: Follow-up | Parent follow-up |
| `incident` | Reference: Incident | Incident snapshot |
| `attempt_type` | Choice | Phone, email, chat, portal comment |
| `outcome` | Choice | Result of the attempt |
| `summary` | String | Short note written by agent |
| `created_by_agent` | Reference: User | Agent making the attempt |

## Status Rules

| Status | Suggested rule |
| --- | --- |
| Upcoming | `due_at` is later than now |
| Due | `due_at` is today or inside the due window |
| Overdue | `due_at` is before now |
| Complete | Caller response or follow-up no longer needed |
| Cancelled | Incident no longer in Awaiting Caller or was closed |

