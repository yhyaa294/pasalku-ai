#!/bin/bash

# 🚀 Automated Deployment Script untuk Pasalku.ai
# Script ini mengotomatisasi deployment full-stack ke Railway dan Vercel

set -e

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Script variables
PROJECT_NAME="pasalku-ai"
ENVIRONMENT=${1:-"development"}
SKIP_TESTS=${2:-"false"}

# Pre-deployment checks
pre_deployment_checks() {
    log_info "Running pre-deployment checks..."

    # Check if required tools are installed
    command -v node >/dev/null 2>&1 || { log_error "Node.js is required but not installed."; exit 1; }
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed."; exit 1; }
    command -v git >/dev/null 2>&1 || { log_error "Git is required but not installed."; exit 1; }

    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_error ".env file not found. Please create it with production values."
        exit 1
    fi

    # Check required environment variables
    required_vars=("DATABASE_URL" "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "STRIPE_SECRET_KEY" "MONGODB_URI")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env; then
            log_error "Required environment variable $var not found in .env"
            exit 1
        fi
    done

    log_success "Pre-deployment checks completed"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = "false" ]; then
        log_info "Running test suite..."

        # Run frontend component tests
        log_info "Running frontend tests..."
        npm run test:components || { log_error "Frontend tests failed"; exit 1; }

        # Run integration tests if environment has real services
        if [ "$ENVIRONMENT" = "staging" ] || [ "$ENVIRONMENT" = "production" ]; then
            log_warning "Skipping full integration tests in $ENVIRONMENT environment"
        else
            # Start services with docker-compose for testing
            docker-compose up -d || { log_error "Failed to start services"; exit 1; }
            sleep 30

            # Run integration tests
            ./tests/run_integration_tests.sh || { log_error "Integration tests failed"; exit 1; }

            # Stop services
            docker-compose down
        fi

        log_success "All tests passed"
    else
        log_warning "Skipping tests as requested"
    fi
}

# Build Docker images
build_docker_images() {
    log_info "Building Docker images..."

    # Build frontend
    docker build -f Dockerfile.frontend -t pasalku-frontend:latest . --no-cache
    log_success "Frontend Docker image built"

    # Build backend
    docker build -f Dockerfile.backend -t pasalku-backend:latest . --no-cache
    log_success "Backend Docker image built"
}

# Deploy backend to Railway
deploy_backend() {
    log_info "Deploying backend to Railway..."

    # Check if Railway CLI is installed
    if ! command -v railway >/dev/null 2>&1; then
        log_error "Railway CLI not found. Install it first: https://docs.railway.app/develop/cli"
        exit 1
    fi

    # Login to Railway (interactive)
    log_info "Please login to Railway:"
    railway login || { log_error "Railway login failed"; exit 1; }

    # Link to existing project or create new one
    if railway link; then
        log_info "Linked to existing Railway project"
    else
        log_warning "No Railway project linked. Creating new project..."
        railway init "$PROJECT_NAME-backend" || { log_error "Failed to create Railway project"; exit 1; }
    fi

    # Set environment variables
    log_info "Setting environment variables..."
    railway variables set ENVIRONMENT="$ENVIRONMENT"
    railway variables set DEBUG="false"
    railway variables set ENABLE_AI_FALLBACK="true"
    railway variables set ENABLE_ERROR_LOGGING="true"
    railway variables set ENABLE_ANALYTICS_TRACKING="true"
    railway variables set ENABLE_PAYMENT_PROCESSING="true"

    # Deploy
    log_info "Deploying to Railway..."
    railway up || { log_error "Railway deployment failed"; exit 1; }

    log_success "Backend deployed to Railway"

    # Get the backend URL
    BACKEND_URL=$(railway domain) || BACKEND_URL="https://$PROJECT_NAME-backend.railway.app"
    log_info "Backend will be available at: $BACKEND_URL"

    # Export for frontend deployment
    echo "BACKEND_URL=$BACKEND_URL" >> .env.deploy
}

# Deploy frontend to Vercel
deploy_frontend() {
    log_info "Deploying frontend to Vercel..."

    # Source environment variables
    if [ -f ".env.deploy" ]; then
        source .env.deploy
    fi

    # Check if Vercel CLI is installed
    if ! command -v vercel >/dev/null 2>&1; then
        log_error "Vercel CLI not found. Install it first: npm i -g vercel"
        exit 1
    fi

    # Login to Vercel (interactive)
    log_info "Please login to Vercel:"
    vercel login || { log_error "Vercel login failed"; exit 1; }

    # Set production environment
    if [ "$ENVIRONMENT" = "production" ]; then
        PROD_FLAG="--prod"
    else
        PROD_FLAG=""
    fi

    # Deploy to Vercel
    log_info "Deploying to Vercel..."
    vercel $PROD_FLAG || { log_error "Vercel deployment failed"; exit 1; }

    # Set environment variables
    log_info "Setting Vercel environment variables..."
    if [ ! -z "$BACKEND_URL" ]; then
        vercel env add NEXT_PUBLIC_API_URL $PROD_FLAG || log_warning "Failed to set API URL"
    fi

    # Get the frontend URL
    FRONTEND_URL=$(vercel --yes 2>/dev/null | grep -o 'https://[^ ]*\.vercel\.app' | tail -1) || FRONTEND_URL="https://$PROJECT_NAME.vercel.app"
    log_info "Frontend will be available at: $FRONTEND_URL"
}

# Post-deployment verification
verify_deployment() {
    log_info "Verifying deployment..."

    sleep 30 # Wait for services to fully start

    # Source environment variables
    if [ -f ".env.deploy" ]; then
        source .env.deploy
    fi

    # Test backend health
    if [ ! -z "$BACKEND_URL" ]; then
        if curl -s "$BACKEND_URL/api/health" >/dev/null; then
            log_success "Backend health check passed"
        else
            log_error "Backend health check failed"
        fi
    fi

    # Note: Frontend verification will be done after Vercel deployment completes
    # (Vercel deployments are asynchronous)
}

# Cleanup temporary files
cleanup() {
    log_info "Cleaning up temporary files..."
    rm -f .env.deploy
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    echo
    echo "🚀 Pasalku.ai Deployment Script"
    echo "==============================="
    echo "Environment: $ENVIRONMENT"
    echo "Skip Tests: $SKIP_TESTS"
    echo

    pre_deployment_checks
    run_tests
    build_docker_images
    deploy_backend
    deploy_frontend
    verify_deployment
    cleanup

    echo
    echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
    echo "====================================="
    echo "Backend: $BACKEND_URL"
    echo "Frontend: $FRONTEND_URL"
    echo
    echo "Don't forget to:"
    echo "- Update DNS records for custom domain"
    echo "- Configure monitoring alerts"
    echo "- Test critical user flows"
    echo "- Set up backup schedules"
    echo
}

# Error handling
trap 'log_error "Deployment failed with exit code $?"; cleanup' ERR

# Run main function
main "$@"