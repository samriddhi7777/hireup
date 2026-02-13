import { useState } from 'react';
import {
  FaGithub, FaStar, FaCodeBranch, FaCode, FaUser,
  FaCalendar, FaMapPin, FaLink, FaTwitter, FaBuilding,
  FaUsers, FaFileCode, FaSpinner, FaExclamationCircle
} from 'react-icons/fa';
import GitHubService from '../../services/githubService';

const GitHubConnect = ({ onConnect }) => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [githubScore, setGithubScore] = useState(0);
  const [expandedRepo, setExpandedRepo] = useState(null);

  const githubService = new GitHubService();

  const handleConnect = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch user profile from REAL GitHub API
      const userProfile = await githubService.getUserProfile(username);
      setProfile(userProfile);

      // Fetch repositories from REAL GitHub API
      const userRepos = await githubService.getUserRepos(username);
      const formattedRepos = githubService.formatRepoData(userRepos);
      setRepos(formattedRepos);

      // Fetch events for contribution data
      const events = await githubService.getUserEvents(username);

      // Calculate GitHub score
      const score = githubService.calculateGitHubScore(userProfile, formattedRepos, events);
      setGithubScore(score);

      // Send to parent component
      if (onConnect) {
        onConnect({
          username,
          profile: userProfile,
          repos: formattedRepos.slice(0, 5),
          score
        });
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch GitHub profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      Python: '#3572A5',
      Java: '#b07219',
      TypeScript: '#2b7489',
      HTML: '#e34c26',
      CSS: '#563d7c',
      'C++': '#f34b7d',
      C: '#555555',
      CSharp: '#178600',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      Shell: '#89e051',
      'Jupyter Notebook': '#DA5B0B'
    };
    return colors[language] || '#6e7681';
  };

  return (
    <div className="github-connect-container">
      {!profile ? (
        <div className="github-connect-card">
          <div className="github-connect-header">
            <FaGithub className="github-logo" />
            <h2>Connect Your GitHub</h2>
            <p>Import your repositories and showcase your coding activity</p>
          </div>

          <div className="github-input-group">
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="github-input"
              disabled={loading}
            />
            <button
              onClick={handleConnect}
              disabled={loading}
              className="github-connect-btn"
            >
              {loading ? <FaSpinner className="spinner" /> : <FaGithub />}
              {loading ? 'Connecting...' : 'Connect GitHub'}
            </button>
          </div>

          {error && (
            <div className="github-error">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="github-features">
            <div className="feature">
              <FaCode className="feature-icon" />
              <span>Import repositories</span>
            </div>
            <div className="feature">
              <FaStar className="feature-icon" />
              <span>Show starred projects</span>
            </div>
            <div className="feature">
              <FaUsers className="feature-icon" />
              <span>Display contributions</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="github-profile-card">
          {/* GitHub Score */}
          <div className="github-score-section">
            <div className="score-circle" style={{
              background: `conic-gradient(#10b981 ${githubScore * 3.6}deg, #e2e8f0 0deg)`
            }}>
              <div className="score-inner">
                <span className="score-number">{githubScore}</span>
                <span className="score-label">GitHub Score</span>
              </div>
            </div>
            <div className="score-stats">
              <div className="stat">
                <span className="stat-value">{repos.length}</span>
                <span className="stat-label">REPOS</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.followers || 0}</span>
                <span className="stat-label">FOLLOWERS</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.following || 0}</span>
                <span className="stat-label">FOLLOWING</span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="github-profile-header">
            <img src={profile.avatar_url} alt={profile.login} className="github-avatar" />
            <div className="github-profile-info">
              <h3>{profile.name || profile.login}</h3>
              <p className="github-bio">{profile.bio || 'No bio provided'}</p>
              <div className="github-meta">
                {profile.location && (
                  <span><FaMapPin /> {profile.location}</span>
                )}
                {profile.blog && (
                  <span><FaLink /> <a href={profile.blog} target="_blank" rel="noopener noreferrer">{profile.blog}</a></span>
                )}
                {profile.twitter_username && (
                  <span><FaTwitter /> @{profile.twitter_username}</span>
                )}
                <span><FaCalendar /> Joined {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Repositories */}
          <div className="github-repos">
            <h4>Recent Repositories</h4>
            {repos.length === 0 ? (
              <p className="no-repos">No public repositories found</p>
            ) : (
              <div className="repos-list">
                {repos.slice(0, 5).map((repo) => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-header">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="repo-name">
                        <FaCode /> {repo.name}
                      </a>
                      {repo.language && (
                        <span className="repo-language" style={{ 
                          backgroundColor: getLanguageColor(repo.language) + '20', 
                          color: getLanguageColor(repo.language) 
                        }}>
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="repo-description">{repo.description}</p>
                    <div className="repo-stats">
                      <span><FaStar /> {repo.stars}</span>
                      <span><FaCodeBranch /> {repo.forks}</span>
                      <span>Updated {formatDate(repo.updatedAt)}</span>
                    </div>
                    <button
                      className="repo-expand-btn"
                      onClick={() => setExpandedRepo(expandedRepo === repo.id ? null : repo.id)}
                    >
                      {expandedRepo === repo.id ? 'Show Less' : 'Show More'}
                    </button>
                    {expandedRepo === repo.id && (
                      <div className="repo-details">
                        <div className="detail-item">
                          <span>Size:</span> {repo.size} KB
                        </div>
                        <div className="detail-item">
                          <span>Created:</span> {formatDate(repo.createdAt)}
                        </div>
                        <div className="detail-item">
                          <span>Last Push:</span> {formatDate(repo.pushedAt)}
                        </div>
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="repo-topics">
                            {repo.topics.map(topic => (
                              <span key={topic} className="topic-tag">#{topic}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disconnect Button */}
          <button
            className="github-disconnect-btn"
            onClick={() => {
              setProfile(null);
              setRepos([]);
              setGithubScore(0);
              setUsername('');
            }}
          >
            Disconnect GitHub
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubConnect;
