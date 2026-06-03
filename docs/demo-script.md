# Final Demo Script

## Before the Demo

- [ ] Cloud VM is running (`terraform apply` already done)
- [ ] All services are deployed and reachable
- [ ] Jenkins is running and connected
- [ ] Open browser tabs: cloud URL, GitHub repo, Jenkins dashboard

---

## Step-by-Step Demo

### 1. Show the live application
- Open `http://YOUR_VM_IP:3000` in the browser
- Point out the banner color and text (e.g. blue, "Polyglot Cloud Migration — Live")
- Show the API status card (should say HEALTHY)

### 2. Show the API directly
- Visit `http://YOUR_VM_IP:5000/api/status`
- Show the JSON response with version and timestamp

### 3. Create a demo change branch
```bash
git checkout main
git pull
git checkout -b fix/frontend-demo-change
```

### 4. Make a visible change
Open `frontend-js/src/App.jsx` and change:
```js
const BANNER_COLOR  = "#0ea5e9";   // change to "#16a34a" (green) or "#dc2626" (red)
const BANNER_TEXT   = "Polyglot Cloud Migration — UPDATED v2";
```

### 5. Commit and push
```bash
git add frontend-js/src/App.jsx
git commit -m "feat: update banner color and text for demo"
git push origin fix/frontend-demo-change
```

### 6. Open a Pull Request
- Go to GitHub, click "Compare & pull request"
- Show the PR description

### 7. Watch GitHub Actions CI
- Click on the Actions tab
- Show: test-backend, test-worker, test-frontend running
- Show: build-and-push running after tests pass
- Show: images pushed to Docker Hub

### 8. Merge the PR
- Click "Merge pull request" after CI is green
- Show the merge commit on main

### 9. Watch Jenkins CD
- Open Jenkins dashboard
- Show the `polyglot-deploy` job triggering automatically
- Walk through stages: Checkout → Pull Images → Copy Deploy Files → Deploy → Health Check

### 10. Show the live change
- Refresh `http://YOUR_VM_IP:3000`
- The banner is now GREEN (or whatever color you changed to)
- The text now says "UPDATED v2"

### 11. Infrastructure reproducibility
```bash
cd infra
terraform destroy -auto-approve
# Wait for VM to be terminated
terraform apply -auto-approve
# Show new IP in outputs
```
- Redeploy using Jenkins or the deploy script
- Show the app is back up at the new IP

---

## Talking Points

- "Every push goes through automated tests — no human can merge broken code"
- "Docker images are built once and promoted through environments"
- "Terraform ensures the infrastructure is reproducible — destroy and recreate in minutes"
- "No secrets are hardcoded anywhere in the repository"
