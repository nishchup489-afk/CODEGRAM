# PATCH `/api/v1/admin/support-tickets/{ticket_id}`

Update Admin Support Ticket

- Authentication: Admin bearer token required
- Operation ID: `update_admin_support_ticket_api_v1_admin_support_tickets__ticket_id__patch`
- Backend implementation: [`backend/app/router/admin.py:116`](../backend/app/router/admin.py#L116)

## Frontend connections

- [`frontend/app/admin/support/page.tsx:293`](../frontend/app/admin/support/page.tsx#L293): `/admin/support-tickets/${ticketId}`
- [`frontend/app/admin/support/page.tsx:342`](../frontend/app/admin/support/page.tsx#L342): `/admin/support-tickets/${ticket.id}`

## Request schema

Model: `AdminUpdateSupportTicket`

```json
{
  "status": "open",
  "priority": "low",
  "internal_notes": "string"
}
```

## Return schema — HTTP 200

Model: `AdminSupportTicketItem`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
