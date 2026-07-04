# Keycloak Authentication & Authorization Setup Guide

This document details the configuration and architectural integration of **Keycloak** within the Ebiz E-Commerce application for signup, login, and view-level authorization.

---

## 1. Keycloak Configuration Properties
The backend connects to Keycloak using the properties defined in [application.yml](file:///c:/Users/shafe/Documents/code/ebiz_ecommerce/Ebiz-Backend/src/main/resources/application.yml#L25-L30):

```yaml
keycloak:
  server-url: http://localhost:8080
  realm: ebiz
  admin:
    client-id: ebiz-backend
    secret: jQY34lsNdjVOhnHj9o4TlEKQNeKoSS6Y
```

---

## 2. Keycloak Admin Console Setup Checklist

To set up Keycloak for this project, perform the following steps in the Keycloak Admin Console:

### Step A: Create Realm
1. Hover over the top-left dropdown and click **Create Realm**.
2. Name the realm: **`ebiz`**.

### Step B: Create Realm Roles
Create the following roles under **Realm Roles** (must be exact matches and in lowercase):
* **`user`** (Default role for standard customers)
* **`seller`** (Assigned to sellers, who remain disabled until approved by an admin)
* **`admin`** (Allows full management capabilities via `@PreAuthorize("hasRole('admin')")`)

### Step C: Create Client (`ebiz-backend`)
1. Navigate to **Clients** -> **Create Client**.
2. Set **Client ID** to `ebiz-backend`.
3. Select **Client Protocol** as `openid-connect`.
4. Turn **On** the following toggles:
   * **Client Authentication** (this makes the client Confidential and generates a client secret).
   * **Service Accounts Enabled** (allows the backend to execute administrator commands without active user sessions).
   * **Standard Flow Enabled** and **Direct Access Grants Enabled** (enables standard login and password authentication).
5. Click **Save**.
6. Go to the **Credentials** tab and copy the **Client Secret**. Update it in your backend's `application.yml` under `keycloak.admin.secret` if it differs from the current value.

### Step D: Configure Service Account Roles (CRITICAL for Signup & Verification)
Since the Spring Boot backend acts as an administrator to create users and assign roles programmatically when an OTP is verified, you must grant the client service account the required management permissions:

1. In the `ebiz-backend` client page, navigate to the **Service Accounts Roles** tab.
2. Click **Assign role** and filter by client roles (search for `realm-management`).
3. Select and assign the following role:
   * **`manage-users`** (Allows creating users, resetting passwords, and searching users by email).

---

## 3. How the Flows Work (Code-Level Integration)

### A. Signup and Verification Flow
1. **Send OTP:** The client triggers `/api/auth/signup/send-otp`. The backend checks if the user already exists in Keycloak by calling `keycloakService.checkUserExists()`. If they do not, it sends an OTP.
2. **Verify OTP:** The client triggers `/api/auth/signup/verify-otp` (which is public / `permitAll`).
3. **Register User in Keycloak:** Inside [KeycloakService.java](file:///c:/Users/shafe/Documents/code/ebiz_ecommerce/Ebiz-Backend/src/main/java/com/ebiz/backend/service/KeycloakService.java#L53), the backend uses its admin client credentials to:
   * Create the user representation in Keycloak with `enabled = true` (or `false` if `role == SELLER`).
   * Reset their password programmatically.
   * Fetch the corresponding realm-level role (`user` or `seller`) and assign it.
4. **Register User in DB:** Once registered in Keycloak, the backend persists the profile details inside MongoDB via `userRepository.save()`.

### B. Login Flow
1. The client sends a `POST` request with the username/email and password to `/api/auth/login`.
2. The backend performs a direct resource owner password grant call (OAuth2 Password Grant) to Keycloak at `http://localhost:8080/realms/ebiz/protocol/openid-connect/token` to exchange credentials for access/refresh tokens.

### C. Authorization Flow
1. **Role Mapping in Token:** When Keycloak generates the access token, the user's assigned roles are included inside the `realm_access.roles` JWT claim.
2. **Security Filter Chain:** During HTTP requests to secure routes, Spring Security reads the Bearer token.
3. **Granted Authorities Converter:** [KeycloakRealmRoleConverter.java](file:///c:/Users/shafe/Documents/code/ebiz_ecommerce/Ebiz-Backend/src/main/java/com/ebiz/backend/config/KeycloakRealmRoleConverter.java#L16) converts Keycloak realm roles into Spring Security authorities with a `ROLE_` prefix (e.g. `ROLE_admin`).
4. **Method Security:** Secure endpoints verify roles on execution via `@PreAuthorize("hasRole('admin')")` annotations (as seen in admin controllers like [AdminUserController.java](file:///c:/Users/shafe/Documents/code/ebiz_ecommerce/Ebiz-Backend/src/main/java/com/ebiz/backend/controller/admin/AdminUserController.java#L27)).
