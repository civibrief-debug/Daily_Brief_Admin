"use client";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RoleBadge from '../../components/RoleBadge';
import SubscriptionPlanModal from '../../components/SubscriptionPlanModal';
import { Plus, Edit2, RefreshCw, CheckCircle, Search, CreditCard, Lock, Zap, Trash2 } from 'lucide-react';

export default function SubscriptionsPage() {
  const { plans, subscribers, renewSubscriber, deleteSubscriber, hasPermission } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [search, setSearch] = useState('');

  const canManage = hasPermission('manage_subscriptions');

  const filteredSubscribers = subscribers.filter(sub =>
    sub.name.toLowerCase().includes(search.toLowerCase()) ||
    sub.email.toLowerCase().includes(search.toLowerCase()) ||
    sub.plan.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Subscription Plans & Premium Users
            <RoleBadge roleId="subscription_manager" />
          </h1>
          <p>
            Responsibilities: Manage subscription plans, premium users and renewals.
          </p>
        </div>

        {canManage && (
          <button className="btn btn-gold" onClick={handleCreatePlan}>
            <Plus size={16} /> Add Subscription Plan
          </button>
        )}
      </div>

      {!canManage && (
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Lock size={20} color="#f59e0b" />
          <div>
            <strong>Read-Only Mode Notice:</strong> You are currently viewing as a role without Subscription Manager permissions. Switch to <strong>Subscription Manager</strong> or <strong>Super Admin</strong> in the top navbar to enable changes.
          </div>
        </div>
      )}

      {/* Subscription Tier Cards Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--brand-gold)" /> Configured Membership Tiers
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {plans.map(p => (
            <div key={p.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-brand)' }}>{p.name}</h3>
                  <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--brand-gold)' }}>
                    {p.status}
                  </span>
                </div>

                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {p.price} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {p.billingCycle}</span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                  Active Subscribers: {(p.activeSubscribers || 0).toLocaleString()}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Tier Features
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {p.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={13} color="#10b981" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {canManage && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleEditPlan(p)} style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Edit2 size={14} /> Edit Plan Details
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Premium Users & Renewals Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Premium User Accounts & Renewal Queue</h2>
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="form-control"
              placeholder="Search user name or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subscriber</th>
                  <th>Current Tier</th>
                  <th>Status</th>
                  <th>Renewal Date</th>
                  <th>Payment Method</th>
                  {canManage && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-subscription">{sub.plan}</span>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: sub.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: sub.status === 'Active' ? '#10b981' : '#f59e0b'
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{sub.renewalDate}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{sub.paymentMethod}</td>
                    {canManage && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-gold"
                            title="Extend / Renew Subscription"
                            onClick={() => renewSubscriber(sub.id)}
                          >
                            <RefreshCw size={13} /> Renew +30 Days
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            title="Delete Subscriber Account"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove subscriber account "${sub.name}"?`)) {
                                deleteSubscriber(sub.id);
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

      <SubscriptionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planToEdit={selectedPlan}
      />
    </div>
  );
}
