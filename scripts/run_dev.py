#!/usr/bin/env python3
"""
Development runner script for the Inventory Management API
"""

import subprocess
import sys
import os

def run_dev():
    """Run the application in development mode"""
    os.environ["NODE_ENV"] = "development"
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0",
            "--port", "3000",
            "--reload",
            "--log-level", "info"
        ], check=True)
    except KeyboardInterrupt:
        print("\nShutting down development server...")
    except subprocess.CalledProcessError as e:
        print(f"Error running development server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_dev() 