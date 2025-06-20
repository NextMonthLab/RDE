# NextMonth R.I.D. (Resident Integrated Development Environment)

## Overview

NextMonth R.I.D. is a web-based Integrated Development Environment (IDE) designed to provide a comprehensive development experience directly in the browser. The application combines a React-based frontend with an Express.js backend, featuring real-time code editing, file management, terminal access, and project management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Code Editor**: Monaco Editor (VS Code's editor) with custom themes and language support
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Real-time Communication**: WebSocket for terminal sessions
- **Development Server**: Vite middleware integration for seamless development experience
- **Database Provider**: Neon serverless PostgreSQL

## Key Components

### 1. File Management System
- Hierarchical file tree structure with folders and files
- CRUD operations for files and directories
- Real-time file content synchronization
- Support for multiple file types with appropriate syntax highlighting

### 2. Code Editor
- Monaco Editor integration with custom "ridDark" theme
- Language-specific syntax highlighting (TypeScript, JavaScript, CSS, HTML, JSON)
- IntelliSense and autocomplete functionality
- Multi-tab editing with dirty state tracking
- Auto-save capabilities

### 3. Project Management
- Multiple project support with template-based creation
- Project settings management (theme, tab size, word wrap)
- Project switching with isolated file systems
- Template options: React+TypeScript, Next.js, Node.js API, Express+PostgreSQL, Blank

### 4. Terminal Integration
- WebSocket-based terminal sessions
- Real-time command execution and output streaming
- Session management with active/inactive states
- Multi-terminal support per project

### 5. User Interface
- Responsive design with collapsible sidebar
- Dark theme optimized for coding
- Toast notifications for user feedback
- Resizable panels for optimal workspace utilization

## Data Flow

### Client-Server Communication
1. **HTTP API**: RESTful endpoints for CRUD operations on projects, files, and users
2. **WebSocket**: Real-time terminal communication and session management
3. **Query Management**: TanStack Query handles caching, synchronization, and optimistic updates

### File Operations
1. User selects file from tree → Query file content from server
2. File opens in editor tab → Monaco editor displays content with syntax highlighting
3. User edits content → Local state updates with dirty flag
4. Auto-save triggers → Content synced to server via API
5. File tree reflects changes → UI updates accordingly

### Terminal Sessions
1. User opens terminal → WebSocket connection established
2. Commands sent via WebSocket → Server spawns bash process
3. Output streamed back → Real-time display in terminal UI
4. Session persists → Until explicitly closed or connection lost

## External Dependencies

### Core Technologies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling framework
- **Monaco Editor**: Advanced code editing capabilities

### Backend Services
- **Neon Database**: Serverless PostgreSQL for data persistence
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web server and API framework
- **WebSocket (ws)**: Real-time communication

### UI Components
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Module Replacement**: Vite provides instant feedback during development
- **Database**: Automatic connection to Neon PostgreSQL instance
- **Environment Variables**: `DATABASE_URL` required for database connectivity

### Production Build
- **Build Process**: `npm run build` creates optimized client and server bundles
- **Static Assets**: Frontend builds to `dist/public` directory
- **Server Bundle**: ESBuild creates single `dist/index.js` file
- **Deployment**: Replit autoscale deployment with Node.js 20 runtime

### Database Management
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection Pooling**: Neon serverless handles scaling automatically
- **Data Persistence**: Full ACID compliance with PostgreSQL

## Changelog
- June 20, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.