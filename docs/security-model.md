# Security Model

## Roles

Suggested roles:

- `x_scope.followup_agent`
- `x_scope.followup_manager`
- `x_scope.followup_admin`

## Access Rules

Agents should be able to:

- read follow-ups assigned to themselves or their assignment group
- create follow-up attempts
- update allowed fields such as outcome, notes, and next due date

Managers should be able to:

- read follow-ups for their teams
- reassign follow-ups
- view dashboard metrics
- update escalation fields where applicable

Admins should be able to:

- configure properties
- maintain choice lists
- manage scheduled job behavior
- troubleshoot records

## Public Repository Safety

Do not publish:

- update sets containing real sys_ids from production
- screenshots with caller/user data
- table records exported from real incidents
- internal URLs, customer names, group names, or employee IDs
- credentials or integration tokens

