/**
 * Luna Writer - Application Entrypoint
 */

class App {
  static async start() {
    console.log('%c Luna Writer 1.0.0 initializing... ', 'background: #4f46e5; color: #fff; font-weight: bold;');

    // 1. Initialize user settings and apply to DOM immediately
    await LunaState.initSettings();

    // 2. Initialize Modals
    ReaderModal.init();
    ReviewModal.init();

    // 3. Setup header controls (mobile menu toggle, quick theme toggle)
    this._setupHeaderControls();

    // 4. Check system & database status for footer badge
    this._checkSystemStatus();

    // 5. Initialize router
    Router.init();
  }

  static _setupHeaderControls() {
    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
        });
      });
    }

    // Quick Theme Switcher button in header
    const quickThemeBtn = document.getElementById('quick-theme-toggle');
    if (quickThemeBtn) {
      quickThemeBtn.addEventListener('click', () => {
        const current = LunaState.settings.theme;
        const next = current === 'dark' ? 'light' : (current === 'light' ? 'sepia' : (current === 'sepia' ? 'dark' : 'light'));
        LunaState.updateSettings({ theme: next });
        Toast.info(`Theme switched to ${next.charAt(0).toUpperCase() + next.slice(1)}`);
      });
    }
  }

  static async _checkSystemStatus() {
    try {
      const status = await LunaApi.getSystemStatus();
      const dot = document.getElementById('footer-db-dot');
      const text = document.getElementById('footer-db-text');
      if (dot && text && status.database) {
        if (status.database.is_live_mongo) {
          dot.style.backgroundColor = 'var(--color-success)';
          text.textContent = `MongoDB: Live Connected (${status.database.counts.writings} writings)`;
        } else {
          dot.style.backgroundColor = 'var(--color-warning)';
          text.textContent = `MongoDB: Embedded Mode (${status.database.counts.writings} writings)`;
        }
      }
    } catch (_) {}
  }

  // Global helper: request review from writing card
  static async requestReviewForWriting(id, title = null, category = null, content = null, sourceItem = null, targetLevel = null) {
    try {
      if (!content || !targetLevel) {
        const item = sourceItem || (await LunaApi.getWritingById(id));
        title = title || item.title;
        category = category || item.category;
        content = content || item.content;
        targetLevel = targetLevel || item.level || 'B1';
      }

      Toast.info(`Analyzing CEFR ${targetLevel} suitability with Gemini...`);
      const review = await LunaApi.evaluateB1({
        writing_id: id,
        title: title || 'Untitled Piece',
        category: category || 'stories',
        target_level: targetLevel,
        content
      });

      ReviewModal.open(review, sourceItem);
    } catch (err) {
      Toast.error('Review failed: ' + err.message);
    }
  }

  // Global helper: delete writing
  static async deleteWriting(id) {
    if (!confirm('Are you sure you want to delete this writing piece? This action cannot be undone.')) {
      return;
    }

    try {
      await LunaApi.deleteWriting(id);
      Toast.success('Writing deleted');
      // Refresh current page
      Router.resolve();
    } catch (err) {
      Toast.error('Delete failed: ' + err.message);
    }
  }
}

window.App = App;

// Bootstrap on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.start();
});
