import React from 'react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--card-bg)] text-[var(--text-primary)] retro-border overflow-hidden flex flex-col font-mono text-xs">
        {/* Title bar */}
        <div className="bg-[#2b3a32] text-[#f2efe9] px-4 py-2 flex items-center justify-between border-b-2 border-[#1c2321]">
          <div className="flex items-center space-x-2 font-bold font-pixel text-sm tracking-wider">
            <span className="w-2.5 h-2.5 bg-[#4af688] inline-block"></span>
            <span>MANUAL: GITHUB PAGES DEPLOYMENT GUIDE</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-[#d9534f] text-white hover:bg-[#c9302c] text-xs font-mono retro-border-sm cursor-pointer"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 leading-relaxed">
          <p className="text-[var(--text-muted)]">
            This application is engineered as a 100% static, client-side single page app. It has no external backend, no database requirements, and no API keys required. It compiles cleanly into pure static HTML/CSS/JS and runs directly on GitHub Pages!
          </p>

          {/* Step 1 */}
          <div className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] retro-border-sm space-y-1">
            <div className="font-bold text-[var(--highlight)]">
              STEP 1: EXPORTING OR CLONING THE CODEBASE
            </div>
            <p>Ensure you have all files in your workspace:</p>
            <div className="p-2 bg-[#1b251e] text-[#4af688] overflow-x-auto text-[11px]">
              git init<br />
              git add .<br />
              git commit -m "Initial commit: Retro Projectile Motion Reviewer"
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] retro-border-sm space-y-1">
            <div className="font-bold text-[var(--highlight)]">
              STEP 2: UPLOAD TO YOUR GITHUB REPOSITORY
            </div>
            <p>Create a new public repository on GitHub (e.g. <code>projectile-motion-reviewer</code>) and push your files:</p>
            <div className="p-2 bg-[#1b251e] text-[#4af688] overflow-x-auto text-[11px]">
              git remote add origin https://github.com/&lt;your-username&gt;/&lt;repo-name&gt;.git<br />
              git branch -M main<br />
              git push -u origin main
            </div>
          </div>

          {/* Step 3 & 4 */}
          <div className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] retro-border-sm space-y-1">
            <div className="font-bold text-[var(--highlight)]">
              STEP 3 & 4: BUILD & DEPLOY (TWO OPTIONS)
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <span className="font-bold underline">Method A: Using GitHub Actions (Automated - Pre-configured!)</span>
                <p className="mt-1">
                  The workflow is already created in <code>.github/workflows/deploy.yml</code>. In your GitHub repository:
                </p>
                <ol className="list-decimal list-inside text-[11px] mt-1 space-y-0.5 text-[var(--text-muted)]">
                  <li>Go to <strong>Settings &gt; Pages</strong>.</li>
                  <li>Under <strong>Build and deployment &gt; Source</strong>, select <strong>GitHub Actions</strong>.</li>
                  <li>Push your commits to the <code>main</code> branch, and GitHub Actions will automatically compile and publish your site!</li>
                </ol>
              </div>

              <div>
                <span className="font-bold underline">Method B: Manual Static Build & `gh-pages`</span>
                <p className="mt-1">Run in your terminal:</p>
                <div className="p-2 bg-[#1b251e] text-[#4af688] overflow-x-auto text-[11px]">
                  npm install<br />
                  npm run build<br />
                  npx gh-pages -d dist
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Note: <code>vite.config.ts</code> is already configured with <code>base: './'</code> so assets load properly in any repository subpath.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] retro-border-sm space-y-1">
            <div className="font-bold text-[var(--highlight)]">
              STEP 5: OPENING THE PUBLISHED WEBSITE
            </div>
            <p>Your site will be live at:</p>
            <div className="p-2 bg-[#1b251e] text-[#facc15] overflow-x-auto text-[11px]">
              https://&lt;your-username&gt;.github.io/&lt;repo-name&gt;/
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--card-bg)] border-t-2 border-[var(--border-color)] text-right">
          <button onClick={onClose} className="px-4 py-1.5 retro-btn text-xs font-bold">
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
