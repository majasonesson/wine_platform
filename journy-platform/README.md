# Journy Platform - Next.js Migration

A full-stack TypeScript application for wine Digital Product Passports, connecting producers and importers.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Microsoft SQL Server (Azure SQL)
- **ORM**: Prisma + raw SQL queries
- **Authentication**: JWT with cookies
- **Payment**: Stripe
- **Storage**: Azure Blob Storage
- **Runtime**: Bun

## Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Copy the `.env.local` file and fill in your credentials:

```bash
# Database
DATABASE_URL="sqlserver://server:port;database=dbname;user=username;password=password;encrypt=true;trustServerCertificate=false"
SQL_SERVER="your-server.database.windows.net"
SQL_DATABASE="your-database-name"
SQL_ADMIN="your-admin-username"
SQL_PASSWORD="your-admin-password"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_TTL="30d"

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=youraccountname;AccountKey=youraccountkey;EndpointSuffix=core.windows.net"

# Stripe
STRIPE_SECRET_KEY_PRODUCTION="sk_test_your_stripe_secret_key"
WEBHOOK_SECRET_KEY_PRODUCTION="whsec_your_webhook_secret"

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"

# Frontend URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
FRONT_END_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 3. Generate Prisma Client

```bash
bun run prisma:generate
```

### 4. Run Development Server

```bash
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── (auth)/              # Auth pages (login, signup, reset-password)
│   ├── (public)/            # Public pages (home, product QR landing)
│   ├── producer/            # Producer dashboard and features
│   ├── importer/            # Importer dashboard and features
│   ├── api/                 # API routes
│   │   ├── users/           # User management
│   │   ├── wines/           # Wine CRUD
│   │   ├── connections/     # Producer-Importer connections
│   │   ├── stripe/          # Stripe subscription management
│   │   └── webhook/         # Stripe webhook handler
│   ├── layout.tsx           # Root layout
│   └── globals.scss         # Global styles
├── components/              # Shared React components
├── lib/                     # Utility functions
│   ├── db.ts               # SQL Server connection
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # JWT utilities
│   └── azure.ts            # Azure Blob Storage
├── types/                   # TypeScript type definitions
├── middleware.ts            # Auth middleware
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## API Routes

### Authentication
- `POST /api/users/login` - Login with email/password
- `POST /api/users/request-reset-password` - Request password reset
- `PUT /api/users/createpassword/[token]` - Create/reset password

### User Management
- `GET /api/users` - List all users
- `GET /api/users/profile/[id]` - Get user profile
- `PUT /api/users/profile/[id]` - Update user profile
- `PUT /api/users/change-password/[id]` - Change password
- `GET /api/users/certifications` - Get user certifications

### Wine Management (Protected)
- `GET /api/wines` - List user's wines
- `POST /api/wines` - Create wine (with file upload)
- `GET /api/wines/[id]` - Get wine details (public)
- `PUT /api/wines/[id]` - Update wine
- `DELETE /api/wines/[id]` - Delete wine
- `PUT /api/wines/[id]/publish` - Toggle publish status

### Connections (Protected)
- `POST /api/connections/request` - Create connection request
- `GET /api/connections/requests` - Get connection requests
- `PUT /api/connections/status/[id]` - Update connection status
- `GET /api/connections/published/wines` - Get published wines from connected producers
- `GET /api/connections/published/wine/[wineID]` - Get specific published wine

### Stripe
- `POST /api/stripe/create-subscription` - Create subscription checkout
- `POST /api/stripe/cancel-subscription` - Cancel subscription
- `POST /api/webhook` - Stripe webhook handler

## User Roles

### Producer
- Create and manage wine products
- Generate QR codes for products
- Publish wines to importers
- Manage connection requests
- Subscription-based label allocation

### Importer
- Connect with producers
- View published wines from connected producers
- Download wine data and certifications
- Subscription management

## Key Features

- **Digital Product Passports**: Comprehensive wine data with QR codes
- **Connection System**: Secure producer-importer relationships
- **File Uploads**: Azure Blob Storage for images, documents, and certifications
- **Stripe Integration**: Subscription management with webhooks
- **Role-Based Access**: JWT authentication with middleware protection
- **Type-Safe**: Full TypeScript support throughout

## Development Notes

### File Uploads
Next.js handles multipart form data differently than Express. Use `formData()` method on Request objects.

### Stripe Webhooks
The webhook endpoint handles raw body for signature verification. Test webhooks locally with Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### Database Access
The application uses both Prisma (for Stripe-related operations) and raw SQL queries (for main CRUD operations) to maintain compatibility with the original implementation.

## Migration Status

### Completed
- Next.js 16 setup with TypeScript and App Router
- All API routes migrated
- Database utilities and Prisma setup
- Authentication middleware
- Core page structure
- Type definitions

### Needs Migration
- Full frontend component library (54 .jsx files from original)
- Complex forms (wine creation, user registration with Stripe)
- Producer/Importer profile pages
- Connection management UI
- Settings and subscription management pages
- Styling (SCSS modules need to be integrated)

Original components are located in:
- `journy-importers-main/frontend/src/Components/`

## Deployment

This application is optimized for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

Private - Journy Platform
