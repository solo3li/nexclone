#!/usr/bin/env bash
# ==============================================================
# deploy-dev.sh — Build images + Deploy NexClone to local K3s
# ==============================================================
# Usage:
#   ./deploy-dev.sh             → build images + full deploy
#   ./deploy-dev.sh --no-build  → skip image build, helm only
#   ./deploy-dev.sh --secret-only → only recreate the k8s secret
# ==============================================================

set -e

NAMESPACE="nexclone-dev"
RELEASE="nexclone-dev"
CHART_DIR="./nexclone-chart"
DEV_ENV_FILE="./.dev.env"
SECRET_NAME="nexclone-dev-env"

NO_BUILD=false
SECRET_ONLY=false

for arg in "$@"; do
  case $arg in
    --no-build)   NO_BUILD=true ;;
    --secret-only) SECRET_ONLY=true ;;
  esac
done

# ── Color output ───────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── Safety check: never use production env ─────────────────────
if grep -q "thomas.proxy.rlwy.net" "$DEV_ENV_FILE" 2>/dev/null; then
  error "⛔ Production DB/Redis URL found in $DEV_ENV_FILE! Refusing to deploy. Fix .dev.env first."
fi

info "🚀 NexClone Dev Deploy — namespace: $NAMESPACE"

# ── Create namespace ───────────────────────────────────────────
kubectl get namespace "$NAMESPACE" &>/dev/null || {
  info "Creating namespace $NAMESPACE..."
  kubectl create namespace "$NAMESPACE"
}

# ── Apply K8s Secret from .dev.env ────────────────────────────
info "📦 Applying secret '$SECRET_NAME' from $DEV_ENV_FILE..."
kubectl create secret generic "$SECRET_NAME" \
  --from-env-file="$DEV_ENV_FILE" \
  -n "$NAMESPACE" \
  --dry-run=client -o yaml | kubectl apply -f -
info "Secret applied ✓"

if $SECRET_ONLY; then
  info "✅ Secret-only mode — done."
  exit 0
fi

# ── Build Docker images ────────────────────────────────────────
if ! $NO_BUILD; then
  info "🔨 Building backend image (nexclone-backend:latest)..."
  docker build -t nexclone-backend:latest ./NexClone.Backend

  info "🔨 Building frontend image (nexclone-frontend:latest)..."
  docker build \
    --build-arg NEXT_PUBLIC_API_URL=https://api-nexclone-dev.167.71.66.188.nip.io \
    --build-arg NEXT_PUBLIC_SITE_URL=https://nexclone-dev.167.71.66.188.nip.io \
    -t nexclone-frontend:latest ./frontend

  # Import images into k3s containerd (required for imagePullPolicy: Never)
  info "📤 Importing images into k3s containerd..."
  docker save nexclone-backend:latest | k3s ctr images import -
  docker save nexclone-frontend:latest | k3s ctr images import -
  info "Images imported ✓"
else
  warn "--no-build: skipping image build."
fi

# ── Helm dependency update ─────────────────────────────────────
info "🔄 Updating Helm chart dependencies..."
helm dependency update "$CHART_DIR"

# ── Helm deploy ────────────────────────────────────────────────
info "⛵ Running helm upgrade --install..."
helm upgrade --install "$RELEASE" "$CHART_DIR" \
  --namespace "$NAMESPACE" \
  --create-namespace \
  -f "$CHART_DIR/values-dev.yaml" \
  --timeout 10m \
  --wait

info ""
info "✅ Deploy complete!"
info ""
info "  Frontend: https://nexclone-dev.167.71.66.188.nip.io"
info "  Backend:  https://api-nexclone-dev.167.71.66.188.nip.io"
info ""
info "  Check pods:  kubectl get pods -n $NAMESPACE"
info "  Logs:        kubectl logs -n $NAMESPACE deploy/nexclone-backend -f"
info "  DB shell:    kubectl exec -it -n $NAMESPACE \$(kubectl get pod -n $NAMESPACE -l app.kubernetes.io/name=postgresql -o name | head -1) -- psql -U nexclone -d nexclone_dev"
