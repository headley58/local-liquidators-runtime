# Local Liquidators - Business Operating System

## Quick Start

```bash
# Extract archive
tar -xzvf local-liquidators-runtime.tar.gz

# Enter directory
cd local-liquidators

# Start server
./start.sh

# Or manually:
node src/server.js
```

## Access Points

- Dashboard: http://localhost:3000/dashboard
- CRM: http://localhost:3000/crm
- Pipeline: http://localhost:3000/pipeline
- Lead Intake: http://localhost:3000/intake
- SOPs: http://localhost:3000/sop

## Test

```bash
node src/test.js
```

## Check Status

```bash
bash scripts/status.sh
```

## Requirements

- Node.js 14+
- No database required (uses JSON files)
- No build step required

## Data Storage

All data stored in `data/` directory as JSON files:
- contacts.json
- pipeline.json
- tasks.json
- activities.json
