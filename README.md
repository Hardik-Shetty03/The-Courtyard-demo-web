# The Courtyard

## Default Admin Login

The backend creates a default admin account automatically after MongoDB connects. This initializer is non-destructive and idempotent:

- If the configured admin email does not exist, the backend creates it.
- If the configured admin email already exists, the backend skips creation and does not create a duplicate.
- The admin password is hashed with bcrypt before it is stored.

You can also run the same non-destructive initializer manually:

```bash
npm run seed:admin --prefix backend
```

Default credentials:

```text
Email: admin@thecourtyard.com
Password: Admin@123
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/the-courtyard
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000

DEFAULT_ADMIN_NAME=Courtyard Admin
DEFAULT_ADMIN_EMAIL=admin@thecourtyard.com
DEFAULT_ADMIN_PASSWORD=Admin@123

SENDPULSE_API_BASE_URL=https://api.sendpulse.com
SENDPULSE_API_KEY=
SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_FROM_EMAIL=verified-sender@yourdomain.com
SENDPULSE_FROM_NAME=The Courtyard

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=verified-sender@yourdomain.com
SMTP_FROM_NAME=The Courtyard
```

`MONGO_URI` is also accepted as an alias for `MONGODB_URI`.

## OTP Email with SendPulse

Registration and resend-verification OTPs are sent through SMTP first when `SMTP_*` credentials are configured. If SMTP is not configured, the backend tries SendPulse SMTP API. If both fail, the backend prints the OTP to the server console as a local-development fallback.

## OTP Email with SMTP

Use any SMTP provider, such as Gmail app password, Zoho Mail, SendPulse SMTP, Brevo SMTP, Mailgun SMTP, or another mail host:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password_or_app_password
SMTP_FROM_EMAIL=verified-sender@yourdomain.com
SMTP_FROM_NAME=The Courtyard
```

For Gmail, create an App Password in your Google account and use:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM_EMAIL=your-gmail-address@gmail.com
SMTP_FROM_NAME=The Courtyard
```

## OTP Email with SendPulse API

Configure either a static SendPulse API key:

```env
SENDPULSE_API_KEY=your_sendpulse_api_key
SENDPULSE_FROM_EMAIL=verified-sender@yourdomain.com
SENDPULSE_FROM_NAME=The Courtyard
```

or SendPulse OAuth client credentials:

```env
SENDPULSE_CLIENT_ID=your_sendpulse_client_id
SENDPULSE_CLIENT_SECRET=your_sendpulse_client_secret
SENDPULSE_FROM_EMAIL=verified-sender@yourdomain.com
SENDPULSE_FROM_NAME=The Courtyard
```

`SENDPULSE_FROM_EMAIL` must be a verified sender in your SendPulse SMTP settings. If SendPulse credentials are missing or sending fails, the backend still prints the OTP to the server console as a local-development fallback.

To change the default admin credentials later, update these variables before the first backend startup on a fresh database:

```env
DEFAULT_ADMIN_NAME=Your Admin Name
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=UseAStrongPasswordHere
```

If an account with `DEFAULT_ADMIN_EMAIL` already exists, startup will not overwrite that user's password or create another account. To rotate an existing admin password, use the app's password reset flow or update the user securely in MongoDB with a bcrypt hash.

## Testing Admin Login

1. Install dependencies:

```bash
npm run install-all
```

2. Create `backend/.env` using the variables above.

3. Optionally seed the admin explicitly:

```bash
npm run seed:admin --prefix backend
```

4. Start the app:

```bash
npm run dev
```

5. Confirm the backend console shows that MongoDB connected and either:

```text
Default admin account created for admin@thecourtyard.com
```

or:

```text
Default admin initialization skipped; account already exists for admin@thecourtyard.com
```

6. Open the frontend:

```text
http://localhost:3000/auth
```

7. Log in with:

```text
Email: admin@thecourtyard.com
Password: Admin@123
```

8. After successful login, the existing frontend auth flow redirects admin and reception users to:

```text
http://localhost:3000/admin
```

9. Test invalid credentials by using a wrong password. The API returns:

```text
Invalid email or password
```
