# Resource Management API

A comprehensive backend server built with ExpressJS and TypeScript that provides a complete CRUD interface for resource management. This API allows you to create, read, update, and delete resources with advanced filtering capabilities and database persistence.

## Features

### Core CRUD Operations
- ✅ **Create Resource** - Add new resources to the system
- ✅ **List Resources** - Retrieve resources with filtering and pagination
- ✅ **Get Resource Details** - Fetch specific resource information
- ✅ **Update Resource** - Modify existing resource properties
- ✅ **Delete Resource** - Remove resources from the system

### Advanced Features
- 🔍 **Advanced Filtering** - Filter by type, status, and name
- 📄 **Pagination Support** - Efficient data retrieval with pagination
- 📊 **Resource Statistics** - Get insights about your resources
- 🛡️ **Input Validation** - Comprehensive validation for all operations
- 🗄️ **Database Persistence** - PostgreSQL database with Knex.js ORM
- 🧪 **Comprehensive Testing** - Unit and integration tests
- 🔐 **JWT Authentication** - Secure API endpoints

## Technology Stack

- **Backend Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Knex.js for database operations
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest with Supertest
- **Development**: Nodemon for hot reload

## API Endpoints

### Resource Management

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/resources` | Create a new resource | Required |
| GET | `/resources` | List resources with filters | Required |
| GET | `/resources/:id` | Get specific resource | Required |
| PUT | `/resources/:id` | Update resource | Required |
| DELETE | `/resources/:id` | Delete resource | Required |
| GET | `/resources/stats` | Get resource statistics | Required |

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |

## Resource Schema

```typescript
interface Resource {
    id?: number;              // Auto-generated primary key
    name: string;            // Required: Resource name
    description?: string;     // Optional: Resource description
    type: string;            // Required: Resource type (e.g., 'server', 'database')
    status: 'active' | 'inactive' | 'pending';  // Resource status
    metadata?: any;          // Optional: Additional JSON metadata
    created_at?: Date;       // Auto-generated creation timestamp
    updated_at?: Date;       // Auto-generated update timestamp
}
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ResourceManagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=resource_management
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   ```

4. **Set up the database**
   ```bash
   # Run migrations to create tables
   npm run migrate
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8080`

## API Usage Examples

### Authentication

First, register a user and login to get a JWT token:

```bash
# Register a new user
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'

# Login to get JWT token
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

Include the JWT token in the `Authorization` header for protected endpoints:
```
Authorization: Bearer <your-jwt-token>
```

### Create a Resource

```bash
curl -X POST http://localhost:8080/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "Web Server",
    "description": "Main application server",
    "type": "server",
    "status": "active",
    "metadata": {
      "cpu": "4 cores",
      "memory": "8GB",
      "os": "Ubuntu 20.04"
    }
  }'
```

### List Resources with Filtering

```bash
# Get all resources
curl -H "Authorization: Bearer <your-jwt-token>" \
  "http://localhost:8080/resources"

# Filter by type and status with pagination
curl -H "Authorization: Bearer <your-jwt-token>" \
  "http://localhost:8080/resources?type=server&status=active&page=1&limit=5"

# Search by name
curl -H "Authorization: Bearer <your-jwt-token>" \
  "http://localhost:8080/resources?name=database"
```

### Get Resource Details

```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  "http://localhost:8080/resources/1"
```

### Update a Resource

```bash
curl -X PUT http://localhost:8080/resources/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "Updated Web Server",
    "status": "inactive",
    "metadata": {
      "cpu": "8 cores",
      "memory": "16GB"
    }
  }'
```

### Delete a Resource

```bash
curl -X DELETE http://localhost:8080/resources/1 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Resource Statistics

```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  "http://localhost:8080/resources/stats"
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { // Only for list endpoints
    "total": 50,
    "page": 1,
    "totalPages": 5,
    "limit": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm start           # Start production server

# Database
npm run migrate     # Run database migrations
npm run seed        # Seed database with sample data
npm run migrate:rollback  # Rollback last migration
npm run db:reset    # Reset database (rollback, migrate, seed)

# Testing
npm test           # Run all tests

# Build
npm run build      # Compile TypeScript to JavaScript
```

## Testing

Run the comprehensive test suite:

```bash
npm test
```

The test suite includes:
- Unit tests for services and utilities
- Integration tests for API endpoints
- Database operation tests
- Authentication tests

## Database Schema

The application uses PostgreSQL with the following main table:

### Resources Table
```sql
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    type VARCHAR NOT NULL,
    status VARCHAR CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
    metadata JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_name ON resources(name);
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or missing required fields
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
