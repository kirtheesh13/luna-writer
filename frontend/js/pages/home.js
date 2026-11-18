/**
 * Luna Writer - Home Page View (Bento Grid SaaS Layout)
 */

class HomePage {
  static async render(container) {
    container.innerHTML = `
      <section class="bento-hero">
        <div class="hero-pill-badge">
          <span>✨</span>
          <span>Crafted for English Learners & Writers</span>
        </div>
        <h1 class="hero-title">
          Read with clarity. Write with confidence. <span class="hero-highlight">From Beginner (A1) to Mastery (C2).</span>
        </h1>
        <p class="hero-subtitle">
          Explore realistic English stories, letters, articles, and emails across all 6 CEFR levels (A1, A2, B1, B2, C1, C2). Create your own drafts, 
          upload documents, and receive intelligent educational AI feedback tailored to your exact target benchmark.
        </p>
        <div class="hero-cta-group">
          <button class="btn btn-primary" onclick="Router.navigate('/studio')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Open Writing Studio
          </button>
          <button class="btn btn-secondary" onclick="Router.navigate('/stories')">
            Explore Reading Library
          </button>
        </div>
      </section>

      <!-- Bento Grid Section -->
      <section class="bento-grid">
        <!-- Bento 1: Featured B1 Story -->
        <div class="bento-card bento-featured" id="bento-featured-box">
          <div class="bento-card-header">
            <span class="page-category-badge">Featured Story</span>
            <span class="badge-level badge-level-b1">CEFR B1</span>
          </div>
          <h2 class="bento-card-title" id="featured-title" style="font-size: 1.5rem; margin-bottom: 0.5rem;">
            Loading featured piece...
          </h2>
          <p id="featured-desc" style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            A hand-picked writing piece showcasing natural intermediate vocabulary, cohesive linkers, and engaging storytelling.
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto;">
            <span id="featured-meta" style="font-size: 0.85rem; color: var(--text-faint);">2 min read • 348 words</span>
            <button class="btn btn-primary btn-sm" id="featured-read-btn">
              Read Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bento 2: Quick CEFR Sentence Tester (All Levels: A1-C2) -->
        <div class="bento-card bento-teaser">
          <div class="bento-card-header">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">Instant AI CEFR Check</span>
            <span style="font-size: 0.75rem; color: var(--text-faint);">All Levels: A1–C2</span>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.4rem;">Test Your Sentence</h3>
          <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.65rem;">
            Choose your target CEFR level and analyze whether your vocabulary and phrasing match:
          </p>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.65rem; align-items: center;">
            <label for="quick-tester-level" style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Target Level:</label>
            <select class="filter-select" id="quick-tester-level" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; flex: 1;">
              <option value="A1">A1 — Beginner (Breakthrough)</option>
              <option value="A2">A2 — Elementary (Waystage)</option>
              <option value="B1" selected>B1 — Intermediate (Threshold)</option>
              <option value="B2">B2 — Upper-Intermediate (Vantage)</option>
              <option value="C1">C1 — Advanced (Effective Operational)</option>
              <option value="C2">C2 — Mastery (Proficient Native-like)</option>
            </select>
          </div>
          <div class="quick-tester-box">
            <textarea class="quick-tester-textarea" id="quick-tester-input" 
                      placeholder="Type or paste a sentence in English to analyze against your chosen CEFR level..."></textarea>
            <button class="btn btn-primary btn-sm" id="quick-tester-btn">
              Analyze Suitability (A1–C2)
            </button>
          </div>
        </div>

        <!-- Bento 3: Category Navigator Grid -->
        <div class="bento-card bento-categories">
          <div class="bento-card-header">
            <h3 class="bento-card-title">Explore Writing Categories</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Separated collections</span>
          </div>
          <div class="bento-category-grid" id="bento-category-grid">
            <!-- Populated dynamically with Stories, Letters, Articles, Emails -->
          </div>
        </div>

        <!-- Bento 4: CEFR Progression Guide & System Info -->
        <div class="bento-card bento-stats">
          <div class="bento-card-header">
            <h3 class="bento-card-title">CEFR Level Guide</h3>
            <span class="status-dot" title="Database Connected"></span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.8rem; max-height: 280px; overflow-y: auto;">
            <div style="padding: 0.45rem 0.6rem; background: var(--badge-a1-bg); color: var(--badge-a1-text); border-radius: var(--radius-md);">
              <strong>A1 Beginner</strong>: Basic isolated phrases, everyday names, simple personal greetings.
            </div>
            <div style="padding: 0.45rem 0.6rem; background: var(--badge-a2-bg); color: var(--badge-a2-text); border-radius: var(--radius-md);">
              <strong>A2 Elementary</strong>: Routine information, daily activities, simple compound sentences.
            </div>
            <div style="padding: 0.45rem 0.6rem; background: var(--badge-b1-bg); color: var(--badge-b1-text); border-radius: var(--radius-md);">
              <strong>B1 Intermediate</strong>: Connected text on familiar topics, personal experiences, plans, and reasons.
            </div>
            <div style="padding: 0.45rem 0.6rem; background: var(--badge-b2-bg); color: var(--badge-b2-text); border-radius: var(--radius-md);">
              <strong>B2 Upper-Intermediate</strong>: Complex ideas, detailed viewpoints, abstract topics, and idioms.
            </div>
            <div style="padding: 0.45rem 0.6rem; background: var(--badge-c1-bg); color: var(--badge-c1-text); border-radius: var(--radius-md);">
              <strong>C1 Advanced</strong>: Fluent, spontaneous, sophisticated lexical range, and structured essays.
            </div>
            <div style="padding: 0.45rem 0.6rem; background: var(--badge-c2-bg); color: var(--badge-c2-text); border-radius: var(--radius-md);">
              <strong>C2 Mastery</strong>: Highly nuanced precision, native-like command, and stylistic subtlety.
            </div>
          </div>
        </div>
      </section>

      <!-- Selected Highlights Library Showcase -->
      <section style="margin-top: 3.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">Featured Reading Pieces</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Curated examples from our four distinct writing categories</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="Router.navigate('/stories')">
            View All Categories →
          </button>
        </div>
        <div class="cards-grid" id="home-featured-grid">
          <!-- Populated by JS -->
        </div>
      </section>
    `;

    this._loadHomeData(container);
  }

