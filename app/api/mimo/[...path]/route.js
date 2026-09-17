import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const UPSTREAM = 'https://mimo.xiaomi.com/rl';

// Whitelisted: GET /api/mimo/api/<name>  ->  https://mimo.xiaomi.com/rl/api/<name>
const ALLOWED = new Set(['runs', 'status', 'live', 'benchmarks', 'notices']);

export async function GET(request, context) {
  const { path } = await context.params; // e.g. ['api', 'live']
  if (path.length !== 2 || path[0] !== 'api' || !ALLOWED.has(path[1])) {
    return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  }
  const url = new URL(request.url);
  const target = `${UPSTREAM}/api/${path[1]}${url.search}`;
  try {
    const upstream = await fetch(target, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return NextResponse.json({
      ok: upstream.ok,
      upstream_status: upstream.status,
      upstream: target,
      data,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e), upstream: target },
      { status: 502 }
    );
  }
}
