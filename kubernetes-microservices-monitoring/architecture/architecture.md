             +-----------------------+
             |      Client / Load     |
             |       Tester (ab)      |
             +-----------+-----------+
                         |
                         v
             +-----------------------+
             |   Service A: API GW   |
             |  (Job Submitter)      |
             |  - /submit, /status   |
             |  - Push to Redis Q    |
             +-----------+-----------+
                         |
                         v
             +-----------------------+
             |        Redis           |
             |  Queue + Job Storage   |
             +-----------+-----------+
                         |
             +-----------+-----------+
             |                       |
             v                       v
  +-------------------+     +-------------------+
  | Service B: Worker |     | Service B: Worker |
  |  (Horizontally    | ... |  (Auto-Scalable)  |
  |   Scaled Pods)    |     |                   |
  +-------------------+     +-------------------+
           |
           | Writes results, metrics
           v
     +-------------------+
     |    Redis          |
     +-------------------+
           |
           v
     +-------------------+
     | Service C: Stats  |
     |  - /stats         |
     |  - /metrics       |
     +-------------------+
           |
           v
     +-------------------+
     | Prometheus        |
     | - Scrapes metrics |
     | - Tracks jobs     |
     +-------------------+
           |
           v
     +-------------------+
     | Grafana Dashboard |
     | - Visualize data  |
     | - CPU, jobs, etc. |
     +-------------------+
