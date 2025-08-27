document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation
    const typed = new Typed(".typed-text", {
        strings: ["AI & ML Engineer", "Deep Learning Enthusiast", "Researcher", "Data Explorer", "Final-Year Engineering Student"],
        typeSpeed: 70,
        backSpeed: 40,
        loop: true,
        showCursor: true,
        cursorChar: '|',
    });

    // Dark Mode Switch
    const themeSwitch = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeSwitch.checked = true;
        }
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }

    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Glitter Effect - Mouse position tracking
    document.querySelectorAll('.skill-category, .project-card, .achievement-card, .contact-info, .contact-form, .research-item, .timeline-item, .hobby-item, .language-item').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Homepage Mouse-Sensitive Particle Animation ---
    const canvas = document.getElementById('ai-canvas');
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouse = { x: 0, y: 0 };
    const particles = [];
    const particleCount = 50; // Number of particles
    const maxDistance = 100; // Max distance for particles to connect

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize

    // Update mouse position
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1; // Random size between 1 and 4
            this.speedX = Math.random() * 2 - 1; // Random speed between -1 and 1
            this.speedY = Math.random() * 2 - 1;
            this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Attract to mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance * 2) { // Stronger attraction closer to mouse
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (maxDistance * 2 - distance) / (maxDistance * 2); // Inverse relationship
                this.x -= forceDirectionX * force * 0.5; // Adjust attraction strength
                this.y -= forceDirectionY * force * 0.5;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles.length = 0; // Clear existing particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    // Handle particles and connections
    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect particles to each other
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').substring(1,3), 16)}, ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').substring(3,5), 16)}, ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').substring(5,7), 16)}, ${1 - (distance / maxDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Connect particles to mouse
            const dxMouse = particles[i].x - mouse.x;
            const dyMouse = particles[i].y - mouse.y;
            const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distanceMouse < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').substring(1,3), 16)}, ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').substring(3,5), 16)}, ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').substring(5,7), 16)}, ${1 - (distanceMouse / maxDistance)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        animationFrameId = requestAnimationFrame(animateCanvas);
    }

    // Start animation when canvas is ready
    initParticles();
    animateCanvas();
});
