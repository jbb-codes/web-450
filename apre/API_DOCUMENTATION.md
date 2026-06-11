# API Documentation

**Base URL:** `http://localhost:3000/api`

## Table of Contents

1. [Index Endpoints](#index-endpoints)
2. [Users Endpoints](#users-endpoints)
3. [Security Endpoints](#security-endpoints)
4. [Dashboard Endpoints](#dashboard-endpoints)
5. [Sales Reports Endpoints](#sales-reports-endpoints)
6. [Agent Performance Reports Endpoints](#agent-performance-reports-endpoints)
7. [Customer Feedback Reports Endpoints](#customer-feedback-reports-endpoints)
8. [Error Responses](#error-responses)

---

## Index Endpoints

### GET /

**Description:** Returns a welcome message from the API.

**URL:** `GET http://localhost:3000/api`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api
```

**Response (Status 200):**

```json
{
  "message": "Hello from the Expense Tracking System server!"
}
```

---

## Users Endpoints

### GET /users

**Description:** Retrieves a list of all users from the database.

**URL:** `GET http://localhost:3000/api/users`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/users
```

**Response (Status 200):**

```json
[
  {
    "_id": "650c1f1e1c9d440000a1b1c3",
    "username": "jdoe",
    "email": "jdoe@example.com",
    "role": "user",
    "passwordHash": "$2a$10$...",
    "createdAt": "2024-08-10T12:30:45.000Z",
    "updatedAt": "2024-08-10T12:30:45.000Z"
  }
]
```

---

### GET /users/:id

**Description:** Retrieves a single user by their ID.

**URL:** `GET http://localhost:3000/api/users/:id`

**Parameters:**

- `id` (URL parameter) - MongoDB ObjectId of the user (required)

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/users/650c1f1e1c9d440000a1b1c3
```

**Response (Status 200):**

```json
{
  "_id": "650c1f1e1c9d440000a1b1c3",
  "username": "jdoe",
  "email": "jdoe@example.com",
  "role": "user",
  "passwordHash": "$2a$10$...",
  "createdAt": "2024-08-10T12:30:45.000Z",
  "updatedAt": "2024-08-10T12:30:45.000Z"
}
```

**Error Response (Status 500):**

- Invalid ObjectId format

---

### POST /users

**Description:** Creates a new user in the database.

**URL:** `POST http://localhost:3000/api/users`

**Parameters:** None

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "user": {
    "username": "jdoe",
    "passwordHash": "Password01",
    "email": "jdoe@example.com",
    "role": "user"
  }
}
```

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "username": "jdoe",
      "passwordHash": "Password01",
      "email": "jdoe@example.com",
      "role": "user"
    }
  }'
```

**Response (Status 200):**

```json
{
  "id": "650c1f1e1c9d440000a1b1c3"
}
```

**Error Response (Status 500):**

- Database connection error
- Invalid input data

---

### PUT /users/:id

**Description:** Updates an existing user's information.

**URL:** `PUT http://localhost:3000/api/users/:id`

**Parameters:**

- `id` (URL parameter) - MongoDB ObjectId of the user (required)

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "username": "jdoe_updated",
  "email": "jdoe.updated@example.com",
  "role": "admin",
  "password": "NewPassword123"
}
```

All fields are optional. Only provided fields will be updated.

**Request Example:**

```bash
curl -X PUT http://localhost:3000/api/users/650c1f1e1c9d440000a1b1c3 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jdoe_updated",
    "email": "jdoe.updated@example.com",
    "role": "admin",
    "password": "NewPassword123"
  }'
```

**Response (Status 200):**

```json
{
  "id": "650c1f1e1c9d440000a1b1c3"
}
```

**Error Response (Status 500):**

- Invalid ObjectId format
- Database connection error

---

### DELETE /users/:id

**Description:** Deletes a user from the database by ID.

**URL:** `DELETE http://localhost:3000/api/users/:id`

**Parameters:**

- `id` (URL parameter) - MongoDB ObjectId of the user (required)

**Request Example:**

```bash
curl -X DELETE http://localhost:3000/api/users/650c1f1e1c9d440000a1b1c3
```

**Response (Status 200):**

```json
{
  "id": "650c1f1e1c9d440000a1b1c3"
}
```

**Error Response (Status 500):**

- Invalid ObjectId format
- Database connection error

---

## Security Endpoints

### POST /security/signin

**Description:** Authenticates a user with username and password.

**URL:** `POST http://localhost:3000/api/security/signin`

**Parameters:** None

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "username": "admin",
  "password": "password"
}
```

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/security/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

**Response (Status 200):**

```json
{
  "username": "admin",
  "role": "admin"
}
```

**Error Response (Status 401):**

```json
{
  "type": "error",
  "status": 401,
  "message": "Not authorized"
}
```

---

## Dashboard Endpoints

### GET /dashboard/sales-data

**Description:** Fetches sales data grouped by region.

**URL:** `GET http://localhost:3000/api/dashboard/sales-data`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/dashboard/sales-data
```

**Response (Status 200):**

```json
[
  {
    "region": "North",
    "totalAmount": 15000
  },
  {
    "region": "South",
    "totalAmount": 12500
  }
]
```

**Error Response (Status 500):**

- Database connection error

---

### GET /dashboard/agent-performance

**Description:** Fetches agent performance data with average performance metrics.

**URL:** `GET http://localhost:3000/api/dashboard/agent-performance`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/dashboard/agent-performance
```

**Response (Status 200):**

```json
[
  {
    "agentId": "agent_001",
    "name": "John Smith",
    "averagePerformance": 85.5
  },
  {
    "agentId": "agent_002",
    "name": "Jane Doe",
    "averagePerformance": 92.0
  }
]
```

**Error Response (Status 500):**

- Database connection error

---

### GET /dashboard/customer-feedback

**Description:** Fetches customer feedback data grouped by feedback type with average performance metrics.

**URL:** `GET http://localhost:3000/api/dashboard/customer-feedback`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/dashboard/customer-feedback
```

**Response (Status 200):**

```json
[
  {
    "feedbackType": "Positive",
    "averagePerformance": 88.5
  },
  {
    "feedbackType": "Neutral",
    "averagePerformance": 75.0
  }
]
```

**Error Response (Status 500):**

- Database connection error

---

### GET /dashboard/report-types

**Description:** Fetches available report types and their counts.

**URL:** `GET http://localhost:3000/api/dashboard/report-types`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/dashboard/report-types
```

**Response (Status 200):**

```json
{
  "reportTypes": ["Sales Report", "Customer Feedback Report", "Agent Performance Report"],
  "reportCounts": [125, 89, 76]
}
```

**Error Response (Status 500):**

- Database connection error

---

### GET /dashboard/agent-feedback

**Description:** Fetches agent feedback data including call duration and customer feedback.

**URL:** `GET http://localhost:3000/api/dashboard/agent-feedback`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/dashboard/agent-feedback
```

**Response (Status 200):**

```json
[
  {
    "agent": "John Smith",
    "callDuration": 450,
    "customerFeedback": ["Positive", "Positive", "Neutral"]
  }
]
```

**Error Response (Status 500):**

- Database connection error

---

## Sales Reports Endpoints

### GET /reports/sales/regions

**Description:** Fetches a list of distinct sales regions.

**URL:** `GET http://localhost:3000/api/reports/sales/regions`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/reports/sales/regions
```

**Response (Status 200):**

```json
["North", "South", "East", "West"]
```

**Error Response (Status 500):**

- Database connection error

---

### GET /reports/sales/regions/:region

**Description:** Fetches sales data for a specific region, grouped by salesperson.

**URL:** `GET http://localhost:3000/api/reports/sales/regions/:region`

**Parameters:**

- `region` (URL parameter) - The region name (required)

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/reports/sales/regions/North
```

**Response (Status 200):**

```json
[
  {
    "salesperson": "John Smith",
    "totalSales": 5000
  },
  {
    "salesperson": "Jane Doe",
    "totalSales": 7500
  }
]
```

**Error Response (Status 500):**

- Database connection error

---

### GET /reports/sales/categories

**Description:** Fetches a list of distinct product categories from the sales collection.

**URL:** `GET http://localhost:3000/api/reports/sales/categories`

**Parameters:** None

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/reports/sales/categories
```

**Response (Status 200):**

```json
["Electronics", "Clothing", "Home & Garden", "Sports"]
```

**Error Response (Status 500):**

- Database connection error

---

### GET /reports/sales/categories/:category

**Description:** Fetches sales data for a specific product category, grouped by salesperson.

**URL:** `GET http://localhost:3000/api/reports/sales/categories/:category`

**Parameters:**

- `category` (URL parameter) - The product category name (required)

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/reports/sales/categories/Electronics
```

**Response (Status 200):**

```json
[
  {
    "salesperson": "John Smith",
    "totalSales": 5000
  },
  {
    "salesperson": "Jane Doe",
    "totalSales": 7500
  }
]
```

**Error Response (Status 500):**

- Database connection error

---

## Agent Performance Reports Endpoints

### GET /reports/agent-performance/call-duration-by-date-range

**Description:** Fetches call duration data for agents within a specified date range.

**URL:** `GET http://localhost:3000/api/reports/agent-performance/call-duration-by-date-range`

**Parameters:**

- `startDate` (Query parameter) - Start date in ISO 8601 format (required)
- `endDate` (Query parameter) - End date in ISO 8601 format (required)

**Request Example:**

```bash
curl -X GET "http://localhost:3000/api/reports/agent-performance/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31"
```

**Response (Status 200):**

```json
[
  {
    "agents": ["John Smith", "Jane Doe"],
    "callDurations": [1200, 1450]
  }
]
```

**Error Response (Status 400):**

```json
{
  "type": "error",
  "status": 400,
  "message": "Start date and end date are required"
}
```

**Error Response (Status 500):**

- Database connection error
- Invalid date format

---

## Customer Feedback Reports Endpoints

### GET /reports/customer-feedback/channel-rating-by-month

**Description:** Fetches average customer feedback ratings by channel for a specified month.

**URL:** `GET http://localhost:3000/api/reports/customer-feedback/channel-rating-by-month`

**Parameters:**

- `month` (Query parameter) - Month number (1-12) (required)

**Request Example:**

```bash
curl -X GET "http://localhost:3000/api/reports/customer-feedback/channel-rating-by-month?month=1"
```

**Response (Status 200):**

```json
[
  {
    "channels": ["Phone", "Email", "Chat"],
    "ratingAvg": [[4.5], [4.2], [4.8]]
  }
]
```

**Error Response (Status 400):**

```json
{
  "type": "error",
  "status": 400,
  "message": "month and channel are required"
}
```

**Error Response (Status 500):**

- Database connection error

---

## Error Responses

### Standard Error Response Format

All error responses follow this format:

```json
{
  "type": "error",
  "status": <HTTP_STATUS_CODE>,
  "message": "<Error message>",
  "stack": "<Stack trace (only in development mode)>"
}
```

### Common HTTP Status Codes

| Status Code | Meaning                                                     |
| ----------- | ----------------------------------------------------------- |
| 200         | OK - Request succeeded                                      |
| 400         | Bad Request - Invalid parameters or missing required fields |
| 401         | Unauthorized - Authentication failed                        |
| 404         | Not Found - Resource not found                              |
| 500         | Internal Server Error - Server-side error occurred          |

### Common Error Messages

| Error                                | Status | Possible Causes                                                               |
| ------------------------------------ | ------ | ----------------------------------------------------------------------------- |
| Not Found                            | 404    | Requested resource does not exist                                             |
| Not authorized                       | 401    | Invalid username or password in signin request                                |
| Start date and end date are required | 400    | Missing startDate or endDate query parameters                                 |
| month and channel are required       | 400    | Missing month query parameter                                                 |
| Internal Server Error                | 500    | Database connection failure, invalid ObjectId format, unexpected server error |

---

## CORS Configuration

The API allows requests from all origins with the following:

- **Allowed Origins:** `*` (all origins)
- **Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers:** Origin, X-Requested-With, Content-Type, Accept

---

## Authentication

Currently, the API supports basic authentication via the `/security/signin` endpoint. No session tokens or JWT tokens are returned from the signin endpoint. For secured endpoints, implement additional authentication middleware as needed.

---

## Database

All data is stored in MongoDB. The application uses the following collections:

- `users` - User accounts and credentials
- `sales` - Sales transactions and data
- `agents` - Agent information
- `agentPerformance` - Agent performance metrics
- `customerFeedback` - Customer feedback and ratings

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- MongoDB ObjectIds are used as unique identifiers
- Passwords are hashed using bcrypt with 10 salt rounds
- All date parameters should be in ISO 8601 format (YYYY-MM-DD or full ISO 8601 datetime)
