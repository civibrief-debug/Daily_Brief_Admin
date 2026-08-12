export const INITIAL_ROLE_DEFINITIONS = [
  {
    id: "super_admin",
    name: "Super Admin",
    badgeClass: "badge-super",
    description: "Manage admins, users, subscriptions, platform settings.",
    permissions: ["all_access", "manage_admins", "manage_users", "manage_subscriptions", "platform_settings", "manage_content", "support_access"]
  },
  {
    id: "editor",
    name: "Editor",
    badgeClass: "badge-editor",
    description: "Review, edit, polish content quality & SEO. Return with notes or approve articles.",
    permissions: ["review_content", "edit_assigned_articles", "request_changes", "approve_articles"]
  },
  {
    id: "content_admin",
    name: "Content Admin",
    badgeClass: "badge-content",
    description: "Add, edit, publish, archive and remove articles.",
    permissions: ["manage_content", "view_analytics"]
  },
  {
    id: "subscription_manager",
    name: "Subscription Manager",
    badgeClass: "badge-subscription",
    description: "Manage subscription plans, premium users and renewals.",
    permissions: ["manage_subscriptions", "view_financial_analytics"]
  },
  {
    id: "support_admin",
    name: "Support Admin",
    badgeClass: "badge-support",
    description: "Reset passwords, verify users, handle account issues.",
    permissions: ["reset_passwords", "verify_users", "manage_support_tickets"]
  }
];

export const INITIAL_ARTICLES = [];

export const INITIAL_SUBSCRIPTION_PLANS = [];

export const INITIAL_SUBSCRIBERS = [];

export const INITIAL_SUPPORT_TICKETS = [];

export const INITIAL_ADMIN_USERS = [
  {
    id: "user-editor-1",
    username: "john_editor",
    name: "John Editor",
    email: "john.editor@dailybrief.com",
    roleId: "editor",
    status: "Active",
    createdAt: "2026-08-01"
  },
  {
    id: "user-editor-2",
    username: "sarah_editor",
    name: "Sarah Senior Editor",
    email: "sarah.editor@dailybrief.com",
    roleId: "editor",
    status: "Active",
    createdAt: "2026-08-02"
  }
];

export const INITIAL_PLATFORM_SETTINGS = {
  siteTitle: "Daily Brief News Portal",
  maintenanceMode: false,
  breakingNewsBanner: "",
  enablePublicSignups: true,
  requireEmailVerification: true,
  maxDailyPasswordResetsPerUser: 3,
  supportDeskEmail: ""
};
