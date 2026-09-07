# GET `/api/v1/admin/support-tickets`

List Admin Support Tickets

- Authentication: Admin bearer token required
- Operation ID: `list_admin_support_tickets_api_v1_admin_support_tickets_get`
- Backend implementation: [`backend/app/api/v1/admin.py:98`](../backend/app/api/v1/admin.py#L98)

## Frontend connections

- [`frontend/app/admin/support/page.tsx:256`](../frontend/app/admin/support/page.tsx#L256): `/admin/support-tickets`

## Return schema — HTTP 200

Model: `array[AdminSupportTicketItem]`

```json
[
  {
    "id": "uuid",
    "ticket_number": "string",
    "user_id": "uuid",
    "project_id": "uuid",
    "category": "bug",
    "status": "open",
    "priority": "low",
    "subject": "string",
    "description": "string",
    "internal_notes": "string",
    "resolved_at": "date-time",
    "created_at": "date-time",
    "updated_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
