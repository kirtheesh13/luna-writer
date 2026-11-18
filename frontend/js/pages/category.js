/**
 * Luna Writer - Category Page View (Stories, Letters, Articles, Emails)
 */

class CategoryPage {
  static categoryInfo = {
    stories: {
      title: "English Stories",
      pill: "Category: Stories",
      description: "Immerse yourself in creative narratives, character journeys, and slice-of-life accounts crafted with clear intermediate vocabulary and expressive sentence structures.",
      icon: "📖"
    },
    letters: {
      title: "English Letters",
      pill: "Category: Letters",
      description: "Examine authentic formal, semi-formal, and personal letters. Learn polite phrasing for complaints, inquiries, invitations, and sincere messages of gratitude.",
      icon: "✉️"
    },
    articles: {
      title: "English Articles",
      pill: "Category: Articles",
      description: "Discover informative, thought-provoking magazine-style articles addressing student habits, green cities, digital technology, and language learning tips.",
      icon: "📰"
    },
    emails: {
      title: "English Emails",
      pill: "Category: Emails",
      description: "Read practical, realistic emails covering workplace updates, polite scheduling adjustments, friend reunions, and neighbourhood community notices.",
      icon: "📬"
    }
  };

  static async render(container, categoryKey) {
    const info = this.categoryInfo[categoryKey] || this.categoryInfo.stories;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-top">
          <span class="page-category-badge">${info.pill}</span>
          <span style="font-size: 1.25rem;">${info.icon}</span>
        </div>
        <h1 class="page-title">${info.title}</h1>
        <p class="page-description">${info.description}</p>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="toolbar-bar">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="search" class="search-input" id="cat-search-input" 
                 placeholder="Search in ${categoryKey} by title, topic, or keyword..." />
        </div>

        <div class="filter-group">
          <!-- Level Filter (Full CEFR Spectrum: A1 - C2) -->
          <select class="filter-select" id="cat-level-select" aria-label="Filter by level">
            <option value="">All Levels (A1 - C2)</option>
            <option value="A1">Level A1 (Beginner)</option>
            <option value="A2">Level A2 (Elementary)</option>
            <option value="B1">Level B1 (Intermediate)</option>
            <option value="B2">Level B2 (Upper-Intermediate)</option>
            <option value="C1">Level C1 (Advanced)</option>
            <option value="C2">Level C2 (Mastery)</option>
          </select>

          <!-- Length Filter -->
          <select class="filter-select" id="cat-length-select" aria-label="Filter by length">
            <option value="">All Lengths</option>
            <option value="short">Short (&lt; 300 words)</option>
            <option value="medium">Medium (300 - 600 words)</option>
            <option value="long">Long (&gt; 600 words)</option>
          </select>

          <!-- Topic Filter -->
          <select class="filter-select" id="cat-topic-select" aria-label="Filter by topic">
            <option value="">All Topics</option>
          </select>

          <!-- Sort Filter -->
          <select class="filter-select" id="cat-sort-select" aria-label="Sort pieces">
            <option value="recent">Newest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="reading_time">Shortest Read</option>
          </select>
        </div>
      </div>

      <!-- Topic Quick-Filter Pills -->
      <div class="topic-pills-bar" id="cat-topic-pills">
        <button class="topic-pill active" data-topic="">All ${info.title}</button>
      </div>

      <!-- Writing Cards Grid -->
      <div class="cards-grid" id="cat-cards-grid">
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-title">Loading ${categoryKey}...</div>
        </div>
      </div>
    `;

    this._setupCategoryLogic(container, categoryKey);
  }

  static async _setupCategoryLogic(container, categoryKey) {
    const searchInput = container.querySelector('#cat-search-input');
    const levelSelect = container.querySelector('#cat-level-select');
    const lengthSelect = container.querySelector('#cat-length-select');
    const topicSelect = container.querySelector('#cat-topic-select');
    const sortSelect = container.querySelector('#cat-sort-select');
    const topicPillsContainer = container.querySelector('#cat-topic-pills');
    const cardsGrid = container.querySelector('#cat-cards-grid');

    let activeTopic = '';

    // Function to fetch and update cards
    const refreshCards = async () => {
      cardsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-title">Finding matching pieces...</div>
        </div>
      `;

      const params = {
        category: categoryKey,
        search: searchInput.value.trim(),
        level: levelSelect.value,
        length: lengthSelect.value,
        topic: activeTopic || topicSelect.value,
        sort_by: sortSelect.value
      };

      try {
        const items = await LunaApi.getWritings(params);

        if (!items || items.length === 0) {
          cardsGrid.innerHTML = `
            <div class="empty-state">
              <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <h3 class="empty-state-title">No pieces found</h3>
              <p class="empty-state-text">
                No items in ${categoryKey} match your active filters. Try clearing your search or filters.
              </p>
              <button class="btn btn-secondary btn-sm" id="clear-filters-btn">Clear All Filters</button>
            </div>
          `;
          container.querySelector('#clear-filters-btn')?.addEventListener('click', () => {
            searchInput.value = '';
            levelSelect.value = '';
            lengthSelect.value = '';
            topicSelect.value = '';
            activeTopic = '';
            topicPillsContainer.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('active'));
            topicPillsContainer.querySelector('[data-topic=""]')?.classList.add('active');
            refreshCards();
          });
          return;
        }

        cardsGrid.innerHTML = '';
        items.forEach(item => {
          cardsGrid.appendChild(WritingCard.render(item));
        });
      } catch (err) {
        cardsGrid.innerHTML = `
          <div class="empty-state">
            <h3 class="empty-state-title" style="color: var(--color-danger);">Could not load ${categoryKey}</h3>
            <p class="empty-state-text">${err.message}</p>
          </div>
        `;
      }
    };

    // Load available topics for this category
    try {
      const stats = await LunaApi.getCategoryStats();
      const catStats = stats[categoryKey];
      if (catStats && catStats.topics) {
        catStats.topics.forEach(top => {
          // Add to select
          const opt = document.createElement('option');
          opt.value = top;
          opt.textContent = top;
          topicSelect.appendChild(opt);

          // Add pill
          const pill = document.createElement('button');
          pill.className = 'topic-pill';
          pill.setAttribute('data-topic', top);
          pill.textContent = top;
          pill.addEventListener('click', () => {
            topicPillsContainer.querySelectorAll('.topic-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeTopic = top;
            topicSelect.value = top;
            refreshCards();
          });
          topicPillsContainer.appendChild(pill);
        });
      }
    } catch (_) {}

    // Attach listeners
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(refreshCards, 280);
    });

    [levelSelect, lengthSelect, sortSelect].forEach(el => {
      el.addEventListener('change', refreshCards);
    });

    topicSelect.addEventListener('change', () => {
      activeTopic = topicSelect.value;
      topicPillsContainer.querySelectorAll('.topic-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-topic') === activeTopic);
      });
      refreshCards();
    });

    // Initial load
    refreshCards();
  }
}

window.CategoryPage = CategoryPage;
