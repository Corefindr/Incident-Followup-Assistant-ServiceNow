# Business Process

## Trigger

The process starts when an incident is placed on hold because the team is waiting for caller input.

Generic condition:

- `state = On Hold`
- `hold_reason = Awaiting Caller`

Exact values differ by ServiceNow implementation, so production builds should map these to local choice values.

## Follow-up Lifecycle

1. Incident enters Awaiting Caller.
2. App creates or reactivates a follow-up record.
3. Follow-up due date is calculated from configuration.
4. Agent sees the item in the Agent Command Center.
5. Agent records a follow-up attempt.
6. App writes a structured work note to the Incident.
7. Status recalculation moves the record between Upcoming, Due, and Overdue.
8. If the caller responds, the follow-up is resolved.
9. If the incident returns to Awaiting Caller later, repeat cycle count increases.

## Outcomes

Recommended attempt outcomes:

- Caller contacted
- Message left
- Email sent
- No response
- Caller responded
- Not required

## Manager View

The Team Manager dashboard should help answer:

- how many follow-ups are overdue
- which agents have high pending volume
- which incidents are ageing while awaiting response
- which incidents have repeated pending cycles
- which follow-ups need escalation or reassignment

