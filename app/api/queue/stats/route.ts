import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = performance.now();

  try {
    const db = getDatabase();

    const waitingRow = db.prepare("SELECT COUNT(*) as count FROM queue_tokens WHERE status = 'WAITING'").get() as any;
    const inServiceRow = db.prepare("SELECT COUNT(*) as count FROM queue_tokens WHERE status = 'IN_SERVICE'").get() as any;
    const completedRow = db.prepare("SELECT COUNT(*) as count FROM queue_tokens WHERE status = 'COMPLETED'").get() as any;
    const stationsRow = db.prepare("SELECT COUNT(*) as count FROM stations WHERE status = 'AVAILABLE'").get() as any;

    const queueDepth = waitingRow?.count || 0;
    const inServiceCount = inServiceRow?.count || 0;
    const completedCount = completedRow?.count || 0;
    const activeChambers = Math.max(1, stationsRow?.count || 3);
    const estimatedWaitMinutes = Math.round((queueDepth / activeChambers) * 12);

    const elapsed = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      service: 'GET /api/queue/stats',
      status: 'HEALTHY',
      queue_depth: queueDepth,
      in_service_count: inServiceCount,
      completed_today: completedCount,
      active_chambers_count: activeChambers,
      estimated_wait_minutes: estimatedWaitMinutes,
      turnaround_rate_per_hour: 4.8,
      durationMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query queue stats';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
