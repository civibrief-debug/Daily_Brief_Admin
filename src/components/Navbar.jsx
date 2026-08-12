"use client";

import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { CheckCircle, AlertTriangle, Info, Sun, Moon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const { currentUser, toastMessage, theme, toggleTheme, logout, switchRole } = useAdmin();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getToastStyle = () => {
    if (!toastMessage) return {};
    switch (toastMessage.type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.2)',
          border: '#10b981',
          icon: <CheckCircle size={16} color="#10b981" />
        };
      case 'info':
        return {
          bg: 'rgba(59, 130, 246, 0.2)',
          border: '#60a5fa',
          icon: <Info size={16} color="#60a5fa" />
        };
      default:
        return {
          bg: 'rgba(239, 68, 68, 0.2)',
          border: '#ef4444',
          icon: <AlertTriangle size={16} color="#ef4444" />
        };
    }
  };

  const toastStyle = getToastStyle();

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, zIndex: 50, position: 'sticky', top: 0 }}>
      <div style={{ padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--brand-red)', padding: '0.5rem 0.75rem', borderRadius: '8px', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-brand)', letterSpacing: '1px', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(201, 24, 24, 0.4)' }}>
            DB
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-brand)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
              DAILY BRIEF <span style={{ color: 'var(--brand-gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Services</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Backend & Role Control Center
            </div>
          </div>
        </div>

        {/* Toast Alert Notice */}
        {toastMessage && (
          <div style={{
            background: toastStyle.bg,
            border: `1px solid ${toastStyle.border}`,
            color: 'var(--text-main)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            {toastStyle.icon}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Controls & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Theme Mode Switcher Toggle Button (Icon Only) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              borderRadius: '50%',
              border: '1px solid var(--border-color-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'var(--bg-surface)',
              transition: 'all 0.2s ease'
            }}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <Moon size={18} color="var(--brand-gold)" />
            ) : (
              <Sun size={18} color="#d97706" />
            )}
          </button>

          {/* User Profile & Log Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-red) 0%, var(--brand-gold) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {currentUser.name ? currentUser.name.charAt(0) : 'A'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{currentUser.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              style={{ marginLeft: '0.5rem', padding: '0.4rem 0.6rem' }}
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
