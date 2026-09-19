# NKP Exam Guide & Audio Suite — Local Windows Setup

This application is an interactive exam preparation suite for the **Nutanix Kubernetes Platform (NKP)** certification. It features 75 exam questions, comprehensive architectural guides, topological diagrams, and **Gemini 3.1 Flash Text-to-Speech** audio narration.

---

## Prerequisites for Windows

1. **Windows 10 or Windows 11**
2. **Node.js 18+ or 20+ (LTS recommended)**
   - Download and run the installer from: [https://nodejs.org](https://nodejs.org)
   - Or install via Windows Terminal / PowerShell:
     ```powershell
     winget install OpenJS.NodeJS.LTS
     ```
3. *(Optional)* A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) if you want to use the high-fidelity Gemini 3.1 Flash neural voice generator. If left empty, the application automatically falls back to your local Windows browser speech synthesizer.

---

## Quick Start (1-Click on Windows)

1. Extract the downloaded ZIP file to any folder on your PC (e.g. `C:\Projects\nkp-exam-app` or on your Desktop).
2. **Double-click `start-windows.bat`**.
3. The script will:
   - Check your Node.js installation.
   - Run `npm install` automatically on first launch.
   - Set up your `.env` configuration file.
   - Launch the server and automatically open **http://localhost:3000** in your web browser.

---

## Manual Step-by-Step Setup (PowerShell / Command Prompt / Terminal)

### Step 1: Open Terminal in the Project Folder
Open **PowerShell**, **CMD**, or **Git Bash**, and navigate to where you unzipped the project:
```powershell
cd C:\path\to\extracted\folder
```

### Step 2: Install Dependencies
Run npm to install all required packages:
```powershell
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
# In PowerShell:
Copy-Item .env.example .env

# Or in Command Prompt (CMD):
copy .env.example .env
```

Open `.env` in Notepad or VS Code:
```env
GEMINI_API_KEY="your_api_key_here"
```
*(If you don't provide an API key, the exam simulator will still work 100% and will seamlessly use your local browser's Web Speech API for voice narration).*

### Step 4: Run the Application
Start the development server:
```powershell
npm run dev
```

You will see:
```
Server running on http://0.0.0.0:3000
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## Production Build & Run (Optional)

To compile the application into an optimized production bundle:

```powershell
# 1. Build client and server bundle
npm run build

# 2. Run the production server
npm start
```

---

## Troubleshooting on Windows

### 1. "Scripts are disabled on this system" (PowerShell)
If PowerShell blocks running npm or tsx scripts due to execution policy, run this command once in PowerShell:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. Port 3000 is already in use
If another process is using port 3000:
- Find and stop the process in PowerShell:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
  ```
- Or change `PORT = 3000` to `PORT = 3005` in `server.ts`.

### 3. Audio / Speech playback
- When clicking "Listen to Spoken Explanation", if an API key is set in `.env`, the app queries the Gemini 3.1 Flash TTS model via the local Express backend.
- If no key is set or the quota limit is reached, it seamlessly falls back to your native Windows voices (Microsoft David, Zira, Mark).

---

## Project Structure Overview

- `server.ts` — Express backend with Gemini 3.1 Flash TTS audio proxy & streaming converter (PCM to WAV)
- `src/App.tsx` — Main application dashboard, state management, and score tracker
- `src/data/nkpQuestions.ts` — Primary question catalog importing batches 1 through 4
- `src/data/questions/` — Question definitions (batches 1 to 4 containing all 75 questions)
- `src/components/` — Modular UI components (ExamCard, ExplanationDrawer, ArchitectureView, PrerequisitesView, AudioController)
- `public/` — Static assets and generated bundles
