/**
 * ==============================================================================
 * NILESH PARDHI - PORTFOLIO INTERACTIVITY SCRIPT (main.js)
 * High-performance, clean vanilla JavaScript for interactions, 
 * modal project deep dives, 3D tilt, and configuration binding.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initConfigurationBindings();
  initNavbarScrollAndSpy();
  initMobileMenu();
  initTypingCycle();
  initPhotoTilt();
  initSkillsFilter();
  initProjectModals();
  initContactForm();
  initBackToTop();
  initScrollReveal();
  initCustomCursor();
});

/* ==============================================================================
   1. BIND DATA FROM CONFIG.JS
   ============================================================================== */
function initConfigurationBindings() {
  const config = window.PORTFOLIO_CONFIG;
  if (!config) return;

  // Profile image
  const profileImg = document.getElementById("hero-profile-img");
  if (profileImg && config.personal.photoPath) {
    profileImg.src = config.personal.photoPath;
  }

  // Resume Download Button
  const resumeBtn = document.getElementById("btn-download-resume");
  if (resumeBtn && config.personal.resumePath) {
    resumeBtn.setAttribute("href", config.personal.resumePath);
    resumeBtn.setAttribute("download", config.personal.resumeFileName || "Nilesh_Pardhi_Resume.pdf");
    resumeBtn.addEventListener("click", () => {
      showToast("Resume download initiated. Update assets/resume.pdf with your latest version anytime!");
    });
  }

  // Social Links
  const linkedinLinks = document.querySelectorAll(".link-linkedin");
  linkedinLinks.forEach(el => {
    el.href = config.socialLinks.linkedin || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  const githubLinks = document.querySelectorAll(".link-github");
  githubLinks.forEach(el => {
    el.href = config.socialLinks.github || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  const emailLinks = document.querySelectorAll(".link-email");
  emailLinks.forEach(el => {
    el.href = `mailto:${config.socialLinks.email}`;
  });

  // Project GitHub buttons
  const cricketGhBtn = document.getElementById("btn-gh-cricket");
  if (cricketGhBtn) {
    cricketGhBtn.href = config.projects.cricket.githubUrl || "#";
    cricketGhBtn.target = "_blank";
    cricketGhBtn.rel = "noopener noreferrer";
  }

  const jobMarketGhBtn = document.getElementById("btn-gh-jobmarket");
  if (jobMarketGhBtn) {
    jobMarketGhBtn.href = config.projects.jobMarket.githubUrl || "#";
    jobMarketGhBtn.target = "_blank";
    jobMarketGhBtn.rel = "noopener noreferrer";
  }

  const superstoreGhBtn = document.getElementById("btn-gh-superstore");
  if (superstoreGhBtn) {
    superstoreGhBtn.href = config.projects.superstore.githubUrl || "#";
    superstoreGhBtn.target = "_blank";
    superstoreGhBtn.rel = "noopener noreferrer";
  }
}

/* ==============================================================================
   2. NAVBAR SCROLL EFFECT & SCROLLSPY
   ============================================================================== */
function initNavbarScrollAndSpy() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Add background blur and shadow when scrolled
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });

  // IntersectionObserver for active section highlight
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === `#${id}` || (id === "about" && href === "#home")) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==============================================================================
   3. MOBILE HAMBURGER MENU
   ============================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-cta");

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = toggleBtn.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen);
  }

  toggleBtn.addEventListener("click", toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      toggleBtn.classList.remove("open");
      mobileMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", false);
    });
  });
}

/* ==============================================================================
   4. DYNAMIC TEXT CYCLING
   ============================================================================== */
function initTypingCycle() {
  const textElement = document.getElementById("cycling-text-element");
  if (!textElement) return;

  const phrases = [
    "Competitive Data Analyst",
    "Data Storyteller",
    "Business Intelligence Explorer",
    "Problem Solver with Python & SQL"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 38;
  const holdDelay = 2200;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, holdDelay);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 350);
    } else {
      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }
  }

  type();
}

/* ==============================================================================
   5. PROFILE PHOTO 3D MOUSE TILT EFFECT
   ============================================================================== */
