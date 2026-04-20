import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const farmerNav = [
  { path: '/farmer', icon: '🏠', label: 'Dashboard' },
  { path: '/farmer/submit', icon: '📝', label: 'Submit Request' },
  { path: '/farmer/requests', icon: '📋', label: 'My Requests' },
];

const SubmitRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropType: '',
    problemDescription: '',
    farmSize: '',
    requestDate: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/api/requests', formData);
      setSuccess('Your request has been submitted successfully! An extension officer will review it soon.');
      setFormData({
        cropType: '',
        problemDescription: '',
        farmSize: '',
        requestDate: new Date().toISOString().split('T')[0],
      });

      // Redirect to requests list after 2 seconds
      setTimeout(() => navigate('/farmer/requests'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar navItems={farmerNav} />
      <main className="main-content">
        <div className="page-header">
          <h1>Submit Farming Request</h1>
          <p>Describe your farming problem and get expert advice from extension officers</p>
        </div>

        <div className="card" style={{ maxWidth: 640 }}>
          <div className="card-header">
            <h2>📝 New Request</h2>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Crop Type *</label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select crop type</option>
                  <option value="Teff">Teff</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Barley">Barley</option>
                  <option value="Sorghum">Sorghum</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Sesame">Sesame</option>
                  <option value="Chickpea">Chickpea</option>
                  <option value="Haricot Bean">Haricot Bean</option>
                  <option value="Potato">Potato</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Farm Size *</label>
                <input
                  type="text"
                  name="farmSize"
                  placeholder="e.g. 2 hectares"
                  value={formData.farmSize}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Request Date *</label>
              <input
                type="date"
                name="requestDate"
                value={formData.requestDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Problem Description *</label>
              <textarea
                name="problemDescription"
                placeholder="Describe your farming problem in detail. Include symptoms, when it started, and any steps you've already taken..."
                value={formData.problemDescription}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                    Submitting...
                  </>
                ) : (
                  '📤 Submit Request'
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/farmer')}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubmitRequest;
