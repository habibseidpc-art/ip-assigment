import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    farmerId: '',
    phoneNumber: '',
    location: '',
    farmType: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const user = await register(submitData);

      // Redirect based on role
      navigate(user.role === 'farmer' ? '/farmer' : '/officer');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🌾</span>
          <h1>Crop Advisory System</h1>
          <p>Agricultural Extension Platform</p>
        </div>

        <h2>Create Account</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. 0912345678"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Farmer ID</label>
              <input
                type="text"
                name="farmerId"
                placeholder="Optional farmer ID"
                value={formData.farmerId}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                placeholder="Region / Woreda"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Farm Type</label>
              <select name="farmType" value={formData.farmType} onChange={handleChange}>
                <option value="">Select farm type</option>
                <option value="Crop Farming">Crop Farming</option>
                <option value="Livestock">Livestock</option>
                <option value="Mixed Farming">Mixed Farming</option>
                <option value="Horticulture">Horticulture</option>
                <option value="Poultry">Poultry</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="farmer">🧑‍🌾 Farmer</option>
                <option value="officer">👨‍💼 Extension Officer</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
