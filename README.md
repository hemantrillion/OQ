# Booking OQ — Universal Operations & Queue Management Engine (Live Project Sem 7)

A full-stack, enterprise-grade Operations, Queue & Dynamic Resource Management System built with **Next.js 14 / Tailwind CSS**, **Golang**, **Gin Web Framework**, **MongoDB**, **JWT Authentication (HMAC-SHA256)**, and **DBML Relational Schema Generation**.

This project unifies and fixes the complete 18-part backend course by Akhil Sharma (implemented and debugged from Mohit Chandel's reference and Akhil Sharma's JWT project) into a single cohesive, production-ready system with a premium, high-density technical frontend interface.

---

## 🏛️ Architectural Highlights & Design System

### 1. Big Wong Layout & Flexbox Division ([bigwong.in](https://bigwong.in/))
- **Synchronized 3-Column Flex Layout**: Top categorical sub-navigation ribbons, left-side categorized filter rails, center food catalog cards, and right-side sticky live POS order cart and financial settlement ticket.
- **Structured Visual Dividers**: Crisp, high-contrast borders, category badges, and distinct segment breaks.

### 2. Odoo Restaurant POS Engine ([odoo.com/industries/restaurant](https://www.odoo.com/industries/restaurant))
- **Interactive Floor Plan**: Architectural table grid across multiple dining zones (*Main Dining Hall*, *Tatami VIP Room*, *Omakase Counter*, *Patio Terrace*).
- **Table Seating & Status Nodes**: Real-time status badges (`AVAILABLE` 🟢, `ORDERING` 🟡, `OCCUPIED` 🔴, `RESERVED` 🟣) with guest capacities and elapsed dining session counters.
- **Atomic Order Flow**: Table click seamlessly preselects the dining session in the POS order desk.

### 3. Tokyo Diner Technical Density ([tokyodiner.com](https://tokyodiner.com/))
- **Information-Rich Balanced Density**: Relies on clean typography, precise Japanese kanji glyphs (`卓`, `注`, `菜`, `伝`, `記`, `鍵`, `図`), portion sizing tags (`S` / `M` / `L`), preparation notes, and status rings rather than broken high-res external images.

### 4. Sexy Fish & Ebisu Luxury Atmosphere ([sexyfish.com](https://sexyfish.com/) & [ebisurestaurant.com](https://www.ebisurestaurant.com/))
- **Obsidian Dark & Champagne Gold Aesthetics**: Deep background `#0a0b0e`, elevated cards `#12141c`, champagne gold accents `#d4af37`, and glassy neon status glows.
- **Low-Scroll Efficiency**: Everything fits within focused, accessible viewport containers without vertical scroll fatigue.

### 5. Architectural Modularity (Inspired by `C:\Desktop\NEW PROJECT`)
- Component-driven Next.js 14 App Router structure with dedicated directories for `header`, `navigation`, `floor`, `pos`, `menu`, `invoices`, `notes`, `auth`, `database`, and `api-console`.

---

## 🗄️ Database & Schema Explorer (Core Feature)

The system includes a dedicated, first-class **Database & Schema View** showcasing:
1. **Field-by-Field BSON Schema Specifications**: Detailed specifications for all 8 collections (`user`, `menu`, `food`, `table`, `order`, `orderItem`, `invoice`, `notes`), including data types, primary keys, foreign key references, and validation rules.
2. **Interactive Entity-Relationship (ER) Diagram**: Visual relationship map documenting 1:N and 1:1 constraints between Tables, Orders, Order Items, Foods, Menus, Invoices, and Users.
3. **Live MongoDB Collection Document Browser**: Formatted, syntax-highlighted JSON viewer allowing live inspection and clipboard copying of all active database records.
4. **Aggregation Pipeline Blueprint Inspector**: Full structural breakdown of complex multi-table MongoDB aggregation pipelines executed in Go (e.g., `ItemsByOrder` `$lookup` joins, `$unwind`, and `$group` operations).

---

## 🔐 JWT Authentication & RBAC Center

Implements Akhil Sharma's dual-token JSON Web Token architecture:
- **Signed Claims**: Contains `email`, `first_name`, `last_name`, `uid`, `user_type` (`ADMIN` | `USER`), and expiration timestamp.
- **Access Token (24h)**: Injected automatically in the `token` and `Authorization: Bearer <token>` headers.
- **Refresh Token (168h / 7 Days)**: Stored in MongoDB for token renewal.
- **Real-Time JWT Decoder**: Interactive visual inspector showing token Header, Payload claims, expiration countdown, and signature verification state.
- **Password Hashing**: Cryptographic password hashing via `golang.org/x/crypto/bcrypt` with work factor cost 14.

---

## 🚀 Quick Start Guide

### Option A: Run Both Servers Simultaneously (One-Click)
Double-click `run-dev.bat` in the project root:
```cmd
run-dev.bat
```
This launches the Go Gin Backend on port `8080` and the Next.js Frontend on port `3000`.

### Option B: Run Services Individually

#### 1. Start the Golang Gin Backend Engine
```powershell
cd backend
go run main.go
```
*The Go server binds to `http://localhost:8080`.*

#### 2. Start the Next.js Frontend POS
```powershell
npm run dev
```
*Open your browser and navigate to `http://localhost:3000`.*

---

