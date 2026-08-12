"use client";

import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { INITIAL_ROLE_DEFINITIONS } from '../data/mockInitialData';
import { ShieldCheck, FileText, CreditCard, LifeBuoy, Edit3 } from 'lucide-react';

export default function RoleBadge({ roleId, showIcon = true, customClass = "" }) {
  const adminCtx = useAdmin();
  const roleList = (adminCtx && adminCtx.roles) ? adminCtx.roles : INITIAL_ROLE_DEFINITIONS;
  const roleObj = roleList.find(r => r.id === roleId) || roleList[0] || { name: 'Admin', badgeClass: 'badge-secondary' };

  const getIcon = () => {
    switch (roleId) {
      case 'super_admin':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'editor':
        return <Edit3 className="w-3.5 h-3.5" />;
      case 'content_admin':
        return <FileText className="w-3.5 h-3.5" />;
      case 'subscription_manager':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'support_admin':
        return <LifeBuoy className="w-3.5 h-3.5" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span className={`badge ${roleObj.badgeClass || 'badge-secondary'} ${customClass}`}>
      {showIcon && getIcon()}
      {roleObj.name || 'Admin'}
    </span>
  );
}
