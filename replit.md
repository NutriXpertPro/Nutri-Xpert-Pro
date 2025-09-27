# NutriXpert Pro - Professional Nutrition Management System

## Overview

NutriXpert Pro is a comprehensive web application designed for nutrition professionals to manage clients, conduct anamneses (health assessments), create meal plans, and track nutritional data. The system provides tools for calculating BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure), body composition analysis, and comprehensive client management. Built as a Progressive Web Application (PWA), it offers both online and offline functionality for nutrition professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router architecture
- **Styling**: Tailwind CSS with custom design system and dark/light theme support
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: React hooks and local state with React Query for server state
- **PWA Support**: Configured with service worker, manifest, and offline capabilities
- **Theme System**: Dynamic theme switching with localStorage persistence and system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful API endpoints for user management, profiles, weight tracking, and nutrition calculations
- **Data Validation**: Zod schemas for runtime type checking and validation

### Database Schema Design
The system uses a normalized relational database structure with the following core entities:
- **Users**: Basic authentication and user information
- **User Profiles**: Extended user data including age, gender, height, activity level, and goals
- **Weight Entries**: Time-series weight tracking with notes
- **Nutrition Calculations**: Storage for BMR, TDEE, and body composition calculations
- **Meal Plans**: Structured meal planning with ingredients, calories, and categorization

### Progressive Web App Features
- **Offline Functionality**: Service worker with caching strategies for static assets and dynamic content
- **Installation**: Web app manifest for native app-like installation
- **Performance**: Network-first for APIs, cache-first for static assets, and stale-while-revalidate for pages
- **Mobile Optimization**: Responsive design with touch-friendly interfaces

### Authentication & Security
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: JWT tokens with 7-day expiration
- **Route Protection**: Middleware-based authentication checking
- **Default Admin**: Automatic admin user creation for initial setup

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting for production
- **Drizzle ORM**: Type-safe database queries and migrations
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Accessible component primitives for dialog, dropdown, accordion, and form controls
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Modern icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management

### Development & Build Tools
- **TypeScript**: Full type safety across the application
- **PostCSS**: CSS processing with Autoprefixer
- **Next PWA**: Progressive Web App configuration and service worker generation

### Server & API
- **Express.js**: Backend API server for custom endpoints
- **Axios**: HTTP client for API communications
- **WebSocket (ws)**: Real-time communication capabilities
- **Concurrently**: Development script coordination

### Form & Data Management
- **React Hook Form**: Performant form handling with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities
- **TanStack Query**: Server state management and caching

### Security & Authentication
- **JSON Web Tokens**: Stateless authentication tokens
- **bcrypt**: Password hashing and verification
- **Input Validation**: Comprehensive data sanitization and validation