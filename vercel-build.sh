#!/bin/bash
echo "Setting up npm version..."
npm install -g npm@8.19.2

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