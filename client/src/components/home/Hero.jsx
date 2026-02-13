import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaArrowRight, FaFileAlt, FaChartLine, FaUserCircle } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-pattern"></div>
      <div className="container">
        <div className="hero-grid">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <span className="badge-pill">
                <span className="badge-icon">🎯</span>
                GitHub-Powered Resume Checker
              </span>
            </div>
            
            <h1 className="hero-title">
              Get Your Resume{' '}
              <span className="gradient-text">Hireup Ready</span>
            </h1>
            
            <p className="hero-subtitle">
              The only resume checker that analyzes your{' '}
              <strong>GitHub profile</strong>, matches with{' '}
              <strong>real jobs</strong>, and gives you a{' '}
              <strong>25-point ATS checklist</strong> —{' '}
              <span className="highlight">free forever</span>.
            </p>
            
            <div className="hero-cta">
              <Link to="/checker" className="btn btn-primary btn-large">
                Check Your Resume Free
                <FaArrowRight className="icon" />
              </Link>
              <Link to="/github" className="btn btn-outline btn-large">
                <FaGithub className="icon" />
                Connect GitHub
              </Link>
            </div>
            
            <div className="hero-social-proof">
              <div className="avatar-group">
                <div className="avatar-placeholder"><FaUserCircle /></div>
                <div className="avatar-placeholder"><FaUserCircle /></div>
                <div className="avatar-placeholder"><FaUserCircle /></div>
                <div className="avatar-placeholder"><FaUserCircle /></div>
                <div className="avatar-count">100+</div>
              </div>
              <p>
                <span className="bold">Trusted by students</span> from universities across India
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero-dashboard">
              <div className="dashboard-card main-card">
                <div className="card-header">
                  <FaFileAlt className="card-icon" />
                  <span>Resume Score</span>
                </div>
                <div className="card-score">
                  <span className="score-number">86</span>
                  <span className="score-unit">%</span>
                </div>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '86%' }}></div>
                  </div>
                </div>
                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-label">ATS Match</span>
                    <span className="stat-value">92%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">GitHub</span>
                    <span className="stat-value">24 repos</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card floating-card card-1">
                <FaGithub className="card-icon" />
                <div className="card-content">
                  <span className="card-title">GitHub Imported</span>
                  <span className="card-subtitle">24 public repos • 8 languages</span>
                </div>
              </div>

              <div className="dashboard-card floating-card card-2">
                <FaChartLine className="card-icon" />
                <div className="card-content">
                  <span className="card-title">ATS Checklist</span>
                  <span className="card-subtitle">18/25 checks passed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
