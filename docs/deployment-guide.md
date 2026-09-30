# Deployment Guide

## Recommended Path

1. Create a scoped ServiceNow application.
2. Create the follow-up and attempt tables from `docs/data-model.md`.
3. Add roles from `src/configuration/roles.md`.
4. Add system properties from `src/configuration/properties.md`.
5. Create `FollowupUtils` as a Script Include.
6. Create the Business Rules from `src/business-rules/`.
7. Create the scheduled job from `src/scheduled-jobs/`.
8. Build the Agent Command Center and Team Overview experiences.
9. Test with demo incidents that contain fake caller data.

## Validation Checklist

- Incident entering Awaiting Caller creates a follow-up.
- Duplicate active follow-ups are not created for the same incident.
- Re-entering Awaiting Caller increments repeat cycle count.
- Due and overdue status buckets update without manual edits.
- Attempt processing writes a structured incident work note.
- Agent and manager roles only see appropriate records.
- No production data is used in testing screenshots or demo exports.

## Known Studio Fix

If creating the Team Overview as a generated UI Page artifact, ensure the generated metadata uses a valid category:

```ts
category: 'general',
```

An empty category can fail build/deploy validation.

