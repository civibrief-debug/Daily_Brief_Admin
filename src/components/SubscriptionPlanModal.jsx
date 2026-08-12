"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAdmin } from '../context/AdminContext';

export default function SubscriptionPlanModal({ isOpen, onClose, planToEdit = null }) {
  const { addPlan, updatePlan } = useAdmin();

  const [formData, setFormData] = useState({
    name: '',
    price: '$9.99',
    billingCycle: 'Monthly',
    status: 'Active',
    features: ''
  });

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        ...planToEdit,
        features: Array.isArray(planToEdit.features) ? planToEdit.features.join('\n') : planToEdit.features
      });
    } else {
      setFormData({
        name: '',
        price: '$14.99',
        billingCycle: 'Monthly',
        status: 'Active',
        features: 'Unlimited articles\nAd-free experience\nPodcast audio access'
      });
    }
  }, [planToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const featureList = formData.features.split('\n').filter(f => f.trim().length > 0);

    const payload = {
      ...formData,
      features: featureList
    };

    if (planToEdit) {
      updatePlan(payload);
    } else {
      addPlan(payload);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={planToEdit ? "Edit Subscription Tier" : "Create New Subscription Plan"}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Digital Basic, Executive Pass"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Pricing Rate</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. $9.99 or $199.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Billing Frequency</label>
              <select
                className="form-control"
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
                <option value="Quarterly">Quarterly</option>
                <option value="One-Time">One-Time Access</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Included Features (One feature per line)</label>
            <textarea
              className="form-control"
              style={{ minHeight: '120px' }}
              placeholder="Unlimited news reading&#10;Audio player access&#10;Weekly digest PDF"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-gold">
            {planToEdit ? "Save Tier Changes" : "Create Plan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
