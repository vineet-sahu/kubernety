#!/bin/bash

echo "Deploying all services..."

# Create namespace
kubectl apply -f kubernetes/namespaces/

# Deploy Redis
kubectl apply -f kubernetes/deployments/redis-deployment.yaml

# Wait for Redis
kubectl wait --for=condition=available --timeout=60s deployment/redis -n microservices-app

# Deploy services
kubectl apply -f kubernetes/deployments/
kubectl apply -f kubernetes/services/
kubectl apply -f kubernetes/hpa/
kubectl apply -f kubernetes/ingress/

echo "Deployment complete!"
echo "Check status with: kubectl get all -n microservices-app"
