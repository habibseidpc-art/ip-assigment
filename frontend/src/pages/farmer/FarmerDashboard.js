import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

const farmerNav = [
  { path: '/farmer', icon: '🏠', label: 'Dashboard' },
  { path: '/farmer/submit', icon: '📝', label: 'Submit Request' },
  { path: '/farmer/requests', icon: '📋', label: 'My Requests' },
];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/api/requests/my');
        setRequests(res.data.requests);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const pending = requests.filter((r) => r.status === 'Pending').length;
  const inProgress = requests.filter((r) => r.status === 'In Progress').length;
  const solved = requests.filter((r) => r.status === 'Solved').length;

  const recentRequests = requests.slice(0, 3);

  return (
    <div className="layout">
      <Sidebar navItems={farmerNav} />
      <main className="main-content">
        <div className="page-header">
          <h1>Welcome, {user?.fullName} 👋</h1>
          <p>Here's an overview of your farming requests</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{requests.length}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{solved}</h3>
              <p>Solved</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Recent Requests</h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div> Loading...
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🌱</span>
              <h3>No requests yet</h3>
              <p>Submit your first farming problem to get expert advice</p>
            </div>
          ) : (
            recentRequests.map((req) => (
              <RequestCard key={req._id} request={req} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export const RequestCard = ({ request }) => {
  const statusClass = {
    Pending: 'pending',
    'In Progress': 'in-progress',
    Solved: 'solved',
  }[request.status] || 'pending';

  const badgeClass = {
    Pending: 'badge-pending',
    'In Progress': 'badge-inprogress',
    Solved: 'badge-solved',
  }[request.status] || 'badge-pending';

  return (
    <div className={`request-card ${statusClass}`}>
      <div className="request-card-header">
        <h3>🌿 {request.cropType}</h3>
        <span className={`badge ${badgeClass}`}>{request.status}</span>
      </div>
      <div className="request-meta">
        <span>📏 {request.farmSize}</span>
        <span>📅 {new Date(request.requestDate).toLocaleDateString()}</span>
      </div>
      <p className="request-description">{request.problemDescription}</p>

      {request.advice && (
        <div className="advice-section">
          <h4>💡 Expert Advice Received</h4>
          <p><strong>Advice:</strong> {request.advice}</p>
          {request.fertilizerRecommendation && (
            <p><strong>Fertilizer:</strong> {request.fertilizerRecommendation}</p>
          )}
          {request.pestControlTips && (
            <p><strong>Pest Control:</strong> {request.pestControlTips}</p>
          )}
          {request.alertDate && (
            <p><strong>Follow-up Date:</strong> {new Date(request.alertDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
