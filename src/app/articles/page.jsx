"use client";

export const runtime = 'edge';

import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RoleBadge from '../../components/RoleBadge';
import ArticleEditorModal from '../../components/ArticleEditorModal';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Archive, 
  CheckCircle, 
  Lock,
  UserPlus,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  UserCheck,
  UserX
} from 'lucide-react';

export default function ArticlesPage() {
  const { 
    articles, 
    deleteArticle, 
    toggleArticleStatus, 
    hasPermission, 
    currentUser,
    adminUsers,
    assignEditorToArticle,
    approveArticleByEditor
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Assign Editor Popover State
  const [activeAssignPopoverId, setActiveAssignPopoverId] = useState(null);
  const assignPopoverRef = useRef(null);

  const isSuperAdmin = currentUser?.roleId === 'super_admin';
  const isEditor = currentUser?.roleId === 'editor';
  const isContentAdmin = currentUser?.roleId === 'content_admin';

  const canManage = isSuperAdmin || isContentAdmin || isEditor;

  // Filter staff users to find active Editors
  const availableEditors = adminUsers.filter(u => u.roleId === 'editor' && u.status === 'Active');

  // Close assign popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (assignPopoverRef.current && !assignPopoverRef.current.contains(e.target)) {
        setActiveAssignPopoverId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper matching assigned editor articles
  const isAssignedToCurrentEditor = (art) => {
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

  // Helper matching author's own articles (for Content Admin / Author role)
  const isAuthoredByCurrentContentAdmin = (art) => {
    if (!art || !currentUser) return false;
    if (art.authorId && art.authorId === currentUser.id) return true;
    const authorName = (art.author || '').toLowerCase().trim();
    const currentName = (currentUser.name || '').toLowerCase().trim();
    const currentEmailUser = (currentUser.email || '').split('@')[0].toLowerCase().trim();
    const currentUsername = (currentUser.username || '').toLowerCase().trim();

    return (
      authorName === currentName ||
      authorName === currentEmailUser ||
      authorName === currentUsername ||
      (currentName && (authorName.includes(currentName) || currentName.includes(authorName))) ||
      (currentEmailUser && authorName.includes(currentEmailUser))
    );
  };

  // For Editors: strictly restrict visible articles to only those assigned to them
  // For Content Admin (Authors): strictly restrict visible articles to only those authored by them
  let displayableArticles = articles;
  if (isEditor) {
    displayableArticles = articles.filter(isAssignedToCurrentEditor);
  } else if (isContentAdmin) {
    displayableArticles = articles.filter(isAuthoredByCurrentContentAdmin);
  }

  const filteredArticles = displayableArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) ||
                          art.author.toLowerCase().includes(search.toLowerCase()) ||
                          art.category.toLowerCase().includes(search.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'All') {
      matchesTab = true;
    } else if (activeTab === 'Assigned to Me') {
      matchesTab = isAssignedToCurrentEditor(art);
    } else if (activeTab === 'Pending Assignment') {
      matchesTab = art.status === 'Pending Editor Assignment';
    } else if (activeTab === 'Under Editorial Review') {
      matchesTab = art.status === 'Under Editorial Review';
    } else if (activeTab === 'Changes Requested') {
      matchesTab = art.status === 'Changes Requested';
    } else if (activeTab === 'Approved by Editor') {
      matchesTab = art.status === 'Approved by Editor';
    } else {
      matchesTab = art.status === activeTab;
    }

    return matchesSearch && matchesTab;
  });

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="badge badge-published">Published</span>;
      case 'Draft':
        return <span className="badge badge-draft">Draft</span>;
      case 'Pending Editor Assignment':
        return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.35)' }}>Pending Assignment</span>;
      case 'Under Editorial Review':
        return <span className="badge badge-editor">Under Review</span>;
      case 'Changes Requested':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.35)' }}>Changes Requested</span>;
      case 'Approved by Editor':
        return <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.35)' }}>Approved</span>;
      case 'Archived':
      default:
        return <span className="badge badge-archived">{status || 'Archived'}</span>;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Content & Articles Management
            <RoleBadge roleId={currentUser?.roleId || 'content_admin'} />
          </h1>
          <p>
            {isEditor ? (
              "Responsibilities: Review, edit content quality & SEO, request author revisions, and approve articles."
            ) : isContentAdmin ? (
              "Responsibilities: Write news articles, submit for editorial review, revise feedback, and publish approved stories."
            ) : (
              "Responsibilities: Full administrative editorial control, editor assignments, role management, and publishing."
            )}
          </p>
        </div>

        {/* Content Admin & Super Admin can Create Articles */}
        {(isSuperAdmin || isContentAdmin) && (
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={16} /> Write New Article
          </button>
        )}
      </div>

      {/* Editor Locked Info Notice */}
      {isEditor && (
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #c084fc', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(168, 85, 247, 0.08)' }}>
          <Sparkles size={20} color="#c084fc" />
          <div>
            <strong>Editor Workflow Activated:</strong> You have quality review privileges to edit headlines, body copy, SEO, and images. Return articles to author with comments or approve quality. <em>(Editors cannot publish or delete published articles).</em>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="tabs-group" style={{ flexWrap: 'wrap', gap: '4px' }}>
          {[
            'All', 
            ...(isEditor ? ['Assigned to Me'] : []),
            'Published', 
            'Draft', 
            'Pending Assignment', 
            'Under Editorial Review', 
            'Changes Requested', 
            'Approved by Editor',
            'Archived'
          ].map(tab => {
            let count = 0;
            if (tab === 'All') count = displayableArticles.length;
            else if (tab === 'Assigned to Me') count = displayableArticles.filter(isAssignedToCurrentEditor).length;
            else if (tab === 'Pending Assignment') count = displayableArticles.filter(a => a.status === 'Pending Editor Assignment').length;
            else if (tab === 'Under Editorial Review') count = displayableArticles.filter(a => a.status === 'Under Editorial Review').length;
            else if (tab === 'Changes Requested') count = displayableArticles.filter(a => a.status === 'Changes Requested').length;
            else if (tab === 'Approved by Editor') count = displayableArticles.filter(a => a.status === 'Approved by Editor').length;
            else count = displayableArticles.filter(a => a.status === tab).length;

            return (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search headline, author, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Article Headline</th>
                <th>Category</th>
                <th>Author</th>
                <th>Assigned Editor</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No articles found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => {
                  const isLockedForAuthor = isContentAdmin && (art.status === 'Pending Editor Assignment' || art.status === 'Under Editorial Review');
                  const unreadComments = Array.isArray(art.comments) ? art.comments.filter(c => {
                    if (c.isRead) return false;
                    const myRole = isSuperAdmin ? 'Super Admin' : (isEditor ? 'Editor' : 'Author');
                    return c.senderRole !== myRole && c.senderId !== currentUser?.id;
                  }) : [];

                  return (
                    <tr key={art.id}>
                      {/* Headline & Feedback Summary */}
                      <td 
                        style={{ maxWidth: '380px', cursor: 'pointer' }}
                        onClick={() => handleEdit(art)}
                        title="Click to open and edit article"
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                          <span>
                            {art.featured && <span style={{ color: 'var(--brand-gold)', marginRight: '0.375rem' }}>★</span>}
                            {art.title}
                          </span>
                          {unreadComments.length > 0 && (
                            <span 
                              className="badge" 
                              style={{ 
                                background: 'rgba(168, 85, 247, 0.2)', 
                                color: '#c084fc', 
                                border: '1px solid rgba(168, 85, 247, 0.4)', 
                                fontSize: '0.7rem', 
                                padding: '1px 6px' 
                              }}
                              title={`${unreadComments.length} unread message(s) in discussion thread`}
                            >
                              💬 {unreadComments.length} New
                            </span>
                          )}
                        </div>
                        
                        {/* Editor Feedback Banner (If Changes Requested) */}
                        {art.status === 'Changes Requested' && art.editorFeedback && (
                          <div style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            marginTop: '6px',
                            fontSize: '0.775rem',
                            color: '#f87171'
                          }}>
                            <strong>💬 Editor Notes:</strong> "{art.editorFeedback}"
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td>
                        <span className="btn btn-sm btn-secondary" style={{ pointerEvents: 'none', fontSize: '0.725rem' }}>
                          {art.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td style={{ fontWeight: 500 }}>{art.author}</td>

                      {/* Assigned Editor Column (With Super Admin Assign Popover) */}
                      <td>
                        {(() => {
                          // Check if assigned editor account still exists in active adminUsers
                          const isEditorStillValid = art.assignedEditorName && adminUsers.some(u => 
                            u.roleId === 'editor' && (
                              u.id === art.assignedEditorId || 
                              u.name.toLowerCase().trim() === art.assignedEditorName.toLowerCase().trim() ||
                              u.email.toLowerCase().trim() === art.assignedEditorName.toLowerCase().trim() ||
                              u.email.split('@')[0].toLowerCase().trim() === art.assignedEditorName.toLowerCase().trim()
                            )
                          );
                          const activeEditorName = isEditorStillValid ? art.assignedEditorName : null;

                          return (
                            <div style={{ position: 'relative' }}>
                              {activeEditorName ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <span className="badge badge-editor" style={{ fontSize: '0.725rem' }}>
                                    👤 {activeEditorName}
                                  </span>
                                  {isSuperAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => setActiveAssignPopoverId(activeAssignPopoverId === art.id ? null : art.id)}
                                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                                      title="Change or Remove Assigned Editor"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  Unassigned
                                </span>
                              )}

                              {/* Super Admin Assign Editor Popover Button */}
                              {isSuperAdmin && !activeEditorName && (
                                <button
                                  type="button"
                                  onClick={() => setActiveAssignPopoverId(activeAssignPopoverId === art.id ? null : art.id)}
                                  className="btn btn-sm btn-secondary"
                                  style={{ marginLeft: '6px', padding: '2px 8px', fontSize: '0.725rem', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}
                                  title="Assign Editor"
                                >
                                  <UserPlus size={12} /> Assign
                                </button>
                              )}

                              {/* Assign Editor Floating Menu Panel */}
                              {isSuperAdmin && activeAssignPopoverId === art.id && (
                                <div 
                                  ref={assignPopoverRef}
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    marginTop: '4px',
                                    width: '220px',
                                    background: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.75)',
                                    padding: '8px 0',
                                    zIndex: 9999
                                  }}
                                >
                                  <div style={{ padding: '4px 12px', fontSize: '10px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Assign Editor
                                  </div>

                                  {activeEditorName && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        assignEditorToArticle(art.id, null, null);
                                        setActiveAssignPopoverId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '6px 12px',
                                        textAlign: 'left',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        color: '#ef4444',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      🚫 Unassign (Remove Editor)
                                    </button>
                                  )}
                                  
                                  {availableEditors.length === 0 ? (
                                    <div style={{ padding: '8px 12px', fontSize: '12px', color: '#94a3b8' }}>
                                      No active Editors found. Create one in Admin Staff Control.
                                    </div>
                                  ) : (
                                    availableEditors.map(editorUser => (
                                      <button
                                        key={editorUser.id}
                                        type="button"
                                        onClick={() => {
                                          assignEditorToArticle(art.id, editorUser.id, editorUser.name);
                                          setActiveAssignPopoverId(null);
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: '6px 12px',
                                          textAlign: 'left',
                                          background: 'transparent',
                                          border: 'none',
                                          color: '#f8fafc',
                                          fontSize: '12px',
                                          fontWeight: 600,
                                          cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                      >
                                        👤 {editorUser.name} ({editorUser.email})
                                      </button>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status */}
                      <td>
                        {getStatusBadge(art.status)}
                      </td>

                      {/* Action Buttons: Author, Editor and Super Admin */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
                          {/* Edit Action Button */}
                          <button
                            className="btn btn-sm btn-secondary"
                            title={isEditor ? "Review & Polish Article Quality" : "Edit Article"}
                            onClick={() => handleEdit(art)}
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Publish Action: Content Admin, Editor, and Super Admin */}
                          {art.status !== 'Published' ? (
                            <button
                              className="btn btn-sm btn-primary"
                              title="Publish Article Live to Daily Brief"
                              onClick={() => toggleArticleStatus(art.id, 'Published')}
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#ffffff',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '0.725rem',
                                padding: '4px 10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <CheckCircle size={13} color="#ffffff" />
                              Publish
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-secondary"
                              title="Unpublish / Archive Article"
                              onClick={() => toggleArticleStatus(art.id, 'Archived')}
                              style={{ fontSize: '0.725rem', padding: '4px 8px' }}
                            >
                              <Archive size={13} />
                              Unpublish
                            </button>
                          )}

                          {/* Delete Action: Editors CANNOT delete published articles */}
                          {(!isEditor || art.status !== 'Published') && (
                            <button
                              className="btn btn-sm btn-danger"
                              title="Remove Article"
                              onClick={() => deleteArticle(art.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Aware Article Editor Modal */}
      <ArticleEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articleToEdit={selectedArticle}
      />
    </div>
  );
}

