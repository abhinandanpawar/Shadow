#!/bin/bash
set -e

# This script sets up the Python environment for the ATS service.

# Navigate to the script's directory to ensure paths are correct.
cd "$(dirname "$0")"

# Create a virtual environment if it doesn't exist.
if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python -m venv .venv
fi

# Activate the virtual environment and install dependencies.
echo "Installing dependencies..."
source .venv/bin/activate
pip install .

echo "Setup complete. To activate the environment, run: source services/ats/.venv/bin/activate"