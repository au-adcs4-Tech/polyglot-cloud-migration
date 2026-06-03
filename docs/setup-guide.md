# Setup Guide

## 1. Prerequisites

Install the following on your development machine:
- Docker Desktop (includes Docker Compose)
- .NET 8 SDK — https://dotnet.microsoft.com/download
- Python 3.12 — https://python.org
- Node.js 20 — https://nodejs.org
- Terraform — https://developer.hashicorp.com/terraform/install
- AWS CLI — https://aws.amazon.com/cli/ (configured with `aws configure`)

---

## 2. GitHub Organization Setup

1. Go to https://github.com/organizations/new
2. Create an organization (e.g. `au-adcs4-team1`)
3. Create a repository `polyglot-cloud-migration` inside it
4. Enable branch protection on `main`:
   - Require pull request before merging
   - Require at least 1 reviewer
   - Require status checks to pass (CI)
   - Disallow direct pushes to `main`

---

## 3. GitHub Secrets to Configure

Go to Repository → Settings → Secrets → Actions → New repository secret:

| Secret Name | Value |
|-------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub access token |
| `JENKINS_URL` | http://YOUR_JENKINS_IP:8080 |
| `JENKINS_USER` | Jenkins admin username |
| `JENKINS_TOKEN` | Jenkins API token |

---

## 4. Docker Compose Commands

```bash
# Start all services (build first)
docker compose up --build

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

---

## 5. Docker Swarm Commands

```bash
# Initialize Swarm (first time only)
docker swarm init

# Deploy the stack
export DOCKER_USERNAME=yourusername
docker stack deploy -c docker-stack.yml polyglot-app

# Check services
docker service ls

# View service logs
docker service logs polyglot-app_backend

# Remove the stack
docker stack rm polyglot-app
```

---

## 6. Terraform Setup

```bash
cd infra

# Copy and fill in variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars   # fill in your values

# Initialize providers
terraform init

# Validate configuration
terraform validate

# Preview changes
terraform plan

# Apply (creates AWS resources)
terraform apply

# Destroy (removes all AWS resources)
terraform destroy
```

---

## 7. Jenkins Setup

1. Install Jenkins on a server or locally
2. Install plugins: **Pipeline**, **SSH Agent**, **GitHub Integration**, **Docker Pipeline**
3. Add Credentials (Manage Jenkins → Credentials → Global):
   - `docker-username` — Secret text — Docker Hub username
   - `cloud-vm-ssh-key` — SSH private key — your PEM file
   - `cloud-vm-ip` — Secret text — EC2 public IP
   - `github-token` — Username/password — GitHub PAT
4. Create a Pipeline job named `polyglot-deploy`
5. Point it at the `Jenkinsfile` in the repository root

---

## 8. Running Tests Locally

### .NET
```bash
cd backend-dotnet
dotnet test tests/PolyglotApi.Tests/
```

### Python
```bash
cd worker-python
pip install -r requirements.txt
pytest tests/ -v
```

### JavaScript
```bash
cd frontend-js
npm ci
npm test
```
