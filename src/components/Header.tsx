import React, { useState, useEffect } from 'react';
import {
  Volume2,
  HelpCircle,
  Lock,
  Unlock,
  Download,
  Monitor,
  PlayCircle,
  Award,
  PlusCircle,
  Maximize2,
  Minimize2,
  ArrowUpDown,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Layers
} from 'lucide-react';
import { NutanixLogo } from './NutanixLogo';
import { adminTabStore } from '../utils/adminTabStore';

export type NavTab =
  | 'exam-question'
  | 'series-manager'
  | 'prerequisites'
  | 'practice-mode'
  | 'add-question'
  | 'ask-ai'
  | 'local-setup';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  isAudioPlaying: boolean;
  isWideScreen?: boolean;
  onToggleWideScreen?: () => void;
  onOpenAdminProtection?: () => void;
}

interface TabDef {
  id: NavTab;
  label: string;
  shortLabel: string;
  badge?: string;
  icon: any;
  orderNumber: number;
}

const ORDERED_TABS: TabDef[] = [
  {
    id: 'prerequisites',
    label: '1. Bastion Guidance and Practice',
    shortLabel: 'Bastion Guidance',
    icon: Award,
    orderNumber: 1,
  },
  {
    id: 'practice-mode',
    label: '2. NCP-CN 7.5 Pre-Exam Simulation',
    shortLabel: 'NCP-CN Pre-Exam Sim',
    badge: '90m',
    icon: PlayCircle,
    orderNumber: 2,
  },
  {
    id: 'exam-question',
    label: '3. NKP Exam Questions',
    shortLabel: 'NKP Questions',
    icon: HelpCircle,
    orderNumber: 3,
  },
  {
    id: 'series-manager',
    label: '4. Arranging Series',
    shortLabel: 'Arranging Series',
    icon: ArrowUpDown,
    orderNumber: 4,
  },
  {
    id: 'add-question',
    label: '5. Edit and Question',
    shortLabel: 'Edit and Question',
    icon: PlusCircle,
    orderNumber: 5,
  },
  {
    id: 'local-setup',
    label: '6. Windows Setup',
    shortLabel: 'Windows Setup',
    icon: Monitor,
    orderNumber: 6,
  },
  {
    id: 'ask-ai',
    label: '7. Ask AI Assistant',
    shortLabel: 'Ask AI Assistant',
    badge: 'Gemini',
    icon: Sparkles,
    orderNumber: 7,
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentQuestionIndex,
  totalQuestions,
  isAudioPlaying,
  isWideScreen = true,
  onToggleWideScreen,
  onOpenAdminProtection,
}) => {
  const [isAdmin, setIsAdmin] = useState(adminTabStore.isUserAdmin());
  const [, setVersion] = useState(0);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const unsub = adminTabStore.subscribe(() => {
      setIsAdmin(adminTabStore.isUserAdmin());
      setVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  // Listen for scroll to auto-hide the top black banner when scrolling down on all screens
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // When scrolling down past 50px, hide banner
          if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            setIsScrolledDown(true);
          } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
            setIsScrolledDown(false);
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldRenderTab = (tab: NavTab) => {
    return !adminTabStore.isTabHidden(tab);
  };

  const currentTabMeta = ORDERED_TABS.find((t) => t.id === activeTab) || ORDERED_TABS[0];

  return (
    <>
      {/* MOBILE / TABLET FLOATING TAB CHOOSER (Hidden on desktop lg:hidden)
          This completely eliminates the bulky black header on mobile/tablet so the entire screen is free!
          The user can tap to choose tabs ("until what we are choosing, that bastion guiding practice..."),
          and once chosen, the black banner disappears! */}
      <div
        className={`lg:hidden fixed top-3 left-3 z-40 transition-all duration-300 ${
          isScrolledDown ? 'opacity-30 hover:opacity-100 -translate-y-1' : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer active:scale-95 transition-all backdrop-blur-md"
          title="Tap to switch between Bastion Guidance, Pre-Exam Sim, Questions, and other tabs"
        >
          <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 p-0.5">
            <NutanixLogo className="w-3.5 h-3.5" />
          </div>
          <span className="text-emerald-400 font-mono text-[11px] font-extrabold">
            {currentTabMeta.orderNumber}.
          </span>
          <span className="max-w-[140px] xs:max-w-[200px] truncate">{currentTabMeta.shortLabel}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* MOBILE / TABLET TAB SELECTION MODAL DRAWER
          Opened only when the user taps to choose their tab. Once selected, it closes and leaves the screen completely clear! */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-slate-800 text-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            {/* Header of Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 p-1.5">
                  <NutanixLogo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Switch Active Tab
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">NCP-CN 7.5 • Nutanix Kubernetes Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of 7 Tabs */}
            <div className="space-y-1.5">
              {ORDERED_TABS.filter((tab) => shouldRenderTab(tab.id)).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.id === 'exam-question' && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold ${
                          isActive ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {totalQuestions} Qs
                      </span>
                    )}

                    {tab.id === 'practice-mode' && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold ${
                          isActive ? 'bg-slate-900 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        90m Sim
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              {onOpenAdminProtection && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenAdminProtection();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Lock</span>
                </button>
              )}

              <a
                href="/api/download-zip"
                download="nkp-exam-app.zip"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ZIP</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP STICKY HEADER (Hidden on mobile/tablet <lg to keep screen clear, and auto-hides on scroll down on all screens!) */}
      <header
        className={`hidden lg:block bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md transition-transform duration-300 ease-in-out ${
          isScrolledDown ? '-translate-y-full pointer-events-none' : 'translate-y-0'
        }`}
      >
        <div
          className={`w-full px-4 sm:px-6 lg:px-8 xl:px-10 transition-all ${
            isWideScreen ? 'max-w-none' : 'max-w-[1720px] mx-auto'
          }`}
        >
          {/* Top Brand and Controls Row */}
          <div className="flex flex-row items-center justify-between py-3 gap-4">
            {/* Brand & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-md flex-shrink-0 p-2 text-emerald-400">
                <NutanixLogo className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-mono">
                    Nutanix Kubernetes Platform
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 font-mono">
                    NCP-CN 7.5
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                    NKP v2.x
                  </span>
                </div>
                <h1 className="text-sm lg:text-base font-bold text-white tracking-tight">
                  Bastion Host Examiner &amp; Architecture Guide
                </h1>
              </div>
            </div>

            {/* Actions & TTS Status */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Admin Protection Button */}
              {onOpenAdminProtection && (
                <button
                  type="button"
                  onClick={onOpenAdminProtection}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer border ${
                    isAdmin
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30'
                  }`}
                  title="Configure Admin Tab Access and Exam Lockdown"
                >
                  {isAdmin ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin (Unlocked)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Admin Lock</span>
                    </>
                  )}
                </button>
              )}

              {/* Wide Screen / Full Width Toggle */}
              {onToggleWideScreen && (
                <button
                  type="button"
                  onClick={onToggleWideScreen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all shadow-sm active:scale-95 cursor-pointer"
                  title={isWideScreen ? 'Switch to Standard Boxed Width' : 'Expand to Full Screen Fluid Width'}
                >
                  {isWideScreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Boxed</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full Screen</span>
                    </>
                  )}
                </button>
              )}

              {/* Export ZIP Download */}
              <a
                href="/api/download-zip"
                download="nkp-exam-app.zip"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Download project ZIP"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.zip)</span>
              </a>

              {/* AI TTS Status */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isAudioPlaying
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Gemini TTS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Ordered strictly: 1. Bastion Guidance, 2. Pre-Exam Sim, 3. Exam Questions, 4. Arranging Series, 5. Edit and Question, 6. Windows Setup, 7. Ask AI) */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-xs font-medium border-t border-slate-800/80 pt-2">
            {ORDERED_TABS.filter((tab) => shouldRenderTab(tab.id)).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'exam-question' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {totalQuestions}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
};
