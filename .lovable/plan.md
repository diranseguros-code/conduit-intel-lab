

## Plan: Auto-advance wizard after Google OAuth return

### Problem
When the user clicks "Conectar com Google", they are redirected to Google's OAuth page. After authenticating, they return to the app at `/` (the `redirect_uri`). The wizard resets to Step 0 because the component state is lost during the redirect.

### Solution
Use `localStorage` to persist the wizard state (`selectedProvider = "google"`) before the OAuth redirect. On mount, check if:
1. There's a persisted provider in localStorage
2. The user is authenticated (via `supabase.auth.getUser()`)

If both are true, auto-insert a `social_connections` record for Google, clear localStorage, show a success toast, and jump directly to Step 2 (Permissions).

### Changes

**`src/components/crm/IntegrationWizard.tsx`**:
- Add a `useEffect` that runs on mount:
  - Reads `nexus_integration_pending` from localStorage
  - If value is `"google"`, calls `supabase.auth.getUser()`
  - If user exists, inserts into `social_connections`, sets `selectedProvider = "google"`, `step = 2`, clears localStorage, shows toast
- Before the Google OAuth redirect in `handleConnect`, save `localStorage.setItem("nexus_integration_pending", "google")`
- Import `useEffect` from React

### Technical details
- Key name: `nexus_integration_pending`
- The redirect_uri stays as `window.location.origin`, so the user lands on `/` after OAuth. The `ProtectedRoute` will then render the last visited page. To ensure they land on the integrations page, we'll change `redirect_uri` to `window.location.origin + "/settings/integrations"`.
- The useEffect checks and cleans up in one pass to avoid double-processing.

