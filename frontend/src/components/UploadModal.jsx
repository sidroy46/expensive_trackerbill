import React, { useState } from 'react';
import { UploadCloud, X, Loader } from 'lucide-react';
import api from '../api';
import ExpenseForm from './ExpenseForm';

const UploadModal = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/expenses/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedData(response.data);
    } catch (error) {
      console.error('Extraction failed', error);
      alert('Failed to extract data. You can enter manually or try another image.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await api.post('/expenses', data);
      onSave(response.data);
      resetModal();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save expense');
    } finally {
      setIsSaving(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setExtractedData(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <div className="modal-header">
          <h2>{extractedData ? 'Review Extracted Details' : 'Upload Bill/Receipt'}</h2>
          <button className="close-btn" onClick={resetModal}><X size={24} /></button>
        </div>

        {!extractedData ? (
          <div>
            <div className="upload-area">
              <input 
                type="file" 
                id="file-upload" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <UploadCloud className="upload-icon" style={{ margin: '0 auto' }} />
                <h3 style={{ marginTop: '1rem' }}>{file ? file.name : 'Click or drag image here to upload'}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>PNG, JPG up to 10MB</p>
              </label>
            </div>
            
            <div className="form-actions">
              <button className="glass-button secondary" onClick={resetModal}>Cancel</button>
              <button 
                className="glass-button" 
                onClick={handleExtract} 
                disabled={!file || isExtracting}
              >
                {isExtracting ? <><Loader className="animate-spin" size={18} /> Extracting...</> : 'Extract Details'}
              </button>
            </div>
          </div>
        ) : (
          <ExpenseForm 
            initialData={extractedData} 
            onSubmit={handleSave} 
            onCancel={() => setExtractedData(null)}
            isLoading={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default UploadModal;
