// ========== Intersection Observer for Scroll Animations ==========
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.mask-up, .mask-right, .fade-in, .fade-in-group, .scale-in, .line-grow').forEach(el => {
    revealObserver.observe(el);
});

// Separate observer for contact section with lower threshold
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const contactAnimated = entry.target.querySelectorAll('.fade-in, .mask-up, .fade-in-group');
            contactAnimated.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 100);
            });
        }
    });
}, { threshold: 0.05 });

const contactSection = document.querySelector('.contact-section');
if (contactSection) {
    contactObserver.observe(contactSection);
}

// ========== Section Observer for Navigation ==========
const sections = document.querySelectorAll('.snap-section');
const navDots = document.querySelectorAll('.nav-dot');
const sectionCounter = document.getElementById('sectionCounter');
const scrollProgress = document.getElementById('scrollProgress');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionIndex = Array.from(sections).indexOf(entry.target);
            
            // Update nav dots
            navDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === sectionIndex);
            });
            
            // Update section counter
            const sectionName = entry.target.dataset.name;
            if (sectionCounter && sectionName) {
                sectionCounter.textContent = sectionName;
            }
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ========== Navigation Click ==========
navDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionIndex = parseInt(dot.dataset.section);
        sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
    });
});

// ========== Scroll Progress Bar ==========
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// ========== Smooth Anchor Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== Parallax Effect on Scroll ==========
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            document.querySelectorAll('.parallax-img img').forEach(img => {
                const rect = img.getBoundingClientRect();
                const speed = 0.3;
                const offset = (rect.top * speed);
                img.style.setProperty('--parallax-offset', `${offset}px`);
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// ========== Keyboard Navigation ==========
let currentSection = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
            currentSection++;
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSection > 0) {
            currentSection--;
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Update currentSection on scroll
const updateCurrentSection = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            currentSection = Array.from(sections).indexOf(entry.target);
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => {
    updateCurrentSection.observe(section);
});

// ========== Initial Reveal for Hero ==========
window.addEventListener('load', () => {
    // Trigger animations for elements visible on load
    setTimeout(() => {
        document.querySelectorAll('.hero-section .mask-up, .hero-section .fade-in, .hero-section .scale-in').forEach(el => {
            el.classList.add('revealed');
        });
    }, 200);
});

// ========== Timeline Glow Animation ==========
const timeline = document.querySelector('.timeline');
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineMarkers = document.querySelectorAll('.timeline-marker');

if (timeline && timelineItems.length > 0) {
    const experienceSection = document.querySelector('.experience-section');
    
    const updateTimelineGlow = () => {
        if (!experienceSection) return;
        
        const sectionRect = experienceSection.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Pozycja środka widoku względem timeline (0-100%)
        const viewCenter = viewportHeight * 0.4; // Punkt skupienia - 40% od góry ekranu
        const relativePosition = (viewCenter - timelineRect.top) / timelineRect.height * 100;
        
        // Ogranicz do 0-100%
        const clampedPosition = Math.max(0, Math.min(100, relativePosition));
        
        // Ustaw CSS variables dla gradientu
        const glowSize = 15; // Rozmiar świecenia w %
        timeline.style.setProperty('--glow-start', `${Math.max(0, clampedPosition - glowSize * 2)}%`);
        timeline.style.setProperty('--glow-center', `${Math.max(0, clampedPosition - glowSize)}%`);
        timeline.style.setProperty('--glow-peak', `${clampedPosition}%`);
        timeline.style.setProperty('--glow-end', `${Math.min(100, clampedPosition + glowSize)}%`);
        timeline.style.setProperty('--glow-fade', `${Math.min(100, clampedPosition + glowSize * 2)}%`);
        
        // Płynna synchronizacja rombów z linią
        timelineItems.forEach((item, index) => {
            const marker = timelineMarkers[index];
            if (!marker) return;
            
            const itemRect = item.getBoundingClientRect();
            const markerTop = itemRect.top + 10; // Pozycja romba
            const distanceFromViewCenter = markerTop - viewCenter;
            
            // Oblicz intensywność na podstawie odległości (max zasięg 200px)
            const maxDistance = viewportHeight * 0.3;
            const normalizedDistance = Math.abs(distanceFromViewCenter) / maxDistance;
            const intensity = Math.max(0, 1 - normalizedDistance);
            
            // Zastosuj płynną opacity i kolor
            const minOpacity = 0.25;
            const opacity = minOpacity + (1 - minOpacity) * intensity;
            marker.style.opacity = opacity;
            
            // Kolor: przejście od border-subtle do accent
            if (intensity > 0.5) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
            
            // Dodatkowy glow proporcjonalny do intensywności
            const glowIntensity = intensity * 15;
            marker.style.boxShadow = intensity > 0.3 
                ? `0 0 ${glowIntensity}px rgba(200, 168, 107, ${intensity * 0.6})`
                : 'none';
        });
    };

    // Listen for scroll events
    window.addEventListener('scroll', updateTimelineGlow, { passive: true });
    
    // Initialize
    updateTimelineGlow();
}