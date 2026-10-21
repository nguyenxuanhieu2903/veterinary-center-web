/**
 * PETCARE CLINIC - MODAL CONTROLLER
 * Supports Escape key, backdrop clicks, loading states, double-click protection & confirm dialogs
 */

const ModalManager = {
  activeModal: null,

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    this.activeModal = modal;

    // Focus on first input if present
    const firstInput = modal.querySelector('input:not([type=hidden]), button:not(.modal-close)');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  },

  close(modalId) {
    const modal = modalId ? document.getElementById(modalId) : this.activeModal;
    if (!modal) return;

    modal.classList.remove('show');
    document.body.style.overflow = '';
    this.activeModal = null;
  },

  setLoading(modalId, isLoading, loadingText = 'Đang xử lý...') {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    let overlay = modal.querySelector('.modal-loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-loading-overlay';
      overlay.innerHTML = `
        <div class="spinner"></div>
        <div style="font-weight: 600; font-size: 0.95rem; color: #0f172a;" class="loading-text">${loadingText}</div>
      `;
      modal.querySelector('.modal-dialog').appendChild(overlay);
    }

    if (isLoading) {
      overlay.querySelector('.loading-text').textContent = loadingText;
      overlay.classList.add('active');
      modal.querySelectorAll('.modal-footer button, .modal-close').forEach(b => b.disabled = true);
    } else {
      overlay.classList.remove('active');
      modal.querySelectorAll('.modal-footer button, .modal-close').forEach(b => b.disabled = false);
    }
  },

  confirm({
    title = 'Xác nhận thao tác',
    message = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
    confirmText = 'Đồng ý',
    cancelText = 'Hủy bỏ',
    isDanger = false,
    onConfirm = () => {}
  }) {
    let confirmModal = document.getElementById('global-confirm-modal');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'global-confirm-modal';
      confirmModal.className = 'modal-backdrop';
      confirmModal.innerHTML = `
        <div class="modal-dialog modal-sm">
          <div class="modal-header">
            <h3 class="modal-title" id="confirm-modal-title">Xác nhận</h3>
            <button class="modal-close" onclick="ModalManager.close('global-confirm-modal')">&times;</button>
          </div>
          <div class="modal-body" id="confirm-modal-message">
            Nội dung xác nhận
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="confirm-modal-cancel" onclick="ModalManager.close('global-confirm-modal')">Hủy</button>
            <button class="btn btn-primary" id="confirm-modal-ok">Đồng ý</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);

      // Outside click listener
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) ModalManager.close('global-confirm-modal');
      });
    }

    document.getElementById('confirm-modal-title').innerHTML = isDanger ? `⚠️ ${title}` : `❓ ${title}`;
    document.getElementById('confirm-modal-message').innerHTML = message;
    
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    cancelBtn.textContent = cancelText;

    const okBtn = document.getElementById('confirm-modal-ok');
    okBtn.textContent = confirmText;
    okBtn.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';

    // Lock double click
    okBtn.onclick = async () => {
      okBtn.disabled = true;
      okBtn.innerHTML = 'Đang xử lý...';
      try {
        await onConfirm();
      } finally {
        okBtn.disabled = false;
        okBtn.textContent = confirmText;
        ModalManager.close('global-confirm-modal');
      }
    };

    ModalManager.open('global-confirm-modal');
  }
};

// Global Escape Key Listener & Outside Click Listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ModalManager.activeModal) {
    ModalManager.close();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        ModalManager.close(modal.id);
      }
    });
  });
});

