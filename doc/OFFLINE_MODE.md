# Offline Mode Configuration

This document explains how the offline/online mode system works in WorkSight.

## Environment Variables

### `NEXT_PUBLIC_IS_OFFLINE`

Set this environment variable to control offline mode behavior:

- `NEXT_PUBLIC_IS_OFFLINE=true` - **Forced Offline Mode**
  - App is always in offline mode
  - Users cannot switch to online mode
  - Signup is completely disabled
  - Only offline login credentials work
  - Mode selector is hidden, shows "Offline Mode" indicator instead

- `NEXT_PUBLIC_IS_OFFLINE=false` or not set - **User Choice Mode**
  - Users can choose between offline and online modes
  - Mode preference is saved in localStorage via Zustand store
  - Signup is available when in online mode
  - Mode selector is visible

## Usage Examples

### Development with Forced Offline Mode

```bash
# In .env.local
NEXT_PUBLIC_IS_OFFLINE=true
```

### Production with User Choice

```bash
# In .env.local
NEXT_PUBLIC_IS_OFFLINE=false
# or simply omit the variable
```

## State Management

The connectivity mode is managed using Zustand with persistence:

- **Store**: `useConnectivityStore` in `/stores/connectivity-store.ts`
- **Persistence**: Uses localStorage with key `connectivity-mode`
- **Force Override**: When `NEXT_PUBLIC_IS_OFFLINE=true`, user preferences are
  ignored

## User Experience

### Forced Offline Mode (`NEXT_PUBLIC_IS_OFFLINE=true`)

1. Login page shows "Offline Mode" indicator
2. No mode selector visible
3. No OAuth buttons shown
4. Signup link shows "Sign up disabled in offline mode"
5. Only offline test accounts work

### User Choice Mode (`NEXT_PUBLIC_IS_OFFLINE=false`)

1. Login page shows Offline/Online toggle buttons
2. User selection is persisted across sessions
3. Online mode shows OAuth options and signup
4. Offline mode hides OAuth and signup, shows test accounts

## Test Accounts

When in offline mode, these test accounts are available:

- Admin, Employee, Manager, Guest, and Executive roles
- Credentials are defined in `/auth/credentials.ts`
- Common password: "password" for most accounts

## Implementation Details

### Key Files

- `/components/auth/oauth.tsx` - Login/signup forms with mode handling
- `/stores/connectivity-store.ts` - Zustand store for mode persistence
- `/auth/offline.ts` - Offline mode detection and utilities
- `/auth/provider.tsx` - Auth provider with offline support

### State Flow

1. Environment variable checked on app initialization
2. If forced offline: mode locked to 'offline'
3. If user choice: mode loaded from localStorage
4. Mode changes update both Zustand store and localStorage
5. Components react to mode changes for UI updates
