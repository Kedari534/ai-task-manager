import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Divider, Tag, message, Avatar, Progress } from 'antd';
import { User, Mail, Shield, LogOut, CheckCircle2, Clock, Flame, BarChart2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data)).finally(() => setLoading(false));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const high = tasks.filter(t => t.priority === 'HIGH').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statItems = [
    { label: 'Total Tasks', value: total, icon: <CheckCircle2 size={20} />, color: '#00f2ff' },
    { label: 'Completed', value: completed, icon: <Star size={20} />, color: '#22c55e' },
    { label: 'In Progress', value: inProgress, icon: <Clock size={20} />, color: '#3b82f6' },
    { label: 'High Priority', value: high, icon: <Flame size={20} />, color: '#ef4444' },
  ];

  const achievements = [
    { title: 'Task Creator', desc: 'Created your first task', icon: '🚀', earned: total >= 1 },
    { title: 'Productive', desc: 'Completed 5 tasks', icon: '⭐', earned: completed >= 5 },
    { title: 'High Achiever', desc: 'Reached 80% completion rate', icon: '🏆', earned: completionRate >= 80 },
    { title: 'AI Power User', desc: 'Used AI to generate tasks', icon: '🤖', earned: total >= 3 },
    { title: 'Focused', desc: 'Completed a high-priority task', icon: '🎯', earned: completed >= 1 && high >= 1 },
    { title: 'Consistent', desc: 'Have 10+ tasks', icon: '🔥', earned: total >= 10 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 6 }}>
          👤 <span className="gradient-text">My Profile</span>
        </h1>
        <p style={{ color: '#8a8a9a' }}>Your account details and productivity achievements.</p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card className="glass-morphism" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
              {/* Avatar with ring */}
              <div className="avatar-ring" style={{ display: 'inline-block', marginBottom: 16 }}>
                <Avatar
                  size={84}
                  style={{ background: 'linear-gradient(135deg, #00f2ff, #7000ff)', fontSize: 32, fontWeight: 800, lineHeight: '84px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>{user?.username}</h2>
              <div style={{ color: '#8a8a9a', fontSize: 13, marginBottom: 16 }}>
                <Tag color="purple" style={{ borderRadius: 8 }}>AI Power User</Tag>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', margin: '0 8px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <User size={16} color="#8a8a9a" />
                  <span style={{ color: '#c0c0d0', fontSize: 14, fontWeight: 500 }}>{user?.username}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Shield size={16} color="#22c55e" />
                  <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 600 }}>ROLE_USER</span>
                </div>
              </div>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

              {/* Completion ring */}
              <Progress
                type="circle"
                percent={completionRate}
                size={100}
                strokeColor={{ '0%': '#00f2ff', '100%': '#7000ff' }}
                trailColor="rgba(255,255,255,0.06)"
                strokeWidth={8}
                format={p => <span style={{ color: '#f0f0f5', fontWeight: 800, fontSize: 20 }}>{p}%</span>}
              />
              <div style={{ color: '#8a8a9a', fontSize: 12, marginTop: 8 }}>Overall Completion Rate</div>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

              <Button
                danger
                icon={<LogOut size={16} />}
                block
                style={{ borderRadius: 10, height: 42, fontWeight: 700, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          {/* Stats */}
          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            {statItems.map((s, i) => (
              <Col xs={12} sm={6} key={i}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                  <div className="stat-card" style={{ borderLeft: `3px solid ${s.color}`, textAlign: 'center', padding: '18px 12px' }}>
                    <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ color: '#8a8a9a', fontSize: 12, marginTop: 6 }}>{s.label}</div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Achievements */}
          <Card
            className="glass-morphism"
            title={<span style={{ color: '#f0f0f5', fontWeight: 700 }}>🏅 Achievements</span>}
          >
            <Row gutter={[10, 10]}>
              {achievements.map((ach, i) => (
                <Col xs={24} sm={12} key={i}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: ach.earned ? 'rgba(0,242,255,0.05)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${ach.earned ? 'rgba(0,242,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: 10,
                      opacity: ach.earned ? 1 : 0.45,
                      filter: ach.earned ? 'none' : 'grayscale(1)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ fontSize: 28, lineHeight: 1 }}>{ach.icon}</div>
                    <div>
                      <div style={{ color: ach.earned ? '#f0f0f5' : '#8a8a9a', fontWeight: 700, fontSize: 13 }}>{ach.title}</div>
                      <div style={{ color: '#55556a', fontSize: 11 }}>{ach.desc}</div>
                    </div>
                    {ach.earned && (
                      <CheckCircle2 size={16} color="#22c55e" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                    )}
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Profile;
