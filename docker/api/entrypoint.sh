#!/bin/sh

# Install dependencies if not already present
if [ ! -d "node_modules" ]; then
  npm install
fi

# Start the dev server
npm run start:dev
