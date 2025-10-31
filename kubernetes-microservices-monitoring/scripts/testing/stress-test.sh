#!/bin/bash

echo "Running stress test..."

# Get ingress IP
INGRESS_IP=$(minikube ip)

# Run Apache Bench
ab -n 5000 -c 200 http://${INGRESS_IP}/api/submit

echo "Stress test complete!"
echo "Check Grafana dashboards for metrics"
