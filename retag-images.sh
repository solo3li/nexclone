#!/usr/bin/env bash
# ============================================================
# retag-images.sh
# After pulling official images, re-tag them with the exact
# bitnami image names that the helm charts request.
# Run AFTER images are pulled.
# ============================================================
set -e

GREEN='\033[0;32m'; NC='\033[0m'
info() { echo -e "${GREEN}[INFO]${NC} $1"; }

# Exact tags the bitnami helm charts request
PG_TAG="docker.io/bitnami/postgresql:17.6.0-debian-12-r4"
REDIS_TAG="docker.io/bitnami/redis:7.4.3-debian-12-r0"
RABBIT_TAG="docker.io/bitnami/rabbitmq:4.0.9-debian-12-r1"
MINIO_TAG="docker.io/bitnami/minio:2024.12.18-debian-12-r1"

info "Tagging postgres:15-alpine → $PG_TAG"
docker tag postgres:15-alpine "$PG_TAG"

info "Tagging redis:7-alpine → $REDIS_TAG"
docker tag redis:7-alpine "$REDIS_TAG"

info "Tagging rabbitmq:3-management-alpine → $RABBIT_TAG"
docker tag rabbitmq:3-management-alpine "$RABBIT_TAG"

info "Tagging minio/minio:latest → $MINIO_TAG"
docker tag minio/minio:latest "$MINIO_TAG"

info "Importing bitnami-tagged images into k3s containerd..."
docker save "$PG_TAG"     | k3s ctr images import -
docker save "$REDIS_TAG"  | k3s ctr images import -
docker save "$RABBIT_TAG" | k3s ctr images import -
docker save "$MINIO_TAG"  | k3s ctr images import -

info "✅ All images retagged and imported into k3s!"
info "Verify with: k3s ctr images list | grep bitnami"
