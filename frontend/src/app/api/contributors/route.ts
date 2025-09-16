import { NextRequest, NextResponse } from "next/server";

interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get repository info from environment variables
    const repoOwner = process.env.GITHUB_REPO_OWNER || "your-username";
    const repoName = process.env.GITHUB_REPO_NAME || "telkom-alumni";
    const githubToken = process.env.GITHUB_TOKEN;

    // GitHub API URL for contributors
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;

    // Set up headers
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "telkom-alumni-portal",
    };

    // Add authorization header if token is available
    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    // Fetch contributors from GitHub API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
      // Cache for 5 minutes to avoid hitting API limits
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("GitHub API Error:", response.status, response.statusText);

      if (response.status === 404) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: "API rate limit exceeded or access forbidden" },
          { status: 403 }
        );
      }

      throw new Error(
        `GitHub API returned ${response.status}: ${response.statusText}`
      );
    }

    const contributors: GitHubContributor[] = await response.json();

    // Filter out bots and sort by contributions
    const filteredContributors = contributors
      .filter((contributor) => contributor.type === "User")
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 12); // Limit to top 12 contributors

    return NextResponse.json(filteredContributors);
  } catch (error) {
    console.error("Error fetching contributors:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch contributors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
