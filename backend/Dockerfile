# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup --gid 1001 --system pythonapp
RUN adduser --uid 1001 --system --gid 1001 pythonapp

# Change ownership of app directory
RUN chown -R pythonapp:pythonapp /app

# Switch to non-root user
USER pythonapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python healthcheck.py

# Start the application
CMD ["python", "main.py"] 