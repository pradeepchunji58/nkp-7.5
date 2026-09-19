import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
  KeyRound,
  RotateCcw,
  Sparkles,
  Sliders,
  PlayCircle
} from 'lucide-react';
import { adminTabStore, TabConfig } from '../utils/adminTabStore';
import { TabKey } from '../types';

interface AdminTabProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnforceActiveTab?: (validTab: TabKey) => void;
}

export const AdminTabProtectionModal: React.FC<AdminTabProtectionModalProps> = ({
  isOpen,
  onClose,
  onEnforceActiveTab,
}) => {
  const [isAdmin, setIsAdmin] = useState(adminTabStore.isUserAdmin());
  const [tabConfigs, setTabConfigs] = useState<TabConfig[]>(adminTabStore.getAllConfigs());
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Change PIN fields
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinChangeStatus, setPinChangeStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Blur focus and privacy controls
  const [isDeepDiveBlurred, setIsDeepDiveBlurred] = useState(adminTabStore.isDeepDivePermanentlyBlurredSetting());
  const [isBlurHiddenTabs, setIsBlurHiddenTabs] = useState(adminTabStore.isBlurHiddenTabsActive());

  useEffect(() => {
    const unsub = adminTabStore.subscribe(() => {
      setIsAdmin(adminTabStore.isUserAdmin());
      setTabConfigs(adminTabStore.getAllConfigs());
      setIsDeepDiveBlurred(adminTabStore.isDeepDivePermanentlyBlurredSetting());
      setIsBlurHiddenTabs(adminTabStore.isBlurHiddenTabsActive());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (!enteredPin) {
      setPinError('Please enter the Admin PIN.');
      return;
    }

    const ok = adminTabStore.verifyPin(enteredPin);
    if (ok) {
      setEnteredPin('');
      setSuccessMsg('Admin privileges unlocked.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setPinError('Incorrect PIN. Default is "admin123".');
    }
  };

  const handleLockAdmin = () => {
    adminTabStore.lockAdmin();
    setSuccessMsg('Admin mode locked. User restrictions are now active.');
    setTimeout(() => setSuccessMsg(''), 3000);
    // If simulation only is active, ensure we steer to practice-mode
    if (onEnforceActiveTab) {
      onEnforceActiveTab('practice-mode');
    }
  };

  const handleToggleEnable = (tabKey: TabKey, currentVal: boolean) => {
    adminTabStore.updateTabPermission(tabKey, { enabled: !currentVal });
  };

  const handleToggleHide = (tabKey: TabKey, currentVal: boolean) => {
    adminTabStore.updateTabPermission(tabKey, { hidden: !currentVal });
  };

  const handleToggleDeepDiveBlur = () => {
    const nextVal = !isDeepDiveBlurred;
    adminTabStore.setDeepDiveBlurred(nextVal);
    setSuccessMsg(
      nextVal
        ? 'Architectural Deep-Dive is now permanently blurred & copy-protected.'
        : 'Architectural Deep-Dive unblurred.'
    );
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleToggleBlurHiddenTabs = () => {
    const nextVal = !isBlurHiddenTabs;
    adminTabStore.setBlurHiddenTabs(nextVal);
    setSuccessMsg(
      nextVal
        ? 'Hidden tabs will render with complete blur focus, no mouse touch, and copy-paste blocked.'
        : 'Hidden tabs blur focus disabled.'
    );
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleApplyPreset = (preset: 'simulation-only' | 'all-unlocked' | 'study-mode') => {
    adminTabStore.applyPreset(preset);
    if (preset === 'simulation-only') {
      setSuccessMsg('Simulation Exam Lockdown engaged: All other tabs are locked and hidden.');
      if (onEnforceActiveTab) {
        onEnforceActiveTab('practice-mode');
      }
    } else if (preset === 'all-unlocked') {
      setSuccessMsg('All navigation tabs enabled and visible.');
    } else {
      setSuccessMsg('Study mode applied: Question creator and admin tools hidden.');
    }
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeStatus(null);
    const res = adminTabStore.changePin(currentPin, newPin);
    setPinChangeStatus(res);
    if (res.success) {
      setCurrentPin('');
      setNewPin('');
      setTimeout(() => {
        setShowPinChange(false);
        setPinChangeStatus(null);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Admin Tab Protection &amp; Visibility Control</h3>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${isAdmin ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                  {isAdmin ? 'Admin Mode (Unlocked)' : 'Restricted / Locked'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Disable or hide navigation tabs for students and examinees
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {!isAdmin ? (
            /* PIN Unlock Form */
            <div className="max-w-md mx-auto py-6 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center border border-amber-300">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Admin Authorization Required</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your Administrator PIN to configure tab permissions, disable features, or hide items from the top navigation bar.
                </p>
              </div>

              <form onSubmit={handleVerifyPin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Admin Passcode / PIN
                  </label>
                  <input
                    type="password"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="Enter Admin PIN (Default: admin123)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {pinError}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    💡 Standard pre-configured default PIN is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">admin123</code>
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unlock Admin Controls</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Admin Control Center */
            <div className="space-y-6">
              {/* Presets Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Quick Deployment Presets
                    </span>
                  </div>
                  <button
                    onClick={handleLockAdmin}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    title="Lock admin session and enforce permissions on user view"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Lock &amp; Enforce Now</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Preset 1: Simulation Only */}
                  <button
                    onClick={() => handleApplyPreset('simulation-only')}
                    className="p-3 rounded-xl border border-emerald-500/60 bg-emerald-50/70 hover:bg-emerald-100/80 text-left transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs mb-1">
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Simulation Tab Only</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 leading-snug">
                        Locks &amp; hides all tabs. Only the NCP-CN 7.5 Pre-Exam Simulator appears in the top line item.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 mt-2 inline-block uppercase">
                      Recommended for Exams &rarr;
                    </span>
                  </button>

                  {/* Preset 2: Full Access */}
                  <button
                    onClick={() => handleApplyPreset('all-unlocked')}
                    className="p-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-left transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>All Tabs Unlocked</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Enables and unhides all 9 tabs across the application header.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-2 inline-block uppercase">
                      Full Access &rarr;
                    </span>
                  </button>

                  {/* Preset 3: Study Mode */}
                  <button
                    onClick={() => handleApplyPreset('study-mode')}
                    className="p-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-left transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs mb-1">
                        <Shield className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                        <span>Student Study Mode</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Enables Question bank &amp; Simulator; locks Creator &amp; Admin management tools.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-2 inline-block uppercase">
                      Study Mode &rarr;
                    </span>
                  </button>
                </div>
              </div>

              {/* Privacy, Deep-Dive & Blur Focus Policy Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                      Exam Privacy, Deep-Dive &amp; Blur Focus Controls
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    High Security Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Toggle 1: Architectural Deep-Dive Permanent Blur */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          Architectural Deep-Dive Blur
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isDeepDiveBlurred ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-700 text-slate-300'}`}>
                          {isDeepDiveBlurred ? 'Permanently Blurred' : 'Visible'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">
                        Permanently hides the Architectural Deep-Dive section (Option C breakdown, Kind cluster cards) in complete blur focus. Mouse touch and copy-paste are disabled.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleDeepDiveBlur}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${isDeepDiveBlurred ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                      {isDeepDiveBlurred ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Blur Locked (Click to Unblur)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Click to Permanently Blur</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Toggle 2: Hidden Tabs Blur & Mouse/Copy Lock */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          Hidden Tabs Full Blur Focus
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isBlurHiddenTabs ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-700 text-slate-300'}`}>
                          {isBlurHiddenTabs ? 'Enforced' : 'Off'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1">
                        When users click hidden tabs, text is 100% blurred out, mouse cannot touch or click, and clipboard copy-paste is completely blocked.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleBlurHiddenTabs}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${isBlurHiddenTabs ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                      {isBlurHiddenTabs ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Full Blur Enforced (Click to Disable)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Click to Enforce Full Blur</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Granular Tab Permission Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Individual Tab Permissions &amp; Line-Item Visibility
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Changes apply immediately
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden bg-white">
                  {tabConfigs.map((tab) => (
                    <div
                      key={tab.key}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        !tab.enabled || tab.hidden ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">{tab.label}</span>
                          {tab.enabled ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Enabled
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                              Disabled (No Access)
                            </span>
                          )}

                          {tab.hidden ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700 border border-slate-300">
                              Hidden from Line Item
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                              Visible in Nav
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {tab.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        {/* Enable Permit Toggle */}
                        <button
                          onClick={() => handleToggleEnable(tab.key, tab.enabled)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                            tab.enabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                          }`}
                          title={tab.enabled ? 'Click to Disable Access' : 'Click to Permit Access'}
                        >
                          {tab.enabled ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Permitted</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>

                        {/* Hide from Line Item Toggle */}
                        <button
                          onClick={() => handleToggleHide(tab.key, tab.hidden)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                            !tab.hidden
                              ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                              : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                          }`}
                          title={tab.hidden ? 'Click to show in header line item' : 'Click to hide from header line item'}
                        >
                          {!tab.hidden ? (
                            <>
                              <Eye className="w-3 h-3 text-blue-600" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-600" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Passcode Configuration Accordion */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Security &amp; PIN Management
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPinChange(!showPinChange)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    {showPinChange ? 'Hide PIN Form' : 'Change Admin PIN'}
                  </button>
                </div>

                {showPinChange && (
                  <form onSubmit={handleChangePinSubmit} className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Current PIN
                        </label>
                        <input
                          type="password"
                          value={currentPin}
                          onChange={(e) => setCurrentPin(e.target.value)}
                          placeholder="Current PIN (admin123)"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          New Passcode PIN (min 4 chars)
                        </label>
                        <input
                          type="password"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="New PIN"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {pinChangeStatus && (
                      <p
                        className={`text-xs font-medium flex items-center gap-1 ${
                          pinChangeStatus.success ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {pinChangeStatus.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {pinChangeStatus.message}
                      </p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        Update PIN
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {isAdmin ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin mode active. Close modal to continue.
              </span>
            ) : (
              <span>Locked. Ordinary examinee view is restricted by active rules.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
