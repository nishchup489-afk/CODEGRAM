# POST `/api/v1/support/tickets`

Create Ticket

- Authentication: Bearer token required
- Operation ID: `create_ticket_api_v1_support_tickets_post`
- Backend implementation: [`backend/app/router/support.py:59`](../backend/app/router/support.py#L59)

## Frontend connections

- [`frontend/app/settings/support/new/page.tsx:148`](../frontend/app/settings/support/new/page.tsx#L148): `/support/tickets`

## Request schema

Model: `SupportTicketCreate`

```json
{
  "category": "bug",
  "subject": "string",
  "description": "string",
  "project_id": "uuid",
  "diagnostics": {}
}
```

## Return schema — HTTP 201

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
