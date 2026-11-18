/**
 * Luna Writer - Central State Management & Customization Sync
 */

const LunaState = {
  // Current route state
  currentRoute: '/',
  categoryFilter: null,

  // User Customization Preferences (Default light theme SaaS)
  settings: {
    theme: 'light',
    accent_color: 'indigo',
    font_family: 'sans',
    font_size: 16,
    line_spacing: 'normal',
    reading_width: 'medium',
    interface_density: 'comfortable',
    card_style: 'bordered'
  },

  // Bookmarked writing ID set
  bookmarkedIds: new Set(),

  // Current active piece in reader modal
  activeReaderItem: null,

  // Current active review in review modal
  activeReviewData: null,

  // Load preferences from localStorage + API
  async initSettings() {
    // 1. Try LocalStorage for immediate zero-flicker render
    const local = localStorage.getItem('luna_user_settings');
    if (local) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(local) };
      } catch (_) {}
    }
    this.applySettingsToDOM();

    // 2. Fetch from backend API
    try {
      if (window.LunaApi) {
        const remote = await LunaApi.getSettings();
        if (remote) {
          this.settings = { ...this.settings, ...remote };
          localStorage.setItem('luna_user_settings', JSON.stringify(this.settings));
          this.applySettingsToDOM();
        }
      }
    } catch (e) {
      console.warn('Could not sync remote settings, using local:', e);
    }
  },

  // Apply attributes and CSS variables to the document
  applySettingsToDOM() {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', this.settings.theme || 'light');
    root.setAttribute('data-accent', this.settings.accent_color || 'indigo');
    root.setAttribute('data-font', this.settings.font_family || 'sans');
    root.setAttribute('data-density', this.settings.interface_density || 'comfortable');
    root.setAttribute('data-card-style', this.settings.card_style || 'bordered');

    // Update typography CSS variables
    root.style.setProperty('--reader-font-size', `${this.settings.font_size || 16}px`);
    
    let lh = 1.8;
    if (this.settings.line_spacing === 'compact') lh = 1.5;
    if (this.settings.line_spacing === 'relaxed') lh = 2.1;
    root.style.setProperty('--reader-line-height', String(lh));

    let rw = '780px';
    if (this.settings.reading_width === 'narrow') rw = '640px';
    if (this.settings.reading_width === 'wide') rw = '920px';
    root.style.setProperty('--reader-max-width', rw);

    // Broadcast change event
    window.dispatchEvent(new CustomEvent('luna:settings-changed', { detail: this.settings }));
  },

  async updateSettings(newPartial) {
    this.settings = { ...this.settings, ...newPartial };
    localStorage.setItem('luna_user_settings', JSON.stringify(this.settings));
    this.applySettingsToDOM();

    try {
      if (window.LunaApi) {
        await LunaApi.saveSettings(this.settings);
      }
    } catch (e) {
      console.error('Failed to persist settings to server:', e);
    }
  },

  async resetSettings() {
    try {
      if (window.LunaApi) {
        const defaults = await LunaApi.resetSettings();
        this.settings = defaults;
      }
    } catch (_) {
      this.settings = {
        theme: 'light',
        accent_color: 'indigo',
        font_family: 'sans',
        font_size: 16,
        line_spacing: 'normal',
        reading_width: 'medium',
        interface_density: 'comfortable',
        card_style: 'bordered'
      };
    }
    localStorage.setItem('luna_user_settings', JSON.stringify(this.settings));
    this.applySettingsToDOM();
    if (window.Toast) Toast.success('Preferences reset to default values.');
  },

  // Toggle bookmark
  async toggleBookmark(writingId) {
    try {
      const res = await LunaApi.toggleBookmark(writingId);
      if (res.bookmarked) {
        this.bookmarkedIds.add(writingId);
        Toast.success('Added to your bookmarks');
      } else {
        this.bookmarkedIds.delete(writingId);
        Toast.info('Removed from bookmarks');
      }
      window.dispatchEvent(new CustomEvent('luna:bookmark-toggled', { detail: res }));
      return res.bookmarked;
    } catch (err) {
      Toast.error('Could not update bookmark');
      return false;
    }
  }
};

window.LunaState = LunaState;
