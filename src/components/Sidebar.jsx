"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import { LayoutDashboard, FileText, CreditCard, LifeBuoy, Users, Settings, Lock, Info } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, activeRoleId, activeRole, hasPermission } = useAdmin();

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.roleId === 'super_admin';

  const navItems = [
    {
      label: 'Overview Dashboard',
      path: '/',
      icon: <LayoutDashboard size={18} />,
      permission: null
    },
    {
      label: 'Content & Articles',
      path: '/articles',
      icon: <FileText size={18} />,
      permission: 'manage_content',
      roleBadge: 'Content Admin'
    },
    {
      label: 'Subscription Plans',
      path: '/subscriptions',
      icon: <CreditCard size={18} />,
      permission: 'manage_subscriptions',
      roleBadge: 'Sub Manager'
    },
    {
      label: 'Support & Passwords',
      path: '/support',
      icon: <LifeBuoy size={18} />,
      permission: 'reset_passwords',
      roleBadge: 'Support Admin'
    },
    {
      label: 'Admin Staff Control',
      path: '/admins',
      icon: <Users size={18} />,
      permission: 'manage_admins',
      roleBadge: 'Super Admin'
    },
    {
      label: 'Platform Settings',
      path: '/settings',
      icon: <Settings size={18} />,
      permission: 'platform_settings',
      roleBadge: 'Super Admin'
    }
  ];

  // Filter items: Super Admin sees all; others see only their assigned permission routes
  const visibleNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    if (isSuperAdmin) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside style={{
      width: '270px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '0.75rem' }}>
          Navigation Menu
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  background: isActive ? 'var(--brand-red)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(201, 24, 24, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Role Responsibilities Information Card */}
      <div className="glass-panel" style={{ padding: '1rem', marginTop: '1.5rem', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color-strong)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '0.5rem' }}>
          <Info size={14} />
          <span>Active Role Scope</span>
        </div>
        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          {activeRole.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {activeRole.description}
        </div>
      </div>

    </aside>
  );
}
