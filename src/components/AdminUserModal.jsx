"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAdmin } from '../context/AdminContext';
import { ShieldCheck, BookOpen, Key, Lock, CheckSquare } from 'lucide-react';

export const categorySubSectionsMap = {
  'Tech & AI': [
    'Artificial Intelligence',
    'Chips & Silicon Hardware',
    'Quantum & Edge Compute',
    'Cybersecurity & Defense',
    'Autonomous Systems & Robotics',
    'Biotech & Synthetic Biology'
  ],
  'Global Affairs': [
    'Geopolitics & Strategy',
    'Trade & Supply Chains',
    'Diplomacy & Treaties',
    'Defense & Security',
    'International Law & UN',
    'Sovereign Infrastructure'
  ],
  'India & Policy': [
    'Parliament & Legislation',
    'Union Cabinet & Governance',
    'State Assemblies & Elections',
    'Judiciary & Legal Reforms',
    'Strategic Defense & Security',
    'Infrastructure & Public Policy'
  ],
  'National Affairs': [
    'Governance & Public Sector',
    'Federal Policy & States',
    'Internal Security',
    'Civic Infrastructure & Development'
  ],
  'Markets & Economy': [
    'Global Stock Indices',
    'Central Banks & Interest Rates',
    'Venture Capital & Private Equity',
    'Energy & Commodities',
    'Macroeconomics & Inflation',
    'Real Estate & Infrastructure'
  ],
  'Credit News': [
    'Banking & Monetary Policy',
    'Corporate Credit & Bonds',
    'Fintech & Digital Lending',
    'Sovereign Debt & Ratings'
  ],
  'Science & Climate': [
    'Clean Energy & Nuclear Fusion',
    'Space Exploration & NISAR',
    'Genomics & Precision Medicine',
    'Climate Policy & Decarbonization',
    'Quantum Physics & Materials',
    'Deep Ocean & Polar Research'
  ],
  'Movies': [
    'Box Office & Blockbusters',
    'Film Festivals & Oscars',
    'Streaming & OTT Releases',
    'Director Cut & Screenwriting'
  ],
  'Lifestyle': [
    'Wellness & Longevity',
    'Architecture & Interiors',
    'Travel & Culinary Arts',
    'High Fashion & Horology'
  ],
  'Sports': [
    'Basketball',
    'Olympics',
    'Asian Games',
    'Wrestling',
    'FIFA World Cup',
    'Cricket & World Cups',
    'Football & European Leagues',
    'Formula 1 & Motorsport',
    'Tennis Grand Slams'
  ],
  'Opinion & Essays': [
    'Lead Editorials',
    'Guest Columns & Thinkers',
    'Ethics of AI & Automation',
    'Economic Policy Debates',
    'Future of Work & Society',
    'Book Reviews & Critical Essays'
  ],
  'Culture & Design': [
    'Biophilic & Urban Architecture',
    'Digital Art & Generative Media',
    'Industrial Design Systems',
    'Media, Film & Cinema Reviews',
    'Modern Philosophy & Literature',
    'Visual Culture & Exhibitions'
  ],
  'Deep Dives 💎': [
    'Special Investigative Series',
    'Interactive Data Charts & Maps',
    'Executive Policy Playbooks',
    '5-Year Tech Forecasts',
    'Sovereign AI Benchmarks 2026'
  ]
};

