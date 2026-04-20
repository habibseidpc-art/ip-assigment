import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const officerNav = [
  { path: '/officer', icon: '📊', label: 'Dashboard' },
  { path: '/officer/requests', icon: '📋', label: 'All Requests' },
];

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showAdviseModal, setShowAdviseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adviceForm, setAdviceForm] = useState({
    advice: '',
    fertilizerRecommendation: '',
    pestControlTips: '',
    alertDate: '',
  });
  const [adviceError, setAdviceError] = useState('');
  const [adviceSuccess, setAdviceSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async (status = '') => {
    setLoading(true);
    try {
      const params = status ? `?status=${status}` : '';
      const res = await axios.get(`/api/requests${params}`);
      setRequests(res.data.requests);
      setFiltered(res.data.requests);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(statusFilter);
  }, [statusFilter]);

  const openAdviseModal = (request) => {
    setSelectedRequest(request);
    setAdviceForm({
      advice: request.advice || '',
      fertilizerRecommendation: request.fertilizerRecommendation || '',
      pestControlTips: request.pestControlTips || '',
      alertDate: request.alertDate
        ? new Date(request.alertDate).toISOString().split('T')[0]
        : '',
    });
    setAdviceError('');
    setAdviceSuccess('');
    setShowAdviseModal(true);
  };

  const handleAdviceChange = (e) => {
    setAdviceForm({ ...adviceForm, [e.target.name]: e.target.value });
    setAdviceError('');
  };

  const handleSubmitAdvice = async (e) => {
    e.preventDefault();
    if (!adviceForm.advice.trim()) {
      return setAdviceError('Please provide advice before submitting');
    }

    setSubmitting(true);
    try {
      await axios.put(`/api/requests/${selectedRequest._id}/advise`, adviceForm);
      setAdviceSuccess('Advice submitted successfully!');
      fetchRequests(statusFilter);
      setTimeout(() => setShowAdviseModal(false), 1500);
    } catch (err) {
      setAdviceError(err.response?.data?.message || 'Failed to submit advice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/requests/${requestId}/status`, { status: newStatus });
      fetchRequests(statusFilter);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getBadgeClass = (status) => {
    if (status === 'Pending') return 'badge-pending';
    if (status === 'In Progress') return 'badge-inprogress';
    return 'badge-solved';
  };

  return (
    <div className="layout">
      <Sidebar navItems={officerNav} />
      <main className="main-content">
        <div className="page-header">
          <h1>All Farmer Requests</h1>
          <p>Review, advise, and manage all submitted farming problems</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>📋 Requests ({filtered.length})</h2>
            <div className="filter-bar" style={{ margin: 0 }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div> Loading requests...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No requests found</h3>
              <p>
                {statusFilter
                  ? `No requests with status "${statusFilter}"`
                  : 'No farmer requests submitted yet'}
              </p>
            </div>
          ) : (
            filtered.map((req) => (
              <div
                key={req._id}
                className={`request-card ${
                  req.status === 'Pending'
                    ? 'pending'
                    : req.status === 'In Progress'
                    ? 'in-progress'
                    : 'solved'
                }`}
              >
                <div className="request-card-header">
                  <div>
                    <h3>🌿 {req.cropType}</h3>
                    <div className="request-meta" style={{ marginTop: 4 }}>
                      <span>👤 {req.farmer?.fullName}</span>
                      <span>📍 {req.farmer?.location}</span>
                      <span>📏 {req.farmSize}</span>
                      <span>📅 {new Date(req.requestDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`badge ${getBadgeClass(req.status)}`}>{req.status}</span>
                </div>

                <p className="request-description">{req.problemDescription}</p>

                {req.advice && (
                  <div className="advice-section">
                    <h4>💡 Advice Given</h4>
                    <p><strong>Advice:</strong> {req.advice}</p>
                    {req.fertilizerRecommendation && (
                      <p><strong>Fertilizer:</strong> {req.fertilizerRecommendation}</p>
                    )}
                    {req.pestControlTips && (
                      <p><strong>Pest Control:</strong> {req.pestControlTips}</p>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => openAdviseModal(req)}
                  >
                    💡 {req.advice ? 'Update Advice' : 'Give Advice'}
                  </button>

                  {req.status !== 'Solved' && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleStatusChange(req._id, 'Solved')}
                    >
                      ✅ Mark Solved
                    </button>
                  )}

                  {req.status === 'Pending' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStatusChange(req._id, 'In Progress')}
                    >
                      🔄 Mark In Progress
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Advise Modal */}
      {showAdviseModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowAdviseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💡 Provide Advisory</h2>
              <button className="modal-close" onClick={() => setShowAdviseModal(false)}>
                ×
              </button>
            </div>

            <div style={{
              background: '#f7fafc',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: 14,
              color: '#4a5568'
            }}>
              <strong>Farmer:</strong> {selectedRequest.farmer?.fullName} &nbsp;|&nbsp;
              <strong>Crop:</strong> {selectedRequest.cropType} &nbsp;|&nbsp;
              <strong>Farm Size:</strong> {selectedRequest.farmSize}
            </div>

            {adviceError && <div className="alert alert-error">{adviceError}</div>}
            {adviceSuccess && <div className="alert alert-success">{adviceSuccess}</div>}

            <form onSubmit={handleSubmitAdvice}>
              <div className="form-group">
                <label>Advice / Recommendation *</label>
                <textarea
                  name="advice"
                  placeholder="Provide detailed advice for the farmer..."
                  value={adviceForm.advice}
                  onChange={handleAdviceChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fertilizer Recommendation</label>
                <textarea
                  name="fertilizerRecommendation"
                  placeholder="Recommend fertilizers and application methods..."
                  value={adviceForm.fertilizerRecommendation}
                  onChange={handleAdviceChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Pest Control Tips</label>
                <textarea
                  name="pestControlTips"
                  placeholder="Suggest pest control measures..."
                  value={adviceForm.pestControlTips}
                  onChange={handleAdviceChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Follow-up Alert Date</label>
                <input
                  type="date"
                  name="alertDate"
                  value={adviceForm.alertDate}
                  onChange={handleAdviceChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                      Submitting...
                    </>
                  ) : (
                    '📤 Submit Advice'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAdviseModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRequests;
