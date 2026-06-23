import { useEffect, useState } from 'react';
import { Users, Globe, Activity, AlertTriangle, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import { StatCard, PageHeader, LoadingSpinner } from '../components/UI';
import { useTheme } from '../context/ThemeContext';

const chartThemes = {
  dark: {
    grid: '#334155',
    tick: '#94a3b8',
    tooltip: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#f1f5f9' },
  },
  light: {
    grid: '#e2e8f0',
    tick: '#64748b',
    tooltip: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#0f172a' },
  },
} as const;

export default function DashboardPage() {
  const { theme } = useTheme();
  const chartTheme = chartThemes[theme];
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="text-center text-dark-muted">Failed to load dashboard</div>;

  const chartData = stats.requestsOverTime.map((r, i) => ({
    date: r.date.slice(5),
    requests: r.count,
    errors: stats.errorsOverTime[i]?.count || 0,
    activity: stats.userActivity[i]?.count || 0,
  }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="System overview and statistics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard title="Users" value={stats.users} icon={Users} color="#0891b2" subtitle={`${stats.activeUsers} active`} />
        <StatCard title="Endpoints" value={stats.endpoints} icon={Globe} color="#0e7490" />
        <StatCard title="Requests" value={stats.requests} icon={Activity} color="#10b981" />
        <StatCard title="Errors" value={stats.errors} icon={AlertTriangle} color="#ef4444" />
        <StatCard title="Groups" value={stats.groups} icon={Shield} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Requests Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" tick={{ fill: chartTheme.tick, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Area type="monotone" dataKey="requests" stroke="#0891b2" fill="#0891b220" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Errors Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" tick={{ fill: chartTheme.tick, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#ef444420" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4 text-sm">User Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" tick={{ fill: chartTheme.tick, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Area type="monotone" dataKey="activity" stroke="#0e7490" fill="#0e749020" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
