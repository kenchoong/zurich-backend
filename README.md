# Zurich Backend Billing Portal

A NestJS-based backend service for managing billing records with authentication and role-based access control.

## Project Structure

```
src/
├── migrations/     # Database migration files
└── modules/       # Application modules
    ├── auth/      # Authentication module (JWT, Guards)
    └── billing-record/  # Billing record management
```

## Quick Start

1. Start the application using Docker:

```bash
docker-compose up --build
```

This will:

- Start the PostgreSQL database
- Run database migrations automatically
- Seed initial data into the database
- Start the NestJS application
- Start Adminer for database management

## Development

Run the application in development mode:

```bash
yarn dev
```

## Unit Testing with Coverage

Run unit tests with code coverage reporting:

```bash
yarn test:cov
```

This will:

- Execute all unit tests in the project
- Generate a coverage report showing which parts of the code are covered by tests
- Output a summary of coverage percentages by file
- Create a detailed HTML report in the `./coverage` directory that you can view in your browser

To view the detailed HTML coverage report, open `./coverage/lcov-report/index.html` in your web browser.

### Database Management

#### Migration Commands

```bash
# Generate a new migration
yarn migration:generate

# Create a new empty migration
yarn migration:create

# Revert the last migration
yarn migration:revert
```

## API Documentation

Swagger documentation is available at: http://localhost:3337/api

### Using the API with Authentication

1. First, sign up using your Google email (this should match the ADMIN_EMAIL in .env)
2. Call `/sign-in` endpoint to get an access token
3. In the Swagger UI:
   - Click the "Authorize" button at the top
   - Enter your access token in the format: `Bearer your-token-here`
   - Click "Authorize"

Now you can access protected endpoints:

- GET endpoints are open to all
- CREATE, UPDATE, DELETE operations require ADMIN role

## Admin Access

Set your Google email in the .env file:

```
ADMIN_EMAIL=your.email@gmail.com
```

When you sign up with this email, you'll automatically get ADMIN role permissions.

## Development Tools

### Database Management

Adminer is available at http://localhost:8081

- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres
- Database: zurich

### API Documentation

Swagger UI is available at http://localhost:3337/api

- Complete API documentation
- Interactive endpoint testing
- Authentication support

## Authentication Flow

1. Sign up with your Google email (matching ADMIN_EMAIL)
2. Get access token from /sign-in
3. Use token for authenticated requests:
   - Headers: `Authorization: Bearer your-token-here`
   - Swagger: Use the Authorize button

## Protected Operations

The following operations require ADMIN role:

- CREATE new billing records
- UPDATE existing records
- DELETE records

All GET operations are publicly accessible.
