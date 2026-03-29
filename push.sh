#!/bin/bash
set -e

mkdir -p ~/.ssh

echo "$GITHUB_DEPLOY_KEY" > ~/.ssh/github_deploy
chmod 600 ~/.ssh/github_deploy

cat > ~/.ssh/config << 'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  StrictHostKeyChecking no
EOF
chmod 600 ~/.ssh/config

git push origin main
