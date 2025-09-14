#!/usr/bin/env python3
"""
Quick startup script for Amber Global API
Optimizes startup time and provides status monitoring
"""

import os
import sys
import time
import subprocess
import signal
from pathlib import Path

class QuickStart:
    def __init__(self):
        self.process = None
        self.start_time = None
        
    def check_dependencies(self):
        """Check if required dependencies are available"""
        print("🔍 Checking dependencies...")
        
        required_files = [
            "app/main.py",
            "app/database.py",
            "requirements.txt"
        ]
        
        missing_files = []
        for file_path in required_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            print(f"❌ Missing required files: {missing_files}")
            return False
        
        print("✅ All required files found")
        return True
    
    def check_database_connection(self):
        """Check database connectivity"""
        print("🔍 Checking database connection...")
        
        try:
            # Import database module
            sys.path.append('.')
            from app.database import engine
            
            # Test connection
            with engine.connect() as conn:
                result = conn.execute("SELECT 1")
                print("✅ Database connection successful")
                return True
                
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            print("💡 Make sure MySQL is running and accessible")
            return False
    
    def start_backend(self, host="0.0.0.0", port=8000, workers=1):
        """Start the backend server with optimizations"""
        print(f"🚀 Starting backend server on {host}:{port}")
        
        # Environment variables for performance
        env = os.environ.copy()
        env.update({
            "PYTHONUNBUFFERED": "1",
            "PYTHONDONTWRITEBYTECODE": "1",
            "ENVIRONMENT": "development"
        })
        
        # Uvicorn command with optimizations
        cmd = [
            sys.executable, "-m", "uvicorn",
            "app.main:app",
            "--host", host,
            "--port", str(port),
            "--workers", str(workers),
            "--reload",  # Enable auto-reload for development
            "--log-level", "info",
            "--access-log",  # Enable access logging
            "--timeout-keep-alive", "30",  # Reduce keep-alive timeout
            "--limit-concurrency", "1000",  # Limit concurrent connections
            "--limit-max-requests", "10000"  # Restart workers after max requests
        ]
        
        try:
            self.start_time = time.time()
            self.process = subprocess.Popen(
                cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            print(f"✅ Backend started with PID: {self.process.pid}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
            return False
    
    def monitor_startup(self, timeout=60):
        """Monitor startup progress"""
        print("📊 Monitoring startup progress...")
        
        start_time = time.time()
        health_check_url = "http://localhost:8000/ready"
        
        while time.time() - start_time < timeout:
            try:
                import requests
                response = requests.get(health_check_url, timeout=5)
                if response.status_code == 200:
                    startup_time = time.time() - start_time
                    print(f"✅ Backend ready in {startup_time:.2f} seconds!")
                    return True
            except:
                pass
            
            # Show progress
            elapsed = time.time() - start_time
            print(f"⏳ Still starting... ({elapsed:.1f}s elapsed)")
            time.sleep(2)
        
        print("⏰ Startup timeout reached")
        return False
    
    def show_status(self):
        """Show current backend status"""
        if not self.process:
            print("❌ Backend not running")
            return
        
        try:
            # Check if process is still running
            if self.process.poll() is None:
                uptime = time.time() - self.start_time if self.start_time else 0
                print(f"✅ Backend running (PID: {self.process.pid}, Uptime: {uptime:.1f}s)")
                
                # Check health endpoint
                try:
                    import requests
                    response = requests.get("http://localhost:8000/health", timeout=5)
                    if response.status_code == 200:
                        print("✅ Health check passed")
                    else:
                        print(f"⚠️ Health check failed: {response.status_code}")
                except Exception as e:
                    print(f"❌ Health check error: {e}")
            else:
                print(f"❌ Backend stopped (exit code: {self.process.returncode})")
        except Exception as e:
            print(f"❌ Error checking status: {e}")
    
    def stop_backend(self):
        """Stop the backend server"""
        if self.process:
            print("🛑 Stopping backend server...")
            try:
                self.process.terminate()
                self.process.wait(timeout=10)
                print("✅ Backend stopped gracefully")
            except subprocess.TimeoutExpired:
                print("⚠️ Force killing backend...")
                self.process.kill()
                print("✅ Backend force stopped")
            self.process = None
    
    def cleanup(self):
        """Cleanup resources"""
        self.stop_backend()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()

def main():
    """Main function"""
    print("🚀 Amber Global API Quick Start")
    print("=" * 40)
    
    with QuickStart() as quick_start:
        # Check dependencies
        if not quick_start.check_dependencies():
            sys.exit(1)
        
        # Check database
        if not quick_start.check_database_connection():
            print("💡 You can still start the backend, but database features may not work")
            response = input("Continue anyway? (y/N): ")
            if response.lower() != 'y':
                sys.exit(1)
        
        # Start backend
        if not quick_start.start_backend():
            sys.exit(1)
        
        # Monitor startup
        if not quick_start.monitor_startup():
            print("❌ Backend failed to start properly")
            sys.exit(1)
        
        print("\n🎉 Backend is ready!")
        print("📱 API available at: http://localhost:8000")
        print("📚 Documentation at: http://localhost:8000/docs")
        print("💡 Press Ctrl+C to stop")
        
        try:
            # Keep running and show status
            while True:
                time.sleep(30)
                quick_start.show_status()
        except KeyboardInterrupt:
            print("\n👋 Shutting down...")

if __name__ == "__main__":
    main()
