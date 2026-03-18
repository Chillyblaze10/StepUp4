document.addEventListener("DOMContentLoaded", () => {
  /* ── Hamburger Menu ─────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    // Close when a nav link is clicked (mobile)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ── Filter Buttons ─────────────────────────── */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      // Animate cards in/out
      cards.forEach((card, i) => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;

        if (show) {
          card.classList.remove("hidden");
          // Stagger re-entrance animation
          card.style.animationDelay = `${i * 0.05}s`;
          card.classList.remove("fade-in");
          void card.offsetWidth; // Trigger reflow
          card.classList.add("fade-in");
        } else {
          card.classList.add("hidden");
          card.classList.remove("fade-in");
        }
      });
    });
  });

  /* ── Modal Overlay Creation ─────────────────── */
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.setAttribute("role", "dialog");
  modalOverlay.setAttribute("aria-modal", "true");
  modalOverlay.innerHTML = `
    <div class="modal">
      <img class="modal-img" src="" alt="" />
      <div class="modal-body">
        <button class="modal-close" aria-label="Close">&#x2715;</button>
        <span class="modal-tag"></span>
        <h2></h2>
        <p></p>
        <span class="modal-price"></span>
        <button class="cta-btn">Add to Cart</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const modalImg = modalOverlay.querySelector(".modal-img");
  const modalTag = modalOverlay.querySelector(".modal-tag");
  const modalTitle = modalOverlay.querySelector("h2");
  const modalDesc = modalOverlay.querySelector(".modal-body p");
  const modalPrice = modalOverlay.querySelector(".modal-price");
  const modalClose = modalOverlay.querySelector(".modal-close");

  function openModal(card) {
    const img = card.querySelector(".card-img-wrap img");
    const tag = card.querySelector(".card-tag");
    const title = card.querySelector(".card-info h3");
    const desc = card.querySelector(".card-info p");
    const price = card.querySelector(".price");

    modalImg.src = img ? img.src : "";
    modalImg.alt = img ? img.alt : "";
    modalTag.textContent = tag ? tag.textContent : "";
    modalTitle.textContent = title ? title.textContent : "";
    modalDesc.textContent = desc ? desc.textContent : "";
    modalPrice.textContent = price ? price.textContent : "Price on request";

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Quick View buttons
  document.querySelectorAll(".quick-view").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(btn.closest(".card"));
    });
  });

  // Close button events
  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ── Intersection Observer ──────────────────── */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        card.style.opacity = "0";
        io.observe(card);
      }
    });
  }

  /* ── Dynamic Hero Backgrounds ───────────────── */
  const heroSection = document.querySelector('.hero');
  
  if (heroSection) {
    // Array of high-quality fashion CDN endpoints
    const heroImages = [
      "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop')", // Editorial clothes rack
      "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop')", // High fashion street style
      "url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop')", // Runway context
      "url('https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop')"  // Atelier/Fabric details
    ];

    // Generate a random integer between 0 and the length of the array
    const randomIdx = Math.floor(Math.random() * heroImages.length);

    // Inject the selected URL into the CSSOM custom property
    heroSection.style.setProperty('--dynamic-hero', heroImages[randomIdx]);
  }
});