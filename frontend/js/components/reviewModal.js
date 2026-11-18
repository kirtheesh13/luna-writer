/**
 * Luna Writer - AI Cambridge B1 Review Modal Component
 */

class ReviewModal {
  static modalEl = null;
  static currentReview = null;
  static sourceItem = null;

  static init() {
    if (this.modalEl) return;

    const overlay = document.createElement('div');
    overlay.className = 'review-modal-overlay';
    overlay.id = 'review-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Cambridge B1 Review Report');

    overlay.innerHTML = `
      <div class="review-modal-window">
        <!-- Header -->
        <div class="review-header">
          <div class="review-header-left">
            <button class="btn btn-ghost btn-sm" id="review-close-btn-left" aria-label="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Back</span>
            </button>
            <h2 class="review-header-title">CEFR B1 Review</h2>
            <span class="review-badge-demo" id="rev-engine-badge">Linguistic AI</span>
          </div>
          <button class="btn btn-ghost btn-sm btn-icon-only" id="review-close-btn" aria-label="Close report">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="review-body">
          <!-- Hero Score Banner -->
          <div class="review-score-hero">
            <div class="score-dial">
              <span class="score-dial-number" id="rev-score-num">82</span>
              <span class="score-dial-label">Suitability</span>
            </div>
            <div class="score-hero-details">
              <div class="score-hero-verdict">
                <span class="badge-level" id="rev-level-tag">CEFR B1</span>
                <span id="rev-verdict-text">Broadly suitable for Cambridge B1 learners</span>
              </div>
              <p class="score-hero-explanation" id="rev-explanation">
                Detailed educational explanation.
              </p>
            </div>
          </div>

          <!-- Observations 4-Grid -->
          <div class="observations-grid">
            <!-- Vocabulary Card -->
            <div class="obs-card">
              <div class="obs-card-header">
                <span class="obs-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Vocabulary Range
                </span>
                <span class="obs-rating" id="obs-vocab-rating">Solid B1</span>
              </div>
              <p class="obs-summary" id="obs-vocab-summary"></p>
              <ul class="obs-bullets" id="obs-vocab-bullets"></ul>
            </div>

            <!-- Grammar Card -->
            <div class="obs-card">
              <div class="obs-card-header">
                <span class="obs-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                  Grammatical Variety
                </span>
                <span class="obs-rating" id="obs-grammar-rating">Solid B1</span>
              </div>
              <p class="obs-summary" id="obs-grammar-summary"></p>
              <ul class="obs-bullets" id="obs-grammar-bullets"></ul>
            </div>

            <!-- Sentence Length Card -->
            <div class="obs-card">
              <div class="obs-card-header">
                <span class="obs-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Sentence Rhythm & Length
                </span>
                <span class="obs-rating" id="obs-length-rating">Optimal</span>
              </div>
              <p class="obs-summary" id="obs-length-summary"></p>
              <ul class="obs-bullets" id="obs-length-bullets"></ul>
            </div>

            <!-- Organization Card -->
            <div class="obs-card">
              <div class="obs-card-header">
                <span class="obs-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  Organization & Cohesion
                </span>
                <span class="obs-rating" id="obs-org-rating">Solid B1</span>
              </div>
              <p class="obs-summary" id="obs-org-summary"></p>
              <ul class="obs-bullets" id="obs-org-bullets"></ul>
            </div>
          </div>

          <!-- Sentence-Level Suggestions (Actionable) -->
          <div class="sentence-suggestions-section">
            <div class="section-headline">
              <span>Interactive Sentence Suggestions</span>
              <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">
                Accept to update editor, or ignore
              </span>
            </div>
            <div id="sentence-suggestions-list" style="display: flex; flex-direction: column; gap: 0.85rem;"></div>
          </div>

          <!-- Encouraging Suggestions -->
          <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.25rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);" id="enc-advice-title">
              Encouraging Advice for Cambridge &amp; CEFR Learners
            </h4>
            <ul id="encouraging-list" style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;"></ul>
          </div>

          <!-- Educational Disclaimer & Privacy Note -->
          <div class="review-disclaimer-box">
            <svg class="disclaimer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <strong style="color: var(--text-main); display: block; margin-bottom: 0.25rem;">
                Educational Estimate Notice & Privacy
              </strong>
              <p id="rev-disclaimer-text" style="margin-bottom: 0.35rem;"></p>
              <p id="rev-privacy-text" style="font-size: 0.75rem; color: var(--text-faint);"></p>
            </div>
          </div>
          <!-- Prominent Bottom Close Button -->
          <div style="padding-top: 1.25rem; border-top: 1px solid var(--border-color); margin-top: 1rem;">
            <button class="btn btn-primary" id="review-done-btn-body" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 600; font-size: 0.95rem;">
              Done · Return to Content
            </button>
          </div>
        </div>

        <!-- Desktop Footer -->
        <div class="review-footer">
          <span style="font-size: 0.8rem; color: var(--text-faint);">
            Original writing preserved intact
          </span>
          <button class="btn btn-primary btn-sm" id="review-done-btn">Back to Editor</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.modalEl = overlay;
    this._attachEvents();
  }

  static _attachEvents() {
    const overlay = this.modalEl;
    const closeBtns = overlay.querySelectorAll('#review-close-btn, #review-close-btn-left, #review-done-btn, #review-done-btn-body');
    closeBtns.forEach(b => b.addEventListener('click', () => this.close()));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        this.close();
      }
    });
  }

  static open(review, sourceItem = null) {
    this.init();
    this.currentReview = review;
    this.sourceItem = sourceItem;
    LunaState.activeReviewData = review;

    const overlay = this.modalEl;
    const targetLvl = (review.target_level || review.estimated_level || 'B1').toUpperCase();

    // Header dynamic title
    const headerTitle = overlay.querySelector('.review-header-title');
    if (headerTitle) {
      headerTitle.textContent = `CEFR ${targetLvl} Review`;
    }

    // Badge engine
    const engineBadge = overlay.querySelector('#rev-engine-badge');
    engineBadge.textContent = review.ai_engine_used || (review.is_demo ? 'Demo Linguistic Engine' : 'Live AI');
    engineBadge.style.backgroundColor = review.is_demo ? 'var(--color-warning-bg)' : 'var(--color-success-bg)';
    engineBadge.style.color = review.is_demo ? 'var(--color-warning)' : 'var(--color-success)';

    // Hero Dial & Verdict
    overlay.querySelector('#rev-score-num').textContent = review.suitability_score || 75;
    const levelTag = overlay.querySelector('#rev-level-tag');
    levelTag.textContent = `CEFR ${review.estimated_level || targetLvl}`;
    levelTag.className = `badge-level badge-level-${(review.estimated_level || targetLvl).toLowerCase().slice(0, 2)}`;
    overlay.querySelector('#rev-verdict-text').textContent = review.suitability_verdict;
    overlay.querySelector('#rev-explanation').textContent = review.overall_explanation;

    // Observations
    const obs = review.observations || {};
    this._populateObs(overlay, 'vocab', obs.vocabulary);
    this._populateObs(overlay, 'grammar', obs.grammar);
    this._populateObs(overlay, 'length', obs.sentence_length);
    this._populateObs(overlay, 'org', obs.organization);

    // Sentence Suggestions
    const sugList = overlay.querySelector('#sentence-suggestions-list');
    sugList.innerHTML = '';
    const suggestions = review.sentence_suggestions || [];

    if (suggestions.length === 0) {
      sugList.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.75rem 0;">
          No major sentence issues detected. Your phrasing aligns well with Cambridge ${targetLvl} norms!
        </div>
      `;
    } else {
      suggestions.forEach((sug, idx) => {
        const card = document.createElement('div');
        card.className = 'sentence-card';
        card.id = `sug-card-${idx}`;

        card.innerHTML = `
          <div class="sentence-card-top">
            <span style="text-transform: uppercase; font-size: 0.7rem; color: var(--primary);">
              Category: ${escapeHtml(sug.category || 'clarity')}
            </span>
            <span class="status-indicator" style="font-size: 0.75rem; color: var(--text-faint);">Suggestion #${idx + 1}</span>
          </div>

          <div class="sentence-diff">
            <div class="diff-original" title="Original sentence from your draft">
              ${escapeHtml(sug.original)}
            </div>
            <div class="diff-suggested" title="Proposed enhancement for Cambridge ${targetLvl}">
              ${escapeHtml(sug.suggested)}
            </div>
          </div>
            </div>
          </div>

          <div class="sentence-reason">
            💡 ${escapeHtml(sug.reason)}
          </div>

          <div class="sentence-actions">
            <button class="btn btn-ghost btn-sm btn-ignore" data-idx="${idx}">Ignore</button>
            <button class="btn btn-primary btn-sm btn-accept" data-idx="${idx}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Accept Suggestion
            </button>
          </div>
        `;

        // Event: Accept
        card.querySelector('.btn-accept').addEventListener('click', () => {
          card.classList.add('applied');
          card.querySelector('.status-indicator').innerHTML = '<span style="color: var(--color-success); font-weight: 700;">✓ Accepted & Updated in Editor</span>';
          card.querySelector('.sentence-actions').style.display = 'none';

          // Emit event to update studio editor text
          window.dispatchEvent(new CustomEvent('luna:accept-suggestion', {
            detail: { original: sug.original, replacement: sug.suggested }
          }));

          Toast.success('Updated text in Writing Studio!');
        });

        // Event: Ignore
        card.querySelector('.btn-ignore').addEventListener('click', () => {
          card.style.opacity = '0.5';
          card.querySelector('.status-indicator').textContent = 'Ignored';
          card.querySelector('.sentence-actions').style.display = 'none';
        });

        sugList.appendChild(card);
      });
    }

    // Encouraging advice list
    const encTitle = overlay.querySelector('#enc-advice-title');
    if (encTitle) {
      encTitle.textContent = `Encouraging Advice for Cambridge & CEFR ${targetLvl} Learners`;
    }
    const encList = overlay.querySelector('#encouraging-list');
    encList.innerHTML = '';
    (review.encouraging_suggestions || []).forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      encList.appendChild(li);
    });

    // Disclaimer & Privacy
    overlay.querySelector('#rev-disclaimer-text').textContent = review.disclaimer;
    overlay.querySelector('#rev-privacy-text').textContent = review.data_privacy_note;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  static _populateObs(overlay, prefix, data) {
    if (!data) return;
    const ratingEl = overlay.querySelector(`#obs-${prefix}-rating`);
    const summaryEl = overlay.querySelector(`#obs-${prefix}-summary`);
    const bulletsEl = overlay.querySelector(`#obs-${prefix}-bullets`);

    if (ratingEl) ratingEl.textContent = data.rating || 'Evaluated';
    if (summaryEl) summaryEl.textContent = data.summary || '';
    if (bulletsEl) {
      bulletsEl.innerHTML = '';
      (data.strengths || []).forEach(s => {
        const li = document.createElement('li');
        li.className = 'obs-bullet-item';
        li.innerHTML = `<span class="obs-bullet-icon-plus">+</span><span>${escapeHtml(s)}</span>`;
        bulletsEl.appendChild(li);
      });
      (data.areas_for_growth || []).forEach(g => {
        const li = document.createElement('li');
        li.className = 'obs-bullet-item';
        li.innerHTML = `<span class="obs-bullet-icon-tip">→</span><span>${escapeHtml(g)}</span>`;
        bulletsEl.appendChild(li);
      });
    }
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    document.body.style.overflow = '';
    const prevItem = this.sourceItem;
    this.sourceItem = null;
    if (prevItem && window.ReaderModal) {
      ReaderModal.open(prevItem);
    }
  }
}

window.ReviewModal = ReviewModal;
