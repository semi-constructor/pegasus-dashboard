# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest | :x:               |

Only the latest release on the `main` branch is actively supported with security patches. We recommend always running the most recent version.

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in Pegasus Dashboard, please report it responsibly:

1. **Email**: Send a detailed report to **[security@cptcr.uk](mailto:security@cptcr.uk)**
2. **Subject line**: `[SECURITY] Pegasus Dashboard — <brief description>`
3. **Include the following information**:
   - A description of the vulnerability and its potential impact
   - Steps to reproduce or a proof-of-concept
   - The affected component(s) or file(s)
   - Any suggested fixes (optional, but appreciated)

### What to Expect

- **Acknowledgement**: You will receive a response within **48 hours** confirming we have received your report.
- **Assessment**: We will investigate and assess the severity within **5 business days**.
- **Resolution**: We aim to release a fix within **14 days** for critical vulnerabilities, or in the next scheduled release for lower-severity issues.
- **Disclosure**: We will coordinate with you on public disclosure timing. We follow a responsible disclosure policy and will credit reporters unless they prefer to remain anonymous.

## Security Best Practices for Deploying Pegasus Dashboard

When self-hosting or deploying the dashboard, please ensure:

- **Environment variables** (`.env.local`, `.env.production`) are never committed to version control
- **`NEXTAUTH_SECRET`** is set to a cryptographically random string (minimum 32 characters)
- **`BOT_API_TOKEN`** is kept confidential and rotated periodically
- **Discord OAuth2 credentials** are stored securely and scoped with the minimum required permissions
- **Database connection strings** use SSL/TLS (`?sslmode=require`)
- Access to the admin panel is restricted to explicitly authorized Discord user IDs via the `ADMIN` environment variable
- All deployments use HTTPS in production

## Scope

This security policy applies to:

- The Pegasus Dashboard web application (`pegasus-dashboard` repository)
- The REST API integration between the dashboard and the Pegasus Discord Bot

It does **not** cover:

- Third-party services (Discord, Neon, Vercel, Cloudflare)
- The Pegasus Discord Bot itself (report those separately)

## Hall of Fame

We appreciate the security research community. Responsible reporters will be credited here (with permission):

*No reports yet — be the first!*
