import { motion } from 'framer-motion';
import { FaStar, FaQuoteRight, FaUserCircle } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'Computer Science Student',
    year: '3rd Year',
    rating: 5,
    text: 'The GitHub integration helped me showcase my open source contributions. My resume score improved from 62 to 89 in just one week!',
    role: 'Summer Intern 2026'
  },
  {
    name: 'Rahul Verma',
    college: 'Information Technology',
    year: '4th Year',
    rating: 5,
    text: 'The skill gap analyzer showed me exactly what technologies I was missing. After adding those skills, I started getting more interview calls.',
    role: 'Placement Candidate'
  },
  {
    name: 'Anjali Patel',
    college: 'Electronics Engineering',
    year: '2nd Year',
    rating: 5,
    text: 'I had no idea my resume was getting rejected by ATS. The 25-point checklist helped me fix formatting issues and my callback rate tripled!',
    role: 'Early Career'
  },
  {
    name: 'Arjun Reddy',
    college: 'Computer Applications',
    year: 'Final Year',
    rating: 4,
    text: 'Free and actually useful. The job match feature helped me tailor my resume for specific roles. Landed my first internship!',
    role: 'Internship Offer'
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">TESTIMONIALS</span>
            <h2 className="section-title">
              Trusted by{' '}
              <span className="gradient-text">Students</span>
            </h2>
            <p className="section-subtitle">
              Real feedback from students who improved their resumes with Hireup.
            </p>
          </motion.div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar-placeholder">
                  <FaUserCircle />
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-college">
                    {testimonial.college} • {testimonial.year}
                  </p>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star-filled" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star-empty" />
                    ))}
                  </div>
                </div>
                <FaQuoteRight className="quote-icon" />
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-footer">
                <span className="testimonial-role">{testimonial.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
