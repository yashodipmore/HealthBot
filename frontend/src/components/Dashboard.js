/**
 * HealthBot Monitor - Dashboard Component
 * Real-time monitoring dashboard with Datadog metrics
 */
import React, { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { getMetrics, getDashboardData, getStats, getAlerts } from '../services/api';
import './Dashboard.css';

// Professional SVG Icons
const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ServerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const ChartLineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const DatadogIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 14c.5-1 1.5-1 2-1s1 .5 1.5 1c.5.5 1.5.5 2 0 .5-.5 1-1 1.5-1s1.5 0 2 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
  </svg>
);

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, color, suffix = '' }) => (
  <div className={`metric-card ${color}`}>
    <div className="metric-icon">
      <Icon />
    </div>
    <div className="metric-info">
      <span className="metric-title">{title}</span>
      <span className="metric-value">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="metric-suffix">{suffix}</span>
      </span>
      {trend !== undefined && (
        <span className={`metric-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            {trend >= 0 ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
          {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status, text }) => (
  <span className={`status-badge ${status}`}>
    <span className="status-dot"></span>
    {text}
  </span>
);

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [responseTimeHistory, setResponseTimeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [setupMessage, setSetupMessage] = useState(null);

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const [metricsData, statsData, dashboardData, alertsData] = await Promise.all([
        getMetrics(),
        getStats(),
        getDashboardData(),
        getAlerts()
      ]);

      setMetrics(metricsData);
      setStats(statsData);
      setAlerts(alertsData.alerts || []);

      // Process response time history for chart
      if (dashboardData.response_time_history) {
        const historyData = dashboardData.response_time_history.map((item, index) => ({
          name: `#${index + 1}`,
          responseTime: item.value,
          time: new Date(item.timestamp).toLocaleTimeString()
        }));
        setResponseTimeHistory(historyData);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchMetrics();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Format uptime
  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  // Calculate error rate
  const errorRate = metrics && metrics.total_requests > 0
    ? ((metrics.failed_requests / metrics.total_requests) * 100).toFixed(2)
    : 0;

  // Use real trend data from API only (no mock data)
  const trendData = responseTimeHistory.length > 0 ? responseTimeHistory : [];

  if (isLoading && !metrics) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="dashboard-title-icon">
            <ChartLineIcon />
          </div>
          <div>
            <h1>Monitoring Dashboard</h1>
            <p>Real-time metrics powered by Datadog</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh</span>
          </label>
          <button className="refresh-btn" onClick={fetchMetrics}>
            <RefreshIcon />
            Refresh
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="status-bar">
        <StatusBadge 
          status={stats?.gemini?.connected ? 'online' : 'offline'} 
          text={`Gemini: ${stats?.gemini?.connected ? 'Connected' : 'Disconnected'}`}
        />
        <StatusBadge 
          status={stats?.datadog?.connected ? 'online' : 'offline'} 
          text={`Datadog: ${stats?.datadog?.connected ? 'Connected' : 'Disconnected'}`}
        />
        <StatusBadge 
          status={stats?.tracing_enabled ? 'online' : 'warning'} 
          text={`APM: ${stats?.tracing_enabled ? 'Enabled' : 'Disabled'}`}
        />
        {lastUpdated && (
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Requests"
          value={metrics?.total_requests || 0}
          icon={ActivityIcon}
          color="primary"
        />
        <MetricCard
          title="Avg Response Time"
          value={metrics?.average_response_time_ms?.toFixed(0) || 0}
          suffix="ms"
          icon={ClockIcon}
          color="secondary"
        />
        <MetricCard
          title="Success Rate"
          value={metrics?.total_requests > 0 
            ? ((metrics.successful_requests / metrics.total_requests) * 100).toFixed(1) 
            : 100}
          suffix="%"
          icon={CheckCircleIcon}
          color="success"
        />
        <MetricCard
          title="Error Rate"
          value={errorRate}
          suffix="%"
          icon={AlertTriangleIcon}
          color={parseFloat(errorRate) > 5 ? 'error' : 'warning'}
        />
        <MetricCard
          title="Tokens Used"
          value={metrics?.total_tokens_used || 0}
          icon={ZapIcon}
          color="purple"
        />
        <MetricCard
          title="Uptime"
          value={formatUptime(metrics?.uptime_seconds)}
          icon={ServerIcon}
          color="info"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Response Time Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <ChartLineIcon />
            <h3>Response Time Trend</h3>
          </div>
          <div className="chart-container">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} unit="ms" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '2px solid #1A1A2E',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: '#1A1A2E', fontWeight: 600 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#7C3AED" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorResponse)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-message">
                <BarChartIcon />
                <p>No response time data yet. Start chatting to see metrics!</p>
              </div>
            )}
          </div>
        </div>

        {/* Request Stats Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <BarChartIcon />
            <h3>Request Statistics</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Successful', value: metrics?.successful_requests || 0, fill: '#10b981' },
                { name: 'Failed', value: metrics?.failed_requests || 0, fill: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '2px solid #1A1A2E',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: '#1A1A2E', fontWeight: 600 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="alerts-panel">
        <div className="alerts-header">
          <div className="alerts-title">
            <BellIcon />
            <h3>Active Alerts</h3>
          </div>
          <span className={`alerts-count ${alerts.length === 0 ? 'healthy' : 'warning'}`}>
            {alerts.length === 0 ? (
              <>
                <CheckCircleIcon />
                All systems healthy
              </>
            ) : (
              <>
                <AlertTriangleIcon />
                {alerts.length} alert(s)
              </>
            )}
          </span>
        </div>
        
        {alerts.length > 0 ? (
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert-item ${alert.type}`}>
                <span className="alert-icon">
                  <AlertTriangleIcon />
                </span>
                <div className="alert-content">
                  <span className="alert-name">{alert.name}</span>
                  <span className="alert-message">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alerts-empty">
            <CheckCircleIcon />
            <p>No alerts - Everything is running smoothly!</p>
          </div>
        )}
        
        {setupMessage && (
          <div className="setup-message success">
            {setupMessage}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="system-info-card">
        <div className="system-info-header">
          <SettingsIcon />
          <h3>System Information</h3>
        </div>
        <div className="system-info-grid">
          <div className="info-item">
            <span className="info-label">Active Conversations</span>
            <span className="info-value">{stats?.gemini?.active_conversations || 0}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Buffered Metrics</span>
            <span className="info-value">{stats?.datadog?.buffered_metrics || 0}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tracing Status</span>
            <span className={`info-value ${stats?.tracing_enabled ? 'enabled' : 'disabled'}`}>
              {stats?.tracing_enabled ? (
                <>
                  <CheckCircleIcon />
                  Enabled
                </>
              ) : (
                <>
                  <AlertTriangleIcon />
                  Disabled
                </>
              )}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">API Version</span>
            <span className="info-value">1.0.0</span>
          </div>
        </div>
      </div>

      {/* Datadog Integration Info */}
      <div className="datadog-info">
        <div className="datadog-logo">
          <DatadogIcon />
        </div>
        <div className="datadog-text">
          <h4>Datadog Integration</h4>
          <p>
            All metrics are being sent to Datadog in real-time. 
            View detailed dashboards and set up alerts in your{' '}
            <a href="https://app.datadoghq.com" target="_blank" rel="noopener noreferrer">
              Datadog Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
