import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Tooltip } from 'antd';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  User,
  LogOut,
  PlusCircle,
  BarChart3,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const { Sider, Header, Content } = Layout;

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { key: '/tasks', icon: <CheckSquare size={18} />, label: 'My Tasks' },
    { key: '/create-task', icon: <Sparkles size={18} />, label: 'AI Generator' },
    { key: '/ai-chat', icon: <MessageSquareText size={18} />, label: 'AI Copilot' },
    { key: '/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    { key: '/profile', icon: <User size={18} />, label: 'Profile' },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <User size={16} />, label: 'My Profile', onClick: () => navigate('/profile') },
    { type: 'divider' },
    { key: 'logout', icon: <LogOut size={16} />, label: 'Logout', danger: true, onClick: logout },
  ];

  const selectedKey =
    location.pathname === '/ai-generator' ? '/create-task' : location.pathname;

  const siderWidth = 240;

  return (
    <Layout style={{ minHeight: '100vh', background: '#07070a' }}>
      {/* Sidebar */}
      <Sider
        width={siderWidth}
        collapsed={collapsed}
        collapsedWidth={0}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          background: 'linear-gradient(180deg, #0d0d14 0%, #0a0a10 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #00f2ff, #7000ff)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,242,255,0.3)',
            flexShrink: 0,
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                style={{ fontSize: '17px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}
              >
                TaskFlow <span style={{ background: 'linear-gradient(90deg,#00f2ff,#7000ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div style={{ padding: '0 10px', overflowY: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ background: 'transparent', border: 'none' }}
            className="custom-menu"
            inlineCollapsed={collapsed}
          />
        </div>

        {/* Bottom Create Task button */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px 12px' }}>
          {!collapsed && (
            <Button
              type="primary"
              icon={<PlusCircle size={16} />}
              block
              style={{
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #00f2ff, #7000ff)',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                boxShadow: '0 4px 16px rgba(0,242,255,0.2)',
              }}
              onClick={() => navigate('/create-task')}
            >
              New AI Task
            </Button>
          )}
        </div>
      </Sider>

      <Layout style={{
        marginLeft: collapsed ? 0 : siderWidth,
        background: 'transparent',
        transition: 'margin-left 0.25s cubic-bezier(0.2,0,0,1)',
      }}>
        {/* Top Header */}
        <Header style={{
          background: 'rgba(7,7,10,0.75)',
          backdropFilter: 'blur(20px)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          height: 60,
        }}>
          {/* Collapse toggle */}
          <Button
            type="text"
            icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#8a8a9a', background: 'rgba(255,255,255,0.04)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tooltip title="Notifications">
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<Bell size={18} />}
                  style={{ color: '#8a8a9a', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              </Badge>
            </Tooltip>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s' }}>
                <div style={{ textAlign: 'right', lineHeight: '1.25' }}>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>{user?.username}</div>
                  <div style={{ color: '#8a8a9a', fontSize: '11px' }}>AI User</div>
                </div>
                <div className="avatar-ring">
                  <Avatar
                    size={30}
                    style={{ background: 'linear-gradient(135deg, #00f2ff, #7000ff)', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ padding: '28px', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
