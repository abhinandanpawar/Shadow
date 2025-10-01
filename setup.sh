#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Helper Functions ---
echo_info() {
    echo "INFO: $1"
}

echo_error() {
    echo "ERROR: $1" >&2
    exit 1
}

# --- Check for nvm ---
if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
elif [ -x "$(command -v brew)" ] && [ -s "$(brew --prefix nvm)/nvm.sh" ]; then
    # shellcheck source=/dev/null
    source "$(brew --prefix nvm)/nvm.sh"
else
    echo_error "nvm is not installed. Please install it from https://github.com/nvm-sh/nvm"
fi

# --- Use .nvmrc to set Node.js version ---
if [ ! -f ".nvmrc" ]; then
    echo_error ".nvmrc file not found in the root directory."
fi

echo_info "Using nvm to install and use the Node.js version specified in .nvmrc..."
nvm install
nvm use

# --- Check for pnpm and install if not present ---
if ! command -v pnpm &> /dev/null; then
    echo_info "pnpm not found. Installing it globally via npm..."
    npm install -g pnpm
else
    echo_info "pnpm is already installed."
fi

# --- Install dependencies ---
echo_info "Installing all project dependencies with pnpm..."
pnpm install

echo_info "Setup complete! Your environment is ready."