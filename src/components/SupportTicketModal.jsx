"use client";

import React, { useState } from 'react';
import Modal from './Modal';
import { useAdmin } from '../context/AdminContext';

export default function SupportTicketModal({ isOpen, onClose, ticket = null }) {
  const { resolveTicket } = useAdmin();
  const [agentNote, setAgentNote] = useState('');

  if (!ticket) return null;

  const handleResolve = (e) => {
    e.preventDefault();
    resolveTicket(ticket.id, agentNote);
    setAgentNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Support Ticket #${ticket.id}`}>
      <form onSubmit={handleResolve}>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>User Name</span>
              <div style={{ fontWeight: 600 }}>{ticket.userName}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
              <div style={{ fontWeight: 600 }}>{ticket.userEmail}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issue Category</span>
              <div style={{ fontWeight: 600 }}>{ticket.issueType}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority Level</span>
              <div style={{ fontWeight: 700, color: ticket.priority === 'High' ? '#ef4444' : '#f59e0b' }}>
                {ticket.priority}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>User Problem Description</label>
            <div style={{ background: 'var(--bg-surface)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
              {ticket.description}
            </div>
          </div>

          {ticket.agentNotes && ticket.agentNotes.length > 0 && (
            <div className="form-group">
              <label>Existing Support Log Notes</label>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {ticket.agentNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group">
            <label>Add Resolution / Agent Note</label>
            <textarea
              className="form-control"
              placeholder="Record steps taken to resolve this issue..."
              value={agentNote}
              onChange={(e) => setAgentNote(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Mark Ticket as Resolved
          </button>
        </div>
      </form>
    </Modal>
  );
}
