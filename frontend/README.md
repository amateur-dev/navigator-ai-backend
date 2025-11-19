# BetterStart

A modern, production-ready Next.js 16 starter template with **WorkOS AuthKit** for secure email+password authentication. Built with the latest technologies and best practices for rapid application development.

## ✨ Features

### Core Stack
- ⚡️ **Next.js 16.0.3** with Turbopack for blazing-fast development
- ⚛️ **React 19** with the latest concurrent features
- 🔐 **WorkOS AuthKit** - Enterprise-grade hosted authentication (email+password)
- 🎨 **Tailwind CSS 4** - Modern utility-first CSS framework
- 🗃️ **Prisma ORM** - Type-safe database access with PostgreSQL
- 🔍 **TypeScript** - Full end-to-end type safety

### UI & Components
- 🧩 **Shadcn/ui** - Beautiful, accessible component library
- 🎭 **Dark Mode** - Seamless theme switching with next-themes
- 📱 **Responsive Design** - Mobile-first, fully responsive layouts
- 🎯 **Lucide Icons** - Modern icon library with 1000+ icons
- 🎨 **Radix UI** - Unstyled, accessible UI primitives

### Developer Experience
- 🧹 **Biome** - Fast, unified linter and formatter
- 🔥 **Hot Reload** - Instant feedback with Fast Refresh
- 📦 **PNPM** - Fast, efficient package management
- 🎪 **Component Organization** - Well-structured shared components
- 🔧 **React Query** - Powerful data fetching and caching

