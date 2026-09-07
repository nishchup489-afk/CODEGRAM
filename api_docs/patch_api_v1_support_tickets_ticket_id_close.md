# PATCH `/api/v1/support/tickets/{ticket_id}/close`

Close My Ticket

- Authentication: Bearer token required
- Operation ID: `close_my_ticket_api_v1_support_tickets__ticket_id__close_patch`
- Backend implementation: [`backend/app/api/v1/support.py:163`](../backend/app/api/v1/support.py#L163)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `SupportTicketResponse`

```json
{
  "id": "uuid",
  "ticket_number": "string",
  "category": "bug",
  "subject": "string",
  "description": "string",
  "status": "open",
  "priority": "low",
  "project_id": "uuid",
  "created_at": "date-time",
  "updated_at": "date-time",
  "resolved_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
