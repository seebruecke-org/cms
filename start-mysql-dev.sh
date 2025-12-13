#!/bin/bash

# Check if mysql-dev container is already running
if [ "$(docker ps -q -f name=mysql-dev)" ]; then
  echo "MySQL dev server is already running on port 3306"
  exit 0
fi

# Check if mysql-dev container exists but is stopped
if [ "$(docker ps -aq -f name=mysql-dev)" ]; then
  echo "Starting existing mysql-dev container..."
  docker start mysql-dev
else
  # Build and run the MySQL dev container
  echo "Building MySQL dev container..."
  docker build -f Dockerfile.mysql.dev -t mysql-dev .

  echo "Creating and starting MySQL dev container..."
  docker run -d -p 3306:3306 --name mysql-dev mysql-dev
fi

echo "MySQL dev server is running on port 3306"
