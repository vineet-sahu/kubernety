# Service A - API Gateway

Job submission and status checking service.

## Features

- Job submission endpoint
- Job status tracking
- Job cancellation
- Health and readiness checks
- Rate limiting
- Input validation
- Comprehensive error handling

## API Endpoints

### Job Management

#### Submit Job
```http
POST /api/submit
Content-Type: application/json

{
  "task": "calculate_primes",
  "data": {
    "limit": 100000
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "jobId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "pending",
    "message": "Job submitted successfully"
  }
}
```

#### Get Job Status
```http
GET /api/status/:jobId
```

Response:
```json
{
  "success": true,
  "data": {
    "jobId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "completed",
    "result": {
      "primes": 9592,
      "duration": 1234
    }
  }
}
```

#### Cancel Job
```http
DELETE /api/jobs/:jobId
```

#### Get Queue Info
```http
GET /api/jobs
```

### Health Checks

#### Health
```http
GET /health
```

#### Readiness
```http
GET /ready
```

## Available Tasks

- `calculate_primes` - Calculate prime numbers
- `hash_data` - Bcrypt hashing
- `sort_array` - Sort large arrays

## Environment Variables

```bash
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
QUEUE_NAME=job_queue
STATUS_KEY_PREFIX=job_status:
RESULTS_KEY_PREFIX=job_result:
LOG_LEVEL=info
NODE_ENV=development
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Docker

```bash
# Build image
docker build -t service-a:latest .

# Run container
docker run -p 3000:3000 \
  -e REDIS_HOST=redis \
  service-a:latest
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- job.controller.test.js
```
