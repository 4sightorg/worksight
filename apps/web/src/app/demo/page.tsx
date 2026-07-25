'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDemoSnapshot, type DemoSnapshot } from '@/lib/mvp-api-bridge';
import { getApiBaseUrl } from '@/lib/worksight-api';
import { Activity, AlertTriangle, HeartPulse, ListChecks, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

function riskVariant(risk: 'low' | 'medium' | 'high') {
  if (risk === 'high') return 'destructive' as const;
  if (risk === 'medium') return 'secondary' as const;
  return 'outline' as const;
}

export default function DemoPage() {
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBase = getApiBaseUrl();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchDemoSnapshot();
        if (!cancelled) {
          setSnapshot(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">WorkSight MVP</p>
        <h1 className="text-3xl font-semibold tracking-tight">E2E demo path</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          This page calls the Nest API at{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">{apiBase}</code>. The API serves
          the same <code className="bg-muted rounded px-1 py-0.5 text-xs">@worksight/common</code>{' '}
          fixtures as the web bridge — fixture-backed only, not Supabase persistence.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">source: Nest API</Badge>
          <Badge variant="secondary">contract: @worksight/common</Badge>
          <Badge variant="outline">persistence: fixtures</Badge>
        </div>
        <p className="text-muted-foreground text-xs">
          Authenticated dashboards stay on local fixtures unless{' '}
          <code className="bg-muted rounded px-1">NEXT_PUBLIC_USE_API=true</code>. Runbook:{' '}
          <code className="bg-muted rounded px-1">docs/mvp/DEMO.md</code>.
        </p>
      </header>

      {loading && (
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
