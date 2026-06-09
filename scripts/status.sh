#!/bin/bash
# Local Liquidators - Status Check

echo "🏠 Local Liquidators System Status"
echo "=================================="
echo ""

PORT=${PORT:-3000}

# Check if server is running
if curl -s http://localhost:$PORT/api/health > /dev/null; then
    echo "✓ Server is RUNNING on port $PORT"
    echo ""
    echo "Dashboard: http://localhost:$PORT/dashboard"
    echo "CRM:       http://localhost:$PORT/crm"
    echo "Pipeline:  http://localhost:$PORT/pipeline"
    echo "Intake:    http://localhost:$PORT/intake"
    echo "SOPs:      http://localhost:$PORT/sop"
    echo ""
    curl -s http://localhost:$PORT/api/health | head -1
else
    echo "✗ Server is NOT RUNNING"
    echo ""
    echo "Start with: ./start.sh"
fi