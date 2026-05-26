document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        // Toggle menu logic would go here, for now just a simple toggle class if I had the CSS for it
        // Since I hid nav-links with display:none in media query, I'd need a class to show it.
        // Let's add that logic briefly via inline styles or class toggle if I updated CSS.
        // I will just log for now or add a simple alert as I didn't add the mobile menu overlay CSS.
        // Actually, let's fix the CSS in a later step if needed, or just let it be a placeholder.
        // Wait, "Professional" means it should work. I'll add a 'mobile-open' class to header.
        document.querySelector('header').classList.toggle('mobile-open');
    });

    // Close mobile menu when a link is clicked
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('header').classList.remove('mobile-open');
        });
    });

    // Role Tabs (Retailer/Vendor)
    const tabs = document.querySelectorAll('.role-tab');
    const contents = document.querySelectorAll('.role-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            tab.classList.add('active');

            // Show content
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .stat-item, .hero-text-wrapper, .hero-visual').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // CSS classes are now defined in style.css

    // Hero Canvas Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 80; // Number of nodes
        const connectionDistance = 150; // Max distance to connect
        const moveSpeed = 0.5; // Base speed

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * moveSpeed;
                this.vy = (Math.random() - 0.5) * moveSpeed;
                this.size = Math.random() * 2 + 1; // 1-3px
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Keep within bounds strongly (in case of resize)
                if (this.x < 0) this.x = 0;
                if (this.x > width) this.x = width;
                if (this.y < 0) this.y = 0;
                if (this.y > height) this.y = height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Primary color with opacity
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            // Optional: re-init particles to spread them out again or just let them be
        });

        init();
        animate();
    }

    // Video Splash Screen Logic
    const videoSplash = document.getElementById('video-splash');
    const desktopVideo = document.getElementById('intro-video-desktop');
    const mobileVideo = document.getElementById('intro-video-mobile');
    const skipBtn = document.getElementById('skip-video-btn');

    // Determine which video is active based on screen size
    const introVideo = window.innerWidth <= 768 ? mobileVideo : desktopVideo;

    if (videoSplash && introVideo) {
        const hideSplash = () => {
            videoSplash.classList.add('hidden');
            setTimeout(() => {
                document.body.classList.remove('no-scroll');
                // Optional: pause videos to save resources
                if (desktopVideo) desktopVideo.pause();
                if (mobileVideo) mobileVideo.pause();
            }, 800); // Matches CSS transition duration
        };

        // Try to play the video (browsers usually require muted for auto-play, which is set in HTML)
        const playPromise = introVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Auto-play was prevented, hide splash or show play button. We'll just hide it to not block user.
                console.log("Auto-play prevented", error);
                hideSplash();
            });
        }

        // Hide when active video ends
        introVideo.addEventListener('ended', hideSplash);

        // Hide when skip is clicked
        if (skipBtn) {
            skipBtn.addEventListener('click', hideSplash);
        }
    }
});
