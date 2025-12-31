/**
 * DECRYPTC Website Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initScrollReveal();
    initThemeToggle();
    initMobileMenu();
    initHackerText();
    initThreeBackground();
    initLucideIcons();
    initTiltMockup();
});

/**
 * Three.js 3D Cyber Particle Background
 */
function initThreeBackground() {
    const canvas = document.getElementById('cyberCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 5;

    // Particles Configuration
    const particlesCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Brand Yellow/Amber Color
    const material = new THREE.PointsMaterial({
        color: 0xe0c110,
        size: 0.02,
        transparent: true,
        opacity: 0.6
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle drift animation
    function animate() {
        requestAnimationFrame(animate);
        points.rotation.y += 0.0005;
        points.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }

    animate();

    // Responsive Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * Hacker Text Scramble Animation
 */
function initHackerText() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const hackerElements = document.querySelectorAll('.hacker-text');

    hackerElements.forEach(element => {
        let interval = null;

        const animate = () => {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                element.innerText = element.innerText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return element.dataset.value[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= element.dataset.value.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        // Trigger on hover
        element.addEventListener('mouseover', animate);

        // Trigger on reveal (if it has reveal-on-scroll)
        if (element.classList.contains('reveal-on-scroll')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate();
                        // One-time reveal trigger
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(element);
        }
    });
}

/**
 * Sticky Header Logic
 */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Scroll Reveal Animation using Intersection Observer
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Basic Theme Toggle Logic
 */
function initThemeToggle() {
    const themeBtn = document.querySelector('.theme-toggle');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        // Default or explicitly dark
        document.body.classList.add('dark-theme');
    }
}

/**
 * Mobile Menu Logic
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            menuBtn.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
                nav.classList.remove('active');
                menuBtn.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

/**
 * Tilt Mockup Interaction
 */
function initTiltMockup() {
    const tiltContainers = document.querySelectorAll('.tilt-container');

    tiltContainers.forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Move shimmer
            const shimmer = container.querySelector('.mockup-shimmer');
            if (shimmer) {
                const moveX = (x / rect.width) * 100;
                const moveY = (y / rect.height) * 100;
                shimmer.style.background = `radial-gradient(circle at ${moveX}% ${moveY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
            }
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = `rotateX(0deg) rotateY(0deg)`;
            const shimmer = container.querySelector('.mockup-shimmer');
            if (shimmer) {
                shimmer.style.background = `linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)`;
            }
        });
    });
}

/**
 * Initialize Lucide Icons
 */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
