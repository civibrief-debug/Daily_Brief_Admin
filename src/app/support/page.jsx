"use client";

export const runtime = 'edge';

import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RoleBadge from '../../components/RoleBadge';
import PasswordResetModal from '../../components/PasswordResetModal';
import SupportTicketModal from '../../components/SupportTicketModal';
import { KeyRound, ShieldCheck, CheckCircle, LifeBuoy, AlertCircle, Lock, Trash2 } from 'lucide-react';

export default function SupportPage() {
  const { subscribers, verifyUser, supportTickets, deleteSupportTicket, hasPermission } = useAdmin();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const canManage = hasPermission('reset_passwords');

  const handleOpenReset = (email = '') => {
    setSelectedEmail(email);
    setIsResetModalOpen(true);
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Support & User Verification Desk
            <RoleBadge roleId="support_admin" />
          </h1>
          <p>
            Responsibilities: Reset passwords, verify users, handle account issues.
          </p>
        </div>

        {canManage && (
          <button className="btn btn-gold" onClick={() => handleOpenReset('')}>
            <KeyRound size={16} /> Reset User Password
          </button>
        )}
      </div>

      {!canManage && (
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Lock size={20} color="#f59e0b" />
          <div>
            <strong>Read-Only Mode Notice:</strong> You are currently viewing as a role without Support Admin permissions. Switch to <strong>Support Admin</strong> or <strong>Super Admin</strong> in the top navbar to perform user password resets & ticket resolution.
          </div>
        </div>
      )}

      {/* Section 1: Open Account Issues & Tickets */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LifeBuoy size={18} color="#10b981" /> Active Account Issues & Support Tickets
        </h2>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subscriber Name</th>
                  <th>Email</th>
                  <th>Issue Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  {canManage && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {supportTickets.map(tkt => (
                  <tr key={tkt.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--brand-gold)' }}>
                      #{tkt.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{tkt.userName}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{tkt.userEmail}</td>
                    <td style={{ fontWeight: 500 }}>{tkt.issueType}</td>
                    <td>
                      <span className="badge" style={{
                        background: tkt.priority === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: tkt.priority === 'High' ? '#ef4444' : '#f59e0b'
                      }}>
                        {tkt.priority}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: tkt.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: tkt.status === 'Resolved' ? '#10b981' : '#60a5fa'
                      }}>
                        {tkt.status}
                      </span>
                    </td>
                    {canManage && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleOpenReset(tkt.userEmail)}
                            title="Instant Password Reset"
                          >
                            <KeyRound size={13} /> Reset Pass
                          </button>
                          {tkt.status !== 'Resolved' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenTicket(tkt)}
                            >
                              Resolve Ticket
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-danger"
                            title="Delete Support Ticket"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ticket #${tkt.id}?`)) {
                                deleteSupportTicket(tkt.id);
                              }
                            }}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: User Verification Queue */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="#8b5cf6" /> User Verification & KYC Queue
        </h2>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Subscription Tier</th>
                  <th>Verification Status</th>
                  {canManage && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600 }}>{sub.name}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{sub.email}</td>
                    <td><span className="badge badge-subscription">{sub.plan}</span></td>
                    <td>
                      {sub.verified ? (
                        <span className="badge badge-published">
                          <CheckCircle size={12} /> Verified Account
                        </span>
                      ) : (
                        <span className="badge badge-draft">
                          <AlertCircle size={12} /> Unverified
                        </span>
                      )}
                    </td>
                    {canManage && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleOpenReset(sub.email)}
                          >
                            <KeyRound size={13} /> Password Reset
                          </button>
                          {!sub.verified && (
                            <button
                              className="btn btn-sm btn-gold"
                              onClick={() => verifyUser(sub.id)}
                            >
                              <ShieldCheck size={13} /> Mark Verified
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        targetUserEmail={selectedEmail}
      />

      <SupportTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
}
