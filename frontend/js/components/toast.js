/**
 * Luna Writer - Toast Notification Component
 */

class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `luna-toast toast-${type}`;
    toast.style.cssText = `
      pointer-events: auto;
      background: var(--bg-surface);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 0.75rem 1.15rem;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      max-width: 380px;
      transform: translateY(20px);
      opacity: 0;
      transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
    `;

    let icon = 'ℹ️';
    let borderColor = 'var(--primary)';
    if (type === 'success') {
      icon = '✅';
      borderColor = 'var(--color-success)';
    } else if (type === 'warning') {
      icon = '⚠️';
      borderColor = 'var(--color-warning)';
    } else if (type === 'error') {
      icon = '❌';
      borderColor = 'var(--color-danger)';
    }

    toast.style.borderLeft = `4px solid ${borderColor}`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    // Auto dismiss
    setTimeout(() => {
      toast.style.transform = 'translateY(10px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  static success(msg, dur) { this.show(msg, 'success', dur); }
  static error(msg, dur) { this.show(msg, 'error', dur); }
  static warning(msg, dur) { this.show(msg, 'warning', dur); }
  static info(msg, dur) { this.show(msg, 'info', dur); }
}

window.Toast = Toast;
