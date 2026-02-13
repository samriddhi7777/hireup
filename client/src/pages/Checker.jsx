import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PDFExportService from '../services/pdfExportService';
import { 
  FaCloudUploadAlt, FaFilePdf, FaFileWord, FaTimesCircle, 
  FaSpinner, FaCheckCircle, FaTimesCircle as FaTimes,
  FaExclamationCircle, FaGithub, FaLinkedin, FaEnvelope, 
  FaPhone, FaGraduationCap, FaBriefcase, FaCode, FaAward, 
  FaChartLine, FaDownload, FaShare, FaBook, FaUsers,
  FaBrain, FaSearch, FaStar, FaGlobe, FaShieldAlt,
  FaCheck, FaTimes as FaClose
} from 'react-icons/fa';

const Checker = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('checklist');
  const [exporting, setExporting] = useState(false);
  
  const { token, user } = useAuth();
  const pdfExporter = new PDFExportService();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
      setAnalysis(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAnalysis(response.data.data);
      console.log('Analysis results:', response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!analysis) {
      setError('No analysis to export');
      return;
    }

    setExporting(true);
    try {
      await pdfExporter.generateReport(
        analysis,
        user,
        file?.name || 'resume.pdf',
        null // GitHub data would go here
      );
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const ChecklistSection = ({ title, items }) => (
    <div className="checklist-section">
      <h3 className="section-title">{title}</h3>
      <div className="checklist-items">
        {items.map((item, index) => (
          <div key={index} className={`checklist-row ${item.passed ? 'passed' : 'failed'}`}>
            <div className="checklist-status">
              {item.passed ? (
                <FaCheck className="status-icon passed" />
              ) : (
                <FaClose className="status-icon failed" />
              )}
            </div>
            <div className="checklist-content">
              <div className="checklist-name">{item.name}</div>
              {!item.passed && item.tip && (
                <div className="checklist-tip">💡 {item.tip}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!token) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Please login to access Resume Checker</h2>
        <a href="/login" style={{ color: '#2563eb' }}>Go to Login</a>
      </div>
    );
  }

  return (
    <div className="checker-page">
      <div className="checker-container">
        <div className="checker-header">
          <h1>📋 Detailed ATS Resume Analysis</h1>
          <p>See exactly what's present and missing in your resume</p>
        </div>

        <div className="checker-grid">
          {/* Left Column - Upload */}
          <div className="upload-section">
            <div className="upload-card">
              <h3>📄 Upload Resume</h3>
              
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="file-info">
                    <div className="file-icon">
                      {file.name.endsWith('.pdf') ? <FaFilePdf /> : <FaFileWord />}
                    </div>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatFileSize(file.size)}</div>
                    </div>
                    <button
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setAnalysis(null);
                      }}
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Drag & drop your resume here</p>
                    <span className="file-hint">Supports PDF, DOCX (Max 5MB)</span>
                  </div>
                )}
              </div>

              <div className="job-description">
                <label>📝 Job Description (Optional)</label>
                <textarea
                  rows="4"
                  placeholder="Paste job description to check match score..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {error && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{error}</span>
                </div>
              )}

              <button
                className={`analyze-btn ${loading ? 'loading' : ''}`}
                onClick={handleAnalyze}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>

              {analysis && (
                <button
                  className={`export-pdf-btn ${exporting ? 'loading' : ''}`}
                  onClick={handleExportPDF}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <FaSpinner className="spinner" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download PDF Report
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Results */}
          <div className="results-section">
            {!analysis ? (
              <div className="empty-state">
                <FaBrain className="empty-icon" />
                <h3>Ready for Detailed Analysis</h3>
                <p>Upload your resume to see a comprehensive ATS checklist</p>
              </div>
            ) : (
              <div className="analysis-results">
                {/* Score Overview */}
                <div className="score-overview-card">
                  <div className="score-circle" style={{ 
                    background: `conic-gradient(${getScoreColor(analysis.atsScore)} ${analysis.atsScore * 3.6}deg, #e2e8f0 0deg)`
                  }}>
                    <div className="score-inner">
                      <span className="score-number">{analysis.atsScore}%</span>
                      <span className="score-label">ATS Score</span>
                    </div>
                  </div>
                  <div className="score-details">
                    <div className="score-stat">
                      <span className="stat-value">{analysis.passedChecks}</span>
                      <span className="stat-name">Checks Passed</span>
                    </div>
                    <div className="score-stat">
                      <span className="stat-value">{analysis.totalChecks}</span>
                      <span className="stat-name">Total Checks</span>
                    </div>
                    {analysis.matchScore > 0 && (
                      <div className="score-stat">
                        <span className="stat-value">{analysis.matchScore}%</span>
                        <span className="stat-name">Job Match</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Checklist by Category */}
                <div className="detailed-checklist">
                  <h2>📋 ATS Checklist Results</h2>
                  
                  {/* Contact Information */}
                  <ChecklistSection 
                    title="📞 Contact Information"
                    items={[
                      { name: "Email Address", passed: analysis.sections?.hasEmail, tip: "Add a professional email address" },
                      { name: "Phone Number", passed: analysis.sections?.hasPhone, tip: "Include your contact number" },
                      { name: "LinkedIn Profile", passed: analysis.sections?.hasLinkedIn, tip: "Add your LinkedIn URL" },
                      { name: "GitHub Profile", passed: analysis.sections?.hasGitHub, tip: "Add your GitHub profile" }
                    ]}
                  />

                  {/* Resume Sections */}
                  <ChecklistSection 
                    title="📑 Required Sections"
                    items={[
                      { name: "Education Section", passed: analysis.sections?.hasEducation, tip: "Add your education details" },
                      { name: "Work Experience", passed: analysis.sections?.hasExperience, tip: "Include your work history" },
                      { name: "Projects Section", passed: analysis.sections?.hasProjects, tip: "Showcase your projects" },
                      { name: "Skills Section", passed: analysis.sections?.hasSkills, tip: "Create a dedicated skills section" },
                      { name: "Certifications", passed: analysis.sections?.hasCertifications, tip: "Add relevant certifications" }
                    ]}
                  />

                  {/* Content Quality */}
                  <ChecklistSection 
                    title="📊 Content Quality"
                    items={[
                      { name: "Quantified Achievements", passed: analysis.hasQuantifiedResults, tip: "Add numbers and percentages" },
                      { name: "Strong Action Verbs (3+)", passed: (analysis.actionVerbs?.strongCount || 0) > 3, tip: "Use more strong action verbs" },
                      { name: "No Weak Verbs", passed: (analysis.actionVerbs?.weakCount || 0) < 3, tip: "Replace weak verbs like 'worked on'" },
                      { name: "No Buzzwords", passed: (analysis.buzzwords?.count || 0) === 0, tip: "Avoid clichés like 'synergy'" }
                    ]}
                  />

                  {/* Skills Analysis */}
                  <ChecklistSection 
                    title="🔧 Skills Analysis"
                    items={[
                      { name: "Technical Skills (8+)", passed: (analysis.skills?.length || 0) >= 8, tip: "Add more technical skills" },
                      ...(analysis.missingSkills?.map(skill => ({
                        name: `Skill: ${skill}`,
                        passed: false,
                        tip: `Add ${skill} to match job requirements`
                      })) || [])
                    ]}
                  />
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={handleExportPDF}>
                    <FaDownload /> Download Full Report
                  </button>
                  <button className="action-btn secondary">
                    <FaShare /> Share Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checker;
