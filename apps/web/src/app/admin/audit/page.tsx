'use client';

import { useAuth } from '@/auth';
import { AdminRoute } from '@/components/admin';
import { SessionTimer } from '@/components/features';
import { AppSidebar } from '@/components/main/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sections } from '@/data/sections';
import { AuditEvent, clearAuditEvents, getAuditEvents } from '@/lib/audit-store';
import { Database, LogOut, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function AuditLogContent() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = () => {
    setIsLoading(true);
    const events = getAuditEvents();
    setLogs(events);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleClearLogs = () => {
    clearAuditEvents();
    setLogs([]);
    toast.success('Audit logs cleared');
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  const getStatusBadge = (status: AuditEvent['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600 text-white">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600 text-white">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    if (action.startsWith('USER_')) return <Badge variant="outline" className="border-blue-500 text-blue-600">{action}</Badge>;
    if (action.startsWith('SURVEY_')) return <Badge variant="outline" className="border-green-500 text-green-600">{action}</Badge>;
    if (action.startsWith('SETTINGS_')) return <Badge variant="outline" className="border-orange-500 text-orange-600">{action}</Badge>;
    return <Badge variant="outline">{action}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar sections={sections.sections} defaultSection={sections.defaultSection} />
      <SidebarInset>
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Audit Logs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <SessionTimer />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-indigo-600" />
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
              </div>
              <p className="text-muted-foreground">
                Track administrative actions, user changes, and system audit trails
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadLogs}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearLogs} disabled={logs.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Logs
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Audit Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search by actor, target, action, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="USER_CREATE">User Create</SelectItem>
                    <SelectItem value="USER_UPDATE">User Update</SelectItem>
                    <SelectItem value="USER_DELETE">User Delete</SelectItem>
                    <SelectItem value="SURVEY_CREATE">Survey Create</SelectItem>
                    <SelectItem value="SETTINGS_UPDATE">Settings Update</SelectItem>
                    <SelectItem value="SYSTEM_BACKUP">System Backup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Events ({filteredLogs.length})</CardTitle>
              <CardDescription>Chronological system activity record</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Database className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-1 text-lg font-semibold">No audit logs found</h3>
                  <p className="text-muted-foreground text-sm">
                    {searchTerm || actionFilter !== 'all'
                      ? 'No events matched your search or action filter.'
                      : 'Audit logs will appear here as system actions take place.'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium text-sm">{log.actor}</TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell className="text-sm font-semibold">{log.target}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminAuditPage() {
  return (
    <AdminRoute requireAdmin>
      <AuditLogContent />
    </AdminRoute>
  );
}
