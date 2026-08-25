# AlertX: Live Demonstration Runbook

This guide contains step-by-step instructions to demonstrate all 13 cloud and OpenShift deliverables live to examiners, evaluators, or team members.

---

## 🎯 Demonstration Scenarios

### Scenario 1: Verify High Availability & Health Probes
1. Check running pods in OpenShift:
   ```bash
   oc get pods -l app=alertx
   ```
   *Expected result: 2/2 pods in `Running` state and `1/1 Ready`.*

2. Test Liveness and Readiness probes:
   ```bash
   oc describe pod -l app=alertx | grep -E "Liveness|Readiness|Startup"
   ```

3. Test Health Endpoints via Curl or Browser:
   ```bash
   curl -i https://alert-x-emil0512-dev.apps.rm3.7wse.p1.openshiftapps.com/healthz
   curl -i https://alert-x-emil0512-dev.apps.rm3.7wse.p1.openshiftapps.com/readyz
   curl -i https://alert-x-emil0512-dev.apps.rm3.7wse.p1.openshiftapps.com/api/status
   ```

---

### Scenario 2: Zero-Downtime Rolling Update Demonstration
1. Start a continuous ping in Terminal 1:
   ```bash
   while true; do curl -s -o /dev/null -w "%{http_code}\n" https://alert-x-emil0512-dev.apps.rm3.7wse.p1.openshiftapps.com/; sleep 0.5; done
   ```
2. Trigger a rolling update in Terminal 2:
   ```bash
   oc set env deployment/alertx-deployment APP_VERSION=1.0.1
   oc rollout status deployment/alertx-deployment
   ```
3. **Observation**: Notice 100% `200 OK` responses with **0 dropped requests** due to `maxUnavailable: 0` and readiness probe synchronization.

---

### Scenario 3: Horizontal Pod Autoscaling (HPA) Under Load
1. Watch the HPA status in Terminal 1:
   ```bash
   oc get hpa alertx-hpa -w
   ```
2. Generate synthetic CPU traffic load using ApacheBench or Hey in Terminal 2:
   ```bash
   # Send 50 concurrent requests for 60 seconds
   hey -z 60s -c 50 https://alert-x-emil0512-dev.apps.rm3.7wse.p1.openshiftapps.com/
   ```
3. **Observation**: As CPU utilization surpasses the 70% threshold, OpenShift HPA automatically scales replicas from `2` up to `4`, `6`, or `8` pods.

---

### Scenario 4: Pod Self-Healing (Fault Tolerance)
1. Delete an active pod:
   ```bash
   oc delete pod $(oc get pods -l app=alertx -o jsonpath='{.items[0].metadata.name}')
   ```
2. **Observation**: Kubernetes immediately detects the failure, maintains traffic on the surviving replica, and spins up a replacement pod within seconds.

---

### Scenario 5: Serverless Event-Driven Dispatcher
1. Invoke the event-driven dispatcher serverless function:
   ```bash
   curl -X POST https://alert-x-emil0512-dev.apps.rm3.7wse.p1.openshiftapps.com/serverless/dispatch \
     -H "Content-Type: application/json" \
     -d '{
       "incidentId": "INC-889922",
       "type": "Armed Robbery - SOS Alert",
       "severity": "CRITICAL",
       "location": { "lat": 28.6139, "lng": 77.2090, "address": "Metro Station Gate 3" }
     }'
   ```
2. **Observation**: Serverless function cold-starts or processes event asynchronously, returning emergency unit dispatch payload (`UNIT-ALPHA-01`, ETA: 3 minutes).

---

### Scenario 6: Security & Network Policy Verification
1. Inspect the active NetworkPolicy:
   ```bash
   oc describe networkpolicy alertx-network-policy
   ```
2. Verify TLS certificate on the OpenShift Route:
   ```bash
   oc get route alertx-route -o jsonpath='{.spec.tls.termination}'
   # Returns: edge
   ```
3. Verify Non-Root User execution:
   ```bash
   oc exec deploy/alertx-deployment -c alertx -- id
   # Returns non-root UID (1001 or OpenShift assigned UID)
   ```

---

### Scenario 7: Observability Dashboard
1. Open the OpenShift Web Console -> **Observe** -> **Dashboards** (or import `monitoring/grafana-dashboard.json`).
2. Show real-time Pod metrics:
   - Available Replicas
   - CPU / Memory graphs
   - Network throughput and response codes
