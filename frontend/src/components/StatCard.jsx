import React from 'react';

const StatCard = ({ title, amount, icon: Icon, colorClass }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="expense-icon" style={{ background: `var(--${colorClass})`, color: 'white', opacity: 0.9 }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>${amount.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default StatCard;
