import React, { useState } from 'react';
import {
  Download,
  Terminal,
  Monitor,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  FileCode2,
  FolderArchive,
  ExternalLink,
  Play,
  Database
} from 'lucide-react';

export const LocalSetupGuide: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner with One-Click Download */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Monitor className="w-3.5 h-3.5" />
              Windows 10 / 11 Deployment Guide
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Export & Run Locally on Your Windows Machine
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              You can extract the complete codebase, including all exam questions, diagrams, Express backend, Gemini TTS proxy, Velero backup setup guides, and Windows launcher scripts, directly onto your local computer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <a
              href="/api/download-zip"
              download="nkp-exam-app.zip"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Project ZIP</span>
            </a>
            <div className="text-center text-[11px] text-slate-400">
              Pre-packaged (.zip) • Includes <code className="text-emerald-300">start-windows.bat</code>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Export Option: AI Studio UI */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Alternative Method: Google AI Studio Menu Export
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              You can also click the <strong>Settings / Menu</strong> icon (top right corner of the Google AI Studio interface) and choose <strong>"Export to ZIP"</strong> or <strong>"Export to GitHub"</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Velero Backup & Restore Verification Setup for Windows */}
      <div className="bg-gradient-to-br from-emerald-900/90 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold mb-1">
              Velero Backup & Disaster Recovery Setup
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Windows Setup & Practice: Velero Backup & Namespace Mappings
            </h3>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          As highlighted in exam questions (e.g., restoring <code className="text-emerald-300 font-mono">finance-db-nightly</code> into <code className="text-emerald-300 font-mono">finance-validation</code> via namespace mappings), Windows administrators often verify backups locally using kubectl and Velero CLI. Follow this quick setup in your local Windows environment:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span>1. Install Velero CLI on Windows (via Chocolatey / Winget)</span>
            </div>
            <div className="relative bg-slate-950 p-2.5 rounded text-xs font-mono text-slate-200">
              <code>winget install vmware.velero</code>
              <button
                onClick={() => handleCopy('winget install vmware.velero', 'veleroinstall')}
                className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {copiedId === 'veleroinstall' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span>2. Practice Velero Restore with Namespace Mapping</span>
            </div>
            <div className="relative bg-slate-950 p-2.5 rounded text-xs font-mono text-slate-200 overflow-x-auto">
              <code>velero restore create --from-backup finance-db-nightly --namespace-mappings finance-prod:finance-validation</code>
              <button
                onClick={() => handleCopy('velero restore create --from-backup finance-db-nightly --namespace-mappings finance-prod:finance-validation', 'velerorestore')}
                className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {copiedId === 'velerorestore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step by step Windows Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 & 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Install Node.js on Windows</h3>
              <p className="text-xs text-slate-500">Requires Node.js 18 or 20+ LTS</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If you do not already have Node.js installed, download the official Windows Installer (MSI) from{' '}
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              nodejs.org <ExternalLink className="w-3 h-3" />
            </a>
            , or run in PowerShell:
          </p>

          <div className="relative group bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
            <code>winget install OpenJS.NodeJS.LTS</code>
            <button
              onClick={() => handleCopy('winget install OpenJS.NodeJS.LTS', 'winget')}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy command"
            >
              {copiedId === 'winget' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Step 2: Unzip and 1-Click Launch */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Unzip & 1-Click Start</h3>
              <p className="text-xs text-slate-500">Using the included start-windows.bat</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Right-click the downloaded <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">nkp-exam-app.zip</code> and select <strong>Extract All...</strong>.
            Inside the extracted folder, simply <strong>double-click:</strong>
          </p>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-xs font-mono font-bold text-emerald-900">start-windows.bat</span>
            </div>
            <span className="text-[11px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              Double-Click
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            This automatically checks Node.js, runs <code className="text-slate-700">npm install</code>, creates your <code className="text-slate-700">.env</code>, launches the server on port 3000, and opens your browser.
          </p>
        </div>
      </div>

      {/* Manual Command Line Instructions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">
            Manual Command Line Execution (PowerShell, Command Prompt, or VS Code)
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          If you prefer executing commands in Windows Terminal, PowerShell, or Git Bash:
        </p>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1">1. Navigate to project & install dependencies:</div>
            <div className="relative group bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
              <code>cd C:\path\to\extracted\folder{"\n"}npm install</code>
              <button
                onClick={() => handleCopy('npm install', 'npmi')}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {copiedId === 'npmi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1">2. Configure your environment file:</div>
            <div className="relative group bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
              <code>copy .env.example .env</code>
              <button
                onClick={() => handleCopy('copy .env.example .env', 'copyenv')}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {copiedId === 'copyenv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Optional: Open <code className="text-slate-700 font-semibold">.env</code> in Notepad and paste your <code className="text-slate-700 font-semibold">GEMINI_API_KEY</code>. If omitted, the app still works completely with your local Windows browser speech synthesizer.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1">3. Start the application:</div>
            <div className="relative group bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
              <code>npm run dev</code>
              <button
                onClick={() => handleCopy('npm run dev', 'npmdev')}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {copiedId === 'npmdev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Open your browser to: <strong className="text-emerald-700">http://localhost:3000</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Windows Troubleshooting Tips */}
      <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Windows Common Issues & Quick Fixes</span>
        </div>
        <ul className="text-xs text-amber-800 space-y-2 list-disc list-inside">
          <li>
            <strong>PowerShell Execution Policy Error:</strong> If PowerShell says <em>"running scripts is disabled on this system"</em>, run:
            <code className="block bg-amber-100/80 p-2 rounded text-slate-900 font-mono text-[11px] mt-1">
              Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
            </code>
          </li>
          <li>
            <strong>Port 3000 already in use:</strong> If another application is running on port 3000, you can stop it or edit <code className="font-semibold text-slate-900">server.ts</code> to change <code className="font-mono text-slate-900">const PORT = 3000</code> to <code className="font-mono text-slate-900">const PORT = 3005</code>.
          </li>
          <li>
            <strong>Offline / Air-Gapped usage:</strong> All exam questions and architecture diagrams are self-contained locally in TypeScript and will load with zero internet connection once dependencies are installed.
          </li>
        </ul>
      </div>
    </div>
  );
};

