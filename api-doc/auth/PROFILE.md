# Get User Profile API

Retrieve the profile information of the authenticated user.

## Endpoint

```
GET /auth/profile
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
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["user"]
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

## Notes

- This endpoint requires authentication. The access token must be included in the Authorization header.
- Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
