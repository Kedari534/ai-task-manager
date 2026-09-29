import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, message, Card, Tag } from 'antd';
import { Send, BrainCircuit, Plus, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CMD_PREFIX = '[CMD_CREATE_TASK]:';

const parseMarkdown = (text) => {
  // Very basic markdown → HTML-like display
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('# ')) return <h3 key={i} style={{ color: '#f0f0f5', fontWeight: 800, marginBottom: 4, marginTop: 8 }}>{line.slice(2)}</h3>;
      if (line.startsWith('## ')) return <h4 key={i} style={{ color: '#c0c0d0', fontWeight: 700, marginBottom: 4, marginTop: 6 }}>{line.slice(3)}</h4>;
      if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} style={{ paddingLeft: 12, marginBottom: 2, color: '#c0c0d0' }}>• {line.slice(2)}</div>;
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
      if (/\*\*(.+?)\*\*/.test(line)) {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return <p key={i} style={{ marginBottom: 4, color: '#c0c0d0' }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#f0f0f5' }}>{p}</strong> : p)}</p>;
      }
      return <p key={i} style={{ marginBottom: 4, color: '#c0c0d0', lineHeight: 1.6 }}>{line}</p>;
    });
};

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "👋 Hi! I'm **TaskFlow AI Copilot**, powered by Google Gemini.\n\nI can help you:\n- 📋 Plan and organize your tasks\n- ✅ Break down complex projects\n- 💡 Suggest priorities and timelines\n- 🚀 Create tasks instantly with one click\n\nWhat would you like to work on today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');

    const history = messages
      .filter(m => m.content && !m.isTyping)
      .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessages(prev => [...prev, { role: 'ai', isTyping: true }]);

    try {
      const res = await api.post('/ai/chat', { message: userMessage, history });
      const aiResponse = res.data.response || '';

      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { role: 'ai', content: aiResponse }];
      });
    } catch (err) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { role: 'ai', content: '❌ Sorry, I encountered an error. Please try again.' }];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const extractTaskCmd = (content) => {
    const line = content?.split('\n').find(l => l.startsWith(CMD_PREFIX));
    if (!line) return null;
    try { return JSON.parse(line.replace(CMD_PREFIX, '')); } catch { return null; }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'MEDIUM',
        status: 'PENDING',
        estimatedTime: taskData.estimatedTime || '1 hour',
        dueDate: taskData.dueDate || null,
      });
      message.success(`✅ Task "${taskData.title}" created!`);
      navigate('/tasks');
    } catch {
      message.error('Failed to create task');
    }
  };

  const renderMessage = (msg, idx) => {
    if (msg.isTyping) {
      return (
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #00f2ff, #7000ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BrainCircuit size={18} color="white" />
          </div>
          <div className="chat-bubble ai" style={{ borderRadius: '4px 18px 18px 18px' }}>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      );
    }

    const taskCmd = msg.role === 'ai' ? extractTaskCmd(msg.content) : null;
    const displayContent = taskCmd ? msg.content.replace(`${CMD_PREFIX}${JSON.stringify(taskCmd)}`, '').trim() : msg.content;

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
      >
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: msg.role === 'ai' ? 'linear-gradient(135deg, #00f2ff, #7000ff)' : 'rgba(255,255,255,0.1)',
          border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.15)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {msg.role === 'ai' ? <BrainCircuit size={18} color="white" /> : <User size={16} color="#8a8a9a" />}
        </div>

        <div style={{ maxWidth: '75%' }}>
          <div className={`chat-bubble ${msg.role}`} style={{ borderRadius: msg.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px' }}>
            {msg.role === 'ai' ? parseMarkdown(displayContent) : <p style={{ margin: 0, color: 'white' }}>{displayContent}</p>}
          </div>

          {/* One-click create task button */}
          {taskCmd && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                marginTop: 10,
                padding: '12px 16px',
                background: 'rgba(0,242,255,0.06)',
                border: '1px solid rgba(0,242,255,0.2)',
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 8 }}>💡 AI suggests creating this task:</div>
              <div style={{ color: '#f0f0f5', fontWeight: 700, marginBottom: 4 }}>{taskCmd.title}</div>
              {taskCmd.priority && <Tag color={taskCmd.priority === 'HIGH' ? 'volcano' : taskCmd.priority === 'MEDIUM' ? 'gold' : 'blue'} style={{ marginBottom: 8 }}>{taskCmd.priority}</Tag>}
              <Button
                type="primary"
                icon={<Plus size={14} />}
                size="small"
                style={{ background: 'linear-gradient(90deg, #00f2ff, #7000ff)', border: 'none', borderRadius: 8, fontWeight: 600 }}
                onClick={() => handleCreateTask(taskCmd)}
              >
                Add to My Tasks
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f2ff, #7000ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0,242,255,0.3)',
        }}>
          <BrainCircuit size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            AI <span className="gradient-text">Copilot</span>
          </h1>
          <p style={{ color: '#8a8a9a', fontSize: 13, margin: 0 }}>Powered by Gemini Flash via Google</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 600 }}>Online</span>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        minHeight: 500,
      }}>
        {/* Messages */}
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, idx) => renderMessage(msg, idx))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              'Break down my project into tasks',
              'What should I prioritize today?',
              'Create a task: Fix authentication bug',
              'How do I improve my productivity?',
            ].map((prompt, i) => (
              <Button
                key={i}
                size="small"
                style={{ borderColor: 'rgba(0,242,255,0.2)', color: '#8a8a9a', background: 'rgba(0,242,255,0.04)', borderRadius: 20, fontSize: 12 }}
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to plan tasks, suggest priorities, or type 'Create a task: ...' to add one instantly..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f5', borderRadius: 12, flex: 1, resize: 'none', fontSize: 14 }}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<Send size={16} />}
            onClick={sendMessage}
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #00f2ff, #7000ff)',
              border: 'none',
              borderRadius: 12,
              height: 44,
              width: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(0,242,255,0.2)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AIChat;
