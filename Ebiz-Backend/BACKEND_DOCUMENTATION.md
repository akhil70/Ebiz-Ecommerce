# Ebiz-Backend Comprehensive Documentation

This document serves as the central architectural and operational guide for the **Ebiz-Backend** project.

## 1. Tech Stack Overview

* **Framework:** Spring Boot (Java 17)
* **Database:** MongoDB
* **Security & Auth:** Keycloak (OAuth2 Resource Server) with custom Realm Role Converters
* **Message Broker:** RabbitMQ (used for async metadata syncing to external parties, e.g., Facebook Graph API)
* **Cloud Storage:** AWS S3 (SDK v2) for product images via Pre-signed URLs
* **Payment Gateway:** Stripe
* **Email Service:** Mailtrap (SMTP)
* **Build Tool:** Maven

---

## 2. Core Architecture & Modules

The backend is modularized into several logical layers inside `src/main/java/com/ebiz/backend/`:

### Security (`/config`)
* **Keycloak Integration:** The application is secured as an OAuth 2.0 Resource Server mapping JWT tokens from a Keycloak instance.
* Custom Role Conversions are used to bridge Keycloak's `realm_access.roles` perfectly into Spring Security authorities allowing strict granular endpoints (`hasRole('admin')`).

### Admin API (`/controller/admin`)
Secured routes accessible **only** to Admin roles. These include:
* `AdminBrandController` / `AdminCategoryController` / `AdminSubcategoryController`: Full CRUD mapping for the store hierarchy.
* `AdminProductController`: Advanced product creation and updates.
* `AdminUserController` & `AdminCustomerController`: Managing system access and gathering purchase analytics.
* `AdminOrderController`: Managing fulfillments and tracking.
* `AdminSellerApprovalController`: Seller onboarding features.

### Public & User API (`/controller/public_api` & Root Controllers)
* `AuthController`: Managing initial state and custom Keycloak initializations.
* `AwsS3Controller`: **Secure Image Direct-Uploads.** Rather than storing Base64 strings in the database, this exposes `/api/s3/presigned-url`. The frontend requests a cryptographic URL to push files directly to AWS S3, drastically improving backend performance.
* `ProductController` / `CartController` / `OrderController`: Handling the primary e-commerce flows (browsing, adding to cart, placing orders).
* `SocialCheckoutController`: Integrations for alternative checkouts.
* `StripeWebhookController`: Validating and processing asynchronous payment events directly from Stripe.

### Integrations (`/listener` & `/service`)
* **RabbitMQ & Facebook Graph API:** When a product is updated, `ProductService` fires a message to RabbitMQ. The `SocialMediaSyncListener` catches these and pushes the catalog changes asynchronously to the Facebook Graph API to automate dynamic ad campaigns without blocking the user interface.
* **AWS S3 local emulator:** Supports LocalStack & MinIO via endpoint overrides (`aws.s3.endpoint`). 

---

## 3. Configuration Properties

Everything is driven by `src/main/resources/application.yml`. Important configuration variables to note or supply:

* `spring.data.mongodb.uri`: Connection string to MongoDB.
* `spring.security.oauth2.resourceserver.jwt.issuer-uri`: The Keycloak realm URL (e.g., `http://localhost:8080/realms/ebiz`).
* `keycloak.admin.*`: Secret keys specifically used by the backend to talk *to* Keycloak programmatically.
* `aws.access.key.id` / `aws.secret.access.key` / `aws.region`: Used for S3 direct uploads. 
   * **Local Testing Note:** To test without credentials, we have a mock local environment using MinIO. See `LOCAL_S3_SETUP.md` at the project root for detailed instructions.

---

## 4. Run & Build Instructions

### Running Locally
To spin up the service, ensure `MongoDB`, `RabbitMQ`, and `Keycloak` are running, then execute:
```bash
mvn clean compile spring-boot:run
```

### Dependency Notes
If you are missing `software.amazon.awssdk:s3-presigner`, note that in AWS SDK for Java V2, the presigner is naturally bundled within the base `s3` artifact dependencies. Avoid declaring it individually as Maven will flag it missing.

### Automated Testing (If applicable)
Run all tests using:
```bash
mvn test
```
