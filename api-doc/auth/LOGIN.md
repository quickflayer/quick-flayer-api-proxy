# Login API

Authenticate a user and receive an access token.

## Endpoint

```
POST /auth/login
```

## Headers

| Name          | Required | Description                  |
|---------------|----------|------------------------------|
| Content-Type  | Yes      | application/json             |

## Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Parameters

| Name     | Type   | Required | Description                                       |
|----------|--------|----------|---------------------------------------------------|
| email    | string | Yes      | User's email address (must be valid email format) |
| password | string | Yes      | User's password (minimum 8 characters)            |

## Response

### Success Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user"]
  }
}
```

### Error Responses

#### Invalid Credentials (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### Bad Request (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "Email is required",
    "Please provide a valid email address",
    "Password is required",
    "Password must be at least 8 characters long"
  ],
  "error": "Bad Request"
}
```

## Notes

- The returned access token should be included in the Authorization header for subsequent authenticated requests.
- Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
