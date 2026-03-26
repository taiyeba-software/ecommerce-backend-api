# ABOUT - Rajkonna Backend

This document is an interview-ready walkthrough of the Rajkonna backend project.
It explains what each folder/file does, how requests flow through the system, and how to answer common technical interview questions.

---

## 1) 30-Second Version (Most Important)

Rajkonna backend is a production-ready e-commerce API built with Node.js, Express, MongoDB, JWT, Redis, and ImageKit. It follows a clean layered architecture: routes -> controllers -> services -> models -> database. Authentication is JWT-based with HTTP-only cookies, and logout is implemented with Redis token blacklisting. Products support search/filter/sort/pagination, cart supports sync and total calculations, and orders are created from cart with stock handling. The codebase is modular, test-covered with Jest + Supertest + MongoDB Memory Server, and deployed-ready for cloud environments.
    
---

## 2) 1-2 Minute Technical Explanation

The app boots from `server.js` (server.js starts app), loads environment variables, connects MongoDB (`src/db/db.js`) and Redis (`src/services/redis.service.js`), then serves the Express app from `src/app.js`.

`src/app.js` wires middleware and routes:
- `/api/auth` for login/register/logout/profile
- `/api/products` for product CRUD + search
- `/api/cart` for cart operations
- `/api/orders` for order lifecycle

Each route file validates input using express-validator (`src/validators/*`) and then hands control to a controller (`src/controllers/*`). Controllers handle HTTP concerns and call services for reusable business logic. Models in `src/models/*` define MongoDB schemas and data constraints.

Auth flow is stateless JWT in cookies; middleware (`src/middlewares/auth.middleware.js`) verifies token and checks Redis blacklist so logout can invalidate a token before expiry. Product creation supports image upload via multer + ImageKit (`src/services/imagekit.service.js`). Cart and order flows recompute totals server-side using current product data, and order creation snapshots line-item prices (`priceAt`) for historical correctness.

Tests in `tests/*` cover auth, products, cart, and orders using Supertest with an in-memory MongoDB. External dependencies like ImageKit are mocked.

---

## 3) Deep Dive (Only If They Ask)

### 3.1 Architecture and Request Lifecycle

Request lifecycle:
1. Client sends HTTP request.
2. Express middleware runs (CORS, JSON parser, cookie parser).
3. Route-level validators run.
4. `handleValidationErrors` returns 400 if invalid.
5. `authenticateToken` runs for protected routes.
6. Controller executes use-case logic.
7. Service layer executes shared integrations/business rules.
8. Mongoose models persist/fetch data from MongoDB.
9. JSON response is returned.

Core architecture pattern:
- Routes: endpoint mapping + middleware chain
- Controllers: request/response orchestration
- Services: reusable domain/integration logic
- Models: schema + persistence behavior
- Middlewares: cross-cutting concerns (auth/validation)

### 3.2 Authentication Deep Dive

- Register:
  - Validates input in `src/validators/auth.validator.js`
  - Creates user via `src/controllers/auth.controller.js`
  - Password hash happens automatically by user model pre-save hook

- Login:
  - Compares submitted password with stored hash
  - Signs JWT with user id/email/role
  - Stores token in HTTP-only cookie

- Protecting routes:
  - `src/middlewares/auth.middleware.js` reads cookie token
  - Verifies signature and expiry
  - Checks if token is blacklisted in Redis
  - Attaches decoded identity to `req.user`

- Logout:
  - Adds token to Redis blacklist with TTL
  - Clears auth cookie

Why this matters:
- JWT gives stateless scalability
- Redis blacklist enables immediate logout revocation

### 3.3 Product Flow Deep Dive

`src/controllers/product.controller.js` handles:
- Public list endpoint with pagination, search, filters, sort
- Public get-by-id with ObjectId validation
- Admin/seller-only create/update/delete

Search behavior:
- Uses MongoDB text index over name/description/category
- Supports category and price range filters
- Sort options include price and newest

Delete behavior:
- Soft-delete (archive) if product is referenced by orders
- Hard-delete when safe

### 3.4 Cart Flow Deep Dive

`src/controllers/cart.controller.js` handles:
- Add item (create cart if missing)
- Sync guest cart after login
- Get cart with recomputed totals
- Update/remove/clear items

Notable logic:
- Uses live product prices to prevent manipulated totals
- Calculates delivery charge and discount server-side
- Returns warnings for missing/deleted products

### 3.5 Order Flow Deep Dive

`src/services/order.service.js` and `src/controllers/order.controller.js`:
- Create order from current cart
- Snapshot each line item price into `priceAt`
- Optionally reserve inventory
- Compute subtotal, delivery charge, discount, total
- Clear cart after successful order creation
          
