
// =====================================
// 1. MOBILE NAVIGATION
// =====================================

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("active");

    const icon = menuToggle.querySelector("i");

    if (icon) {
        icon.classList.remove("bi-x-lg");
        icon.classList.add("bi-list");
    }

    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");
        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("bi-list", !isOpen);
            icon.classList.toggle("bi-x-lg", isOpen);
        }

        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeMobileMenu();
        }
    });
}


// =====================================
// 2. PROJECT CATEGORY FILTER
// =====================================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        projectCards.forEach((card) => {
            const categories = (card.dataset.category || "").split(" ");

            const isVisible =
                selectedFilter === "all" ||
                categories.includes(selectedFilter);

            const isCurrentlyHidden = card.classList.contains("hidden");

            if (isVisible && isCurrentlyHidden) {
                card.classList.remove("hidden");

                card.animate(
                    [
                        {
                            opacity: 0,
                            transform: "translateY(20px)"
                        },
                        {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    ],
                    {
                        duration: 350,
                        easing: "ease-out"
                    }
                );
            }

            if (!isVisible && !isCurrentlyHidden) {
                const animation = card.animate(
                    [
                        {
                            opacity: 1,
                            transform: "translateY(0)"
                        },
                        {
                            opacity: 0,
                            transform: "translateY(15px)"
                        }
                    ],
                    {
                        duration: 200,
                        easing: "ease-in"
                    }
                );

                animation.onfinish = () => {
                    card.classList.add("hidden");
                };
            }
        });
    });
});


// =====================================
// 3. DARK / LIGHT THEME TOGGLE
// =====================================

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.className = isLight
                ? "bi bi-moon"
                : "bi bi-sun";
        }

        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
    }
}

// Load saved theme
let savedTheme = "dark";

try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
    console.warn("Theme storage is unavailable.");
}

applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isCurrentlyLight =
            document.body.classList.contains("light-theme");

        const newTheme = isCurrentlyLight ? "dark" : "light";

        applyTheme(newTheme);

        try {
            localStorage.setItem("portfolio-theme", newTheme);
        } catch (error) {
            console.warn("Unable to save theme preference.");
        }
    });
}


// =====================================
// 4. SCROLL REVEAL ANIMATION
// =====================================

const revealElements = document.querySelectorAll(
    ".section-heading, .about-content, .skill-card, .project-card, .timeline-item, .contact-content"
);

revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    if (
        element.classList.contains("skill-card") ||
        element.classList.contains("project-card")
    ) {
        element.style.transitionDelay = `${(index % 3) * 100}ms`;
    }
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}


// =====================================
// 5. ACTIVE NAVIGATION ON SCROLL
// =====================================

const pageSections = document.querySelectorAll(
    "#home, #about, #skills, #projects, #experience, #contact"
);

const navigationLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;

                    navigationLinks.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("active", isActive);
                    });
                }
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


// =====================================
// 6. BACK TO TOP
// =====================================

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
    backToTop.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle(
            "visible",
            window.scrollY > 400
        );
    });
}


// =====================================
// 7. CONTACT FORM
// =====================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        alert(
            "Thank you for your message! Contact form integration is not configured yet."
        );

        contactForm.reset();
    });
}
