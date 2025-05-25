# Admin Access Check API

Verify if the authenticated user has admin role access.

## Endpoint

```
GET /auth/admin-check
```

## Headers

| Name          | Required | Description                                    |
|---------------|----------|------------------------------------------------|
| Authorization | Yes      | Bearer token received from login or registration |
| Content-Type  | Yes      | application/json                               |

## Request Body

No request body required.

## Response

### Success Response (200 OK)

```json
{
  "message": "You have admin access"
}
```

### Error Responses

#### Unauthorized (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### Forbidden (403 Forbidden)

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Notes

- This endpoint requires authentication with an account that has the 'admin' role.
- The access token must be included in the Authorization header.
- Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- This endpoint can be used to verify admin privileges before attempting to access admin-only resources.
