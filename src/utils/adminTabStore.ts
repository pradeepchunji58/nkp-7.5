import { TabKey, TabPermission } from '../types';

export interface TabConfig {
  key: TabKey;
  label: string;
  enabled: boolean; // whether users can access the tab
  hidden: boolean;  // whether tab is visible in top navigation line item
  description: string;
}

const STORAGE_KEY_PERMISSIONS = 'nkp_admin_tab_permissions_v3';
const STORAGE_KEY_PIN = 'nkp_admin_pin_v1';
const STORAGE_KEY_AUTH = 'nkp_admin_session_auth_v1';
const STORAGE_KEY_BLUR_DEEP_DIVE = 'nkp_admin_blur_deep_dive_v1';
const STORAGE_KEY_BLUR_HIDDEN_TABS = 'nkp_admin_blur_hidden_tabs_v1';
const DEFAULT_PIN = 'admin123';

export const INITIAL_TAB_CONFIGS: TabConfig[] = [
  {
    key: 'prerequisites',
    label: 'Bastion Guidance and Practice',
    enabled: true,
    hidden: false,
    description: 'Detailed operational checklist for bastion host setup and air-gapped readiness.',
  },
  {
    key: 'practice-mode',
    label: 'NCP-CN 7.5 Pre-Exam Simulation',
    enabled: true,
    hidden: false,
    description: 'Timed multi-question examination simulator with scoring and pass/fail metrics.',
  },
  {
    key: 'exam-question',
    label: 'NKP Exam Questions',
    enabled: true,
    hidden: false,
    description: 'Standard practice question cards with live answer review and TTS audio.',
  },
  {
    key: 'series-manager',
    label: 'Arranging Series',
    enabled: true,
    hidden: false,
    description: 'Swap question sequence, move questions across the series, or shuffle question pool with dynamic numbering.',
  },
  {
    key: 'add-question',
    label: 'Edit and Question',
    enabled: true,
    hidden: false,
    description: 'Create and edit exam questions, configure multiple options and terminal commands, and manage screenshot exhibits.',
  },
  {
    key: 'local-setup',
    label: 'Windows Setup',
    enabled: true,
    hidden: false,
    description: 'Local development and desktop container setup guidance.',
  },
  {
    key: 'ask-ai',
    label: 'Ask AI Assistant',
    enabled: true,
    hidden: false,
    description: 'Interactive AI Solutions Architect chatbot for Nutanix questions.',
  },
];

class AdminTabStore {
  private listeners: Array<() => void> = [];
  private tabConfigs: Map<TabKey, TabConfig> = new Map();
  private adminPin: string = DEFAULT_PIN;
  private isAuthenticated: boolean = false;
  private isDeepDivePermanentlyBlurred: boolean = true;
  private isBlurHiddenTabs: boolean = true;

  constructor() {
    this.loadState();
  }

  private loadState() {
    // Load PIN
    try {
      const savedPin = localStorage.getItem(STORAGE_KEY_PIN);
      if (savedPin) {
        this.adminPin = savedPin;
      }
    } catch (e) {
      console.warn('Could not read admin pin from storage', e);
    }

    // Load auth status
    try {
      const savedAuth = sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth === 'true') {
        this.isAuthenticated = true;
      }
    } catch (e) {
      // ignore
    }

    // Load blur settings
    try {
      const savedBlurDeepDive = localStorage.getItem(STORAGE_KEY_BLUR_DEEP_DIVE);
      if (savedBlurDeepDive !== null) {
        this.isDeepDivePermanentlyBlurred = savedBlurDeepDive === 'true';
      }
      const savedBlurHidden = localStorage.getItem(STORAGE_KEY_BLUR_HIDDEN_TABS);
      if (savedBlurHidden !== null) {
        this.isBlurHiddenTabs = savedBlurHidden === 'true';
      }
    } catch (e) {
      // ignore
    }

    // Load tab permissions
    try {
      const savedPerms = localStorage.getItem(STORAGE_KEY_PERMISSIONS);
      if (savedPerms) {
        const parsed = JSON.parse(savedPerms) as Record<TabKey, { enabled: boolean; hidden: boolean }>;
        INITIAL_TAB_CONFIGS.forEach((item) => {
          const override = parsed[item.key];
          this.tabConfigs.set(item.key, {
            ...item,
            enabled: override !== undefined ? Boolean(override.enabled) : item.enabled,
            hidden: override !== undefined ? Boolean(override.hidden) : item.hidden,
          });
        });
        // Purge any removed tabs from previous storage
        this.tabConfigs.delete('deep-dive' as any);
        return;
      }
    } catch (e) {
      console.warn('Could not read tab permissions from storage', e);
    }

