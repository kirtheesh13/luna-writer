/**
 * Luna Writer - Client-Side Router
 * Handles SPA navigation across /, /stories, /letters, /articles, /emails, /studio, /my-writing, /settings
 */

class Router {
  static routes = {
    '/': (container) => HomePage.render(container),
    '/stories': (container) => CategoryPage.render(container, 'stories'),
    '/letters': (container) => CategoryPage.render(container, 'letters'),
    '/articles': (container) => CategoryPage.render(container, 'articles'),
    '/emails': (container) => CategoryPage.render(container, 'emails'),
    '/studio': (container, params) => StudioPage.render(container, params.get('edit')),
    '/my-writing': (container) => MyWritingPage.render(container),
    '/settings': (container) => SettingsPage.render(container)
  };

  static init() {
    window.addEventListener('popstate', () => {
      this.resolve();
    });

    // Intercept clicks on links with data-nav or href starting with /
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.getAttribute('target') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });

    this.resolve();
  }

  static navigate(path) {
    if (window.location.pathname + window.location.search !== path) {
      window.history.pushState({}, '', path);
    }
    this.resolve();
  }

  static resolve() {
    const fullPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const container = document.getElementById('app-main-view');
    if (!container) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('mobile-open');

    // Find matching route handler
    const handler = this.routes[fullPath] || this.routes['/'];
    handler(container, urlParams);

    // Update active nav links
    this._updateActiveNav(fullPath);

    // Update page title
    this._updateTitle(fullPath);
  }

  static _updateActiveNav(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '/' && href === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  static _updateTitle(path) {
    const titles = {
      '/': 'Luna Writer — Cambridge B1 English Reading, Writing & AI Review',
      '/stories': 'Stories — Luna Writer',
      '/letters': 'Letters — Luna Writer',
      '/articles': 'Articles — Luna Writer',
      '/emails': 'Emails — Luna Writer',
      '/studio': 'Writing Studio — Luna Writer',
      '/my-writing': 'My Writing & Library — Luna Writer',
      '/settings': 'Customization Settings — Luna Writer'
    };
    document.title = titles[path] || 'Luna Writer';
  }
}

window.Router = Router;
