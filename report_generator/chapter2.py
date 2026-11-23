import docx
from docx.shared import Inches, Pt, RGBColor
from styles import (
    add_chapter_title, add_heading_2, add_heading_3,
    add_paragraph, add_bullet, add_callout, add_diagram, add_table
)

def build_chapter_2(doc):
    add_chapter_title(doc, 2, "SYSTEMS ENGINEERING METHODOLOGY & SDLC")

    # -------------------------------------------------------------
    # 2.1 Systems Engineering Foundations & NASA SP-2016-6105
    # -------------------------------------------------------------
    add_heading_2(doc, "2.1 Systems Engineering Foundations & NASA SP-2016-6105 Rev 2 Tailoring")

    add_paragraph(doc, "Complex distributed software platforms that automate database construction and govern real-world operational queues cannot be engineered through ad-hoc, informal programming practices. To guarantee deterministic reliability, architectural traceability, and mathematical rigor, this capstone project formally tailors the systems engineering framework established by the National Aeronautics and Space Administration (NASA SP-2016-6105 Rev 2, Systems Engineering Handbook).")

    add_paragraph(doc, "The NASA Systems Engineering Engine defines seventeen core processes distributed across three primary domains: System Design Processes, Product Realization Processes, and Technical Management Processes. In Booking Omni Queue, all seventeen processes are formally mapped and tailored to software engineering equivalents that govern requirement decomposition, AI AST compilation, distributed concurrency control, and technical risk management.")

    add_callout(doc, "Building a Skyscraper vs. A Backyard Treehouse (5th-Grade Intuition)",
        "If you want to build a little treehouse in your backyard, you can grab a few pieces of wood, some nails, and a hammer, and start hammering away. If a board is too long, you just saw it off. But what if you are building an 80-story skyscraper in the middle of a bustling city?\n\n"
        "You cannot just start pouring concrete! If the foundation is off by two inches, the entire building will lean and collapse. You need architects to draw blueprints, structural engineers to test the soil, safety inspectors to check the fire escapes, and electricians to plan every wire before a single brick is laid.\n\n"
        "NASA uses Systems Engineering to send astronauts and rockets into space without exploding. We use that exact same thinking for Booking Omni Queue: we write down every requirement, test every wire (API), check every bolt (database constraint), and make sure nothing crashes when hundreds of customers rush to book appointment slots at the exact same second!"
    )

    diagram_nasa = r"""
+---------------------------------------------------------------------------------------------------+
|                     NASA SP-2016-6105 REV 2 SYSTEMS ENGINEERING ENGINE (TAILORED)                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [SYSTEM DESIGN PROCESSES]                                                                        |
|  1. Stakeholder Expectation Definition (Local Vendors, Clinic Staff, Customers, Admins)           |
|  2. Technical Requirements Definition (Sub-15ms Latency, Zero Double-Booking, Redlock Mutex)     |
|  3. Logical Decomposition (C4 Model: Containers, Microservices, DBML Entities, Redis Cache)       |
|  4. Design Solution Definition (Golang Gin Backend, Next.js 15 UI, AI DBML Compiler)             |
|                                         |                                                         |
|                                         v                                                         |
|  [PRODUCT REALIZATION PROCESSES]                                                                  |
|  5. Product Implementation (Writing clean Golang handlers, AST compilers, React components)       |
|  6. Product Integration (Linking Next.js App to Go Gin Port 8080 via Typed HTTP Client)          |
|  7. Product Verification (ISO/IEC/IEEE 29119 Test Cases TC-01..20, Go Race Detector)              |
|  8. Product Validation (Empirical staff evaluation, System Usability Scale SUS testing)          |
|  9. Product Transition (Docker containerization, local run-dev.bat automated orchestration)       |
|                                         |                                                         |
|                                         v                                                         |
|  [TECHNICAL MANAGEMENT PROCESSES]                                                                 |
|  10. Technical Planning (5-Sprint Scrum Trajectory & Velocity Management)                        |
|  11. Requirements Management (Traceability matrix linking FRs to DBML Schemas & REST APIs)        |
|  12. Interface Management (50+ REST API Contract Definitions & JSON Data Schemas)                 |
|  13. Technical Risk Management (STRIDE Threat Matrix, OWASP Top 10 Hardening)                    |
|  14. Configuration Management (Git feature branch hygiene, semantic versioning)                  |
|  15. Technical Data Management (DBML repository specifications, relational DDL scripts)          |
|  16. Technical Assessment (SLI/SLO dashboards, DORA metrics, SRE runbook evaluations)            |
|  17. Decision Analysis (Trade-off studies: Go vs. Node.js, DBML vs. Raw SQL DDL)                 |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
"""
    add_diagram(doc, diagram_nasa, "Figure 2.1: NASA Systems Engineering Engine Adapted for Booking OQ")

    nasa_all_17 = [
        ("SE 1.1", "Stakeholder Expectations Definition", "Elicit operational needs from barbers, doctors, tutors, and booking customers.", "Formal User Persona Catalog & Bilingual Voice/Text Requirement Specifications."),
        ("SE 1.2", "Technical Requirements Definition", "Transform customer expectations into verifiable engineering bounds (e.g. sub-15ms latency).", "FR-01 to FR-18 and NFR-01 to NFR-12 Specifications (Tables 2.5 & 2.6)."),
        ("SE 1.3", "Logical Decomposition", "Decompose the platform into modular microservices, AST parsers, and UI views.", "C4 Architectural Models (Context, Container, Component, Code; Figures 3.1–3.4)."),
        ("SE 1.4", "Design Solution Definition", "Select optimal technologies and database paradigms.", "Selection of Golang Gin, Next.js 15, DBML compiler, Redis Redlock, MongoDB."),
        ("SE 2.1", "Product Implementation", "Execute source code development adhering to clean architecture standards.", "5,000+ lines of Golang Gin microservices, Next.js 15 App Router TypeScript code."),
        ("SE 2.2", "Product Integration", "Assemble sub-systems into an integrated end-to-end booking & queue platform.", "Connecting bilingual frontend UI to backend port 8080 via typed REST client."),
        ("SE 2.3", "Product Verification", "Verify code correctness against formal engineering bounds.", "Execution of 20 formal ISO 29119 test cases (TC-01..20), Go data race analyzer."),
        ("SE 2.4", "Product Validation", "Validate that the software fulfills real business operator needs.", "Empirical user testing across 30 evaluators yielding System Usability Scale (SUS) score 86.8."),
        ("SE 2.5", "Product Transition", "Package the software for repeatable, push-button local and cloud deployment.", "Containerized Dockerfiles, Docker Compose, and automated run-dev.bat orchestration."),
        ("SE 3.1", "Technical Planning", "Structure development cycles, team roles, and milestone tracking.", "5-Sprint Agile Scrum trajectory, sprint burnup matrices, velocity tracking."),
        ("SE 3.2", "Requirements Management", "Maintain bidirectional traceability between user requirements and code artifacts.", "Traceability matrix mapping FR-01..18 to Go controllers and Next.js routes."),
        ("SE 3.3", "Interface Management", "Define strict, unambiguous boundaries between microservices.", "Formal OpenAPI / REST specification for 50+ endpoints, typed TypeScript contracts."),
        ("SE 3.4", "Technical Risk Management", "Identify and mitigate security, operational, and architectural vulnerabilities.", "STRIDE threat modeling, OWASP Top 10 hardening, HMAC QR token cryptography."),
        ("SE 3.5", "Configuration Management", "Enforce version control hygiene, branch protection, and reproducible builds.", "Git feature-branch workflow, trunk-based integration, semantic version tagging."),
        ("SE 3.6", "Technical Data Management", "Govern data schemas, DBML definitions, and migration audit logs.", "Normalized DBML schema definitions, BSON validation rules, migration transaction logs."),
        ("SE 3.7", "Technical Assessment", "Continuously measure system performance, code quality, and operational health.", "Prometheus metric scraping, DORA metrics evaluation, SLI/SLO error budget audits."),
        ("SE 3.8", "Decision Analysis", "Execute structured trade-off studies using Multi-Criteria Decision Analysis (MCDA).", "Trade-off analysis comparing Go vs. Node.js, DBML vs. Raw SQL, Redlock vs. Postgres locks.")
    ]

    add_table(doc,
        ["Process ID", "NASA Systems Engineering Process", "Tailoring to Booking Omni Queue", "Project Deliverable & Artifact"],
        nasa_all_17,
        "Table 2.1: NASA Systems Engineering SP-2016-6105 Rev 2 Tailoring Matrix",
        col_widths=[1.0, 1.8, 2.2, 2.0]
    )

    # -------------------------------------------------------------
    # 2.2 SDLC Model Selection: Hybrid Iterative-Incremental-Agile
    # -------------------------------------------------------------
    add_heading_2(doc, "2.2 SDLC Model Selection: The Hybrid Iterative-Incremental-Agile Synthesis")

    add_paragraph(doc, "Selecting an appropriate Software Development Life Cycle (SDLC) model was a foundational architectural decision. Pure Waterfall was rejected due to its inability to accommodate requirement pivots during AI prompt-engineering experimentation. Pure unconstrained Kanban was rejected because academic capstone deliverables require strict milestone gates, NASA compliance matrices, and exhaustive documentation. Consequently, Booking Omni Queue engineered a customized Hybrid Iterative-Incremental-Agile Synthesis:")

    add_bullet(doc, "We developed core modules in repeated exploratory feedback loops. For example, the natural language prompt parser was initially evaluated with simple English phrases, tested against edge cases, and iteratively refined to handle Hindi and mixed Hinglish sentence patterns.", "1. Iterative Evolution: ")
    add_bullet(doc, "The system was constructed in layered, functional increments. Increment 1 delivered the basic Golang CRUD endpoints; Increment 2 added the Redis distributed locking mechanism; Increment 3 integrated the AI-to-DBML compiler; Increment 4 introduced the bilingual Next.js interface and partner discovery map.", "2. Incremental Delivery: ")
    add_bullet(doc, "Daily work was organized into five two-week Scrum sprints governed by Kanban boards (Backlog, To-Do, In-Progress, Testing, Done) with strict velocity burnup tracking.", "3. Agile Scrum Rigor: ")
    add_bullet(doc, "Formal requirements elicitation, mathematical queue modeling, and ISO 29119 test plan authoring were conducted with disciplined, structured documentation governance.", "4. Disciplined Documentation: ")

    diagram_sdlc = r"""
+---------------------------------------------------------------------------------------------------+
|               HYBRID ITERATIVE-INCREMENTAL-AGILE SDLC LIFECYCLE MODEL                             |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [PHASE 1: REQUIREMENTS & MATHEMATICS] (Sprint 1)                                                 |
|  - NASA SE 1.1-1.4 Tailoring, FR/NFR Elicitation, Kendall M/M/c Mathematical Formulation         |
|                                |                                                                  |
|                                v                                                                  |
|  [PHASE 2: CORE ARCHITECTURE & MICROSERVICES] (Sprint 2)                                         |
|  - Golang Gin Port 8080 Setup, Database Connection Pooling, Redis Redlock Mutex Engine           |
|                                |                                                                  |
|                                v                                                                  |
|  [PHASE 3: AI DBML COMPILER & AUTOMATED MIGRATIONS] (Sprint 3)                                    |
|  - POST /api/ai/translate-schema, AST Parser, Automated DDL Migration Engine, DBML Explorer      |
|                                |                                                                  |
|                                v                                                                  |
|  [PHASE 4: FRONTEND ERGONOMICS & BILINGUAL UI] (Sprint 4)                                        |
|  - Next.js 15 App Router, Bilingual Hindi/English Switcher, Slot Grid, Cumulative Partner Map     |
|                                |                                                                  |
|                                v                                                                  |
|  [PHASE 5: VERIFICATION, CHAOS & FINAL COMPLIANCE] (Sprint 5)                                     |
|  - ISO 29119 TC-01..20 Verification, Go Race Detector, k6 5000-User Stress Test, Final Report    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
"""
    add_diagram(doc, diagram_sdlc, "Figure 2.2: Hybrid Iterative-Incremental-Agile SDLC Pipeline")

    # -------------------------------------------------------------
    # 2.3 SWEBOK V4 & COBIT 2019 Alignment
    # -------------------------------------------------------------
    add_heading_2(doc, "2.3 SWEBOK V4 & COBIT 2019 Systems Engineering Alignment")

    add_paragraph(doc, "To ensure that Booking Omni Queue adheres to international software engineering bodies of knowledge, development was cross-referenced against the IEEE SWEBOK Guide V4 (Software Engineering Body of Knowledge) across eight core Knowledge Areas (KAs):")

    swebok_table = [
        ("KA 1: Software Requirements", "Formal elicitation of functional (FR-01..18) and non-functional (NFR-01..12) specifications with traceability matrices.", "IEEE/ISO/IEC 29148:2018"),
        ("KA 2: Software Design", "Architectural decomposition into C4 models, microservices, AST compiler pipelines, and normalized DBML schemas.", "Simon Brown C4 Model (2018)"),
        ("KA 3: Software Construction", "Implementation in compiled Golang with goroutines and Next.js 15 App Router TypeScript components.", "Clean Architecture (Martin, 2017)"),
        ("KA 4: Software Testing", "Executing twenty formal ISO 29119 test cases, Go race analysis, and automated Postman Newman API regression suites.", "ISO/IEC/IEEE 29119-1:2013"),
        ("KA 5: Software Maintenance", "Zero-downtime shadow table schema migrations and automated database rollback routines.", "SRE Principles (Beyer et al., 2016)"),
        ("KA 6: Configuration Management", "Semantic versioning, Git feature-branch hygiene, and automated run-dev.bat orchestration.", "GitOps & CI/CD Best Practices"),
        ("KA 7: Software Engineering Management", "Scrum sprint velocity tracking, story point burndown charts, and RACI governance matrices.", "Agile Alliance Guidelines"),
        ("KA 8: Software Quality", "Enforcing sub-15ms p99 latencies, zero data race warnings, and System Usability Scale (SUS) score 86.8.", "ISO/IEC 25010:2011 SQuaRE")
    ]

    add_table(doc,
        ["SWEBOK Knowledge Area", "Implementation in Booking Omni Queue", "Governing Standard / Paradigm"],
        swebok_table,
        "Table 2.2: SWEBOK V4 Knowledge Area Implementation Mapping for Booking OQ",
        col_widths=[1.8, 3.4, 1.8]
    )

    # -------------------------------------------------------------
    # 2.4 CALMS DevOps Framework
    # -------------------------------------------------------------
    add_heading_2(doc, "2.4 The CALMS DevOps Assessment Framework")

    add_paragraph(doc, "Modern software delivery relies on the CALMS framework (Culture, Automation, Lean, Measurement, Sharing) to assess DevOps maturity. Booking Omni Queue embeds CALMS principles across every sprint:")
    add_bullet(doc, "Fostered a blameless engineering culture during postmortems (e.g. during Battle 1 where LLM hallucinations produced circular DBML foreign keys). All errors were treated as architectural learning opportunities.", "1. Culture: ")
    add_bullet(doc, "Automated database schema migration (POST /api/schema/migrate) compiles DBML AST into executable DDL scripts in sub-500ms without manual intervention. Automated Newman collections run regression tests on every build.", "2. Automation: ")
    add_bullet(doc, "Eliminated engineering waste by adopting lightweight compiled Golang binaries (~35 MB RSS) and zero-code DBML blueprints instead of heavy bloated frameworks.", "3. Lean: ")
    add_bullet(doc, "Instrumented deep telemetry covering Go netpoller concurrency, p99 request latencies, Kendall queue waiting times, and DORA deployment frequency metrics.", "4. Measurement: ")
    add_bullet(doc, "Maintained transparent Git commit histories, shared postmortem documents, and published open DBML schema specifications for the partner business community.", "5. Sharing: ")

    # -------------------------------------------------------------
    # 2.5 5-Sprint Scrum Trajectory & Velocity Matrix
    # -------------------------------------------------------------
    add_heading_2(doc, "2.5 5-Sprint Scrum Trajectory & Sprint Velocity Matrix")

    add_paragraph(doc, "The project was executed across five two-week Scrum sprints spanning ten weeks. Table 2.3 documents the planned story points, completed story points, sprint velocity, and major engineering deliverables:")

    sprint_data = [
        ("Sprint 1 (Weeks 1-2)", "Requirements Elicitation & Mathematical Queue Formulation", 45, 42, "93.3%", "NASA SE tailoring, Kendall M/M/c mathematical formulations, FR/NFR specifications."),
        ("Sprint 2 (Weeks 3-4)", "Golang Microservice Core & Redis Redlock Mutex Engine", 50, 48, "96.0%", "Go Gin router on port 8080, database connection pools, Redis Redlock slot locking."),
        ("Sprint 3 (Weeks 5-6)", "AI DBML Translation Pipeline & Schema Migration Engine", 55, 53, "96.4%", "POST /api/ai/translate-schema, AST parser, automated DDL migration compiler."),
        ("Sprint 4 (Weeks 7-8)", "Next.js 15 Bilingual UI & Cumulative Partner Directory", 50, 49, "98.0%", "Bilingual Hindi/English UI, Slot Calendar, OpenStreetMap partner discovery map."),
        ("Sprint 5 (Weeks 9-10)", "ISO 29119 Verification, k6 Concurrency & Final Report", 40, 40, "100.0%", "20 ISO 29119 test cases, Go race testing, k6 stress testing, 140-page report compilation.")
    ]

    add_table(doc,
        ["Sprint & Duration", "Sprint Goal & Engineering Focus", "Planned Pts", "Completed Pts", "Velocity %", "Key Deliverables"],
        sprint_data,
        "Table 2.3: 5-Sprint Scrum Trajectory, Velocity, and Deliverables Summary",
        col_widths=[1.2, 2.0, 0.7, 0.7, 0.7, 2.1]
    )

    # -------------------------------------------------------------
    # 2.6 Stakeholder Matrix & RACI Governance
    # -------------------------------------------------------------
    add_heading_2(doc, "2.6 Stakeholder Matrix & RACI Governance Framework for Student Authors")

    add_paragraph(doc, "To establish rigorous individual accountability and avoid organizational ambiguity, Table 2.4 defines the RACI governance matrix (Responsible, Accountable, Consulted, Informed) mapping project modules across the four student candidates:")

    raci_data = [
        ["Subhajeet Ghoshal\n(11723210001)", "Lead Systems Architect & AI Schema Lead", "Accountable / Responsible", "Accountable", "Responsible", "Consulted"],
        ["Hemant Kumar\n(11723210002)", "Queue Algorithms & Distributed Mutex Lead", "Responsible", "Accountable / Responsible", "Consulted", "Responsible"],
        ["Vishal Kumar\n(11723210018)", "Microservices & Database Migration Engineer", "Consulted", "Responsible", "Accountable / Responsible", "Informed"],
        ["Vivek Kumar\n(11723210069)", "Frontend Ergonomics & Bilingual UI/UX Lead", "Informed", "Consulted", "Responsible", "Accountable / Responsible"]
    ]

    add_table(doc,
        ["Candidate Name & Reg No", "Primary Systems Engineering Role", "AI DBML Pipeline & Compilers", "Kendall Queue & Redis Mutex", "Go Backend & DDL Migrations", "Bilingual UI & ISO Verification"],
        raci_data,
        "Table 2.4: RACI Governance Matrix for Core Development Roles (Student Authors)",
        col_widths=[1.5, 1.8, 1.2, 1.2, 1.2, 1.2]
    )

    # -------------------------------------------------------------
    # 2.7 Requirements Engineering: FR-01..18 & NFR-01..12
    # -------------------------------------------------------------
    add_heading_2(doc, "2.7 Requirements Engineering: Functional (FR-01..18) & Non-Functional (NFR-01..12)")

    add_paragraph(doc, "In accordance with IEEE/ISO/IEC 29148:2018 requirements engineering standards, the system's operational capabilities are partitioned into eighteen Functional Requirements (FR-01 through FR-18) and twelve Non-Functional Requirements (NFR-01 through NFR-12):")

    fr_data = [
        ("FR-01", "Bilingual Natural Language Prompt Ingestion", "System must accept free-form operational requirements in conversational English, Hindi, and transliterated Hinglish via text and voice input envelopes."),
        ("FR-02", "AI Prompt-to-DBML Schema Translation", "System must parse natural language requirements into a syntactically valid Database Markup Language (DBML) specification via POST /api/ai/translate-schema."),
        ("FR-03", "Automated Zero-Code DDL Database Migration", "System must parse the DBML AST and compile production relational/document DDL schemas via POST /api/schema/migrate in sub-500ms."),
        ("FR-04", "Interactive Visual Database Schema Explorer", "Console must render an interactive visual entity-relationship canvas displaying live generated tables, columns, and foreign relationships."),
        ("FR-05", "Dynamic 3-Way Slot Allocation Engine", "System must allocate booking slots strictly across three concurrent dimensions: Service ID, Station/Resource ID, and Time Window."),
        ("FR-06", "Automated Buffer Margin Calculation", "Engine must automatically compute and enforce customizable setup/sanitization buffers between consecutive appointments."),
        ("FR-07", "Multi-Platform Real-Time Slot Discovery", "API must return live available booking slots across all stations via GET /api/slots filtered by business, date, and service."),
        ("FR-08", "Atomic Reservation Creation under Redis Redlock", "System must execute atomic slot bookings via POST /api/bookings guarded by distributed mutex locks to prevent race conditions."),
        ("FR-09", "Self-Service Booking Modification & Cancellation", "Patrons and operators must be able to cancel or reschedule appointments via PATCH /api/bookings/:id/cancel, releasing the slot instantly."),
        ("FR-10", "Real-Time Walk-In & Appointment Queue Ticketing", "System must issue sequential, atomic queue tokens via POST /api/queue/token for both physical walk-ins and digital bookings."),
        ("FR-11", "Dynamic Wait-Time & Queue Depth Telemetry", "System must compute estimated waiting times based on Kendall's Little's Law ($W_q = L_q / \\lambda$) via GET /api/queue/stats."),
        ("FR-12", "Cryptographic HMAC-SHA256 Digital QR Pass", "System must generate a tamper-evident digital boarding pass with an HMAC-signed QR code via POST /api/customer/pass/:id."),
        ("FR-13", "Bilingual Business Onboarding & Verification", "System must verify business credentials and operational parameters via POST /api/onboarding/verify with bilingual conversational feedback."),
        ("FR-14", "Cumulative Partner Network Proximity Discovery", "System must aggregate all onboarded businesses into a geospatial directory integrated with OpenStreetMap Nominatim for local discovery."),
        ("FR-15", "Dual-Token Cryptographic Authentication (JWT)", "System must implement HMAC-SHA256 access tokens (24h) and refresh tokens (168h) with bcrypt password hashing (cost factor 14)."),
        ("FR-16", "Role-Based Access Control (RBAC)", "System must enforce granular permissions across SuperAdmin, BusinessOwner, Staff, and Customer user types."),
        ("FR-17", "Bilingual User Interface & Voice Synthesizer", "Console must provide an instant one-click toggle between English and Hindi with localized typography and screen-reader support."),
        ("FR-18", "Real-Time WebSocket Queue Notification Broadcasts", "System must broadcast queue advancements, cancellations, and call-in alerts to connected customer mobile clients in real-time.")
    ]

    add_table(doc,
        ["Req ID", "Requirement Designation", "Functional Engineering Specification & Behavioral Envelope"],
        fr_data,
        "Table 2.5: Functional Requirements Specification (FR-01 to FR-18)",
        col_widths=[1.0, 2.2, 3.8]
    )

    nfr_data = [
        ("NFR-01", "Sub-15ms Request Latency", "API endpoints must achieve a p99 latency under 15ms for slot discovery and queue token generation under nominal load."),
        ("NFR-02", "High Concurrency Throughput", "Compiled Golang microservice must sustain > 8,500 requests per second under peak concurrency without thread exhaustion."),
        ("NFR-03", "Bilingual NLP Translation Accuracy", "AI DBML translation engine must achieve > 95% semantic extraction accuracy for standard Hindi and English operational prompts."),
        ("NFR-04", "DBML Syntactic Determinism", "Generated DBML files must parse into valid ASTs with zero circular foreign keys and 100% relational integrity."),
        ("NFR-05", "Zero Phantom Booking Guarantee", "Distributed Redlock mutex must guarantee that zero double-bookings occur even during 5,000-user concurrent reservation races."),
        ("NFR-06", "Database Migration Idempotency", "Automated DDL compiler must execute idempotently without dropping pre-existing customer data during schema evolution."),
        ("NFR-07", "Memory Footprint Bound", "Production Golang microservice must maintain a resident set size (RSS) below 50 MB under sustained operational load."),
        ("NFR-08", "Mobile Responsive Ergonomics", "Next.js UI must render responsively across mobile, tablet, and desktop form factors with touch targets >= 48px."),
        ("NFR-09", "Cryptographic Token Tamper Resistance", "QR boarding pass HMAC signatures must be non-forgeable and verifiable in sub-2ms on edge scanner devices."),
        ("NFR-10", "Zero-Downtime Local Autonomy", "Microservice engine must compile and run as an autonomous local service capable of operating during external cloud outages."),
        ("NFR-11", "Geospatial Query Performance", "Partner proximity searches via OpenStreetMap Nominatim must return cached results in sub-50ms within a 10km radius."),
        ("NFR-12", "ISO/IEC/IEEE 29119 Test Compliance", "100% of core API routes and concurrency locks must be covered by formal test specifications passing with zero regressions.")
    ]

    add_table(doc,
        ["Req ID", "Quality Dimension & Metric", "Non-Functional Engineering Bound & Verifiable Criterion"],
        nfr_data,
        "Table 2.6: Non-Functional Requirements & Performance Bounds (NFR-01..12)",
        col_widths=[1.0, 2.0, 4.0]
    )

    # -------------------------------------------------------------
    # 2.7.1 Requirements Verification Matrix & Traceability
    # -------------------------------------------------------------
    add_heading_3(doc, "2.7.1 Requirements Verification & Traceability Matrix (NASA SE 3.2)")
    add_paragraph(doc, "In accordance with NASA Systems Engineering (SE 3.2), Table 2.7 establishes the formal bidirectional traceability matrix mapping each Functional Requirement to its verification method (Test, Analysis, Demonstration, Inspection) and its corresponding production codebase implementation files:")

    trace_data = [
        ("FR-01", "Bilingual Prompt Ingestion", "Demonstration", "backend/services/ai/normalizer.go", "Verified with Hindi & Hinglish voice/text input strings."),
        ("FR-02", "AI DBML Translation", "Test (TC-03)", "backend/controllers/schemaController.go", "Synthesizes valid DBML with tables, fields, and refs."),
        ("FR-03", "Automated DDL Migration", "Test (TC-05)", "backend/parsers/dbml/migrator.go", "Provisions relational/document tables in sub-500ms."),
        ("FR-04", "Visual Schema Explorer", "Inspection", "components/DatabaseSchemaExplorer.tsx", "Interactive visual canvas renders live DBML entities."),
        ("FR-05", "3-Way Slot Allocation", "Test (TC-07)", "backend/controllers/slotController.go", "Enforces 3-way binding across Service, Station, and Time."),
        ("FR-06", "Automated Buffer Calculation", "Analysis", "backend/controllers/slotController.go", "Computes dynamic 5-15 min setup/sanitization buffer."),
        ("FR-07", "Real-Time Slot Discovery", "Test (TC-09)", "backend/controllers/getSlots.go", "Inverts booked intervals against operating hours in sub-15ms."),
        ("FR-08", "Atomic Slot Reservation", "Test (TC-10)", "backend/controllers/bookingController.go", "Redis Redlock distributed mutex guarantees zero race."),
        ("FR-09", "Slot Cancellation & Release", "Test (TC-16)", "backend/controllers/bookingController.go", "Atomically resets slot to AVAILABLE and advances queue."),
        ("FR-10", "Queue Token Issuance", "Test (TC-12)", "backend/controllers/queueController.go", "Issues atomic sequential token #A-104 via Redis INCR."),
        ("FR-11", "Dynamic Wait-Time Telemetry", "Analysis", "backend/controllers/queueController.go", "Calculates Little's Law wait time based on active stations."),
        ("FR-12", "Cryptographic QR Pass", "Test (TC-14)", "backend/controllers/passController.go", "Generates HMAC-SHA256 signature verified in sub-2ms."),
        ("FR-13", "Bilingual Business Onboarding", "Demonstration", "app/onboarding/page.tsx", "Conversational setup verified across 30 non-technical users."),
        ("FR-14", "Partner Proximity Discovery", "Test (TC-15)", "backend/controllers/geoController.go", "OpenStreetMap Nominatim geocache returns nearby partners."),
        ("FR-15", "Dual-Token JWT Security", "Test (TC-01)", "backend/middleware/authMiddleware.go", "HMAC-SHA256 access & refresh tokens with bcrypt hash."),
        ("FR-16", "Role-Based Access Control", "Test (TC-05)", "backend/middleware/rbacMiddleware.go", "Restricts superadmin, owner, and staff route execution."),
        ("FR-17", "Bilingual User Interface", "Inspection", "contexts/BilingualLanguageProvider.tsx", "One-click toggle between Hindi and English with live DOM switch."),
        ("FR-18", "WebSocket Queue Broadcasts", "Demonstration", "backend/services/websocket/hub.go", "Broadcasts real-time queue advancements to mobile clients.")
    ]

    add_table(doc,
        ["Req ID", "Functional Requirement", "Verification Method", "Source Code File Implementation", "Empirical Verification Evidence"],
        trace_data,
        "Table 2.7: Bidirectional Requirements Traceability and Verification Matrix",
        col_widths=[0.8, 1.8, 1.3, 2.1, 1.6]
    )

    # -------------------------------------------------------------
    # 2.7.2 Detailed User Story & Acceptance Criteria Catalog
    # -------------------------------------------------------------
    add_heading_3(doc, "2.7.2 User Story & Acceptance Criteria Catalog (US-01 through US-08)")
    add_paragraph(doc, "To bridge engineering specifications with real user interaction workflows, eight formal Agile User Stories were authored with Gherkin-style Acceptance Criteria:")

    user_stories = [
        ("US-01: Conversational Onboarding", "As a non-technical barber,\nI want to describe my shop hours in spoken Hindi,\nSo that I do not have to write code or configure SQL.", "Scenario: Successful Bilingual DBML Generation\nGiven the operator provides input: '3 chairs, 30 min haircuts, 9 to 8 PM'\nWhen POST /api/ai/translate-schema is executed\nThen the system synthesizes a valid DBML specification in < 1,500ms\nAnd displays the visual tables in the Schema Explorer."),
        ("US-02: Concurrency-Safe Booking", "As a patron booking a haircut,\nI want to reserve the 10:00 AM slot on Chair 1,\nSo that no one else can book the same time.", "Scenario: Zero Double-Booking Guarantee\nGiven two patrons click 'Book 10:00 AM' at the exact same millisecond\nWhen POST /api/slots/allocate executes under Redis Redlock\nThen exactly one patron receives HTTP 201 Created\nAnd the second patron receives HTTP 409 Conflict with alternative slots."),
        ("US-03: Real-Time Queue Ticketing", "As a walk-in patient at a clinic,\nI want to take a digital token,\nSo that I know how long I will have to wait.", "Scenario: Dynamic Little's Law Wait Time\nGiven 4 patients are waiting and 2 doctors are consulting\nWhen POST /api/queue/token is executed\nThen the patron is issued token #A-105\nAnd the estimated wait time displays '36 mins' based on Little's Law."),
        ("US-04: Digital QR Boarding Pass", "As an appointment customer,\nI want a mobile ticket with a scannable QR code,\nSo that I can check in instantly upon arrival.", "Scenario: HMAC Cryptographic Verification\nGiven the customer opens their digital boarding pass\nWhen the front-desk scanner reads the QR code\nThen the backend verifies the HMAC-SHA256 signature in < 2ms\nAnd advances the customer's queue status to 'IN_SERVICE'."),
        ("US-05: Dynamic Buffer Calculation", "As a dentist,\nI want a 10-minute sanitization buffer between patients,\nSo that my examination room is fully sterilized.", "Scenario: Buffer Overlap Enforcement\nGiven an existing appointment from 10:00 AM to 10:30 AM with a 10-min buffer\nWhen a customer requests an appointment at 10:35 AM\nThen the allocation engine rejects the slot with HTTP 409 Conflict\nAnd suggests 10:40 AM as the next available time window."),
        ("US-06: Cumulative Partner Discovery", "As a local resident,\nI want to search for nearby clinics and salons on a map,\nSo that I can find an open appointment today.", "Scenario: Geospatial Partner Proximity Search\nGiven the customer enables GPS on their smartphone\nWhen the discovery map loads\nThen the backend queries Redis GEO index via GEORADIUS in < 5ms\nAnd displays nearby partner businesses sorted by distance in kilometers."),
        ("US-07: Self-Service Cancellation", "As a client whose plans changed,\nI want to cancel my reservation with one click,\nSo that someone else can use my time slot.", "Scenario: Atomic Slot Reclamation\nGiven a confirmed booking with status 'CONFIRMED'\nWhen the client calls PATCH /api/bookings/:id/cancel\nThen the slot is atomically returned to 'AVAILABLE'\nAnd waiting walk-in patrons are notified via WebSocket."),
        ("US-08: Zero-Code Schema Evolution", "As a salon owner adding a massage service,\nI want to update my services through chat,\nSo that my booking website automatically adds the new table.", "Scenario: Shadow Table Migration\nGiven an existing live booking database\nWhen the owner prompts: 'Add massage service with 45 min duration'\nThen the migration engine creates a shadow table slots_v2\nAnd swaps tables in < 5ms without dropping active bookings.")
    ]

    add_table(doc,
        ["User Story ID & Persona", "Agile Narrative (Role, Feature, Benefit)", "Acceptance Criteria (Gherkin Scenario)"],
        user_stories,
        "Table 2.8: Agile User Stories and Gherkin Acceptance Criteria Catalog",
        col_widths=[1.8, 2.5, 2.9]
    )

    doc.add_page_break()
