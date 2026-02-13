import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, FaBrain, FaChartLine, FaCode, 
  FaChartBar, FaFilePdf, FaTimes, FaInfoCircle
} from 'react-icons/fa';

const features = [
  { 
    icon: <FaGithub />, 
    title: 'GitHub Integration', 
    description: 'Import your repositories and showcase your coding activity. Shows real code to recruiters.',
    color: '#24292e', 
    stats: '9+ repos analyzed',
    working: true,
    howItWorks: [
      '🔗 Connect your GitHub username',
      '📦 We fetch your public repositories automatically',
      '📊 Your repos, stars, and languages are displayed',
      '✅ Recruiters can see your real code quality',
      '📈 Your GitHub activity boosts your ATS score'
    ]
  },
  { 
    icon: <FaBrain />, 
    title: 'ATS Checklist', 
    description: '25-point comprehensive checklist to optimize your resume for ATS systems.',
    color: '#6366f1', 
    stats: 'Pass/Fail per section',
    working: true,
    howItWorks: [
      '📋 We scan your resume for 25 critical points',
      '📞 Contact info verification (email, phone, LinkedIn)',
      '📑 Section detection (education, experience, projects)',
      '📊 Content quality (action verbs, quantified results)',
      '✅ Get pass/fail results with improvement tips'
    ]
  },
  { 
    icon: <FaChartLine />, 
    title: 'Job Match Score', 
    description: 'Compare your resume with job descriptions. See match percentage and missing skills.',
    color: '#10b981', 
    stats: '0-100% match',
    working: true,
    howItWorks: [
      '📝 Paste any job description',
      '🔍 We extract key skills from the job posting',
      '⚖️ Compare with skills found in your resume',
      '📊 Get a match percentage score',
      '🎯 See exactly which skills you need to add'
    ]
  },
  { 
    icon: <FaCode />, 
    title: 'Skill Gap Analyzer', 
    description: 'Find exactly what skills you need for your target role with personalized recommendations.',
    color: '#f59e0b', 
    stats: '50+ skills mapped',
    working: true,
    howItWorks: [
      '🔍 Analyzes your resume against job requirements',
      '📊 Identifies skills present vs missing',
      '🎯 Shows prioritized skills to learn',
      '📚 Recommends free learning resources',
      '📈 Track your skill improvement over time'
    ]
  },
  { 
    icon: <FaChartBar />, 
    title: 'Dashboard Analytics', 
    description: 'Track your resume score progress over time with interactive charts and statistics.',
    color: '#8b5cf6', 
    stats: '7+ data points',
    working: true,
    howItWorks: [
      '📊 Visualizes your resume score history',
      '📈 Track improvement over weeks/months',
      '🎯 Compare with job match percentages',
      '📉 Identify weak areas needing attention',
      '🏆 See your progress with interactive charts'
    ]
  },
  { 
    icon: <FaFilePdf />, 
    title: 'PDF Export', 
    description: 'Download detailed reports of your resume analysis to share with recruiters.',
    color: '#ef4444', 
    stats: 'Downloadable reports',
    working: true,  // Changed from false to true
    howItWorks: [
      '📥 Generate professional PDF reports with one click',
      '📊 Includes ATS score, skills, and checklist results',
      '📝 Add your contact information automatically',
      '📎 Share with recruiters via email or print',
      '💼 Perfect for job applications and interviews'
    ]
  }
];

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const openModal = (feature) => {
    setSelectedFeature(feature);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedFeature(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-badge">WHY CHOOSE HIREUP</span>
            <h2 className="section-title">
              Everything You Need to{' '}
              <span className="gradient-text">Get Hired</span>
            </h2>
            <p className="section-subtitle">
              Click on any feature to learn how it works
            </p>
          </motion.div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => openModal(feature)}
            >
              <div className="feature-card-inner">
                <div className="feature-icon-wrapper" style={{ backgroundColor: `${feature.color}15` }}>
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-footer">
                  <div className="feature-stats">
                    <span className="stats-badge">{feature.stats}</span>
                  </div>
                  <FaInfoCircle className="info-icon" style={{ color: feature.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
              
              <div className="modal-header" style={{ color: selectedFeature.color }}>
                <div className="modal-icon-wrapper" style={{ backgroundColor: `${selectedFeature.color}15` }}>
                  <div className="modal-icon" style={{ color: selectedFeature.color }}>
                    {selectedFeature.icon}
                  </div>
                </div>
                <h2>{selectedFeature.title}</h2>
              </div>

              <div className="modal-body">
                <p className="modal-description" style={{ borderLeftColor: selectedFeature.color }}>
                  {selectedFeature.description}
                </p>
                
                <h3>✨ How It Works</h3>
                <ul className="how-it-works-list">
                  {selectedFeature.howItWorks.map((step, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ borderLeftColor: selectedFeature.color }}
                    >
                      {step}
                    </motion.li>
                  ))}
                </ul>

                <div className="modal-stats">
                  <span className="stats-label">Current Status:</span>
                  <span className="stats-value" style={{ color: selectedFeature.color }}>
                    {selectedFeature.stats}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Features;