export default function AdminUserModal({ isOpen, onClose, adminToEdit = null }) {
  const { addAdminUser, updateAdminUser, roles } = useAdmin();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: 'content_admin',
    categoryScope: ['All Categories'],
    sectionScope: {},
    actionPermissions: ['manage_articles']
  });

  const categoriesList = [
    'Tech & AI',
    'Global Affairs',
    'Markets & Economy',
    'Science & Climate',
    'Movies',
    'Lifestyle',
    'Sports',
    'Opinion & Essays',
    'Culture & Design',
    'Deep Dives 💎'
  ];

  const actionPermissionsList = [
    { id: 'manage_articles', label: 'Manage & Add Articles', desc: 'Create, edit, and curate news articles' },
    { id: 'manage_plans', label: 'Manage Subscription Plans', desc: 'Create and update subscription tiers & rates' },
    { id: 'reset_passwords', label: 'Reset User Passwords', desc: 'Trigger temporary key generator for users' },
    { id: 'verify_users', label: 'Verify Users & Tickets', desc: 'Approve KYC & resolve support desk tickets' },
    { id: 'manage_admins', label: 'Manage Users & Admins', desc: 'Onboard staff and assign admin roles' },
    { id: 'view_audit', label: 'View Audit & Platform Settings', desc: 'System maintenance & security settings' }
  ];

  useEffect(() => {
    if (adminToEdit) {
      setFormData({
        ...adminToEdit,
        password: adminToEdit.password || 'admin123',
        categoryScope: adminToEdit.categoryScope || ['All Categories'],
        sectionScope: adminToEdit.sectionScope || {},
        actionPermissions: adminToEdit.actionPermissions || ['manage_articles']
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        roleId: 'content_admin',
        categoryScope: ['All Categories'],
        sectionScope: {},
        actionPermissions: ['manage_articles']
      });
    }
  }, [adminToEdit, isOpen]);

  // Handle Preset Selection Change
  const handleRolePresetChange = (presetRoleId) => {
    let scopes = ['All Categories'];
    let perms = [];

    switch (presetRoleId) {
      case 'super_admin':
        scopes = ['All Categories'];
        perms = ['manage_articles', 'manage_plans', 'reset_passwords', 'verify_users', 'manage_admins', 'view_audit'];
        break;
      case 'editor':
        scopes = ['All Categories'];
        perms = ['manage_articles'];
        break;
      case 'content_admin':
        scopes = ['All Categories'];
        perms = ['manage_articles'];
        break;
      case 'subscription_manager':
        scopes = ['All Categories'];
        perms = ['manage_plans'];
        break;
      case 'support_admin':
        scopes = ['All Categories'];
        perms = ['reset_passwords', 'verify_users'];
        break;
      case 'custom_role':
        scopes = ['Tech & AI'];
        perms = ['manage_articles'];
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      roleId: presetRoleId,
      categoryScope: scopes,
      actionPermissions: perms
    }));
  };

  const handleCategoryToggle = (catName) => {
    setFormData(prev => {
      let current = [...prev.categoryScope];
      if (catName === 'All Categories') {
        if (current.includes('All Categories')) {
          current = ['Tech & AI'];
        } else {
          current = ['All Categories'];
        }
      } else {
        current = current.filter(c => c !== 'All Categories');
        if (current.includes(catName)) {
          current = current.filter(c => c !== catName);
        } else {
          current.push(catName);
        }
        if (current.length === 0) current = ['All Categories'];
      }
      return { ...prev, categoryScope: current };
    });
  };

  const handleSubSectionToggle = (catName, subSec) => {
    setFormData(prev => {
      const currentSectionMap = { ...(prev.sectionScope || {}) };
      let currentSubs = [...(currentSectionMap[catName] || categorySubSectionsMap[catName] || [])];
      
      if (subSec === 'All Sections') {
        if (currentSubs.includes('All Sections') || currentSubs.length === categorySubSectionsMap[catName]?.length) {
          currentSubs = [categorySubSectionsMap[catName][0]];
        } else {
          currentSubs = ['All Sections'];
        }
      } else {
        currentSubs = currentSubs.filter(s => s !== 'All Sections');
        if (currentSubs.includes(subSec)) {
          currentSubs = currentSubs.filter(s => s !== subSec);
        } else {
          currentSubs.push(subSec);
        }
        if (currentSubs.length === 0) currentSubs = [categorySubSectionsMap[catName][0]];
      }

      currentSectionMap[catName] = currentSubs;
      return { ...prev, sectionScope: currentSectionMap };
    });
  };

  const handlePermissionToggle = (permId) => {
    setFormData(prev => {
      const current = [...prev.actionPermissions];
      const idx = current.indexOf(permId);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(permId);
      }
      return { ...prev, actionPermissions: current };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (adminToEdit) {
      updateAdminUser(formData);
    } else {
      addAdminUser(formData);
    }

    onClose();
  };

  const isSuperAdminSelected = formData.roleId === 'super_admin';
  const isCustomRoleSelected = formData.roleId === 'custom_role';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={adminToEdit ? "Edit Admin Access & Permissions" : "Assign New Admin Personnel"}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
          
          {/* Row 1: Full Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Username / Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="sarah@dailybrief.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Row 2: Password */}
          <div className="form-group">
            <label>Password (Pass-Key for Login)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Assign login password (e.g. pass123)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Row 3: Role Preset Dropdown */}
          <div className="form-group" style={{ marginBottom: isSuperAdminSelected ? '1.5rem' : '1.25rem' }}>
            <label>Assigned Administrative Role Preset</label>
            <select
              className="form-control"
              value={formData.roleId}
              onChange={(e) => handleRolePresetChange(e.target.value)}
              style={{ fontWeight: 600 }}
            >
              <option value="content_admin">Content Admin (Articles & News Management)</option>
              <option value="editor">Editor (Review, Polish & Quality Approval)</option>
              <option value="subscription_manager">Subscription Manager (Plans & Premium Users)</option>
              <option value="support_admin">Support Admin (Password Resets & Support Desk)</option>
              <option value="super_admin">Super Admin (Full Unrestricted Platform Control)</option>
              <option value="custom_role">Custom Role (Manual Permission & Scope Configuration)</option>
            </select>
          </div>

          {/* Hide options completely when Super Admin is selected */}
          {!isSuperAdminSelected && (
            <>
              {/* Box 1: Category & Sub-Section Scope */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    <BookOpen size={16} color="var(--brand-gold)" /> Assigned Category & Section Scope
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Restricts news article category & sub-section publishing
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={formData.categoryScope.includes('All Categories')}
                      onChange={() => handleCategoryToggle('All Categories')}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>All Categories & All Sub-Sections (Unrestricted Scope)</span>
                  </label>

                  {!formData.categoryScope.includes('All Categories') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem', paddingLeft: '1rem' }}>
                      {categoriesList.map(cat => {
                        const isCatChecked = formData.categoryScope.includes(cat);
                        const assignedSubSections = formData.sectionScope?.[cat] || categorySubSectionsMap[cat] || [];
                        const isAllSubsChecked = assignedSubSections.includes('All Sections') || assignedSubSections.length === categorySubSectionsMap[cat]?.length;

                        return (
                          <div key={cat} style={{ background: isCatChecked ? 'rgba(255,255,255,0.03)' : 'transparent', border: isCatChecked ? '1px solid rgba(255,255,255,0.1)' : '1px transparent solid', borderRadius: '8px', padding: '10px 12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, color: isCatChecked ? '#facc15' : 'var(--text-secondary)' }}>
                              <input
                                type="checkbox"
                                checked={isCatChecked}
                                onChange={() => handleCategoryToggle(cat)}
                                style={{ cursor: 'pointer' }}
                              />
                              <span>{cat} Category</span>
                            </label>

                            {/* Sub-section granular assignment panel */}
                            {isCatChecked && categorySubSectionsMap[cat] && (
                              <div style={{ marginTop: '8px', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(250, 204, 21, 0.3)' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                                  Allowed Sub-Sections in {cat}:
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                  {categorySubSectionsMap[cat].map(subSec => {
                                    const isSubChecked = isAllSubsChecked || assignedSubSections.includes(subSec);
                                    return (
                                      <label key={subSec} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.775rem', color: isSubChecked ? '#f8fafc' : '#64748b' }}>
                                        <input
                                          type="checkbox"
                                          checked={isSubChecked}
                                          onChange={() => handleSubSectionToggle(cat, subSec)}
                                          style={{ cursor: 'pointer' }}
                                        />
                                        <span>{subSec}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Specific Action Permissions */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    <ShieldCheck size={16} color="var(--brand-red)" /> Specific Action Permissions
                  </div>
                  {!isCustomRoleSelected && (
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Locked to preset role permissions
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {actionPermissionsList.map(perm => {
                    const isChecked = formData.actionPermissions.includes(perm.id);
                    return (
                      <label key={perm.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: isCustomRoleSelected ? 'pointer' : 'default', opacity: !isCustomRoleSelected && !isChecked ? 0.45 : 1 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => isCustomRoleSelected && handlePermissionToggle(perm.id)}
                          disabled={!isCustomRoleSelected}
                          style={{ marginTop: '0.25rem', width: '16px', height: '16px', cursor: isCustomRoleSelected ? 'pointer' : 'default' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isChecked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {perm.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {perm.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {adminToEdit ? "Save Access Changes" : "Assign Admin Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
