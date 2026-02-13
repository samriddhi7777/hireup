import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGithub } from 'react-icons/fa';

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <motion.div 
          className="cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-pattern"></div>
          <div className="cta-content">
            <div className="cta-badge">
              <span className="badge-pulse">FREE FOREVER</span>
            </div>
            
            <h2 className="cta-title">
              Ready to Get Your Resume{' '}
              <span className="gradient-text">Hireup Ready?</span>
            </h2>
            
            <p className="cta-subtitle">
              Join hundreds of students who are already using Hireup to land interviews.
            </p>

            <div className="cta-buttons">
              <Link to="/checker" className="btn btn-primary btn-large">
                Check Your Resume Free
                <FaArrowRight className="icon" />
              </Link>
              <Link to="/github" className="btn btn-outline-light btn-large">
                <FaGithub className="icon" />
                Connect GitHub
              </Link>
            </div>

            <div className="cta-guarantee">
              <p>No credit card required. 100% free. Your data is encrypted.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
