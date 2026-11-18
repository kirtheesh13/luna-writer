/**
 * Luna Writer - Writing Studio Page
 */

class StudioPage {
  static currentDraftId = null;
  static isPreviewMode = false;

  static async render(container, editId = null) {
    this.currentDraftId = editId;
    this.isPreviewMode = false;

    container.innerHTML = `
      <div class="page-header" style="margin-bottom: 1.5rem;">
        <div class="page-header-top">
          <span class="page-category-badge">Workspace</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Writing Studio</span>
        </div>
        <h1 class="page-title">Create &amp; Refine Your Writing</h1>
        <p class="page-description">
          Write directly, paste content, or upload supported files. Review word counts, preview your layout, 
          and receive real-time Gemini AI educational feedback across all CEFR levels (A1 to C2).
        </p>
      </div>

      <div class="studio-container">
        <!-- Main Writing Area Card -->
        <main class="studio-main-card">
          <!-- Top Status Bar -->
          <div class="studio-top-bar">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="studio-status-pill status-draft" id="studio-status-tag">
                <span class="status-dot" style="background-color: var(--text-faint);"></span>
                <span id="studio-status-label">Private Draft</span>
              </span>
              <span style="font-size: 0.75rem; color: var(--text-faint);" id="studio-save-timestamp">
                Unsaved changes
              </span>
            </div>

            <!-- Mode Switcher (Write vs Preview) -->
            <div class="studio-mode-toggle" role="tablist">
              <button class="studio-mode-btn active" id="mode-edit-btn" role="tab" aria-selected="true">Write &amp; Edit</button>
              <button class="studio-mode-btn" id="mode-preview-btn" role="tab" aria-selected="false">Reader Preview</button>
            </div>
          </div>

          <!-- Document Title Input -->
          <input type="text" class="studio-title-input" id="studio-title" 
                 placeholder="Give your piece an inspiring title..." value="" />

          <!-- Meta Grid (Category, Target Level, Visibility) -->
          <div class="studio-meta-grid">
            <div>
              <label class="studio-field-label" for="studio-category">Category</label>
              <select class="studio-input-select" id="studio-category">
                <option value="stories">Stories (Narrative)</option>
                <option value="letters">Letters (Formal &amp; Personal)</option>
                <option value="articles">Articles (Informative)</option>
                <option value="emails">Emails (Correspondence)</option>
              </select>
            </div>

            <div>
              <label class="studio-field-label" for="studio-level">Target CEFR Level</label>
              <select class="studio-input-select" id="studio-level">
                <option value="A1">A1 — Beginner (Breakthrough)</option>
                <option value="A2">A2 — Elementary (Waystage)</option>
                <option value="B1" selected>B1 — Intermediate (Threshold)</option>
                <option value="B2">B2 — Upper-Intermediate (Vantage)</option>
                <option value="C1">C1 — Advanced (Effective Operational)</option>
                <option value="C2">C2 — Mastery (Proficient Native-like)</option>
              </select>
            </div>

            <div>
              <label class="studio-field-label" for="studio-visibility">Visibility</label>
              <select class="studio-input-select" id="studio-visibility">
                <option value="private" selected>Private (Only Visible to You)</option>
                <option value="public">Published in Library</option>
              </select>
            </div>
          </div>

          <!-- Editor Toolbar & Live Counters -->
          <div class="studio-editor-toolbar">
            <div class="studio-stats-group">
              <span class="studio-stat-item">
                <span class="stat-value" id="stat-words">0</span> words
              </span>
              <span>•</span>
              <span class="studio-stat-item">
                <span class="stat-value" id="stat-chars">0</span> characters
              </span>
              <span>•</span>
              <span class="studio-stat-item">
                <span class="stat-value" id="stat-read-time">0</span> min read
              </span>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" id="studio-new-btn" title="Start a fresh new piece">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Piece
              </button>
              <button class="btn btn-ghost btn-sm" id="studio-clear-btn" title="Clear editor content">
                Clear Text
              </button>
            </div>
          </div>

          <!-- Editor Content Area -->
          <div id="studio-editor-wrapper">
            <textarea class="studio-textarea" id="studio-content" 
                      placeholder="Start writing your English story, letter, article, or email here. You can also paste text or upload a document from the sidebar..."></textarea>
          </div>

          <!-- Preview Mode Box (Hidden by default) -->
          <div id="studio-preview-wrapper" style="display: none;">
            <div class="studio-preview-box reader-prose" id="studio-preview-content"></div>
          </div>

          <!-- Actions Footer -->
          <div class="studio-actions-footer">
            <div class="studio-actions-left">
              <button class="btn btn-secondary" id="studio-save-draft-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Draft
              </button>

              <button class="btn btn-secondary" id="studio-publish-btn">
                Publish to Library
              </button>
            </div>

            <div class="studio-actions-right">
              <button class="btn btn-primary" id="studio-review-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
                Request AI CEFR Evaluation
              </button>
            </div>
          </div>
        </main>

        <!-- Sidebar: Uploads & B1 Writing Prompts -->
        <aside class="studio-sidebar">
          <!-- Document Upload Card -->
          <div class="studio-side-card">
            <div class="side-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Document
            </div>
            <p class="side-card-subtitle">
              Supported formats: <strong>.txt, .md, .docx, .json</strong><br>
              Maximum file size: <strong>2 MB</strong>
            </p>

            <div class="upload-dropzone" id="upload-dropzone">
              <input type="file" id="file-upload-input" class="upload-hidden-input" 
                     accept=".txt,.md,.docx,.json" aria-label="Upload document file" />
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <polyline points="9 15 12 12 15 15"></polyline>
              </svg>
              <div class="upload-headline">Drop file here or click to browse</div>
              <div class="upload-meta">Extracts title &amp; text automatically</div>
            </div>
          </div>

          <!-- CEFR Cambridge Writing Prompts Card -->
          <div class="studio-side-card">
            <div class="side-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              CEFR Exam Prompts (A1–C2)
            </div>
            <p class="side-card-subtitle">
              Need inspiration? Choose a Cambridge exam prompt tailored to your target level:
            </p>

            <div class="prompt-list" id="studio-prompts-list">
              <!-- A1 Prompt -->
              <div class="prompt-item" data-category="stories" 
                   data-prompt="My name is Alex. On Saturday mornings, I wake up and walk to the small bakery near my house. The baker is very friendly and sells delicious warm bread.">
                <div class="prompt-category-tag">A1 Beginner Prompt</div>
                <div class="prompt-text">Write a simple routine story about buying food on a weekend morning.</div>
                <button class="prompt-insert-btn">Use this prompt →</button>
              </div>

              <!-- B1 Story Prompt -->
              <div class="prompt-item" data-category="stories" 
                   data-prompt="As soon as the train pulled into the platform, Liam knew his holiday was going to be completely unexpected.">
                <div class="prompt-category-tag">B1 Story Starter</div>
                <div class="prompt-text">"As soon as the train pulled into the platform, Liam knew his holiday was going to be completely unexpected."</div>
                <button class="prompt-insert-btn">Use this prompt →</button>
              </div>

              <!-- B1 Letter Prompt -->
              <div class="prompt-item" data-category="letters" 
                   data-prompt="Dear Sarah,&#10;&#10;I am writing to apologize for missing your birthday party last Saturday. Unfortunately, my train was delayed...&#10;&#10;Can we meet next weekend for lunch instead?">
                <div class="prompt-category-tag">B1 Letter Prompt</div>
                <div class="prompt-text">Apologizing to a friend for missing a gathering and proposing an alternative plan.</div>
                <button class="prompt-insert-btn">Use this prompt →</button>
              </div>

              <!-- B2 Article Prompt -->
              <div class="prompt-item" data-category="articles" 
                   data-prompt="Why Learning a Musical Instrument or Sport is the Best Decision for Teenagers&#10;&#10;Many teenagers spend hours in front of screens every day. However, picking up a creative or physical hobby can transform your lifestyle...">
                <div class="prompt-category-tag">B2 Article Prompt</div>
                <div class="prompt-text">Write a school magazine article discussing why hobbies benefit teenagers' mental health.</div>
                <button class="prompt-insert-btn">Use this prompt →</button>
              </div>

              <!-- C1 Essay Prompt -->
              <div class="prompt-item" data-category="articles" 
                   data-prompt="The Ubiquity of Algorithmic Curation and the Erosion of Serendipitous Discovery&#10;&#10;Contemporary digital architecture has systematically streamlined human decision-making. While algorithmic personalization optimizes efficiency, it invariably curtails the cognitive serendipity essential to intellectual growth...">
                <div class="prompt-category-tag">C1 Advanced Essay</div>
                <div class="prompt-text">Critique the societal implications of algorithmic recommendations on critical thinking.</div>
                <button class="prompt-insert-btn">Use this prompt →</button>
              </div>

              <!-- Email Prompt -->
              <div class="prompt-item" data-category="emails" 
                   data-prompt="Hi Daniel,&#10;&#10;Thanks so much for inviting me to visit your city next month! I am really looking forward to seeing you.&#10;&#10;Could you recommend some nice museums and outdoor places we can visit together?">
                <div class="prompt-category-tag">Email Prompt</div>
                <div class="prompt-text">Replying enthusiastically to an invitation and asking for recommendations for weekend activities.</div>
                <button class="prompt-insert-btn">Use this prompt →</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;

    this._setupStudioLogic(container, editId);
  }

  static async _setupStudioLogic(container, editId) {
    const titleInput = container.querySelector('#studio-title');
    const categorySelect = container.querySelector('#studio-category');
    const levelSelect = container.querySelector('#studio-level');
    const visibilitySelect = container.querySelector('#studio-visibility');
    const contentTextarea = container.querySelector('#studio-content');

    const statWords = container.querySelector('#stat-words');
    const statChars = container.querySelector('#stat-chars');
    const statReadTime = container.querySelector('#stat-read-time');

    const modeEditBtn = container.querySelector('#mode-edit-btn');
    const modePreviewBtn = container.querySelector('#mode-preview-btn');
    const editorWrapper = container.querySelector('#studio-editor-wrapper');
    const previewWrapper = container.querySelector('#studio-preview-wrapper');
    const previewContent = container.querySelector('#studio-preview-content');

    const saveDraftBtn = container.querySelector('#studio-save-draft-btn');
    const publishBtn = container.querySelector('#studio-publish-btn');
    const reviewBtn = container.querySelector('#studio-review-btn');
    const clearBtn = container.querySelector('#studio-clear-btn');
    const statusTag = container.querySelector('#studio-status-tag');
    const statusLabel = container.querySelector('#studio-status-label');
    const saveTimestamp = container.querySelector('#studio-save-timestamp');

    // Live counter updater
    const updateCounters = () => {
      const text = contentTextarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = text.length;
      const readMin = Math.max(1, Math.ceil(words / 170));

      statWords.textContent = words;
      statChars.textContent = chars;
      statReadTime.textContent = words > 0 ? readMin : 0;
    };

    contentTextarea.addEventListener('input', () => {
      updateCounters();
      saveTimestamp.textContent = 'Unsaved changes';
    });

    // If editId was provided, load piece from server
    if (editId) {
      try {
        const existing = await LunaApi.getWritingById(editId);
        if (existing) {
          titleInput.value = existing.title || '';
          categorySelect.value = existing.category || 'stories';
          levelSelect.value = existing.level || 'B1';
          visibilitySelect.value = existing.visibility || 'private';
          contentTextarea.value = existing.content || '';

          if (existing.status === 'published') {
            statusTag.className = 'studio-status-pill status-published';
            statusLabel.textContent = 'Published';
          }
          saveTimestamp.textContent = `Loaded ${existing.title}`;
          updateCounters();
        }
      } catch (e) {
        Toast.error('Could not load existing writing: ' + e.message);
      }
    }

    // Toggle Preview Mode
    modeEditBtn.addEventListener('click', () => {
      modeEditBtn.classList.add('active');
      modePreviewBtn.classList.remove('active');
      editorWrapper.style.display = 'block';
      previewWrapper.style.display = 'none';
      this.isPreviewMode = false;
    });

    modePreviewBtn.addEventListener('click', () => {
      modePreviewBtn.classList.add('active');
      modeEditBtn.classList.remove('active');
      editorWrapper.style.display = 'none';
      previewWrapper.style.display = 'block';
      this.isPreviewMode = true;

      // Render paragraphs in preview
      const paragraphs = contentTextarea.value.trim().split(/\n\s*\n/);
      previewContent.innerHTML = paragraphs.length > 0 && paragraphs[0]
        ? paragraphs.map(p => `<p>${escapeHtml(p.trim())}</p>`).join('')
        : '<p style="color: var(--text-faint); font-style: italic;">Nothing to preview yet. Write something in the editor!</p>';
    });

    // New Piece Button
    const newPieceBtn = container.querySelector('#studio-new-btn');
    if (newPieceBtn) {
      newPieceBtn.addEventListener('click', () => {
        if (contentTextarea.value.trim() && !confirm('Start a new writing piece? Unsaved changes will be cleared.')) {
          return;
        }
        this.currentDraftId = null;
        window.history.replaceState({}, '', '/studio');
        titleInput.value = '';
        contentTextarea.value = '';
        categorySelect.value = 'stories';
        levelSelect.value = 'B1';
        visibilitySelect.value = 'private';
        statusTag.className = 'studio-status-pill status-draft';
        statusLabel.textContent = 'Private Draft';
        saveTimestamp.textContent = 'New untitled piece';
        updateCounters();
        Toast.info('Ready for a new writing piece.');
      });
    }

    // Save Draft
    saveDraftBtn.addEventListener('click', async () => {
      const title = titleInput.value.trim() || 'Untitled Draft';
      const content = contentTextarea.value.trim();

      if (!content) {
        Toast.warning('Please enter some content before saving.');
        return;
      }

      saveDraftBtn.disabled = true;
      saveDraftBtn.textContent = 'Saving to database...';

      const payload = {
        title,
        category: categorySelect.value,
        level: levelSelect.value,
        visibility: visibilitySelect.value,
        status: 'draft',
        content,
        topic: 'General'
      };

      try {
        if (this.currentDraftId) {
          await LunaApi.updateWriting(this.currentDraftId, payload);
        } else {
          const created = await LunaApi.createWriting(payload);
          this.currentDraftId = created.id;
        }

        // Keep browser URL synchronized with the active draft ID
        window.history.replaceState({}, '', `/studio?edit=${this.currentDraftId}`);

        saveTimestamp.textContent = `Draft saved to database at ${new Date().toLocaleTimeString()}`;
        statusTag.className = 'studio-status-pill status-draft';
        statusLabel.textContent = 'Private Draft';
        Toast.success('Draft saved successfully to database!');
      } catch (e) {
        Toast.error('Failed to save draft: ' + e.message);
      } finally {
        saveDraftBtn.disabled = false;
        saveDraftBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Draft
        `;
      }
    });

    // Publish to Library
    publishBtn.addEventListener('click', async () => {
      const title = titleInput.value.trim();
      const content = contentTextarea.value.trim();

      if (!title || !content) {
        Toast.warning('Please provide both a title and content to publish.');
        return;
      }

      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing to database...';

      const payload = {
        title,
        category: categorySelect.value,
        level: levelSelect.value,
        visibility: 'public',
        status: 'published',
        content,
        topic: 'General'
      };

      try {
        if (this.currentDraftId) {
          await LunaApi.updateWriting(this.currentDraftId, payload);
        } else {
          const created = await LunaApi.createWriting(payload);
          this.currentDraftId = created.id;
        }

        // Keep URL in sync
        window.history.replaceState({}, '', `/studio?edit=${this.currentDraftId}`);

        statusTag.className = 'studio-status-pill status-published';
        statusLabel.textContent = 'Published';
        saveTimestamp.textContent = `Published at ${new Date().toLocaleTimeString()}`;
        visibilitySelect.value = 'public';
        Toast.success('Piece published to the library!');
      } catch (e) {
        Toast.error('Publish failed: ' + e.message);
      } finally {
        publishBtn.disabled = false;
        publishBtn.textContent = 'Publish to Library';
      }
    });

    // Request AI B1 Review
    reviewBtn.addEventListener('click', async () => {
      const text = contentTextarea.value.trim();
      if (text.length < 25) {
        Toast.warning('Please write at least 25 characters to request a CEFR evaluation.');
        return;
      }

      // Auto-save draft before evaluation if not saved yet
      if (!this.currentDraftId && text) {
        try {
          const autoDraft = await LunaApi.createWriting({
            title: titleInput.value.trim() || 'Untitled Piece',
            category: categorySelect.value,
            level: levelSelect.value,
            visibility: visibilitySelect.value,
            status: 'draft',
            content: text,
            topic: 'General'
          });
          this.currentDraftId = autoDraft.id;
          window.history.replaceState({}, '', `/studio?edit=${autoDraft.id}`);
          saveTimestamp.textContent = `Draft saved at ${new Date().toLocaleTimeString()}`;
        } catch (e) {
          console.warn('Auto-save before review failed:', e);
        }
      }

      reviewBtn.disabled = true;
      reviewBtn.innerHTML = `
        <span class="status-dot" style="background-color: white;"></span>
        Analyzing CEFR Rubric...
      `;

      try {
        const review = await LunaApi.evaluateB1({
          writing_id: this.currentDraftId,
          title: titleInput.value.trim() || 'Untitled Piece',
          category: categorySelect.value,
          target_level: levelSelect.value,
          content: text
        });

        ReviewModal.open(review);
      } catch (err) {
        Toast.error(err.message || 'AI review request failed');
      } finally {
        reviewBtn.disabled = false;
        reviewBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
          Request AI CEFR Review
        `;
      }
    });

    // Clear Text
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear the entire text in the editor?')) {
        contentTextarea.value = '';
        updateCounters();
        saveTimestamp.textContent = 'Cleared';
      }
    });

    // Prompts Insertion
    container.querySelectorAll('.prompt-item').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.getAttribute('data-category');
        const promptText = item.getAttribute('data-prompt');

        if (cat) categorySelect.value = cat;

        if (contentTextarea.value.trim() && !confirm('Insert prompt? This will place the prompt at the end of your editor.')) {
          return;
        }

        if (contentTextarea.value.trim()) {
          contentTextarea.value += '\n\n' + promptText;
        } else {
          contentTextarea.value = promptText;
          if (!titleInput.value) {
            titleInput.value = item.querySelector('.prompt-category-tag').textContent;
          }
        }

        updateCounters();
        Toast.success('Prompt added to editor!');
      });
    });

    // File Upload Handler (Dropzone & Input)
    const fileInput = container.querySelector('#file-upload-input');
    const dropzone = container.querySelector('#upload-dropzone');

    const handleFile = async (file) => {
      if (!file) return;

      const validExts = ['.txt', '.md', '.docx', '.json'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();

      if (!validExts.includes(fileExt)) {
        Toast.error(`Unsupported file type '${fileExt}'. Supported: .txt, .md, .docx, .json`);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        Toast.error('File exceeds the 2 MB maximum size limit.');
        return;
      }

      Toast.info(`Uploading '${file.name}'...`);
      try {
        const res = await LunaApi.uploadDocument(file);
        if (res.title && !titleInput.value) titleInput.value = res.title;
        if (res.category) categorySelect.value = res.category;
        contentTextarea.value = res.content;
        updateCounters();
        Toast.success(res.message || 'File parsed successfully into editor!');
      } catch (err) {
        Toast.error('Upload failed: ' + err.message);
      }
    };

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    // Listen for accepted sentence suggestions from ReviewModal!
    window.addEventListener('luna:accept-suggestion', (e) => {
      const { original, replacement } = e.detail;
      if (original && replacement && contentTextarea.value.includes(original)) {
        contentTextarea.value = contentTextarea.value.replace(original, replacement);
        updateCounters();
        saveTimestamp.textContent = 'Updated with AI suggestion';
      }
    });
  }
}

window.StudioPage = StudioPage;
