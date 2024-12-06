#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build frontend
echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
DISABLE_ESLINT_PLUGIN=true CI=false npm run build
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Build complete!" 