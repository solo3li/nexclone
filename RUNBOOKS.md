# Runbooks — NexClone Operations

## Deployment Runbook

### Prerequisites
- kubectl configured for target cluster
- Helm v3 installed
- Access to container registry
- Database migration approved by DBA (if schema change)

### Backend Deployment
```bash
# 1. Build & push
cd NexClone.Backend
docker build -t registry.example.com/nexclone-backend:${TAG} .
docker push registry.example.com/nexclone-backend:${TAG}

# 2. Deploy via Helm
cd ../nexclone-chart
helm upgrade nexclone . \
  --set backend.image.tag=${TAG} \
  --set backend.env.ASPNETCORE_ENVIRONMENT=Production \
  --wait --timeout 5m

# 3. Verify
kubectl rollout status deployment/nexclone-backend
kubectl logs -l app=nexclone-backend --tail=20
curl -s https://nexclone.com/health | jq .
```

### Frontend Deployment
```bash
# 1. Build static export
cd frontend
npm ci
npm run build
# Upload dist/ to CDN or deploy Next.js server

# 2. Verify
curl -sI https://nexclone.com/ | head -5
```

### Database Migration
```bash
# Migrations run automatically at startup.
# CRITICAL: Never deploy during peak traffic.
# Verify with:
kubectl logs -l app=nexclone-backend --tail=50 | grep -i "migrate"

# Manual rollback: see ROLLBACK.md
```

---

## Disaster Recovery

### Severity Levels

| Level | Description | Response Time | Escalation |
|-------|-------------|---------------|------------|
| P1 | Site down, users cannot access | 15 min | Solo dev only |
| P2 | Core feature broken (payments, AI generation) | 1 hour | Bug tracker |
| P3 | Non-critical feature broken | 24 hours | Backlog |

### P1: Site Down
```
1. kubectl get pods -o wide                    # Check pod status
2. kubectl describe pod <pod-name>             # Check events
3. kubectl logs -l app=nexclone-backend --tail=100  # Check logs
4. kubectl get pvc                             # Check storage
5. curl -k https://nexclone.com/health         # External health check
6. Check PostgreSQL connectivity:
   kubectl exec deploy/nexclone-backend -- dotnet ef database list
7. Check monitoring (Grafana/Prometheus) for CPU/memory/error spikes
```

### P2: Payment Failure
```
1. Verify Paymob/PayPal API status pages
2. Check payment gateway credentials:
   kubectl get secret nexclone-payments -o yaml | grep -E 'key|secret' | head
3. Check recent payment errors:
   kubectl logs -l app=nexclone-backend --tail=200 | grep -i "payment\|paymob\|paypal"
4. Run: dotnet test --filter "Payment" in tests/NexClone.Tests
```

### P2: AI Generation Failure
```
1. Check AI microservice health:
   curl http://ai-gateway:5000/health
2. Restart AI consumers:
   kubectl rollout restart deployment/nexclone-backend
3. Check Hangfire dashboard:
   kubectl port-forward svc/nexclone-backend 8080:80
   open http://localhost:8080/hangfire
4. Purge stuck jobs if needed
```

### Rollback (Full)
```bash
# 1. Rollback Helm
helm rollback nexclone

# 2. Rollback DB (manual)
# Restore from latest backup:
# kubectl exec postgres-pod -- pg_restore -d nexclone /backups/latest.dump

# 3. Verify
curl -s https://nexclone.com/health | jq .
```

### Backup Verification
```bash
# Daily check — automated via cron
kubectl exec postgres-pod -- pg_dump -s nexclone > /tmp/schema_check.sql
wc -l /tmp/schema_check.sql   # Should be > 200 lines
```

---

## Monitoring Checklist

### Daily
- [ ] All pods running (`kubectl get pods | grep -v Running`)
- [ ] CPU/Memory < 80% on all pods
- [ ] Error rate < 1% (Prometheus)
- [ ] DB connections < 80% of max
- [ ] Disk usage < 80% on PVCs
- [ ] Backup completed successfully

### Weekly
- [ ] Rotate API keys (Paymob, PayPal, Brevo, MinIO)
- [ ] Review rate limit violations
- [ ] Check certificate expiry (`openssl s_client -connect nexclone.com:443 | openssl x509 -noout -dates`)
- [ ] Audit failed login attempts > threshold

### Monthly
- [ ] Full restore test from backup
- [ ] Load test with k6 (`k6 run scripts/load-test.js`)
- [ ] Security audit (`bash scripts/security-audit.sh https://nexclone.com`)
- [ ] Review and update runbooks