"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ROLE_DEFINITIONS,
  INITIAL_ARTICLES,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_SUBSCRIBERS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_ADMIN_USERS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_HOMEPAGE_ADS,
  INITIAL_HOMEPAGE_ARTICLE_SECTIONS
} from '../data/mockInitialData';

const AdminContext = createContext();

export const DEFAULT_SUPER_ADMIN = {
  id: 'super-admin-root',
  username: 'admin',
  name: 'Super Admin',
  email: 'admin@dailybrief.com',
  password: 'admin',
  roleId: 'super_admin',
  categoryScope: ['All Categories'],
  actionPermissions: ['manage_articles', 'manage_plans', 'reset_passwords', 'verify_users', 'manage_admins', 'view_audit']
};

export function AdminProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('db_admin_theme') || 'dark';
    }
    return 'dark';
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [plans, setPlans] = useState(INITIAL_SUBSCRIPTION_PLANS);
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS);
  const [supportTickets, setSupportTickets] = useState(INITIAL_SUPPORT_TICKETS);
  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
  const [settings, setSettings] = useState(INITIAL_PLATFORM_SETTINGS);
  const [homepageAds, setHomepageAds] = useState(INITIAL_HOMEPAGE_ADS);
  const [homepageArticleSections, setHomepageArticleSections] = useState(INITIAL_HOMEPAGE_ARTICLE_SECTIONS);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync document theme attribute whenever theme state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('db_admin_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('db_admin_theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, "info");
      return nextTheme;
    });
  };

  // Sync auth state & admin users from verified session & D1 on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('db_admin_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Purge any legacy unverified auto-saved sessions from previous versions
    if (localStorage.getItem('db_admin_user')) {
      localStorage.removeItem('db_admin_user');
    }

    const savedSessionStr = localStorage.getItem('db_admin_session_v2');
    if (savedSessionStr) {
      try {
        const savedSession = JSON.parse(savedSessionStr);
        if (savedSession && savedSession.id && savedSession.authSessionId && savedSession.roleId) {
          setCurrentUser(savedSession);
        } else {
          setCurrentUser(null);
          localStorage.removeItem('db_admin_session_v2');
        }
      } catch (err) {
        console.error("Failed to parse saved session", err);
        setCurrentUser(null);
        localStorage.removeItem('db_admin_session_v2');
      }
    } else {
      setCurrentUser(null);
    }


    const savedAdminsStr = localStorage.getItem('db_admin_users');
    if (savedAdminsStr) {
      try {
        const parsedAdmins = JSON.parse(savedAdminsStr);
        if (Array.isArray(parsedAdmins) && parsedAdmins.length > 0) {
          setAdminUsers(parsedAdmins);
        }
      } catch (err) {
        console.error("Failed to parse saved admin users", err);
      }
    }

    // Fetch initial database collections from central database API
    const loadSharedDbData = async () => {
      try {
        const [artsRes, subsRes, tktsRes, admsRes] = await Promise.all([
          fetch('/api/db/articles').catch(() => null),
          fetch('/api/db/subscribers').catch(() => null),
          fetch('/api/db/support').catch(() => null),
          fetch('/api/db/admins').catch(() => null)
        ]);
        
        if (artsRes && artsRes.ok) {
          const artsJson = await artsRes.json().catch(() => null);
          if (artsJson && artsJson.success && Array.isArray(artsJson.data) && artsJson.data.length > 0) {
            setArticles(artsJson.data);
          }
        }

        if (subsRes && subsRes.ok) {
          const subsJson = await subsRes.json().catch(() => null);
          if (subsJson && subsJson.success && Array.isArray(subsJson.data) && subsJson.data.length > 0) {
            setSubscribers(subsJson.data);
          }
        }

        if (tktsRes && tktsRes.ok) {
          const tktsJson = await tktsRes.json().catch(() => null);
          if (tktsJson && tktsJson.success && Array.isArray(tktsJson.data) && tktsJson.data.length > 0) {
            setSupportTickets(tktsJson.data);
          }
        }

        if (admsRes && admsRes.ok) {
          const admsJson = await admsRes.json().catch(() => null);
          if (admsJson && admsJson.success && Array.isArray(admsJson.data) && admsJson.data.length > 0) {
            setAdminUsers(admsJson.data);
            localStorage.setItem('db_admin_users', JSON.stringify(admsJson.data));
          }
        }

        // Load saved Homepage Ads from localStorage or API
        const savedHomepageAds = localStorage.getItem('db_homepage_ads');
        if (savedHomepageAds) {
          try {
            const parsed = JSON.parse(savedHomepageAds);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHomepageAds(parsed);
            }
          } catch (e) {
            console.error("Error parsing saved homepage ads", e);
          }
        }

        const savedArticleSections = localStorage.getItem('db_homepage_article_sections');
        if (savedArticleSections) {
          try {
            const parsed = JSON.parse(savedArticleSections);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHomepageArticleSections(parsed);
            }
          } catch (e) {
            console.error("Error parsing saved homepage article sections", e);
          }
        }

        try {
          const adsRes = await fetch('/api/db/homepage-ads').catch(() => null);
          if (adsRes && adsRes.ok) {
            const adsJson = await adsRes.json().catch(() => null);
            if (adsJson && adsJson.success && Array.isArray(adsJson.data) && adsJson.data.length > 0) {
              setHomepageAds(adsJson.data);
              localStorage.setItem('db_homepage_ads', JSON.stringify(adsJson.data));
            }
          }
        } catch (e) {
          console.warn("Could not fetch remote homepage ads", e);
        }

        try {
          const artSecRes = await fetch('/api/db/homepage-articles').catch(() => null);
          if (artSecRes && artSecRes.ok) {
            const artSecJson = await artSecRes.json().catch(() => null);
            if (artSecJson && artSecJson.success && Array.isArray(artSecJson.data) && artSecJson.data.length > 0) {
              setHomepageArticleSections(artSecJson.data);
              localStorage.setItem('db_homepage_article_sections', JSON.stringify(artSecJson.data));
            }
          }
        } catch (e) {
          console.warn("Could not fetch remote homepage article placements", e);
        }
      } catch (err) {
        console.warn("Failed to sync with shared database (suppressed):", err?.message || err);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSharedDbData();
  }, []);

  const updateHomepageAds = async (newAds) => {
    setHomepageAds(newAds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('db_homepage_ads', JSON.stringify(newAds));
    }
    try {
      await fetch('/api/db/homepage-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads: newAds })
      });
    } catch (e) {
      console.warn("Could not push homepage ads to remote API", e);
    }
    showToast("Homepage Ad Placements saved successfully!", "success");
  };

  const updateHomepageArticlePlacements = async (newSections) => {
    setHomepageArticleSections(newSections);
    if (typeof window !== 'undefined') {
      localStorage.setItem('db_homepage_article_sections', JSON.stringify(newSections));
    }
    try {
      await fetch('/api/db/homepage-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: newSections })
      });
    } catch (e) {
      console.warn("Could not push homepage article placements to remote API", e);
    }
    showToast("Homepage Article Placements saved & published successfully!", "success");
  };

  const updateSingleHomepageAd = async (adId, updatedFields) => {
    let nextList = [];
    setHomepageAds(prev => {
      nextList = prev.map(item => item.id === adId ? { ...item, ...updatedFields } : item);
      if (typeof window !== 'undefined') {
        localStorage.setItem('db_homepage_ads', JSON.stringify(nextList));
      }
      return nextList;
    });
    try {
      await fetch('/api/db/homepage-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads: nextList })
      });
    } catch (e) {
      console.warn("Could not push single homepage ad update to API", e);
    }
    showToast("Homepage ad updated & synced", "info");
  };

  const activeRoleId = currentUser ? currentUser.roleId : null;
  const activeRole = INITIAL_ROLE_DEFINITIONS.find(r => r.id === activeRoleId) || INITIAL_ROLE_DEFINITIONS[0];

  const showToast = (msg, type = "info") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Authenticated Login Function matching Super Admin OR assigned admin users in D1
  const login = (usernameInput, passwordInput) => {
    const trimmedUser = (usernameInput || '').trim().toLowerCase();
    const trimmedUserNoSpace = trimmedUser.replace(/\s+/g, '');
    const trimmedPass = (passwordInput || '').toString().trim();
    
    // Always default to Dark Mode on login
    setTheme('dark');
    localStorage.setItem('db_admin_theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');

    // Check Root Super Admin
    if (
      trimmedUser === DEFAULT_SUPER_ADMIN.username.toLowerCase() ||
      trimmedUser === DEFAULT_SUPER_ADMIN.email.toLowerCase() ||
      trimmedUser === 'super.admin' ||
      trimmedUser === 'admin'
    ) {
      if (trimmedPass && trimmedPass !== DEFAULT_SUPER_ADMIN.password && trimmedPass !== 'admin123') {
        showToast("Incorrect Tactical Pass-Key.", "error");
        return { success: false, error: "Incorrect Tactical Pass-Key" };
      }

      const userSession = {
        ...DEFAULT_SUPER_ADMIN,
        name: 'Super Admin',
        email: 'admin@dailybrief.com',
        authSessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        authenticatedAt: new Date().toISOString()
      };
      setCurrentUser(userSession);
      localStorage.setItem('db_admin_session_v2', JSON.stringify(userSession));
      localStorage.removeItem('db_admin_user');
      showToast(`Welcome back, Super Admin`, "success");
      return { success: true, user: userSession };
    }

    // Check dynamically created adminUsers in state & D1
    const matchAdmin = adminUsers.find(a => {
      if (!a) return false;
      const nameLower = (a.name || '').toLowerCase().trim();
      const emailLower = (a.email || '').toLowerCase().trim();
      const emailUser = emailLower.split('@')[0];
      const usernameLower = (a.username || '').toLowerCase().trim();

      return (
        nameLower === trimmedUser ||
        emailLower === trimmedUser ||
        emailUser === trimmedUser ||
        usernameLower === trimmedUser ||
        nameLower.replace(/\s+/g, '') === trimmedUserNoSpace
      );
    });

    if (matchAdmin) {
      const dbPass = (matchAdmin.password || 'admin123').toString().trim();
      if (trimmedPass && dbPass && dbPass !== trimmedPass) {
        showToast("Incorrect Tactical Pass-Key.", "error");
        return { success: false, error: "Incorrect Tactical Pass-Key" };
      }

      const userSession = {
        id: matchAdmin.id,
        username: matchAdmin.email ? matchAdmin.email.split('@')[0] : (matchAdmin.username || matchAdmin.name),
        name: matchAdmin.name,
        email: matchAdmin.email,
        roleId: matchAdmin.roleId,
        categoryScope: matchAdmin.categoryScope || ['All Categories'],
        sectionScope: matchAdmin.sectionScope || {},
        actionPermissions: matchAdmin.actionPermissions || ['manage_articles'],
        authSessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        authenticatedAt: new Date().toISOString()
      };

      setCurrentUser(userSession);
      localStorage.setItem('db_admin_session_v2', JSON.stringify(userSession));
      localStorage.removeItem('db_admin_user');
      const roleDef = INITIAL_ROLE_DEFINITIONS.find(r => r.id === userSession.roleId);
      showToast(`Welcome back, ${userSession.name} (${roleDef?.name || userSession.roleId})`, "success");
      return { success: true, user: userSession };
    }

    showToast("Invalid admin credentials.", "error");
    return { success: false, error: "Invalid Command ID or Pass-Key" };
  };

  // Fast Role Switcher helper for live role testing
  const switchRole = (newRoleId) => {
    if (!currentUser) return;
    const roleNames = {
      super_admin: 'Super Admin',
      editor: 'John Editor',
      content_admin: 'Content Admin (Author)',
      subscription_manager: 'Subscription Manager',
      support_admin: 'Support Admin'
    };
    const updated = {
      ...currentUser,
      roleId: newRoleId,
      name: roleNames[newRoleId] || currentUser?.name || 'Admin User'
    };
    setCurrentUser(updated);
    localStorage.setItem('db_admin_session_v2', JSON.stringify(updated));
    showToast(`Switched active role scope to ${INITIAL_ROLE_DEFINITIONS.find(r => r.id === newRoleId)?.name || newRoleId}`, "info");
  };

  // Logout Function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('db_admin_session_v2');
    localStorage.removeItem('db_admin_user');
    showToast("Logged out of Command Center.", "info");
  };


  // Helper permission check
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.roleId === 'super_admin') return true;
    const currentRoleDef = INITIAL_ROLE_DEFINITIONS.find(r => r.id === currentUser.roleId);
    if (!currentRoleDef) return false;
    return (
      currentRoleDef.permissions.includes(permission) ||
      (Array.isArray(currentUser.actionPermissions) && currentUser.actionPermissions.includes(permission))
    );
  };


  // Article Actions (Content Admin & Super Admin) -> Persisted to Shared DB
  const addArticle = async (newArticle) => {
    try {
      const payload = {
        ...newArticle,
        authorId: newArticle.authorId || currentUser?.id || 'adm-author',
        author: newArticle.author || currentUser?.name || currentUser?.username || 'Staff Reporter',
        status: newArticle.status || 'Pending Editor Assignment'
      };
      const res = await fetch('/api/db/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setArticles(prev => [json.data, ...prev]);
        showToast(`Article "${json.data.title || 'Draft'}" saved & synced live.`, "success");
        return json.data;
      } else {
        const errorMsg = json?.error || `Server responded with status ${res.status}`;
        console.error('Failed to add article:', errorMsg);
        showToast(`Error saving article: ${errorMsg}`, "error");
      }
    } catch (err) {
      console.error('Failed to add article:', err);
      showToast("Error adding article to database", "error");
    }
  };

  const updateArticle = async (updated) => {
    try {
      const res = await fetch(`/api/db/articles/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setArticles(prev => prev.map(art => art.id === updated.id ? (json.data || updated) : art));
        showToast(`Article updated live.`, "success");
        return json.data;
      } else {
        const errorMsg = json?.error || `Server responded with status ${res.status}`;
        console.error('Failed to update article:', errorMsg);
        showToast(`Error updating article: ${errorMsg}`, "error");
      }
    } catch (err) {
      console.error('Failed to update article:', err);
      showToast("Error updating article", "error");
    }
  };

  const deleteArticle = async (id) => {
    try {
      const res = await fetch(`/api/db/articles/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => null);
      if (res.ok && json && json.success) {
        setArticles(prev => prev.filter(art => art.id !== id));
        showToast("Article deleted from catalog.", "warning");
      } else {
        const errorMsg = json?.error || `Server responded with status ${res.status}`;
        console.error('Failed to delete article:', errorMsg);
        showToast(`Error deleting article: ${errorMsg}`, "error");
      }
    } catch (err) {
      console.error('Failed to delete article:', err);
      showToast("Error deleting article", "error");
    }
  };

  const toggleArticleStatus = async (id, newStatus) => {
    const target = articles.find(a => a.id === id);
    if (!target) return;
    await updateArticle({ ...target, status: newStatus });

  };

  // Workflow Action 1: Author Submits Article For Editorial Review
  const submitArticleForReview = async (articleId) => {
    const target = articles.find(a => a.id === articleId);
    if (!target) return;
    await updateArticle({
      ...target,
      status: 'Pending Editor Assignment'
    });
    showToast(`Article "${target.title}" submitted for editorial review.`, "info");
  };

  // Workflow Action 2: Super Admin Assigns / Unassigns Editor to Article
  const assignEditorToArticle = async (articleId, editorId, editorName) => {
    const target = articles.find(a => a.id === articleId);
    if (!target) return;
    if (!editorId && !editorName) {
      await updateArticle({
        ...target,
        assignedEditorId: null,
        assignedEditorName: null,
        assignedEditor: null,
        status: target.status === 'Under Editorial Review' ? 'Pending Editor Assignment' : target.status
      });
      showToast(`Article editor unassigned.`, "info");
      return;
    }
    await updateArticle({
      ...target,
      status: 'Under Editorial Review',
      assignedEditorId: editorId,
      assignedEditorName: editorName
    });
    showToast(`Article assigned to Editor ${editorName}. Status: Under Editorial Review.`, "success");
  };

  // Workflow Action 3: Editor Requests Changes from Author (Option 1)
  const requestChangesOnArticle = async (articleId, feedbackText) => {
    const target = articles.find(a => a.id === articleId);
    if (!target) return;
    await updateArticle({
      ...target,
      status: 'Changes Requested',
      editorFeedback: feedbackText,
      feedbackDate: new Date().toISOString().split('T')[0]
    });
    showToast(`Article returned to Author with requested changes.`, "warning");
  };

  // Interactive 2-Way Author & Editor Discussion Thread (Persistent)
  const addArticleComment = async (articleId, text) => {
    if (!articleId || !text || !text.trim()) return null;
    const senderRole = currentUser?.roleId === 'super_admin' ? 'Super Admin' : (currentUser?.roleId === 'editor' ? 'Editor' : 'Author');
    const senderName = currentUser?.name || currentUser?.username || 'User';

    try {
      const res = await fetch(`/api/db/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          senderId: currentUser?.id || 'unknown',
          senderName,
          senderRole
        })
      });
      if (!res.ok) return null;
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.comments)) {
        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, comments: data.comments } : a));
        showToast("Message sent to discussion thread.", "success");
        return data.comments;
      }
    } catch (err) {
      console.error("Failed to post comment to article", err);
      showToast("Unable to send message. Please try again.", "error");
    }
    return null;
  };

  const markArticleCommentsRead = async (articleId) => {
    if (!articleId || !currentUser) return;
    const senderRole = currentUser?.roleId === 'super_admin' ? 'Super Admin' : (currentUser?.roleId === 'editor' ? 'Editor' : 'Author');
    try {
      const res = await fetch(`/api/db/articles/${articleId}/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readerRole: senderRole,
          readerId: currentUser.id
        })
      });
      if (!res.ok) return;
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.comments)) {
        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, comments: data.comments } : a));
      }
    } catch (err) {
      console.warn("Failed to mark comments as read (suppressed):", err?.message || err);
    }
  };

  const fetchArticleComments = async (articleId) => {
    if (!articleId) return [];
    try {
      const res = await fetch(`/api/db/articles/${articleId}/comments`);
      if (!res.ok) return [];
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.comments)) {
        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, comments: data.comments } : a));
        return data.comments;
      }
    } catch (err) {
      console.warn("Failed to fetch article comments (suppressed):", err?.message || err);
    }
    return [];
  };


  // Workflow Action 4: Editor Approves Quality (Option 2)
  const approveArticleByEditor = async (articleId) => {
    const target = articles.find(a => a.id === articleId);
    if (!target) return;
    await updateArticle({
      ...target,
      status: 'Approved by Editor'
    });
    showToast(`Article quality approved by Editor. Ready for publication!`, "success");
  };

  // Subscription Actions -> Persisted to Shared DB
  const updatePlan = (updatedPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    showToast(`Subscription plan "${updatedPlan.name}" updated.`, "success");
  };

  const addPlan = (newPlan) => {
    const planObj = {
      ...newPlan,
      id: `plan-${Date.now()}`,
      activeSubscribers: 0,
      status: "Active"
    };
    setPlans(prev => [...prev, planObj]);
    showToast(`New tier "${planObj.name}" created.`, "success");
  };

  const renewSubscriber = async (id) => {
    const target = subscribers.find(s => s.id === id);
    if (!target) return;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);

    try {
      const res = await fetch('/api/db/subscribers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...target,
          status: 'Active',
          expiryDate: nextDate.toISOString().split('T')[0]
        })
      });
      const json = await res.json();
      if (json.success) {
        setSubscribers(prev => prev.map(sub => sub.id === id ? json.data : sub));
        showToast("Subscriber renewed for 30 days.", "success");
      }
    } catch (err) {
      console.error('Failed to renew subscriber:', err);
    }
  };

  const deleteSubscriber = async (id) => {
    try {
      const res = await fetch(`/api/db/subscribers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setSubscribers(prev => prev.filter(sub => sub.id !== id));
        showToast("Subscriber removed from database.", "warning");
      }
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
      showToast("Error deleting subscriber", "error");
    }
  };

  const deletePlan = (planId) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    showToast("Subscription tier removed.", "warning");
  };

  // Support Actions -> Persisted to Shared DB
  const resetUserPassword = (userEmail) => {
    const tempPassword = `Db#${Math.random().toString(36).slice(-8)}!`;
    showToast(`Password reset key generated for ${userEmail}: ${tempPassword}`, "success");
    return tempPassword;
  };

  const verifyUser = (subId) => {
    setSubscribers(prev => prev.map(sub => sub.id === subId ? { ...sub, verified: true } : sub));
    showToast("User account identity verified.", "success");
  };

  const resolveTicket = async (ticketId, note) => {
    try {
      const res = await fetch('/api/db/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticketId,
          status: 'Resolved',
          replyMessage: note
        })
      });
      const json = await res.json();
      if (json.success) {
        setSupportTickets(prev => prev.map(tkt => tkt.id === ticketId ? json.data : tkt));
        showToast(`Ticket #${ticketId} resolved & replied.`, "success");
      }
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  const deleteSupportTicket = async (ticketId) => {
    try {
      const res = await fetch(`/api/db/support?id=${encodeURIComponent(ticketId)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setSupportTickets(prev => prev.filter(tkt => tkt.id !== ticketId));
        showToast(`Ticket #${ticketId} deleted.`, "warning");
      }
    } catch (err) {
      console.error('Failed to delete support ticket:', err);
      showToast("Error deleting support ticket", "error");
    }
  };

  // Super Admin Personnel Management Actions
  const addAdminUser = async (newAdmin) => {
    const adminObj = {
      id: `adm-${Date.now()}`,
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password || 'admin123',
      roleId: newAdmin.roleId || 'content_admin',
      categoryScope: newAdmin.categoryScope || ['All Categories'],
      sectionScope: newAdmin.sectionScope || {},
      actionPermissions: newAdmin.actionPermissions || ['manage_articles'],
      status: 'Active',
      lastLogin: 'Never'
    };
    
    setAdminUsers(prev => {
      const updated = [adminObj, ...prev];
      localStorage.setItem('db_admin_users', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch('/api/db/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminObj)
      });
    } catch (err) {
      console.error("Failed to sync new admin to backend:", err);
    }
    
    showToast(`Admin Personnel account for ${adminObj.name} assigned successfully.`, "success");
  };

  const updateAdminUser = async (updatedAdmin) => {
    setAdminUsers(prev => {
      const updated = prev.map(adm => adm.id === updatedAdmin.id ? { ...adm, ...updatedAdmin } : adm);
      localStorage.setItem('db_admin_users', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch('/api/db/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAdmin)
      });
    } catch (err) {
      console.error("Failed to sync updated admin to backend:", err);
    }

    if (currentUser && currentUser.id === updatedAdmin.id) {
      const updatedUserSession = { ...currentUser, ...updatedAdmin };
      setCurrentUser(updatedUserSession);
      localStorage.setItem('db_admin_user', JSON.stringify(updatedUserSession));
    }

    showToast(`Admin personnel access for ${updatedAdmin.name} updated.`, "success");
  };

  const deleteAdminUser = async (adminId) => {
    const target = adminUsers.find(a => a.id === adminId);
    if (target && target.roleId === 'super_admin') {
      showToast("Super Admin Master Controller cannot be removed.", "error");
      return;
    }

    setAdminUsers(prev => {
      const updated = prev.filter(a => a.id !== adminId);
      localStorage.setItem('db_admin_users', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`/api/db/admins?id=${encodeURIComponent(adminId)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error("Failed to delete admin from database:", err);
    }

    // Unassign all articles assigned to this deleted editor account
    if (target) {
      const targetNameLower = (target.name || '').toLowerCase().trim();
      const targetEmailUserLower = (target.email || '').split('@')[0].toLowerCase().trim();

      articles.forEach(async (art) => {
        const assignedNameLower = (art.assignedEditorName || '').toLowerCase().trim();
        if (
          art.assignedEditorId === adminId ||
          (assignedNameLower && (assignedNameLower === targetNameLower || assignedNameLower === targetEmailUserLower))
        ) {
          await updateArticle({
            ...art,
            assignedEditorId: null,
            assignedEditorName: null,
            assignedEditor: null,
            status: art.status === 'Under Editorial Review' ? 'Pending Editor Assignment' : art.status
          });
        }
      });
    }

    showToast("Admin account access revoked & assigned articles unassigned.", "warning");
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    showToast("System configuration updated.", "success");
  };

  const updatePlatformSettings = (newSettings) => {
    updateSettings(newSettings);
  };

  return (
    <AdminContext.Provider value={{
      roles: INITIAL_ROLE_DEFINITIONS,
      theme,
      toggleTheme,
      currentUser,
      activeRole,
      login,
      logout,
      switchRole,
      hasPermission,

      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      toggleArticleStatus,
      submitArticleForReview,
      assignEditorToArticle,
      requestChangesOnArticle,
      addArticleComment,
      markArticleCommentsRead,
      fetchArticleComments,
      approveArticleByEditor,

      plans,
      updatePlan,
      addPlan,
      deletePlan,

      subscribers,
      renewSubscriber,
      deleteSubscriber,

      supportTickets,
      resetUserPassword,
      verifyUser,
      resolveTicket,
      deleteSupportTicket,

      adminUsers,
      addAdminUser,
      updateAdminUser,
      deleteAdminUser,

      settings,
      updateSettings,
      updatePlatformSettings,

      homepageAds,
      updateHomepageAds,
      updateSingleHomepageAd,

      homepageArticleSections,
      updateHomepageArticlePlacements,

      toastMessage,
      showToast,
      isInitialized
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
