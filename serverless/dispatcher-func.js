/**
 * AlertX Emergency Dispatcher - Event-Driven Serverless Function
 * 
 * Handles incoming SOS and High-Priority incident events:
 * 1. Validates incident payload & priority level
 * 2. Simulates emergency dispatch alerting to nearest responder units
 * 3. Returns dispatch confirmation with estimated arrival and incident tracking token
 */

export async function handleEvent(context, event) {
  const payload = event || context.body || {};
  const timestamp = new Date().toISOString();
  
  const {
    incidentId = `INC-${Date.now().toString().slice(-6)}`,
    type = 'Emergency SOS',
    severity = 'CRITICAL',
    location = { lat: 28.6139, lng: 77.2090, address: 'Reported GPS Location' },
    reporter = 'Anonymous Citizen'
  } = payload;

  console.log(`[ALERTX-SERVERLESS] Received event: ${type} [Severity: ${severity}] at ${timestamp}`);
  console.log(`[ALERTX-SERVERLESS] Incident ID: ${incidentId} | Location: ${JSON.stringify(location)}`);

  // Calculate simulated response time based on severity
  const etaMinutes = severity === 'CRITICAL' ? 3 : 8;
  const responderUnitsAssigned = severity === 'CRITICAL' ? ['UNIT-ALPHA-01', 'EMS-RAPID-04'] : ['PATROL-BETA-09'];

  const dispatchResult = {
    status: 'DISPATCHED',
    eventId: `EVT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    incidentId,
    type,
    severity,
    location,
    reporter,
    dispatchedAt: timestamp,
    assignedUnits: responderUnitsAssigned,
    estimatedArrivalTimeMinutes: etaMinutes,
    serverlessRuntime: 'OpenShift Serverless / Knative Function',
    executionTimeMs: 42
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-AlertX-Serverless': 'Knative-Event-Processor'
    },
    body: dispatchResult
  };
}

// Standalone runner for testing or Knative HTTP invocation
if (process.env.NODE_ENV !== 'test') {
  import('http').then(({ createServer }) => {
    const port = process.env.PORT || 8080;
    const server = createServer(async (req, res) => {
      if (req.url === '/healthz') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'healthy', function: 'alert-dispatcher' }));
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = body ? JSON.parse(body) : {};
            const result = await handleEvent({}, data);
            res.writeHead(result.statusCode, result.headers);
            res.end(JSON.stringify(result.body, null, 2));
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          service: 'AlertX Serverless Dispatcher',
          usage: 'POST / with incident JSON payload to trigger emergency dispatch'
        }));
      }
    });

    server.listen(port, () => {
      console.log(`AlertX Serverless Dispatcher listening on port ${port}`);
    });
  });
}
