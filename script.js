/* ==========================================================================
   TIMEWARP TATTOO & PIERCING — INTERACTIVE STUDIO & NATIVE MOBILE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Kissimmee Eastern Time Studio Hours Status
  const statusTextEl = document.getElementById('live-studio-status');
  if (statusTextEl) {
    try {
      const nowEst = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
      );
      const hour = nowEst.getHours();
      const isOpen = hour >= 11 && hour < 19;
      statusTextEl.textContent = isOpen
        ? 'Open Now • 11 AM – 7 PM'
        : 'Open Daily • 11 AM – 7 PM';
    } catch (e) {
      statusTextEl.textContent = 'Open Daily • 11 AM – 7 PM';
    }
  }

  // 2. Native Mobile Slide-Over Drawer & Navigation Linking
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  const setDrawerOpen = (open) => {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.toggle('open', open);
    drawerBackdrop.classList.toggle('open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', String(open));
      mobileBtn.textContent = open ? 'Close ×' : 'Menu';
    }
  };

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('open');
      setDrawerOpen(!isOpen);
    });
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => setDrawerOpen(false));
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => setDrawerOpen(false));
  }

  // Ensure clicking any artist jump link (in Hero Dock, Mobile Drawer, or Footer)
  // resets the artist filter to "all" so the target artist card is always visible!
  const artistFilterBtns = document.querySelectorAll('[data-artist-filter]');
  const artistCards = document.querySelectorAll('.artist-dossier-card');

  const showAllArtists = () => {
    artistFilterBtns.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-artist-filter') === 'all');
    });
    artistCards.forEach((card) => {
      card.style.display = 'flex';
    });
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      if (href.startsWith('#artist-')) {
        showAllArtists();
      }
      setDrawerOpen(false);
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 420);
      }
    });
  });

  // 3. Native Mobile Bottom Dock Scroll-Spy
  const dockLinks = document.querySelectorAll('.mobile-dock-item[data-dock-section]');
  const headerLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const trackedSections = ['artists', 'gallery', 'about', 'collectables', 'reviews', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            dockLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('data-dock-section') === id
              );
            });
            headerLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: 0.02 }
    );
    trackedSections.forEach((sec) => spyObserver.observe(sec));
  }

  // 4. Artist Roster Specialty Filter
  artistFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-artist-filter');
      artistFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      artistCards.forEach((card) => {
        const tags = card.getAttribute('data-artist-tags') || '';
        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Pre-Select Artist in Vision Consultation Form
  const bookArtistBtns = document.querySelectorAll('[data-select-artist]');
  const artistSelectEl = document.getElementById('preferred-artist');
  const visionTextareaEl = document.getElementById('vision-details');

  bookArtistBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetArtist = btn.getAttribute('data-select-artist');
      const contactSection = document.getElementById('contact');
      if (artistSelectEl && targetArtist) {
        artistSelectEl.value = targetArtist;
      }
      setDrawerOpen(false);
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          if (visionTextareaEl) visionTextareaEl.focus();
        }, 550);
      }
    });
  });

  // 6. Collectables Vault Multi-Angle Photo Switcher
  document.querySelectorAll('[data-slab-img]').forEach((angleBtn) => {
    angleBtn.addEventListener('click', () => {
      const targetSrc = angleBtn.getAttribute('data-slab-img');
      const card = angleBtn.closest('.slab-card');
      if (!card || !targetSrc) return;
      const mainImg = card.querySelector('.slab-main-img');
      const mediaTrigger = card.querySelector('.slab-media');
      if (mainImg) mainImg.src = targetSrc;
      if (mediaTrigger) mediaTrigger.setAttribute('data-lightbox-src', targetSrc);

      card.querySelectorAll('[data-slab-img]').forEach((b) => b.classList.remove('active'));
      angleBtn.classList.add('active');
      refreshGalleryTriggers();
    });
  });

  // 7. Verified Google Reviews Topic Filter
  const topicChips = document.querySelectorAll('[data-review-topic]');
  const reviewCards = document.querySelectorAll('.review-card');

  topicChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-review-topic');
      topicChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      reviewCards.forEach((card) => {
        const topics = card.getAttribute('data-topics') || '';
        if (topic === 'all' || topics.includes(topic)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. Full-Screen Lightbox Gallery Controller (with Native Mobile Touch-Swipe)
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let galleryItems = [];
  let currentIndex = 0;

  function refreshGalleryTriggers() {
    const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
    galleryItems = triggers.map((el) => ({
      src: el.getAttribute('data-lightbox-src'),
      caption: el.getAttribute('data-lightbox-caption') || 'Timewarp Tattoo & Piercing'
    }));

    triggers.forEach((el, idx) => {
      el.onclick = () => {
        openLightbox(idx);
      };
    });
  }

  const openLightbox = (index) => {
    if (!lightboxModal || !galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.caption}  [${currentIndex + 1} / ${galleryItems.length}]`;
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentIndex + 1);
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    // Touch swipe left / right for native mobile gallery browsing
    let touchStartX = 0;
    lightboxModal.addEventListener(
      'touchstart',
      (e) => {
        if (e.changedTouches && e.changedTouches.length) {
          touchStartX = e.changedTouches[0].screenX;
        }
      },
      { passive: true }
    );
    lightboxModal.addEventListener(
      'touchend',
      (e) => {
        if (!e.changedTouches || !e.changedTouches.length) return;
        const deltaX = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          if (deltaX < 0) openLightbox(currentIndex + 1);
          else openLightbox(currentIndex - 1);
        }
      },
      { passive: true }
    );
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });

  // Expand Portfolio button on each artist card opens the first image of that artist
  document.querySelectorAll('[data-open-artist-gallery]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.artist-dossier-card');
      if (!card) return;
      const firstThumb = card.querySelector('[data-lightbox-src]');
      if (firstThumb) firstThumb.click();
    });
  });

  refreshGalleryTriggers();

  // 9. Vision Consultation Form Handler (timewarpkissimmee@gmail.com)
  const visionForm = document.getElementById('timewarp-vision-form');
  const formFeedback = document.getElementById('form-feedback');

  if (visionForm) {
    visionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('client-name')?.value.trim() || '';
      const email = document.getElementById('client-email')?.value.trim() || '';
      const phone = document.getElementById('client-phone')?.value.trim() || '';
      const artist =
        document.getElementById('preferred-artist')?.value ||
        'Open / Studio Recommendation';
      const vision = document.getElementById('vision-details')?.value.trim() || '';

      const subject = encodeURIComponent(
        `Tattoo / Piercing Inquiry — ${fullName} (Artist: ${artist})`
      );
      const bodyLines = [
        `Full Name: ${fullName}`,
        `Email Address: ${email}`,
        `Phone Number: ${phone}`,
        `Preferred Artist / Service: ${artist}`,
        ``,
        `Tattoo / Piercing Vision (Size, Placement, Style, Budget, Artist):`,
        vision,
        ``,
        `---`,
        `Submitted via Timewarp Tattoo & Piercing Website (3262 Vineland Rd Suite 102, Kissimmee, FL 34746)`
      ];
      const bodyEncoded = encodeURIComponent(bodyLines.join('\n'));
      const mailtoUrl = `mailto:timewarpkissimmee@gmail.com?subject=${subject}&body=${bodyEncoded}`;

      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `
          <strong>Inquiry Ready for Timewarp Tattoo!</strong><br>
          Your consultation details for <strong>${artist}</strong> have been prepared for <strong>timewarpkissimmee@gmail.com</strong>.
          <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-top:0.65rem;">
            <a href="${mailtoUrl}" class="btn btn-neon-lime" style="padding:0.45rem 0.9rem;font-size:0.78rem;">Send via Email App</a>
            <a href="tel:4074799843" class="btn btn-neon-cyan" style="padding:0.45rem 0.9rem;font-size:0.78rem;">Call Shop: (407) 479-9843</a>
          </div>
        `;
      }

      window.location.href = mailtoUrl;
    });
  }
});
