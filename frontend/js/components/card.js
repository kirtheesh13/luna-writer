/**
 * Luna Writer - Writing Card Component
 */

class WritingCard {
  static render(item, options = {}) {
    const isBookmarked = item.is_bookmarked || LunaState.bookmarkedIds.has(item.id);
    const levelClass = `badge-level-${(item.level || 'B1').toLowerCase()}`;
    const showOwnerActions = options.showOwnerActions || false;

    const div = document.createElement('div');
    div.className = 'luna-card';
    div.setAttribute('data-id', item.id);
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'article');
    div.setAttribute('aria-label', `Read ${item.title}`);

    div.innerHTML = `
      <div class="card-top">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span class="badge-level ${levelClass}">
            <span>CEFR ${item.level || 'B1'}</span>
          </span>
          ${showOwnerActions ? `
            <span style="font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: var(--radius-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; ${
              item.status === 'published' ? 'background: rgba(16, 185, 129, 0.12); color: #059669;' : 'background: rgba(100, 116, 139, 0.12); color: #475569;'
            }">
              ${item.status === 'published' ? 'Published' : (item.status === 'in_review' ? 'Draft (Reviewed)' : 'Draft')}
            </span>
          ` : ''}
        </div>
        <div class="card-meta-right">
          <span class="card-reading-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${item.reading_time_minutes || 1} min
          </span>
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" 
                  data-bookmark-id="${item.id}" 
                  title="${isBookmarked ? 'Remove bookmark' : 'Bookmark this item'}"
                  aria-label="Bookmark ${item.title}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-description">${escapeHtml(item.description || item.content.slice(0, 160) + '...')}</p>

      <div class="card-bottom">
        <span class="card-author">${escapeHtml(item.author_name || 'Luna Contributor')}</span>
        <span class="card-words">${item.word_count || item.content.split(/\s+/).length} words</span>
      </div>

      ${showOwnerActions ? `
        <div class="card-owner-actions" style="margin-top: 0.85rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-color); display: flex; gap: 0.5rem; justify-content: flex-end;" onclick="event.stopPropagation();">
          <button class="btn btn-secondary btn-sm" onclick="Router.navigate('/studio?edit=${item.id}')">Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="App.requestReviewForWriting('${item.id}', null, null, null, null, '${item.level || 'B1'}')">CEFR Review</button>
          <button class="btn btn-ghost btn-sm" style="color: var(--color-danger);" onclick="App.deleteWriting('${item.id}')">Delete</button>
        </div>
      ` : ''}
    `;

    // Click handler to open reading view
    div.addEventListener('click', (e) => {
      if (e.target.closest('.bookmark-btn') || e.target.closest('.card-owner-actions')) {
        return;
      }
      ReaderModal.open(item);
    });

    // Keyboard enter support
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        ReaderModal.open(item);
      }
    });

    // Bookmark button click
    const bmBtn = div.querySelector('.bookmark-btn');
    bmBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const updated = await LunaState.toggleBookmark(item.id);
      bmBtn.classList.toggle('active', updated);
      const svg = bmBtn.querySelector('svg');
      svg.setAttribute('fill', updated ? 'currentColor' : 'none');
    });

    return div;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.WritingCard = WritingCard;
window.escapeHtml = escapeHtml;
