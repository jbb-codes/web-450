# APRE Reporting & Analytics Platform — UI Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [URL Routes](#url-routes)
4. [Security Constraints](#security-constraints)
5. [Component Directory](#component-directory)
6. [Data Models](#data-models)
7. [Authentication Flow](#authentication-flow)

---

## Project Overview

**APRE** (Automated Performance & Reporting Engine) is a reporting and analytics platform designed for regional sales managers to view consolidated sales, agent performance, and customer feedback data.

**Primary User:** Marcus Tillman, Regional Sales Manager

- Age: 46, oversees 12 sales agents and 3 support reps
- Mildly color-blind (deuteranopia)
- Intermediate technical skills
- Requires fast-loading, visually scannable layouts

**Key Features:**

- Unified dashboard with KPI summary cards and charts
- Sales by region filtering and comparison
- Agent performance tracking with call duration analysis
- Customer feedback ratings by channel
- Export reports as PDF or CSV

---

## Architecture

### Technology Stack

**Frontend:**

- **Framework:** Angular (latest)
- **Routing:** Angular Router with guard-based authentication
- **Charting:** Chart.js
- **Build Tool:** Angular CLI

**Backend:**

- **Framework:** Express.js (Node.js)
- **Database:** MongoDB
- **Authentication:** bcrypt password hashing
- **CORS:** Enabled for all origins (dev configuration)

### Directory Structure

```
apre/
├── apre-client/           # Angular frontend application
│   └── src/app/
│       ├── admin/         # User management (admin only)
│       ├── dashboard/     # Main dashboard view
│       ├── reports/       # Report pages
│       ├── security/      # Auth components and guards
│       ├── layouts/       # Layout wrappers
│       ├── shared/        # Shared services and utilities
│       └── app.routes.ts  # Route configuration
├── apre-server/           # Express backend API
│   └── src/
│       ├── routes/        # API endpoint definitions
│       ├── utils/         # Utilities (MongoDB, error handling)
│       └── app.js         # Express app setup
```

---

## URL Routes

### Client-Side Routes (Angular)

All authenticated routes require `authGuard` activation. Base path is `/` under `MainLayoutComponent`.

#### Authentication

| Path      | Component         | Purpose         | Auth Required |
| --------- | ----------------- | --------------- | ------------- |
| `/signin` | `SigninComponent` | User login page | No            |

#### Main Navigation (Protected)

| Path       | Component            | Purpose                                  |
| ---------- | -------------------- | ---------------------------------------- |
| `/`        | `DashboardComponent` | Main dashboard with KPI cards and charts |
| `/demo`    | `DemoComponent`      | Demo/reference page                      |
| `/support` | `SupportComponent`   | Support/help page                        |
| `/faq`     | `FaqComponent`       | Frequently asked questions               |

#### Reports

**Sales Reports** (`/reports/sales`)

- `/reports/sales/sales-by-region` → `SalesByRegionComponent` - Regional sales comparison
- `/reports/sales/sales-by-region-tabular` → `SalesByRegionTabularComponent` - Tabular sales data view
- `/reports/sales/sales-by-category` → `SalesByCategoryComponent` - Sales by product category

**Agent Performance** (`/reports/agent-performance`)

- `/reports/agent-performance/call-duration-by-date-range` → `CallDurationByDateRangeComponent` - Filtered call duration analysis

**Customer Feedback** (`/reports/customer-feedback`)

- `/reports/customer-feedback/channel-rating-by-month` → `ChannelRatingByMonthComponent` - Monthly channel ratings

#### User Management (Admin Only)

| Path                         | Component                 | Purpose                |
| ---------------------------- | ------------------------- | ---------------------- |
| `/user-management`           | `UserManagementComponent` | User management hub    |
| `/user-management/users`     | `UsersComponent`          | List all users         |
| `/user-management/users/new` | `UserCreateComponent`     | Create new user        |
| `/user-management/users/:id` | `UserDetailsComponent`    | View/edit user details |

---

### API Routes (Express Backend)

**Base URL:** `http://localhost:3000/api`

#### Security Endpoints

| Method | Path               | Payload                  | Response             | Purpose           |
| ------ | ------------------ | ------------------------ | -------------------- | ----------------- |
| `POST` | `/security/signin` | `{ username, password }` | `{ username, role }` | Authenticate user |

**Example:**

```javascript
fetch("/api/security/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "password" }),
});
```

#### User Management Endpoints

| Method   | Path             | Payload                                             | Response | Purpose             |
| -------- | ---------------- | --------------------------------------------------- | -------- | ------------------- |
| `GET`    | `/api/users`     | None                                                | `User[]` | Retrieve all users  |
| `GET`    | `/api/users/:id` | None                                                | `User`   | Retrieve user by ID |
| `POST`   | `/api/users`     | `{ user: { username, passwordHash, email, role } }` | `{ id }` | Create new user     |
| `PUT`    | `/api/users/:id` | `{ username?, role?, email?, password? }`           | `{ id }` | Update user         |
| `DELETE` | `/api/users/:id` | None                                                | `{ id }` | Delete user         |

#### Dashboard Endpoints

| Method | Path             | Purpose                                   |
| ------ | ---------------- | ----------------------------------------- |
| `GET`  | `/api/dashboard` | Retrieve dashboard KPI data and summaries |

#### Sales Report Endpoints

| Method | Path                                      | Parameters        | Purpose                                                 |
| ------ | ----------------------------------------- | ----------------- | ------------------------------------------------------- |
| `GET`  | `/api/reports/sales/regions`              | None              | Retrieve list of distinct sales regions                 |
| `GET`  | `/api/reports/sales/regions/:region`      | `:region` (URL)   | Retrieve sales data by region, grouped by salesperson   |
| `GET`  | `/api/reports/sales/categories`           | None              | Retrieve list of distinct product categories            |
| `GET`  | `/api/reports/sales/categories/:category` | `:category` (URL) | Retrieve sales data by category, grouped by salesperson |

#### Agent Performance Endpoints

| Method | Path                             | Query Parameters         | Purpose                                          |
| ------ | -------------------------------- | ------------------------ | ------------------------------------------------ |
| `GET`  | `/api/reports/agent-performance` | `?startDate`, `?endDate` | Retrieve agent call duration data for date range |

#### Customer Feedback Endpoints

| Method | Path                             | Query Parameters  | Purpose                                           |
| ------ | -------------------------------- | ----------------- | ------------------------------------------------- |
| `GET`  | `/api/reports/customer-feedback` | `?month`, `?year` | Retrieve customer satisfaction ratings by channel |

---

## Security Constraints

### Authentication & Authorization

1. **Sign-In Required**
   - Users must authenticate via `/signin` before accessing protected routes
   - `authGuard` enforces authentication on all MainLayoutComponent children
   - Unauthenticated requests redirect to `/signin`

2. **Role-Based Access Control**
   - Users have assigned roles: `manager`, `admin`, `user`
   - Marcus (persona) has `manager` role
   - Admin-only pages: User Management (`/user-management`)
   - Manager pages: Dashboard, reports, export features

3. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - No plaintext passwords stored in database
   - Password validation on signin uses `bcrypt.compareSync()`

### API Security

1. **CORS Configuration**
   - Currently allows all origins (`*`)
   - **⚠️ Production Note:** Restrict to specific domains
   - Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`
   - Allowed headers: `Origin, X-Requested-With, Content-Type, Accept`

2. **Data Validation**
   - User creation requires: `username`, `passwordHash`, `email`, `role`
   - PUT requests validate optional fields before update
   - Invalid ObjectId formats return errors

3. **Error Handling**
   - `401 Unauthorized` - Invalid credentials during signin
   - `404 Not Found` - Invalid route or resource not found
   - `500 Server Error` - Database or server errors logged to console

4. **Protected Endpoints**
   - All `/api/users` endpoints should verify user role (admin only) — **not currently enforced**
   - ⚠️ **Security Gap:** No middleware validates user role on requests

### Data Privacy

- User passwords hashed before storage
- MongoDB queries filtered by user context (role-based)
- Sensitive fields (password hashes) excluded from API responses

---

## Component Directory

### Core Components

#### `MainLayoutComponent`

- **Path:** `src/app/layouts/main-layout/`
- **Purpose:** Top-level layout wrapper for all authenticated pages
- **Features:** Header, sidebar navigation, main content area
- **Props:** None (uses route configuration)

#### `DashboardComponent`

- **Path:** `src/app/dashboard/`
- **Purpose:** Main landing page showing KPI summary and charts
- **Features:**
  - 4 KPI cards: Total Sales, Team Size, Avg Call Duration, Customer Satisfaction
  - Date range filter (startDate to endDate)
  - Region filter dropdown
  - 4 chart areas (rendered by Chart.js)
  - Export to PDF button
- **API Calls:** `GET /api/dashboard`

### Report Components

#### `SalesComponent` (Parent)

- **Path:** `src/app/reports/sales/`
- **Purpose:** Sales reporting hub
- **Children:**
  - `SalesByRegionComponent` - Visual chart of sales by region
  - `SalesByRegionTabularComponent` - Table view of regional sales
  - `SalesByCategoryComponent` - Bar chart of sales by product category

#### `SalesByRegionComponent`

- **Path:** `src/app/reports/sales/sales-by-region/`
- **Purpose:** Visualize sales performance across regions using charts
- **Features:**
  - Region filter
  - Date range filter
  - Chart visualization
  - Export option
- **API Calls:** `GET /api/reports/sales?region=&startDate=&endDate=`

#### `SalesByCategoryComponent`

- **Path:** `src/app/reports/sales/sales-by-category/`
- **Purpose:** Visualize sales performance across salespersons for a selected product category
- **Features:**
  - Category dropdown populated on component load
  - Bar chart of total sales per salesperson for the selected category
- **API Calls:**
  - `GET /api/reports/sales/categories` — populates the category dropdown on init
  - `GET /api/reports/sales/categories/:category` — fetches sales data on form submit

---

#### `AgentPerformanceComponent` (Parent)

- **Path:** `src/app/reports/agent-performance/`
- **Purpose:** Agent-level performance reporting

#### `CallDurationByDateRangeComponent`

- **Path:** `src/app/reports/agent-performance/call-duration-by-date-range/`
- **Purpose:** Analyze agent call durations within a custom date range
- **Features:**
  - Start date and end date pickers
  - Call duration visualization
  - Agent listing (filtered by date range)
  - Identify outliers (too short/too long calls)
- **API Calls:** `GET /api/reports/agent-performance?startDate=&endDate=`

#### `CustomerFeedbackComponent` (Parent)

- **Path:** `src/app/reports/customer-feedback/`
- **Purpose:** Customer satisfaction reporting hub

#### `ChannelRatingByMonthComponent`

- **Path:** `src/app/reports/customer-feedback/channel-rating-by-month/`
- **Purpose:** Analyze customer feedback ratings grouped by channel and month
- **Features:**
  - Month and year selector
  - Ratings by channel (Phone, Email, Chat, etc.)
  - Trend visualization
  - Service quality alerts
- **API Calls:** `GET /api/reports/customer-feedback?month=&year=`

### Admin Components

#### `UserManagementComponent` (Parent)

- **Path:** `src/app/admin/user-management/`
- **Purpose:** User management hub (admin only)
- **Access:** Admin role required

#### `UsersComponent`

- **Path:** `src/app/admin/user-management/users/`
- **Purpose:** Display list of all users
- **Features:**
  - User table with username, email, role, creation date
  - Edit and delete actions
  - Create new user button
- **API Calls:** `GET /api/users`

#### `UserDetailsComponent`

- **Path:** `src/app/admin/user-management/user-details/`
- **Purpose:** View and edit individual user details
- **Features:**
  - Username, email, role fields
  - Update user information
  - Delete user
- **Route Params:** `:id` (user MongoDB ObjectId)
- **API Calls:** `GET /api/users/:id`, `PUT /api/users/:id`

#### `UserCreateComponent`

- **Path:** `src/app/admin/user-management/user-create/`
- **Purpose:** Create new user account
- **Features:**
  - Username, email, password fields
  - Role assignment dropdown
  - Form validation
  - Submission handling
- **API Calls:** `POST /api/users`

### Security Components

#### `SigninComponent`

- **Path:** `src/app/security/signin/`
- **Purpose:** User authentication page
- **Features:**
  - Username and password input fields
  - Submit button
  - Error message display
  - Redirect to dashboard on success
- **API Calls:** `POST /api/security/signin`

#### `authGuard` (Service)

- **Path:** `src/app/security/auth.guard`
- **Purpose:** Route guard for protected pages
- **Behavior:**
  - Checks if user is authenticated
  - Redirects to `/signin` if not authenticated
  - Allows route activation if authenticated

### Utility Components

#### `SupportComponent`

- **Path:** `src/app/support/`
- **Purpose:** Help and support page for end users

#### `FaqComponent`

- **Path:** `src/app/faq/`
- **Purpose:** Frequently asked questions reference

#### `DemoComponent`

- **Path:** `src/app/demo/`
- **Purpose:** Demo/reference page for new users

---

## Data Models

### User

Stored in MongoDB `users` collection.

```typescript
interface User {
  _id: ObjectId; // MongoDB auto-generated ID
  username: string; // Unique username
  passwordHash: string; // bcrypt hashed password (10 rounds)
  email: string; // User email
  role: "admin" | "manager" | "user"; // User role
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

### Sales Data

Expected structure for sales reports (data structure inferred from API routes):

```typescript
interface SalesRecord {
  _id: ObjectId;
  salesperson: string; // Name or ID of sales agent
  region: string; // Sales region
  amount: number; // Total sales amount
  date: string; // Sale date (ISO 8601)
}
```

### Agent Performance Data

```typescript
interface CallRecord {
  _id: ObjectId;
  agent: string; // Agent name or ID
  duration: number; // Call duration in minutes
  date: string; // Call date (ISO 8601)
  status: "completed" | "abandoned" | string;
}
```

### Customer Feedback Data

```typescript
interface FeedbackRecord {
  _id: ObjectId;
  channel: string; // Phone, Email, Chat, etc.
  rating: number; // 1-5 star rating
  month: string; // YYYY-MM format
  comment?: string; // Optional feedback text
}
```

### Dashboard KPI Payload

```typescript
interface DashboardKPI {
  totalSales: number;
  teamSize: number;
  avgCallDuration: number;
  customerSatisfaction: number;
}
```

---

## Authentication Flow

### Sign-In Process

1. **User navigates to `/signin`**
   - `SigninComponent` displays login form
   - Form inputs: username, password

2. **User submits form**
   - Client sends `POST /api/security/signin` with `{ username, password }`
   - Server receives request in `security/index.js`

3. **Server validates credentials**
   - Query MongoDB `users` collection by `username`
   - Use `bcrypt.compareSync()` to compare provided password with stored hash
   - If no match: return `401 Unauthorized`

4. **Successful authentication**
   - Server returns user object: `{ username, role }`
   - Client stores user context (implementation depends on service)
   - Client redirects to `/` (Dashboard)

5. **Protected route access**
   - `authGuard` checks if user is authenticated
   - If authenticated: allow route activation
   - If not authenticated: redirect to `/signin`

### Session Management

- ⚠️ **Note:** Current implementation does not show explicit session token/JWT handling
- Likely stored in:
  - localStorage or sessionStorage (Angular)
  - Authentication service maintains user state
  - Each API request may need to include auth token in headers

---

## API Response Format

### Success Response

```json
{
  "data": {
    /* response data */
  },
  "success": true,
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "success": false
}
```

### Specific Endpoint Responses

**POST /api/security/signin** (Success)

```json
{
  "username": "admin",
  "role": "admin"
}
```

**POST /api/users** (Success)

```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

---

## Notes for Development

### Current Implementation Status

✅ **Complete:**

- Authentication routes and bcrypt hashing
- User CRUD endpoints
- Route configuration for all pages
- Component structure scaffolding

⚠️ **Incomplete/To Be Implemented:**

- Dashboard API implementation (data aggregation)
- Sales report query logic
- Agent performance filtering and aggregation
- Customer feedback data aggregation
- Role-based middleware for protected endpoints
- Session/JWT token management
- Export to PDF/CSV functionality
- Chart.js integration in components

### Accessibility Considerations

- **Color blindness support:** Avoid red/green-only data distinctions (use patterns, labels, symbols)
- **Keyboard navigation:** Ensure all interactive elements are keyboard accessible
- **ARIA labels:** Add to charts and interactive components
- **Font sizing:** Use readable font sizes for data visualization

### Performance Optimization

- Add pagination to user lists (`/api/users`)
- Index MongoDB collections by frequently queried fields (username, date ranges)
- Cache dashboard KPI data to reduce repeated queries
- Implement lazy loading for report components
