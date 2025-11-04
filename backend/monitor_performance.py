#!/usr/bin/env python3
"""
Performance monitoring script for Amber Global API
Helps diagnose slow backend loading issues
"""

import time
import requests
import json
import sys
from datetime import datetime

class PerformanceMonitor:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
    
    def test_endpoint(self, endpoint, method="GET", data=None, headers=None):
        """Test a specific endpoint and measure response time"""
        url = f"{self.base_url}{endpoint}"
        start_time = time.time()
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            
            response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            result = {
                "endpoint": endpoint,
                "method": method,
                "status_code": response.status_code,
                "response_time_ms": round(response_time, 2),
                "success": response.status_code < 400,
                "timestamp": datetime.now().isoformat()
            }
            
            # Add response size for GET requests
            if method == "GET":
                result["response_size_bytes"] = len(response.content)
            
            return result
            
        except requests.exceptions.Timeout:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": None,
                "response_time_ms": 30000,  # 30 second timeout
                "success": False,
                "error": "Timeout",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": None,
                "response_time_ms": None,
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def run_performance_test(self):
        """Run comprehensive performance tests"""
        print(f"🚀 Starting performance test for {self.base_url}")
        print("=" * 60)
        
        # Test basic endpoints
        endpoints_to_test = [
            ("/", "GET"),
            ("/health", "GET"),
            ("/ready", "GET"),
            ("/docs", "GET"),
        ]
        
        for endpoint, method in endpoints_to_test:
            print(f"Testing {method} {endpoint}...")
            result = self.test_endpoint(endpoint, method)
            self.results.append(result)
            
            if result["success"]:
                print(f"  ✅ {result['response_time_ms']}ms")
            else:
                print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")
        
        # Test database-dependent endpoints
        print("\nTesting database-dependent endpoints...")
        db_endpoints = [
            ("/products/", "GET"),
            ("/categories/", "GET"),
            ("/blogs/", "GET"),
        ]
        
        for endpoint, method in db_endpoints:
            print(f"Testing {method} {endpoint}...")
            result = self.test_endpoint(endpoint, method)
            self.results.append(result)
            
            if result["success"]:
                print(f"  ✅ {result['response_time_ms']}ms")
            else:
                print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")
        
        self.print_summary()
    
    def print_summary(self):
        """Print performance summary"""
        print("\n" + "=" * 60)
        print("📊 PERFORMANCE SUMMARY")
        print("=" * 60)
        
        successful_tests = [r for r in self.results if r["success"]]
        failed_tests = [r for r in self.results if not r["success"]]
        
        if successful_tests:
            avg_response_time = sum(r["response_time_ms"] for r in successful_tests) / len(successful_tests)
            fastest = min(successful_tests, key=lambda x: x["response_time_ms"])
            slowest = max(successful_tests, key=lambda x: x["response_time_ms"])
            
            print(f"✅ Successful requests: {len(successful_tests)}/{len(self.results)}")
            print(f"📈 Average response time: {avg_response_time:.2f}ms")
            print(f"⚡ Fastest: {fastest['endpoint']} ({fastest['response_time_ms']}ms)")
            print(f"🐌 Slowest: {slowest['endpoint']} ({slowest['response_time_ms']}ms)")
            
            # Performance recommendations
            if avg_response_time > 1000:
                print("\n⚠️  PERFORMANCE ISSUES DETECTED:")
                print("   - Average response time > 1 second")
                print("   - Consider database optimization")
                print("   - Check for slow queries")
            elif avg_response_time > 500:
                print("\n⚠️  MODERATE SLOWNESS:")
                print("   - Average response time > 500ms")
                print("   - Consider connection pooling")
                print("   - Check database indexes")
            else:
                print("\n✅ Good performance!")
        
        if failed_tests:
            print(f"\n❌ Failed requests: {len(failed_tests)}")
            for test in failed_tests:
                print(f"   - {test['method']} {test['endpoint']}: {test.get('error', 'Unknown error')}")
    
    def save_results(self, filename="performance_results.json"):
        """Save test results to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"\n💾 Results saved to {filename}")

def main():
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://localhost:8000"
    
    monitor = PerformanceMonitor(base_url)
    
    try:
        monitor.run_performance_test()
        monitor.save_results()
    except KeyboardInterrupt:
        print("\n\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")

if __name__ == "__main__":
    main()
