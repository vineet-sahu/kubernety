.PHONY: help setup deploy test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Setup local development environment
	@echo "Setting up development environment..."
	./scripts/setup/install-prerequisites.sh
	./scripts/setup/setup-minikube.sh

build: ## Build all Docker images
	@echo "Building Docker images..."
	./scripts/deployment/build-images.sh

deploy: ## Deploy all services to Kubernetes
	@echo "Deploying services..."
	./scripts/deployment/deploy-all.sh

deploy-monitoring: ## Deploy Prometheus and Grafana
	@echo "Deploying monitoring stack..."
	./scripts/setup/deploy-monitoring.sh

test: ## Run all tests
	@echo "Running tests..."
	cd services/service-a-api-gateway && npm test
	cd services/service-b-worker && npm test
	cd services/service-c-stats && npm test

stress-test: ## Run stress test
	@echo "Running stress test..."
	./scripts/testing/stress-test.sh

port-forward: ## Setup port forwarding
	@echo "Setting up port forwarding..."
	./scripts/utilities/port-forward.sh

logs: ## View aggregated logs
	@echo "Viewing logs..."
	./scripts/utilities/logs.sh

clean: ## Clean up all resources
	@echo "Cleaning up..."
	./scripts/utilities/cleanup.sh

scale-workers: ## Scale workers manually
	@echo "Scaling workers..."
	./scripts/utilities/scale-workers.sh

install-deps: ## Install dependencies for all services
	@echo "Installing dependencies..."
	cd services/service-a-api-gateway && npm install
	cd services/service-b-worker && npm install
	cd services/service-c-stats && npm install
