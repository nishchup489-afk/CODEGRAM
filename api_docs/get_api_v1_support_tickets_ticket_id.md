# GET `/api/v1/support/tickets/{ticket_id}`

Get My Ticket

- Authentication: Bearer token required
- Operation ID: `get_my_ticket_api_v1_support_tickets__ticket_id__get`
- Backend implementation: [`backend/app/api/v1/support.py:140`](../backend/app/api/v1/support.py#L140)

## Frontend connections

- [`frontend/app/settings/support/page.tsx:148`](../frontend/app/settings/support/page.tsx#L148): `/support/tickets/open`

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
