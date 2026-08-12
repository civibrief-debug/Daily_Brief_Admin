"use client";

import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import StatsCard from '../components/StatsCard';
import RoleBadge from '../components/RoleBadge';
import ArticleEditorModal from '../components/ArticleEditorModal';
import PasswordResetModal from '../components/PasswordResetModal';
import SubscriptionPlanModal from '../components/SubscriptionPlanModal';
import { FileText, CreditCard, LifeBuoy, Users, Plus, KeyRound, ShieldCheck, ArrowRight, Inbox, CheckCircle, Shield, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser, activeRole, activeRoleId, articles, plans, subscribers, supportTickets, adminUsers, settings, hasPermission } = useAdmin();

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setIsArticleModalOpen(true);
  };

  const handleEditArticle = (art) => {
    setSelectedArticle(art);
    setIsArticleModalOpen(true);
  };

  const isSuperAdmin = currentUser?.roleId === 'super_admin';
  const isEditor = currentUser?.roleId === 'editor';
  const isContentAdmin = currentUser?.roleId === 'content_admin';
  const isSubManager = currentUser?.roleId === 'subscription_manager';
  const isSupportAdmin = currentUser?.roleId === 'support_admin';

  // Helper matching assigned editor articles
  const isAssignedToEditor = (art) => {
    if (!art || !currentUser) return false;
    if (art.assignedEditorId && art.assignedEditorId === currentUser.id) return true;
    if (art.assignedEditorName) {
      const assignedName = art.assignedEditorName.toLowerCase().trim();
      const currentName = (currentUser.name || '').toLowerCase().trim();
      const currentEmailUser = (currentUser.email || '').split('@')[0].toLowerCase().trim();
      if (assignedName === currentName || assignedName === currentEmailUser || currentName.includes(assignedName) || assignedName.includes(currentName)) {
        return true;
      }
    }
    return false;
  };

  const assignedToMeArticles = articles.filter(isAssignedToEditor);
  const editorUnderReviewCount = articles.filter(a => a.status === 'Under Editorial Review').length;
  const editorChangesRequestedCount = articles.filter(a => a.status === 'Changes Requested').length;
  const editorApprovedCount = articles.filter(a => a.status === 'Approved by Editor').length;

  const publishedCount = articles.filter(a => a.status === 'Published').length;
  const draftCount = articles.filter(a => a.status === 'Draft').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'Open' || t.status === 'Pending').length;
  const activeSubscribersCount = subscribers.filter(s => s.status === 'Active').length;
  const verifiedUsersCount = subscribers.filter(s => s.verified).length;

  return (
    <div>
      {/* Header & Role Context Banner */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Overview Dashboard
            <RoleBadge roleId={currentUser?.roleId || 'super_admin'} />
          </h1>
          <p>
            Welcome back, <strong>{currentUser?.name || 'Administrator'}</strong> — Operating as <strong>{activeRole?.name || 'Admin'}</strong> ({activeRole?.description})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(hasPermission('manage_content') || isSuperAdmin || isContentAdmin) && (
            <button className="btn btn-primary" onClick={handleCreateArticle}>
              <Plus size={16} /> Write New Article
            </button>
          )}
          {hasPermission('reset_passwords') && (
            <button className="btn btn-gold" onClick={() => setIsResetModalOpen(true)}>
              <KeyRound size={16} /> Reset User Password
            </button>
          )}
        </div>
      </div>

      {/* Top Metric Cards - Custom Rendered per Role */}
      <div className="stats-grid">
        {/* Editor Role Specific Stats */}
        {isEditor && (
          <>
            <StatsCard
              title="Assigned to Me"
              value={assignedToMeArticles.length}
              change="Articles Assigned to You"
              icon={FileText}
              accentColor="#c084fc"
            />
            <StatsCard
              title="Under Editorial Review"
              value={editorUnderReviewCount}
              change="Pending Quality Polish"
              icon={FileText}
              accentColor="var(--brand-gold)"
            />
            <StatsCard
              title="Changes Requested"
              value={editorChangesRequestedCount}
              change="Returned to Author"
              icon={FileText}
              accentColor="#ef4444"
            />
            <StatsCard
              title="Approved Quality"
              value={editorApprovedCount}
              change="Ready for Publishing"
              icon={CheckCircle}
              accentColor="#10b981"
            />
          </>
        )}

        {(isSuperAdmin || isContentAdmin) && (
          <StatsCard
            title="Total Published News"
            value={publishedCount}
            change="Real-time count"
            icon={FileText}
            accentColor="var(--brand-red)"
          />
        )}

        {isContentAdmin && (
          <StatsCard
            title="Draft Articles"
            value={draftCount}
            change="In Editorial Pipeline"
            icon={FileText}
            accentColor="var(--brand-gold)"
          />
        )}

        {(isSuperAdmin || isSubManager) && (
          <StatsCard
            title="Active Paid Subscribers"
            value={activeSubscribersCount.toLocaleString()}
            change="Real-time count"
            icon={CreditCard}
            accentColor="var(--brand-gold)"
          />
        )}

        {isSubManager && (
          <StatsCard
            title="Configured Tier Plans"
            value={plans.length}
            change="Membership Tiers"
            icon={CreditCard}
            accentColor="var(--accent-blue)"
          />
        )}

        {(isSuperAdmin || isSupportAdmin) && (
          <StatsCard
            title="Open Support Tickets"
            value={openTicketsCount}
            change="Real-time count"
            icon={LifeBuoy}
            accentColor="#10b981"
          />
        )}

        {isSupportAdmin && (
          <StatsCard
            title="Verified Accounts"
            value={verifiedUsersCount}
            change="KYC Verified"
            icon={CheckCircle}
            accentColor="#8b5cf6"
          />
        )}

        {isSuperAdmin && (
          <StatsCard
            title="Admin Staff Accounts"
            value={adminUsers.length}
            change="System Administrators"
            icon={Users}
            accentColor="#8b5cf6"
          />
        )}
      </div>

      {/* Role-Based Launchpads - Strictly Scoped per Role */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Module: Editor Launchpad (Shown to Editor or Super Admin) */}
        {(isEditor || isSuperAdmin) && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #c084fc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#c084fc" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Editor Quality Desk ({currentUser?.name || 'Editor'})</h2>
              </div>
              <RoleBadge roleId="editor" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Review, polish copy, check SEO & images, return with notes or approve content.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Articles Assigned to {currentUser?.name || 'Editor'}
              </div>
              {assignedToMeArticles.length === 0 ? (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={16} /> No articles assigned to you currently. Select &quot;Content & Articles&quot; to view all stories.
                </div>
              ) : (
                assignedToMeArticles.slice(0, 5).map(art => (
                  <div 
                    key={art.id} 
                    onClick={() => handleEditArticle(art)}
                    title="Click to open and edit article"
                    style={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      justify: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.6rem 0', 
                      borderBottom: '1px solid var(--border-color)' 
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc' }}>{art.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{art.category} • Author: {art.author}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-editor" style={{ fontSize: '0.725rem' }}>
                        {art.status}
                      </span>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '2px 6px', fontSize: '0.725rem' }} title="Edit Article">
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/articles" className="btn btn-secondary btn-sm" style={{ flex: 1, borderColor: '#c084fc', color: '#c084fc' }}>
                Open Editorial Articles Desk <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Module 1: Content Admin Launchpad (Shown to Super Admin or Content Admin) */}
        {(isSuperAdmin || isContentAdmin) && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--brand-red)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Content Admin Responsibilities</h2>
              </div>
              <RoleBadge roleId="content_admin" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Add, edit, publish, archive and remove news articles on the platform.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Recent Article Catalog
              </div>
              {articles.length === 0 ? (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={16} /> No articles added yet. Click &quot;New Article&quot; to create one.
                </div>
              ) : (
                articles.slice(0, 5).map(art => (
                  <div 
                    key={art.id} 
                    onClick={() => handleEditArticle(art)}
                    title="Click to open and edit article"
                    style={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      justify: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.6rem 0', 
                      borderBottom: '1px solid var(--border-color)' 
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc' }}>{art.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{art.category} • By {art.author}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${art.status === 'Published' ? 'badge-published' : (art.status === 'Draft' ? 'badge-draft' : 'badge-editor')}`}>
                        {art.status}
                      </span>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '2px 6px', fontSize: '0.725rem' }} title="Edit Article">
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/articles" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Manage All Articles <ArrowRight size={14} />
              </Link>
              {hasPermission('manage_content') && (
                <button className="btn btn-primary btn-sm" onClick={handleCreateArticle}>
                  <Plus size={14} /> New Article
                </button>
              )}
            </div>
          </div>
        )}

        {/* Module 2: Subscription Manager Launchpad (Shown to Super Admin or Subscription Manager) */}
        {(isSuperAdmin || isSubManager) && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--brand-gold)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Subscription Manager Responsibilities</h2>
              </div>
              <RoleBadge roleId="subscription_manager" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Manage subscription plans, premium users, and account renewals.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Configured Tier Rates
              </div>
              {plans.length === 0 ? (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={16} /> No membership tiers configured yet.
                </div>
              ) : (
                plans.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--brand-gold)' }}>{p.price} / {p.billingCycle}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/subscriptions" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Manage Subscriptions <ArrowRight size={14} />
              </Link>
              {hasPermission('manage_subscriptions') && (
                <button className="btn btn-gold btn-sm" onClick={() => setIsPlanModalOpen(true)}>
                  <Plus size={14} /> New Tier
                </button>
              )}
            </div>
          </div>
        )}

        {/* Module 3: Support Admin Launchpad (Shown to Super Admin or Support Admin) */}
        {(isSuperAdmin || isSupportAdmin) && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LifeBuoy size={20} color="#10b981" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Support Admin Responsibilities</h2>
              </div>
              <RoleBadge roleId="support_admin" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Reset passwords, verify users, and handle account support tickets.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Pending Tickets Queue
              </div>
              {supportTickets.length === 0 ? (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={16} /> No support tickets pending.
                </div>
              ) : (
                supportTickets.map(tkt => (
                  <div key={tkt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{tkt.issueType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tkt.userEmail}</div>
                    </div>
                    <span className="badge" style={{ background: tkt.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: tkt.status === 'Resolved' ? '#10b981' : '#f59e0b' }}>
                      {tkt.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/support" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                View Support Desk <ArrowRight size={14} />
              </Link>
              {hasPermission('reset_passwords') && (
                <button className="btn btn-gold btn-sm" onClick={() => setIsResetModalOpen(true)}>
                  <KeyRound size={14} /> Password Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Module 4: Super Admin Launchpad (ONLY shown to Super Admin) */}
        {isSuperAdmin && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#8b5cf6" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Super Admin System Control</h2>
              </div>
              <RoleBadge roleId="super_admin" />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Manage admins, user permissions, global settings, and system maintenance mode.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Admin Staff Directory
              </div>
              {adminUsers.length === 0 ? (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={16} /> No admin accounts provisioned yet.
                </div>
              ) : (
                adminUsers.map(adm => (
                  <div key={adm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{adm.name}</span>
                    <RoleBadge roleId={adm.roleId} showIcon={false} />
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/admins" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Manage Admin Staff <ArrowRight size={14} />
              </Link>
              <Link href="/settings" className="btn btn-secondary btn-sm">
                Platform Settings
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <ArticleEditorModal 
        isOpen={isArticleModalOpen} 
        onClose={() => {
          setIsArticleModalOpen(false);
          setSelectedArticle(null);
        }} 
        articleToEdit={selectedArticle}
      />
      <PasswordResetModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} />
      <SubscriptionPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />
    </div>
  );
}
