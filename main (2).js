// Page Transition
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  // Set active nav link
  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-link");
  
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Scroll Animations
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate-float-up, .animate-slide-in-left, .animate-slide-in-right").forEach((el) => {
    observer.observe(el);
  });

  // Floating Hearts Effect
  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 7000);
  }

  // Create hearts periodically on home page
  if (page === 'index.html' || page === '') {
    setInterval(createFloatingHeart, 3000);
  }

  // Parallax effect on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach((el, index) => {
          const speed = (index + 1) * 0.5;
          el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
        
        ticking = false;
      });
      ticking = true;
    }
  });

  // 3D Tilt effect on mouse move
  document.querySelectorAll('.tilt-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  console.log("%c🎸 Ahmad & Adellia Wedding - Punk Love 🎸", "color: #ff2e88; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #31ff6a;");
});

// Countdown Logic
const targetDate = new Date("2026-06-21T10:00:00+07:00").getTime();
const daysSpan = document.getElementById("cd-days");
if (daysSpan) {
  const hoursSpan = document.getElementById("cd-hours");
  const minutesSpan = document.getElementById("cd-minutes");
  const secondsSpan = document.getElementById("cd-seconds");
  const cdNote = document.getElementById("cd-note");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysSpan && hoursSpan && minutesSpan && secondsSpan) {
        daysSpan.textContent = "0";
        hoursSpan.textContent = "0";
        minutesSpan.textContent = "0";
        secondsSpan.textContent = "0";
      }
      if (cdNote) {
        cdNote.textContent = "🎉 Hari ini Ahmad & Adellia resmi mengikat janji. Terima kasih sudah menjadi bagian dari cerita kami!";
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysSpan && hoursSpan && minutesSpan && secondsSpan) {
      daysSpan.textContent = days;
      hoursSpan.textContent = hours;
      minutesSpan.textContent = minutes;
      secondsSpan.textContent = seconds;
    }

    if (cdNote) {
      if (days <= 0) {
        cdNote.textContent = "⏰ Sebentar lagi kita akan merayakan hari besar Ahmad & Adellia!";
      } else if (days <= 7) {
        cdNote.textContent = "🚀 Hitungan hari! Jangan lupa siapkan outfit terbaikmu untuk pernikahan Ahmad & Adellia.";
      } else {
        cdNote.textContent = "📅 Masih ada waktu untuk menandai kalender dan mengatur jadwal agar bisa hadir.";
      }
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// RSVP Logic
const rsvpForm = document.getElementById("rsvp-form");
if (rsvpForm) {
  const rsvpMessage = document.getElementById("rsvp-message");
  const guestList = document.getElementById("guest-list");
  const btnClearGuests = document.getElementById("btn-clear-guests");

  function loadGuests() {
    if (!guestList) return;
    guestList.innerHTML = "";
    const stored = localStorage.getItem("mpey-eidiel-guests");
    if (!stored) {
      guestList.innerHTML = '<p class="text-[0.7rem] text-slate-400">Belum ada konfirmasi. Jadilah yang pertama mengkonfirmasi kehadiran kamu.</p>';
      return;
    }
    let data = [];
    try {
      data = JSON.parse(stored) || [];
    } catch (e) {
      console.error("Failed to parse guest data", e);
    }
    if (!data.length) {
      guestList.innerHTML = '<p class="text-[0.7rem] text-slate-400">Belum ada konfirmasi. Jadilah yang pertama mengkonfirmasi kehadiran kamu.</p>';
      return;
    }

    data.slice().reverse().forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "rounded-lg border border-slate-700/80 bg-black/40 px-3 py-2 animate-float-up visible";
      wrapper.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <p class="text-[0.75rem] font-semibold text-slate-100">${item.nama}</p>
          <span class="text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">${item.status}</span>
        </div>
        <p class="mt-1 text-[0.7rem] text-slate-200">${item.pesan || "(Tanpa pesan)"}</p>
      `;
      guestList.appendChild(wrapper);
    });
  }

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value.trim();
    const status = document.getElementById("status").value;
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama) {
      if (rsvpMessage) {
        rsvpMessage.textContent = "Nama tidak boleh kosong.";
        rsvpMessage.className = "text-[0.7rem] text-pink-300";
      }
      return;
    }

    const stored = localStorage.getItem("mpey-eidiel-guests");
    let data = [];
    try {
      data = stored ? JSON.parse(stored) || [] : [];
    } catch (e) {
      console.error(e);
    }
    data.push({ nama, status, pesan, t: Date.now() });
    localStorage.setItem("mpey-eidiel-guests", JSON.stringify(data));

    if (rsvpMessage) {
      rsvpMessage.textContent = "✅ Terima kasih! Konfirmasi kehadiranmu sudah tersimpan.";
      rsvpMessage.className = "text-[0.7rem] text-lime-300";
    }

    rsvpForm.reset();
    loadGuests();
  });

  if (btnClearGuests) {
    btnClearGuests.addEventListener("click", () => {
      if (!confirm("Yakin ingin menghapus semua konfirmasi di perangkat ini?")) return;
      localStorage.removeItem("mpey-eidiel-guests");
      if (rsvpMessage) {
        rsvpMessage.textContent = "🗑️ Konfirmasi pada perangkat ini sudah dibersihkan.";
        rsvpMessage.className = "text-[0.7rem] text-slate-300";
      }
      loadGuests();
    });
  }

  loadGuests();
}

// Wishes Logic
const wishesForm = document.getElementById("wishes-form");
if (wishesForm) {
  const wishesMessage = document.getElementById("wishes-message");
  const wishesList = document.getElementById("wishes-list");
  const btnClearWishes = document.getElementById("btn-clear-wishes");

  function loadWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = "";
    const stored = localStorage.getItem("mpey-eidiel-wishes");
    if (!stored) {
      wishesList.innerHTML = '<p class="text-[0.7rem] text-slate-400">Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan dan doa untuk Ahmad & Adellia.</p>';
      return;
    }
    let data = [];
    try {
      data = JSON.parse(stored) || [];
    } catch (e) {
      console.error("Failed to parse wishes data", e);
    }
    if (!data.length) {
      wishesList.innerHTML = '<p class="text-[0.7rem] text-slate-400">Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan dan doa untuk Ahmad & Adellia.</p>';
      return;
    }

    data.slice().reverse().forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "wish-card rounded-lg border border-slate-700/80 bg-black/40 px-3 py-3 animate-float-up visible";
      wrapper.innerHTML = `
        <p class="text-[0.75rem] font-semibold text-slate-100">${item.name}</p>
        <p class="mt-2 text-[0.7rem] text-slate-200 italic">"${item.text}"</p>
      `;
      wishesList.appendChild(wrapper);
    });
  }

  wishesForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("wish-name").value.trim();
    const text = document.getElementById("wish-text").value.trim();

    if (!name || !text) {
      if (wishesMessage) {
        wishesMessage.textContent = "Nama dan ucapan tidak boleh kosong.";
        wishesMessage.className = "text-[0.7rem] text-pink-300";
      }
      return;
    }

    const stored = localStorage.getItem("mpey-eidiel-wishes");
    let data = [];
    try {
      data = stored ? JSON.parse(stored) || [] : [];
    } catch (e) {
      console.error(e);
    }
    data.push({ name, text, t: Date.now() });
    localStorage.setItem("mpey-eidiel-wishes", JSON.stringify(data));

    if (wishesMessage) {
      wishesMessage.textContent = "✨ Terima kasih! Ucapan dan doa kamu sudah tersimpan.";
      wishesMessage.className = "text-[0.7rem] text-lime-300";
    }

    wishesForm.reset();
    loadWishes();
  });

  if (btnClearWishes) {
    btnClearWishes.addEventListener("click", () => {
      if (!confirm("Yakin ingin menghapus semua ucapan di perangkat ini?")) return;
      localStorage.removeItem("mpey-eidiel-wishes");
      if (wishesMessage) {
        wishesMessage.textContent = "🗑️ Semua ucapan pada perangkat ini sudah dibersihkan.";
        wishesMessage.className = "text-[0.7rem] text-slate-300";
      }
      loadWishes();
    });
  }

  loadWishes();
}
