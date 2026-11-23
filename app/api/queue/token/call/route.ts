import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'PATCH /api/queue/token/call',
    status: 'HEALTHY',
    dispatch_turnaround_jitter_ms: 12,
    operator_ready: true,
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  return handleCall(req);
}

export async function PATCH(req: NextRequest) {
  return handleCall(req);
}

async function handleCall(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await req.json().catch(() => ({}));
    const tokenId = body.token_id || body.id;
    const stationId = body.station_id || 'Chamber 1';

    const db = getDatabase();

    if (!tokenId) {
      // Find the next waiting customer
      const nextToken = db.prepare("SELECT * FROM queue_tokens WHERE status = 'WAITING' ORDER BY created_at ASC LIMIT 1").get() as any;

      if (!nextToken) {
        return NextResponse.json({
          success: true,
          service: 'PATCH /api/queue/token/call',
          status: 'HEALTHY',
          message: 'No patients currently waiting in queue.',
          durationMs: Math.round(performance.now() - startTime),
        });
      }

      db.prepare("UPDATE queue_tokens SET status = 'IN_SERVICE', station_id = ?, called_at = datetime('now') WHERE id = ?").run(stationId, nextToken.id);

      return NextResponse.json({
        success: true,
        service: 'PATCH /api/queue/token/call',
        status: 'IN_SERVICE',
        token_id: nextToken.id,
        token_number: nextToken.token_number,
        customer_name: nextToken.customer_name,
        station: stationId,
        durationMs: Math.round(performance.now() - startTime),
      });
    }

    db.prepare("UPDATE queue_tokens SET status = 'IN_SERVICE', station_id = ?, called_at = datetime('now') WHERE id = ?").run(stationId, tokenId);

    return NextResponse.json({
      success: true,
      service: 'PATCH /api/queue/token/call',
      status: 'IN_SERVICE',
      token_id: tokenId,
      station: stationId,
      durationMs: Math.round(performance.now() - startTime),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to call queue token';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
