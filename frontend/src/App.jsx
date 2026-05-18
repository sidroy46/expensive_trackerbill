import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Search, X } from 'lucide-react';
import api from './api';
import StatCard from './components/StatCard';
import ExpenseList from './components/ExpenseList';
import UploadModal from './components/UploadModal';
import ExpenseForm from './components/ExpenseForm';
import './index.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
  const businessExpenses = expenses.filter(e => e.expenseType === 'Business').reduce((sum, exp) => sum + exp.totalAmount, 0);
  const personalExpenses = expenses.filter(e => e.expenseType === 'Personal').reduce((sum, exp) => sum + exp.totalAmount, 0);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses', {
        params: { category: categoryFilter, search: searchTerm }
      });
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(e => e._id !== id));
      } catch (error) {
        console.error('Failed to delete expense', error);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const res = await api.put(`/expenses/${editingExpense._id}`, updatedData);
      setExpenses(expenses.map(e => e._id === res.data._id ? res.data : e));
      setEditingExpense(null);
    } catch (error) {
      console.error('Failed to update expense', error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>AI Expense Tracker</h1>
        <button className="glass-button" onClick={() => setIsUploadModalOpen(true)}>
          <Plus size={20} /> Add Bill
        </button>
      </header>

      <div className="stats-grid">
        <StatCard title="Total Expenses" amount={totalExpenses} icon={DollarSign} colorClass="primary" />
        <StatCard title="Business" amount={businessExpenses} icon={TrendingUp} colorClass="secondary" />
        <StatCard title="Personal" amount={personalExpenses} icon={TrendingDown} colorClass="success" />
      </div>

      <div className="main-content">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="expense-filters">
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Search vendors..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <select 
              className="glass-input" 
              style={{ width: '200px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All" style={{color: 'black'}}>All Categories</option>
              <option value="Food" style={{color: 'black'}}>Food</option>
              <option value="Travel" style={{color: 'black'}}>Travel</option>
              <option value="Utilities" style={{color: 'black'}}>Utilities</option>
              <option value="Entertainment" style={{color: 'black'}}>Entertainment</option>
              <option value="Other" style={{color: 'black'}}>Other</option>
            </select>
          </div>

          <ExpenseList 
            expenses={expenses} 
            onDelete={handleDelete} 
            onEdit={handleEdit}
          />
        </div>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSave={(newExpense) => {
          setExpenses([newExpense, ...expenses]);
        }}
      />

      {editingExpense && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2>Edit Expense</h2>
              <button className="close-btn" onClick={() => setEditingExpense(null)}><X size={24} /></button>
            </div>
            <ExpenseForm 
              initialData={editingExpense} 
              onSubmit={handleUpdate} 
              onCancel={() => setEditingExpense(null)}
              isLoading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