### Application Features
- 👤 **User Management** - Complete user authentication flow
- 🛡️ **Admin Dashboard** - Protected admin routes with role-based access
- 📊 **Navigation System** - JSON-driven dynamic navigation
- 🎯 **Sidebar Layout** - Modern collapsible sidebar with nested navigation
- 🍞 **Breadcrumbs** - Automatic breadcrumb generation
- 🔍 **Search** - Built-in app search functionality

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 20 or later
- **PostgreSQL** database
- **PNPM** package manager (`npm install -g pnpm`)
- A **WorkOS** account ([Sign up free](https://dashboard.workos.com/))

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> better-start
cd better-start

# Install dependencies
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Update `.env` with your database and WorkOS credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/better_start"

# WorkOS AuthKit (get from https://dashboard.workos.com/)
WORKOS_API_KEY="sk_your_key_here"
WORKOS_CLIENT_ID="client_your_id_here"
WORKOS_COOKIE_PASSWORD="your_generated_password_here"
NEXT_PUBLIC_WORKOS_REDIRECT_URI="http://localhost:3000/callback"
```

### 3. Configure WorkOS Authentication

📖 **See [WORKOS_SETUP.md](./WORKOS_SETUP.md) for detailed setup instructions**

**Quick steps:**
1. Go to [WorkOS Dashboard](https://dashboard.workos.com/)
2. Activate AuthKit
3. Enable **Email + Password** authentication only
4. Disable all social login providers
5. Configure redirect URIs
6. Copy your API credentials to `.env`

### 4. Set Up Database

The starter comes with an empty Prisma schema. Add your own models to `prisma/schema.prisma`:

```bash
# After adding your models, create your first migration
npx prisma migrate dev --name init

# Generate Prisma client (also runs automatically with dev/build)
npx prisma generate

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

**Example model** (add to `prisma/schema.prisma`):
```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5. Run Development Server

```bash
# Start the development server with Turbopack
pnpm dev
```

The server will start at [http://localhost:3000](http://localhost:3000)

🎉 **You're all set!** Navigate to:
- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Sign Up**: [http://localhost:3000/auth/sign-up](http://localhost:3000/auth/sign-up)
- **Sign In**: [http://localhost:3000/auth/sign-in](http://localhost:3000/auth/sign-in)
- **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) (after authentication)

## 🔐 Authentication

This project uses **WorkOS AuthKit** with email+password authentication only (no social logins).

### Authentication Routes

- `/auth/sign-up` - User registration
- `/auth/sign-in` - User login
- `/callback` - OAuth callback handler
- `/api/auth/login` - Login endpoint

### Protected Routes

Routes that require authentication:
- `/admin` - Admin dashboard
- `/~/settings` - User settings

### Usage in Code

**Server Components:**
```typescript
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function Page() {
  // Optional auth
  const { user } = await withAuth();
  
  // Required auth (redirects to sign-in if not authenticated)
  const { user } = await withAuth({ ensureSignedIn: true });
  
  return <div>Welcome {user?.email}</div>;
}
```

**Client Components:**
```typescript
"use client";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;
  
  return <div>Welcome {user.email}</div>;
}
```

## 📁 Project Structure

```
better-start/
├── app/                       # Next.js App Router
│   ├── (admin)/              # Protected admin routes group
│   │   └── admin/
│   │       ├── page.tsx      # Admin dashboard
│   │       ├── layout.tsx    # Admin layout with sidebar
│   │       ├── settings/     # Admin settings
│   │       └── users/        # User management
│   │           ├── page.tsx  # User list
│   │           └── analytics/ # User analytics
│   ├── (app)/                # Protected application routes
│   │   └── account/
│   │       └── settings/     # User account settings
│   ├── (website)/            # Public website routes
│   │   ├── page.tsx          # Homepage
│   │   ├── about/            # About page
│   │   └── auth/             # Authentication pages
│   │       ├── sign-in/
│   │       └── sign-up/
│   ├── api/                  # API routes
│   │   └── auth/login/       # Login endpoint
│   ├── callback/             # OAuth callback handler
│   └── layout.tsx            # Root layout with providers
│
├── components/
│   ├── shared/               # Shared application components
│   │   ├── app-sidebar.tsx   # Collapsible sidebar
│   │   ├── app-header.tsx    # Top navigation bar
│   │   ├── app-navigation.tsx # Navigation items
│   │   ├── app-breadcrumbs.tsx # Breadcrumb navigation
│   │   ├── app-search.tsx    # Global search
│   │   └── app-user.tsx      # User dropdown menu
│   └── ui/                   # Shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...               # 40+ UI components
│
├── lib/                      # Utility libraries
│   └── actions/              # Server actions
├── hooks/                    # Custom React hooks
│   ├── use-mobile.ts         # Mobile detection
│   └── use-local-storage.ts  # Local storage hook
├── utils/                    # Utility functions
│   ├── cn.ts                 # Class name merger
│   ├── get-icon.ts           # Dynamic icon loader
│   └── get-initials.ts       # User initials helper
│
├── prisma/
│   └── schema.prisma         # Database schema (empty, ready for your models)
├── generated/prisma/         # Generated Prisma client (auto-generated)
│
├── data/
│   └── navigation.json       # Navigation configuration
│
├── providers/
│   └── app-provider.tsx      # App-wide providers (Query, Theme)
│
├── styles/
│   └── globals.css           # Global styles and Tailwind
│
├── public/                   # Static assets
├── biome.json                # Biome linter config
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies and scripts
```

## 🛠️ Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack (auto-generates Prisma client)
pnpm dev --turbo      # Start with turbo mode for faster builds

# Build & Production
pnpm build            # Build for production (includes Prisma generation)
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check code with Biome linter
pnpm lint:fix         # Fix linting issues (safe fixes only)
pnpm format           # Format code with Biome

# Database (Prisma)
npx prisma studio     # Open Prisma Studio GUI
npx prisma migrate dev         # Create and apply new migration
npx prisma migrate reset       # Reset database and reapply all migrations
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema changes without migration (dev only)
npx prisma db seed    # Run seed script (if configured)

# Component Management (Shadcn/ui)
npx shadcn@latest add <component>  # Add new UI component
npx shadcn@latest add --all        # Add all available components
```

### Development Workflow Tips

**Hot Reload**: The dev server automatically reloads on file changes. Turbopack makes this incredibly fast.

**Database Changes**:
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Prisma Client is auto-generated

**Adding Components**:
```bash
# Add a specific shadcn component
npx shadcn@latest add toast

# View available components
npx shadcn@latest add --help
```

**Code Quality**:
- Biome runs faster than ESLint + Prettier combined
- Auto-formatting on save recommended (configure in your editor)
- Run `pnpm lint:fix` before committing

## 🏗️ Architecture & Patterns

### Route Organization
This starter uses **Next.js App Router** with route groups for logical separation:

- **(admin)** - Protected admin dashboard with sidebar layout
- **(app)** - User-facing application routes
- **(website)** - Public marketing pages and authentication

Route groups don't affect the URL structure but enable different layouts per section.

### Data Fetching
- **React Query** for client-side data fetching and caching
- **Server Components** for efficient server-side data fetching
- **Server Actions** in `lib/actions/` for mutations

### Component Strategy
- **Server Components** by default (faster, smaller bundle)
- **Client Components** (`"use client"`) only when needed for interactivity
- **Shared Components** for reusable app UI in `components/shared/`
- **UI Components** from shadcn/ui in `components/ui/`

### State Management
- **React Query** for server state
- **Local Storage Hook** for persistent client state
- **URL Search Params** for shareable UI state

### Styling Approach
- **Tailwind CSS 4** for utility-first styling
- **CSS Variables** for theming (light/dark mode)
- **Class Variance Authority (CVA)** for component variants
- **cn()** utility for conditional class names

## 📚 Documentation

- [WorkOS Setup Guide](./WORKOS_SETUP.md) - Complete authentication setup
- [Next.js Documentation](https://nextjs.org/docs) - Learn Next.js features
- [WorkOS AuthKit Docs](https://workos.com/docs/authkit) - Authentication guide
- [Prisma Documentation](https://www.prisma.io/docs) - Database & ORM
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling utilities
- [Shadcn/ui Components](https://ui.shadcn.com/) - Component library
- [React Query Docs](https://tanstack.com/query/latest) - Data fetching
- [Biome Documentation](https://biomejs.dev/) - Linting & formatting

## 🔧 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Authentication**: [WorkOS AuthKit](https://workos.com/authkit)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [Biome](https://biomejs.dev/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com), from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Steps:
1. **Push to GitHub** - Commit and push your code to a GitHub repository
2. **Import to Vercel** - Connect your GitHub repository to Vercel
3. **Configure Environment Variables** - Add all required environment variables
4. **Update WorkOS Settings**:
   - Go to WorkOS Dashboard → Your Environment → Redirect URIs
   - Add `https://your-domain.vercel.app/callback`
5. **Deploy** - Click deploy and wait for the build to complete

### Environment Variables for Production

In your Vercel project settings (or hosting platform), add:

```env
# Database (use production PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# WorkOS (use production credentials)
WORKOS_API_KEY="sk_live_your_production_key_here"
WORKOS_CLIENT_ID="client_your_production_id_here"
WORKOS_COOKIE_PASSWORD="generate_a_strong_32_char_random_string"
NEXT_PUBLIC_WORKOS_REDIRECT_URI="https://your-domain.com/callback"

# Environment
NODE_ENV="production"
```

### Database Hosting Options

**Recommended PostgreSQL Providers**:
- [Neon](https://neon.tech) - Serverless Postgres (free tier available)
- [Supabase](https://supabase.com) - Open-source Firebase alternative
- [Railway](https://railway.app) - Simple deployment platform
- [Vercel Postgres](https://vercel.com/storage/postgres) - Integrated with Vercel

### Post-Deployment Checklist

- ✅ Verify all environment variables are set
- ✅ Run database migrations: `npx prisma migrate deploy`
- ✅ Test authentication flow (sign up, sign in, sign out)
- ✅ Check admin routes are properly protected
- ✅ Verify WorkOS redirect URIs match your domain
- ✅ Test dark mode and responsive design
- ✅ Set up error monitoring (Sentry, LogRocket, etc.)

## 🎨 Customization Guide

### Branding
1. **Update Logo**: Replace `components/ui/logo.tsx` with your brand logo
2. **Colors**: Modify Tailwind theme in `styles/globals.css`
3. **Fonts**: Add custom fonts to `app/layout.tsx`

### Navigation
Edit `data/navigation.json` to customize the sidebar navigation:
```json
{
  "title": "Dashboard",
  "url": "/admin/dashboard",
  "icon": "LayoutDashboard",
  "items": [...]
}
```

### Authentication
Customize auth pages in `app/(website)/auth/`:
- `sign-in/page.tsx` - Login page
- `sign-up/page.tsx` - Registration page

### Adding New Features
```bash
# 1. Create a new route
mkdir -p app/(app)/new-feature
echo "export default function Page() { return <div>New Feature</div> }" > app/(app)/new-feature/page.tsx

# 2. Add to navigation.json
# 3. Create necessary UI components
# 4. Add API routes if needed in app/api/
```

## 🐛 Troubleshooting

### Authentication Issues
**Problem**: "Invalid credentials" or redirect loops
- Verify environment variables are set correctly
- Check WorkOS dashboard has correct redirect URI
- Ensure cookies are enabled in browser
- Clear browser cache and cookies

### Database Connection
**Problem**: Can't connect to database
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
npx prisma db push

# Reset if needed
npx prisma migrate reset
```

### Prisma Client Not Found
**Problem**: `@prisma/client` errors
```bash
# Regenerate Prisma client
npx prisma generate

# If still issues, try:
rm -rf node_modules generated
pnpm install
```

### Build Errors
**Problem**: Build fails in production
- Run `pnpm build` locally to reproduce
- Check all environment variables are set
- Verify no TypeScript errors with `npx tsc --noEmit`
- Check Biome linting with `pnpm lint`

### Turbopack Issues
**Problem**: Dev server crashes or slow
```bash
# Try without turbopack
pnpm next dev --no-turbo

# Clear Next.js cache
rm -rf .next
pnpm dev
```

## ⚡ Performance Tips

### Optimization Strategies
1. **Image Optimization**: Use `next/image` for automatic optimization
2. **Code Splitting**: Lazy load heavy components with `next/dynamic`
3. **Database Indexing**: Add indexes to frequently queried Prisma fields
4. **Caching**: Leverage React Query's caching for API calls
5. **Bundle Analysis**: Run `pnpm build` and analyze bundle size

### Monitoring
- Set up [Vercel Analytics](https://vercel.com/analytics) for performance metrics
- Use [Vercel Speed Insights](https://vercel.com/docs/speed-insights) for Core Web Vitals
- Monitor database performance with Prisma's metrics

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this starter for any project, commercial or personal.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [WorkOS](https://workos.com/) for enterprise-ready authentication
- [Shadcn](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for the best deployment platform

---

<div align="center">

**Built with ❤️ using Next.js 16 and WorkOS AuthKit**

[⭐ Star on GitHub](https://github.com/yourusername/better-start) • [Report Bug](https://github.com/yourusername/better-start/issues) • [Request Feature](https://github.com/yourusername/better-start/issues)

</div>
