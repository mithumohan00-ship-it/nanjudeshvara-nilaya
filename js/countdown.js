/**
 * Real-Time Countdown Timer for Gruhapravesha Ceremony
 * Target: 30 October 2026, 04:40:00 AM IST (Asia/Kolkata, UTC+05:30)
 */

class GruhapraveshaCountdown {
  constructor() {
    // Target time: 2026-10-30 04:40:00 AM IST
    this.targetDate = new Date('2026-10-30T04:40:00+05:30').getTime();
    this.intervalId = null;

    this.daysEl = document.getElementById('count-days');
    this.hoursEl = document.getElementById('count-hours');
    this.minutesEl = document.getElementById('count-minutes');
    this.secondsEl = document.getElementById('count-seconds');
    this.statusEl = document.getElementById('countdown-status-badge');
    this.containerEl = document.getElementById('countdown-timer-container');

    this.prevValues = { d: null, h: null, m: null, s: null };
  }

  init() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
    this.setupCalendarButtons();
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      if (this.intervalId) clearInterval(this.intervalId);
      this.renderCompleted();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.updateElement(this.daysEl, days, 'd');
    this.updateElement(this.hoursEl, hours, 'h');
    this.updateElement(this.minutesEl, minutes, 'm');
    this.updateElement(this.secondsEl, seconds, 's');
  }

  updateElement(el, val, key) {
    if (!el) return;
    const formatted = String(val).padStart(2, '0');
    if (this.prevValues[key] !== formatted) {
      el.textContent = formatted;
      el.classList.add('pulse-num');
      setTimeout(() => el.classList.remove('pulse-num'), 300);
      this.prevValues[key] = formatted;
    }
  }

  renderCompleted() {
    if (this.daysEl) this.daysEl.textContent = '00';
    if (this.hoursEl) this.hoursEl.textContent = '00';
    if (this.minutesEl) this.minutesEl.textContent = '00';
    if (this.secondsEl) this.secondsEl.textContent = '00';

    if (this.statusEl) {
      this.statusEl.innerHTML = `
        <span class="auspicious-badge-live">
          ✨ ಶುಭ ಮುಹೂರ್ತ ಪ್ರಾರಂಭವಾಗಿದೆ ✨<br>
          <span style="font-size:0.9em;font-weight:normal;">The Sacred Gruhapravesha Ceremony has Commenced!</span>
        </span>
      `;
    }
  }

  setupCalendarButtons() {
    const gCalBtn = document.getElementById('add-gcal-btn');
    const iCalBtn = document.getElementById('add-ical-btn');

    const eventTitle = 'Sri Sanjundeshwara Nilaya – Gruhapravesha Ceremony 2026';
    const eventDetails = 'Gruhapravesha Ceremony (4:40 AM - 6:40 AM), Sri Satyanarayana Swamy Puja (10:00 AM onwards), Bhojana/Lunch (12:30 PM). Venue: Doddagenahalli, Bengaluru - 560 056. Google Maps: https://goo.gl/maps/qCS5dRAVQBboKctw7?g_st=aw';
    const eventLocation = 'Doddagenahalli, Bengaluru – 560 056, Karnataka, India';

    // 2026-10-30 04:40 to 15:00 IST -> UTC is 20261029T231000Z to 20261030T093000Z
    const startIsoUtc = '20261029T231000Z';
    const endIsoUtc = '20261030T093000Z';

    if (gCalBtn) {
      gCalBtn.addEventListener('click', () => {
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startIsoUtc}/${endIsoUtc}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }

    if (iCalBtn) {
      iCalBtn.addEventListener('click', () => {
        this.downloadICalFile(eventTitle, eventDetails, eventLocation, startIsoUtc, endIsoUtc);
      });
    }
  }

  downloadICalFile(title, description, location, start, end) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sri Sanjundeshwara Nilaya//Gruhapravesha 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:gruhapravesha-2026-${Date.now()}@srisanjundeshwara.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Gruhapravesha-Invitation-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const timer = new GruhapraveshaCountdown();
  timer.init();
});
