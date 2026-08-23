# NexClone — Rollback & Disaster Recovery Playbook

## Quick Reference

| Scenario | Command | Downtime |
|---|---|---|
| Backend deploy broke | `kubectl rollout undo deployment/nexclone-backend -n nexclone` | ~30s |
| Frontend deploy broke | `kubectl rollout undo deployment/nexclone-frontend -n nexclone` | ~10s |
| Database migration corrupted | See section below | ~5-15 min |
| Secrets leaked | See section below | ~2 min |




---

## Backend Rollback

```bash
# View rollout history
kubectl rollout history deployment/nexclone-backend -n nexclone

# Rollback to previous revision
kubectl rollout undo deployment/nexclone-backend -n nexclone

# Rollback to a specific revision
kubectl rollout undo deployment/nexclone-backend -n nexclone --to-revision=3

# Verify rollout succeeded
kubectl rollout status deployment/nexclone-backend -n nexclone

# Check that pod is healthy
kubectl get pods -n nexclone -l app=nexclone-backend
```

## Frontend Rollback

```bash
kubectl rollout undo deployment/nexclone-frontend -n nexclone
kubectl rollout status deployment/nexclone-frontend -n nexclone
```

## Database Recovery

### Scenario: Migration fails or corrupts data
**Only do this as a last resort — requires downtime.**

```bash
# 1. STOP all backend traffic
kubectl scale deployment/nexclone-backend --replicas=0 -n nexclone

# 2. Restore from latest pg_dump backup
# (Backup is taken automatically via the deploy pipeline)
PGPASSWORD=$DB_PASSWORD pg_restore \
  -h $DB_HOST -p $DB_PORT \
  -U $DB_USER -d $DB_NAME \
  --clean --if-exists \
  /backups/latest.dump

# 3. Deploy the PREVIOUS (working) backend image
kubectl set image deployment/nexclone-backend \
  backend=soloc/nexclone-backend:PREVIOUS_SHA \
  -n nexclone

# 4. Scale back up
kubectl scale deployment/nexclone-backend --replicas=1 -n nexclone

# 5. Verify
kubectl logs deployment/nexclone-backend -n nexclone --tail=20
curl https://api.example.com/health
```

### Scenario: Migration needs to be skipped
If a migration already ran partially on some pods:

```bash
# 1. Connect to DB
kubectl exec -it -n nexclone $(kubectl get pod -n nexclone -l app.kubernetes.io/name=postgresql -o name | head -1) -- psql -U nexclone -d nexclone_dev

# 2. Remove the failed migration entry so it re-runs or is skipped
DELETE FROM "__EFMigrationsHistory" WHERE "MigrationId" = 'FAILED_MIGRATION_ID';
```

---

## Secret Rotation (if credentials leaked)

```bash
# 1. Rotate all credentials on the provider side FIRST
#    - Railway: change DB password
#    - MinIO: change root credentials
#    - Redis: change password
#    - Generate new JWT key: openssl rand -base64 64

# 2. Update K8s secret
kubectl create secret generic nexclone-env \
  --from-env-file=.production.env \
  -n nexclone \
  --dry-run=client -o yaml | kubectl apply -f -

# 3. Rolling restart all backends (zero-downtime)
kubectl rollout restart deployment/nexclone-backend -n nexclone

# 4. Verify all pods are healthy
kubectl get pods -n nexclone -w
```

---

## Helm Rollback

```bash
# List releases
helm list -n nexclone

# View history
helm history nexclone -n nexclone

# Rollback
helm rollback nexclone -n nexclone

# Force rollback if needed
helm rollback nexclone 3 -n nexclone --force
```

---

## Health Verification After Any Rollback

```bash
# 1. Check all pods running
kubectl get pods -n nexclone

# 2. Backend health endpoint
curl -s https://api.example.com/health

# 3. Frontend responds
curl -s -o /dev/null -w "%{http_code}" https://example.com

# 4. Database connectivity
kubectl exec -it -n nexclone deploy/nexclone-backend -- \
  curl -s http://localhost:8080/health
```

---

## Pre-Deploy Checklist

- [ ] `dotnet build` passes with 0 errors
- [ ] `dotnet test` all pass
- [ ] Database backup taken (`pg_dump` or auto-backup)
- [ ] Staging deploy verified for 24+ hours
- [ ] Image tag is a specific SHA, not `latest`
- [ ] Rollback command documented in deploy notes
- [ ] Monitoring dashboards accessible

---

## Emergency Contacts

| Role | Contact |
|---|---|
| Database provider | Railway dashboard / support |
| K8s cluster | VPS provider dashboard |
| DNS | Cloudflare / provider dashboard |
| Certificates | cert-manager auto-renews |

---

## Notes

- **Zero-downtime deploy**: The Helm chart uses `RollingUpdate` with `maxSurge: 1` and `maxUnavailable: 0`. Two pods run briefly during deploy.
- **Database migrations**: Run as part of backend startup. EF Core `Migrate()` is idempotent — safe to re-run.
- **Always back up before**: Any migration that modifies columns (not just adds them) should have a pg_dump taken first.
- **Test on staging first**: All changes must pass 24 hours on staging namespace before production deploy.