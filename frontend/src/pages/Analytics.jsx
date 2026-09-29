import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Select } from 'antd';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Clock, CheckCircle2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const { Option } = Select;

const COLORS = { HIGH: '#ef4444', MEDIUM: '#eab308', LOW: '#3b82f6' };
const STATUS_COLORS = { COMPLETED: '#22c55e', IN_PROGRESS: '#3b82f6', PENDING: '#eab308' };

const CHART_STYLE = {
  background: '#13131a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  color: '#f0f0f5',
};

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data)).finally(() => setLoading(false));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  // Priority distribution
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'HIGH').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'MEDIUM').length, color: '#eab308' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'LOW').length, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  // Status distribution
  const statusData = [
    { name: 'Completed', value: completed, color: '#22c55e' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Pending', value: pending, color: '#eab308' },
  ].filter(d => d.value > 0);

  // Category breakdown bar chart
  const categories = ['WORK', 'PERSONAL', 'URGENT', 'CODING', 'HEALTH'];
  const categoryData = categories.map(cat => ({
    name: cat,
    Total: tasks.filter(t => t.category === cat).length,
    Done: tasks.filter(t => t.category === cat && t.status === 'COMPLETED').length,
  })).filter(d => d.Total > 0);

  const insights = [
    { label: 'Completion Rate', value: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%', color: '#22c55e', icon: <CheckCircle2 size={20} />, sub: `${completed} of ${total} tasks` },
    { label: 'High Priority', value: tasks.filter(t => t.priority === 'HIGH').length, color: '#ef4444', icon: <Flame size={20} />, sub: 'Need urgent attention' },
    { label: 'In Progress', value: inProgress, color: '#3b82f6', icon: <Clock size={20} />, sub: 'Currently active' },
    { label: 'This Month', value: tasks.filter(t => new Date(t.createdAt || t.created_at)?.getMonth() === new Date().getMonth()).length, color: '#00f2ff', icon: <TrendingUp size={20} />, sub: 'Tasks created' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 6 }}>
          📊 <span className="gradient-text">Analytics</span>
        </h1>
        <p style={{ color: '#8a8a9a' }}>Deep insights into your productivity and task patterns.</p>
      </div>

      {/* Insight cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {insights.map((ins, i) => (
          <Col xs={24} sm={12} xl={6} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="stat-card" style={{ borderLeft: `3px solid ${ins.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-card-label">{ins.label}</div>
                    <div className="stat-card-value" style={{ color: ins.color }}>{ins.value}</div>
                    <div style={{ color: '#55556a', fontSize: 12, marginTop: 4 }}>{ins.sub}</div>
                  </div>
                  <div className="stat-card-icon" style={{ background: `${ins.color}18`, color: ins.color }}>
                    {ins.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Priority Pie */}
        <Col xs={24} lg={8}>
          <Card className="glass-morphism" title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>Priority Breakdown</span>} style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={priorityData.length ? priorityData : [{ name: 'No data', value: 1, color: '#27272a' }]}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value">
                  {(priorityData.length ? priorityData : [{ color: '#27272a' }]).map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE} />
                <Legend iconType="circle" wrapperStyle={{ color: '#8a8a9a', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Status Pie */}
        <Col xs={24} lg={8}>
          <Card className="glass-morphism" title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>Status Overview</span>} style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData.length ? statusData : [{ name: 'No data', value: 1, color: '#27272a' }]}
                  cx="50%" cy="50%" outerRadius={90}
                  paddingAngle={3} dataKey="value">
                  {(statusData.length ? statusData : [{ color: '#27272a' }]).map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE} />
                <Legend iconType="circle" wrapperStyle={{ color: '#8a8a9a', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Bar */}
        <Col xs={24} lg={8}>
          <Card className="glass-morphism" title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>Category Breakdown</span>} style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData.length ? categoryData : [{ name: 'No data', Total: 0, Done: 0 }]} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#55556a" tick={{ fontSize: 10 }} />
                <YAxis stroke="#55556a" tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="Total" fill="rgba(0,242,255,0.25)" radius={[4,4,0,0]} />
                <Bar dataKey="Done" fill="#00f2ff" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Task list table */}
      <Card className="glass-morphism" title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>All Tasks Overview</span>}>
        <Table
          loading={loading}
          dataSource={tasks}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          columns={[
            { title: 'Title', dataIndex: 'title', key: 'title', render: t => <span style={{ fontWeight: 600, color: '#f0f0f5' }}>{t}</span> },
            { title: 'Priority', dataIndex: 'priority', key: 'priority', render: p => <Tag color={p === 'HIGH' ? 'volcano' : p === 'MEDIUM' ? 'gold' : 'blue'}>{p}</Tag>, filters: [{ text: 'High', value: 'HIGH' }, { text: 'Medium', value: 'MEDIUM' }, { text: 'Low', value: 'LOW' }], onFilter: (v, r) => r.priority === v },
            { title: 'Status', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 'COMPLETED' ? 'green' : s === 'IN_PROGRESS' ? 'blue' : 'processing'}>{s?.replace('_', ' ')}</Tag>, filters: [{ text: 'Completed', value: 'COMPLETED' }, { text: 'In Progress', value: 'IN_PROGRESS' }, { text: 'Pending', value: 'PENDING' }], onFilter: (v, r) => r.status === v },
            { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: d => d ? <span style={{ color: '#8a8a9a' }}>{new Date(d).toLocaleDateString()}</span> : '—' },
            { title: 'Est. Time', dataIndex: 'estimatedTime', key: 'estimatedTime', render: t => t || '—' },
          ]}
        />
      </Card>
    </motion.div>
  );
};

export default Analytics;
