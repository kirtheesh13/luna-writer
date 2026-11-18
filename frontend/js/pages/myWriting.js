/**
 * Luna Writer - My Writing Dashboard Page
 */

class MyWritingPage {
  static activeTab = 'drafts';

  static async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-top">
          <span class="page-category-badge">Personal Dashboard</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Manage Your Content</span>
        </div>
        <h1 class="page-title">My Writing &amp; Library</h1>
        <p class="page-description">
          Review your private drafts, published works, saved bookmarks, and historical Cambridge B1 evaluations.
        </p>
      </div>

      <!-- Tabs Header -->
      <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem; overflow-x: auto;">
        <button class="nav-link ${this.activeTab === 'drafts' ? 'active' : ''}" data-tab="drafts" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <span>📝 Private Drafts</span>
          <span class="nav-link-badge" id="tab-count-drafts">0</span>
        </button>
        <button class="nav-link ${this.activeTab === 'published' ? 'active' : ''}" data-tab="published" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <span>🌐 Published Works</span>
          <span class="nav-link-badge" id="tab-count-published">0</span>
        </button>
        <button class="nav-link ${this.activeTab === 'bookmarks' ? 'active' : ''}" data-tab="bookmarks" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <span>🔖 Bookmarks</span>
          <span class="nav-link-badge" id="tab-count-bookmarks">0</span>
        </button>
        <button class="nav-link ${this.activeTab === 'reviews' ? 'active' : ''}" data-tab="reviews" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <span>📊 B1 Review History</span>
          <span class="nav-link-badge" id="tab-count-reviews">0</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="tab-content-area">
        <div class="empty-state">
          <div class="empty-state-title">Loading your items...</div>
        </div>
      </div>
    `;

    this._setupTabLogic(container);
  }

  static async _setupTabLogic(container) {
    const tabButtons = container.querySelectorAll('[data-tab]');
    const contentArea = container.querySelector('#tab-content-area');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.getAttribute('data-tab');
        this._loadActiveTabData(contentArea, container);
      });
    });

    // Populate all badge counts immediately on page load
    this._refreshAllTabCounts(container);

    await this._loadActiveTabData(contentArea, container);
  }

  static async _refreshAllTabCounts(container) {
    try {
      const [drafts, published, bookmarks, reviews] = await Promise.all([
        LunaApi.getWritings({ status: 'draft', only_user: true }).catch(() => []),
        LunaApi.getWritings({ status: 'published', only_user: true }).catch(() => []),
        LunaApi.getBookmarks().catch(() => []),
        LunaApi.getReviewHistory().catch(() => [])
      ]);
      const draftsEl = container.querySelector('#tab-count-drafts');
      const pubEl = container.querySelector('#tab-count-published');
      const bmEl = container.querySelector('#tab-count-bookmarks');
      const revEl = container.querySelector('#tab-count-reviews');

      if (draftsEl) draftsEl.textContent = drafts.length;
      if (pubEl) pubEl.textContent = published.length;
      if (bmEl) bmEl.textContent = bookmarks.length;
      if (revEl) revEl.textContent = reviews.length;
    } catch (_) {}
  }

  static async _loadActiveTabData(contentArea, container) {
    contentArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Loading...</div>
      </div>
    `;

    try {
      if (this.activeTab === 'drafts') {
        const items = await LunaApi.getWritings({ status: 'draft', only_user: true });
        const badge = container.querySelector('#tab-count-drafts');
        if (badge) badge.textContent = items.length;
        this._renderWritingItems(contentArea, items, 'No drafts yet', 'Start drafting in the Writing Studio to keep your work private while you write.', true);
      } 
      else if (this.activeTab === 'published') {
        const items = await LunaApi.getWritings({ status: 'published', only_user: true });
        const badge = container.querySelector('#tab-count-published');
        if (badge) badge.textContent = items.length;
        this._renderWritingItems(contentArea, items, 'No published pieces', 'When you are ready to share a story, letter, article, or email, publish it from the studio.', true);
      }
      else if (this.activeTab === 'bookmarks') {
        const items = await LunaApi.getBookmarks();
        const badge = container.querySelector('#tab-count-bookmarks');
        if (badge) badge.textContent = items.length;
        this._renderWritingItems(contentArea, items, 'No bookmarks saved', 'Click the bookmark ribbon on any story or article card to save it for offline practice.', false);
      }
      else if (this.activeTab === 'reviews') {
        const reviews = await LunaApi.getReviewHistory();
        const badge = container.querySelector('#tab-count-reviews');
        if (badge) badge.textContent = reviews.length;
        this._renderReviewHistory(contentArea, reviews);
      }
    } catch (err) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <h3 class="empty-state-title" style="color: var(--color-danger);">Could not load items</h3>
          <p class="empty-state-text">${err.message}</p>
        </div>
      `;
    }
  }

  static _renderWritingItems(contentArea, items, emptyTitle, emptyDesc, showOwnerActions) {
    if (!items || items.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <h3 class="empty-state-title">${emptyTitle}</h3>
          <p class="empty-state-text">${emptyDesc}</p>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('/studio')">
            Create in Studio
          </button>
        </div>
      `;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'cards-grid';
    items.forEach(item => {
      grid.appendChild(WritingCard.render(item, { showOwnerActions }));
    });
    contentArea.innerHTML = '';
    contentArea.appendChild(grid);
  }

  static _renderReviewHistory(contentArea, reviews) {
    if (!reviews || reviews.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 class="empty-state-title">No past reviews yet</h3>
          <p class="empty-state-text">
            Submit your writing in the Writing Studio to receive comprehensive Cambridge B1 suitability reports.
          </p>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('/studio')">
            Submit Writing for Review
          </button>
        </div>
      `;
      return;
    }

    const list = document.createElement('div');
    list.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';

    reviews.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'luna-card';
      card.style.cursor = 'default';

      const dateStr = rev.created_at ? new Date(rev.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : 'Recent';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge-level badge-level-${(rev.estimated_level || 'b1').toLowerCase().slice(0, 2)}">
              CEFR ${rev.estimated_level || 'B1'}
            </span>
            <span style="font-weight: 700; font-size: 1.05rem;">${escapeHtml(rev.title || 'Untitled Piece')}</span>
            <span class="page-category-badge">${escapeHtml(rev.category || 'stories')}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-faint);">${dateStr}</span>
        </div>

        <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">
          ${escapeHtml(rev.overall_explanation)}
        </p>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--primary);">
            Suitability Score: ${rev.suitability_score || 80}/100 • ${escapeHtml(rev.suitability_verdict)}
          </span>
          <button class="btn btn-primary btn-sm" id="view-rev-${rev.id}">
            View Full Report
          </button>
        </div>
      `;

      card.querySelector(`#view-rev-${rev.id}`).addEventListener('click', () => {
        ReviewModal.open(rev);
      });

      list.appendChild(card);
    });

    contentArea.innerHTML = '';
    contentArea.appendChild(list);
  }
}

window.MyWritingPage = MyWritingPage;
