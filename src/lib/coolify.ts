import fs from 'fs';
import path from 'path';

export interface CoolifyEnvVar {
  name: string;
  value: string;
  isSecret?: boolean;
}

export class CoolifyService {
  private static get baseUrl() {
    return process.env.COOLIFY_API_URL?.replace(/\/$/, '') || '';
  }

  private static get token() {
    return process.env.COOLIFY_API_TOKEN || '';
  }

  private static get projectId() {
    return process.env.COOLIFY_PROJECT_UUID || '';
  }
  
  private static get environmentName() {
    return process.env.COOLIFY_ENVIRONMENT_NAME || 'production';
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.baseUrl || !this.token) {
      throw new Error('Coolify configuration is missing');
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Coolify API Error (${response.status}): ${errorText}`);
    }

    // Some endpoints (like start/stop) might return 200 with text like "Service started" instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return (await response.text()) as any;
  }

  /**
   * Creates a new Docker Compose Service in Coolify from the bot/docker-compose.yml
   */
  static async provisionService(
    instanceId: string,
    customEnvs: CoolifyEnvVar[] = []
  ): Promise<{ serviceUuid: string; apiPort: number }> {
    // 1. Read the docker-compose.yml
    const composePath = path.join(process.cwd(), '..', 'bot', 'docker-compose.yml');
    let composeContent: string;
    try {
      composeContent = fs.readFileSync(composePath, 'utf8');
    } catch (e) {
      // Fallback if running compiled in dashboard directly
      composeContent = fs.readFileSync(path.join(process.cwd(), 'docker-compose.bot.yml'), 'utf8');
    }

    // Generate secure randomized credentials for this isolated stack
    const dbUser = `pegasus_${instanceId.replace(/-/g, '').substring(0, 8)}`;
    const dbPass = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const redisPass = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');

    // Configure the bot build to use the official Pegasus GitHub repository and Dockerfile
    composeContent = composeContent.replace(/\s*context:\s*\./g, "\n      context: 'https://github.com/semi-constructor/pegasus.git#main'");

    // Remove adminer service for production hosted instances
    composeContent = composeContent.replace(
      /(\s*# Optional: Database management UI\s*adminer:[\s\S]*?ADMINER_DESIGN: pepa-linha)/,
      ""
    );
    
    // Remove local bind mounts which crash remote coolify deployments
    // (We leave env_file: - .env because Coolify writes it for us)
    // Remove the init.sql volume map from postgres, taking care of empty volumes if it's the only one (it's not, postgres-data is there)
    composeContent = composeContent.replace(/\s*-\s*\.\/init\.sql:\/docker-entrypoint-initdb\.d\/init\.sql:ro/g, "");
    
    // Remove other local volume mounts if they exist
    composeContent = composeContent.replace(/\s*-\s*\.\/logs:\/app\/logs/g, "");
    
    // Remove empty volumes: block if it has no items (fixes docker-compose validation error)
    // Only match indented volumes to avoid removing the top-level volumes block
    composeContent = composeContent.replace(/\r?\n[ \t]+volumes:\s*\r?\n(?=\s*(?:#|[a-zA-Z]|$))/g, "\n");
    
    // Inject unique container_names to prevent conflicts between multiple hosted instances
    composeContent = composeContent.replace(/container_name:\s*pegasus-bot/g, `container_name: pegasus-bot-${instanceId}`);
    composeContent = composeContent.replace(/container_name:\s*pegasus-db/g, `container_name: pegasus-db-${instanceId}`);
    composeContent = composeContent.replace(/container_name:\s*pegasus-redis/g, `container_name: pegasus-redis-${instanceId}`);

    // Fix redis healthcheck to include password
    // Fix Redis healthcheck - use $$ to escape in code, so it becomes $ in regex output,
    // which Docker Compose then substitutes with the actual value at deploy time.
    composeContent = composeContent.replace(
      /\s*test: \["CMD", "redis-cli", "--raw", "incr", "ping"\]/g,
      '\n      test: ["CMD-SHELL", "redis-cli -a ${REDIS_PASSWORD:-changeme} ping | grep PONG"]'
    );

    // Remove env_file to prevent "file not found" errors in Docker Compose
    composeContent = composeContent.replace(/\s*env_file:[\s\S]*?- \.env/g, "");
    
    // Remove deploy block which can cause exits on non-swarm environments or older docker-compose
    composeContent = composeContent.replace(/\s*deploy:[\s\S]*?memory: 512M/g, "");
    
    // Completely remove the custom network, let Coolify manage networking
    composeContent = composeContent.replace(/\s*networks:\s*-\s*pegasus-network/g, "");
    composeContent = composeContent.replace(/\s*networks:[\s\S]*?(?=\r?\nvolumes:|$)/, "\n");
    
    const apiPort = Math.floor(Math.random() * 10000) + 20000;
    const dbPort = Math.floor(Math.random() * 10000) + 20000;
    const redisPort = Math.floor(Math.random() * 10000) + 20000;
    const adminerPort = Math.floor(Math.random() * 10000) + 20000;
    
    // Hardcode ports directly into the docker-compose to prevent variable substitution failures in Coolify
    composeContent = composeContent.replace('"${DB_PORT:-5432}:5432"', `"${dbPort}:5432"`);
    composeContent = composeContent.replace('"${REDIS_PORT:-6379}:6379"', `"${redisPort}:6379"`);
    composeContent = composeContent.replace('"${API_PORT:-2000}:2000"', `"${apiPort}:2000"`);
    composeContent = composeContent.replace('"${ADMINER_PORT:-8080}:8080"', `"${adminerPort}:8080"`);
    
    const systemEnvs: CoolifyEnvVar[] = [
      { name: 'POSTGRES_DB', value: 'pegasus' },
      { name: 'POSTGRES_USER', value: dbUser },
      { name: 'POSTGRES_PASSWORD', value: dbPass, isSecret: true },
      { name: 'REDIS_PASSWORD', value: redisPass, isSecret: true },
      { name: 'DATABASE_URL', value: `postgresql://${dbUser}:${dbPass}@postgres:5432/pegasus?sslmode=disable`, isSecret: true },
      { name: 'REDIS_URL', value: `redis://:${redisPass}@redis:6379`, isSecret: true },
      { name: 'NODE_ENV', value: 'production' },
      { name: 'INSTANCE_ID', value: instanceId },
      { name: 'API_PORT', value: '2000' }, // Bot listens on 2000 internally
      { name: 'DB_PORT', value: dbPort.toString() },
      { name: 'REDIS_PORT', value: redisPort.toString() },
      { name: 'ADMINER_PORT', value: adminerPort.toString() },
      { name: 'NIXPACKS_PKGS', value: 'build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev' },
      { name: 'NIXPACKS_NODE_VERSION', value: '22' },
    ];

