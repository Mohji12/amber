#!/usr/bin/env python3
"""
Check Hardware Images Script
This script checks what hardware images are available in S3.
"""

import sys
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

def get_s3_client():
    """Initialize S3 client"""
    try:
        s3_client = boto3.client('s3')
        # Test credentials
        s3_client.head_bucket(Bucket='jgi-menteetracker')
        print("✅ S3 credentials verified successfully!")
        return s3_client
    except NoCredentialsError:
        print("❌ AWS credentials not found!")
        print("Please run: aws configure")
        return None
    except ClientError as e:
        print(f"❌ S3 access error: {e}")
        return None

def list_hardware_images(s3_client):
    """List all hardware images in S3"""
    bucket_name = "jgi-menteetracker"
    
    print(f"\n🔍 Listing hardware images in S3...")
    print(f"Bucket: {bucket_name}")
    print(f"Prefix: Amber/New folder/Hardware/")
    
    try:
        # List objects with the hardware prefix
        response = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Prefix="Amber/New folder/Hardware/"
        )
        
        if 'Contents' in response:
            print(f"\n📋 Found {len(response['Contents'])} hardware images:")
            for obj in response['Contents']:
                key = obj['Key']
                size = obj['Size']
                print(f"   - {key} ({size} bytes)")
        else:
            print("❌ No hardware images found!")
            
    except Exception as e:
        print(f"❌ Error listing hardware images: {e}")

def check_specific_hardware_images(s3_client):
    """Check specific hardware image paths"""
    bucket_name = "jgi-menteetracker"
    
    print(f"\n🔍 Checking specific hardware image paths...")
    
    # Test different variations of the file names
    test_paths = [
        "Amber/New folder/Hardware/Bathroom+Fittings.jpeg",
        "Amber/New folder/Hardware/Bathroom Fittings.jpeg",
        "Amber/New folder/Hardware/Bathroom_Fittings.jpeg",
        "Amber/New folder/Hardware/Door+Handles.jpg",
        "Amber/New folder/Hardware/Door Handles.jpg",
        "Amber/New folder/Hardware/Door_Handles.jpg",
        "Amber/New folder/Hardware/Hinge.JPG",
        "Amber/New folder/Hardware/Hinges.JPG",
        "Amber/New folder/Hardware/Pipes.jpeg",
        "Amber/New folder/Hardware/Pipe.jpeg"
    ]
    
    for path in test_paths:
        try:
            s3_client.head_object(Bucket=bucket_name, Key=path)
            print(f"✅ Found: {path}")
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                print(f"❌ Missing: {path}")
            else:
                print(f"⚠️ Error checking {path}: {e}")

def main():
    """Main function to check hardware images"""
    print("🚀 Starting Hardware Image Check...")
    
    # Initialize S3 client
    s3_client = get_s3_client()
    if not s3_client:
        return False
    
    # List all hardware images
    list_hardware_images(s3_client)
    
    # Check specific paths
    check_specific_hardware_images(s3_client)
    
    print("\n🎉 Hardware image check completed!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
