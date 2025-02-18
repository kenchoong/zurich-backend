#!/bin/sh

# Run migrations
yarn typeorm:run-migrations

# Check if seeding is already done
if [ ! -f "/app/.seeding_done" ]; then
    echo "Running seeds for the first time..."
    yarn seed
    # Create a flag file to indicate seeding is done
    touch /app/.seeding_done
else
    echo "Seeding already done, skipping..."
fi

# Start the application
node dist/src/main.js
