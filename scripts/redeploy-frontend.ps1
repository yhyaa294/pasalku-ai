# Redeploy frontend helper (PowerShell)
# Builds Docker image for frontend and optionally pushes to registry if DOCKER_REGISTRY env var is set

param(
    [switch]$Push
)

$ErrorActionPreference = 'Stop'

Write-Host "Building Docker image pasalku-frontend:latest..."
docker build -f Dockerfile.frontend -t pasalku-frontend:latest .

if ($Push -or $env:DOCKER_REGISTRY) {
    $registry = $env:DOCKER_REGISTRY
    if (-not $registry) { $registry = Read-Host "Enter Docker registry (e.g. ghcr.io/owner)" }
    $tag = "$registry/pasalku-frontend:latest"
    Write-Host "Tagging image as $tag"
    docker tag pasalku-frontend:latest $tag
    Write-Host "Pushing $tag to registry..."
    docker push $tag
    Write-Host "Pushed. Remember to update your deployment platform to use $tag if necessary."
}

Write-Host "Done. To run locally: docker run --rm -p 5000:5000 pasalku-frontend:latest"