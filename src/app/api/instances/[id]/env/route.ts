import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { CoolifyService, CoolifyEnvVar } from '@/lib/coolify';
import { encryptToken } from '@/lib/encryption';

const SYSTEM_VARS = [
  'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'REDIS_PASSWORD', 
  'DATABASE_URL', 'REDIS_URL', 'NODE_ENV', 'INSTANCE_ID', 
  'API_PORT', 'DB_PORT', 'REDIS_PORT', 'ADMINER_PORT', 'ENABLE_API'
];

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
    if (!instance.coolifyServiceUuid) {
      return NextResponse.json({ error: 'Instance not yet provisioned' }, { status: 400 });
    }

    const coolifyEnvs = await CoolifyService.getEnvs(instance.coolifyServiceUuid);
    
    // Map them to safe metadata
    const safeEnv: Record<string, any> = {};
    for (const env of coolifyEnvs) {
      const envName = env.name || env.key;
      if (!envName) continue;
      
      const isSystem = SYSTEM_VARS.includes(envName);
      if (env.is_secret || envName === 'DISCORD_BOT_TOKEN' || (isSystem && (envName.includes('PASSWORD') || envName.includes('URL')))) {
        safeEnv[envName] = { configured: true, secret: true, system: isSystem };
      } else {
        safeEnv[envName] = { value: env.value, secret: false, system: isSystem };
      }
    }

    // Always ensure DISCORD_BOT_TOKEN is present in metadata if we have it in DB
    if (instance.encryptedBotToken && !safeEnv['DISCORD_BOT_TOKEN']) {
      safeEnv['DISCORD_BOT_TOKEN'] = { configured: true, secret: true, system: false };
    }

    return NextResponse.json({ env: safeEnv });
  } catch (error) {
    console.error('[ENV_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    if (!instance.coolifyServiceUuid) {
      return NextResponse.json({ error: 'Instance not yet provisioned' }, { status: 400 });
    }

    const updates = await req.json();
    
    // Filter out restricted variables
    const safeUpdates: CoolifyEnvVar[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (SYSTEM_VARS.includes(key)) {
        return NextResponse.json({ error: `Environment variable ${key} is system-managed and cannot be edited.` }, { status: 403 });
      }
      
      const isSecret = key === 'DISCORD_BOT_TOKEN' || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('password');
      safeUpdates.push({ name: key, value: String(value), isSecret });
    }

    if (safeUpdates.length === 0) {
      return NextResponse.json({ error: 'No valid variables provided' }, { status: 400 });
    }

    // If updating DISCORD_BOT_TOKEN, we must also encrypt and store it in DB
    const newDiscordToken = safeUpdates.find(e => e.name === 'DISCORD_BOT_TOKEN')?.value;
    if (newDiscordToken) {
       const encryptedToken = encryptToken(newDiscordToken);
       await db.update(hostedInstances)
         .set({ encryptedBotToken: encryptedToken })
         .where(eq(hostedInstances.id, instance.id));
    }

    // Push updates to Coolify
    await CoolifyService.updateCustomerEnv(instance.coolifyServiceUuid, safeUpdates);
    
    // Restart the service to apply changes
    await CoolifyService.restart(instance.coolifyServiceUuid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ENV_PATCH_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
