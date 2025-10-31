# Deployment Guide

## Prerequisites

- kubectl
- minikube or kind
- helm
- docker

## Step 1: Setup Cluster

```bash
./scripts/setup/setup-minikube.sh
```

## Step 2: Build Images

```bash
./scripts/deployment/build-images.sh
```

## Step 3: Deploy Services

```bash
./scripts/deployment/deploy-all.sh
```

## Step 4: Deploy Monitoring

```bash
./scripts/setup/deploy-monitoring.sh
```

## Step 5: Verify Deployment

```bash
kubectl get all -n microservices-app
```

## Troubleshooting

### Pods not starting
```bash
kubectl logs -n microservices-app <pod-name>
```

### Check HPA status
```bash
kubectl get hpa -n microservices-app
```
