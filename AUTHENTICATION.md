# WorkSight Authentication Implementation

## Overview

A comprehensive authentication system with offline support, access token
management, and state management has been implemented for the WorkSight
application.

## Features Implemented

### 1. Authentication Library (`src/auth/client.ts`)

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

### 2. Authentication Context (`src/auth/provider.tsx`)

- **React Context**: Global authentication state management
- **User State**: Stores user data, access token, loading state, save login preference
- **Session Timeout**: Automatic session management with 5min/30day options
- **Auto-refresh**: Automatically refreshes user session on mount
- **Storage Sync**: Enhanced localStorage management with error handling
- **Type Safety**: Fully typed User interface and context
- **Session Monitoring**: Real-time session expiration monitoring

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
- **Signup Link**: Provides link to registration page

### 5. Signup Form (`src/components/signup-form.tsx`)

- **User Registration**: Username, email, password, and full name fields
- **Enhanced Username Validation**: 3-20 characters, must contain letters, no consecutive underscores
- **Form Validation**: Client-side validation for all fields with detailed error messages
- **Password Confirmation**: Ensures passwords match
- **OAuth Integration**: Google, GitHub, Discord, Facebook signup options
- **Save Login Option**: 5-minute vs 30-day session preference
- **Auto-redirect**: Redirects to dashboard on successful registration
- **Offline Support**: Creates mock users in offline mode

### 6. OAuth Signup Completion (`src/app/signup/complete/page.tsx`)

- **OAuth Profile Completion**: Allows OAuth users to choose username
- **Pre-filled Data**: Auto-populates email and name from OAuth provider
- **Username Suggestions**: Generates username suggestions based on email
- **Metadata Update**: Updates Supabase user metadata with username
- **Session Handling**: Properly manages OAuth session after completion

### 7. OAuth Callback Handler (`src/app/auth/callback/page.tsx`)

- **OAuth Validation**: Validates OAuth users have completed signup
- **Account Verification**: Checks for required user metadata (username)
- **Signup Flow Support**: Redirects new OAuth users to complete signup
- **Error Handling**: Redirects to signup if account not found
- **Session Management**: Properly stores validated OAuth sessions

### 8. Dashboard (`src/app/dashboard/page.tsx`)

- **Protected Access**: Requires authentication
- **User Info**: Displays logged-in user information
- **Logout Function**: Secure logout with state cleanup
- **Activity Feed**: Mock activity data
- **Stats Cards**: Work metrics and burnout tracking

### 9. Tasks Page (`src/app/tasks/page.tsx`)

- **Task Management**: Full task management interface
- **Status Columns**: Todo, In Progress, Completed
- **Search Function**: Filter tasks by title/description
- **Priority Labels**: High, Medium, Low priority indicators
- **Task Stats**: Real-time task statistics

### 10. Environment Configuration (`.env.local`)

- **Offline Mode**: `NEXT_PUBLIC_IS_OFFLINE=true`
- **Supabase Config**: URL and publishable key
- **Server-side Flag**: `IS_OFFLINE=true`

## OAuth Account Validation

To prevent OAuth users from signing in without proper accounts:

1. **OAuth Flow**:
   - New users → OAuth sign up → Complete profile with username
   - Existing users → OAuth sign in → Dashboard (if username exists)
2. **Metadata Check**: OAuth callback validates `user_metadata.username` exists
3. **Redirect Logic**:
   - No account → Redirects to `/signup/complete`
   - Valid account → Proceeds to `/dashboard`
4. **Error Messages**: Clear feedback about account requirements

### Enhanced Username Validation

The signup form now includes comprehensive username validation:

- **Length**: 3-20 characters
- **Characters**: Letters, numbers, and underscores only
- **Content**: Must contain at least one letter (not just numbers/underscores)
- **Format**: Cannot start or end with underscore
- **Consecutive**: No consecutive underscores allowed
- **Real-time**: Validation feedback as user types

### OAuth Signup Flow

1. **Initial Signup**: User clicks OAuth provider button on signup page
2. **Provider Auth**: Redirected to OAuth provider (Google, GitHub, etc.)
3. **Callback Processing**: Returns to `/auth/callback` for validation
4. **Profile Completion**: If new user, redirected to `/signup/complete`
5. **Username Selection**: User chooses username and preferences
6. **Account Creation**: Metadata updated, session established

## Usage

### User Registration

Visit `/signup` or click "Sign up here" from login page:

**Traditional Signup:**

- **Username**: 3-20 characters, letters/numbers/underscores, must contain letters
- **Email**: Valid email address
- **Password**: 6+ characters minimum
- **Full Name**: Display name for the user
- **Save Login**: Choose 5-minute or 30-day session

**OAuth Signup:**

- Click provider button (Google, GitHub, Discord, Facebook)
- Authorize with provider
- Complete profile by choosing username
- Account automatically created with provider data

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
├── auth/
│   ├── index.ts                # Main auth exports
│   ├── client.ts               # Authentication logic
│   ├── provider.tsx            # Authentication context
│   ├── config.ts               # Auth configuration
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Auth utilities
├── components/
│   ├── login-form.tsx          # Login form component
│   ├── signup-form.tsx         # Signup form component
│   ├── protected-route.tsx     # Route protection
│   ├── session-timer.tsx       # Session timeout UI
│   └── ui/
│       └── checkbox.tsx        # Save login checkbox
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── signup/
│   │   ├── page.tsx            # Signup page
│   │   └── complete/
│   │       └── page.tsx        # OAuth signup completion
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx        # OAuth callback handler
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
