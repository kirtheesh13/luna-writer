/**
 * Luna Writer - Customization Settings Page
 */

class SettingsPage {
  static async render(container) {
    const s = LunaState.settings;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-top">
          <span class="page-category-badge">Personalization</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Appearance &amp; Reader Engine</span>
        </div>
        <h1 class="page-title">Customization Settings</h1>
        <p class="page-description">
          Tailor Luna Writer to your visual comfort. Customize themes, reading typography, layout density, 
          and card borders with real-time live preview.
        </p>
      </div>

      <div class="settings-grid">
        <!-- Main Controls Panel -->
        <div class="settings-panel">
          <!-- 1. Theme Selection -->
          <div class="settings-group">
            <div class="settings-label-title">
              <span>Theme Appearance</span>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);" id="theme-active-label">Light Default</span>
            </div>
            <div class="settings-label-sub">Choose from carefully calibrated light and dark color schemes.</div>
            
            <div class="swatches-grid">
              <button class="swatch-btn ${s.theme === 'light' ? 'active' : ''}" data-theme-val="light">
                <span class="swatch-preview-dot" style="background: #ffffff; border-color: #cbd5e1;"></span>
                <span class="swatch-name">Light</span>
              </button>

              <button class="swatch-btn ${s.theme === 'dark' ? 'active' : ''}" data-theme-val="dark">
                <span class="swatch-preview-dot" style="background: #111827;"></span>
                <span class="swatch-name">Dark</span>
              </button>

              <button class="swatch-btn ${s.theme === 'sepia' ? 'active' : ''}" data-theme-val="sepia">
                <span class="swatch-preview-dot" style="background: #f4ecd8;"></span>
                <span class="swatch-name">Sepia</span>
              </button>

              <button class="swatch-btn ${s.theme === 'nord' ? 'active' : ''}" data-theme-val="nord">
                <span class="swatch-preview-dot" style="background: #2e3440;"></span>
                <span class="swatch-name">Nord</span>
              </button>

              <button class="swatch-btn ${s.theme === 'slate' ? 'active' : ''}" data-theme-val="slate">
                <span class="swatch-preview-dot" style="background: #0f172a;"></span>
                <span class="swatch-name">Slate</span>
              </button>
            </div>
          </div>

