@echo off
echo ========================================================
echo   NKP Exam Guide & Audio Suite - Local Launcher (Windows)
echo ========================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please download and install Node.js 18 or higher from: https://nodejs.org
    echo After installing, restart this script.
    echo.
    pause
    exit /b 1
)

:: Display Node and NPM versions
echo Node.js version detected:
call node -v
echo.

:: Install dependencies if node_modules is missing
if not exist node_modules (
    echo [INFO] First run detected. Installing dependencies via npm install...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install encountered an error. Please check your internet connection.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
)

:: Prepare .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env >nul
    echo [NOTE] You can open .env in Notepad and paste your GEMINI_API_KEY for high-fidelity Gemini 3.1 Flash TTS.
    echo (Even without a key, the app will function with browser text-to-speech fallback!)
    echo.
)

echo ========================================================
echo [INFO] Starting NKP Exam Guide server on http://localhost:3000 ...
echo Opening your default browser...
echo Press Ctrl+C in this terminal window to stop the server.
echo ========================================================
echo.

:: Open default browser after 2 seconds in background
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Start the application
call npm run dev
pause
