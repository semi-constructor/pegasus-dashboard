import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instances = await db.select().from(hostedInstances)
      .where(
        and(
          eq(hostedInstances.id, id),
          eq(hostedInstances.userId, session.user.id)
        )
      )
      .limit(1);

    if (instances.length === 0) {
      return NextResponse.json({ error: 'Instance not found or unauthorized' }, { status: 404 });
    }

    const instance = instances[0];
    const logLines: string[] = [];

    // 1. Read provisioning log lines specific to this instance
    try {
      const logPath = path.join(process.cwd(), 'provisioning.log');
      if (fs.existsSync(logPath)) {
        const rawContent = fs.readFileSync(logPath, 'utf8');
        const lines = rawContent.split('\n');
        for (const line of lines) {
          if (line.includes(`[Instance ${id}]`)) {
            logLines.push(line);
          }
        }
      }
    } catch (e) {
      console.error('Failed to read local provisioning log:', e);
    }

    // 2. Query Coolify service container info
    if (instance.coolifyServiceUuid) {
      try {
        const coolifyUrl = process.env.COOLIFY_API_URL;
        const token = process.env.COOLIFY_API_TOKEN;
        if (coolifyUrl && token) {
          const res = await fetch(`${coolifyUrl}/api/v1/services/${instance.coolifyServiceUuid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const detail = await res.json();
            logLines.push(`\n[System Info] Stack: ${detail.name} (UUID: ${detail.uuid})`);
            logLines.push(`[System Info] Overall Status: ${detail.status || 'unknown'}`);
            if (detail.applications?.length) {
              for (const app of detail.applications) {
                logLines.push(`[Container: ${app.name}] Status: ${app.status} | Exposes: ${app.ports || 'internal'}`);
              }
            }
            if (detail.databases?.length) {
              for (const dbItem of detail.databases) {
                logLines.push(`[Container: ${dbItem.name}] Status: ${dbItem.status}`);
              }
            }
          }
        }
      } catch (coolifyErr) {
        console.error('Failed to query Coolify info for logs:', coolifyErr);
      }
    }

    const outputLogs = logLines.length > 0 
      ? logLines.join('\n') 
      : `[${new Date().toISOString()}] Initializing container logging for instance ${id}...\nWaiting for output streams.`;

    return NextResponse.json({ logs: outputLogs });
  } catch (error) {
    console.error('[LOGS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
