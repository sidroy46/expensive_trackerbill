import React from 'react';
import { CreditCard, Coffee, Plane, Home, Box, Trash2, Edit } from 'lucide-react';

const categoryIcons = {
  Food: <Coffee size={24} />,
  Travel: <Plane size={24} />,
  Utilities: <Home size={24} />,
  Entertainment: <CreditCard size={24} />,
  Other: <Box size={24} />
};

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (expenses.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No expenses found. Upload a bill or add one manually!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense._id} className="glass-panel expense-item">
          <div className="expense-details">
            <div className="expense-icon">
              {categoryIcons[expense.category] || <Box size={24} />}
            </div>
            <div className="expense-info">
              <h3>{expense.vendorName}</h3>
              <p>
                {new Date(expense.date).toLocaleDateString()} &bull; {expense.category} &bull; {expense.paymentMethod}
              </p>
            </div>
          </div>
          
          <div className="expense-meta">
            <span className="expense-amount">${expense.totalAmount.toFixed(2)}</span>
            <span className="badge" style={{ 
              background: expense.expenseType === 'Business' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: expense.expenseType === 'Business' ? '#818cf8' : '#34d399'
            }}>
              {expense.expenseType}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => onEdit(expense)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => onDelete(expense._id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