Access control:
- Users can see/delete their own orders
- Admin can list/manage all orders

### 3.6 Image Upload Deep Dive

Product image upload path:
1. Client sends multipart/form-data to create product endpoint.
2. Multer parses files in memory.
3. Controller loops files and calls `uploadImage()`.
4. `src/services/imagekit.service.js` uploads each file to ImageKit.
5. Returned CDN URLs are saved in `product.images`.

Bulk uploader:
- `uploadImages.js` can seed product images and product records from local files.

### 3.7 Redis Usage Deep Dive

Redis in this project is used for token blacklist, not generic response caching.

Benefits:
- Fast auth revocation checks
- TTL-based auto-cleanup

Tradeoff:
- If Redis is unavailable, blacklist checks may fail open depending on environment handling.

---

## Folder and File Guide (Complete)

## Root

- `server.js`
  - Main entry point.
  - Loads env config, initializes connections, starts HTTP server.

- `package.json`
  - Scripts, runtime dependencies, and test/dev tooling.

- `package-lock.json`
  - Locked dependency tree for reproducible installs.

- `jest.config.js`
  - Jest setup and mock mapping configuration.

- `README.md`
  - Public project overview, setup steps, and endpoint summary.

- `uploadImages.js`
  - Script to upload product images and create product records.

- `TODO.md`
  - Internal notes/tasks.

- `.env` / `.env.example`
  - Environment variables for local/production configuration.

- `.gitignore`
  - Git ignore rules.

- `uploads/`
  - Local image source folder used by the upload script.

## src

### src/app.js
- Builds Express app and mounts all API route modules.

### src/db

- `db.js`
  - MongoDB connection helper through Mongoose.

### src/middlewares

- `auth.middleware.js`
  - Verifies JWT from cookies, checks Redis blacklist, sets `req.user`.

### src/models

- `user.model.js`
  - User schema, password hashing hook, password compare method, roles.

- `product.model.js`
  - Product schema, image list, category/status fields, text search index.

- `cart.model.js`
  - Cart schema with user + item list and derived totals behavior.

- `order.model.js`
  - Order schema with snapshots (`priceAt`), totals, status, payment fields.

### src/routes

- `auth.route.js`
  - Auth/profile endpoints and route-level validators.

- `product.route.js`
  - Product endpoints with upload middleware and auth where required.

- `product.routes.js`
  - Alternate/older product route file (looks redundant compared to `product.route.js`).

- `cart.routes.js`
  - Cart item lifecycle endpoints and sync endpoint.

- `order.routes.js`
  - Order create/list/get/delete endpoints.

### src/controllers

- `auth.controller.js`
  - Register, login, logout, auth cookie management.

- `profile.controller.js`
  - Read/update profile data (including admin query behavior).

- `product.controller.js`
  - Product CRUD, list query handling, image integration path.

- `cart.controller.js`
  - Cart add/sync/get/update/remove/clear logic.

- `order.controller.js`
  - Order listing, retrieval, creation orchestration, and deletion.

### src/services

- `imagekit.service.js`
  - Wraps ImageKit upload operation and filename generation.

- `redis.service.js`
  - Redis client management and token blacklist helpers.

- `order.service.js`
  - Core order business logic and permission checks.

### src/validators

- `validate.js`
  - Shared validation result handler middleware.

- `auth.validator.js`
  - Register/login field rules.

- `profile.validator.js`
  - Profile update field rules.

- `product.validator.js`
  - Product create/update field rules.

- `cart.validator.js`
  - Cart payload and param validation rules.

- `order.validator.js`
  - Order creation/id validation rules.

## tests

- `setup.js`
  - Global test lifecycle and in-memory MongoDB setup/teardown.

- `auth.register.test.js`
  - Registration success/failure cases.

- `auth.login.test.js`
  - Login correctness and invalid credential cases.

- `auth.logout.test.js`
  - Logout behavior and token invalidation path.

- `auth.profile.test.js`
  - Profile fetch/update and auth checks.

- `product.test.js`
  - Product creation including upload/auth role behavior.

- `product.get.test.js`
  - Product listing filters/search/sort/pagination behavior.

- `product.getById.test.js`
  - Product fetch by id including invalid/not found cases.

- `product.update.test.js`
  - Product update role/validation flows.

- `product.delete.test.js`
  - Product delete behavior (archive vs delete).

- `cart.add.test.js`
  - Add-to-cart behavior and stock checks.

- `cart.get.test.js`
  - Cart totals and response shape.

