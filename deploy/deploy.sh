#!/bin/bash
set -euo pipefail

# Usage: ./deploy/deploy.sh <VM_IP> <DOCKER_USERNAME>
VM_IP=${1:?Usage: deploy.sh <VM_IP> <DOCKER_USERNAME>}
DOCKER_USERNAME=${2:?Usage: deploy.sh <VM_IP> <DOCKER_USERNAME>}

echo "Deploying to $VM_IP as user $DOCKER_USERNAME..."

ssh -o StrictHostKeyChecking=no ubuntu@"$VM_IP" \
  "DOCKER_USERNAME=$DOCKER_USERNAME docker compose -f /home/ubuntu/docker-compose.prod.yml pull && \
   DOCKER_USERNAME=$DOCKER_USERNAME docker compose -f /home/ubuntu/docker-compose.prod.yml up -d && \
   docker ps"

echo ""
echo "Done! Frontend: http://$VM_IP:3000"
echo "      API:      http://$VM_IP:5000/api/status"
