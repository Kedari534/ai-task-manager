import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Welcome back to TaskFlow AI!');
      navigate('/');
    } catch (error) {
      message.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    '🤖 AI-powered task generation with Google Gemini',
    '🔗 Blockchain-style immutable audit ledger',
    '📊 Real-time analytics & productivity insights',
    '🎯 Smart Kanban boards with drag & drop',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#07070a', position: 'relative', overflow: 'hidden' }}>
      {/* Animated orb backgrounds */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(112,0,255,0.15) 0%, transparent 70%)', top: -200, left: -200, animation: 'floatOrb 20s linear infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,242,255,0.1) 0%, transparent 70%)', bottom: -100, right: -100, animation: 'floatOrb 25s linear infinite reverse' }} />
      </div>

      {/* Left panel */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0d0d14 0%, #09090f 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: '60px 50px',
          position: 'relative', zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 400, textAlign: 'center' }}
        >
          {/* Logo orb */}
          <motion.div
            animate={{ boxShadow: ['0 0 30px rgba(0,242,255,0.2)', '0 0 60px rgba(112,0,255,0.3)', '0 0 30px rgba(0,242,255,0.2)'] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              width: 100, height: 100,
              background: 'linear-gradient(135deg, rgba(0,242,255,0.15), rgba(112,0,255,0.15))',
              borderRadius: '50%',
              border: '1px solid rgba(0,242,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <Sparkles size={44} color="#00f2ff" strokeWidth={1.5} />
          </motion.div>

          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>
            TaskFlow <span className="gradient-text">AI</span>
          </h1>
          <p style={{ color: '#8a8a9a', marginBottom: 40, fontSize: 15, lineHeight: 1.6 }}>
            The future of productivity. Manage, prioritize, and complete tasks with the power of artificial intelligence.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  color: '#c0c0d0',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '40px 20px', position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome back</h2>
            <p style={{ color: '#8a8a9a', fontSize: 15 }}>Sign in to your dashboard to continue</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '32px 28px',
            backdropFilter: 'blur(20px)',
          }}>
            <Form layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="username"
                style={{ marginBottom: 16 }}
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input
                  prefix={<User size={16} color="#55556a" style={{ marginRight: 6 }} />}
                  placeholder="Username"
                  style={{ height: 48, fontSize: 14 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                style={{ marginBottom: 24 }}
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<Lock size={16} color="#55556a" style={{ marginRight: 6 }} />}
                  placeholder="Password"
                  style={{ height: 48, fontSize: 14 }}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                icon={<ArrowRight size={16} />}
                style={{
                  height: 50,
                  background: 'linear-gradient(90deg, #00f2ff, #7000ff)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 12,
                  boxShadow: '0 4px 20px rgba(0,242,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                Sign In
              </Button>
            </Form>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', color: '#8a8a9a', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00f2ff', fontWeight: 700 }}>Register here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
