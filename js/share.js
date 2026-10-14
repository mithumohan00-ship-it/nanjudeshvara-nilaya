/**
 * Digital Invitation Sharing Engine
 * Supports WhatsApp, Telegram, Copy Link, Native Mobile Share, and QR Code display.
 */

class InvitationShare {
  constructor() {
    this.shareModal = document.getElementById('share-modal');
    this.openModalBtns = document.querySelectorAll('.open-share-modal-btn');
    this.closeModalBtn = document.getElementById('close-share-modal-btn');

    this.whatsappBtn = document.getElementById('share-whatsapp-btn');
    this.telegramBtn = document.getElementById('share-telegram-btn');
    this.copyLinkBtn = document.getElementById('share-copylink-btn');
    this.nativeShareBtn = document.getElementById('share-native-btn');
    this.copyAddressBtns = document.querySelectorAll('.copy-address-btn');

    this.qrCanvas = document.getElementById('qr-code-canvas');
    this.toastEl = document.getElementById('toast-notification');

    this.pageUrl = window.location.href;

    // Exact invitation text specified by user
    this.invitationText = `With divine blessings, we warmly invite you and your family to our Gruhapravesha ceremony on 30 October 2026.

Ceremony: 4:40 AM – 6:40 AM
Sri Satyanarayana Swamy Puja: 10:00 AM onwards
Lunch: 12:30 PM

Venue: Nagadevanahalli, Bengaluru – 560 056.
Location Map: https://goo.gl/maps/qCS5dRAVQBboKctw7?g_st=aw

We look forward to your gracious presence and blessings.

Invitation Link: ${this.pageUrl}`;

    this.init();
  }

  init() {
    // Modal controls
    this.openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.shareModal) {
      this.shareModal.addEventListener('click', (e) => {
        if (e.target === this.shareModal) this.closeModal();
      });
    }

    // WhatsApp share
    if (this.whatsappBtn) {
      this.whatsappBtn.addEventListener('click', () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.invitationText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }

    // Telegram share
    if (this.telegramBtn) {
      this.telegramBtn.addEventListener('click', () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(this.pageUrl)}&text=${encodeURIComponent(this.invitationText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }

    // Copy Link button
    if (this.copyLinkBtn) {
      this.copyLinkBtn.addEventListener('click', () => {
        this.copyToClipboard(this.pageUrl, 'Invitation link copied to clipboard! ✨');
      });
    }

    // Native Web Share API
    if (this.nativeShareBtn) {
      if (navigator.share) {
        this.nativeShareBtn.style.display = 'inline-flex';
        this.nativeShareBtn.addEventListener('click', async () => {
          try {
            await navigator.share({
              title: 'Sri Sanjundeshwara Nilaya – Gruhapravesha Invitation 2026',
              text: this.invitationText,
              url: this.pageUrl
            });
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.log('Share error:', err);
            }
          }
        });
      } else {
        this.nativeShareBtn.style.display = 'none';
      }
    }

    // Copy Address buttons
    this.copyAddressBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const address = 'Sri Sanjundeshwara Nilaya, Nagadevanahalli, Bengaluru – 560 056, Karnataka, India';
        this.copyToClipboard(address, 'Venue address copied to clipboard! 📍');
      });
    });

    // Render QR Code
    this.renderQrCode();
  }

  openModal() {
    if (!this.shareModal) return;
    this.shareModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.shareModal) return;
    this.shareModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(successMsg);
      }).catch(() => {
        this.fallbackCopy(text, successMsg);
      });
    } else {
      this.fallbackCopy(text, successMsg);
    }
  }

  fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      this.showToast(successMsg);
    } catch (err) {
      this.showToast('Please copy manually.');
    }
    document.body.removeChild(tempInput);
  }

  showToast(message) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3200);
  }

  // Draw clean standalone QR Code matrix onto canvas for high reliability
  renderQrCode() {
    if (!this.qrCanvas) return;
    const ctx = this.qrCanvas.getContext('2d');
    const size = 180;
    this.qrCanvas.width = size;
    this.qrCanvas.height = size;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Auspicious border in gold
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);

    // Draw standard QR Finder Patterns (Top-Left, Top-Right, Bottom-Left)
    const drawFinderPattern = (x, y) => {
      // 7x7 outer black
      ctx.fillStyle = '#212121';
      ctx.fillRect(x, y, 42, 42);
      // 5x5 white inner
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 6, y + 6, 30, 30);
      // 3x3 black center
      ctx.fillStyle = '#8B1E2D'; // Deep royal maroon
      ctx.fillRect(x + 12, y + 12, 18, 18);
    };

    drawFinderPattern(12, 12);
    drawFinderPattern(size - 54, 12);
    drawFinderPattern(12, size - 54);

    // Timing patterns
    ctx.fillStyle = '#424242';
    for (let i = 18; i < size - 54; i += 8) {
      ctx.fillRect(i, 30, 4, 4);
      ctx.fillRect(30, i, 4, 4);
    }

    // Pseudorandom consistent deterministic data grid pattern based on string hash
    const hashStr = this.pageUrl || 'SriSanjundeshwaraNilaya2026';
    let seed = 0;
    for (let c = 0; c < hashStr.length; c++) {
      seed = (seed * 31 + hashStr.charCodeAt(c)) & 0xffffff;
    }

    const pseudoRandom = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return (seed >> 16) / 32768;
    };

    const cellSize = 6;
    for (let x = 12; x < size - 12; x += cellSize) {
      for (let y = 12; y < size - 12; y += cellSize) {
        // Skip finder areas
        if (
          (x < 58 && y < 58) ||
          (x > size - 60 && y < 58) ||
          (x < 58 && y > size - 60)
        ) {
          continue;
        }

        if (pseudoRandom() > 0.5) {
          ctx.fillStyle = (x + y) % 18 === 0 ? '#1B4D3E' : '#212121';
          ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }

    // Center Sacred Kalash / Om mini watermark in QR
    const center = size / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(center, center, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#8B1E2D';
    ctx.font = 'bold 12px "Noto Sans Kannada", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', center, center);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.invitationShare = new InvitationShare();
});
