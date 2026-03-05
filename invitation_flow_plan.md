# User Invitation & Password Setup Plan

This plan outlines the coordination between the Go backend and Next.js frontend to allow new users to accept invitations and securely set their own passwords.

## 1. Backend: User Creation (Go)
The current implementation in [api/v1/user/handler.go](file:///c:/Users/msi%20thin/Documents/Code/OJT/MIRA/api/v1/user/handler.go) already initiates the flow:
- **Action**: [AddUser](file:///c:/Users/msi%20thin/Documents/Code/OJT/MIRA/api/v1/user/handler.go#32-66) calls `supabase.AdminClient.Auth.InviteUserByEmail`.
- **Effect**: Supabase sends an email to the user with a link.
- **Data**: The local database stores a `TempPassword123!`.

> [!TIP]
> **Recommendation**: Once the flow below is implemented, you can remove the `Password` field from the local Go [User](file:///c:/Users/msi%20thin/Documents/Code/OJT/MIRA/web/types/mira.ts#72-85) struct and DB table entirely, as it won't be used.

---

## 2. Supabase Configuration
You must configure your Supabase project to direct users to your frontend:
1. **Site URL**: Set to your frontend URL (e.g., `http://localhost:3000`).
2. **Redirect URLs**: Add `http://localhost:3000/accept-invite` to the allowlist in **Authentication > URL Configuration**.
3. **Email Templates**: In **Authentication > Email Templates > Invite User**, ensure the invitation link includes a redirect:
   - Example: `{{ .ConfirmationURL }}&redirect_to=http://localhost:3000/accept-invite`

---

## 3. Frontend: Accept Invite Page (Next.js)
A new route is required to handle the incoming user and let them set a password.

### [NEW] `app/(auth)/accept-invite/page.tsx`
- **Purpose**: Capture the hash/token from the URL.
- **Logic**:
  1. Check if the user is authenticated via the invitation link (Supabase handles this automatically when they arrive via the link).
  2. Display a "Set Your Password" form.
  3. On submit, call:
     ```javascript
     const { data, error } = await supabase.auth.updateUser({
       password: newPassword
     })
     ```
  4. If successful, redirect to `/login` with a success message.

---

## 4. User Experience Flow
1. **Admin** adds user in the IT Admin Console.
2. **User** receives a "You have been invited" email.
3. **User** clicks the link and is redirected to `/accept-invite`.
4. **User** enters a strong password.
5. **System** updates the password in Supabase's secure auth schema.
6. **User** is directed to the Login page to start their session.
