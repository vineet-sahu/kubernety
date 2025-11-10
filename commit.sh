#!/bin/bash

# Script to create backdated git commits for last week (Monday to Friday)
# Run this script from your repository root: bash script_name.sh

# Calculate last week's Monday to Friday dates
LAST_MONDAY=$(date -d "last monday - 7 days" +%Y-%m-%d)
LAST_TUESDAY=$(date -d "last tuesday - 7 days" +%Y-%m-%d)
LAST_WEDNESDAY=$(date -d "last wednesday - 7 days" +%Y-%m-%d)
LAST_THURSDAY=$(date -d "last thursday - 7 days" +%Y-%m-%d)
LAST_FRIDAY=$(date -d "last friday - 7 days" +%Y-%m-%d)

# Function to generate random time between 20:00 and 22:00
random_time() {
    local hour=$((20 + RANDOM % 3))  # 20, 21, or 22
    local minute=$((RANDOM % 60))
    local second=$((RANDOM % 60))
    printf "%02d:%02d:%02d" $hour $minute $second
}

# Function to commit with custom date
commit_with_date() {
    local date=$1
    local time=$2
    local message=$3
    
    local datetime="$date $time"
    
    GIT_AUTHOR_DATE="$datetime" GIT_COMMITTER_DATE="$datetime" git commit -m "$message"
}

echo "Starting backdated commits for last week..."
echo "============================================"

# First, unstage everything
echo "Unstaging all files..."
git reset HEAD

# MONDAY - Initial setup and documentation
echo ""
echo "Monday: Initial project setup"
git add kubernetes-microservices-monitoring/README.md
git add kubernetes-microservices-monitoring/.gitignore
git add kubernetes-microservices-monitoring/.env.example
git add kubernetes-microservices-monitoring/architecture/
git add kubernetes-microservices-monitoring/docs/ARCHITECTURE.md
commit_with_date "$LAST_MONDAY" "$(random_time)" "docs: Initial project setup and architecture documentation

- Review problem statement and requirements
- Created architecture documentation
- Defined system design and component responsibilities"

# TUESDAY - UI and initial services setup
echo ""
echo "Tuesday: UI and service structure"
git add kubernetes-microservices-monitoring/UI/
git add kubernetes-microservices-monitoring/services/service-a-api-gateway/README.md
git add kubernetes-microservices-monitoring/services/service-a-api-gateway/package.json
git add kubernetes-microservices-monitoring/services/service-a-api-gateway/.eslintrc.json
git add kubernetes-microservices-monitoring/services/service-a-api-gateway/.dockerignore
git add kubernetes-microservices-monitoring/services/service-b-worker/package.json
git add kubernetes-microservices-monitoring/services/service-b-worker/.eslintrc.json
git add kubernetes-microservices-monitoring/services/service-c-stats/package.json
git add kubernetes-microservices-monitoring/services/service-c-stats/.eslintrc.json
commit_with_date "$LAST_TUESDAY" "$(random_time)" "feat: Add UI for job submission and initial service structure

- Created UI with job submission form
- UI supports 5 job types: Prime Numbers, Hash, Sort, Matrix, Fibonacci
- Job listing and status display
- Setup package structure for three Node.js services
- Configured ESLint for code quality"

# WEDNESDAY - Service APIs and Redis
echo ""
echo "Wednesday: APIs and Redis integration"
git add kubernetes-microservices-monitoring/services/service-a-api-gateway/src/
git add kubernetes-microservices-monitoring/docker-compose.yml
commit_with_date "$LAST_WEDNESDAY" "$(random_time)" "feat: Implement API gateway with Redis queue integration

- Created job submission API endpoints
- Added job listing and status APIs
- Integrated Redis for job queue management
- Added validation middleware
- Implemented health check endpoints
- Setup docker-compose for local development"

# THURSDAY - Worker service and Kubernetes
echo ""
echo "Thursday: Worker service and Kubernetes setup"
git add kubernetes-microservices-monitoring/services/service-b-worker/src/
git add kubernetes-microservices-monitoring/services/service-b-worker/Dockerfile
git add kubernetes-microservices-monitoring/kubernetes/
git add kubernetes-microservices-monitoring/scripts/setup/setup-minikube.sh
commit_with_date "$LAST_THURSDAY" "$(random_time)" "feat: Add worker service and Kubernetes configurations

- Implemented job processor for all job types
- Added job consumer with queue processing
- Setup Prometheus metrics for worker monitoring
- Created Kubernetes deployment manifests
- Configured HPA for worker autoscaling
- Added Minikube setup script
- Created namespace and service definitions"

# FRIDAY - Docker, deployment scripts, and documentation
echo ""
echo "Friday: Dockerization and deployment automation"
git add kubernetes-microservices-monitoring/services/service-a-api-gateway/Dockerfile
git add kubernetes-microservices-monitoring/services/service-c-stats/Dockerfile
git add kubernetes-microservices-monitoring/services/service-c-stats/src/
git add kubernetes-microservices-monitoring/scripts/deployment/
git add kubernetes-microservices-monitoring/scripts/testing/
git add kubernetes-microservices-monitoring/scripts/utilities/
git add kubernetes-microservices-monitoring/docs/DEPLOYMENT.md
git add kubernetes-microservices-monitoring/docs/screenshots/.gitkeep
git add kubernetes-microservices-monitoring/kubernetes/secrets/.gitkeep
git add kubernetes-microservices-monitoring/Makefile
git add README.md
git add .gitignore
commit_with_date "$LAST_FRIDAY" "$(random_time)" "feat: Complete deployment setup and stats service

- Added Dockerfiles for all services
- Implemented stats aggregator service
- Created deployment automation scripts
- Added stress testing utilities
- Integrated job status updates in UI
- Added comprehensive logging across all services
- Created Makefile for common operations
- Updated deployment documentation"

echo ""
echo "============================================"
echo "All commits created successfully!"
echo ""
echo "Recent commits:"
git log --oneline -6
echo ""
echo "You can now push these changes with: git push origin main"