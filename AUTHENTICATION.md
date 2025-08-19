# WorkSight Authentication Implementation

## Overview

A comprehensive authentication system with offline support, access token
management, and state management has been implemented for the WorkSight
application.

## Features Implemented

### 1. Authentication Library (`src/lib/auth.ts`)

- **Offline Mode Detection**: Checks for `IS_OFFLINE` environment variable or
  network status
- **Dual Authentication**: Supports both Supabase and offline authentication
- **Offline Credentials**:
  - Primary: `test@worksight.app` / `testuser`
  - Legacy: `test` / `testuser` or `testuser` / `test`
- **OAuth Support**: Google, GitHub, Discord, Facebook (disabled in offline
  mode)
- **Token Management**: Generates mock tokens for offline mode, real tokens for
  Supabase
- **Session Management**: `getCurrentUser()`, `signOut()` functions

### 2. Authentication Context (`src/store/auth-store.tsx`)

- **React Context**: Global authentication state management
- **User State**: Stores user data, access token, loading state
- **Auto-refresh**: Automatically refreshes user session on mount
- **Storage Sync**: Listens for localStorage changes across tabs
- **Type Safety**: Fully typed User interface and context

### 3. Protected Routes (`src/components/protected-route.tsx`)

- **Route Protection**: Redirects unauthenticated users to login
- **Loading States**: Shows loading spinner during authentication check
- **Flexible Fallbacks**: Customizable fallback components

### 4. Login Form (`src/components/login-form.tsx`)

- **Dual Login**: Email/password and OAuth buttons
- **Error Handling**: Displays authentication errors
- **Loading States**: Disables form during authentication
- **Auto-redirect**: Redirects to dashboard on successful login
- **Offline Hints**: Shows offline credentials in UI

### 5. Dashboard (`src/app/dashboard/page.tsx`)

- **Protected Access**: Requires authentication
- **User Info**: Displays logged-in user information
- **Logout Function**: Secure logout with state cleanup
- **Activity Feed**: Mock activity data
- **Stats Cards**: Work metrics and burnout tracking

### 6. Tasks Page (`src/app/tasks/page.tsx`)

- **Task Management**: Full task management interface
- **Status Columns**: Todo, In Progress, Completed
- **Search Function**: Filter tasks by title/description
- **Priority Labels**: High, Medium, Low priority indicators
- **Task Stats**: Real-time task statistics

### 7. Environment Configuration (`.env.local`)

- **Offline Mode**: `NEXT_PUBLIC_IS_OFFLINE=true`
- **Supabase Config**: URL and publishable key
- **Server-side Flag**: `IS_OFFLINE=true`

## Usage

### Offline Authentication

```bash
# Enable offline mode
NEXT_PUBLIC_IS_OFFLINE=true
```

Use credentials:

- Email: `test@worksight.app`
- Password: `testuser`

### Online Authentication

```bash
# Disable offline mode
NEXT_PUBLIC_IS_OFFLINE=false
```

Requires valid Supabase configuration.

## File Structure

```tree
src/
├── lib/
│   └── auth.ts                 # Authentication logic
├── store/
│   └── auth-store.tsx          # Authentication context
├── components/
│   ├── login-form.tsx          # Login form component
│   ├── protected-route.tsx     # Route protection
│   └── ui/
│       └── badge.tsx           # UI component
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Protected dashboard
│   └── tasks/
│       └── page.tsx            # Protected tasks page
└── data/
    └── authProviders.ts        # OAuth provider configuration
```

## Security Features

- Access tokens stored in localStorage
- Automatic token cleanup on logout
- Protected routes with authentication checks
- Error handling for failed authentication
- Cross-tab session synchronization

## Next Steps

1. Implement task CRUD operations
2. Add burnout tracking metrics
3. Integrate real-time updates
4. Add user profile management
5. Implement team collaboration features
