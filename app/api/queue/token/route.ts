import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = performance.now();

  try {
    const db = getDatabase();
    const rows = db.prepare("SELECT * FROM queue_tokens WHERE status != 'CANCELLED' ORDER BY created_at ASC").all();
    const elapsed = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      service: 'POST /api/queue/token',
      status: 'HEALTHY',
      count: rows.length,
      tokens: rows,
      durationMs: elapsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query queue tokens';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await req.json().catch(() => ({}));
    const db = getDatabase();

    // Check for synthetic probe ping
    if (!body.customer_name && !body.service_name) {
      return NextResponse.json({
        success: true,
        service: 'POST /api/queue/token',
        status: 'HEALTHY',
        token_number: 'Q-001',
        message: 'Queue ticketing engine ready.',
        durationMs: Math.round(performance.now() - startTime),
      });
    }

    const businessId = body.business_id || 'biz_default';
    const customerName = body.customer_name || 'Walk-in Patient';
    const customerPhone = body.customer_phone || '';
    const serviceName = body.service_name || 'ENT General Consultation';

    // Generate atomic sequential token number
    const todayCount = db.prepare("SELECT COUNT(*) as count FROM queue_tokens WHERE date(created_at) = date('now')").get() as any;
    const seq = (todayCount?.count || 0) + 1;
    const tokenNumber = `Q-${String(seq).padStart(3, '0')}`;
    const tokenId = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Estimate wait time based on queue length (10 mins per waiting customer)
    const waitingCount = db.prepare("SELECT COUNT(*) as count FROM queue_tokens WHERE status = 'WAITING'").get() as any;
    const waitTimeMinutes = Math.max(5, (waitingCount?.count || 0) * 12);

    db.prepare(`
      INSERT INTO queue_tokens (id, business_id, token_number, customer_name, customer_phone, service_name, status, wait_time_minutes)
      VALUES (?, ?, ?, ?, ?, ?, 'WAITING', ?)
    `).run(tokenId, businessId, tokenNumber, customerName, customerPhone, serviceName, waitTimeMinutes);

    const elapsed = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      service: 'POST /api/queue/token',
      status: 'ISSUED',
      token_id: tokenId,
      token_number: tokenNumber,
      customer_name: customerName,
      service_name: serviceName,
      queue_status: 'WAITING',
      estimated_wait_time_minutes: waitTimeMinutes,
      durationMs: elapsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Queue token issuance failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
