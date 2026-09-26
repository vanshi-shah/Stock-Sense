# API Contracts

All endpoints should follow a standard RESTful structure and return JSON.

## Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "error": null
}
```

## Authentication

### POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER"
    },
    "token": "jwt.token.string"
  }
}
```

### Authorization Header
All protected routes require:
`Authorization: Bearer <token>`
