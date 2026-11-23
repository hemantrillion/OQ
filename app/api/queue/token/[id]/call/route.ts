import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'PATCH /api/queue/token/:id/call',
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const startTime = performance.now();
  const tokenId = params.id;
  const db = getDatabase();

  try {
    db.prepare("UPDATE queue_tokens SET status = 'IN_SERVICE', called_at = datetime('now') WHERE id = ?").run(tokenId);
    return NextResponse.json({
      success: true,
      service: 'PATCH /api/queue/token/:id/call',
      status: 'IN_SERVICE',
      token_id: tokenId,
      durationMs: Math.round(performance.now() - startTime),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Call failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
