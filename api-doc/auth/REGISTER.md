# Register API

Register a new user account and receive an access token.

## Endpoint

```
POST /auth/register
```

## Headers

| Name          | Required | Description                  |
|---------------|----------|------------------------------|
| Content-Type  | Yes      | application/json             |

## Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Parameters

| Name      | Type   | Required | Description                                                                                               |
|-----------|--------|----------|-----------------------------------------------------------------------------------------------------------|
| email     | string | Yes      | User's email address (must be valid email format)                                                         |
| password  | string | Yes      | User's password (minimum 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character) |
| firstName | string | No       | User's first name                                                                                         |
| lastName  | string | No       | User's last name                                                                                          |

## Response

### Success Response (201 Created)

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

#### Email Already Exists (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "User with this email already exists",
  "error": "Bad Request"
}
```

#### Validation Error (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "Email is required",
    "Please provide a valid email address",
    "Password is required",
    "Password must be at least 8 characters long",
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character"
  ],
  "error": "Bad Request"
}
```

## Notes

- The returned access token should be included in the Authorization header for subsequent authenticated requests.
- Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- First name and last name are optional fields that can be provided during registration.
