'use client';

import Link from 'next/link';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Play, Square, RotateCw, CloudUpload, Activity, Cpu, Server, Terminal, AlertTriangle, Eye, EyeOff, Edit3, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function InstanceClient({ initialInstance }: { initialInstance: any }) {
  const [status, setStatus] = useState(initialInstance.status);
  const [metrics, setMetrics] = useState({ cpu: '0%', memory: '0 MB', uptime: '0s' });
  const [logs, setLogs] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionConfirm, setActionConfirm] = useState<{ isOpen: boolean; action: string | null; title: string; description: string }>({ isOpen: false, action: null, title: '', description: '' });
  const [env, setEnv] = useState<Record<string, any>>({});
  const [name, setName] = useState(initialInstance.name || 'My Community Bot');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
  
  const logsRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Status mapping
  const getStatusDisplay = (s: string) => {
    switch (s) {
      case 'active': return { label: 'Online', color: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' };
      case 'pending_setup': return { label: 'Setup Required', color: 'bg-amber-500/15 text-amber-500 border-amber-500/20' };
      case 'provisioning':
      case 'deploying':
      case 'starting': return { label: 'Deploying', color: 'bg-blue-500/15 text-blue-500 border-blue-500/20' };
      case 'failed': return { label: 'Failed', color: 'bg-red-500/15 text-red-500 border-red-500/20' };
      case 'suspended': return { label: 'Suspended', color: 'bg-muted text-muted-foreground border-muted-foreground/20' };
      default: return { label: s, color: 'bg-secondary text-secondary-foreground' };
    }
  };

  const statusInfo = getStatusDisplay(status);

  // Polling
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Status
      try {
        const sRes = await fetch(`/api/instances/${initialInstance.id}/status`);
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.status) setStatus(sData.status);
        }
      } catch (e) {}

      // Fetch Metrics if active
      if (status === 'active' || status === 'starting' || status === 'deploying') {
        try {
          const mRes = await fetch(`/api/instances/${initialInstance.id}/metrics`);
          if (mRes.ok) {
            const mData = await mRes.json();
            if (mData.metrics) setMetrics(mData.metrics);
          }
        } catch (e) {}
      }

      // Fetch Logs
      try {
        const lRes = await fetch(`/api/instances/${initialInstance.id}/logs`);
        if (lRes.ok) {
          const lData = await lRes.json();
          if (lData.logs) {
            setLogs(lData.logs);
            // Auto scroll logs
            if (logsRef.current) {
              logsRef.current.scrollTop = logsRef.current.scrollHeight;
            }
          }
        }
      } catch (e) {}
    };

    // Fetch Env once
    fetch(`/api/instances/${initialInstance.id}/env`).then(r => r.json()).then(d => {
      if (d.env) setEnv(d.env);
    });

    fetchData(); // Initial fetch
    pollIntervalRef.current = setInterval(fetchData, 5000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [initialInstance.id, status]);

  const handleAction = async (action: string) => {
    setActionConfirm({ ...actionConfirm, isOpen: false });
    setLoadingAction(action);
    try {
      const res = await fetch(`/api/instances/${initialInstance.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        toast.success(`Instance ${action} initiated`);
        if (action === 'redeploy') setStatus('deploying');
      } else {
        const data = await res.json();
        toast.error(`Action failed: ${data.error}`);
      }
    } catch (e) {
      toast.error('Failed to communicate with server');
    }
    setLoadingAction(null);
  };

  const confirmAction = (action: string, title: string, description: string) => {
    setActionConfirm({ isOpen: true, action, title, description });
  };

  const handleNameSave = async () => {
    try {
      const res = await fetch(`/api/instances/${initialInstance.id}/name`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        setName(newName);
        setIsEditingName(false);
        toast.success('Instance name updated');
      } else {
        toast.error('Failed to update name');
      }
    } catch (e) {
      toast.error('Network error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-inner">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 group">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-xl font-bold w-64"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={handleNameSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{name}</h1>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditingName(true)}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-secondary/50">Pegasus Hosted</Badge>
              <Badge variant="outline" className={`${statusInfo.color} font-medium`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                {statusInfo.label}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={loadingAction !== null || status === 'deploying'}
            onClick={() => handleAction('start')}
          >
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={loadingAction !== null || status === 'deploying'}
            onClick={() => confirmAction('stop', 'Stop Instance', 'Are you sure you want to stop the bot? It will go offline immediately.')}
          >
            <Square className="h-4 w-4 mr-2" /> Stop
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={loadingAction !== null || status === 'deploying'}
            onClick={() => handleAction('restart')}
          >
            <RotateCw className="h-4 w-4 mr-2" /> Restart
          </Button>
          <Button 
            variant="default" 
            size="sm"
            disabled={loadingAction !== null || status === 'deploying'}
            onClick={() => confirmAction('redeploy', 'Redeploy Instance', 'This will pull the latest version and recreate the stack. The bot will experience a short downtime.')}
          >
            <CloudUpload className="h-4 w-4 mr-2" /> Redeploy
          </Button>
        </div>
      </div>

      {status === 'failed' && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex gap-4">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-500">Deployment Failed</h3>
            <p className="text-sm text-red-500/80 mt-1">
              The instance could not start successfully. Please check the logs below for more details or try redeploying.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Cpu className="h-4 w-4 mr-2" /> CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.cpu || '0%'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-2" /> Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.memory || '0 MB'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-2" /> Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.uptime || '0s'}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deployment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Version</div>
                  <div className="font-medium flex items-center">
                    <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                    {initialInstance.version || 'v1.4.2'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Commit</div>
                  <div className="font-mono text-sm bg-muted px-2 py-1 rounded inline-flex">
                    {initialInstance.commitSha || 'a82c91f'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/50 mt-8">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Danger Zone
              </CardTitle>
              <CardDescription>
                Destructive actions that cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Cancel Subscription & Delete Instance</h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Once you cancel your subscription, this instance and all associated data, settings, and databases will be permanently destroyed when the billing cycle ends.
                  </p>
                </div>
                <Button variant="destructive" className="mt-4 sm:mt-0 flex-shrink-0" asChild>
                  <Link href="/dashboard/profile/billing">
                    Cancel Subscription
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="servers">
          <ServersTab instanceId={initialInstance.id} status={status} />
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Runtime Logs</CardTitle>
                <CardDescription>Standard output from the bot container</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setLogs('')}>
                Clear
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-zinc-950 p-4 relative">
                {logs === 'Logs unavailable.' ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-zinc-500 font-sans">
                    <Terminal className="h-10 w-10 mb-4 opacity-50" />
                    <p className="text-sm font-medium">Log streaming is currently disabled in your Coolify deployment.</p>
                    <p className="text-xs mt-2 opacity-70">Please check your host server directly to view the container logs.</p>
                  </div>
                ) : (
                  <div 
                    ref={logsRef}
                    className="h-[500px] overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap"
                  >
                    {logs || 'No logs available yet...'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config">
          <ConfigTab env={env} instanceId={initialInstance.id} />
        </TabsContent>
      </Tabs>

      <Dialog open={actionConfirm.isOpen} onOpenChange={(open) => setActionConfirm({ ...actionConfirm, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionConfirm.title}</DialogTitle>
            <DialogDescription>
              {actionConfirm.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionConfirm({ ...actionConfirm, isOpen: false })}>Cancel</Button>
            <Button onClick={() => actionConfirm.action && handleAction(actionConfirm.action)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConfigTab({ env, instanceId }: { env: Record<string, any>; instanceId: string }) {
  // Use a ref or local state to store the editable overrides
  const [editableEnv, setEditableEnv] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  // Initialize editable env
  useEffect(() => {
    const initEnv: Record<string, string> = {};
    Object.keys(env).forEach(key => {
      if (!env[key].system && !env[key].secret) {
        initEnv[key] = env[key].value || '';
      }
    });
    setEditableEnv(initEnv);
  }, [env]);

  const handleEnvChange = (key: string, value: string) => {
    setEditableEnv(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Only send variables that have been modified or provided
    const updates: Record<string, string> = {};
    
    Object.keys(editableEnv).forEach(key => {
      // If it's a secret and they didn't type anything, don't update it
      if (env[key]?.secret && editableEnv[key] === '') return;
      updates[key] = editableEnv[key];
    });

    if (Object.keys(updates).length === 0) {
      toast('No changes to save.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/instances/${instanceId}/env`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (res.ok) {
        toast.success('Configuration saved. Instance restarting...');
        // Clear secrets fields after save
        setEditableEnv(prev => {
          const next = { ...prev };
          Object.keys(env).forEach(k => { if (env[k].secret) next[k] = ''; });
          return next;
        });
      } else {
        const data = await res.json();
        toast.error(`Failed to save: ${data.error}`);
      }
    } catch (e) {
      toast.error('Failed to communicate with server');
    }
    
    setIsSaving(false);
  };

  const toggleShowToken = (key: string) => {
    setShowTokens(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environment Variables</CardTitle>
          <CardDescription>Manage environment variables for your bot instance. Changes will automatically restart the bot.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {Object.keys(env).sort((a, b) => {
              // Sort non-system first, then alphabetical
              if (env[a].system === env[b].system) return a.localeCompare(b);
              return env[a].system ? 1 : -1;
            }).map((key) => {
              const variable = env[key];
              const isSystem = variable.system;
              const isSecret = variable.secret;

              return (
                <div key={key} className="space-y-1 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <Label className={`font-mono text-sm ${isSystem ? 'text-muted-foreground' : ''}`}>{key}</Label>
                    {isSystem && <Badge variant="outline" className="text-[10px] h-5 bg-muted/50">System</Badge>}
                  </div>
                  
                  {isSystem ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        disabled 
                        value={isSecret ? '•••••••••••••••• (Managed)' : variable.value || ''} 
                        className="bg-muted/50 text-muted-foreground"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input 
                          type={isSecret && !showTokens[key] ? "password" : "text"} 
                          value={editableEnv[key] !== undefined ? editableEnv[key] : (variable.value || '')} 
                          onChange={(e) => handleEnvChange(key, e.target.value)} 
                          placeholder={isSecret && variable.configured ? '•••••••••••••••• (Configured)' : `Enter value for ${key}`}
                          className={isSecret ? "pr-10" : ""}
                        />
                        {isSecret && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                            onClick={() => toggleShowToken(key)}
                          >
                            {showTokens[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {isSecret && !isSystem && (
                    <p className="text-xs text-muted-foreground mt-1">Only enter a new value if you wish to change the currently configured one.</p>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="border-t border-border/50 pt-4 mt-6">
            <Label className="mb-2 block">Add Custom Variable</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="KEY_NAME" 
                className="w-1/3" 
                id="new-env-key"
              />
              <Input 
                placeholder="Value" 
                className="flex-1" 
                id="new-env-value"
              />
              <Button 
                variant="secondary" 
                onClick={() => {
                  const keyInput = document.getElementById('new-env-key') as HTMLInputElement;
                  const valInput = document.getElementById('new-env-value') as HTMLInputElement;
                  const k = keyInput?.value?.trim();
                  const v = valInput?.value;
                  if (k && v !== undefined) {
                    handleEnvChange(k, v);
                    // Also add it locally to `env` so it renders immediately
                    env[k] = { value: v, secret: false, system: false };
                    keyInput.value = '';
                    valInput.value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="mt-6 w-full sm:w-auto">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Infrastructure</CardTitle>
          <CardDescription>System-managed dependencies are provisioned automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">PostgreSQL Database</div>
                <div className="text-sm text-muted-foreground">Managed automatically</div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Redis Cache</div>
                <div className="text-sm text-muted-foreground">Managed automatically</div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServersTab({ instanceId, status }: { instanceId: string; status: string }) {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'active') {
      setLoading(false);
      return;
    }

    const fetchServers = async () => {
      try {
        const res = await fetch(`/api/instances/${instanceId}/servers`);
        if (res.ok) {
          const data = await res.json();
          if (data.error) {
            setError(data.error);
          } else {
            setServers(data.servers || []);
          }
        } else {
          setError('Failed to load servers. Make sure the bot token is configured correctly.');
        }
      } catch (err) {
        setError('Network error while loading servers.');
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [instanceId, status]);

  if (status !== 'active') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instance Offline</h3>
          <p className="text-muted-foreground">
            The bot must be online to fetch its server list from Discord. Please start or finish provisioning your instance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Connected Servers</span>
          <Badge variant="secondary">{servers.length} Total</Badge>
        </CardTitle>
        <CardDescription>Servers where your white-labeled bot is currently invited.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-sm">
            {error}
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg bg-muted/30">
            <p className="text-muted-foreground">The bot hasn't been invited to any servers yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {server.icon ? (
                      <img src={server.icon} alt={server.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold">{server.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{server.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{server.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => toast('Guild configuration coming soon!')}>
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
