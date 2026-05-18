import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    date: new Date().toISOString().split('T')[0],
    totalAmount: '',
    category: 'Food',
    paymentMethod: 'Cash',
    expenseType: 'Personal'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalAmount: Number(formData.totalAmount)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Vendor Name</label>
        <input type="text" className="glass-input" name="vendorName" value={formData.vendorName} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label>Date</label>
        <input type="date" className="glass-input" name="date" value={formData.date} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label>Total Amount ($)</label>
        <input type="number" step="0.01" className="glass-input" name="totalAmount" value={formData.totalAmount} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label>Category</label>
        <select className="glass-input" name="category" value={formData.category} onChange={handleChange} required>
          <option value="Food" style={{color: 'black'}}>Food</option>
          <option value="Travel" style={{color: 'black'}}>Travel</option>
          <option value="Utilities" style={{color: 'black'}}>Utilities</option>
          <option value="Entertainment" style={{color: 'black'}}>Entertainment</option>
          <option value="Other" style={{color: 'black'}}>Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Payment Method</label>
        <select className="glass-input" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
          <option value="Cash" style={{color: 'black'}}>Cash</option>
          <option value="Credit Card" style={{color: 'black'}}>Credit Card</option>
          <option value="Debit Card" style={{color: 'black'}}>Debit Card</option>
          <option value="UPI" style={{color: 'black'}}>UPI</option>
          <option value="Other" style={{color: 'black'}}>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Expense Type</label>
        <select className="glass-input" name="expenseType" value={formData.expenseType} onChange={handleChange} required>
          <option value="Personal" style={{color: 'black'}}>Personal</option>
          <option value="Business" style={{color: 'black'}}>Business</option>
        </select>
      </div>

      <div className="form-actions">
        {onCancel && <button type="button" className="glass-button secondary" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="glass-button" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
