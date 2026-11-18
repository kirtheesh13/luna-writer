/**
 * Luna Writer - Documented API Client
 * Connects frontend views to FastAPI backend endpoints.
 */

const API_BASE = (() => {
  if (typeof window === 'undefined') return 'http://127.0.0.1:8000';
  const { protocol, hostname, port, origin } = window.location;
  // If served directly from the FastAPI backend (e.g. port 8000) or a production domain
  if ((protocol === 'http:' || protocol === 'https:') && (port === '8000' || (!port && hostname !== 'localhost' && hostname !== '127.0.0.1'))) {
    return origin;
  }
  // If opened via file:// or another dev server port (e.g. 5500, 3000, 5173), target FastAPI backend on port 8000
  return 'http://127.0.0.1:8000';
})();

class LunaApi {
  /**
   * Internal fetch wrapper with unified JSON handling and error reporting.
   */
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = options.headers || {};

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        let errorDetail = `Request failed (${response.status})`;
        try {
          const errData = await response.json();
          errorDetail = errData.detail || errData.message || errorDetail;
        } catch (_) {}
        throw new Error(errorDetail);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (err) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  }

  // --- Writings Endpoints ---
  static async getWritings(params = {}) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return await this.request(`/api/writings${qStr}`);
  }

  static async getWritingById(id) {
    return await this.request(`/api/writings/${encodeURIComponent(id)}`);
  }

  static async createWriting(data) {
    return await this.request('/api/writings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async updateWriting(id, data) {
    return await this.request(`/api/writings/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async deleteWriting(id) {
    return await this.request(`/api/writings/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  static async getCategoryStats() {
    return await this.request('/api/writings/stats/categories');
  }

  // --- Bookmarks Endpoints ---
  static async toggleBookmark(writingId) {
    return await this.request(`/api/bookmarks/${encodeURIComponent(writingId)}`, {
      method: 'POST'
    });
  }

  static async getBookmarks() {
    return await this.request('/api/bookmarks');
  }

  // --- AI B1 Reviews Endpoints ---
  static async evaluateB1(payload) {
    return await this.request('/api/reviews/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  static async getReviewHistory(writingId = null) {
    const q = writingId ? `?writing_id=${encodeURIComponent(writingId)}` : '';
    return await this.request(`/api/reviews/history${q}`);
  }

  static async getReviewById(id) {
    return await this.request(`/api/reviews/${encodeURIComponent(id)}`);
  }

  // --- Uploads Endpoint ---
  static async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await this.request('/api/uploads', {
      method: 'POST',
      body: formData
    });
  }

  // --- Settings Endpoints ---
  static async getSettings() {
    return await this.request('/api/settings');
  }

  static async saveSettings(settings) {
    return await this.request('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  }

  static async resetSettings() {
    return await this.request('/api/settings/reset', {
      method: 'POST'
    });
  }

  // --- Status & Health Endpoints ---
  static async getSystemStatus() {
    return await this.request('/api/status');
  }
}

window.LunaApi = LunaApi;
