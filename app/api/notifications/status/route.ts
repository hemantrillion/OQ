import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = performance.now();

  try {
    const db = getDatabase();

    const totalRow = db.prepare('SELECT COUNT(*) as count FROM notifications').get() as any;
    const sentRow = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE status = 'SENT'").get() as any;
    const failedRow = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE status = 'FAILED'").get() as any;

    const totalCount = totalRow?.count || 0;
    const sentCount = sentRow?.count || 0;
    const failedCount = failedRow?.count || 0;
    const successRate = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 100;

    const recent = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10').all();
    const elapsed = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      service: 'GET /api/notifications/status',
      status: 'HEALTHY',
      total_notifications_dispatched: totalCount,
      successful_deliveries: sentCount,
      failed_deliveries: failedCount,
      delivery_success_rate_percent: successRate,
      recent_dispatches: recent,
      durationMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query notification status';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
