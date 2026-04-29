# API Documentation

Base URL: `/api`

## Public Endpoints

### 1. Submit Form
- **Endpoint**: `POST /forms/submit`
- **Rate Limit**: 20 requests per 15 minutes per IP
- **Body**:
  ```json
  {
    "schoolInfo": {
      "schoolName": "Delhi Public School",
      "schoolCode": "DPS-2024",
      "contactPerson": "John Doe",
      "contactEmail": "john@school.edu",
      "contactPhone": "+91 9876543210"
    },
    "labCategory": "Standard",
    "selectedItems": [
      {
        "sno": 1,
        "name": "Satellite Model",
        "group": "Machines & Models",
        "quantity": 1,
        "remarks": "",
        "included": true
      }
    ],
    "customItems": [
      {
        "itemName": "Extra cables",
        "quantity": "5",
        "remarks": "Needed for lab"
      }
    ],
    "submittedBy": {
      "submitterName": "Jane Smith",
      "targetDate": "2024-12-01",
      "additionalNotes": "Please deliver soon."
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "submissionId": "uuid-here",
    "message": "Form submitted successfully",
    "syncStatus": "synced"
  }
  ```

### 2. Admin Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "username": "JawadS",
    "password": "JawadS"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "jwt.token.here"
  }
  ```

---

## Protected Endpoints (Admin Only)

All protected endpoints require the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

### 1. Get Dashboard Stats
- **Endpoint**: `GET /admin/dashboard/stats`
- **Response**:
  ```json
  {
    "totalSubmissions": 150,
    "syncFailures": 2,
    "byCategory": {
      "Basix": 40,
      "Standard": 60,
      "Advanced": 30,
      "Premium": 20
    },
    "lastSync": "2024-03-20T10:00:00Z"
  }
  ```

### 2. Get Submissions
- **Endpoint**: `GET /admin/submissions`
- **Query Params**:
  - `limit` (default: 15)
  - `offset` (default: 0)
  - `category` (optional: Basix, Standard, Advanced, Premium)
  - `syncStatus` (optional: pending, synced, failed)
  - `dateFrom` (optional: YYYY-MM-DD)
  - `dateTo` (optional: YYYY-MM-DD)
- **Response**:
  ```json
  {
    "success": true,
    "submissions": [...],
    "total": 150,
    "page": 1
  }
  ```

### 3. Get Single Submission
- **Endpoint**: `GET /admin/submissions/:id`
- **Response**: `{ "success": true, "submission": { ... } }`

### 4. Delete Submission
- **Endpoint**: `DELETE /admin/submissions/:id`
- **Response**: `{ "success": true, "message": "Submission deleted" }`

### 5. Retry Sheets Sync
- **Endpoint**: `POST /admin/submissions/:id/retry-sync`
- **Response**: `{ "success": true, "message": "Sync retry successful" }`

### 6. Export CSV
- **Endpoint**: `GET /admin/submissions/export/csv`
- **Response**: Returns a `text/csv` file download.
