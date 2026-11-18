/**
 * Luna Writer - Dedicated Reading Modal View
 */

class ReaderModal {
  static modalEl = null;
  static currentItem = null;
  static speechSynth = window.speechSynthesis;
  static currentUtterance = null;
  static isSpeaking = false;

  static init() {
    if (this.modalEl) return;

    const overlay = document.createElement('div');
    overlay.className = 'reader-modal-overlay';
    overlay.id = 'reader-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Reading View');

    overlay.innerHTML = `
      <div class="reader-modal-window">
        <!-- Top Toolbar -->
        <div class="reader-toolbar">
          <div class="reader-toolbar-left">
            <button class="btn btn-ghost btn-sm" id="reader-close-btn" aria-label="Close reader">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Close
            </button>
            <span class="badge-level" id="reader-level-badge">CEFR B1</span>
          </div>

          <!-- Reader Controls Cluster -->
          <div class="reader-toolbar-right">
            <div class="reader-controls-cluster" title="Adjust font size">
              <button class="reader-control-btn" id="reader-size-down" aria-label="Decrease text size">A-</button>
              <button class="reader-control-btn" id="reader-size-up" aria-label="Increase text size">A+</button>
            </div>

            <div class="reader-controls-cluster reader-desktop-only" title="Adjust line spacing">
              <button class="reader-control-btn" data-spacing="compact">Compact</button>
              <button class="reader-control-btn active" data-spacing="normal">Normal</button>
              <button class="reader-control-btn" data-spacing="relaxed">Relaxed</button>
            </div>

            <div class="reader-controls-cluster reader-desktop-only" title="Adjust column reading width">
              <button class="reader-control-btn" data-width="narrow">Narrow</button>
              <button class="reader-control-btn active" data-width="medium">Medium</button>
              <button class="reader-control-btn" data-width="wide">Wide</button>
            </div>

            <button class="bookmark-btn btn-icon-only" id="reader-bookmark-btn" title="Toggle bookmark" aria-label="Bookmark this reading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Article Container -->
        <article class="reader-article-container width-medium spacing-normal" id="reader-article-body">
          <header class="reader-header">
            <span class="reader-category-pill" id="reader-category">Category</span>
            <h1 class="reader-title" id="reader-title">Title</h1>
            <div class="reader-meta-row">
              <span class="reader-meta-item" id="reader-author">By Author</span>
              <span class="reader-meta-item" id="reader-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span id="reader-time-val">2 min read</span>
              </span>
              <span class="reader-meta-item" id="reader-words">350 words</span>
            </div>

            <!-- Audio Read-Aloud Player -->
            <div class="reader-tts-bar">
              <div class="tts-controls">
                <button class="tts-play-btn" id="reader-tts-btn" title="Listen to text audio" aria-label="Play audio read-aloud">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
                <div>
                  <div class="tts-status-label" id="tts-label">Listen to this piece aloud</div>
                  <div style="font-size: 0.75rem; color: var(--text-faint);">English pronunciation practice</div>
                </div>
              </div>
              <select class="tts-speed-selector" id="tts-speed" aria-label="Playback speed">
                <option value="0.85">0.85x (Learner)</option>
                <option value="1.0" selected>1.0x (Normal)</option>
                <option value="1.15">1.15x (Brisk)</option>
              </select>
            </div>
          </header>

          <!-- Main Prose Text -->
          <div class="reader-prose" id="reader-content"></div>

          <!-- Footer Actions -->
          <footer class="reader-footer-actions">
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn btn-secondary btn-sm" id="reader-review-shortcut-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
                <span id="reader-review-btn-text">AI CEFR Evaluation Report</span>
              </button>
            </div>
            <button class="btn btn-primary btn-sm" id="reader-bottom-close-btn">Finished Reading</button>
          </footer>
        </article>
      </div>
    `;

