import smtplib
import ssl
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings

def _send_sync(to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    host = settings.SMTP_HOST.strip() if settings.SMTP_HOST else ""
    user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    pwd = settings.SMTP_PASSWORD.strip() if settings.SMTP_PASSWORD else ""

    # Auto-detect Gmail host if user provides a Gmail address
    if not host and user and "gmail" in user.lower():
        host = "smtp.gmail.com"

    if not host or not user or not pwd:
        return False

    port = settings.SMTP_PORT or 587
    from_email = settings.SMTP_FROM_EMAIL.strip() if settings.SMTP_FROM_EMAIL else user

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Sankalp Financial AI <{from_email}>"
    msg["To"] = to_email

    part1 = MIMEText(text_content, "plain")
    part2 = MIMEText(html_content, "html")
    msg.attach(part1)
    msg.attach(part2)

    context = ssl.create_default_context()

    if port == 465:
        with smtplib.SMTP_SSL(host, port, context=context, timeout=12) as server:
            server.login(user, pwd)
            server.sendmail(from_email, [to_email], msg.as_string())
    else:
        with smtplib.SMTP(host, port, timeout=12) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(user, pwd)
            server.sendmail(from_email, [to_email], msg.as_string())
    return True

async def send_otp_email(to_email: str, otp_code: str) -> bool:
    """
    Sends a 6-digit OTP email via Gmail or custom SMTP server.
    Returns True if sent successfully, False otherwise.
    """
    user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    pwd = settings.SMTP_PASSWORD.strip() if settings.SMTP_PASSWORD else ""

    if not user or not pwd:
        print(f"[EMAIL SERVICE] SMTP_USER or SMTP_PASSWORD not set in .env. Code for {to_email}: {otp_code}")
        return False

    subject = f"{otp_code} is your Sankalp verification code"

    text_content = f"""Hello,

Your verification code for Sankalp (India AI Financial Co-Pilot) is: {otp_code}

This code will expire in 10 minutes. Please enter this in your browser to verify your account.
If you did not request this verification code, please ignore this email.

Warm regards,
Team Sankalp
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sankalp Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 32px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 460px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 28px 24px; background: linear-gradient(135deg, #059669 0%, #047857 100%); text-align: center;">
        <div style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">सं Sankalp</div>
        <div style="font-size: 13px; color: #d1fae5; margin-top: 4px; font-weight: 500;">India-First AI Financial Co-Pilot</div>
      </td>
    </tr>
    <tr>
      <td style="padding: 36px 28px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: 700; color: #fafafa; margin: 0 0 10px 0;">Email Verification Code</h2>
        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.5; margin: 0 0 24px 0;">Use the 6-digit code below to securely sign in to your private financial dashboard:</p>
        
        <div style="background: #0f172a; border: 2px dashed #059669; border-radius: 14px; padding: 20px; margin: 0 auto 24px auto; display: inline-block;">
          <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #34d399; font-family: 'Courier New', Courier, monospace; display: block;">{otp_code}</span>
        </div>
        
        <p style="font-size: 12px; color: #71717a; margin: 0; line-height: 1.4;">
          ⏱ This code expires in <strong>10 minutes</strong>.<br/>
          Never share this code with anyone. Sankalp employees will never ask for your code.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 24px; background: #121215; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #71717a;">
        If you didn't request this login, you can safely ignore this email.<br/>
        &copy; 2026 Sankalp Financial Technologies. Built for India.
      </td>
    </tr>
  </table>
</body>
</html>
"""

    try:
        sent = await asyncio.to_thread(_send_sync, to_email, subject, html_content, text_content)
        if sent:
            print(f"[EMAIL SERVICE] Successfully delivered OTP code to {to_email}")
        return sent
    except Exception as e:
        print(f"[EMAIL SERVICE ERROR] Failed to send email to {to_email}: {e}")
        return False
