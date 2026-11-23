// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.join(process.cwd(), 'booking_oq.db');

// Singleton database instance
let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initializeCoreSchema(dbInstance);
  }
  return dbInstance;
}

function initializeCoreSchema(db: DatabaseSync) {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      business_type TEXT NOT NULL,
      description TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      open_time TEXT NOT NULL DEFAULT '08:00',
      close_time TEXT NOT NULL DEFAULT '20:00',
      slot_interval_minutes INTEGER NOT NULL DEFAULT 15,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stations (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      station_type TEXT NOT NULL, -- 'CHAMBER', 'LAB_DESK', 'CHAIR', 'TABLE'
      capacity INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'AVAILABLE',
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS catalog_items (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      item_type TEXT NOT NULL, -- 'CLINICAL_SERVICE', 'DIAGNOSTIC_TEST', 'PRODUCT'
      duration_minutes INTEGER DEFAULT 0,
      price REAL NOT NULL DEFAULT 0.0,
      description TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      station_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      customer_email TEXT,
      service_name TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CANCELLED', 'COMPLETED'
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS queue_tokens (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      token_number TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      service_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'WAITING', -- 'WAITING', 'IN_SERVICE', 'COMPLETED', 'CANCELLED'
      station_id TEXT,
      wait_time_minutes INTEGER DEFAULT 15,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      called_at TEXT,
      completed_at TEXT,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      business_id TEXT,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'EMAIL',
      status TEXT NOT NULL DEFAULT 'SENT', -- 'SENT', 'FAILED', 'PENDING'
      provider TEXT NOT NULL DEFAULT 'RESEND',
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Ensure default tenant exists so bookings and queue tokens never hit foreign key constraint failures
    INSERT OR IGNORE INTO businesses (id, name, business_type, open_time, close_time)
    VALUES ('biz_default', 'Apex ENT Specialist Clinic & Blood Lab', 'ent_clinic_and_lab', '08:00', '20:00');
  `);
}
