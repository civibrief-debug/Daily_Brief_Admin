"use client";

import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RoleBadge from '../../components/RoleBadge';
import { Settings, Save, AlertTriangle, Shield, Lock } from 'lucide-react';

export default function PlatformSettingsPage() {
  const { settings, updatePlatformSettings, hasPermission } = useAdmin();
  const [formData, setFormData] = useState(settings);

  const canManage = hasPermission('platform_settings');

  if (!canManage) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="glass-panel" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '50%', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Platform settings and global security overrides are reserved exclusively for the <strong>Super Admin</strong> role.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePlatformSettings(formData);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Platform & System Settings
            <RoleBadge roleId="super_admin" />
          </h1>
          <p>
            Responsibilities: Manage admins, users, subscriptions, platform settings.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Maintenance Mode Status Banner if enabled */}
      {formData.maintenanceMode && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertTriangle size={24} color="#ef4444" />
          <div>
            <h3 style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 700 }}>SYSTEM MAINTENANCE MODE IS ACTIVE</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Public readers are currently seeing a maintenance notice. Only authenticated admins have access.
            </p>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* Card 1: General Site Configurations */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} color="var(--brand-gold)" /> General Platform Info
          </h2>

          <div className="form-group">
            <label>Website Brand Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Official Support Desk Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.supportDeskEmail}
              onChange={(e) => setFormData({ ...formData, supportDeskEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Global Ticker / Breaking News Alert Banner</label>
            <textarea
              className="form-control"
              style={{ minHeight: '80px' }}
              value={formData.breakingNewsBanner}
              onChange={(e) => setFormData({ ...formData, breakingNewsBanner: e.target.value })}
            />
          </div>
        </div>

        {/* Card 2: Security & Emergency Controls */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="var(--brand-red)" /> Security & Maintenance Overrides
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Emergency Maintenance Mode</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Temporarily pause public website access for updates.</div>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Public Reader Account Signups</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow new readers to register accounts.</div>
              </div>
              <input
                type="checkbox"
                checked={formData.enablePublicSignups}
                onChange={(e) => setFormData({ ...formData, enablePublicSignups: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Mandatory Email Verification</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Require email confirmation before access.</div>
              </div>
              <input
                type="checkbox"
                checked={formData.requireEmailVerification}
                onChange={(e) => setFormData({ ...formData, requireEmailVerification: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Max Daily Password Resets Allowed Per Account</label>
              <input
                type="number"
                className="form-control"
                value={formData.maxDailyPasswordResetsPerUser}
                onChange={(e) => setFormData({ ...formData, maxDailyPasswordResetsPerUser: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
