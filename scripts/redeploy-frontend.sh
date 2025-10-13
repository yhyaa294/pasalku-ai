#!/usr/bin/env bash
# Redeploy frontend helper (POSIX)
# Builds Docker image for frontend and optionally pushes to registry if DOCKER_REGISTRY env var is set
set -euo pipefail

PUSH=false
if [ "${1:-}" = "--push" ]; then
  PUSH=true
fi

echo "Building Docker image pasalku-frontend:latest..."
docker build -f Dockerfile.frontend -t pasalku-frontend:latest .

if [ "$PUSH" = true ] || [ -n "${DOCKER_REGISTRY:-}" ]; then
  REGISTRY=${DOCKER_REGISTRY:-}
  if [ -z "$REGISTRY" ]; then
    read -p "Enter Docker registry (e.g. ghcr.io/owner): " REGISTRY
  fi
  TAG="$REGISTRY/pasalku-frontend:latest"
  echo "Tagging image as $TAG"
  docker tag pasalku-frontend:latest "$TAG"
  echo "Pushing $TAG to registry..."
  docker push "$TAG"
  echo "Pushed. Remember to update your deployment platform to use $TAG if necessary."
fi

echo "Done. To run locally: docker run --rm -p 3000:3000 pasalku-frontend:latest"