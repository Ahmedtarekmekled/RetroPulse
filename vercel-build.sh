#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Build complete!" 