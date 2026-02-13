import { motion } from 'framer-motion';
import { FaFileAlt, FaGithub, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <FaFileAlt />,
    title: '1. Upload Your Resume',
    description: 'Drag & drop your PDF or DOCX. We support both formats.',
    color: '#2563eb',
    details: 'Parses text with 99% accuracy'
  },
  {
    icon: <FaGithub />,
    title: '2. Connect GitHub',
    description: 'Import your projects, languages, and contributions.',
    color: '#24292e',
    details: 'Shows real code to recruiters'
  },
  {
    icon: <FaRocket />,
    title: '3. Get Your Score',
    description: 'Receive 25-point ATS checklist and improvement tips.',
    color: '#10b981',
    details: 'Takes less than 30 seconds'
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">SIMPLE PROCESS</span>
            <h2 className="section-title">
              Get Hireup Ready in{' '}
              <span className="gradient-text">30 Seconds</span>
            </h2>
            <p className="section-subtitle">
              Three simple steps to a resume that actually gets you interviews.
            </p>
          </motion.div>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="step-icon-wrapper">
                <div className="step-icon-bg" style={{ background: `${step.color}15` }}>
                  <div className="step-icon" style={{ color: step.color }}>
                    {step.icon}
                  </div>
                </div>
                {index < steps.length - 1 && <div className="step-connector" />}
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <span className="step-details">{step.details}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="how-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/checker" className="btn btn-primary btn-large">
            Try It Free Now
            <FaRocket className="icon" />
          </Link>
          <p className="cta-note">No credit card required. Forever free for students.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
