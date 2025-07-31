# 🚀 Deployment Guide

This guide covers multiple deployment options for your Inventory Management App (FastAPI + React + PostgreSQL).

## 🌟 Option 1: Railway (Recommended)

Railway is modern, developer-friendly, and perfect for full-stack applications.

### Steps:
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub** repository
3. **Create a new project** from your repo
4. **Add PostgreSQL database**:
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`
5. **Configure environment variables**:
   ```
   ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   PORT=3000
   ```
6. **Deploy**: Railway will auto-deploy from your `main` branch

**Cost**: Free tier with $5/month credit, then pay-as-you-go

---

## 🎨 Option 2: Render

Great for full-stack apps with free PostgreSQL database.

### Steps:
1. **Sign up** at [render.com](https://render.com)
2. **Connect your GitHub** repository
3. **Create services**:
   - **Database**: Create PostgreSQL database first
   - **Backend**: Create Web Service using Docker
   - **Frontend**: Create Static Site
4. **Use the included `render.yaml`** for automatic setup
5. **Manual setup** (alternative):
   - Backend: Docker, Health Check: `/health`
   - Frontend: Build Command: `cd frontend && npm ci && npm run build`

**Cost**: Free tier available (with limitations)

---

## ☁️ Option 3: DigitalOcean App Platform

Reliable and scalable managed container platform.

### Steps:
1. **Sign up** at [digitalocean.com](https://digitalocean.com)
2. **Create App** from GitHub repo
3. **Add components**:
   - **API**: Backend (Docker)
   - **Static Site**: Frontend
   - **Database**: PostgreSQL
4. **Configure environment variables**
5. **Deploy**

**Cost**: ~$12/month for basic setup

---

## 🔧 Option 4: Manual VPS Deployment

For more control, deploy on a VPS (DigitalOcean, Linode, etc.).

### Steps:
1. **Create VPS** (Ubuntu 22.04 recommended)
2. **Install Docker & Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
3. **Clone repository**:
   ```bash
   git clone <your-repo-url>
   cd inventory-management-app
   ```
4. **Set up environment**:
   ```bash
   cp backend/env.example .env
   # Edit .env with production values
   ```
5. **Deploy with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
6. **Set up reverse proxy** (Nginx) for custom domain
7. **Set up SSL** with Let's Encrypt

**Cost**: $5-20/month depending on VPS size

---

## 🔐 Production Environment Variables

Make sure to set these for production:

```bash
ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
PORT=3000
```

## 📝 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Frontend built and optimized
- [ ] Health checks working
- [ ] Security headers configured
- [ ] CORS properly set up
- [ ] Logging configured

## 🚀 Quick Start (Railway)

The fastest way to deploy:

1. **Push to GitHub** if not already done
2. **Go to [railway.app](https://railway.app)**
3. **"Deploy from GitHub"**
4. **Add PostgreSQL service**
5. **Set environment variables**
6. **Deploy!**

Your app will be live in minutes! 🎉

---

**Need help?** Check the platform-specific documentation or create an issue in your repository. 