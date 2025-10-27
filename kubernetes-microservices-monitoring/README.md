# Kubernetes Microservices Monitoring System

A production-ready microservices architecture demonstrating queue-based job processing, auto-scaling, and comprehensive monitoring with Prometheus and Grafana.

## 🏗️ Architecture

This project implements a distributed job processing system with three core services:

- **Service A (API Gateway)**: Job submission and status checking
- **Service B (Worker)**: CPU-intensive job processing with horizontal auto-scaling
- **Service C (Stats)**: Metrics aggregation and statistics

## 🚀 Quick Start

### Prerequisites

```bash
# Install required tools
./scripts/setup/install-prerequisites.sh

# Setup local Kubernetes cluster
./scripts/setup/setup-minikube.sh
# OR
./scripts/setup/setup-kind.sh
```

### Deployment

```bash
# Deploy all services
./scripts/deployment/deploy-all.sh

# Deploy monitoring stack
./scripts/setup/deploy-monitoring.sh
```

### Access Services

```bash
# Port forward services
./scripts/utilities/port-forward.sh

# Access endpoints:
# - API Gateway: http://localhost:3001
# - Grafana: http://localhost:3000 (admin/admin)
# - Prometheus: http://localhost:9090
```

## 🧪 Testing

### Stress Testing

```bash
# Run stress test
./scripts/testing/stress-test.sh

# Run multiple scenarios
./scripts/testing/load-test-scenarios.sh
```

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run specific service tests
cd services/service-a-api-gateway && npm test
```

## 📊 Monitoring

- **Prometheus**: Metrics collection at `:9090`
- **Grafana**: Dashboards at `:3000`
  - Username: `admin`
  - Password: `admin`

### Key Metrics

- `jobs_processed_total`: Total jobs processed
- `job_processing_time_seconds`: Job processing duration
- `queue_length`: Current queue size
- `job_errors_total`: Failed jobs count

## 📖 Documentation

- [Architecture Details](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Monitoring Setup](./docs/MONITORING.md)
- [Stress Testing](./docs/STRESS_TESTING.md)

## 🛠️ Development

### Local Development

```bash
# Start services with Docker Compose
docker-compose up -d

# Watch logs
docker-compose logs -f
```

### Building Images

```bash
# Build all Docker images
./scripts/deployment/build-images.sh

# Push to registry
./scripts/deployment/push-images.sh
```

## 📦 Project Structure

```
kubernetes-microservices-monitoring/
├── services/          # Microservices source code
├── kubernetes/        # K8s manifests
├── scripts/           # Automation scripts
├── monitoring/        # Prometheus & Grafana configs
└── docs/             # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

Your Name - Initial work

## 🙏 Acknowledgments

- Prometheus Community
- Grafana Labs
- Kubernetes Community
