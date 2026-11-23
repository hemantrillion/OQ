import docx
from docx.shared import Inches, Pt, RGBColor
from styles import (
    add_chapter_title, add_heading_2, add_heading_3,
    add_paragraph, add_bullet, add_callout, add_diagram, add_table
)

def build_chapter_3(doc):
    add_chapter_title(doc, 3, "SYSTEM ARCHITECTURE, STRUCTURAL MODELING & MATHEMATICS")

    # -------------------------------------------------------------
    # 3.1 Architectural Philosophy
    # -------------------------------------------------------------
    add_heading_2(doc, "3.1 Architectural Philosophy: Zero-Code Schema Synthesis & Partner Ecosystem")

    add_paragraph(doc, "The architectural identity of Booking Omni Queue emerges from an intentional synthesis of three core engineering principles:")

    add_bullet(doc, "Eradicating the software engineering barrier by allowing non-technical business operators to express operational requirements in conversational natural language (bilingual Hindi and English). The engine automatically synthesizes open, standard Database Markup Language (DBML) specifications that compile into production database tables in seconds.", "1. AI-First Schema Synthesis: ")
    add_bullet(doc, "Rejects frivolous whitespace, slow multi-page wizard navigation, and bloated SaaS modals. Prioritizes a clean, high-density split-screen console featuring a live slot calendar grid, real-time queue timeline, and an interactive Database Schema Explorer directly in the DOM.", "2. Information-Dense Ergonomics: ")
    add_bullet(doc, "Every onboarded merchant is automatically integrated into a shared, geolocated partner network powered by OpenStreetMap Nominatim. End users discover nearby doctors, salons, consultants, and sports arenas from a single unified portal.", "3. Cumulative Partner Business Ecosystem: ")
    add_bullet(doc, "An obsidian (#0a0b0e) background paired with champagne gold (#d4af37) accents provides ultra-high contrast that prevents operator eye strain during long operational shifts.", "4. Luxury Obsidian Contrast: ")

    diagram_layout = r"""
+---------------------------------------------------------------------------------------------------+
|               BOOKING OMNI QUEUE: UNIFIED MANAGEMENT CONSOLE ARCHITECTURE                         |
+---------------------------------------------------------------------------------------------------+
|  [HEADER: BUSINESS TITLE | BILINGUAL TOGGLE (EN/HI) | ACTIVE TOKENS: 14 | SRE LATENCY: 8.4ms]     |
+------------------------------------+--------------------------------+-----------------------------+
|  COLUMN 1: CONVERSATIONAL & SLOTS  |  COLUMN 2: DYNAMIC CALENDAR    |  COLUMN 3: LIVE QUEUE & POS |
|  (Width: 26% | Flex-Col)           |  (Width: 46% | Responsive Grid)|  (Width: 28% | Sticky Desk) |
|  --------------------------------- |  ----------------------------- |  -------------------------- |
|  [AI BILINGUAL PROMPT ENGINE]      |  DATE: TODAY (13 NOV 2026)     |  ACTIVE QUEUE: 4 WAITING    |
|  "3 chairs, 30 min haircuts"       |  STATIONS / CHAIRS:            |  EST. WAIT TIME: 18 MINS    |
|  [ + GENERATE / UPDATE DBML ]      |  [CHAIR 1] [CHAIR 2] [CHAIR 3] |  -------------------------- |
|                                    |  ----------------------------- |  TOKEN #A-104: Dr. Sharma   |
|  SCHEMA EXPLORER SHORTCUT:         |  09:00 - 09:30 [BOOKED: Aman]  |  Status: IN SERVICE (CH-1)  |
|  - View Visual DBML Graph          |  09:30 - 09:40 [BUFFER: Clean] |  -------------------------- |
|  - Inspect Generated DDL Tables    |  09:40 - 10:10 [AVAILABLE]     |  TOKEN #A-105: Rahul Verma  |
|                                    |  10:10 - 10:40 [BOOKED: Priya] |  Status: CALLED TO DESK     |
|  PARTNER NETWORK DISCOVERY:        |  10:40 - 10:50 [BUFFER: Clean] |  -------------------------- |
|  - Nearby Clinics & Salons (12)    |  10:50 - 11:20 [AVAILABLE]     |  [ ISSUE WALK-IN TOKEN ]    |
|  - OpenStreetMap Geocache Active   |                                |  [ GENERATE QR PASS ]       |
+------------------------------------+--------------------------------+-----------------------------+
"""
    add_diagram(doc, diagram_layout, "Figure 3.1: Unified Management Console Architecture")

    # -------------------------------------------------------------
    # 3.2 C4 Architecture Model
    # -------------------------------------------------------------
    add_heading_2(doc, "3.2 C4 Architecture Model (Context, Container, Component, Code)")

    add_paragraph(doc, "To bridge high-level operational concepts with microservice execution, Booking Omni Queue is structured under the formal C4 Architectural Model (Context, Containers, Components, and Code) formulated by Simon Brown (2018).")

    add_heading_3(doc, "3.2.1 C4 Level 1: System Context Diagram")
    add_paragraph(doc, "The System Context diagram establishes the operational boundary of Booking Omni Queue and its interactions with four primary human actors and external services:")

    diagram_c1 = r"""
+---------------------------------------------------------------------------------------------------+
|               C4 LEVEL 1: SYSTEM CONTEXT DIAGRAM FOR BOOKING OMNI QUEUE                           |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [NON-TECHNICAL BUSINESS OPERATOR]              [END-USER CUSTOMER / PATRON]                      |
|  (Barbers, Doctors, Tutors, Managers)           (Books slots, views queue, receives QR pass)      |
|         |                                              |                                          |
|         v (Speaks/Types in Hindi/English)              v (Browses Marketplace & Reserves)         |
|  +---------------------------------------------------------------------------------------------+  |
|  |                            BOOKING OMNI QUEUE CORE PLATFORM                                 |  |
|  |  - AI Prompt-to-DBML Translation Engine (POST /api/ai/translate-schema)                     |  |
|  |  - Automated DDL Database Schema Migration Engine (POST /api/schema/migrate)                 |  |
|  |  - Dynamic 3-Way Slot Allocation Engine (POST /api/slots/allocate)                          |  |
|  |  - Kendall M/M/c Queue Ticketing & Wait Estimation Engine (POST /api/queue/token)           |  |
|  |  - Cumulative Partner Marketplace Discovery (OpenStreetMap Nominatim Integration)           |  |
|  +---------------------------------------------------------------------------------------------+  |
|         |                                              |                                          |
|         v                                              v                                          |
|  [EXTERNAL AI ENGINE]                           [GEOLOCATION / OPENSTREETMAP]                     |
|  (LLM Prompt Completion API)                   (Nominatim Geocoding API)                         |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
"""
    add_diagram(doc, diagram_c1, "Figure 3.1: C4 Level 1: System Context Diagram of Booking Omni Queue")

    add_heading_3(doc, "3.2.2 C4 Level 2: Container Diagram")
    add_paragraph(doc, "The Container diagram details the high-level technical boundaries, execution runtimes, and communication protocols connecting the frontend, microservices, and datastores:")

    diagram_c2 = r"""
+---------------------------------------------------------------------------------------------------+
|               C4 LEVEL 2: CONTAINER ARCHITECTURE DIAGRAM                                          |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [CLIENT BROWSER / MOBILE DEVICE]                                                                 |
|         |                                                                                         |
|         v HTTPS (Port 443 / 3000)                                                                 |
|  +---------------------------------------------------------------------------------------------+  |
|  | [NEXT.JS 15 APP ROUTER FRONTEND] (React 19, TypeScript, Tailwind CSS, Lucide)                |  |
|  | - Bilingual Onboarding UI (/onboarding)                                                       |  |
|  | - Interactive Schema Explorer (DatabaseSchemaExplorer.tsx)                                  |  |
|  | - Real-Time Slot Calendar & Station Grid                                                      |  |
|  | - Cumulative Partner Discovery Marketplace & Map                                            |  |
|  +---------------------------------------------------------------------------------------------+  |
|         |                                                                                         |
|         v Typed REST / JSON (Port 8080)                                                           |
|  +---------------------------------------------------------------------------------------------+  |
|  | [GOLANG GIN MICROSERVICE BACKEND] (Go 1.22 Runtime, Port 8080)                                |  |
|  | - AI DBML Compiler Pipeline & AST Validator                                                    |  |
|  | - Automated DDL Migration Engine (PostgreSQL / MongoDB)                                        |  |
|  | - 3-Way Slot Allocation & Buffer Engine                                                        |  |
|  | - Kendall Queue Manager & HMAC QR Pass Generator                                               |  |
|  +---------------------------------------------------------------------------------------------+  |
|         |                                              |                                          |
|         v TCP / RESP (Port 6379)                       v TCP / Wire Protocol                      |
|  +-------------------------------------+      +------------------------------------------------+  |
|  | [REDIS DISTRIBUTED MUTEX & CACHE]   |      | [MULTI-TENANT RELATIONAL / DOCUMENT DATASTORE] |  |
|  | - Redlock Distributed Mutex Locks   |      | - PostgreSQL / MongoDB BSON Engine             |  |
|  | - Atomic Queue Token Counters       |      | - Stores Businesses, Stations, Services, Slots |  |
|  | - Geospatial Partner Cache (GEOADD) |      | - Bookings, Tokens, Customers, DBML Schemas    |  |
|  +-------------------------------------+      +------------------------------------------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
"""
    add_diagram(doc, diagram_c2, "Figure 3.2: C4 Level 2: Container Architecture & Microservice Interactions")

    add_heading_3(doc, "3.2.3 C4 Level 3: Component Diagram for Golang Backend & Next.js Frontend")
    add_paragraph(doc, "The Level 3 Component diagram decomposes both the compiled Golang microservice and the Next.js presentation tier into their respective functional modules:")

    diagram_c3 = r"""
+---------------------------------------------------------------------------------------------------+
|               C4 LEVEL 3: DETAILED COMPONENT ARCHITECTURE DIAGRAM                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [NEXT.JS 15 APP ROUTER CLIENT COMPONENTS]                                                        |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|  | LanguageContext (Bilingual)  |  | SlotCalendarGrid (Stations)  |  | SchemaExplorer (Canvas) |  |
|  | Manages Hindi/English State  |  | 3-Way Grid, Buffer Overlays  |  | Interactive DBML Vis.   |  |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|  | QueueBoard (Live Tokens)     |  | PartnerDiscoveryMap (OSM)    |  | PassModal (HMAC QR)     |  |
|  | Real-Time Wait Time Displays |  | Geospatial Partner Radius    |  | Scannable Mobile Ticket |  |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|                                                                                                   |
|  [GOLANG GIN MICROSERVICE MODULES (PORT 8080)]                                                    |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|  | AuthMiddleware (JWT / RBAC)  |  | SchemaController (AI DBML)   |  | MigrationEngine (DDL)   |  |
|  | Validates Dual Token Claims  |  | Ingests Prompts, Generates   |  | Compiles AST, Migrates  |  |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|  | SlotController (3-Way Alloc) |  | QueueController (Tokens)     |  | GeoController (Nominatim)|  |
|  | Redlock Mutex, Buffer Checks |  | Kendall M/M/c Engine, Passes |  | Redis GEO Cache Mirror  |  |
|  +------------------------------+  +------------------------------+  +-------------------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
"""
    add_diagram(doc, diagram_c3, "Figure 3.3: C4 Level 3: Detailed Component Architecture Diagram")

    # -------------------------------------------------------------
    # 3.3 AI-to-DBML Pipeline Architecture
    # -------------------------------------------------------------
    add_heading_2(doc, "3.3 The AI-to-DBML Pipeline & Automated DDL Migration Engine Architecture")

    add_paragraph(doc, "The core innovation of Booking Omni Queue is its ability to translate ambiguous, conversational natural language business descriptions into fully normalized, production-grade database structures. Figure 3.5 illustrates the multi-stage compilation pipeline:")

    diagram_dbml_pipe = r"""
+---------------------------------------------------------------------------------------------------+
|               AI NATURAL LANGUAGE TO DBML AST COMPILATION PIPELINE                                |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [STAGE 1: NATURAL LANGUAGE INPUT]                                                                |
|  "Mera clinic subah 10 baje khulta hai, 2 cabins hain, 20 min consultation, lunch 1-2 PM"         |
|                                         |                                                         |
|                                         v                                                         |
|  [STAGE 2: BILINGUAL LEXICAL NORMALIZATION & TOKENIZATION]                                        |
|  - Detect Language: Mixed Hindi/English (Hinglish)                                                |
|  - Temporal Extraction: OperatingHours [10:00 - 20:00], Break [13:00 - 14:00]                      |
|  - Resource Extraction: StationCount = 2, Entity = 'Cabin'                                        |
|  - Service Extraction: Duration = 20 mins, DefaultBuffer = 5 mins                                 |
|                                         |                                                         |
|                                         v                                                         |
|  [STAGE 3: LLM PROMPT FRAMING WITH STRICT DBML GRAMMAR]                                           |
|  - System Prompt instructs LLM on valid DBML constructs: Table, fields, type, pk, ref: > - <     |
|  - Enforces naming conventions: snake_case, foreign key integrity                                 |
|                                         |                                                         |
|                                         v                                                         |
|  [STAGE 4: DBML AST PARSING & DAG CYCLE DETECTION]                                                |
|  - Validates syntax using DBML AST parser                                                         |
|  - Checks Directed Acyclic Graph (DAG) to ensure zero circular foreign key relationships         |
|                                         |                                                         |
|                                         v                                                         |
|  [STAGE 5: AUTOMATED DDL COMPILER (POST /api/schema/migrate)]                                     |
|  - Compiles DBML AST into executable SQL CREATE TABLE / MongoDB BSON schemas                      |
|  - Executes transactional migration on database with audit logging                                |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
"""
    add_diagram(doc, diagram_dbml_pipe, "Figure 3.5: AI Natural Language Prompt to DBML AST Compilation Flowchart")

    add_heading_3(doc, "3.3.1 Grammar Formulation for Generated DBML Specifications")
    add_paragraph(doc, "To ensure that the LLM produces deterministic, non-malformed schema representations, system prompts enforce a strict context-free grammar G = (V, Σ, R, S) where every table must declare an explicit primary key (`id [pk]`), foreign keys must utilize standard relational indicators (`ref: > parent.id`), and temporal columns must utilize standardized timestamp types.")

    # -------------------------------------------------------------
    # 3.4 Mathematical Foundations: Kendall's M/M/c/K Queueing
    # -------------------------------------------------------------
    add_heading_2(doc, "3.4 Mathematical Foundations: Kendall's Notation & M/M/c/K Queueing Formulation")

    add_paragraph(doc, "To provide deterministic, non-arbitrary waiting time estimations and prevent waiting room saturation, Booking Omni Queue is mathematically grounded in Kendall's queueing notation: M/M/c/K/∞/FIFO:")

    add_bullet(doc, "Customer arrivals occur according to a Poisson process with average arrival rate λ (customers per hour). Inter-arrival times follow an exponential distribution with parameter λ.", "• Arrival Process (M): ")
    add_bullet(doc, "Service times across all stations follow an exponential distribution with average service rate μ (services completed per hour per station).", "• Service Distribution (M): ")
    add_bullet(doc, "The business operates c identical parallel service stations (e.g. c barber chairs, c medical examination cabins, or c sports turf lanes).", "• Number of Servers (c): ")
    add_bullet(doc, "The physical waiting room has a finite system capacity K. Once K customers are present (c being served + K - c waiting in the lobby), arriving customers are turned away (queue balking), preventing dangerous lobby crowding.", "• System Capacity (K): ")
    add_bullet(doc, "Tokens are served in strict First-In, First-Out sequence based on their cryptographic token timestamp.", "• Queue Discipline (FIFO): ")

    add_paragraph(doc, "The system traffic intensity (utilization factor ρ) is defined as:")
    add_paragraph(doc, "    ρ = λ / (c · μ)", bold=True)
    add_paragraph(doc, "For system stability without infinite queue explosion, we must have ρ < 1.")

    add_paragraph(doc, "Under steady-state conditions, the probability that an arriving customer must wait in the queue (the Erlang-C formula, P_W) is derived as:")
    add_paragraph(doc, "    P_W = [ ( (c·ρ)^c / c! ) · ( 1 / (1 - ρ) ) ] / [ Σ_{k=0}^{c-1} ( (c·ρ)^k / k! ) + ( (c·ρ)^c / c! ) · ( 1 / (1 - ρ) ) ]", bold=True)

    add_paragraph(doc, "The expected number of waiting customers in the queue (L_q) is:")
    add_paragraph(doc, "    L_q = P_W · [ ρ / (1 - ρ) ]", bold=True)

    add_paragraph(doc, "Applying Little's Law, the expected queue waiting time (W_q) for an arriving customer is dynamically calculated as:")
    add_paragraph(doc, "    W_q = L_q / λ", bold=True)

    add_heading_3(doc, "3.4.3 Numerical Worked Example: Queue Telemetry for a 3-Chair Salon & 2-Doctor Clinic")
    add_paragraph(doc, "To demonstrate how the microservice calculates live telemetry in real-time, consider two concrete numerical scenarios:")

    add_paragraph(doc, "Case A: Neighborhood Barbershop with c = 3 Chairs:\n"
        "• Arrival rate λ = 5.0 customers/hour (one arrival every 12 minutes).\n"
        "• Average haircut duration = 30 minutes, so service rate μ = 2.0 customers/hour per chair.\n"
        "• Total service capacity c · μ = 3 · 2.0 = 6.0 customers/hour.\n"
        "• Utilization ρ = λ / (c · μ) = 5.0 / 6.0 = 0.833 (83.3% busy).\n"
        "• Calculating P_0: [ 1 + (2.5) + (2.5^2 / 2) + (2.5^3 / 6) · (1 / (1 - 0.833)) ]^(-1) = 0.0525.\n"
        "• Erlang-C Waiting Probability P_W = 0.702 (70.2% chance an arriving walk-in must wait).\n"
        "• Expected queue length L_q = P_W · [ ρ / (1 - ρ) ] = 0.702 · [ 0.833 / 0.167 ] = 3.51 customers.\n"
        "• Expected wait time W_q = L_q / λ = 3.51 / 5.0 = 0.702 hours = 42.1 minutes.\n"
        "When an appointment customer arrives, the system allocates an exact time slot and instructs walk-in patrons on their mobile passes: 'Current estimated wait time is 42 minutes'.")

    add_paragraph(doc, "Case B: Outpatient Medical Clinic with c = 2 Examination Cabins:\n"
        "• Arrival rate λ = 3.2 patients/hour.\n"
        "• Average consultation duration = 24 minutes + 6 min sanitization buffer = 30 minutes (μ = 2.0 patients/hour per doctor).\n"
        "• Total capacity c · μ = 2 · 2.0 = 4.0 patients/hour.\n"
        "• Utilization ρ = 3.2 / 4.0 = 0.800 (80.0% busy).\n"
        "• Erlang-C Waiting Probability P_W = 0.711.\n"
        "• Expected queue length L_q = 0.711 · [ 0.800 / 0.200 ] = 2.84 patients in waiting room.\n"
        "• Expected wait time W_q = 2.84 / 3.2 = 0.888 hours = 53.3 minutes.\n"
        "By dynamically updating these values every 30 seconds via GET /api/queue/stats, patients can wait in nearby cafes or at home until their token is called.")

    add_heading_3(doc, "3.4.1 Erlang-B Loss Model vs. Erlang-C Delay Model Dynamics")
    add_paragraph(doc, "In physical service establishments with zero waiting lobby capacity (e.g., an unmanned automated turf where players cannot wait inside), the system behaves as an Erlang-B loss system (M/M/c/c). The blocking probability P_block (the probability that an arriving customer finds all stations occupied and is immediately rejected) is given by the Erlang-B formula:")
    add_paragraph(doc, "    B(c, A) = [ ( A^c / c! ) ] / [ Σ_{k=0}^{c} ( A^k / k! ) ]", bold=True)
    add_paragraph(doc, "where A = λ / μ is the total offered load in Erlangs. Booking Omni Queue dynamically transitions its queueing engine between Erlang-C (delay model for businesses with waiting rooms) and Erlang-B (loss model for strict time-slot turfs and studios), guaranteeing mathematically accurate operational behavior across all commercial categories.")

    add_heading_3(doc, "3.4.2 Concurrency Constraint: Dynamic 3-Way Slot Allocation Equation")
    add_paragraph(doc, "In addition to queue wait times, slot allocation must satisfy the 3-Way Resource Feasibility Condition. An appointment slot request R is defined as a tuple:")
    add_paragraph(doc, "    R = (S_id, R_id, [t_start, t_end], B_margin)", bold=True)
    add_paragraph(doc, "A slot R is valid if and only if for all existing confirmed bookings B_k on resource R_id:")
    add_paragraph(doc, "    [t_start - B_margin, t_end + B_margin] ∩ [t_start(B_k), t_end(B_k)] = ∅", bold=True)
    add_paragraph(doc, "This mathematical condition guarantees that no appointment overlaps with another appointment on the same physical station, while strictly reserving the required setup/sanitization buffer margin B_margin.")

    # -------------------------------------------------------------
    # 3.5 Data Architecture: DBML Specifications & Schemas
    # -------------------------------------------------------------
    add_heading_2(doc, "3.5 Data Architecture: Dynamic DBML Specifications & Multi-Tenant Relational Schemas")

    add_paragraph(doc, "Booking Omni Queue organizes multi-tenant operational data across eight core normalized entities. Below is the complete formal DBML specification generated for a universal booking tenant:")

    dbml_code = r"""
// =====================================================================
// BOOKING OMNI QUEUE: UNIVERSAL MULTI-TENANT DBML SPECIFICATION
// =====================================================================

Table businesses {
  id varchar [pk]
  name varchar [not null]
  category varchar [not null] // clinic, salon, turf, consulting, garage
  owner_id varchar [not null]
  phone varchar [not null]
  language_preference varchar [default: 'hi'] // 'en' or 'hi'
  operating_hours_json text [not null] // {open: "09:00", close: "20:00"}
  created_at timestamp [default: `now()`]
}

Table stations {
  id varchar [pk]
  business_id varchar [not null, ref: > businesses.id]
  name varchar [not null] // "Chair 1", "Cabin A", "Court 2"
  station_type varchar [not null] // physical station designation
  is_active boolean [default: true]
}

Table services {
  id varchar [pk]
  business_id varchar [not null, ref: > businesses.id]
  name varchar [not null] // "Haircut", "Consultation", "Court Rental"
  duration_minutes integer [not null] // e.g. 30
  buffer_minutes integer [default: 5] // setup/sanitization margin
  price decimal(10,2) [not null]
}

Table slots {
  id varchar [pk]
  business_id varchar [not null, ref: > businesses.id]
  station_id varchar [not null, ref: > stations.id]
  service_id varchar [not null, ref: > services.id]
  start_time timestamp [not null]
  end_time timestamp [not null]
  is_available boolean [default: true]
  version integer [default: 1] // optimistic concurrency token
}

Table bookings {
  id varchar [pk]
  slot_id varchar [not null, ref: > slots.id]
  customer_id varchar [not null]
  status varchar [not null] // CONFIRMED, COMPLETED, CANCELLED
  created_at timestamp [default: `now()`]
}

Table queue_tokens {
  id varchar [pk]
  business_id varchar [not null, ref: > businesses.id]
  station_id varchar [ref: > stations.id]
  token_number integer [not null]
  token_type varchar [not null] // APPOINTMENT or WALK_IN
  status varchar [not null] // WAITING, IN_SERVICE, COMPLETED, CANCELLED
  qr_signature varchar [not null] // HMAC-SHA256 signature
  issued_at timestamp [default: `now()`]
}

Table customers {
  id varchar [pk]
  name varchar [not null]
  phone varchar [unique, not null]
  email varchar
  preferred_language varchar [default: 'hi']
  created_at timestamp [default: `now()`]
}

Table partner_registrations {
  id varchar [pk]
  business_id varchar [not null, ref: - businesses.id]
  latitude decimal(9,6) [not null]
  longitude decimal(9,6) [not null]
  address text [not null]
  is_verified boolean [default: true]
  verified_at timestamp [default: `now()`]
}
"""
    add_callout(doc, "Formal DBML Architecture Specification", dbml_code)

    add_heading_3(doc, "3.5.1 Relational Index Topologies & Storage Optimization")
    add_paragraph(doc, "To achieve sub-15ms query execution under peak concurrency, composite B-tree indexes are automatically established during migration:")
    add_bullet(doc, "Index on `slots (station_id, start_time, end_time, is_available)`: Accelerates 3-way feasibility scans, enabling index-only scans without table heap access.", "• ")
    add_bullet(doc, "Index on `queue_tokens (business_id, status, issued_at)`: Optimizes FIFO queue ordering and Little's Law waiting-time calculations.", "• ")
    add_bullet(doc, "Index on `partner_registrations (latitude, longitude)`: Supports spatial bounding-box lookups in the absence of Redis geospatial cache hits.", "• ")

    # -------------------------------------------------------------
    # 3.6 Geolocation & Cumulative Partner Network Architecture
    # -------------------------------------------------------------
    add_heading_2(doc, "3.6 Geolocation & Cumulative Partner Business Marketplace Architecture")

    add_paragraph(doc, "Unlike isolated SaaS tools, Booking Omni Queue indexes all participating businesses into a shared geospatial marketplace. The proximity discovery pipeline operates as follows:")
    add_bullet(doc, "During onboarding (POST /api/onboarding/verify), the merchant's physical address is resolved to WGS-84 coordinates (Latitude, Longitude) via the OpenStreetMap Nominatim Geocoding API.", "1. Geocoding Onboarding: ")
    add_bullet(doc, "Coordinates are indexed into a Redis geospatial index using the `GEOADD partner:locations <longitude> <latitude> <business_id>` command.", "2. Redis Geospatial Indexing: ")
    add_bullet(doc, "When a customer searches for nearby services, the client dispatches their GPS coordinates to the discovery API. The backend executes `GEORADIUS partner:locations <lon> <lat> <radius_km> WITHDIST WITHCOORD` in sub-5ms, returning nearby partners sorted by physical distance.", "3. Ultra-Low-Latency Spatial Search: ")

    # -------------------------------------------------------------
    # 3.7 Security Architecture, HMAC QR Passes & STRIDE Modeling
    # -------------------------------------------------------------
    add_heading_2(doc, "3.7 Security Architecture, HMAC QR Pass Cryptography & STRIDE Threat Modeling")

    add_paragraph(doc, "To prevent token tampering, queue ticket forgery, and screenshot replay attacks, every digital boarding pass issued by Booking Omni Queue (POST /api/customer/pass/:id) is cryptographically signed using HMAC-SHA256:")
    add_paragraph(doc, "    QR_Payload = TokenID | BusinessID | Timestamp | Nonce", bold=True)
    add_paragraph(doc, "    Signature = HMAC_SHA256(QR_Payload, SecretKey)", bold=True)
    add_paragraph(doc, "When an operator or turnstile scanner scans the QR code, the microservice re-evaluates the HMAC signature in sub-2ms. If the signature does not match or the token has already been validated, the ticket is instantly rejected.")

    stride_data = [
        ("Spoofing", "Attacker generates fraudulent queue tokens to bypass lines.", "HMAC-SHA256 cryptographic signatures embedded in QR codes; scanner verifies secret key."),
        ("Tampering", "Manipulating appointment slot times in transit.", "Strict payload schema validation; TLS 1.3 encryption; immutability hashes."),
        ("Repudiation", "Customer claims they never cancelled an appointment.", "Audit logging in MongoDB with ISO 8601 timestamps and user authentication tokens."),
        ("Information Disclosure", "Competitor scraping customer phone numbers or clinic schedules.", "RBAC route guards; customer PII encrypted at rest; public API only returns anonymized availability."),
        ("Denial of Service", "Bot flooding slot allocation endpoints to starve genuine patrons.", "Rate-limiting via Redis token bucket algorithm (100 req/min per IP); Redis Redlock timeout bounds."),
        ("Elevation of Privilege", "Staff user attempting to modify global business DBML schemas.", "Dual-token JWT RBAC claims; Gin middleware verifies user_type == 'SUPERADMIN' or 'OWNER'.")
    ]

    add_table(doc,
        ["STRIDE Threat", "Vulnerability Scenario in Booking Systems", "Booking OQ Engineering Countermeasure"],
        stride_data,
        "Table 3.3: STRIDE Threat Classification & Mitigations in Booking OQ",
        col_widths=[1.5, 2.5, 3.0]
    )

    doc.add_page_break()
