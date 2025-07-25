#!/usr/bin/env python3
"""
Health check script for the Python FastAPI application
"""

import sys
import requests
import os

def health_check():
    """Perform health check on the application"""
    try:
        port = os.getenv('PORT', '3000')
        url = f'http://localhost:{port}/health'
        
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'healthy':
                print("Health check passed")
                return True
        
        print(f"Health check failed: {response.status_code}")
        return False
        
    except requests.exceptions.RequestException as e:
        print(f"Health check failed: {e}")
        return False

if __name__ == "__main__":
    if health_check():
        sys.exit(0)
    else:
        sys.exit(1) 