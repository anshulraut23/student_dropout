# Education Assistant Backend

Backend server for the student dropout prevention education assistant application.

## Features

- Admin registration with school creation
- Teacher registration with approval workflow
- JWT-based authentication
- Role-based access control (Admin/Teacher)
- Teacher approval/rejection by admin
- School listing for teacher registration

## Tech Stack

- Node.js
- Express.js
- JWT for authentication
- bcrypt for password hashing
- In-memory data store (will be replaced with database)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register Admin
```
POST /api/auth/register/admin
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "admin@school.com",
  "password": "password123",
  "schoolName": "Sunrise Public School",
  "schoolAddress": "123 Main St",
  "schoolCity": "Mumbai",
  "schoolState": "Maharashtra",
  "schoolPhone": "+91 9876543210"
}
```

#### Register Teacher
```
POST /api/auth/register/teacher
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "teacher@school.com",
  "password": "password123",
  "schoolId": "school-id-here"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Schools

#### Get All Schools
```
GET /api/schools
```

#### Get School by ID
```
GET /api/schools/:schoolId
```

### Approvals (Admin Only)

#### Get Pending Teacher Requests
```
GET /api/approvals/pending
Authorization: Bearer <admin-token>
```

#### Approve Teacher
```
POST /api/approvals/approve/:teacherId
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "classIds": ["class1", "class2"]
}
```

#### Reject Teacher
```
POST /api/approvals/reject/:teacherId
Authorization: Bearer <admin-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Authentication Flow

1. **Admin Registration**:
   - Admin registers with school details
   - School and admin user are created
   - Admin is auto-approved
   - JWT token is returned

2. **Teacher Registration**:
   - Teacher selects school from dropdown
   - Teacher user is created with status "pending"
   - Approval request is created for admin
   - Teacher must wait for admin approval

3. **Login**:
   - User provides email and password
   - System verifies credentials
   - For teachers, checks approval status
   - Returns JWT token if successful

4. **Teacher Approval**:
   - Admin views pending teacher requests
   - Admin approves or rejects teacher
   - Teacher status is updated
   - Teacher can now login if approved

## Data Models

### School
```javascript
{
  id: string,
  name: string,
  address: string,
  city: string,
  state: string,
  phone: string,
  adminId: string,
  createdAt: string
}
```

### User
```javascript
{
  id: string,
  email: string,
  password: string (hashed),
  fullName: string,
  role: 'admin' | 'teacher',
  schoolId: string,
  status: 'approved' | 'pending' | 'rejected',
  assignedClasses: array (teachers only),
  createdAt: string
}
```

### Teacher Request
```javascript
{
  teacherId: string,
  schoolId: string,
  status: 'pending' | 'approved' | 'rejected',
  requestedAt: string,
  processedAt: string | null
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Protected routes require valid JWT token
- Role-based access control for admin operations
- Input validation on all endpoints

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Email verification
- Password reset functionality
- Rate limiting
- Request logging
- API documentation with Swagger
- Unit and integration tests
