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


// =====================================
// 8. HERO TYPING ANIMATION
// =====================================

const typingText = document.getElementById("typing-text");

if (typingText) {
    const roles = [
        "IT Support & Infrastructure",
        "Junior Web Developer",
        "Informatics Student, Semester 5"
    ];

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        typingText.textContent = roles[0];
    } else {
        let roleIndex = 0;
        let characterIndex = roles[0].length;
        let isDeleting = true;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                characterIndex--;
            } else {
                characterIndex++;
            }

            typingText.textContent = currentRole.substring(
                0,
                characterIndex
            );

            let typingSpeed = isDeleting ? 45 : 85;

            if (!isDeleting && characterIndex === currentRole.length) {
                typingSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && characterIndex === 0) {
                isDeleting = false;

                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1500);
    }
}


// =====================================
// 9. HERO MOUSE PARALLAX & GLOW
// =====================================

const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");
const profileGlow = document.querySelector(".profile-glow");

const desktopPointer = window.matchMedia(
    "(min-width: 1024px) and (pointer: fine)"
);

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    hero &&
    heroVisual &&
    desktopPointer.matches &&
    !reducedMotion
) {
    hero.addEventListener("pointermove", (event) => {
        const heroRect = hero.getBoundingClientRect();
        const visualRect = heroVisual.getBoundingClientRect();

        const pointerX = event.clientX - heroRect.left;
        const pointerY = event.clientY - heroRect.top;

        const normalizedX =
            (event.clientX - visualRect.left) / visualRect.width - 0.5;

        const normalizedY =
            (event.clientY - visualRect.top) / visualRect.height - 0.5;

        hero.style.setProperty(
            "--pointer-x",
            `${pointerX}px`
        );

        hero.style.setProperty(
            "--pointer-y",
            `${pointerY}px`
        );

        // Gentle movement, not an aggressive 3D rotation
        const moveX = normalizedX * 12;
        const moveY = normalizedY * 12;

        heroVisual.style.transform =
            `translate3d(${moveX}px, ${moveY}px, 0)`;

        if (profileGlow) {
            const glowX = pointerX - visualRect.left;
            const glowY = pointerY - visualRect.top;

            profileGlow.style.left = `${glowX - 160}px`;
            profileGlow.style.top = `${glowY - 160}px`;
            profileGlow.style.opacity = "0.32";
        }
    });

    hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--pointer-x", "50%");
        hero.style.setProperty("--pointer-y", "50%");

        heroVisual.style.transform = "";

        if (profileGlow) {
            profileGlow.style.left = "";
            profileGlow.style.top = "";
            profileGlow.style.opacity = "";
        }
    });
}

// =====================================
// 10. 3D PROFILE TILT EFFECT
// =====================================

const profileFrame = document.querySelector(".profile-frame");

if (
    profileFrame &&
    desktopPointer.matches &&
    !reducedMotion
) {
    const heroVisual = profileFrame.closest(".hero-visual");

    heroVisual.addEventListener("pointermove", (event) => {
        const rect = profileFrame.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 18;
        const rotateX = (0.5 - y) * 18;

        profileFrame.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.03, 1.03, 1.03)
        `;
    });

    heroVisual.addEventListener("pointerleave", () => {
        profileFrame.style.transform = "";
    });
}

// =====================================
// 11. HOLOGRAPHIC PROFILE LIGHT
// =====================================

if (
    profileFrame &&
    desktopPointer.matches &&
    !reducedMotion
) {
    profileFrame.addEventListener("pointermove", (event) => {
        const rect = profileFrame.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        profileFrame.style.setProperty("--shine-x", `${x}%`);
        profileFrame.style.setProperty("--shine-y", `${y}%`);
    });

    profileFrame.addEventListener("pointerleave", () => {
        profileFrame.style.setProperty("--shine-x", "50%");
        profileFrame.style.setProperty("--shine-y", "50%");
    });
}


// =====================================
// 12. PORTFOLIO TABS
// =====================================

document.querySelectorAll(".portfolio-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".portfolio-tab").forEach((b) => b.classList.toggle("active", b === tab));
        document.querySelectorAll(".portfolio-panel").forEach((panel) => {
            panel.hidden = panel.id !== tab.dataset.tab;
        });
    });
});


// =====================================
// 13. STARFIELD BACKGROUND
// =====================================

(function () {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, stars = [], shooting = null;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.round((w * h) / 12000);
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.4 + 0.3,
            a: Math.random() * 0.6 + 0.3,
            s: Math.random() * 0.02 + 0.004,
            p: Math.random() * Math.PI * 2
        }));
    }

    function draw(time) {
        ctx.clearRect(0, 0, w, h);

        stars.forEach((st) => {
            const alpha = still ? st.a : st.a * (0.55 + 0.45 * Math.sin(time * st.s + st.p));
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(190, 220, 255, ${alpha})`;
            ctx.fill();
        });

        if (!still) {
            if (!shooting && Math.random() < 0.003) {
                shooting = { x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, life: 0 };
            }
            if (shooting) {
                shooting.life += 1;
                const k = shooting.life;
                const x = shooting.x + k * 9;
                const y = shooting.y + k * 4.5;
                const g = ctx.createLinearGradient(x, y, x - 90, y - 45);
                g.addColorStop(0, "rgba(150, 200, 255, 0.9)");
                g.addColorStop(1, "rgba(150, 200, 255, 0)");
                ctx.strokeStyle = g;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - 90, y - 45);
                ctx.stroke();
                if (k > 60) shooting = null;
            }
            requestAnimationFrame(draw);
        }
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
})();