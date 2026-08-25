# AlertX: Live Demonstration Runbook

This guide contains step-by-step instructions to demonstrate all 13 cloud and OpenShift deliverables live to examiners, evaluators, or team members.

---

## 🎯 Demonstration Scenarios

### Scenario 1: Verify High Availability & Health Probes
1. Check running pods in OpenShift:
   ```bash
   oc get pods -l app=alert-x
   ```
   *Expected result: 2/2 pods in `Running` state and `1/1 Ready`.*

2. Inspect Liveness, Readiness, and Startup probes:
   ```bash
   oc describe pod -l app=alert-x | grep -E "Liveness|Readiness|Startup"
   ```

3. Test Health Endpoints via Browser or Curl:
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
   oc set env deployment/alert-x APP_VERSION=1.0.1
   oc rollout status deployment/alert-x
   ```
3. **Observation**: Notice continuous `200 OK` responses with **0 dropped requests** due to `maxUnavailable: 0` and readiness probe synchronization.

---

### Scenario 3: Horizontal Pod Autoscaling (HPA) Under Load
1. Watch the HPA status in Terminal 1:
   ```bash
   oc get hpa alertx-hpa -w
   ```
2. Check current resource usage:
   ```bash
   oc get hpa alertx-hpa
   ```
3. **Observation**: HPA monitors CPU & Memory utilization (target 70% CPU, 80% RAM) and scales replicas dynamically between 2 and 10 pods.

---

### Scenario 4: Pod Self-Healing (Fault Tolerance)
1. Delete an active pod to simulate server failure:
   ```bash
   oc delete pod $(oc get pods -l app=alert-x -o jsonpath='{.items[0].metadata.name}')
   ```
2. Immediately check pods:
   ```bash
   oc get pods -l app=alert-x
   ```
3. **Observation**: Kubernetes immediately detects the failure, continues routing traffic to the second healthy pod, and auto-spawns a replacement pod in seconds.

---

### Scenario 5: Security & Network Policy Verification
1. Inspect the active NetworkPolicy:
   ```bash
   oc describe networkpolicy alertx-network-policy
   ```
2. Verify TLS certificate on the OpenShift Route:
   ```bash
   oc get route alert-x -o jsonpath='{.spec.tls.termination}'
   # Output: edge
   ```
3. Verify Non-Root User execution:
   ```bash
   oc exec deploy/alert-x -c alert-x -- id
   # Output shows a non-root UID (OpenShift assigned arbitrary UID)
   ```

---

### Scenario 6: Persistent Storage & Secrets
1. Check PVC status:
   ```bash
   oc get pvc alertx-storage-pvc
   ```
2. Check ConfigMap & Secret:
   ```bash
   oc get configmap alertx-config
   oc get secret alertx-secrets
   ```

---

### Scenario 7: Observability Dashboard
1. Open the OpenShift Web Console -> **Developer** perspective -> **Topology** or **Observe** -> **Metrics**.
2. View real-time graphs for:
   - CPU and Memory Utilization per Pod
   - Active Pod Replicas
   - Network Ingress/Egress Throughput
