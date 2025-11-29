## 🚀 Start Database & Cache

### 1. Copy the environment file
cp infra/.env.example infra/.env

### 2. Start Postgres + Redis
docker compose -f infra/docker-compose.yml up -d

### 3. Check running containers
docker ps
