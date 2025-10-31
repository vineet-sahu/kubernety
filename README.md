# 🚀 Kubernetes Microservices Monitoring Assignment

A **Node.js microservices system** deployed on **Kubernetes**, featuring **queue-based job processing**, **autoscaling**, and **end-to-end observability** with **Prometheus** and **Grafana**.

---

## 🧩 Architecture Overview

### **Microservices**

#### **Service A – Job Submitter (API Gateway)**
- Endpoints:
  - `POST /submit` → Submit a new job
  - `GET /status/:id` → Check job status
- Pushes jobs into **Redis queue** and returns job ID to the client.

#### **Service B – Worker (Scalable)**
- Consumes jobs from Redis and performs **CPU-intensive operations**:
  - Prime calculation
  - bcrypt hashing
  - Array generation + sorting
- Exposes Prometheus metrics at `/metrics`:
  - `jobs_processed_total`
  - `job_processing_time_seconds`
  - `job_errors_total`
- **Target for Horizontal Pod Autoscaler (HPA).**

#### **Service C – Stats Aggregator**
- Endpoint: `/stats` → Returns job stats and queue info.
- Prometheus metrics:
  - `total_jobs_submitted`
  - `total_jobs_completed`
  - `queue_length`

---

## ⚙️ Kubernetes Setup

### **Deployments**
- `Service A`, `Service B`, `Service C` (Node.js)
- `Redis` (via Helm or YAML)

### **Services**
- Service A → **Ingress + LoadBalancer**
- Service B & C → **ClusterIP**

### **Horizontal Pod Autoscaler**
```bash

kubectl autoscale deployment worker --cpu-percent=70 --min=2 --max=10
```

### **Monitoring Stack**

#### Install Prometheus & Grafana via Helm:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

### **Prometheus scrapes /metrics from Service B & C pods.**

Grafana dashboards include:

- CPU & Memory usage

- Job processing time

- Queue length

- Error rates

## Stress Testing

Run load test on Service A (Ingress endpoint):
```bash
ab -n 5000 -c 200 http://<ingress-ip>/submit
```

Expected behavior:

- Redis queue grows

- HPA scales Worker pods (Service B)

- Grafana shows CPU spikes and job metrics

- Queue drains as replicas increase

## 📦 Deliverables

- Node.js services (A, B, C)

- Kubernetes YAMLs: Deployments, Services, Ingress, HPA

- Prometheus scrape config

- Grafana dashboard JSON

- README with deployment + testing steps


## 🧠 Learning Outcomes

- Microservices with Redis-based queueing

- Autoscaling with Kubernetes HPA

- Metrics instrumentation via prom-client

- Prometheus & Grafana monitoring

- Performance testing and scaling observation

## 🚀 Quick Start (Minikube)
```bash
minikube start
kubectl apply -f k8s/
kubectl get pods
minikube service service-a
```

Then run the stress test and monitor dashboards at Grafana UI.


-------------------------
Jobs type
 1️⃣ Prime Numbers

Input: number (we called it limit)

Meaning: Find all prime numbers up to this limit.

Example: limit = 100000 → calculate all primes ≤ 100,000.

Payload example: { "limit": 100000 }

2️⃣ Hash

Input: text (any string)

Meaning: Perform CPU-intensive hashing (like bcrypt) on the input text.

Example: "HelloWorld" → hash it 10 times/rounds.

Payload example: { "text": "HelloWorld" }

3️⃣ Sort

Input: array size (number)

Meaning: Generate a random array of given size and sort it.

Example: size = 100000 → create array [random numbers...] and sort it.

Payload example: { "size": 100000 }

4️⃣ Matrix

Input: matrix size (number)

Meaning: Generate a matrix of given size (NxN) and perform some CPU-intensive operation, e.g., matrix multiplication, transpose, or sum of all elements.

Example: size = 200 → create 200x200 matrix → multiply it with itself.

Payload example: { "size": 200 }

5️⃣ Fibonacci

Input: number (we called it n)

Meaning: Generate Fibonacci sequence up to the nth number.

Example: n = 40 → calculate first 40 Fibonacci numbers.

Payload example: { "n": 40 }


