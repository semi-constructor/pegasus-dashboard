import { db } from '@/lib/db';
import { hostedInstances } from 'schemas/billing';
import { eq } from 'drizzle-orm';
import { CoolifyService, CoolifyEnvVar } from './coolify';
import crypto from 'crypto';
import { encryptToken } from './encryption';
import fs from 'fs';
import path from 'path';

function logToFile(instanceId: string, message: string, error?: any) {
  const logPath = path.join(process.cwd(), 'provisioning.log');
  const timestamp = new Date().toISOString();
  let logLine = `[${timestamp}] [Instance ${instanceId}] ${message}`;
  if (error) {
    logLine += `\nError: ${error.message || error}\n${error.stack || ''}`;
  }
  logLine += '\n';
  
  try {
    fs.appendFileSync(logPath, logLine);
    console.log(logLine.trim());
  } catch (e) {
    console.error('Failed to write to log file', e);
  }
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 60; // 5 minutes max

export async function runProvisioningWorkflow(
  instanceId: string, 
  botToken: string,
  discordClientId?: string,
  ownerUserId?: string
) {
  try {
    logToFile(instanceId, 'Starting provisioning workflow');
    // 0. Generate Credentials
    const controlApiToken = crypto.randomBytes(32).toString('hex');
    const controlTokenHash = crypto.createHash('sha256').update(controlApiToken).digest('hex');
    
    const botApiToken = crypto.randomBytes(32).toString('hex');
    const encryptedApiToken = encryptToken(botApiToken);
    const encryptionKey = crypto.randomBytes(16).toString('hex');

    // 1. Create Coolify service with complete Pegasus Bot environment configuration
    logToFile(instanceId, '1. Creating Coolify Service...');
    const developerIds = ownerUserId ? JSON.stringify([ownerUserId]) : '[]';
    
    const customEnvs: CoolifyEnvVar[] = [
      { name: 'DISCORD_TOKEN', value: botToken, isSecret: true },
      { name: 'DISCORD_CLIENT_ID', value: discordClientId || '', isSecret: false },
      { name: 'BOT_API_TOKEN', value: botApiToken, isSecret: true },
      { name: 'API_TOKEN', value: botApiToken, isSecret: true },
      { name: 'ENABLE_API', value: 'true', isSecret: false },
      { name: 'DB_SSL', value: 'false', isSecret: false },
      { name: 'ENCRYPTION_KEY', value: encryptionKey, isSecret: true },
      { name: 'ENABLE_ECONOMY', value: 'true', isSecret: false },
      { name: 'ENABLE_MODERATION', value: 'true', isSecret: false },
      { name: 'ENABLE_XP', value: 'true', isSecret: false },
      { name: 'ENABLE_TICKETS', value: 'true', isSecret: false },
      { name: 'ENABLE_GIVEAWAYS', value: 'true', isSecret: false },
      { name: 'DEVELOPER_IDS', value: developerIds, isSecret: false },
      { name: 'LOG_LEVEL', value: 'info', isSecret: false },
      { name: 'RATE_LIMIT_WINDOW', value: '60000', isSecret: false },
      { name: 'RATE_LIMIT_MAX_REQUESTS', value: '10', isSecret: false },
      { name: 'CONTROL_API_KEY', value: controlApiToken, isSecret: true },
      { name: 'SUPPORT_SERVER_INVITE', value: 'https://discord.gg/pegasus', isSecret: false },
    ];

    const { serviceUuid, apiPort } = await CoolifyService.provisionService(instanceId, customEnvs);
    logToFile(instanceId, `Service UUID: ${serviceUuid}`);

    // Assuming we use a localhost tunnel or direct routing if on same machine for now
    // Since Coolify runs on a remote server, we need to use its hostname
    const coolifyHost = process.env.COOLIFY_API_URL ? new URL(process.env.COOLIFY_API_URL).hostname : '127.0.0.1';
    const apiUrl = `http://${coolifyHost}:${apiPort}`; 

    // 2. Store Coolify service UUID
    await db.update(hostedInstances)
      .set({ 
        coolifyServiceUuid: serviceUuid,
        controlTokenHash,
        encryptedApiToken,
        apiUrl,
        status: 'deploying'
      })
      .where(eq(hostedInstances.id, instanceId));

    // 3. Start the service
    logToFile(instanceId, '2. Deploying service...');
    const deploymentUuid = await CoolifyService.deploy(serviceUuid);
    logToFile(instanceId, `Deployment queued with UUID: ${deploymentUuid}`);

    // 5. Verify runtime health/readiness (Bot container health)
    await db.update(hostedInstances)
      .set({ status: 'starting' })
      .where(eq(hostedInstances.id, instanceId));

    let isHealthy = false;
    for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
      const metrics = await CoolifyService.getMetrics(serviceUuid);
      // Assuming Coolify reports 'running' or 'running:unknown' when the service is up
      if (metrics?.status?.startsWith('running') || metrics?.status === 'healthy') {
        isHealthy = true;
        break;
      }
      
      if (metrics?.status === 'exited' || metrics?.status === 'restarting') {
        logToFile(instanceId, `Waiting for service... Current status: ${metrics.status} (attempt ${i+1}/${MAX_POLL_ATTEMPTS})`);
      }
      
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    }

    if (!isHealthy) {
      throw new Error('Health check timed out');
    }

    // 6. Active
    logToFile(instanceId, '3. Marking as active...');
    await db.update(hostedInstances)
      .set({ 
        status: 'active',
        // version/commitSha could potentially be fetched from the deployment metadata if available
      })
      .where(eq(hostedInstances.id, instanceId));

    logToFile(instanceId, 'Provisioning complete!');

  } catch (error: any) {
    logToFile(instanceId, 'Provisioning failed', error);
    
    // Store safe error state
    await db.update(hostedInstances)
      .set({ status: 'failed' })
      .where(eq(hostedInstances.id, instanceId));
  }
}
