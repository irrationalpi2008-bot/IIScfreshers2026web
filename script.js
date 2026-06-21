/* script.js - Floating Petal System, Scroll Actions & Accordions */

document.addEventListener("DOMContentLoaded", () => {
    // 0. Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const isDarkMode = localStorage.getItem("iisc-darkMode") === "true";
    
    // Apply saved dark mode preference on page load
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    
    // Dark mode toggle event listener
    darkModeToggle.addEventListener("click", () => {
        const isCurrentlyDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("iisc-darkMode", isCurrentlyDark);
        
        // Change icon based on mode
        if (isCurrentlyDark) {
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });

    // 1. Navbar Scroll Effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. FAQ Accordion Logic
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const trigger = item.querySelector(".faq-trigger");
        const content = item.querySelector(".faq-content");

        trigger.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all other open accordion panels
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains("active")) {
                    otherItem.classList.remove("active");
                    otherItem.querySelector(".faq-content").style.maxHeight = "0px";
                }
            });

            // Toggle current panel
            if (isActive) {
                item.classList.remove("active");
                content.style.maxHeight = "0px";
            } else {
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 3. Intersection Observer for Scroll Animations
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.12 // Trigger slightly earlier for better scrolling feel
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                // Stop observing once animated in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Smooth Scrolling for Navigation Links
    const scrollLinks = document.querySelectorAll(".scroll-link");
    scrollLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Canvas Petal Floating Particle System
    const canvas = document.getElementById("petal-canvas");
    const ctx = canvas.getContext("2d");

    let animationId;
    let petals = [];
    const maxPetals = 45; // Sweet spot for performance and aesthetics

    // Floral Colors
    const petalColors = [
        "rgba(226, 180, 166, 0.7)",  /* Peach */
        "rgba(247, 230, 225, 0.75)", /* Light Rose/Peach */
        "rgba(197, 160, 89, 0.55)",  /* Gold */
        "rgba(220, 192, 135, 0.6)",  /* Light Gold */
        "rgba(82, 115, 99, 0.45)"    /* Light Sage Leaf */
    ];

    // Petal Class Definition
    class Petal {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Start at random height initially
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 12 + 8; // Size between 8px and 20px
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.horizontalSpeed = Math.random() * 1.5 + 0.5; // Drift right/left
            this.verticalSpeed = Math.random() * 1.2 + 0.8;   // Fall speed
            this.oscillationSpeed = Math.random() * 0.02 + 0.005;
            this.oscillationAmplitude = Math.random() * 30 + 10;
            this.oscillationOffset = Math.random() * 100;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.opacity = Math.random() * 0.4 + 0.5; // Soft opacity
        }

        update() {
            this.y += this.verticalSpeed;
            // Oscillating movement to simulate natural fluttering drift
            this.x += Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * 0.5 + (this.horizontalSpeed * 0.4);
            this.rotation += this.rotationSpeed;

            // Reset when it goes off screen (bottom or sides)
            if (this.y > canvas.height + 20 || this.x > canvas.width + 20 || this.x < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            
            // Draw a beautiful organic petal/leaf shape using Bezier curves
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-this.size / 2, this.size / 2, 0, this.size);
            ctx.quadraticCurveTo(this.size / 2, this.size / 2, 0, 0);
            
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Midrib line inside the petal/leaf for extra premium detail
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.size);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
        }
    }

    // Initialize Canvas Size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Particle loop
    function initPetals() {
        petals = [];
        for (let i = 0; i < maxPetals; i++) {
            petals.push(new Petal());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }

    // Event listeners for resizing
    window.addEventListener("resize", () => {
        resizeCanvas();
    });

    // Start everything
    resizeCanvas();
    initPetals();
    animate();
});
