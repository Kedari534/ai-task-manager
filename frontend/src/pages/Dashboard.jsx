import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Button, Progress, Tooltip } from 'antd';
import {
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  BrainCircuit, Sparkles, ArrowRight, Plus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CHART_STYLE = {
  background: '#13131a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  color: '#f0f0f5',
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const highPriority = tasks.filter(t => t.priority === 'HIGH').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Build weekly chart from task creation dates
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = weekDays.map(day => ({
    name: day,
    Completed: tasks.filter(t => t.status === 'COMPLETED' && new Date(t.createdAt || t.created_at)?.toLocaleDateString('en-US', { weekday: 'short' }) === day).length,
    Pending: tasks.filter(t => t.status !== 'COMPLETED' && new Date(t.createdAt || t.created_at)?.toLocaleDateString('en-US', { weekday: 'short' }) === day).length,
  }));

  const statCards = [
    { title: 'Total Tasks', value: total, icon: <CheckCircle2 size={22} />, color: '#00f2ff', bg: 'rgba(0,242,255,0.1)', sub: 'All tracked tasks' },
    { title: 'In Progress', value: inProgress, icon: <Clock size={22} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', sub: 'Currently active' },
    { title: 'Completed', value: completed, icon: <TrendingUp size={22} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', sub: `${completionRate}% completion rate` },
    { title: 'High Priority', value: highPriority, icon: <AlertCircle size={22} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', sub: 'Needs immediate attention' },
  ];

  const recentColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span style={{ fontWeight: 600, color: '#f0f0f5' }}>{text}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => (
        <Tag color={p === 'HIGH' ? 'volcano' : p === 'MEDIUM' ? 'gold' : 'blue'} style={{ borderRadius: 6 }}>
          <span className={`priority-dot ${p}`} style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', marginRight: 5 }} />
          {p}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Tag color={s === 'COMPLETED' ? 'green' : s === 'IN_PROGRESS' ? 'blue' : 'processing'}>
          {s?.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Due',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (d) => d ? <span style={{ color: '#8a8a9a', fontSize: 13 }}>{new Date(d).toLocaleDateString()}</span> : <span style={{ color: '#55556a' }}>—</span>,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 10 }}>
            {getGreeting()},{' '}
            <span className="gradient-text">{user?.username}</span>
            <Sparkles size={22} color="#00f2ff" />
          </h1>
          <p style={{ color: '#8a8a9a', fontSize: 15 }}>
            Here's your productivity overview for today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            icon={<BrainCircuit size={16} />}
            style={{ borderColor: 'rgba(0,242,255,0.3)', color: '#00f2ff', background: 'rgba(0,242,255,0.05)', borderRadius: 10, height: 40 }}
            onClick={() => navigate('/ai-chat')}
          >
            AI Copilot
          </Button>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ background: 'linear-gradient(90deg, #00f2ff, #7000ff)', border: 'none', borderRadius: 10, height: 40, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,242,255,0.2)' }}
            onClick={() => navigate('/create-task')}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((stat, idx) => (
          <Col xs={24} sm={12} xl={6} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div className="stat-card" style={{ borderLeft: `3px solid ${stat.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-card-label">{stat.title}</div>
                    <div className="stat-card-value" style={{ color: stat.color }}>{stat.value}</div>
                    <div style={{ color: '#55556a', fontSize: 12, marginTop: 4 }}>{stat.sub}</div>
                  </div>
                  <div className="stat-card-icon" style={{ background: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                {/* Mini progress bar */}
                {total > 0 && (
                  <div className="progress-bar-track" style={{ marginTop: 14 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.round((stat.value / total) * 100)}%`,
                        background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`,
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Charts row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Weekly Activity Chart */}
        <Col xs={24} lg={16}>
          <Card className="glass-morphism" title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>Weekly Activity</span>} style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7000ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7000ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#55556a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#55556a" tick={{ fontSize: 12 }} allowDecimals={false} />
                <RTooltip contentStyle={CHART_STYLE} />
                <Area type="monotone" dataKey="Completed" stroke="#00f2ff" strokeWidth={2} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="Pending" stroke="#7000ff" strokeWidth={2} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Completion Ring */}
        <Col xs={24} lg={8}>
          <Card className="glass-morphism" title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>Completion Rate</span>} style={{ height: 360 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <Progress
                  type="circle"
                  percent={completionRate}
                  size={140}
                  strokeColor={{ '0%': '#00f2ff', '100%': '#7000ff' }}
                  trailColor="rgba(255,255,255,0.06)"
                  strokeWidth={8}
                  format={p => <span style={{ color: '#f0f0f5', fontSize: 26, fontWeight: 800 }}>{p}%</span>}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#8a8a9a', fontSize: 13, marginBottom: 4 }}>
                  {completed} of {total} tasks done
                </div>
                {highPriority > 0 && (
                  <div style={{ color: '#ef4444', fontSize: 12, background: 'rgba(239,68,68,0.08)', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.15)' }}>
                    ⚠️ {highPriority} high-priority tasks pending
                  </div>
                )}
              </div>
              <Button
                type="link"
                style={{ color: '#00f2ff', padding: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
                onClick={() => navigate('/analytics')}
              >
                Full Analytics <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Tasks */}
      <Card
        className="glass-morphism"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f0f0f5', fontWeight: 700 }}>Recent Tasks</span>
            <Button
              type="link"
              style={{ color: '#00f2ff', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => navigate('/tasks')}
            >
              View all <ArrowRight size={14} />
            </Button>
          </div>
        }
      >
        <Table
          columns={recentColumns}
          dataSource={tasks.slice(0, 6)}
          pagination={false}
          loading={loading}
          rowKey="id"
          locale={{
            emptyText: (
              <div style={{ padding: 32, textAlign: 'center', color: '#55556a' }}>
                No tasks yet.{' '}
                <Button type="link" style={{ color: '#00f2ff', padding: 0 }} onClick={() => navigate('/create-task')}>
                  Create your first task
                </Button>
              </div>
            )
          }}
        />
      </Card>
    </motion.div>
  );
};

export default Dashboard;
