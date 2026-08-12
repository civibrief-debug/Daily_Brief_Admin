"use client";

import React from 'react';

export default function StatsCard({ title, value, change, icon: Icon, accentColor = "var(--brand-red)" }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '70px', height: '70px', borderRadius: '50%', background: accentColor, opacity: 0.1, filter: 'blur(15px)' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        {Icon && (
          <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: accentColor }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
        {value}
      </div>

      {change && (
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: change.startsWith('+') ? '#10b981' : 'var(--text-muted)' }}>
          {change} vs last 30 days
        </div>
      )}
    </div>
  );
}
