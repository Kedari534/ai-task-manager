import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Lock, User, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.username, values.email, values.password);
      message.success('Account created! Welcome to TaskFlow AI.');
      navigate('/');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#07070a', position: 'relative', overflow: 'hidden' }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(112,0,255,0.12) 0%, transparent 70%)', top: -150, right: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,242,255,0.08) 0%, transparent 70%)', bottom: -100, left: -80 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 460, padding: '20px', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #00f2ff22, #7000ff22)',
            border: '1px solid rgba(0,242,255,0.2)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(0,242,255,0.15)',
          }}>
            <Sparkles size={28} color="#00f2ff" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Create Account</h2>
          <p style={{ color: '#8a8a9a' }}>Join TaskFlow AI and supercharge your productivity</p>
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
              rules={[{ required: true, message: 'Username required' }, { min: 3, message: 'At least 3 characters' }]}
            >
              <Input
                prefix={<User size={16} color="#55556a" style={{ marginRight: 6 }} />}
                placeholder="Username"
                style={{ height: 48 }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              style={{ marginBottom: 16 }}
              rules={[{ required: true, message: 'Email required' }, { type: 'email', message: 'Valid email required' }]}
            >
              <Input
                prefix={<Mail size={16} color="#55556a" style={{ marginRight: 6 }} />}
                placeholder="Email address"
                style={{ height: 48 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              style={{ marginBottom: 24 }}
              rules={[{ required: true, message: 'Password required' }, { min: 6, message: 'At least 6 characters' }]}
            >
              <Input.Password
                prefix={<Lock size={16} color="#55556a" style={{ marginRight: 6 }} />}
                placeholder="Password (min 6 characters)"
                style={{ height: 48 }}
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
              Create Account
            </Button>
          </Form>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', color: '#8a8a9a', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00f2ff', fontWeight: 700 }}>Sign in here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
