import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Sidebar from '../../components/Sidebar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const officerNav = [
  { path: '/officer', icon: '📊', label: 'Dashboard' },
  { path: '/officer/requests', icon: '📋', label: 'All Requests' },
];

const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/dashboard');
        setStats(res.data.stats);
        setRecentRequests(res.data.recentRequests);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const pieData = {
    labels: ['Pending', 'In Progress', 'Solved'],
    datasets: [
      {
        data: stats
          ? [stats.pendingRequests, stats.inProgressRequests, stats.solvedCases]
          : [0, 0, 0],
        backgroundColor: ['#d69e2e', '#3182ce', '#2d8a4e'],
        borderColor: ['#b7791f', '#2b6cb0', '#276749'],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Total Farmers', 'Total Requests', 'Active', 'Solved'],
    datasets: [
      {
        label: 'Count',
        data: stats
          ? [stats.totalFarmers, stats.totalRequests, stats.activeRequests, stats.solvedCases]
          : [0, 0, 0, 0],
        backgroundColor: ['#2d8a4e', '#3182ce', '#d69e2e', '#276749'],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar navItems={officerNav} />
        <main className="main-content">
          <div className="loading">
            <div className="spinner"></div> Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar navItems={officerNav} />
      <main className="main-content">
        <div className="page-header">
          <h1>Analytics Dashboard</h1>
          <p>Overview of all farming requests and system statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon">🧑‍🌾</div>
            <div className="stat-info">
              <h3>{stats?.totalFarmers || 0}</h3>
              <p>Total Farmers</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{stats?.totalRequests || 0}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{stats?.activeRequests || 0}</h3>
              <p>Active Requests</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats?.solvedCases || 0}</h3>
              <p>Solved Cases</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h2>Request Status Distribution</h2>
            </div>
            <div className="chart-container">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>System Overview</h2>
            </div>
            <div className="chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Requests</h2>
          </div>
          {recentRequests.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No requests yet</h3>
              <p>Farmer requests will appear here</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Farmer</th>
                    <th>Crop Type</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req._id}>
                      <td>{req.farmer?.fullName || 'N/A'}</td>
                      <td>🌿 {req.cropType}</td>
                      <td>📍 {req.farmer?.location || 'N/A'}</td>
                      <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            req.status === 'Pending'
                              ? 'badge-pending'
                              : req.status === 'In Progress'
                              ? 'badge-inprogress'
                              : 'badge-solved'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;
