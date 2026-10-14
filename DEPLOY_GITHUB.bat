@echo off
title Push to GitHub for Free 24/7 Hosting
echo ====================================================
echo  Velvet ^& Vow - 1-Click GitHub Pages Deploy Helper
echo ====================================================
echo.
echo Step 1: Create a new repository on https://github.com/new
echo         Give it an innocent name, e.g. "my-daily-notes" or "velvet-app"
echo.
echo Step 2: Paste your GitHub repository URL below:
echo         (e.g., https://github.com/YourUsername/velvet-app.git)
echo.
set /p REPO_URL="Enter GitHub Repo URL: "
if "%REPO_URL%"=="" goto end

git remote remove origin >nul 2>&1
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ====================================================
echo Success! Files pushed to GitHub.
echo.
echo FINAL STEP to activate your free 24/7 link:
echo 1. Open your repository on GitHub.
echo 2. Click "Settings" (gear icon) -> "Pages" (left sidebar).
echo 3. Under "Branch", select "main" and click "Save".
echo.
echo Within 60 seconds, GitHub will give you your free private link:
echo https://YourUsername.github.io/YourRepoName/
echo ====================================================
pause
:end
