# E-Commerce-Website

## Start Databases

1. Copy env file  
   cp infra/.env.example infra/.env

2. Start Postgres + Redis  
   docker compose -f infra/docker-compose.yml up -d

3. Check containers  
   docker ps
