#!/usr/bin/env python3
"""
Database migration script for the Inventory Management API
"""

import subprocess
import sys
import argparse

def run_migration(action="upgrade", revision="head"):
    """Run database migrations"""
    try:
        if action == "create":
            # Create a new migration
            message = input("Enter migration message: ")
            subprocess.run([
                "alembic", "revision", "--autogenerate", "-m", message
            ], check=True)
        elif action == "upgrade":
            # Apply migrations
            subprocess.run([
                "alembic", "upgrade", revision
            ], check=True)
        elif action == "downgrade":
            # Rollback migrations
            subprocess.run([
                "alembic", "downgrade", revision
            ], check=True)
        else:
            print(f"Unknown action: {action}")
            sys.exit(1)
            
        print(f"Migration {action} completed successfully!")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Database migration tool")
    parser.add_argument("action", choices=["create", "upgrade", "downgrade"], 
                       help="Migration action to perform")
    parser.add_argument("--revision", default="head", 
                       help="Migration revision (default: head)")
    
    args = parser.parse_args()
    run_migration(args.action, args.revision) 