- `cart.sync.test.js`
  - Guest-to-user cart merge behavior.

- `cart.update.test.js`
  - Quantity updates and recalculation.

- `cart.remove.test.js`
  - Item removal behavior.

- `cart.clear.test.js`
  - Full cart clear behavior.

- `order.create.test.js`
  - Order creation from cart and totals/inventory handling.

- `order.list.test.js`
  - Role-based order listing.

- `order.get.test.js`
  - Single-order access control.

- `order.delete.test.js`
  - Order deletion permission logic.

- `__mocks__/imagekit.js`
  - ImageKit SDK mock for deterministic tests.

- `__mocks__/uuid.js`
  - UUID mock behavior helper.

---

## Interview Q&A Bank

### Q: How does authentication work?

Short answer:
- User registers with hashed password.
- User logs in and receives JWT in HTTP-only cookie.
- Protected endpoints use middleware to verify JWT and check Redis blacklist.
- Logout blacklists token and clears cookie.

Long answer:
- Input validation is applied before controller logic.
- Password is never compared in plain text; bcrypt compare is used.
- Middleware prevents access when token is missing/invalid/expired/blacklisted.
- Role from JWT (`user/seller/admin`) is used for authorization decisions in controllers.

### Q: How does data flow in this project?

Short answer:
- Route -> validator -> middleware -> controller -> service -> model -> DB -> response.

Long answer:
- Routes define endpoint contracts.
- Validators keep invalid data out.
- Middleware injects auth context.
- Controllers coordinate use-cases and return HTTP responses.
- Services hold reusable domain logic/integration logic.
- Models enforce schema and persist data to MongoDB.

### Q: What is middleware doing here?

- Authentication middleware checks token validity and blacklist status.
- Validation middleware (`handleValidationErrors`) standardizes 400 errors.
- Express-level middleware handles CORS, JSON body parsing, and cookies.
- Together they keep controllers focused on business logic.

### Q: How does image upload work?

- Product creation endpoint accepts multipart files using multer.
- Files are buffered in memory and passed to `uploadImage()` service.
- Service uploads files to ImageKit and receives CDN URLs.
- URLs are saved into product `images` array in MongoDB.

### Q: How does API call work end-to-end?

Example `POST /api/orders`:
1. Request hits route and validators.
2. Auth middleware verifies user identity.
3. Controller calls order service.
4. Service reads cart and products, calculates totals, reserves stock.
5. Service writes order and clears cart.
6. Controller returns structured JSON response.

### Q: How does this UI render?

Important clarification:
- This repository is backend-only, so UI rendering is not implemented here.

How frontend would use this backend:
- Frontend calls APIs (e.g., `GET /api/products`) to fetch JSON data.
- UI layer (React/Vue/etc.) renders product cards, cart rows, and order history from API responses.
- Auth state is maintained via cookie-based session token managed by backend responses.

---

## 2-3 Standout Features from This Project

1. JWT + Redis blacklist logout strategy
- Combines stateless auth performance with immediate logout invalidation.

2. Searchable product catalog with filters and pagination
- Supports practical e-commerce discovery use-cases (search/category/price/sort/page).

3. Order creation from cart with price snapshot and stock handling
- Preserves historical order correctness and reduces pricing inconsistencies.

---

## Quick Interview Delivery Script

Use this exact speaking pattern:

1. 30 seconds:
- "It is a modular Express backend for e-commerce with JWT auth, Redis-backed logout revocation, MongoDB models, and ImageKit media handling. It has full product/cart/order APIs with tests."

2. 1-2 minutes:
- "Requests move from routes and validators to controllers and services. Auth middleware validates cookie JWT and blacklist status. Product APIs support search/filter/pagination and image uploads. Cart recalculates totals server-side, and order service creates orders from cart with stock and amount calculations."

3. Deep dive (if asked):
- Explain one flow in detail (Auth, Product Upload, or Order Creation) with endpoint + middleware + controller + service + model steps.

---

## Suggested Improvement Talking Points (If Interviewer Asks)

- Add rate limiting for auth and write-heavy endpoints.
- Use MongoDB transactions for stock update + order creation atomicity.
- Move pricing/discount/shipping rules to configurable policy layer.
- Remove redundant route file (`product.routes.js`) to reduce confusion.
- Add structured request logging and monitoring hooks.

---

## Final Summary

This backend demonstrates practical production engineering:
- clear architecture,
- secure auth patterns,
- cloud integrations,
- business flows for products/cart/orders,
- and meaningful automated tests.

Use this document as your interview speaking guide and as your reference when answering "how it works" questions.