    document.body.appendChild(overlay);
    this.modalEl = overlay;
    this._attachEvents();
  }

  static _attachEvents() {
    const overlay = this.modalEl;

    // Close handlers
    const closeBtns = overlay.querySelectorAll('#reader-close-btn, #reader-bottom-close-btn');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        this.close();
      }
    });

    // Font resizing
    const container = overlay.querySelector('#reader-article-body');
    const prose = overlay.querySelector('#reader-content');

    overlay.querySelector('#reader-size-up').addEventListener('click', () => {
      let current = parseInt(getComputedStyle(prose).fontSize) || 16;
      if (current < 28) {
        current += 2;
        prose.style.fontSize = `${current}px`;
      }
    });

    overlay.querySelector('#reader-size-down').addEventListener('click', () => {
      let current = parseInt(getComputedStyle(prose).fontSize) || 16;
      if (current > 13) {
        current -= 2;
        prose.style.fontSize = `${current}px`;
      }
    });

    // Spacing buttons
    overlay.querySelectorAll('[data-spacing]').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('[data-spacing]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        container.classList.remove('spacing-compact', 'spacing-normal', 'spacing-relaxed');
        container.classList.add(`spacing-${btn.getAttribute('data-spacing')}`);
      });
    });

    // Width buttons
    overlay.querySelectorAll('[data-width]').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('[data-width]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        container.classList.remove('width-narrow', 'width-medium', 'width-wide');
        container.classList.add(`width-${btn.getAttribute('data-width')}`);
      });
    });

    // Bookmark toggle
    const bmBtn = overlay.querySelector('#reader-bookmark-btn');
    bmBtn.addEventListener('click', async () => {
      if (!this.currentItem) return;
      const isBookmarked = await LunaState.toggleBookmark(this.currentItem.id);
      bmBtn.classList.toggle('active', isBookmarked);
      bmBtn.querySelector('svg').setAttribute('fill', isBookmarked ? 'currentColor' : 'none');
    });

    // Text-to-Speech
    const ttsBtn = overlay.querySelector('#reader-tts-btn');
    const ttsSpeed = overlay.querySelector('#tts-speed');
    const ttsLabel = overlay.querySelector('#tts-label');

    ttsBtn.addEventListener('click', () => {
      if (this.isSpeaking) {
        this.stopAudio();
      } else {
        this.playAudio(this.currentItem ? this.currentItem.content : '', parseFloat(ttsSpeed.value) || 1.0);
      }
    });

    // AI Review Shortcut
    overlay.querySelector('#reader-review-shortcut-btn').addEventListener('click', () => {
      if (!this.currentItem) return;
      const item = this.currentItem;
      this.close();
      App.requestReviewForWriting(item.id, item.title, item.category, item.content, item, item.level || 'B1');
    });
  }

  static open(item) {
    this.init();
    this.currentItem = item;
    LunaState.activeReaderItem = item;

    const overlay = this.modalEl;
    overlay.querySelector('#reader-category').textContent = (item.category || 'Writing').toUpperCase();
    overlay.querySelector('#reader-title').textContent = item.title;
    overlay.querySelector('#reader-author').textContent = `By ${item.author_name || 'Luna Contributor'}`;
    overlay.querySelector('#reader-time-val').textContent = `${item.reading_time_minutes || 1} min read`;
    overlay.querySelector('#reader-words').textContent = `${item.word_count || item.content.split(/\s+/).length} words`;

    const levelBadge = overlay.querySelector('#reader-level-badge');
    const targetLvl = (item.level || 'B1').toUpperCase();
    levelBadge.textContent = `CEFR ${targetLvl}`;
    levelBadge.className = `badge-level badge-level-${targetLvl.toLowerCase()}`;

    const reviewBtnText = overlay.querySelector('#reader-review-btn-text');
    if (reviewBtnText) {
      reviewBtnText.textContent = `AI CEFR ${targetLvl} Evaluation Report`;
    }

    // Format content paragraphs
    const prose = overlay.querySelector('#reader-content');
    const paragraphs = item.content.split(/\n\s*\n/);
    prose.innerHTML = paragraphs
      .map(p => `<p>${escapeHtml(p.trim())}</p>`)
      .join('');

    // Update bookmark button state
    const isBookmarked = item.is_bookmarked || LunaState.bookmarkedIds.has(item.id);
    const bmBtn = overlay.querySelector('#reader-bookmark-btn');
    bmBtn.classList.toggle('active', isBookmarked);
    bmBtn.querySelector('svg').setAttribute('fill', isBookmarked ? 'currentColor' : 'none');

    // Reset audio state
    this.stopAudio();

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    document.body.style.overflow = '';
    this.stopAudio();
  }

  static playAudio(text, rate = 1.0) {
    const synth = window.speechSynthesis || this.speechSynth;
    if (!synth) {
      Toast.warning('Speech synthesis is not supported on this device.');
      return;
    }

    this.stopAudio();
    if (!text || !text.trim()) return;

    // Split text into natural sentences for smooth, uninterrupted playback across mobile & desktop
    const rawSentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
    this.audioChunks = rawSentences.map(s => s.trim()).filter(s => s.length > 0);
    this.audioChunkIndex = 0;
    this.audioRate = rate;
    this.isSpeaking = true;

    this._speakNextChunk();
  }

  static _speakNextChunk() {
    const synth = window.speechSynthesis || this.speechSynth;
    if (!synth || !this.isSpeaking || !this.audioChunks || this.audioChunkIndex >= this.audioChunks.length) {
      this.stopAudio();
      return;
    }

    const chunkText = this.audioChunks[this.audioChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = this.audioRate || 1.0;
    utterance.lang = 'en-GB';

    const ttsBtn = this.modalEl?.querySelector('#reader-tts-btn');
    const ttsLabel = this.modalEl?.querySelector('#tts-label');

    utterance.onstart = () => {
      if (ttsLabel) {
        ttsLabel.textContent = `Speaking (${this.audioChunkIndex + 1}/${this.audioChunks.length})... click to pause`;
      }
      if (ttsBtn) {
        ttsBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        `;
      }
    };

    utterance.onend = () => {
      if (this.isSpeaking) {
        this.audioChunkIndex++;
        this._speakNextChunk();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        this.audioChunkIndex++;
        this._speakNextChunk();
      }
    };

    this.currentUtterance = utterance;
    synth.speak(utterance);
  }

  static stopAudio() {
    const synth = window.speechSynthesis || this.speechSynth;
    if (synth) {
      synth.cancel();
    }
    this.isSpeaking = false;
    this.audioChunks = [];
    this.audioChunkIndex = 0;
    if (this.modalEl) {
      const ttsBtn = this.modalEl.querySelector('#reader-tts-btn');
      const ttsLabel = this.modalEl.querySelector('#tts-label');
      if (ttsBtn && ttsLabel) {
        ttsLabel.textContent = 'Listen to this piece aloud';
        ttsBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
      }
    }
  }
}

window.ReaderModal = ReaderModal;
