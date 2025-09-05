# Overview

Nutri Xpert Pro is a comprehensive nutritional management system designed for professional nutritionists. The application provides tools for client management, health assessments (anamnesis), dietary planning, food and supplement databases, and progress tracking. Built with a modern full-stack architecture, it features a React-based frontend with TypeScript, an Express.js backend, and PostgreSQL database integration through Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React 18 with TypeScript, utilizing a component-based architecture with shadcn/ui for the design system. The application follows a single-page application (SPA) pattern with client-side routing handled by Wouter. The UI framework is built on top of Radix UI primitives and styled with Tailwind CSS, providing a responsive and accessible interface.

Key architectural decisions:
- **React Query (TanStack Query)** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **Wouter** for lightweight client-side routing
- **shadcn/ui** component library for consistent design patterns

## Backend Architecture
The server is implemented using Express.js with TypeScript, following a RESTful API design pattern. The application uses a modular structure separating concerns between routing, data access, and business logic.

Core components:
- **Express.js** server with middleware for JSON parsing and request logging
- **Storage abstraction layer** providing a clean interface for data operations
- **Centralized error handling** with standardized API responses
- **Vite integration** for development with hot module replacement

## Data Storage Solutions
The application uses PostgreSQL as the primary database, accessed through Drizzle ORM for type-safe database operations. The database schema supports the complete nutritional management workflow.

Database design features:
- **Neon Database** as the PostgreSQL provider with serverless connection pooling
- **Drizzle ORM** with schema-first approach and automatic TypeScript type generation
- **Zod integration** for runtime validation matching database schemas
- **Migration system** for database version control

Key entities include:
- Users (nutritionists)
- Clients with comprehensive profile data
- Anamnesis records for health assessments
- Measurements and photos for progress tracking
- Food and supplement databases
- Diet plans with meal composition
- Evaluation scheduling and tracking

## Authentication and Authorization
The current implementation uses a simplified authentication approach with session-based user identification. The system is designed to support role-based access control for nutritionist-client relationships.

## Progressive Web App (PWA) Features
The application is configured as a Progressive Web App with:
- **Service Worker** for offline functionality and caching
- **Web App Manifest** for native app-like installation
- **Responsive design** optimized for mobile and desktop usage

# External Dependencies

## Database and Infrastructure
- **@neondatabase/serverless**: PostgreSQL database connection with serverless architecture
- **Drizzle ORM**: Type-safe database access layer with PostgreSQL dialect
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Frontend Libraries
- **React ecosystem**: React 18, React DOM, React Query for state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Hookform Resolvers for validation
- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS with class-variance-authority for component variants

## Development and Build Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type system for both frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit integrations**: Development environment specific plugins and error handling

## Validation and Data Handling
- **Zod**: Runtime type validation and schema definition
- **Drizzle-Zod**: Integration layer between Drizzle schemas and Zod validation
- **Date-fns**: Date manipulation and formatting utilities

## Utility Libraries
- **Clsx**: Conditional className composition
- **Tailwind Merge**: Intelligent Tailwind class merging
- **Nanoid**: Unique ID generation
- **Lucide React**: Icon library with React components