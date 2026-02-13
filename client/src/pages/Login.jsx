import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaGithub, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-pattern"></div>
      <div className="container">
        <div className="auth-grid">
          <motion.div 
            className="auth-brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="brand-content">
              <div className="brand-icon">🎯</div>
              <h1 className="brand-title">Hireup</h1>
              <p className="brand-tagline">Your AI Career Assistant</p>
              <div className="brand-features">
                <div className="feature-item">✅ 25-Point ATS Checklist</div>
                <div className="feature-item">🐙 GitHub Integration</div>
                <div className="feature-item">📊 Job Match Score</div>
                <div className="feature-item">🎓 Free Forever</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="auth-form-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="auth-form-card">
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Log in to continue your job search journey</p>
              </div>

              {error && <div className="auth-error">❌ {error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><FaLock /> Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Log In'} <FaArrowRight />
                </button>

                <div className="auth-divider">or continue with</div>

                <div className="social-login">
                  <button type="button" className="social-btn google"><FaGoogle /> Google</button>
                  <button type="button" className="social-btn github"><FaGithub /> GitHub</button>
                </div>
              </form>

              <div className="auth-footer">
                <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up free</Link></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
