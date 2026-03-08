#!/bin/bash

echo "🚀 Starting Linkedink Deployment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️ .env.local not found! Creating from template..."
    cp .env.example .env.local 2>/dev/null || echo "DATABASE_URL=postgresql://user:pass@localhost:5432/dbname" > .env.local
fi

# Build and start containers
echo "📦 Building and starting Docker containers..."
docker compose up -d --build --remove-orphans

# Wait for database to be ready
echo "⏳ Waiting for database to initialize..."
sleep 5

# Run migrations inside the container
echo "🔄 Running database migrations..."
docker compose exec linkedink npx prisma db push

echo "✅ Deployment complete! Linkedink is running on port 3006."
echo "🔗 Local access: http://localhost:3006/Linkedink"
