#!/bin/bash

echo "Setting up Minikube..."

# Start Minikube
minikube start --cpus=4 --memory=8192 --driver=docker

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# Set kubectl context
kubectl config use-context minikube

echo "Minikube setup complete!"
echo "Run 'minikube dashboard' to access the dashboard"
