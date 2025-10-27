# System Architecture

## Overview
This document describes the architecture of the Kubernetes microservices monitoring system.

## Components

### Service A: API Gateway
- **Purpose**: Job submission and status checking
- **Technology**: Node.js + Express
- **Endpoints**:
  - POST /api/submit - Submit new job
  - GET /api/status/:jobId - Check job status

### Service B: Worker
- **Purpose**: Process CPU-intensive jobs
- **Technology**: Node.js with CPU-bound tasks
- **Scaling**: Horizontal Pod Autoscaler (2-10 replicas)
- **Tasks**:
  - Prime number calculation
  - Bcrypt hashing
  - Array sorting

### Service C: Statistics
- **Purpose**: Aggregate metrics and provide stats
- **Technology**: Node.js + Express
- **Endpoints**:
  - GET /api/stats - Get job statistics
  - GET /metrics - Prometheus metrics

## Data Flow

1. Client submits job to Service A
2. Service A pushes job to Redis queue
3. Service B workers consume jobs from queue
4. Workers process jobs (CPU-intensive)
5. Workers store results in Redis
6. Service C aggregates metrics
7. Prometheus scrapes metrics
8. Grafana visualizes data

## Scaling Strategy

- **Trigger**: CPU utilization > 70%
- **Min Replicas**: 2
- **Max Replicas**: 10
- **Scale Up**: Fast (add 100% or 4 pods)
- **Scale Down**: Slow (remove 50% over 5 minutes)
