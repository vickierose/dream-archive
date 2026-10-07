# Neon setup

Neon Auth handles accounts and sessions. Dream and symbol records still use shared,
in-memory demo arrays: they are not persistent or private per user yet. Do not enter
personal journal data until the database migration and ownership checks are implemented.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` if you do not already have one.
3. From your Neon **development branch**, copy its database connection string into
   `DATABASE_URL` and its Auth endpoint into `NEON_AUTH_BASE_URL`.
   Keep the complete URLs, including their database/path/query components.
4. Set `NEON_AUTH_COOKIE_SECRET` to a cryptographically random secret of at least
   32 characters. Generate one with:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

5. In the same branch's Neon Auth settings, enable email/password sign-in and add
   `http://localhost:3000` as a trusted/allowed application origin. If you choose a
   different local port, add that origin too.
6. Check email verification and email delivery settings in Neon. The app supports
   verification-required signup: it waits for a session before entering the archive.
   Configure the email sender required by your Neon plan/settings, then verify
   delivery with your own account. Password-reset emails return to
   `http://localhost:3000/reset-password`; signup verification returns to `/dreams`.
7. To use the Google button, enable/configure Google in Neon Auth. Follow Neon's
   provider configuration and use the OAuth callback URL shown by Neon when setting
   up Google credentials; it is not this app's `/dreams` URL. Provider credentials
   belong in Neon, not browser environment variables.
8. Run `npm run dev` and open `http://localhost:3000`.

`.env.local` is Git-ignored. `.env.example` contains placeholders only. Never prefix
the database URL or cookie secret with `NEXT_PUBLIC_`. Restart the development
server after environment changes. Use a different cookie secret and the production
branch URLs in your hosting environment, and add your deployed origin to Neon Auth.

## How authentication works

- `lib/auth/server.ts` configures Neon Auth and the signed session cookie cache.
- `lib/auth/client.ts` sends browser auth calls through our own `/api/auth` endpoint.
- `app/api/auth/[...path]/route.ts` delegates the auth protocol to Neon's SDK.
- `proxy.ts` handles session validation/redirects for archive routes.
- `lib/auth/session.ts` verifies sessions for the archive layout and server actions.
  Actions check independently because callers can invoke them without visiting a page.
- Existing forms support signup, login, errors, verification feedback, and logout.
  `/forgot-password` and `/reset-password` handle password recovery.
- Google login uses the existing button and requires the provider setup above.

Authentication does not automatically enforce ownership in database queries.
`DATABASE_URL` is reserved for the next step; no dream tables or database client have
been created yet. That step will add Drizzle, migrations, and user-scoped queries for
`dreams`, `symbols`, and `dream_symbols`.

## Verification

```sh
npm run lint
npx tsc --noEmit
npm run build
node scripts/check-auth.mjs
```

With the development server running:

1. Visit `/dreams`, `/symbols`, and `/explore` signed out; each should redirect to login.
2. Create your own test account. If verification is required, follow the email link.
3. Log in with an incorrect password; an error should appear without a redirect.
4. Log in correctly and refresh an archive page; the session should persist.
5. Log out, then revisit an archive URL; it should require login again.
6. Request a password reset for your own test account, follow the email, and confirm
   the new password works. A missing reset token should offer a new reset link.
7. If Google is enabled, verify its redirect and return flow.

These checks verify authentication only. Two-account data isolation must be tested
after replacing the shared mock records with user-owned database records.

The automated smoke check starts a temporary production server on port 3127,
checks public pages and signed-out redirects, and stops it. It creates no accounts
and sends no emails. Successful login, email delivery, and Google OAuth require
the manual checks with your own account.

## Dependency notes

The installed Neon Auth SDK is `0.5.0-beta`; its dependency tree emits peer-version
warnings. The project passes TypeScript, lint, and production build checks with
the installed lockfile. Some transitive tooling also asks for a newer Node version
than the local Node 22.7.0; use a maintained Node release for deployment.

The installation audit reported 8 advisories (7 high, 1 critical) in the existing
Next.js/tooling dependency families, including Next.js 16.3.5. These have not been
fixed by this authentication change. Review and patch these dependencies before
public deployment; do not run a forced audit fix that downgrades Next.js tooling.

## References

- [Neon Auth Next.js integration](https://github.com/neondatabase/neon-js/blob/main/packages/auth/NEXT-JS.md)
- [Drizzle and Neon (next implementation step)](https://orm.drizzle.team/docs/get-started/neon-new)
