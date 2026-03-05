

## Plan: Add Authentication (Login & Signup)

Since all tables have RLS policies requiring `auth.uid() = user_id`, users need to be authenticated to see or create any data. I'll add a complete auth flow.

### What will be built

1. **Auth page** (`src/pages/Auth.tsx`) -- Login and signup forms with email/password, toggling between modes. Includes password reset request flow.

2. **Auth context** (`src/hooks/use-auth.tsx`) -- React context wrapping `supabase.auth.onAuthStateChange` and `getSession`. Provides `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`.

3. **Protected route wrapper** (`src/components/ProtectedRoute.tsx`) -- Redirects unauthenticated users to `/auth`. Shows loading spinner while session is resolving.

4. **Reset password page** (`src/pages/ResetPassword.tsx`) -- Handles the `type=recovery` redirect from the password reset email. Lets user set a new password.

5. **App.tsx updates** -- Wrap all CRM routes with `ProtectedRoute`. Add `/auth` and `/reset-password` as public routes.

6. **Sidebar update** -- Add user email display and logout button at the bottom of `CrmSidebar`.

### Technical details

- **No database migration needed** -- Auth uses built-in `auth.users`, no profiles table required (user didn't request profile data).
- **Email confirmation** -- Kept enabled (default). Users must verify email before signing in.
- **Sign up** uses `emailRedirectTo: window.location.origin` for the confirmation link.
- **Password reset** uses `redirectTo: window.location.origin + '/reset-password'`.
- **Session listener** set up with `onAuthStateChange` before `getSession()` per best practices.
- All existing hooks (`useLeads`, `useInteractions`) already pass `user_id` on inserts -- no changes needed there.

### Files to create
- `src/hooks/use-auth.tsx`
- `src/pages/Auth.tsx`
- `src/pages/ResetPassword.tsx`
- `src/components/ProtectedRoute.tsx`

### Files to modify
- `src/App.tsx` -- Add auth provider, public/protected routes
- `src/components/crm/CrmSidebar.tsx` -- Add user info + logout button

