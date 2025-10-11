#!/bin/bash

# Fix GitHub push protection by cleaning up any actual secret files
# Stop tracking config files that might contain secrets

# Add to .gitignore
echo "# Environment files and secrets" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.prod" >> .gitignore
echo "backend/.env" >> .gitignore
echo "**/config.json" >> .gitignore
echo ".vscode/settings.json" >> .gitignore

# Remove any tracked env files
git rm --cached .env* backend/.env* 2>/dev/null || true

echo "🔧 Git ignore updated and tracked env files removed"
echo "📁 Sensitive files are now excluded from Git tracking"
echo "🚀 You can now try to push without the security blockings"