## 📋 Golang Gin REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Root API Health & Service Version | No |
| `GET` | `/api/health` | Liveness probe & PID | No |
| `POST` | `/users/signup` | Register new user with bcrypt hash & tokens | No |
| `POST` | `/users/login` | Verify credentials & issue dual JWT tokens | No |
| `GET` | `/users` | List user accounts (paginated) | Yes (JWT) |
| `GET` | `/users/:user_id` | Get specific user by UID | Yes (JWT) |
| `GET` | `/foods` | List foods (paginated `$slice`) | Yes (JWT) |
| `GET` | `/foods/:food_id` | Get single food by ID | Yes (JWT) |
| `POST` | `/foods` | Create new food item | Yes (JWT) |
| `PATCH` | `/foods/:food_id` | Update food item fields | Yes (JWT) |
| `GET` | `/menus` | List all menu categories | Yes (JWT) |
| `GET` | `/menus/:menu_id` | Get single menu category | Yes (JWT) |
| `POST` | `/menus` | Create new menu category | Yes (JWT) |
| `PATCH` | `/menus/:menu_id` | Update menu category | Yes (JWT) |
| `GET` | `/tables` | List all tables & capacities | Yes (JWT) |
| `GET` | `/tables/:table_id` | Get single table | Yes (JWT) |
| `POST` | `/tables` | Create new table | Yes (JWT) |
| `PATCH` | `/tables/:table_id` | Update table status/guests | Yes (JWT) |
| `GET` | `/orders` | List all orders | Yes (JWT) |
| `GET` | `/orders/:order_id` | Get single order | Yes (JWT) |
| `POST` | `/orders` | Create new order | Yes (JWT) |
| `PATCH` | `/orders/:order_id` | Update order | Yes (JWT) |
| `GET` | `/orderItems` | List all ordered line items | Yes (JWT) |
| `GET` | `/orderItems/:order_item_id` | Get single order item | Yes (JWT) |
| `GET` | `/orderItems-order/:order_id`| Joined order items via `$lookup` | Yes (JWT) |
| `POST` | `/orderItems` | Atomic batch order creation (`OrderItemPack`) | Yes (JWT) |
| `PATCH` | `/orderItems/:order_item_id`| Update order item | Yes (JWT) |
| `GET` | `/invoices` | List all invoices | Yes (JWT) |
| `GET` | `/invoices/:invoice_id` | Get invoice with joined order details | Yes (JWT) |
| `POST` | `/invoices` | Create invoice for order | Yes (JWT) |
| `PATCH` | `/invoices/:invoice_id` | Update invoice status / method | Yes (JWT) |
| `GET` | `/notes` | List kitchen / allergy notes | Yes (JWT) |
| `GET` | `/notes/:note_id` | Get single note | Yes (JWT) |
| `POST` | `/notes` | Create kitchen instruction note | Yes (JWT) |
| `PATCH` | `/notes/:note_id` | Update note text/priority | Yes (JWT) |

---

## 🛠️ Repository Directory Structure

```
c:\Desktop\Booking OQ\
├── backend/                             # Standalone Golang Gin MongoDB Backend
│   ├── controllers/                     # Clean, bug-free Gin controllers
│   │   ├── foodController.go
│   │   ├── invoiceController.go
│   │   ├── menuController.go
│   │   ├── notesController.go           # Fully implemented kitchen notes controller
│   │   ├── orderController.go
│   │   ├── orderItemsController.go
│   │   ├── tableController.go
│   │   └── userController.go
│   ├── database/
│   │   └── databaseConnection.go        # MongoDB connection with graceful ping
│   ├── helpers/
│   │   ├── authHelper.go                # RBAC role & UID validation
│   │   └── tokenHelper.go               # JWT HS256 claims & token generator
│   ├── middleware/
│   │   ├── authMiddleware.go            # JWT verification & claims injector
│   │   └── corsMiddleware.go            # Gin CORS middleware for Next.js
│   ├── models/                          # 8 BSON/JSON data models
│   ├── routes/                          # Gin route groupers
│   ├── go.mod
│   ├── go.sum
│   ├── main.go                          # Server entrypoint
│   └── run-backend.bat
├── app/                                 # Next.js 14 App Router
│   ├── globals.css                      # Luxury dark styling & scrollbars
│   ├── layout.tsx
│   └── page.tsx                         # Master coordination dashboard
├── components/                          # Modular React UI components
│   ├── api-console/                     # Interactive Go API test runner
│   ├── auth/                            # JWT authentication & claims decoder
│   ├── database/                        # Database & Schema Explorer (ER Graph)
│   ├── floor/                           # Odoo-style table floor plan
│   ├── header/                          # Top navigation & telemetry metrics
│   ├── invoices/                        # Billing & printable guest receipts
│   ├── menu/                            # Culinary catalog & price editor
│   ├── navigation/                      # Big Wong category ribbons
│   ├── notes/                           # Kitchen allergy & chef directive board
│   └── pos/                             # Split-screen POS ordering desk
├── lib/
│   ├── api-client.ts                    # Typed HTTP client for Go Gin API
│   ├── sample-data.ts                   # Realistic Japanese cuisine seed data
│   ├── schema-metadata.ts               # BSON schemas & ER relationship map
│   └── types.ts                         # TypeScript interfaces
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── run-dev.bat                          # One-click dual server launcher
└── README.md
```

---

## 🧪 Pre-configured Staff Accounts for Evaluation

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin (General Manager)** | `kenji.admin@toriya.com` | `Admin@1234` | Full Read/Write & User Management |
| **User (Floor Server)** | `aoi.server@toriya.com` | `Server@1234` | Orders, Floor Plan, Invoicing & Notes |
