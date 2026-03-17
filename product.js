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

  /* ── Top-bar Marquee Fallback ───────────────── */
  const marquee = document.querySelector("marquee.top-bar");
  if (marquee) {
    marquee.setAttribute("scrollamount", "4");
    marquee.setAttribute("behavior", "scroll");
    marquee.setAttribute("direction", "left");
  }
});