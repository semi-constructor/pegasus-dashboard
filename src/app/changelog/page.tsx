import { ChangelogClient } from '@/components/changelog/ChangelogClient';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  author?: {
    avatar_url: string;
    login: string;
  };
}

// In-memory cache to prevent rate-limits during dev reloads
let cachedCommits: any[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes explicit memory cache

async function getCommits() {
  const now = Date.now();
  if (cachedCommits && (now - lastFetchTime < CACHE_TTL)) {
    return cachedCommits;
  }

  const fetchOpts = { next: { revalidate: 3600 } };
  
  try {
    const [botRes, dashRes] = await Promise.all([
      fetch('https://api.github.com/repos/semi-constructor/pegasus/commits?per_page=20', fetchOpts),
      fetch('https://api.github.com/repos/semi-constructor/pegasus-dashboard/commits?per_page=20', fetchOpts)
    ]);

    const botCommits: GitHubCommit[] = botRes.ok ? await botRes.json() : [];
    const dashCommits: GitHubCommit[] = dashRes.ok ? await dashRes.json() : [];

    if (!Array.isArray(botCommits) || !Array.isArray(dashCommits)) {
      throw new Error("Rate limited or invalid response");
    }

    const formattedBot = botCommits.map((c) => {
      const parts = c.commit.message.split('\n');
      return {
        id: c.sha,
        repo: 'Pegasus Core',
        message: parts[0],
        fullMessage: parts.length > 1 ? parts.slice(1).join('\n').trim() : '',
        date: c.commit.author.date,
        url: c.html_url,
        authorName: c.commit.author.name,
        authorAvatar: c.author?.avatar_url
      };
    });

    const formattedDash = dashCommits.map((c) => {
      const parts = c.commit.message.split('\n');
      return {
        id: c.sha,
        repo: 'Dashboard',
        message: parts[0],
        fullMessage: parts.length > 1 ? parts.slice(1).join('\n').trim() : '',
        date: c.commit.author.date,
        url: c.html_url,
        authorName: c.commit.author.name,
        authorAvatar: c.author?.avatar_url
      };
    });

    const allCommits = [...formattedBot, ...formattedDash].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Update Cache
    if (allCommits.length > 0) {
      cachedCommits = allCommits;
      lastFetchTime = now;
    }

    return allCommits;
  } catch (error) {
    console.error("Failed to fetch changelog:", error);
    // Return stale cache if available when failing
    return cachedCommits || [];
  }
}

export default async function ChangelogPage() {
  const commits = await getCommits();
  return <ChangelogClient commits={commits} />;
}
