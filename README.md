# Inventory Management System

A complete, production-ready inventory management system built with **Python FastAPI**, **PostgreSQL**, and **React**. This project follows **Clean Architecture** principles for maintainability, testability, and scalability.

## 🚀 Features

- **FastAPI Backend**: High-performance, modern Python web framework
- **React Frontend**: Modern, responsive user interface
- **Authentication System**: JWT-based user registration and login
- **Product Management**: Create, read, update product inventory with real-time updates
- **Database Migrations**: Alembic migrations for database schema management
- **API Documentation**: Automatic interactive Swagger/OpenAPI documentation
- **Input Validation**: Comprehensive request validation with Pydantic
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: JWT authentication, CORS protection, input sanitization
- **Containerization**: Docker and Docker Compose setup for easy deployment
- **Clean Architecture**: Clear separation of concerns across layers

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API service layer
└── backend/                 # Python FastAPI application
    └── src/
        ├── domain/          # Business entities and repository interfaces
        ├── application/     # Use cases and business logic
        ├── infrastructure/  # Database models and repository implementations
        └── interface/       # Controllers, routes, and middleware
```

### Layer Dependencies
- **Domain**: No dependencies (pure business logic)
- **Application**: Depends only on Domain
- **Infrastructure**: Depends on Domain and Application
- **Interface**: Depends on Application and Infrastructure

## 🛠️ Tech Stack

### Backend
- **Runtime**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy with async support
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: passlib with bcrypt
- **Validation**: Pydantic
- **Documentation**: Automatic with FastAPI

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: React Context
- **UI Components**: Lucide React Icons

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15

## 📋 Prerequisites

- **Python 3.11** or higher
- **Node.js 16** or higher
- **Docker and Docker Compose** (recommended)
- **PostgreSQL** (if running locally without Docker)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone and start the application**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   docker-compose up --build
   ```

2. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/docs
   - **API Health Check**: http://localhost:3000/health

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb inventory_db
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**
   ```bash
   python main.py
   # Or for development with auto-reload:
   python scripts/run_dev.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get JWT token

### Products (Protected by JWT)
- `POST /products` - Create a new product
- `GET /products` - Get all products with pagination
- `PUT /products/{id}/quantity` - Update product quantity

### Health & Documentation
- `GET /health` - API health status
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. All product endpoints require authentication.

### Getting Started
1. **Register a new user** via the frontend or API
2. **Login** to receive a JWT token
3. **Use the token** in the Authorization header for protected endpoints

### API Usage Example
   ```bash
# Register a user
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "password123"}'

# Login to get token
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "password123"}'

# Use token for protected endpoints
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## 🗄️ Database Management

### Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migrations:
```bash
alembic downgrade -1
```

### Using Migration Scripts

```bash
# Create a new migration
python scripts/migrate.py create

# Apply all pending migrations
python scripts/migrate.py upgrade

# Rollback last migration
python scripts/migrate.py downgrade --revision -1
```

## 🧪 Testing

### Backend Tests
```bash
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📄 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐳 Docker Commands

### Development
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build app
```

### Production
```bash
# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

## 📖 API Documentation

FastAPI automatically generates comprehensive API documentation:

- **Swagger UI**: http://localhost:3000/docs
  - Interactive API testing interface
  - Request/response examples
  - Authentication testing

- **ReDoc**: http://localhost:3000/redoc
  - Clean, readable documentation
  - Better for API reference

## 🔧 Development

### Backend Development
- The FastAPI server supports hot reloading
- Changes to Python files automatically restart the server
- Use `python scripts/run_dev.py` for development mode

### Frontend Development
- Vite provides fast hot module replacement
- Changes reflect immediately in the browser
- Tailwind CSS for rapid UI development

### Code Quality
```bash
# Backend linting (if configured)
flake8 src/

# Frontend linting
cd frontend && npm run lint

# Format code
cd frontend && npm run format
```

## 🚀 Deployment

### Using Docker
1. Build production images
2. Set production environment variables
3. Deploy using docker-compose or Kubernetes

### Manual Deployment
1. Set up Python 3.11+ environment
2. Install dependencies: `pip install -r requirements.txt`
3. Set production environment variables
4. Run migrations: `alembic upgrade head`
5. Start with a production WSGI server: `uvicorn main:app --host 0.0.0.0 --port 3000`

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Password Hashing** using bcrypt
- **Input Validation** with Pydantic models
- **CORS Protection** for frontend integration
- **SQL Injection Prevention** through SQLAlchemy ORM
- **Rate Limiting** (configurable)

## 📱 Features Overview

### User Management
- User registration and login
- JWT-based session management
- Secure password storage

### Product Management
- Add new products with details (name, SKU, price, quantity)
- View products with pagination
- Update product quantities
- Product image support
- Search and filter capabilities

### Dashboard
- Real-time inventory overview
- Product statistics
- Recent activity tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database credentials

**Frontend Not Loading**
- Check if backend is running on port 3000
- Verify CORS configuration
- Check browser console for errors

**Authentication Issues**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper Authorization header format

### Getting Help

- Check the [API Documentation](http://localhost:3000/docs)
- Review the application logs
- Open an issue on GitHub

---

Built with ❤️ using Python FastAPI and React 