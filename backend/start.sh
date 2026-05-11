#!/bin/bash
# SolUPI Backend Launcher — clears port 3001, then starts the backend
set -e

PORT=${PORT:-3001}

echo "🔧 Clearing port $PORT..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
sleep 0.4

echo "🚀 Starting SolUPI backend..."
cargo run
