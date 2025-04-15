"use client";

export default function GitHubRepoCard({
  owner,
  repo,
  description,
  stars,
  forks,
  language,
  lastUpdated,
}) {
  const repoUrl = `https://github.com/${owner}/${repo}`;

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-3 p-4 border border-gray-700/30 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 shadow-md hover:shadow-lg max-w-full"
    >
      <div className="flex flex-col">
        <div className="font-semibold text-cyan-400 hover:text-cyan-300 break-words text-base mb-1">
          {owner}/{repo}
        </div>

        {description && (
          <p className="text-sm text-gray-300 mb-2">{description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          {stars !== undefined && (
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {stars}
            </span>
          )}

          {forks !== undefined && (
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {forks}
            </span>
          )}

          {language && (
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              {language}
            </span>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-400 italic">
          View on GitHub →
        </div>
      </div>
    </a>
  );
}
