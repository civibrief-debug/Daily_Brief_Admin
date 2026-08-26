"use client";

export const runtime = 'edge';

import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RoleBadge from '../../components/RoleBadge';
import AdminUserModal from '../../components/AdminUserModal';
import { Plus, ShieldCheck, Users, Lock, Edit2, Trash2, BookOpen, Shield, User } from 'lucide-react';

export default function AdminStaffPage() {
  const { adminUsers, deleteAdminUser, roles, hasPermission } = useAdmin();
  const [activeTab, setActiveTab] = useState('Administrative Personnel');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const canManage = hasPermission('manage_admins');

  if (!canManage) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="glass-panel" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '50%', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Only <strong>Super Admin</strong> accounts have authorization to view or assign system administrative personnel.
          </p>
        </div>
      </div>
    );
  }

  // Filter out Super Admin accounts from assigned personnel list table (matching image)
  const assignedPersonnel = adminUsers.filter(adm => adm.roleId !== 'super_admin');

  const handleEditAccess = (adminUser) => {
    setSelectedAdmin(adminUser);
    setIsModalOpen(true);
  };

  const handleAssignNew = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const getPermissionLabel = (permId) => {
    switch (permId) {
      case 'manage_articles': return 'Manage Articles';
      case 'manage_plans': return 'Manage Subscriptions';
      case 'reset_passwords': return 'Reset Passwords';
      case 'verify_users': return 'Verify Users';
      case 'manage_admins': return 'Manage Admins';
      case 'view_audit': return 'View Audit';
      default: return permId;
    }
  };

  return (
    <div>
      {/* Top Header Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem', paddingBottom: '0.5rem' }}>
        <button
          className={`tab-btn ${activeTab === 'User Accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('User Accounts')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', color: activeTab === 'User Accounts' ? 'var(--text-main)' : 'var(--text-muted)' }}
        >
          <User size={16} /> User Accounts
        </button>
        <button
          className={`tab-btn ${activeTab === 'Administrative Personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('Administrative Personnel')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid var(--brand-red)', borderRadius: 0, paddingBottom: '0.5rem', fontWeight: 700 }}
        >
          <ShieldCheck size={16} color="var(--brand-red)" /> Administrative Personnel
        </button>
      </div>

      {/* Main Administrative Control Section */}
      <div>
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <div className="page-title-group">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Active Administrative Credentials & Roles
            </h1>
            <p>
              Configure role-based access control (RBAC), specific action permissions, and assigned news categories.
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleAssignNew} style={{ boxShadow: '0 4px 14px rgba(201, 24, 24, 0.4)' }}>
            <Shield size={16} /> Assign New Admin
          </button>
        </div>

        {/* Administrative Personnel Table */}
        <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '240px' }}>ADMIN PERSONNEL</th>
                  <th style={{ width: '200px' }}>ASSIGNED ROLE</th>
                  <th style={{ width: '220px' }}>ASSIGNED SCOPE</th>
                  <th>ACTION PERMISSIONS</th>
                  <th style={{ textAlign: 'right', width: '150px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {assignedPersonnel.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No assigned administrative personnel yet. Click &quot;Assign New Admin&quot; to provision staff accounts.
                    </td>
                  </tr>
                ) : (
                  assignedPersonnel.map(adm => (
                    <tr key={adm.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Shield size={14} color="var(--brand-gold)" /> {adm.name}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {adm.email}
                        </div>
                      </td>

                      <td>
                        <RoleBadge roleId={adm.roleId} />
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {(adm.categoryScope || ['All Categories']).map((cat, idx) => (
                            <span key={idx} className="btn btn-sm btn-secondary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', pointerEvents: 'none' }}>
                              <BookOpen size={11} /> {cat}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {(adm.actionPermissions || ['manage_articles']).map((permId, idx) => (
                            <span key={idx} className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.7rem', textTransform: 'none' }}>
                              {getPermissionLabel(permId)}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditAccess(adm)}
                            title="Edit Access Permissions"
                          >
                            <Edit2 size={13} /> Edit Access
                          </button>
                          
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteAdminUser(adm.id)}
                            title="Revoke Admin Account"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Matrix Reference */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--brand-gold)" /> System Role Capabilities Matrix
        </h2>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>Role Preset</th>
                  <th>Responsibilities & Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(r => (
                  <tr key={r.id}>
                    <td>
                      <RoleBadge roleId={r.id} />
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {r.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdminUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adminToEdit={selectedAdmin}
      />
    </div>
  );
}