  static async _loadHomeData(container) {
    try {
      // 1. Fetch category statistics
      const stats = await LunaApi.getCategoryStats();
      const catGrid = container.querySelector('#bento-category-grid');
      catGrid.innerHTML = '';

      const categoriesMeta = [
        { key: 'stories', title: 'Stories', path: '/stories', icon: '📖', desc: 'Narratives and creative slice-of-life experiences.' },
        { key: 'letters', title: 'Letters', path: '/letters', icon: '✉️', desc: 'Formal and personal letters of inquiry, complaint, and gratitude.' },
        { key: 'articles', title: 'Articles', path: '/articles', icon: '📰', desc: 'Engaging essays on lifestyle, technology, and health.' },
        { key: 'emails', title: 'Emails', path: '/emails', icon: '📬', desc: 'Real-world correspondence for work, trips, and community.' }
      ];

      categoriesMeta.forEach(meta => {
        const catStat = stats[meta.key] || { count: 3 };
        const box = document.createElement('div');
        box.className = 'cat-box';
        box.onclick = () => Router.navigate(meta.path);

        box.innerHTML = `
          <div class="cat-box-top">
            <span style="font-size: 1.25rem;">${meta.icon}</span>
            <span class="cat-box-count">${catStat.count} items</span>
          </div>
          <div class="cat-box-title">${meta.title}</div>
          <div class="cat-box-desc">${meta.desc}</div>
        `;
        catGrid.appendChild(box);
      });

      // 2. Fetch writings to feature
      const writings = await LunaApi.getWritings({ limit: 4 });
      if (writings && writings.length > 0) {
        // Feature first one
        const feat = writings[0];
        container.querySelector('#featured-title').textContent = feat.title;
        container.querySelector('#featured-desc').textContent = feat.description || feat.content.slice(0, 180) + '...';
        container.querySelector('#featured-meta').textContent = `${feat.reading_time_minutes || 2} min read • ${feat.word_count || 320} words • ${feat.author_name}`;
        
        container.querySelector('#featured-read-btn').onclick = () => {
          ReaderModal.open(feat);
        };

        // Render card grid
        const grid = container.querySelector('#home-featured-grid');
        grid.innerHTML = '';
        writings.forEach(item => {
          grid.appendChild(WritingCard.render(item));
        });
      }

      // 3. Quick tester button event
      const testerBtn = container.querySelector('#quick-tester-btn');
      const testerInput = container.querySelector('#quick-tester-input');
      const testerLevel = container.querySelector('#quick-tester-level');
      testerBtn.addEventListener('click', async () => {
        const text = testerInput.value.trim();
        if (text.length < 20) {
          Toast.warning('Please enter a longer sentence or paragraph (at least 20 characters).');
          return;
        }
        const targetLevel = testerLevel ? testerLevel.value : 'B1';
        testerBtn.disabled = true;
        testerBtn.textContent = `Evaluating for ${targetLevel}...`;
        try {
          const result = await LunaApi.evaluateB1({
            title: `Quick Check (${targetLevel})`,
            category: 'stories',
            target_level: targetLevel,
            content: text
          });
          ReviewModal.open(result);
        } catch (err) {
          Toast.error(err.message || 'Evaluation failed');
        } finally {
          testerBtn.disabled = false;
          testerBtn.textContent = 'Analyze Suitability (A1–C2)';
        }
      });
    } catch (e) {
      console.error('Error loading home data:', e);
    }
  }
}

window.HomePage = HomePage;
