#!/bin/bash
# Local Liquidators - Start Script

echo "Local Liquidators Business Operating System"
echo "=============================================="
echo ""

# Run from the package root, regardless of the caller's current directory.
cd -- "$(dirname -- "$0")"

# Create data directory if not exists
mkdir -p data

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is required but not installed"
    exit 1
fi

echo "[OK] Node.js found"
echo ""

# Start the server
echo "Starting server..."
node src/server.js
