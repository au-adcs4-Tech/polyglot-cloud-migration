# Polyglot Cloud Migration

[![CI Pipeline](https://github.com/YOUR_ORG/polyglot-cloud-migration/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/polyglot-cloud-migration/actions/workflows/ci.yml)

> ADCS-IV Semester Project — Air University, Islamabad

A three-tier polyglot application deployed with a fully automated DevOps pipeline:
**React frontend → .NET API → Python worker → Redis**, running on AWS via Terraform, CI with GitHub Actions, and CD with Jenkins.

---

## Team Members

| Name | Role |
|------|------|
| Member 1 | Backend (.NET) + Terraform |
| Member 2 | Frontend (React) + GitHub Actions |
| Member 3 | Python Worker + Jenkins |

---

## Architecture

```
Developer → GitHub → GitHub Actions CI → Docker Hub
                                      ↓
                              Jenkins CD Server
                                      ↓
                          AWS EC2 (via Terraform)
                                      ↓
              Frontend:3000 → .NET API:5000 → Redis → Python Worker
```

See `docs/architecture.mermaid` for the full diagram.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Nginx |
| Backend | ASP.NET Core 8 Web API |
| Worker | Python 3.12 |
| Queue | Redis 7 |
| Containerization | Docker + Docker Compose |
| Orchestration | Docker Swarm |
| Infrastructure | Terraform (AWS) |
| CI | GitHub Actions |
| CD | Jenkins |
| Cloud | AWS EC2 |

---

## Quick Start (Local)

### Prerequisites
- Docker & Docker Compose
- .NET 8 SDK
- Python 3.12
- Node.js 20

### Run with Docker Compose

```bash
git clone https://github.com/YOUR_ORG/polyglot-cloud-migration.git
cd polyglot-cloud-migration
docker compose up --build
```

- Frontend: http://localhost:3000
- API:      http://localhost:5000/api/status
- Swagger:  http://localhost:5000/swagger

### Run with Docker Swarm

```bash
docker swarm init
export DOCKER_USERNAME=yourusername
docker stack deploy -c docker-stack.yml polyglot-app
docker service ls
```

---

## Secrets Used (values NOT stored here)

| Secret | Where Stored | Purpose |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | GitHub Secrets | Terraform AWS auth |
| `AWS_SECRET_ACCESS_KEY` | GitHub Secrets | Terraform AWS auth |
| `DOCKER_USERNAME` | GitHub Secrets | Image push |
| `DOCKER_PASSWORD` | GitHub Secrets | Image push |
| `JENKINS_URL` | GitHub Secrets | CD trigger |
| `JENKINS_USER` | GitHub Secrets | CD trigger |
| `JENKINS_TOKEN` | GitHub Secrets | CD trigger |
| `cloud-vm-ssh-key` | Jenkins Credentials | SSH deploy |
| `cloud-vm-ip` | Jenkins Credentials | Target host |

---

## Terraform

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init
terraform validate
terraform plan
terraform apply
# To destroy:
terraform destroy
```

---

## Final Demo Steps

1. Open live cloud URL in browser
2. Note the current banner text/color
3. Create a new branch: `git checkout -b fix/frontend-demo-change`
4. Change `BANNER_COLOR` or `BANNER_TEXT` in `frontend-js/src/App.jsx`
5. Commit and push
6. Open Pull Request on GitHub
7. Watch GitHub Actions run tests, lint, build, and push images
8. Merge PR after CI passes
9. Watch Jenkins deploy automatically
10. Refresh cloud URL — see the change live

---

## Known Limitations

- No HTTPS (HTTP only for demo)
- In-memory task storage (resets on container restart)
- Single EC2 instance (no HA)

## Cloud URL

> http://44.197.172.176:3000 
test 