function initPhotoTilt() {
  const tiltCard = document.querySelector(".photo-card-tilt");
  const container = document.querySelector(".hero-photo-wrapper");

  if (!tiltCard || !container) return;

  // Only apply tilt on desktop with hover capability
  if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 8; // Max 8 deg
    const rotY = (x / (rect.width / 2)) * 8;

    tiltCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  container.addEventListener("mouseleave", () => {
    tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/* ==============================================================================
   6. SKILLS CATEGORY FILTER
   ============================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll(".skills-tab-btn");
  const cards = document.querySelectorAll(".skill-category-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-category");

      cards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          setTimeout(() => { card.style.opacity = "1"; card.style.transform = "translateY(0)"; }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(() => { card.style.display = "none"; }, 200);
        }
      });
    });
  });
}

/* ==============================================================================
   7. PROJECT DEEP DIVE MODAL
   ============================================================================== */
const PROJECT_MODAL_DATA = {
  cricket: {
    title: "ICC Men's Cricket World Cup 2023 Analysis",
    subtitle: "End-to-End Tournament Analytics & Ball-by-Ball Insights",
    tech: ["Python", "Pandas", "Matplotlib", "MySQL", "SQL", "Power BI"],
    problem: "Analyzing tournament trends, phase-wise scoring behaviors (Powerplay vs. Death overs), team consistency, and player contributions across all 48 matches of the 2023 Men's Cricket World Cup.",
    approach: [
      "Extracted & cleaned ball-by-ball delivery datasets and match summaries with Pandas.",
      "Handled null values, standardized team naming conventions, and calculated derived metrics (Run Rate, Dot Ball %, Bowling Economy, Win Margins).",
      "Wrote complex MySQL queries leveraging CTEs, aggregations, and Window Functions (ROW_NUMBER, RANK) to discover tournament records.",
      "Designed communicative visualizations showing how scoring run-rates escalated drastically in overs 45–50."
    ],
    sqlSnippet: `-- Phase-wise Tournament Scoring Rate using SQL CTE & CASE
WITH MatchPhases AS (
  SELECT 
    match_id,
    batting_team,
    CASE 
      WHEN over_num BETWEEN 1 AND 10 THEN 'Powerplay (1-10)'
      WHEN over_num BETWEEN 11 AND 40 THEN 'Middle Overs (11-40)'
      ELSE 'Death Overs (41-50)'
    END AS match_phase,
    total_runs,
    is_wicket
  FROM world_cup_deliveries
)
SELECT 
  match_phase,
  ROUND(SUM(total_runs) * 6.0 / COUNT(*), 2) AS run_rate_per_over,
  COUNT(CASE WHEN is_wicket = 1 THEN 1 END) AS wickets_lost
FROM MatchPhases
GROUP BY match_phase
ORDER BY run_rate_per_over DESC;`,
    insights: [
      "Average 1st innings total across all venues stood at 288.4 runs — an increase of +18.2 runs compared to the 2019 edition.",
      "Death overs (overs 41-50) experienced an average run rate of 9.82 RPO for winning teams compared to 6.45 RPO for losing teams.",
      "Pace bowlers accounted for 66% of total tournament dismissals, with spin bowlers dominating specifically during overs 15 to 35 in subcontinental venues."
    ]
  },
  jobmarket: {
    title: "AI Job Market Intelligence Platform",
    subtitle: "Tech & Data Role Demand Analysis Across 1,500+ Postings",
    tech: ["Python", "Pandas", "MySQL", "SQL", "Matplotlib", "Exploratory Data Analysis"],
    problem: "Understanding what skills, tools, and experience levels companies actually require for Data Analyst and related AI roles in the current hiring landscape.",
    approach: [
      "Collected and pre-processed 1,500+ verified job posting records.",
      "Conducted text tokenization and regex extraction using Pandas to identify explicit skill mentions (SQL, Python, Power BI, Excel, Tableau, AWS).",
      "Aggregated demand metrics using SQL to correlate job roles with skill stacks.",
      "Filtered outliers and verified salary reporting distributions where valid compensation data existed."
    ],
    sqlSnippet: `-- Most In-Demand Skill Pairings for Data Analyst Roles
SELECT 
  s1.skill_name AS primary_skill,
  s2.skill_name AS paired_skill,
  COUNT(*) AS pairing_frequency
FROM job_skills s1
JOIN job_skills s2 ON s1.job_id = s2.job_id AND s1.skill_name < s2.skill_name
WHERE s1.role_category = 'Data Analyst'
GROUP BY s1.skill_name, s2.skill_name
ORDER BY pairing_frequency DESC
LIMIT 5;`,
    insights: [
      "Python and SQL are the most frequently requested tandem skills, appearing together in over 70% of analytical postings.",
      "Data Analyst roles constituted 38% of all analyzed entry-to-mid career postings.",
      "Business Intelligence tools (Power BI & Tableau) were requested in 56% of roles specifically emphasizing KPI reporting and executive communication."
    ]
  },
  superstore: {
    title: "Superstore Sales Analysis Dashboard",
    subtitle: "Retail Sales, Margin & Regional Performance (9,994 Records)",
    tech: ["Python", "Pandas", "SQL", "Power BI", "Excel", "Data Visualization"],
    problem: "Analyzing retail store operational data to diagnose profitability leaks across regions, categories, and customer segments.",
    approach: [
      "Performed data cleansing, validation, and schema structuring on the 9,994 record Superstore dataset.",
      "Validated key metrics in Python before building executive KPI cards in Power BI.",
      "Developed DAX calculations for Year-over-Year sales growth, profit margins, and order fulfillment cycles.",
      "Constructed interactive slicing by Region, State, Segment, and Product Category."
    ],
    sqlSnippet: `-- Profit Drag Analysis: Sub-Categories with Negative Operating Margin
SELECT 
  category,
  sub_category,
  ROUND(SUM(sales), 2) AS total_sales,
  ROUND(SUM(profit), 2) AS total_profit,
  ROUND((SUM(profit) / SUM(sales)) * 100, 2) AS profit_margin_pct
FROM superstore_orders
GROUP BY category, sub_category
HAVING total_profit < 0
ORDER BY total_profit ASC;`,
    insights: [
      "Verified Executive KPIs: Total Sales of $2.30M, Net Profit of $286.40K across 793 Customers and ~5K orders (12.45% profit margin).",
      "Technology proved the most profitable sector ($836K sales with $145K profit), whereas Furniture struggled due to severe discount discounting on Tables.",
      "The 'Tables' sub-category alone caused a -$17.7K profitability drag due to average discount thresholds exceeding 20%."
    ]
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const viewBtns = document.querySelectorAll(".btn-view-project");

  if (!modalBackdrop) return;

  function openModal(projectId) {
    const data = PROJECT_MODAL_DATA[projectId];
    if (!data) return;

    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-subtitle").textContent = data.subtitle;
    document.getElementById("modal-problem").textContent = data.problem;

    // Tech tags
    const techWrapper = document.getElementById("modal-tech-tags");
    techWrapper.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");

    // Approach list
    const approachList = document.getElementById("modal-approach-list");
    approachList.innerHTML = data.approach.map(item => `<li>${item}</li>`).join("");

    // SQL Code snippet
    const codeSnippet = document.getElementById("modal-code-snippet");
    codeSnippet.textContent = data.sqlSnippet;

    // Key Insights list
    const insightsList = document.getElementById("modal-insights-list");
    insightsList.innerHTML = data.insights.map(item => `<li>${item}</li>`).join("");

    modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-project-id");
      openModal(pid);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("open")) {
      closeModal();
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function initContactForm() {
  const form = document.getElementById("portfolio-contact-form");
  const statusNotice = document.getElementById("form-status-notice");
  const submitBtn = document.getElementById("contact-submit-btn") || form?.querySelector("button[type='submit']");
  if (!form || !submitBtn) return;

  const originalBtnContent = submitBtn.innerHTML;

  const fields = {
    name: {
      input: document.getElementById("form-name") || form.elements["name"],
      error: document.getElementById("err-name"),
      validate: (val) => val.trim().length >= 2
    },
    email: {
      input: document.getElementById("form-email") || form.elements["email"],
      error: document.getElementById("err-email"),
      validate: (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim())
    },
    subject: {
      input: document.getElementById("form-subject") || form.elements["subject"],
      error: document.getElementById("err-subject"),
      validate: (val) => val.trim().length >= 2
    },
    message: {
      input: document.getElementById("form-message") || form.elements["message"],
      error: document.getElementById("err-message"),
      validate: (val) => val.trim().length >= 10
    }
  };

  // Clear validation error on typing or focus
  Object.values(fields).forEach(({ input, error }) => {
    if (!input) return;
    const clearError = () => {
      input.classList.remove("input-error");
      if (error) error.classList.remove("error");
    };
    input.addEventListener("input", clearError);
    input.addEventListener("change", clearError);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide any previous submission status
    if (statusNotice) {
      statusNotice.className = "form-status-notice";
      statusNotice.innerHTML = "";
    }

    const name = fields.name.input ? fields.name.input.value.trim() : "";
    const email = fields.email.input ? fields.email.input.value.trim() : "";
    const subject = fields.subject.input ? fields.subject.input.value.trim() : "";
    const message = fields.message.input ? fields.message.input.value.trim() : "";
    const gotcha = document.getElementById("form-gotcha")?.value || "";

    // 1. Client-Side Field Validation
    let isValid = true;
    let firstInvalid = null;

    Object.entries(fields).forEach(([key, { input, error, validate }]) => {
      const val = input ? input.value : "";
      if (!validate(val)) {
        isValid = false;
        if (input) input.classList.add("input-error");
        if (error) error.classList.add("error");
        if (!firstInvalid && input) firstInvalid = input;
      } else {
        if (input) input.classList.remove("input-error");
        if (error) error.classList.remove("error");
      }
    });

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // 2. Prevent duplicate submissions and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("btn-loading");
    submitBtn.innerHTML = `
      <span class="btn-spinner"></span>
      <span>Sending Message...</span>
    `;

    const config = window.PORTFOLIO_CONFIG?.contactForm || {};
    const recipient = config.recipientEmail || "pardhinilesh0591@gmail.com";
    const endpoint = config.endpoint || "/api/contact";

    const submissionTimestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium"
    });

    const mailtoFallbackUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Nilesh,\n\nFrom: ${name} (${email})\nDate: ${submissionTimestamp}\n\nMessage:\n${message}`)}`;

    try {
      // 3. Send request to server-side Resend API endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _gotcha: gotcha
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        // Success state: message delivered via Resend
        if (statusNotice) {
          statusNotice.className = "form-status-notice success";
          statusNotice.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0; margin-top:2px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <strong>Message sent successfully!</strong><br>
                Thank you, <em>${escapeHtml(name)}</em>. Your inquiry has been delivered directly to <strong>${recipient}</strong> via Resend. I will respond to your email promptly.
              </div>
            </div>
          `;
        }

        form.reset();
        showToast("Thank you! Your message was sent successfully.");
      } else {
        // Handle server-side or configuration errors
        if (data.missingConfig) {
          if (statusNotice) {
            statusNotice.className = "form-status-notice info";
            statusNotice.innerHTML = `
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="font-weight:600; display:flex; align-items:center; gap:8px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  Resend API Key Pending Setup
                </div>
                <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
                  The Resend integration is ready. To send emails automatically, define <code>RESEND_API_KEY</code>, <code>CONTACT_EMAIL</code>, and <code>RESEND_FROM_EMAIL</code> in your server's <code>.env</code> file or deployment dashboard.
                </div>
                <div>
                  <a href="${mailtoFallbackUrl}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px; padding:8px 16px; font-size:0.84rem; margin-top:4px;">
                    <span>Send directly via Email Client</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </a>
                </div>
              </div>
            `;
          }
          showToast("RESEND_API_KEY pending on server. Direct mailto link ready.");
        } else {
          const errorMessage = data.error || `Server responded with status ${response.status}`;
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      console.error("Resend API Submission Error:", err);

      // Preserving entered message when error occurs
      if (statusNotice) {
        statusNotice.className = "form-status-notice error";
        statusNotice.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="font-weight:600; display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              Delivery issue encountered
            </div>
            <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">
              ${escapeHtml(err.message || "Could not deliver the message at this time.")}
              Your typed message is preserved below. You can try submitting again or send directly:
            </div>
            <div>
              <a href="${mailtoFallbackUrl}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; font-size:0.82rem; margin-top:4px;">
                <span>Send via Mail Client</span>
              </a>
            </div>
          </div>
        `;
      }
      showToast("Delivery failed. Your message was preserved.");
    } finally {
      // Re-enable submit button and restore text
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-loading");
      submitBtn.innerHTML = originalBtnContent;
    }
  });
}

/* ==============================================================================
   9. BACK TO TOP BUTTON
   ============================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById("btn-back-to-top");
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==============================================================================
   10. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ============================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-fade-up");
  if (!revealElements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==============================================================================
   11. TOAST NOTIFICATION UTILITY
   ============================================================================== */
function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger show
  setTimeout(() => toast.classList.add("show"), 20);

  // Hide & remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}
