# PATCH `/api/v1/support/admin/tickets/{ticket_id}`

Admin Update Ticket

- Authentication: Admin bearer token required
- Operation ID: `admin_update_ticket_api_v1_support_admin_tickets__ticket_id__patch`
- Backend implementation: [`backend/app/api/v1/support.py:243`](../backend/app/api/v1/support.py#L243)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `SupportTicketAdminUpdate`

```json
{
  "status": "open",
  "priority": "low",
  "internal_notes": "string"
}
```

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
