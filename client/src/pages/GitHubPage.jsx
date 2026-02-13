import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GitHubConnect from '../components/github/GitHubConnect';
import { FaGithub, FaArrowLeft } from 'react-icons/fa';

const GitHubPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [githubData, setGithubData] = useState(null);

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleGitHubConnect = (data) => {
    setGithubData(data);
    console.log('GitHub connected:', data);
  };

  return (
    <div className="github-page">
      <div className="github-page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>
          <FaGithub /> GitHub Integration
        </h1>
        <p>Connect your GitHub account to showcase your projects and coding activity</p>
      </div>

      <div className="github-page-content">
        <GitHubConnect onConnect={handleGitHubConnect} token={token} />

        {githubData && (
          <div className="github-benefits">
            <h2>🎯 Benefits of Connecting GitHub</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h3>📊 Enhanced ATS Score</h3>
                <p>GitHub profiles increase your resume score by up to 15%</p>
              </div>
              <div className="benefit-card">
                <h3>💼 Show Real Projects</h3>
                <p>Recruiters can see your actual code and contributions</p>
              </div>
              <div className="benefit-card">
                <h3>🔍 Skill Verification</h3>
                <p>Your listed skills are verified through actual repositories</p>
              </div>
              <div className="benefit-card">
                <h3>📈 Activity Tracking</h3>
                <p>Show your consistent contribution to open source</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubPage;
