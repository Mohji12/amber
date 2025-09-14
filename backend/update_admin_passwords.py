#!/usr/bin/env python3
"""
Admin Password Update Script
Updates admin passwords and removes default accounts
"""

import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    """Get database connection"""
    try:
        connection = mysql.connector.connect(
            host='amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com',
            port=int(os.getenv('MYSQL_PORT', '3306')),
            user='admin',
            password=os.getenv('MYSQL_ROOT_PASSWORD', 'Amberglobaltrade2424'),
            database=os.getenv('MYSQL_DATABASE', 'amberdata1')
        )
        return connection
    except mysql.connector.Error as e:
        print(f"❌ Database connection failed: {e}")
        return None

def execute_sql_file(connection, sql_file_path):
    """Execute SQL commands from file"""
    try:
        cursor = connection.cursor()
        
        with open(sql_file_path, 'r') as file:
            sql_content = file.read()
        
        # Split SQL commands by semicolon and execute each
        commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip() and not cmd.strip().startswith('--')]
        
        for command in commands:
            if command:
                try:
                    cursor.execute(command)
                    print(f"✅ Executed: {command[:50]}...")
                except mysql.connector.Error as e:
                    print(f"⚠️ Warning executing command: {e}")
                    continue
        
        connection.commit()
        cursor.close()
        print("✅ All SQL commands executed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error executing SQL file: {e}")
        return False

def verify_admins(connection):
    """Verify admin accounts"""
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT username, email, full_name, role, is_super_admin, is_active, created_at
            FROM admins 
            ORDER BY created_at DESC
        """)
        
        admins = cursor.fetchall()
        cursor.close()
        
        print("\n=== CURRENT ADMIN ACCOUNTS ===")
        for admin in admins:
            status = "✅ ACTIVE" if admin['is_active'] else "❌ INACTIVE"
            super_admin = "🔥 SUPER ADMIN" if admin['is_super_admin'] else "👤 ADMIN"
            print(f"{status} {super_admin}")
            print(f"   Username: {admin['username']}")
            print(f"   Email: {admin['email']}")
            print(f"   Full Name: {admin['full_name']}")
            print(f"   Role: {admin['role']}")
            print(f"   Created: {admin['created_at']}")
            print()
        
        return len(admins)
        
    except Exception as e:
        print(f"❌ Error verifying admins: {e}")
        return 0

def main():
    """Main function"""
    print("=== AMBER GLOBAL ADMIN PASSWORD UPDATE ===\n")
    
    # Connect to database
    print("🔗 Connecting to database...")
    connection = get_db_connection()
    if not connection:
        print("❌ Cannot proceed without database connection")
        return
    
    print("✅ Database connected successfully!\n")
    
    # Execute admin management SQL
    print("🔄 Updating admin accounts...")
    sql_file = "admin_management.sql"
    
    if not os.path.exists(sql_file):
        print(f"❌ SQL file '{sql_file}' not found!")
        connection.close()
        return
    
    if execute_sql_file(connection, sql_file):
        print("✅ Admin accounts updated successfully!\n")
    else:
        print("❌ Failed to update admin accounts")
        connection.close()
        return
    
    # Verify the changes
    print("🔍 Verifying admin accounts...")
    admin_count = verify_admins(connection)
    
    connection.close()
    
    print(f"✅ Setup complete! {admin_count} admin accounts configured.\n")
    
    print("=== NEW ADMIN CREDENTIALS ===")
    print("🔥 SUPER ADMIN:")
    print("   Username: amber_admin")
    print("   Password: AmberAdmin2024!@#")
    print("   Email: admin@amber-global.com")
    print()
    print("👤 CONTENT MANAGER:")
    print("   Username: content_manager")
    print("   Password: ContentMgr2024!")
    print("   Email: content@amber-global.com")
    print()
    print("👤 USER SUPPORT:")
    print("   Username: user_support")
    print("   Password: UserSupport2024!")
    print("   Email: support@amber-global.com")
    print()
    print("🚀 Login at: http://localhost:8000/admin/login")
    print("📖 API Docs: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
