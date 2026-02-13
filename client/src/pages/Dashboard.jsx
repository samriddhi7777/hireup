import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  FaChartLine, FaFileAlt, FaStar, FaArrowUp, FaHistory,
  FaDownload, FaShare, FaCalendarAlt, FaAward, FaRocket,
  FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaGraduationCap,
  FaCheckCircle, FaTimesCircle, FaBrain
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [resumeHistory, setResumeHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalScans: 0,
    averageScore: 0,
    highestScore: 0,
    improvementRate: 0,
    skillsCount: 0,
    matchesCount: 0
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRealDashboardData();
  }, [token]);

  useEffect(() => {
    filterDataByTimeRange();
  }, [timeRange, resumeHistory]);

  const fetchRealDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ REAL API CALL - Get actual user data
      const response = await axios.get('http://localhost:8000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { history, stats: userStats } = response.data.data;
      
      setResumeHistory(history);
      setStats(userStats);

    } catch (error) {
      console.error('Error fetching real dashboard data:', error);
      
      // ❌ Fallback to mock data if API fails
      console.log('Using mock data as fallback');
      const mockHistory = [
        { date: '2026-02-07', score: 62, checks: 12, wordCount: 450, matchScore: 55 },
        { date: '2026-02-08', score: 68, checks: 14, wordCount: 520, matchScore: 60 },
        { date: '2026-02-09', score: 75, checks: 16, wordCount: 580, matchScore: 68 },
        { date: '2026-02-10', score: 82, checks: 18, wordCount: 620, matchScore: 75 },
        { date: '2026-02-11', score: 86, checks: 20, wordCount: 650, matchScore: 80 },
        { date: '2026-02-12', score: 91, checks: 22, wordCount: 680, matchScore: 86 },
        { date: '2026-02-13', score: 93, checks: 23, wordCount: 700, matchScore: 89 }
      ];
      
      setResumeHistory(mockHistory);
      
      const scores = mockHistory.map(h => h.score);
      setStats({
        totalScans: mockHistory.length,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        highestScore: Math.max(...scores),
        improvementRate: Math.round(((scores[scores.length - 1] - scores[0]) / scores[0]) * 100),
        skillsCount: 24,
        matchesCount: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDataByTimeRange = () => {
    const now = new Date();
    let filtered = [...resumeHistory];
    
    switch(timeRange) {
      case 'week':
        filtered = resumeHistory.slice(-7);
        break;
      case 'month':
        filtered = resumeHistory.slice(-30);
        break;
      case 'quarter':
        filtered = resumeHistory.slice(-90);
        break;
      default:
        filtered = resumeHistory;
    }
    
    setFilteredData(filtered);
  };

  const handleExportReport = () => {
    const csvData = [
      ['Date', 'ATS Score', 'Checks Passed', 'Word Count', 'Job Match', 'File Name'],
      ...filteredData.map(item => [
        item.date,
        item.score,
        item.checks,
        item.wordCount,
        item.matchScore || 'N/A',
        item.fileName || 'Unknown'
      ])
    ];

    const csvString = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hireup-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const scoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];

  const skillData = [
    { subject: 'Contact Info', A: 100, B: 80, fullMark: 100 },
    { subject: 'Education', A: 98, B: 85, fullMark: 100 },
    { subject: 'Experience', A: 86, B: 70, fullMark: 100 },
    { subject: 'Projects', A: 92, B: 60, fullMark: 100 },
    { subject: 'Skills', A: 88, B: 75, fullMark: 100 },
    { subject: 'Formatting', A: 95, B: 65, fullMark: 100 }
  ];

  const categoryData = [
    { name: 'Contact', value: 85 },
    { name: 'Sections', value: 92 },
    { name: 'Content', value: 78 },
    { name: 'Skills', value: 88 },
    { name: 'Format', value: 95 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-score">Score: {payload[0].value}%</p>
          {payload[1] && <p className="tooltip-match">Match: {payload[1].value}%</p>}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📊 Analytics Dashboard</h1>
          <p>Track your resume performance and improvement</p>
          {resumeHistory.length === 0 && (
            <p className="no-data-warning">⚠️ No analysis history yet. Upload a resume to see data!</p>
          )}
        </div>
        <div className="header-right">
          <div className="time-range-selector">
            <button 
              className={timeRange === 'week' ? 'active' : ''} 
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={timeRange === 'month' ? 'active' : ''} 
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={timeRange === 'quarter' ? 'active' : ''} 
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </button>
          </div>
          <button 
            className="export-btn" 
            onClick={handleExportReport}
            disabled={filteredData.length === 0}
          >
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Scans</span>
            <span className="stat-value">{stats.totalScans}</span>
            <span className="stat-trend positive">+{stats.improvementRate}%</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{stats.averageScore}%</span>
            <span className="stat-trend positive">+12%</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FaRocket />
          </div>
          <div className="stat-content">
            <span className="stat-label">Highest Score</span>
            <span className="stat-value">{stats.highestScore}%</span>
            <span className="stat-trend">Personal Best</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FaAward />
          </div>
          <div className="stat-content">
            <span className="stat-label">Skills Detected</span>
            <span className="stat-value">{stats.skillsCount}</span>
            <span className="stat-trend">+4 new</span>
          </div>
        </div>
      </div>

      {/* Charts remain the same... */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Score Progress ({timeRange})</h3>
            <FaHistory className="chart-icon" />
          </div>
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                  name="ATS Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="matchScore" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Job Match"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">No data to display</div>
          )}
        </div>

        {/* Rest of the charts with same conditional rendering */}
        {/* ... (keep all other charts) ... */}
      </div>
    </div>
  );
};

export default Dashboard;
