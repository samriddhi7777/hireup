import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FaUsers, FaFileAlt, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const stats = [
  { 
    value: 150, 
    suffix: '+', 
    label: 'Active Users', 
    sublabel: 'Trusted by students', 
    icon: <FaUsers />,
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb, #60a5fa)'
  },
  { 
    value: 350, 
    suffix: '+', 
    label: 'Resumes Analyzed', 
    sublabel: 'And growing daily', 
    icon: <FaFileAlt />,
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)'
  },
  { 
    value: 94, 
    suffix: '%', 
    label: 'Accuracy Rate', 
    sublabel: 'High precision', 
    icon: <FaChartLine />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)'
  },
  { 
    value: 25, 
    suffix: '', 
    label: 'ATS Checks', 
    sublabel: 'Comprehensive analysis', 
    icon: <FaCheckCircle />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
  }
];

const Stats = () => {
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.1 
  });

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <motion.div 
          className="stats-grid"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card-modern"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <div className="stat-card-inner">
                <div className="stat-icon-wrapper" style={{ background: `${stat.color}15` }}>
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                
                <div className="stat-content">
                  <div className="stat-number-wrapper">
                    <span className="stat-number-prefix"></span>
                    <span className="stat-number-value">
                      {inView ? (
                        <CountUp 
                          end={stat.value} 
                          duration={2.5} 
                          separator="," 
                          suffix={stat.suffix}
                          useEasing={true}
                          useGrouping={true}
                        />
                      ) : (
                        `0${stat.suffix}`
                      )}
                    </span>
                  </div>
                  <span className="stat-label-modern">{stat.label}</span>
                  <span className="stat-sublabel-modern">{stat.sublabel}</span>
                </div>

                <div className="stat-decoration" style={{ background: stat.gradient }}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
