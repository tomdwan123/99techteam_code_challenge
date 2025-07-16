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

## Technology Stack

- **Backend Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Knex.js for database operations
- **Testing**: Jest with Supertest
- **Development**: Nodemon for hot reload

## Project Structure

```
ResourceManagement/
├── src/
│   ├── app.ts                    # Application entry point
│   ├── db/
│   │   ├── database.ts           # Database connection
│   │   ├── knexFile.ts          # Knex configuration
│   │   ├── migrations/          # Database migrations
│   │   │   └── 20250715_create_resources_table.ts
│   │   └── seeds/               # Seed data
│   │       └── 20250715_seed_resources.ts
│   ├── middleware/
│   │   └── errorHandler.ts     # Error handling middleware
│   ├── queries/
│   │   └── resourceQueries.ts  # Database queries for resources
│   ├── routes/
│   │   └── resourceRoutes.ts   # Resource API endpoints
│   ├── service/
│   │   └── resourceService.ts  # Business logic for resources
│   ├── tests/
│   │   ├── resourceRoutes.test.ts
│   │   ├── resourceService.test.ts
│   │   └── testUtils.ts
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── util/
│       └── CustomError.ts      # Custom error handling
├── .env                        # Environment variables
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── docker-compose.yml        # Docker configuration
├── Dockerfile               # Docker image definition
└── README.md               # Project documentation
```

## API Endpoints

### Resource Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resources` | Create a new resource |
| GET | `/resources` | List resources with filters |
| GET | `/resources/:id` | Get specific resource |
| PUT | `/resources/:id` | Update resource |
| DELETE | `/resources/:id` | Delete resource |
| GET | `/resources/stats` | Get resource statistics |

## API Documentation

### Interactive Documentation
The API comes with comprehensive OpenAPI 3.0.3 documentation accessible via Swagger UI:

- **Swagger UI**: `http://localhost:8080/api-docs`
- **OpenAPI Spec**: Available at `/openapi.yml`
- **API Info**: `http://localhost:8080/` (shows basic API information)

### Documentation Features
- 📚 **Complete API Reference** - All endpoints, parameters, and responses documented
- 🔧 **Interactive Testing** - Test API endpoints directly from the browser
- 📝 **Request/Response Examples** - Real examples for all operations
- 🏷️ **Schema Definitions** - Detailed data models and validation rules
- 🎯 **Error Handling** - Comprehensive error response documentation

### Using the Documentation
1. Start the application (locally or via Docker)
2. Open your browser to `http://localhost:8080/api-docs`
3. Explore the available endpoints
4. Test API calls directly from the Swagger interface
5. View request/response schemas and examples

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
   
   You have several options for environment configuration:

   **Option A: Use setup scripts (Recommended)**
   ```bash
   # For local development
   ./setup-env.sh local
   # or on Windows
   setup-env.bat local

   # For Docker development
   ./setup-env.sh docker
   # or on Windows
   setup-env.bat docker
   ```

   **Option B: Manual setup**
   ```bash
   # For local development
   cp .env.local .env

   # For Docker development
   cp .env.docker .env
   ```

   **Option C: Create custom .env**
   Copy `.env.example` to `.env` and modify as needed:
   ```env
   DB_HOST=localhost
   DB_USER=resource
   DB_PASSWORD=resource
   DB_NAME=resource
   DB_PORT=5432
   PORT=8080
   NODE_ENV=development
   ```

4. **Set up the database**

   **For Local Development:**
   ```bash
   # Set up local environment first
   ./setup-env.sh local

   # Run migrations to create tables
   npm run migrate:local
   
   # Seed the database with sample data
   npm run seed:local
   ```

   **For Docker Development:**
   ```bash
   # Set up Docker environment first
   ./setup-env.sh docker

   # Start everything with Docker Compose
   docker-compose up --build
   ```

5. **Start the development server**

   **For Local Development:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8080`

### Using Docker

1. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

This will start both the PostgreSQL database and the application.

## API Usage Examples

### Create a Resource

```bash
curl -X POST http://localhost:8080/resources \
  -H "Content-Type: application/json" \
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
curl "http://localhost:8080/resources"

# Filter by type and status with pagination
curl "http://localhost:8080/resources?type=server&status=active&page=1&limit=5"

# Search by name
curl "http://localhost:8080/resources?name=database"
```

### Get Resource Details

```bash
curl "http://localhost:8080/resources/1"
```

### Update a Resource

```bash
curl -X PUT http://localhost:8080/resources/1 \
  -H "Content-Type: application/json" \
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
curl -X DELETE http://localhost:8080/resources/1
```

### Get Resource Statistics

```bash
curl "http://localhost:8080/resources/stats"
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

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or missing required fields
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors
