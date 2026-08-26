"use client";

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../context/AdminContext';
import { User, Lock, Eye, EyeOff, HelpCircle, Activity } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useAdmin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Always force Dark Mode on Login screen
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username) return;

    const res = login(username, password);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMessage(res.error || "Invalid Credentials");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'grid',
      gridTemplateColumns: '460px 1fr',
      background: '#04070d',
      overflow: 'hidden'
    }}>
      {/* Left Column: Login Controls */}
      <div style={{
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#080c16',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 20
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            background: 'var(--brand-red)',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 800,
            fontFamily: 'var(--font-brand)',
            fontSize: '1.3rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(201, 24, 24, 0.4)',
            marginBottom: '0.875rem'
          }}>
            DB
          </div>
          <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.5px', color: '#fff' }}>
            DAILY BRIEF
          </h1>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--brand-gold)', fontWeight: 700, letterSpacing: '1.5px' }}>
            ADMIN COMMAND CENTER
          </span>
        </div>

        {/* Login Form Container */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '2.25rem 1.75rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.375rem' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Please enter your credentials to access the command center.
            </p>
          </div>

          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              textAlign: 'center',
              marginBottom: '1.25rem'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Input 1: COMMAND ID */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#cbd5e1' }}>
                COMMAND ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    paddingLeft: '2.75rem',
                    height: '46px',
                    fontSize: '0.925rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff'
                  }}
                  required
                />
              </div>
            </div>

            {/* Input 2: TACTICAL PASS-KEY */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#cbd5e1' }}>
                TACTICAL PASS-KEY
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    paddingLeft: '2.75rem',
                    paddingRight: '2.75rem',
                    height: '46px',
                    fontSize: '0.925rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.825rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                />
                <span>Remember me</span>
              </label>

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Contact Super Admin to reset passkey."); }}
                style={{ fontWeight: 600, color: '#94a3b8', textDecoration: 'none' }}
              >
                Forgot Password?
              </a>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '48px',
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                cursor: 'pointer'
              }}
            >
              SIGN IN
            </button>
          </form>

          {/* Bottom Security Footer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.725rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Activity size={13} /> DIAGNOSTICS</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><HelpCircle size={13} /> SUPPORT HUB</span>
          </div>

        </div>

      </div>

      {/* Right Column: High-Res News Master Control Room Hero Visual */}
      <div style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        backgroundImage: `url('/master-control-room.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '3.5rem 4rem'
      }}>
        {/* Ambient Dark Gradient Overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 10, 17, 0.2) 0%, rgba(7, 10, 17, 0.85) 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 35%, rgba(7, 10, 17, 0.6) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Hero Title & Subtitle */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '1px',
            color: '#ffffff',
            textTransform: 'uppercase',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            marginBottom: '0.25rem'
          }}>
            DAILY BRIEF COMMAND CENTER
          </h2>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '2.5px',
            color: '#94a3b8',
            textTransform: 'uppercase'
          }}>
            ARCHITECTURE OF JOURNALISTIC PRECISION
          </div>
        </div>

      </div>
    </div>
  );
}
