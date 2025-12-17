# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM (v6)
- **State Management**: React hooks and context
- **Styling**: SCSS modules with global styles
- **HTTP Client**: Axios for API calls
- **Authentication**: JWT tokens stored in cookies via js-cookie
- **QR Code Generation**: qrcode library
- **Payment**: Stripe integration (@stripe/react-stripe-js)

### Project Structure
```
src/
├── Components/
│   ├── Auth/           # Authentication components (Login, Register, Password Reset)
│   ├── Common/         # Reusable components (Select, iPhoneFrame)
│   ├── Pages/          # Page components organized by user role
│   │   ├── Producer/   # Producer-specific pages and features
│   │   ├── importer/   # Importer-specific pages and features
│   │   └── Product/    # Product-related components
│   ├── Routes/         # Route components and layout
│   └── layout/         # Layout components (Header, Footer, Sidebar)
├── Services/           # API service layer
├── Utils/              # Utilities, mock data, and language files
└── styles/             # SCSS modules and global styles
```

### System Architecture

The application serves three user roles:
- **Admin**: System administration
- **Producer**: Wine producers who create and manage Digital Product Passports (DPP)
- **Importer**: Wine importers who connect with producers to sync wine data

#### Producer Flow
1. Landing page → Signup/Login
2. Create DPP by filling product information
3. Publish DPP to make it visible to partners
4. Manage connection requests from importers

#### Importer Flow
1. Landing page → Signup/Login (with Stripe payment during signup)
2. Dashboard shows all synced wine data
3. Must connect with producers before accessing DPP:
   - Search and connect with producers
   - Wait for producer acceptance
   - Once connected, can access and sync wine data
4. Review DPP, download data, sync with internal systems

### Key Services
- **Httpclient.jsx**: Main API client with authentication, CRUD operations for wines/users
- **connectionService.js**: Handles producer-importer connections and published wine access
- **stripe.js**: Payment processing integration

### Authentication & Authorization
- JWT tokens stored in cookies
- Token-based API authentication
- Role-based access control for different user types

### Styling Guidelines
- Use SCSS modules for component-specific styles
- Prefer `display: flex` over `display: grid`
- Use unique class names per component to avoid CSS conflicts
- Global styles in `styles/global.scss`

### Environment Variables
- `VITE_API_URL`: Backend API base URL

### Important Notes
- The application uses a multi-role system with different flows for producers vs importers
- Connection system is central to the importer experience - importers must connect with producers before accessing wine data
- QR code generation is used for wine product passports
- Stripe integration handles subscription payments for importers
- Extensive internationalization support with language files in Utils/languages/