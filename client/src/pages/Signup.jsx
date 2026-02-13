import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // THIS PREVENTS PAGE RELOAD
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      const result = await register({ name, email, password });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-pattern"></div>
      <div className="container">
        <div className="auth-grid">
          {/* Left Column - Branding */}
          <div className="auth-brand">
            <div className="brand-content">
              <div className="brand-icon">🎯</div>
              <h1 className="brand-title">Hireup</h1>
              <p className="brand-tagline">Your AI Career Assistant</p>
              <div className="brand-stats">
                <div className="stat">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Active Users</span>
                </div>
                <div className="stat">
                  <span className="stat-number">350+</span>
                  <span className="stat-label">Resumes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">94%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="auth-form-container">
            <div className="auth-form-card">
              <div className="auth-header">
                <h2>Create Free Account</h2>
                <p>Join 150+ students getting hired with Hireup</p>
              </div>

              {error && (
                <div className="auth-error">
                  <span>❌</span>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>
                    <FaUser /> Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaLock /> Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <span className="input-hint">Minimum 6 characters</span>
                </div>

                <div className="form-group">
                  <label>
                    <FaLock /> Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-terms">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>
                      I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
                      <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                  <FaArrowRight />
                </button>

                <div className="auth-divider">
                  <span>or sign up with</span>
                </div>

                <div className="social-login">
                  <button type="button" className="social-btn google">
                    Google
                  </button>
                  <button type="button" className="social-btn github">
                    GitHub
                  </button>
                </div>
              </form>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
