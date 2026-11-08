/**
 * ==============================================================================
 * ICC CRICKET WORLD CUP 2023 - CASE STUDY JAVASCRIPT
 * Handles scrollspy, sticky subnav highlighting, and SQL query code copy.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initSubnavScrollspy();
  initCodeCopyButtons();
});

/**
 * 1. Subnav Scrollspy: Highlights active section in the sticky nav
 */
function initSubnavScrollspy() {
  const navLinks = document.querySelectorAll(".cs-subnav-link");
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -65% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
            // Auto scroll active link into view in subnav
            link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * 2. SQL Query Code Copy Buttons
 */
function initCodeCopyButtons() {
  const copyBtns = document.querySelectorAll(".cs-copy-code-btn");

  copyBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      const codeBlock = btn.parentElement.querySelector("code, pre");
      if (!codeBlock) return;

      const codeText = codeBlock.textContent.trim();
      try {
        await navigator.clipboard.writeText(codeText);
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.background = "#22c55e";
        btn.style.color = "#000000";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    });
  });
}

