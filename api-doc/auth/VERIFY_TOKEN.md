# Verify Token API

Verify the validity of a JWT access token.

## Endpoint

```
POST /auth/verify
```

## Headers

| Name          | Required | Description                  |
|---------------|----------|------------------------------|
| Content-Type  | Yes      | application/json             |

## Request Body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Parameters

| Name  | Type   | Required | Description                                 |
|-------|--------|----------|---------------------------------------------|
| token | string | Yes      | JWT token to verify                         |

## Response

### Success Response (200 OK)

```json
{
  "valid": true,
  "payload": {
    "sub": "user-id",
    "email": "user@example.com",
    "roles": ["user"],
    "iat": 1621234567,
    "exp": 1621238167
  }
}
```

### Error Responses

#### Invalid Token (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "error": "Unauthorized"
}
```

#### Token Missing (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "Token is required",
  "error": "Bad Request"
}
```

## Notes

- This endpoint is useful for client applications to verify if a stored token is still valid without making an authenticated request.
- The payload contains the decoded JWT information including user ID, email, roles, and token expiration time.
