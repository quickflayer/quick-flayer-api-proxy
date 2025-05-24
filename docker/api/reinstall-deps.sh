#!/bin/sh

echo "Reinstalling dependencies..."

# Remove node_modules directory
rm -rf /app/node_modules

# Ensure pnpm is installed
npm install -g pnpm

# Clean pnpm cache
pnpm store prune

# Install dependencies
cd /app
pnpm install

echo "Dependencies reinstalled successfully!"
