#!/bin/bash

echo "Setting up port forwarding..."

# Service A
kubectl port-forward -n microservices-app svc/service-a 3001:3000 &

# Service C
kubectl port-forward -n microservices-app svc/service-c 3003:3000 &

# Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80 &

# Prometheus
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090 &

echo "Port forwarding active!"
echo "Access services at:"
echo "  - API Gateway: http://localhost:3001"
echo "  - Stats: http://localhost:3003"
echo "  - Grafana: http://localhost:3000"
echo "  - Prometheus: http://localhost:9090"
