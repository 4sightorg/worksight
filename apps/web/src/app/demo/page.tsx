'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  fetchApiHealth,
  fetchDemoSnapshot,
  type DemoHealth,
  type DemoSnapshot,
} from '@/lib/mvp-api-bridge';
import { getApiBaseUrl, isApiDataMode } from '@/lib/worksight-api';
import {
  Activity,
  AlertTriangle,
  Database,
  HeartPulse,
  ListChecks,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

function riskVariant(risk: 'low' | 'medium' | 'high') {
  if (risk === 'high') return 'destructive' as const;
  if (risk === 'medium') return 'secondary' as const;
  return 'outline' as const;
}

function backendVariant(backend: DemoHealth['dataBackend']) {
  if (backend === 'postgres') return 'default' as const;
  if (backend === 'fixtures') return 'secondary' as const;
  return 'outline' as const;
}

function errorMessage(err: unknown): string {
  if (err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
    return 'Request timed out — no response from the API.';
  }
  return err instanceof Error ? err.message : String(err);
}

function formatUptime(seconds: number | null): string {
  if (seconds === null) return '—';
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${total % 60}s`;
  return `${total}s`;
}

export default function DemoPage() {
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<DemoHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const apiBase = getApiBaseUrl();
  const apiMode = isApiDataMode();

  const reload = useCallback(() => setReloadKey(key => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Health and snapshot settle independently: a failed probe must not blank the
    // counts, and a failed snapshot must not hide the backend readout.
    const healthLoad = fetchApiHealth().then(
      data => {
        if (!cancelled) {
          setHealth(data);
          setHealthError(null);
        }
      },
      err => {
        if (!cancelled) {
          setHealth(null);
          setHealthError(errorMessage(err));
        }
      }
    );

    const snapshotLoad = fetchDemoSnapshot().then(
      data => {
        if (!cancelled) {
          setSnapshot(data);
          setError(null);
        }
      },
      err => {
        if (!cancelled) {
          setSnapshot(null);
          setError(errorMessage(err));
        }
      }
    );

    void Promise.all([healthLoad, snapshotLoad]).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const persistenceLabel = loading ? 'checking…' : health ? health.dataBackend : 'unreachable';

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm tracking-wide uppercase">WorkSight MVP</p>
            <h1 className="text-3xl font-semibold tracking-tight">E2E demo path</h1>
          </div>
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : undefined} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          This page calls the Nest API at{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">{apiBase}</code>. Responses follow
          the <code className="bg-muted rounded px-1 py-0.5 text-xs">@worksight/common</code>{' '}
          contract; whether they come from Postgres or in-process fixtures is reported by{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">GET /health</code> below.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">source: Nest API</Badge>
          <Badge variant="secondary">contract: @worksight/common</Badge>
          <Badge variant={health ? backendVariant(health.dataBackend) : 'outline'}>
            persistence: {persistenceLabel}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">
          Authenticated dashboards stay on local fixtures unless{' '}
          <code className="bg-muted rounded px-1">NEXT_PUBLIC_USE_API=true</code>. Runbook:{' '}
          <code className="bg-muted rounded px-1">docs/mvp/DEMO.md</code>.
        </p>
      </header>

      <Card className={healthError ? 'border-destructive' : undefined}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {healthError ? <AlertTriangle className="h-4 w-4" /> : <Database className="h-4 w-4" />}
            API health
          </CardTitle>
          <CardDescription>
            <code className="bg-muted rounded px-1 text-xs">GET {apiBase}/health</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {healthError ? (
            <p className="text-muted-foreground">
              Health probe failed: {healthError} Start the API (
              <code className="bg-muted rounded px-1 text-xs">pnpm demo</code> or{' '}
              <code className="bg-muted rounded px-1 text-xs">
                PORT=3001 pnpm --filter @worksight/api start:prod
              </code>
              ) and refresh.
            </p>
          ) : (
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-muted-foreground text-xs">Status</dt>
                <dd className="font-medium">
                  {loading && !health ? '…' : (health?.status ?? '—')}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Data backend</dt>
                <dd>
                  {health ? (
                    <Badge variant={backendVariant(health.dataBackend)}>{health.dataBackend}</Badge>
                  ) : (
                    <span className="font-medium">…</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">DATABASE_URL configured</dt>
                <dd className="font-medium">
                  {health === null
                    ? '…'
                    : health.databaseUrlConfigured === null
                      ? 'not reported'
                      : health.databaseUrlConfigured
                        ? 'yes'
                        : 'no'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Uptime</dt>
                <dd className="font-medium">{formatUptime(health?.uptimeSeconds ?? null)}</dd>
              </div>
            </dl>
          )}
          {health?.dataBackend === 'unknown' && (
            <p className="text-muted-foreground mt-3 text-xs">
              This API build does not report{' '}
              <code className="bg-muted rounded px-1">dataBackend</code> — it predates the
              Drizzle/Neon layer and is serving fixtures.
            </p>
          )}
          <p className="text-muted-foreground mt-3 text-xs">
            <code className="bg-muted rounded px-1">NEXT_PUBLIC_USE_API</code> is{' '}
            <span className="font-medium">{apiMode ? 'true' : 'false'}</span> — /demo probes the API
            either way, but the authenticated dashboards only follow it when true.
          </p>
        </CardContent>
      </Card>

      {loading && !snapshot && !error && (
        <Card>
          <CardContent className="text-muted-foreground py-8 text-sm">
            Loading users, teams, tasks, and wellness stats from the API…
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              API unreachable
            </CardTitle>
            <CardDescription>
              Start the API (`pnpm demo` or `PORT=3001 pnpm --filter @worksight/api start:prod`)
              then reload. {error}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {snapshot && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" /> Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot.users.length}</div>
                <p className="text-muted-foreground text-xs">
                  GET /users · stats total {snapshot.userStats.totalEmployees}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="h-4 w-4" /> Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot.teams.length}</div>
                <p className="text-muted-foreground text-xs">GET /teams</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ListChecks className="h-4 w-4" /> Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot.tasks.length}</div>
                <p className="text-muted-foreground text-xs">GET /tasks (assignments)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <HeartPulse className="h-4 w-4" /> At-risk sample
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {snapshot.wellness.filter(w => w.riskLevel !== 'low').length}
                </div>
                <p className="text-muted-foreground text-xs">
                  medium/high burnout from task work-life scores
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Well-being framing (fixture-derived)</h2>
            <p className="text-muted-foreground text-sm">
              Burnout risk is derived from each employee&apos;s{' '}
              <code className="bg-muted rounded px-1 text-xs">GET /tasks/stats/:id</code> work-life
              balance score — same util the API uses from common.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {snapshot.wellness.map(row => (
                <Card key={row.employeeId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">{row.name}</CardTitle>
                      <Badge variant={riskVariant(row.riskLevel)}>{row.riskLevel} risk</Badge>
                    </div>
                    <CardDescription>
                      {row.completedTasks}/{row.totalTasks} tasks completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="flex justify-between">
                      <span>Work-life balance</span>
                      <span className="font-medium">{row.workLifeBalanceScore.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burnout score (0–10)</span>
                      <span className="font-medium">{row.burnoutScore.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Teams</h2>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Department</th>
                    <th className="px-3 py-2 font-medium">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.teams.map(team => (
                    <tr key={team.id} className="border-t">
                      <td className="px-3 py-2">{team.name}</td>
                      <td className="px-3 py-2">{team.department || '—'}</td>
                      <td className="px-3 py-2">{team.member_ids.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Sample tasks</h2>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 font-medium">Title</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Priority</th>
                    <th className="px-3 py-2 font-medium">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.tasks.slice(0, 12).map(task => (
                    <tr key={task.id} className="border-t">
                      <td className="px-3 py-2">
                        {task.title ?? task.external_id ?? task.id.slice(0, 8)}
                      </td>
                      <td className="px-3 py-2">{task.status}</td>
                      <td className="px-3 py-2">{task.priority}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {task.employee_id.slice(0, 8)}…
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
