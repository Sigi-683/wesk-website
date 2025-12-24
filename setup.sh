#!/bin/bash

# Install Backend Deps
echo "Setting up Backend..."
cd server
npm install
node src/seed.js # Optional: Seed DB
cd ..

# Install Frontend Deps & Build
echo "Setting up Frontend..."
cd client
npm install
npm run build
cd ..

echo "Setup complete! To start the development server:"
echo "1. Backend: cd server && npm start"
echo "2. Frontend: cd client && npm run dev"
echo ""
echo "For production:"
echo "Serve 'client/dist' with Nginx and run 'node server/src/server.js'"
