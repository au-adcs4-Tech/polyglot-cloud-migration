# Troubleshooting Guide

## Docker Issues

### Services fail to start
```bash
docker compose logs backend
docker compose logs worker
docker compose ps
```
Check that all containers are healthy before the frontend tries to connect.

### Redis connection refused
The worker and backend retry connection to Redis. If you see retry logs, wait 15–30 seconds for Redis to become healthy. Check:
```bash
docker compose logs redis
docker exec -it polyglot_redis redis-cli ping
```

### Port already in use
```bash
# Find the process using the port
lsof -i :5000
kill -9 <PID>
```

---

## .NET API Issues

### Build fails (NuGet restore error)
```bash
dotnet nuget locals all --clear
dotnet restore backend-dotnet/src/PolyglotApi/PolyglotApi.csproj
```

### API returns 500
Check that Redis URL is correct in `appsettings.json`. The API handles missing Redis gracefully — check logs for details.

---

## Python Worker Issues

### `ModuleNotFoundError: No module named 'redis'`
```bash
pip install -r worker-python/requirements.txt
```

### Worker keeps retrying Redis
Normal behaviour on startup. Redis must be healthy first. In Docker Compose this is handled by `depends_on` with health check.

---

## Terraform Issues

### `Error: No valid credential sources found`
Run `aws configure` and provide your AWS Access Key ID and Secret.

### `Error: InvalidKeyPair.NotFound`
Your SSH public key in `terraform.tfvars` must be valid. Generate with:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/polyglot-key
cat ~/.ssh/polyglot-key.pub   # paste this into terraform.tfvars
```

### `terraform apply` shows 0 changes but VM is gone
State might be stale. Run `terraform refresh` then `terraform plan`.

---

## GitHub Actions Issues

### CI not triggering
Check that the branch name matches `feature/**` or `fix/**` pattern in `ci.yml`. Also verify the workflow file is in `.github/workflows/`.

### Docker push fails (unauthorized)
Check that `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are set correctly in GitHub.

### `dotnet format --verify-no-changes` fails
Run locally:
```bash
dotnet format backend-dotnet/src/PolyglotApi/PolyglotApi.csproj
git commit -am "chore: apply dotnet format"
```

---

## Jenkins Issues

### Jenkins can't SSH to EC2
- Verify the `cloud-vm-ssh-key` credential contains the correct private key
- Check the security group allows port 22 from the Jenkins server IP
- Test manually: `ssh -i your-key.pem ubuntu@VM_IP`

### Jenkins job not triggering after CI
- Verify `JENKINS_URL`, `JENKINS_USER`, `JENKINS_TOKEN` secrets in GitHub
- Check Jenkins job name matches the curl URL in `ci.yml`
- Ensure "Trigger builds remotely" is enabled in the Jenkins job config

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Committing `.env` or `terraform.tfvars` | Add to `.gitignore`, rotate secrets immediately |
| Hardcoding IP in docker-compose | Use environment variables |
| Pushing directly to `main` | Branch protection prevents this — use PRs |
| Not running `terraform destroy` between tests | Always destroy to avoid unexpected AWS charges |
