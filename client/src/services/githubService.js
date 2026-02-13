class GitHubService {
  constructor() {
    // No token needed for public API access
  }

  // Get user profile from GitHub API
  async getUserProfile(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (response.status === 404) {
        throw new Error('User not found');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API error:', error);
      throw error;
    }
  }

  // Get user repositories from GitHub API
  async getUserRepos(username, page = 1, perPage = 100) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API error:', error);
      throw error;
    }
  }

  // Get user events (for contribution data)
  async getUserEvents(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/events`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // Calculate GitHub score based on real data
  calculateGitHubScore(profile, repos, events) {
    let score = 0;
    const maxScore = 100;

    // Repository count (max 25 points)
    score += Math.min(repos.length, 25) * 2;

    // Stars received (max 20 points)
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    score += Math.min(totalStars, 50) * 0.4;

    // Followers (max 15 points)
    score += Math.min(profile.followers || 0, 50) * 0.3;

    // Language diversity (max 15 points)
    const uniqueLanguages = new Set(repos.map(r => r.language).filter(Boolean)).size;
    score += Math.min(uniqueLanguages, 8) * 1.5;

    // Recent activity (max 15 points)
    const pushEvents = events.filter(e => e.type === 'PushEvent').length;
    score += Math.min(pushEvents, 30) * 0.3;

    // Account age (max 10 points)
    if (profile.created_at) {
      const accountAge = (new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 365);
      score += Math.min(accountAge, 3) * 3;
    }

    // Ensure score is a valid number between 0-100
    const finalScore = Math.min(Math.max(Math.round(score), 0), 100);
    return isNaN(finalScore) ? 0 : finalScore;
  }

  // Format repository data for display
  formatRepoData(repos) {
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description',
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      openIssues: repo.open_issues_count || 0,
      size: repo.size || 0,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      isPrivate: repo.private,
      isFork: repo.fork,
      topics: repo.topics || []
    }));
  }
}

export default GitHubService;