    const allEnvs = [...systemEnvs, ...customEnvs];

    // Explicitly inject all environment variables into the bot's environment: block
    // since we removed env_file: - .env
    // Filter out keys already present to avoid YAML duplicate key errors (which cause Coolify 500s)
    const existingKeys = new Set(['NODE_ENV', 'DATABASE_URL', 'REDIS_URL', 'ENABLE_API', 'API_PORT']);
    const envInjection = allEnvs
      .filter(e => !existingKeys.has(e.name))
      .map(e => `\n      ${e.name}: \${${e.name}}`)
      .join('');
      
    composeContent = composeContent.replace(
      /API_PORT: \$\{API_PORT:-2000\}/, 
      `API_PORT: \${API_PORT:-2000}${envInjection}`
    );

    // Convert to .env format string for Coolify service creation payload
    const payload = {
      project_uuid: this.projectId,
      environment_name: this.environmentName,
      server_uuid: process.env.COOLIFY_SERVER_UUID,
      name: `pegasus-hosted-${instanceId}`,
      docker_compose_raw: Buffer.from(composeContent).toString('base64'),
    };

    // 2. Create the Service Stack
    const createRes = await this.request<any>('/api/v1/services', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const serviceUuid = createRes.uuid;
    if (!serviceUuid) throw new Error('Failed to retrieve service UUID from Coolify');

    // 3. Inject Environment Variables
    await this.updateCustomerEnv(serviceUuid, allEnvs);

    return { serviceUuid, apiPort };
  }

  static async updateCustomerEnv(serviceUuid: string, envs: CoolifyEnvVar[]) {
    // Attempt to upsert environment variables 
    for (const env of envs) {
      try {
        await this.request(`/api/v1/services/${serviceUuid}/envs`, {
          method: 'POST',
          body: JSON.stringify({
            key: env.name,
            value: env.value,
            is_preview: false,
            is_build_time: false,
            is_secret: env.isSecret || false
          })
        });
      } catch (err: any) {
        if (err.message && err.message.includes('409')) {
          // If it already exists, PATCH it instead
          try {
            await this.request(`/api/v1/services/${serviceUuid}/envs`, {
              method: 'PATCH',
              body: JSON.stringify({
                key: env.name,
                value: env.value,
                is_preview: false,
                is_build_time: false,
                is_secret: env.isSecret || false
              })
            });
          } catch (patchErr) {
            console.error(`Failed to patch env ${env.name} for ${serviceUuid}`, patchErr);
          }
        } else {
          console.error(`Failed to set env ${env.name} for ${serviceUuid}`, err);
        }
      }
    }
  }

  static async getEnvs(serviceUuid: string): Promise<any[]> {
    try {
      const res = await this.request<any[]>(`/api/v1/services/${serviceUuid}/envs`);
      return res;
    } catch (e) {
      return [];
    }
  }

  static async deploy(serviceUuid: string): Promise<string> {
    const res = await this.request<any>(`/api/v1/deploy?uuid=${serviceUuid}`, { method: 'POST' });
    console.log('Deploy Response from Coolify:', res);
    return res.deployment_uuid || res.uuid || res.message || res;
  }

  static async getDeploymentStatus(deploymentUuid: string): Promise<string> {
    const res = await this.request<any>(`/api/v1/deployments/${deploymentUuid}`);
    return res.status; 
  }

  static async getServiceStatus(serviceUuid: string): Promise<any> {
    const res = await this.request<any>(`/api/v1/services/${serviceUuid}`);
    return res.status; 
  }

  static async getLogs(serviceUuid: string): Promise<string> {
    try {
      const res = await this.request<string>(`/api/v1/services/${serviceUuid}/logs`);
      return res;
    } catch (e) {
      return "Logs unavailable.";
    }
  }

  static async getMetrics(serviceUuid: string): Promise<any> {
    try {
      const res = await this.request<any>(`/api/v1/services/${serviceUuid}`);
      return {
        status: res.status,
        cpu: res.cpu || '0%',
        memory: res.memory || '0 MB',
        uptime: res.uptime || '0s'
      };
    } catch (e) {
      return null;
    }
  }

  static async start(serviceUuid: string) {
    return this.request(`/api/v1/services/${serviceUuid}/start`, { method: 'POST' });
  }

  static async stop(serviceUuid: string) {
    return this.request(`/api/v1/services/${serviceUuid}/stop`, { method: 'POST' });
  }

  static async restart(serviceUuid: string) {
    return this.request(`/api/v1/services/${serviceUuid}/restart`, { method: 'POST' });
  }

  static async delete(serviceUuid: string) {
    return this.request(`/api/v1/services/${serviceUuid}`, { method: 'DELETE' });
  }
}
