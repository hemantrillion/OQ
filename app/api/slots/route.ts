import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = performance.now();

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const db = getDatabase();

    // Query active stations (deduplicated by name to guarantee exactly 3 distinct stations)
    const stations = db.prepare(`
      SELECT id, name, station_type, status 
      FROM stations 
      WHERE rowid IN (
        SELECT MIN(rowid) FROM stations GROUP BY name
      )
    `).all() as any[];
    // Query active bookings for the day
    const bookings = db.prepare(`
      SELECT id, station_id, service_name, customer_name, start_time, end_time, status 
      FROM bookings 
      WHERE booking_date = ? AND status = 'CONFIRMED'
    `).all(date) as any[];

    // Generate schedule matrix (from 08:00 to 20:00 every 30 mins)
    const timeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30'
    ];

    const bookedTimes = new Set(bookings.map((b) => b.start_time));
    const availableSlots = timeSlots.filter((t) => !bookedTimes.has(t));

    const elapsed = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      service: 'GET /api/slots',
      status: 'HEALTHY',
      date,
      total_capacity: timeSlots.length * Math.max(1, stations.length),
      available_slots_count: availableSlots.length,
      booked_slots_count: bookedTimes.size,
      slots: timeSlots.map((time) => ({
        time,
        status: bookedTimes.has(time) ? 'BOOKED' : 'AVAILABLE',
      })),
      stations,
      durationMs: elapsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query slots';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
