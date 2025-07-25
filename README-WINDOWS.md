# 🖥️ Windows Setup Guide - Inventory Pro

Complete setup guide for running **Inventory Pro** (Python FastAPI + React) on Windows systems.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Docker - Recommended)](#quick-start-docker---recommended)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Windows-Specific Notes](#windows-specific-notes)

## 🛠️ Prerequisites

### Required Software

1. **Python 3.11+**
   ```powershell
   # Download from: https://www.python.org/downloads/
   # Or install via Microsoft Store
   # Or use Chocolatey:
   choco install python
   ```

2. **Node.js 18+**
   ```powershell
   # Download from: https://nodejs.org/
   # Or use Chocolatey:
   choco install nodejs
   ```

3. **Docker Desktop for Windows**
   ```powershell
   # Download from: https://www.docker.com/products/docker-desktop
   # Or use Chocolatey:
   choco install docker-desktop
   ```

4. **Git for Windows**
   ```powershell
   # Download from: https://git-scm.com/download/win
   # Or use Chocolatey:
   choco install git
   ```

### Optional (Recommended)

- **Windows Terminal** (for better command line experience)
- **Visual Studio Code** with Python and React extensions
- **PostgreSQL** (if running database locally)

## 🚀 Quick Start (Docker - Recommended)

### 1. Clone the Repository
```powershell
git clone <your-repository-url>
cd inventory-pro
```

### 2. Setup Environment
```powershell
# Copy environment template
copy env.example .env

# Edit .env file with your settings (use notepad or VS Code)
notepad .env
```

### 3. Run with Docker
```powershell
# Start all services (backend + database)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Start Frontend (Separate Terminal)
```powershell
# Open new PowerShell/CMD window
cd frontend
npm install
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/docs

## 💻 Local Development Setup

### Backend Setup (Python FastAPI)

1. **Create Virtual Environment**
   ```powershell
   # Navigate to project root
   cd inventory-pro

   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # PowerShell:
   .\venv\Scripts\Activate.ps1
   # CMD:
   venv\Scripts\activate.bat
   ```

2. **Install Dependencies**
   ```powershell
   # Ensure virtual environment is activated
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Setup Database (PostgreSQL)**
   ```powershell
   # Option 1: Use Docker for database only
   docker-compose up -d db

   # Option 2: Install PostgreSQL locally
   # Download from: https://www.postgresql.org/download/windows/
   ```

4. **Database Migrations**
   ```powershell
   # Initialize Alembic (if needed)
   python -m alembic init alembic

   # Create migration
   python scripts/migrate.py create "Initial migration"

   # Apply migrations
   python scripts/migrate.py upgrade
   ```

### Frontend Setup (React + Vite)

1. **Install Dependencies**
   ```powershell
   cd frontend
   npm install
   ```

2. **Development Server**
   ```powershell
   npm run dev
   ```

## ⚙️ Environment Configuration

### Backend Environment (.env)
```env
# Database Configuration
DATABASE_URL=postgresql://inventory_user:inventory_pass@localhost:5433/inventory_db
DB_HOST=localhost
DB_PORT=5433
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASSWORD=inventory_pass

# Security
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS (for development)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Docker Environment
```yaml
# docker-compose.yml is pre-configured
# Modify ports if needed:
services:
  app:
    ports:
      - "3000:3000"  # Backend port
  db:
    ports:
      - "5433:5432"  # Database port
```

## 🎯 Running the Application

### Method 1: Docker (Recommended)
```powershell
# Terminal 1: Backend + Database
docker-compose up

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Method 2: Local Development
```powershell
# Terminal 1: Database
docker-compose up -d db

# Terminal 2: Backend
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Method 3: Development Scripts
```powershell
# Backend development server
python scripts/run_dev.py

# Frontend (separate terminal)
cd frontend
npm run dev
```

## 🔄 Development Workflow

### Backend Development
```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run development server (auto-reload)
python main.py

# Create new migration
python scripts/migrate.py create "Description of changes"

# Apply migrations
python scripts/migrate.py upgrade

# Run tests
pytest

# Format code
black .
isort .
```

### Frontend Development
```powershell
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

## 🐛 Troubleshooting

### Common Windows Issues

#### 1. PowerShell Execution Policy
```powershell
# If you get execution policy errors:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. Python Virtual Environment Issues
```powershell
# If activation fails, try:
python -m venv venv --clear
.\venv\Scripts\Activate.ps1

# Alternative activation:
venv\Scripts\activate.bat
```

#### 3. Docker Issues
```powershell
# Ensure Docker Desktop is running
# Check Docker status:
docker --version
docker-compose --version

# Reset Docker if needed:
docker system prune -a
```

#### 4. Port Conflicts
```powershell
# Check what's using a port:
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :5433

# Kill process using port:
taskkill /PID <process-id> /F
```

#### 5. Database Connection Issues
```powershell
# Check if database is running:
docker-compose ps

# View database logs:
docker-compose logs db

# Connect to database directly:
docker-compose exec db psql -U inventory_user -d inventory_db
```

#### 6. Node.js/npm Issues
```powershell
# Clear npm cache:
npm cache clean --force

# Delete node_modules and reinstall:
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
```

#### 7. Python Package Issues
```powershell
# Upgrade pip:
python -m pip install --upgrade pip

# Reinstall all packages:
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

### Performance Tips

1. **Use Windows Terminal** for better performance
2. **Exclude project folders** from Windows Defender real-time scanning:
   - Add `inventory-pro` folder to exclusions
   - Add `node_modules` to exclusions
3. **Use SSD** for better Docker performance
4. **Allocate more resources** to Docker Desktop if needed

## 🪟 Windows-Specific Notes

### File Paths
- Use forward slashes (`/`) or escaped backslashes (`\\`) in configuration
- Environment variables in `.env` should not have spaces around `=`

### Line Endings
```powershell
# Configure git for Windows line endings:
git config --global core.autocrlf true
```

### Antivirus
- Add project folder to antivirus exclusions for better performance
- Especially important for `node_modules` and `venv` folders

### WSL2 Alternative
If you prefer using WSL2 (Windows Subsystem for Linux):

```powershell
# Install WSL2
wsl --install

# Use Ubuntu/Debian commands instead of Windows commands
# Follow the Linux setup instructions within WSL2
```

## 📞 Support

### Logs and Debugging
```powershell
# Backend logs
docker-compose logs app

# Database logs
docker-compose logs db

# Frontend logs (check browser console)
# Or check terminal where npm run dev is running
```

### Check Service Status
```powershell
# Backend health check
curl http://localhost:3000/health

# Frontend check
curl http://localhost:5173

# Database check
docker-compose exec db pg_isready -U inventory_user
```

## 🎉 Success!

If everything is working correctly, you should see:

1. ✅ **Backend**: `{"status":"healthy","message":"API is running"}` at http://localhost:3000/health
2. ✅ **Frontend**: Beautiful glassmorphism UI at http://localhost:5173
3. ✅ **Database**: Connected and migrations applied
4. ✅ **API Docs**: Interactive documentation at http://localhost:3000/docs

## 🌟 Features

Your **Inventory Pro** application includes:

- 🎨 **Modern Glassmorphism UI** with purple/pink gradients
- 🔐 **JWT Authentication** with secure login/register
- 📊 **Real-time Dashboard** with beautiful stats cards
- 📦 **Product Management** with full CRUD operations
- 🗃️ **PostgreSQL Database** with Alembic migrations
- 📚 **Auto-generated API Documentation** with FastAPI
- 🚀 **Docker Support** for easy deployment
- 📱 **Responsive Design** that works on all devices

---

**Happy coding! 🚀** 

If you encounter any issues not covered in this guide, please check the main README.md or create an issue in the repository. 