          <!-- 2. Accent Color -->
          <div class="settings-group">
            <div class="settings-label-title">
              <span>Brand Accent Color</span>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--primary);" id="accent-active-label">Indigo</span>
            </div>
            <div class="settings-label-sub">Personalize active buttons, highlights, and badge rings.</div>

            <div class="accents-flex">
              <button class="accent-circle-btn ${s.accent_color === 'indigo' ? 'active' : ''}" data-accent-val="indigo" style="background-color: #4f46e5;" title="Indigo"></button>
              <button class="accent-circle-btn ${s.accent_color === 'violet' ? 'active' : ''}" data-accent-val="violet" style="background-color: #7c3aed;" title="Violet"></button>
              <button class="accent-circle-btn ${s.accent_color === 'emerald' ? 'active' : ''}" data-accent-val="emerald" style="background-color: #059669;" title="Emerald"></button>
              <button class="accent-circle-btn ${s.accent_color === 'amber' ? 'active' : ''}" data-accent-val="amber" style="background-color: #d97706;" title="Amber"></button>
              <button class="accent-circle-btn ${s.accent_color === 'rose' ? 'active' : ''}" data-accent-val="rose" style="background-color: #e11d48;" title="Rose"></button>
              <button class="accent-circle-btn ${s.accent_color === 'sky' ? 'active' : ''}" data-accent-val="sky" style="background-color: #0284c7;" title="Sky"></button>
            </div>
          </div>

          <!-- 3. Font Family Selection -->
          <div class="settings-group">
            <div class="settings-label-title">Reading Typography</div>
            <div class="settings-label-sub">Select the typeface optimized for your reading preference.</div>

            <div class="fonts-grid">
              <button class="font-card-btn ${s.font_family === 'sans' ? 'active' : ''}" data-font-val="sans" style="font-family: var(--font-sans);">
                <div class="font-card-name">Inter (Modern Sans)</div>
                <div class="font-card-sample">Clean, crisp geometric clarity</div>
              </button>

              <button class="font-card-btn ${s.font_family === 'serif' ? 'active' : ''}" data-font-val="serif" style="font-family: var(--font-serif);">
                <div class="font-card-name">Merriweather (Classic Serif)</div>
                <div class="font-card-sample">Editorial bookish reading style</div>
              </button>

              <button class="font-card-btn ${s.font_family === 'mono' ? 'active' : ''}" data-font-val="mono" style="font-family: var(--font-mono);">
                <div class="font-card-name">JetBrains Mono (Code/Draft)</div>
                <div class="font-card-sample">Even spacing and structural focus</div>
              </button>

              <button class="font-card-btn ${s.font_family === 'lexend' ? 'active' : ''}" data-font-val="lexend" style="font-family: var(--font-lexend);">
                <div class="font-card-name">Lexend (Dyslexic-Friendly)</div>
                <div class="font-card-sample">Engineered to reduce visual stress</div>
              </button>
            </div>
          </div>

          <!-- 4. Reading Font Size Slider -->
          <div class="settings-group">
            <div class="settings-label-title">
              <span>Text Size</span>
              <span class="slider-val-badge" id="val-font-size">${s.font_size || 16}px</span>
            </div>
            <div class="slider-control-row">
              <span style="font-size: 0.8rem; color: var(--text-faint);">12px</span>
              <input type="range" class="settings-slider" id="slider-font-size" min="12" max="24" step="1" value="${s.font_size || 16}" />
              <span style="font-size: 0.8rem; color: var(--text-faint);">24px</span>
            </div>
          </div>

          <!-- 5. Line Spacing -->
          <div class="settings-group">
            <div class="settings-label-title">Line Spacing (Leading)</div>
            <div class="btn-cluster" id="cluster-line-spacing">
              <button class="cluster-btn ${s.line_spacing === 'compact' ? 'active' : ''}" data-val="compact">Compact (1.5x)</button>
              <button class="cluster-btn ${s.line_spacing === 'normal' ? 'active' : ''}" data-val="normal">Normal (1.8x)</button>
              <button class="cluster-btn ${s.line_spacing === 'relaxed' ? 'active' : ''}" data-val="relaxed">Relaxed (2.1x)</button>
            </div>
          </div>

          <!-- 6. Reading Column Width -->
          <div class="settings-group">
            <div class="settings-label-title">Reading Column Width</div>
            <div class="btn-cluster" id="cluster-reading-width">
              <button class="cluster-btn ${s.reading_width === 'narrow' ? 'active' : ''}" data-val="narrow">Narrow (640px)</button>
              <button class="cluster-btn ${s.reading_width === 'medium' ? 'active' : ''}" data-val="medium">Medium (780px)</button>
              <button class="cluster-btn ${s.reading_width === 'wide' ? 'active' : ''}" data-val="wide">Wide (920px)</button>
            </div>
          </div>

          <!-- 7. Interface Density -->
          <div class="settings-group">
            <div class="settings-label-title">Interface Density</div>
            <div class="btn-cluster" id="cluster-density">
              <button class="cluster-btn ${s.interface_density === 'compact' ? 'active' : ''}" data-val="compact">Compact</button>
              <button class="cluster-btn ${s.interface_density === 'comfortable' ? 'active' : ''}" data-val="comfortable">Comfortable</button>
              <button class="cluster-btn ${s.interface_density === 'spacious' ? 'active' : ''}" data-val="spacious">Spacious</button>
            </div>
          </div>

          <!-- 8. Card Styles -->
          <div class="settings-group">
            <div class="settings-label-title">Card Aesthetic Style</div>
            <div class="btn-cluster" id="cluster-card-style">
              <button class="cluster-btn ${s.card_style === 'bordered' ? 'active' : ''}" data-val="bordered">Bordered</button>
              <button class="cluster-btn ${s.card_style === 'shadow' ? 'active' : ''}" data-val="shadow">Shadow</button>
              <button class="cluster-btn ${s.card_style === 'flat' ? 'active' : ''}" data-val="flat">Flat</button>
              <button class="cluster-btn ${s.card_style === 'glass' ? 'active' : ''}" data-val="glass">Glass</button>
            </div>
          </div>

          <!-- Actions Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <button class="btn btn-ghost" id="btn-reset-defaults" style="color: var(--color-danger);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Reset to default
            </button>
            <span style="font-size: 0.8rem; color: var(--text-faint);">
              Preferences saved automatically
            </span>
          </div>
        </div>

        <!-- Sticky Live Preview Column -->
        <aside class="settings-preview-sticky">
          <span class="preview-badge">Live Interactive Preview</span>
          
          <div class="live-preview-box luna-card" id="settings-live-preview-card">
            <div class="card-top" style="margin-bottom: 0.5rem;">
              <span class="badge-level badge-level-b1">CEFR B1</span>
              <span style="font-size: 0.75rem; color: var(--text-faint);">2 min read</span>
            </div>
            <h4 class="preview-title" id="preview-sample-title">A Morning Walk by the River</h4>
            <div class="preview-body-text" id="preview-sample-body">
              <p style="margin-bottom: 0.75rem;">
                The morning sun was warming the stone bridge as Leo paused to watch the rowing boats. 
                Because the water was calm, each stroke made gentle ripples that reflected against the green riverbank.
              </p>
              <p>
                He took a deep breath of fresh morning air and smiled, knowing that his weekend had just begun.
              </p>
            </div>
            <div class="card-bottom" style="margin-top: 1rem;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">Preview Mode</span>
              <button class="btn btn-primary btn-sm" style="pointer-events: none;">Sample Action</button>
            </div>
          </div>

          <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
            ✨ Every slider and selector immediately updates this card and your entire website session.
          </div>
        </aside>
      </div>
    `;

    this._setupSettingsEvents(container);
  }

  static _setupSettingsEvents(container) {
    // Theme buttons
    container.querySelectorAll('[data-theme-val]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-theme-val]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.getAttribute('data-theme-val');
        container.querySelector('#theme-active-label').textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        LunaState.updateSettings({ theme });
      });
    });

    // Accent buttons
    container.querySelectorAll('[data-accent-val]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-accent-val]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const accent = btn.getAttribute('data-accent-val');
        container.querySelector('#accent-active-label').textContent = accent.charAt(0).toUpperCase() + accent.slice(1);
        LunaState.updateSettings({ accent_color: accent });
      });
    });

    // Font buttons
    container.querySelectorAll('[data-font-val]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-font-val]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        LunaState.updateSettings({ font_family: btn.getAttribute('data-font-val') });
      });
    });

    // Font size slider
    const sizeSlider = container.querySelector('#slider-font-size');
    const sizeBadge = container.querySelector('#val-font-size');
    sizeSlider.addEventListener('input', () => {
      const val = parseInt(sizeSlider.value);
      sizeBadge.textContent = `${val}px`;
      LunaState.updateSettings({ font_size: val });
    });

    // Cluster helper
    const setupCluster = (clusterId, settingKey) => {
      const cluster = container.querySelector(clusterId);
      if (!cluster) return;
      cluster.querySelectorAll('.cluster-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          cluster.querySelectorAll('.cluster-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          LunaState.updateSettings({ [settingKey]: btn.getAttribute('data-val') });
        });
      });
    };

    setupCluster('#cluster-line-spacing', 'line_spacing');
    setupCluster('#cluster-reading-width', 'reading_width');
    setupCluster('#cluster-density', 'interface_density');
    setupCluster('#cluster-card-style', 'card_style');

    // Reset button
    container.querySelector('#btn-reset-defaults').addEventListener('click', async () => {
      if (confirm('Reset all customization preferences back to default SaaS light theme?')) {
        await LunaState.resetSettings();
        // Re-render settings view
        SettingsPage.render(container);
      }
    });
  }
}

window.SettingsPage = SettingsPage;
