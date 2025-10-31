#!/bin/bash

echo "Cleaning up resources..."

kubectl delete namespace microservices-app
kubectl delete namespace monitoring

echo "Cleanup complete!"
