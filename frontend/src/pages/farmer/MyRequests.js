import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { RequestCard } from './FarmerDashboard';

const farmerNav = [
  { path: '/farmer', icon: '🏠', label: 'Dashboard' },
  { path: '/farmer/submit', icon: '📝', label: 'Submit Request' },
  { path: '/farmer/requests', icon: '📋', label: 'My Requests' },
];

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/api/requests/my');
        setRequests(res.data.requests);
        setFiltered(res.data.requests);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFiltered(requests.filter((r) => r.status === statusFilter));
    } else {
      setFiltered(requests);
    }
  }, [statusFilter, requests]);

  return (
    <div className="layout">
      <Sidebar navItems={farmerNav} />
      <main className="main-content">
        <div className="page-header">
          <h1>My Requests</h1>
          <p>Track all your submitted farming problems and advice received</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>📋 Request History ({filtered.length})</h2>
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
              <div className="spinner"></div> Loading your requests...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🌱</span>
              <h3>No requests found</h3>
              <p>
                {statusFilter
                  ? `No requests with status "${statusFilter}"`
                  : 'You have not submitted any requests yet'}
              </p>
            </div>
          ) : (
            filtered.map((req) => <RequestCard key={req._id} request={req} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRequests;