    // Default initialization
    INITIAL_TAB_CONFIGS.forEach((item) => {
      this.tabConfigs.set(item.key, { ...item });
    });
  }

  private saveState() {
    try {
      const mapObj: Record<string, { enabled: boolean; hidden: boolean }> = {};
      this.tabConfigs.forEach((val, key) => {
        mapObj[key] = { enabled: val.enabled, hidden: val.hidden };
      });
      localStorage.setItem(STORAGE_KEY_PERMISSIONS, JSON.stringify(mapObj));
      localStorage.setItem(STORAGE_KEY_PIN, this.adminPin);
      localStorage.setItem(STORAGE_KEY_BLUR_DEEP_DIVE, this.isDeepDivePermanentlyBlurred ? 'true' : 'false');
      localStorage.setItem(STORAGE_KEY_BLUR_HIDDEN_TABS, this.isBlurHiddenTabs ? 'true' : 'false');
      sessionStorage.setItem(STORAGE_KEY_AUTH, this.isAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.warn('Could not save admin tab state', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Listener notification error', e);
      }
    });
  }

  public getAllConfigs(): TabConfig[] {
    return Array.from(this.tabConfigs.values());
  }

  public getConfig(key: TabKey): TabConfig {
    return (
      this.tabConfigs.get(key) || {
        key,
        label: key,
        enabled: true,
        hidden: false,
        description: '',
      }
    );
  }

  public isTabEnabled(key: TabKey): boolean {
    const cfg = this.tabConfigs.get(key);
    return cfg ? cfg.enabled : true;
  }

  public isTabHidden(key: TabKey): boolean {
    const cfg = this.tabConfigs.get(key);
    return cfg ? cfg.hidden : false;
  }

  public isUserAdmin(): boolean {
    return this.isAuthenticated;
  }

  public isDeepDiveBlurred(): boolean {
    if (this.isAuthenticated) return false;
    return this.isDeepDivePermanentlyBlurred;
  }

  public isDeepDivePermanentlyBlurredSetting(): boolean {
    return this.isDeepDivePermanentlyBlurred;
  }

  public setDeepDiveBlurred(blurred: boolean): void {
    this.isDeepDivePermanentlyBlurred = blurred;
    this.saveState();
    this.notify();
  }

  public isBlurHiddenTabsActive(): boolean {
    return this.isBlurHiddenTabs;
  }

  public setBlurHiddenTabs(active: boolean): void {
    this.isBlurHiddenTabs = active;
    this.saveState();
    this.notify();
  }

  /**
   * Check if a tab should be rendered with complete blur focus, no touch/click, and no copy-paste
   */
  public isTabBlurLocked(key: TabKey): boolean {
    if (this.isAuthenticated) return false;
    if (!this.isBlurHiddenTabs) return false;
    const cfg = this.tabConfigs.get(key);
    if (!cfg) return false;
    return !cfg.enabled || cfg.hidden;
  }

  public verifyPin(pin: string): boolean {
    if (pin.trim() === this.adminPin.trim()) {
      this.isAuthenticated = true;
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  public lockAdmin(): void {
    this.isAuthenticated = false;
    this.saveState();
    this.notify();
  }

  public changePin(oldPin: string, newPin: string): { success: boolean; message: string } {
    if (oldPin.trim() !== this.adminPin.trim()) {
      return { success: false, message: 'Current Admin PIN is incorrect.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: 'New PIN must be at least 4 characters.' };
    }
    this.adminPin = newPin.trim();
    this.saveState();
    this.notify();
    return { success: true, message: 'Admin PIN updated successfully.' };
  }

  public updateTabPermission(key: TabKey, partial: { enabled?: boolean; hidden?: boolean }): void {
    const current = this.tabConfigs.get(key);
    if (!current) return;

    this.tabConfigs.set(key, {
      ...current,
      enabled: partial.enabled !== undefined ? partial.enabled : current.enabled,
      hidden: partial.hidden !== undefined ? partial.hidden : current.hidden,
    });
    this.saveState();
    this.notify();
  }

  /**
   * One-click presets
   */
  public applyPreset(preset: 'simulation-only' | 'all-unlocked' | 'study-mode'): void {
    if (preset === 'simulation-only') {
      // Main tab is always show that stimulation tab. Rest of them, lock to hide in top line item!
      this.tabConfigs.forEach((cfg, key) => {
        if (key === 'practice-mode') {
          cfg.enabled = true;
          cfg.hidden = false;
        } else {
          cfg.enabled = false;
          cfg.hidden = true;
        }
      });
    } else if (preset === 'all-unlocked') {
      this.tabConfigs.forEach((cfg) => {
        cfg.enabled = true;
        cfg.hidden = false;
      });
    } else if (preset === 'study-mode') {
      // Keep Questions, Simulation, Prerequisites, Deep Dive enabled and visible
      // Hide & disable creator and admin
      this.tabConfigs.forEach((cfg, key) => {
        if (key === 'add-question') {
          cfg.enabled = false;
          cfg.hidden = true;
        } else {
          cfg.enabled = true;
          cfg.hidden = false;
        }
      });
    }
    this.saveState();
    this.notify();
  }

  public resetToDefaults(): void {
    INITIAL_TAB_CONFIGS.forEach((item) => {
      this.tabConfigs.set(item.key, { ...item });
    });
    this.adminPin = DEFAULT_PIN;
    this.isDeepDivePermanentlyBlurred = true;
    this.isBlurHiddenTabs = true;
    this.saveState();
    this.notify();
  }
}

export const adminTabStore = new AdminTabStore();
