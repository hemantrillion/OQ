import docx
from docx.shared import Inches, Pt, RGBColor
from styles import (
    add_chapter_title, add_heading_2, add_heading_3,
    add_paragraph, add_bullet, add_callout, add_diagram, add_table
)

def build_chapter_6(doc):
    add_chapter_title(doc, 6, "OPERATIONS, SITE RELIABILITY ENGINEERING & POSTMORTEMS")

    # -------------------------------------------------------------
    # 6.1 SRE Principles & Queue Telemetry
    # -------------------------------------------------------------
    add_heading_2(doc, "6.1 SRE Principles & Queue Telemetry (SLIs, SLOs, and SLAs)")

    add_paragraph(doc, "In accordance with Google Site Reliability Engineering (SRE) principles (Beyer et al., 2016), Booking Omni Queue operationalizes production health through mathematically defined Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Error Budgets. Table 6.1 specifies the four critical user-facing operational SLOs:")

    sli_data = [
        ("SLI 1: Slot Allocation Latency", "Proportion of valid POST /api/slots/allocate requests returning in < 25ms.", ">= 99.5% of requests meet latency threshold.", "0.5% (21.6 minutes/month)"),
        ("SLI 2: AI DBML Generation Latency", "Proportion of POST /api/ai/translate-schema requests completing in < 1,500ms.", ">= 95.0% of requests meet compilation threshold.", "5.0% (3.6 hours/month)"),
        ("SLI 3: System Concurrency Availability", "Proportion of successful HTTP responses (non-5xx) under <= 5,000 concurrent RPS.", ">= 99.95% availability (Three-and-a-half nines).", "0.05% (21.9 minutes/month)"),
        ("SLI 4: QR Verification Throughput", "Proportion of HMAC QR boarding passes verified in < 5ms at turnstile scanners.", ">= 99.9% verification success rate.", "0.1% (43.8 minutes/month)")
    ]

    add_table(doc,
        ["Service Level Indicator (SLI)", "Mathematical Metric Definition", "Service Level Objective (SLO Bound)", "Monthly Error Budget Margin"],
        sli_data,
        "Table 6.1: Service Level Indicators (SLIs), Objectives (SLOs) & Error Budgets",
        col_widths=[1.6, 2.4, 2.0, 1.4]
    )

    # -------------------------------------------------------------
    # 6.2 DORA DevOps Metrics Profile
    # -------------------------------------------------------------
    add_heading_2(doc, "6.2 DORA DevOps Metrics Profile")

    add_paragraph(doc, "To benchmark engineering velocity and release stability, Booking Omni Queue evaluates its development pipeline against the four core DORA (DevOps Research and Assessment) metrics:")

    dora_data = [
        ("Deployment Frequency", "Frequency of code deployments to staging/production.", "Multiple deployments per day via continuous integration.", "Elite"),
        ("Lead Time for Changes", "Time elapsed from commit to running in production.", "Under 15 minutes via automated compile and test runners.", "Elite"),
        ("Change Failure Rate", "Percentage of deployments causing production degradation.", "< 2.0% across all sprint releases.", "Elite"),
        ("Mean Time to Recovery (MTTR)", "Time required to restore service following an incident.", "< 3.0 minutes via runbook automated restarts.", "Elite")
    ]

    add_table(doc,
        ["DORA Dimension", "Operational Definition & Measurement Metric", "Booking OQ Engineering Performance", "DORA Classification"],
        dora_data,
        "Table 6.2: DORA Metric Benchmarks: Booking OQ Performance Profile",
        col_widths=[1.5, 2.5, 2.0, 1.0]
    )

    # -------------------------------------------------------------
    # 6.3 Operational Runbooks (RB-01..04)
    # -------------------------------------------------------------
    add_heading_2(doc, "6.3 Operational Runbook Catalog (RB-01 through RB-04)")

    add_paragraph(doc, "When operational anomalies occur during high-volume service, floor staff and system administrators require unambiguous, deterministic remediation procedures. Table 6.3 outlines the four primary production runbooks:")

    runbooks = [
        ("RB-01", "Slot Mutex Deadlock & Orphaned Redlock Release", "Station slot marked BOOKED in Redis but database transaction failed or timed out.", "1. Query Redis lock via `redis-cli GET lock:station:{id}:{time}`.\n2. Inspect database booking record.\n3. If no confirmed booking exists, execute `redis-cli DEL lock:station:{id}:{time}`.\n4. Trigger slot status reconciliation via PATCH /api/slots/:id/reconcile."),
        ("RB-02", "DBML Schema Migration Transaction Rollback", "Automated DDL migration failed midway due to syntax constraint violation.", "1. Query migration audit log via GET /api/schema/audit.\n2. Identify aborted statement.\n3. Execute automated schema rollback script `dbml-rollback --version={v}`.\n4. Restore pre-migration shadow tables and notify operator."),
        ("RB-03", "JWT Key Invalidation & Token Storm", "Suspected credential compromise or mass token signature rejection.", "1. Rotate SECRET_KEY in backend environment variable.\n2. Invalidate refresh token hashes in users collection.\n3. Trigger automated client redirect to /login.\n4. Re-issue fresh dual-token pair via bcrypt re-auth."),
        ("RB-04", "Nominatim Geocoding Rate-Limit Failover", "OpenStreetMap geocoder returns HTTP 429 Too Many Requests during partner search.", "1. Inspect Redis geospatial cache hit ratio via `INFO stats`.\n2. Switch Nominatim client to secondary fallback mirrors.\n3. Increase Redis GEO cache TTL from 24h to 72h.\n4. Return cached nearby partners without failing client request.")
    ]

    add_table(doc,
        ["Runbook ID", "Incident Designation & Symptom", "Root Trigger Condition", "Deterministic Step-by-Step Remediation Action"],
        runbooks,
        "Table 6.3: Operational Runbook Catalog (RB-01 through RB-04)",
        col_widths=[0.8, 1.8, 2.2, 2.6]
    )

    # -------------------------------------------------------------
    # 6.4 10 Real Engineering Battles (War Stories)
    # -------------------------------------------------------------
    add_heading_2(doc, "6.4 10 Real Engineering Battles, Failures & Architectural Pivots (The War Stories)")

    add_paragraph(doc, "The reality of building high-concurrency systems is rarely smooth. Behind every polished architecture lies a succession of intense technical battles, unexpected panics, and hard-fought architectural pivots. Below, we chronicle the ten most critical engineering battles fought during the development of Booking Omni Queue:")

    add_heading_3(doc, "6.4.1 Battle 1: LLM Prompt Hallucination Producing Circular DBML Foreign Keys")
    add_paragraph(doc, "During early testing of natural language schema generation (POST /api/ai/translate-schema), an operator inputted a complex requirement: 'Our barbers can also book appointments for themselves, and appointments belong to barbers.' The LLM synthesized a DBML file where table `barbers` had a foreign key referencing `appointments.id`, while table `appointments` had a foreign key referencing `barbers.id`. When the automated migration engine attempted to execute the DDL, the database engine threw a catastrophic circular dependency deadlock.")
    add_paragraph(doc, "We resolved this by implementing an intermediate Abstract Syntax Tree (AST) validator and Directed Acyclic Graph (DAG) cycle detector in `backend/parsers/dbml/validator.go`. The validator constructs an adjacency matrix of all table relationships and executes topological sorting. If a cycle is detected, the pipeline automatically intercepts the DBML, introduces an intermediate junction table, and prevents circular DDL execution.")

    add_heading_3(doc, "6.4.2 Battle 2: Bilingual Hindi-English Transliteration Parsing Ambiguity")
    add_paragraph(doc, "When testing voice prompts with local shopkeepers, users frequently used colloquial Hinglish expressions with relative temporal references: 'kal sham 5 baje 1 ghante ke liye do chair book kardo'. Standard NLP parsers failed completely, interpreting 'kal' as an unknown entity or defaulting to current UTC time, which scheduled appointments in the past.")
    add_paragraph(doc, "We engineered a specialized bilingual lexical normalizer in `backend/services/ai/normalizer.go`. The normalizer maintains a mapping dictionary of Hindi temporal markers ('aaj' = today, 'kal' = tomorrow, 'parson' = day after tomorrow, 'subah' = AM, 'sham/raat' = PM) and translates relative offsets into absolute ISO 8601 timestamps before feeding the structured context into the slot allocation engine.")

    add_heading_3(doc, "6.4.3 Battle 3: Phantom Slot Double-Booking Under Concurrent Spike Contention")
    add_paragraph(doc, "During high-concurrency simulations where 50 users attempted to reserve the exact same 10:00 AM slot on Chair 1 at the same millisecond, simple read-then-write database queries failed. Both requests read `is_available: true`, and both subsequently issued update statements, resulting in two confirmed customer bookings for a single physical chair.")
    add_paragraph(doc, "We eliminated this critical flaw by introducing a distributed mutex layer utilizing the Redis Redlock algorithm (`backend/database/redis.go`). Prior to committing a slot in the database, the server executes `SET lock:station:{id}:{time} {customer_id} NX EX 10`. Only the single client that acquires the atomic lock proceeds to insert the booking; all competing requests are immediately rejected with HTTP 409 Conflict and suggested alternative adjacent slots.")

    add_heading_3(doc, "6.4.4 Battle 4: Automated DDL Schema Migration Deadlock During Live Database Evolution")
    add_paragraph(doc, "When an onboarded clinic decided to change their consultation duration from 30 minutes to 20 minutes, the migration compiler attempted to run `ALTER TABLE slots` directly on the active production table. Because incoming customer requests were reading and writing to `slots`, PostgreSQL placed an exclusive table lock, causing all client requests to freeze and time out.")
    add_paragraph(doc, "We resolved this by adopting a zero-downtime shadow table migration pattern. The compiler creates a new shadow table `slots_v2`, establishes a dual-write trigger, copies existing future reservations, and atomically swaps table names using `ALTER TABLE ... RENAME` in a sub-5ms transaction, ensuring zero downtime for active users.")

    add_heading_3(doc, "6.4.5 Battle 5: Geocoding Rate Limits with Nominatim OpenStreetMap")
    add_paragraph(doc, "When hundreds of users opened the discovery marketplace to find nearby salons and clinics, client browsers dispatched individual reverse-geocoding requests directly to OpenStreetMap's Nominatim API. Within ten minutes, Nominatim blocked our server IP with HTTP 429 Too Many Requests.")
    add_paragraph(doc, "We mitigated this by implementing server-side geospatial caching in Redis. All partner coordinates are indexed via `GEOADD partner:locations`. When users search within a radius, the backend executes `GEORADIUS` against Redis in sub-5ms, completely bypassing external geocoding requests and reducing Nominatim API calls by 94%.")

    add_heading_3(doc, "6.4.6 Battle 6: Decimal Precision Drift in Dynamic Slot Buffer Calculations")
    add_paragraph(doc, "When calculating appointment end times with fractional hour service rates, Go's floating-point math produced subtle sub-second timestamp drift (e.g., an appointment ending at 10:29:59.999 instead of 10:30:00). This caused subsequent slot availability checks to report 1-second overlaps, falsely rejecting valid adjacent appointments.")
    add_paragraph(doc, "We eradicated this by enforcing strict integer minute arithmetic across all time calculations: `time.Truncate(time.Minute)` is executed on all appointment inputs, guaranteeing that all time boundaries align perfectly to discrete minute intervals.")

    add_heading_3(doc, "6.4.7 Battle 7: Cross-Origin Resource Sharing (CORS) & Preflight Drops in Gin")
    add_paragraph(doc, "When deploying the Next.js frontend on port 3000 and the Golang Gin microservice on port 8080, browser clients encountered CORS preflight drops on `POST` and `PATCH` requests containing custom JWT headers.")
    add_paragraph(doc, "We engineered dedicated Gin CORS middleware in `backend/middleware/cors.go` that explicitly intercepts HTTP `OPTIONS` requests and returns HTTP 204 No Content with permissive access control headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers: Content-Type, token, Authorization`), resolving all preflight blocks.")

    add_heading_3(doc, "6.4.8 Battle 8: The Prerequisite-of-Prerequisite Rule in Station & Service Modeling")
    add_paragraph(doc, "Early in development, operators were able to create appointment slots referencing non-existent service IDs or deleted station IDs. These orphaned slots appeared in customer calendars but crashed the booking engine during checkout.")
    add_paragraph(doc, "We enforced the strict 'prerequisite-of-prerequisite' validation hierarchy: prior to generating any slot record, the controller queries the station and service collections. If either entity does not exist or belongs to a different business tenant, the operation is immediately aborted with HTTP 422 Unprocessable Entity.")

    add_heading_3(doc, "6.4.9 Battle 9: QR Digital Pass Signature Forgery & Replay Attacks")
    add_paragraph(doc, "During testing of mobile ticketing, users discovered that digital pass URLs contained simple sequential IDs (e.g., `/pass/104`), allowing malicious patrons to increment the ID and spoof queue tokens belonging to other customers.")
    add_paragraph(doc, "We hardened the pass generator by embedding cryptographic HMAC-SHA256 signatures and nonces into the QR payload. Edge scanners verify the cryptographic hash against the backend secret key; any tampered or replayed token is instantly flagged as fraudulent.")

    add_heading_3(doc, "6.4.10 Battle 10: WebSocket Connection Zombie States in Spotty Mobile Networks")
    add_paragraph(doc, "Real-time queue advancement notifications were initially pushed over raw WebSockets. However, patrons moving between cellular towers or entering underground parking lots experienced silent socket disconnects, leaving their screens displaying stale queue positions.")
    add_paragraph(doc, "We implemented a resilient hybrid architecture: WebSocket streaming paired with an adaptive HTTP polling fallback. If the WebSocket heartbeat fails to receive an acknowledgment within 10 seconds, the client gracefully switches to lightweight HTTP polling with exponential backoff, guaranteeing 100% reliable queue tracking.")

    # -------------------------------------------------------------
    # 6.5 Root Cause Analysis (5 Whys Framework)
    # -------------------------------------------------------------
    add_heading_2(doc, "6.5 Root Cause Analysis (5 Whys Framework) & Blameless Postmortem")

    add_paragraph(doc, "To demonstrate production operational maturity, the engineering team executed a formal blameless postmortem following a major staging outage:")

    add_callout(doc, "Blameless Postmortem: The 19:10 DBML Migration Deadlock",
        "INCIDENT SUMMARY:\n"
        "On 13 November 2026 at 19:10 IST, an automated DBML migration caused a 4-minute staging freeze during a peak simulation run.\n\n"
        "THE 5 WHYS INVESTIGATION:\n"
        "1. Why did the staging server freeze? -> The database connection pool exhausted all 100 available connections.\n"
        "2. Why were connections exhausted? -> An automated ALTER TABLE migration acquired an exclusive lock on the active slots table.\n"
        "3. Why was an exclusive lock acquired? -> The migration script modified column types directly in-place rather than using a shadow table.\n"
        "4. Why was in-place modification used? -> The DBML migration compiler lacked shadow-table generation templates for PostgreSQL.\n"
        "5. Why were shadow templates missing? -> Early design assumptions treated schema generation as an offline, initial-setup-only process rather than a dynamic, live runtime capability.\n\n"
        "CORRECTIVE ACTION ITEMS:\n"
        "- Implemented zero-downtime shadow table creation for all live schema migrations.\n"
        "- Configured strict 5-second lock timeout (PRAGMA / lock_timeout = '5s') to prevent connection pool exhaustion."
    )

    add_heading_3(doc, "6.5.1 Chronological Incident Timeline: The 19:10 Migration Outage")
    add_paragraph(doc, "Table 6.4 details the minute-by-minute forensic telemetry timeline recorded during the 19:10 DBML migration incident:")

    timeline_data = [
        ("19:09:45 IST", "Operator initiates dynamic schema modification via natural language prompt: 'Add 15 min buffer to all styling chairs'.", "POST /api/ai/translate-schema returns updated DBML code; migration triggered."),
        ("19:10:02 IST", "Migration compiler dispatches synchronous `ALTER TABLE slots ALTER COLUMN end_time TYPE timestamp` directly to production table.", "PostgreSQL acquires exclusive AccessExclusiveLock on `slots` table."),
        ("19:10:15 IST", "Concurrent k6 stress runner dispatches 250 incoming `POST /api/slots/allocate` requests.", "Requests attempt to acquire row-level locks on `slots`; blocked by AccessExclusiveLock."),
        ("19:10:45 IST", "Golang database connection pool reaches maximum saturation (100 / 100 connections).", "API netpoller queues incoming HTTP requests; p99 latency spikes from 12ms to 4,800ms."),
        ("19:11:15 IST", "Kubernetes liveness probe `/health` times out after 5-second deadline.", "Container health check fails; Prometheus triggers PagerDuty high-severity P1 alert."),
        ("19:12:00 IST", "SRE On-Call executes Runbook RB-02: runs `SELECT pg_terminate_backend(pid)` to kill stalled ALTER TABLE transaction.", "AccessExclusiveLock released; connection pool drains; pending slot allocations resume."),
        ("19:13:30 IST", "Engineers deploy hotfix introducing shadow table migration pattern (`slots_v2`).", "Full system recovery; zero customer reservation records corrupted or lost.")
    ]

    add_table(doc,
        ["Timestamp", "Observed System Event & Telemetry Spike", "Underlying Architectural Root Mechanism"],
        timeline_data,
        "Table 6.4: Chronological Incident Telemetry Timeline: 19:10 Migration Deadlock",
        col_widths=[1.5, 3.2, 2.5]
    )

    doc.add_page_break()
