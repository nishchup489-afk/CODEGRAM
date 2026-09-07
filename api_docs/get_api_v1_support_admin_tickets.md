# GET `/api/v1/support/admin/tickets`

Admin List Tickets

- Authentication: Admin bearer token required
- Operation ID: `admin_list_tickets_api_v1_support_admin_tickets_get`
- Backend implementation: [`backend/app/api/v1/support.py:210`](../backend/app/api/v1/support.py#L210)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `array[SupportTicketResponse]`

```json
[
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
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
