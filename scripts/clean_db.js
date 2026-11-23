const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, '..', 'booking_oq.db');
const db = new DatabaseSync(dbPath);

// 1. Wipe demo bookings, queue, and notifications
db.exec('DELETE FROM bookings;');
db.exec('DELETE FROM queue_tokens;');
db.exec('DELETE FROM notifications;');
console.log('Cleaned bookings, queue_tokens, and notifications.');

// 2. Clean and reset businesses and stations
db.exec('DELETE FROM stations;');
db.exec('DELETE FROM catalog_items;');
db.exec('DELETE FROM businesses;');

db.prepare(`
  INSERT INTO businesses (id, name, business_type, open_time, close_time)
  VALUES ('biz_ent_clinic', 'Apex ENT Specialist Clinic & Blood Lab', 'ent_clinic_and_lab', '08:00', '20:00')
`).run();

const insertSt = db.prepare(`
  INSERT INTO stations (id, business_id, name, station_type, capacity, status)
  VALUES (?, 'biz_ent_clinic', ?, ?, 1, 'AVAILABLE')
`);

insertSt.run('st_chamber_1', 'ENT Consultation Chamber 1', 'CHAMBER');
insertSt.run('st_chamber_2', 'ENT Consultation Chamber 2', 'CHAMBER');
insertSt.run('st_lab_1', 'Phlebotomy & Blood Draw Station', 'LAB_DESK');

const insertCat = db.prepare(`
  INSERT INTO catalog_items (id, business_id, name, item_type, duration_minutes, price)
  VALUES (?, 'biz_ent_clinic', ?, ?, ?, ?)
`);

insertCat.run('cat_1', 'ENT General Consultation', 'CLINICAL_SERVICE', 15, 500);
insertCat.run('cat_2', 'Ear Microsuction / Wax Cleaning', 'CLINICAL_SERVICE', 20, 700);
insertCat.run('cat_3', 'Diagnostic Nasal Endoscopy', 'CLINICAL_SERVICE', 25, 1200);
insertCat.run('cat_4', 'Hearing Test / Audiometry', 'CLINICAL_SERVICE', 30, 800);
insertCat.run('cat_5', 'Complete Blood Count (CBC)', 'DIAGNOSTIC_TEST', 0, 350);
insertCat.run('cat_6', 'Thyroid Profile (T3, T4, TSH)', 'DIAGNOSTIC_TEST', 0, 600);
insertCat.run('cat_7', 'HbA1c & Fasting Blood Sugar', 'DIAGNOSTIC_TEST', 0, 450);
insertCat.run('cat_8', 'Allergy Blood Panel', 'DIAGNOSTIC_TEST', 0, 1500);

console.log('Database successfully reset:');
console.log('Stations:', db.prepare('SELECT id, name, station_type, status FROM stations').all());
console.log('Bookings count:', db.prepare('SELECT count(*) as count FROM bookings').get());
console.log('Catalog items count:', db.prepare('SELECT count(*) as count FROM catalog_items').get());
