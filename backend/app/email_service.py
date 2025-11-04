import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os

class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.zeptomail.in"
        self.username = "emailapikey"
        self.password = "PHtE6r0ORezsjTEm90IG5f+6RJKlNtkprugyLlJF4ttGAvAFH01Uo4oulmCx+R0iUqMWQaLPy906ubycsrrRIm+5YDtOVGqyqK3sx/VYSPOZsbq6x00UuF8TcEzYVILvc95s1iTSv9aX"
        self.port = 587  # Using TLS port
        self.sender_email = "info@amberglobaltrade.com"  # Update this with your verified sender email
        
    def generate_otp(self, length=6):
        """Generate a random OTP code"""
        return ''.join(random.choices(string.digits, k=length))
    
    def create_otp_email_html(self, otp_code, user_name):
        """Create HTML email template for OTP"""
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }}
                .container {{
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }}
                .otp-box {{
                    background-color: #3498db;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 5px;
                }}
                .footer {{
                    margin-top: 30px;
                    text-align: center;
                    color: #7f8c8d;
                    font-size: 12px;
                }}
                .warning {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Amber Import</div>
                    <h2>Email Verification</h2>
                </div>
                
                <p>Hello {user_name},</p>
                
                <p>Thank you for signing up with Amber Import! To complete your registration, please use the verification code below:</p>
                
                <div class="otp-box">
                    {otp_code}
                </div>
                
                <p>This verification code will expire in <strong>5 minutes</strong>.</p>
                
                <div class="warning">
                    <strong>Important:</strong> Never share this code with anyone. Our team will never ask for your verification code.
                </div>
                
                <p>If you didn't create an account with us, please ignore this email.</p>
                
                <p>Best regards,<br>The Amber Import Team</p>
                
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2024 Amber Import. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_content
    
    def send_otp_email(self, to_email, otp_code, user_name):
        """Send OTP email using Zoho Zepto SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.sender_email
            msg['To'] = to_email
            msg['Subject'] = "Email Verification - Amber Import"
            
            # Create HTML content
            html_content = self.create_otp_email_html(otp_code, user_name)
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Connect to SMTP server
            server = smtplib.SMTP(self.smtp_server, self.port)
            server.starttls()  # Enable TLS
            server.login(self.username, self.password)
            
            # Send email
            text = msg.as_string()
            server.sendmail(self.sender_email, to_email, text)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    def create_password_reset_email_html(self, otp_code, user_name):
        """Create HTML email template for password reset"""
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Amber Import</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f8f9fa;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .otp-box {{
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    border: 2px solid #10b981;
                    border-radius: 12px;
                    padding: 25px;
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-code {{
                    font-size: 32px;
                    font-weight: bold;
                    color: #059669;
                    letter-spacing: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                }}
                .info {{
                    background-color: #f8f9fa;
                    border-left: 4px solid #10b981;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 0 8px 8px 0;
                }}
                .footer {{
                    background-color: #f8f9fa;
                    padding: 20px 30px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    margin: 20px 0;
                }}
                .warning {{
                    background-color: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #92400e;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset</h1>
                    <p>Amber Global Export-Import Platform</p>
                </div>
                
                <div class="content">
                    <h2>Hello {user_name}!</h2>
                    <p>We received a request to reset your password. Use the verification code below to complete your password reset:</p>
                    
                    <div class="otp-box">
                        <h3>Your Password Reset Code</h3>
                        <div class="otp-code">{otp_code}</div>
                        <p><strong>This code expires in 5 minutes</strong></p>
                    </div>
                    
                    <div class="info">
                        <h4>📋 Instructions:</h4>
                        <ol>
                            <li>Enter this code in the password reset form</li>
                            <li>Create a new strong password</li>
                            <li>Confirm your new password</li>
                        </ol>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong>
                        <ul>
                            <li>This code is valid for 5 minutes only</li>
                            <li>Never share this code with anyone</li>
                            <li>If you didn't request this reset, please ignore this email</li>
                        </ul>
                    </div>
                    
                    <p>If you have any questions, please contact our support team.</p>
                    
                    <p>Best regards,<br>
                    <strong>The Amber Global Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>© 2024 Amber Global. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_content

    def send_password_reset_email(self, to_email, otp_code, user_name):
        """Send password reset email using Zoho Zepto SMTP"""
        try:
            msg = MIMEMultipart('alternative')
            msg['From'] = self.sender_email
            msg['To'] = to_email
            msg['Subject'] = "Password Reset - Amber Import"
            html_content = self.create_password_reset_email_html(otp_code, user_name)
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            server = smtplib.SMTP(self.smtp_server, self.port)
            server.starttls()
            server.login(self.username, self.password)
            server.sendmail(self.sender_email, to_email, msg.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"Error sending password reset email: {str(e)}")
            return False

# Create a global instance
email_service = EmailService() 