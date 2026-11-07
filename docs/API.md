# Backend API contract

The dashboard talks to a backend through the `ApiClient` interface in
[`src/lib/api/client.ts`](../src/lib/api/client.ts). The bundled HTTP
implementation ([`src/lib/api/http-client.ts`](../src/lib/api/http-client.ts))
expects the REST and WebSocket endpoints below. Field-level shapes are the
TypeScript types in [`src/lib/api/types.ts`](../src/lib/api/types.ts).

If your backend looks different, you have two options:

1. Implement these endpoints.
2. Write your own `ApiClient` (for example on top of Supabase, Firebase or
   tRPC) and return it from `ApiProvider`. The UI only depends on the interface.

## Conventions

- Base URL: `NEXT_PUBLIC_API_URL`.
- Auth: `Authorization: Bearer <token>` where the token comes from the active
  auth adapter (a Clerk session JWT by default, using
  `NEXT_PUBLIC_CLERK_TOKEN_TEMPLATE` if set). Requests are sent with
  `credentials: 'include'`.
- Errors: any non-2xx response. A JSON body of `{ "detail": "..." }` is shown to
  the user as the error message.
- Timestamps: `*_timestamp` and `updated_at` on summaries are Unix seconds;
  other dates are ISO 8601 strings.

## Workspace

| Method | Path                          | Body                   | Response    |
| ------ | ----------------------------- | ---------------------- | ----------- |
| GET    | `/api/v1/gateway/identity`    |                        | `Workspace` |
| GET    | `/api/v1/clinic`              |                        | `Clinic`    |
| PATCH  | `/api/v1/clinic`              | `UpdateClinicInput`    | `Clinic`    |
| POST   | `/api/v1/clinic/accept-terms` |                        | 204         |
| POST   | `/api/v1/whatsapp/connect`    | `ConnectWhatsAppInput` | 204         |

`/whatsapp/connect` is called after Meta's WhatsApp embedded signup finishes.
The backend is responsible for registering the sender with its messaging
provider. Provider credentials must never be sent to the browser.

Setting `url` on the clinic should (re)start crawling the website to train the
assistant; `website_last_crawled_at` reports progress.

## Settings and widget

| Method | Path                            | Body                                  | Response                                                |
| ------ | ------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| GET    | `/api/v1/clinic/settings`       |                                       | `ClinicSettings`                                        |
| PATCH  | `/api/v1/clinic/settings`       | `Partial<ClinicSettings>`             | `ClinicSettings`                                        |
| POST   | `/api/v1/clinic/settings/logo`  | multipart, field `file` (JPEG or PNG) | `{ logo: string }`                                      |
| GET    | `/api/v1/gateway/snippet`       |                                       | `WidgetSnippet` (object passed to the widget init call) |
| GET    | `/api/v1/gateway/widget-status` |                                       | `WidgetStatus`                                          |
| GET    | `/api/v1/gateway/quota`         |                                       | `Quota`                                                 |

## Conversations

| Method | Path                                                | Body                                                                                              | Response                  |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------- |
| GET    | `/api/v1/conversations`                             | query: `page`, `size`, `transferred_to_human=true`, `message__content__ilike`, `full_name__ilike` | `Page<Conversation>`      |
| GET    | `/api/v1/conversations/metrics`                     |                                                                                                   | `ConversationMetrics`     |
| GET    | `/api/v1/conversations/{lead_id}`                   |                                                                                                   | `Conversation`            |
| GET    | `/api/v1/conversations/{lead_id}/messages`          |                                                                                                   | `Message[]`, newest first |
| GET    | `/api/v1/conversations/{lead_id}/summary`           |                                                                                                   | `ConversationSummary`     |
| POST   | `/api/v1/conversations/{lead_id}/summary`           |                                                                                                   | regenerate, 2xx           |
| PUT    | `/api/v1/conversations/{lead_id}/transfer-to-human` | `{ transferred_to_human: true, lead_id }`                                                         | 2xx                       |
| PUT    | `/api/v1/conversations/{lead_id}/transfer-to-ai`    | `{ transferred_to_human: false, lead_id }`                                                        | 2xx                       |

Search sends the same term in both `message__content__ilike` and
`full_name__ilike`; the backend should match either.

## Contacts

| Method | Path                           | Body                 | Response    |
| ------ | ------------------------------ | -------------------- | ----------- |
| GET    | `/api/v1/contacts`             |                      | `Contact[]` |
| POST   | `/api/v1/contacts`             | `CreateContactInput` | `Contact`   |
| PATCH  | `/api/v1/contacts/{id}`        | `UpdateContactInput` | `Contact`   |
| DELETE | `/api/v1/contacts/{id}`        |                      | 2xx         |
| DELETE | `/api/v1/contacts/bulk-delete` | JSON array of ids    | 2xx         |

## Campaigns and templates

| Method | Path                         | Body                       | Response       |
| ------ | ---------------------------- | -------------------------- | -------------- |
| GET    | `/api/v1/campaigns`          |                            | `CampaignList` |
| POST   | `/api/v1/campaigns`          | `CreateCampaignInput`      | `Campaign`     |
| GET    | `/api/v1/whatsapp/templates` | query: `status`, `lead_id` | `Template[]`   |
| POST   | `/api/v1/whatsapp/templates` | `CreateTemplateInput`      | `Template`     |

## WebSockets

Base URL: `NEXT_PUBLIC_WS_URL`. The token is passed as a `token` query
parameter because browsers cannot set headers on WebSocket connections. The
client reconnects with exponential backoff (1s to 30s).

### `/conversations?token=…`

Server pushes a full `Conversation` JSON object whenever a conversation is
created or changes (new message, handover).

### `/conversations/{lead_id}/messages?token=…`

Server pushes `MessageEvent` objects:

```json
{ "type": "new_message", "payload": { "...": "Message" } }
{ "type": "message_status_update", "payload": { "message_id": "…", "status": "delivered" } }
```

A bare `Message` object is also accepted and treated as `new_message`.

Client sends a message to the customer:

```json
{ "body": "Hi!", "channel": "whatsapp", "author": "system", "template_id": null }
```

`template_id` is required for WhatsApp when the conversation's
`free_message_allowed` is false (outside the 24-hour customer service window).
