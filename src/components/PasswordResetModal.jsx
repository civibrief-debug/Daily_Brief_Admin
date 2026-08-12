"use client";

import React, { useState } from 'react';
import Modal from './Modal';
import { useAdmin } from '../context/AdminContext';
import { KeyRound, Copy, Check } from 'lucide-react';

export default function PasswordResetModal({ isOpen, onClose, targetUserEmail = "" }) {
  const { resetUserPassword } = useAdmin();
  const [email, setEmail] = useState(targetUserEmail);
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) return;
    const generated = resetUserPassword(email);
    setTempPassword(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTempPassword("");
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset User Password (Support Admin)">
      <form onSubmit={handleReset}>
        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Generate an authenticated emergency one-time password override for users experiencing login issues.
          </p>

          <div className="form-group">
            <label>Subscriber Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {tempPassword && (
            <div style={{
              marginTop: '1.5rem',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px dashed #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <KeyRound size={14} /> Temporary One-Time Key Generated
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--brand-gold)' }}>
                  {tempPassword}
                </span>
                <button type="button" className="btn btn-sm btn-secondary" onClick={handleCopy}>
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy Key"}</span>
                </button>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Valid for 60 minutes. Transmit securely to user upon verification.
              </span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          {!tempPassword && (
            <button type="submit" className="btn btn-gold">
              Generate Reset Key
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
