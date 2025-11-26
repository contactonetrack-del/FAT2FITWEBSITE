    // =============================================
// FIT2FAT XPRESS - PREMIUM GLASSMORPHISM JAVASCRIPT
// =============================================

// Premium Glass Application State
// Premium Glass Application State
let PulseGlassApp;

try {
    PulseGlassApp = {
        theme: localStorage.getItem('pulse-glass-theme') || 'light',
        isLoaded: false,
        testimonialIndex: 0,
        exercises: JSON.parse(localStorage.getItem('pulse-glass-exercises') || '[]'),
        nutritionData: null,
        glassEffectsEnabled: true,
        floatingOrbs: [],
        sparkleElements: [],
        rippleElements: [],
        elements: {},
        testimonialAutoplay: true,
        testimonialInterval: 6000,
        glassAnimationSpeed: 1,
        interactiveGlassEnabled: true
    };
} catch (e) {
    console.warn('LocalStorage access denied, using defaults');
    PulseGlassApp = {
        theme: 'light',
        isLoaded: false,
        testimonialIndex: 0,
        exercises: [],
        nutritionData: null,
        glassEffectsEnabled: true,
        floatingOrbs: [],
        sparkleElements: [],
        rippleElements: [],
        elements: {},
        testimonialAutoplay: true,
        testimonialInterval: 6000,
        glassAnimationSpeed: 1,
        interactiveGlassEnabled: true
    };
}

// =============================================
// GLASS EFFECTS ENGINE
// =============================================

class GlassEffectsEngine {
    constructor() {
        this.floatingElements = [];
        this.rippleElements = [];
        this.sparkleElements = [];
        this.animationFrame = null;
        this.mousePosition = { x: 0, y: 0 };
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            console.log('🔮 Initializing Glass Effects Engine...');

            await Promise.all([
                this.initFloatingGlassOrbs(),
                this.initInteractiveGlassEffects(),
                this.initGlassParallax(),
                this.initGlassMorphingElements(),
                this.initGlassScrollAnimations(),
                this.initGlassHoverEffects(),
                this.initGlassClickEffects()
            ]);

            this.setupGlassEventListeners();
            this.startGlassAnimationLoop();

            this.isInitialized = true;
            console.log('✨ Glass Effects Engine Ready!');

        } catch (error) {
            console.error('❌ Glass Effects Engine failed:', error);
        }
    }

    async initFloatingGlassOrbs() {
        for (let i = 0; i < 12; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-glass-element';
            orb.style.cssText = `
                position: fixed;
                width: ${Math.random() * 80 + 40}px;
                height: ${Math.random() * 80 + 40}px;
                background: ${this.getRandomGlassGradient()};
                border-radius: 50%;
                backdrop-filter: blur(${Math.random() * 20 + 10}px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                pointer-events: none;
                z-index: -1;
                top: ${Math.random() * window.innerHeight}px;
                left: ${Math.random() * window.innerWidth}px;
                opacity: 0.6;
                animation: glassOrbFloat ${8000 + Math.random() * 12000}ms ease-in-out infinite ${Math.random() * 5000}ms;
            `;

            document.body.appendChild(orb);
            this.floatingElements.push({
                element: orb,
                baseX: parseFloat(orb.style.left),
                baseY: parseFloat(orb.style.top),
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    getRandomGlassGradient() {
        const gradients = [
            'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(139, 92, 246, 0.1))',
            'linear-gradient(135deg, rgba(240, 147, 251, 0.15), rgba(245, 87, 108, 0.1))',
            'linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.1))',
            'linear-gradient(135deg, rgba(168, 237, 234, 0.15), rgba(254, 214, 227, 0.1))',
            'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(196, 181, 253, 0.1))'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }

    async initInteractiveGlassEffects() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.updateGlassParallax(e);
        }, { passive: true });
    }

    updateGlassParallax(e) {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        this.floatingElements.forEach((orb, index) => {
            if (!orb.element.parentElement) return;

            const factor = (index % 3 + 1) * 0.03;
            const offsetX = mouseX * factor * 50;
            const offsetY = mouseY * factor * 50;

            orb.element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + Math.abs(mouseX) * 0.1})`;
        });

        const glassShapes = document.querySelectorAll('.glass-shape');
        glassShapes.forEach((shape, index) => {
            const factor = (index + 1) * 0.02;
            const offsetX = mouseX * factor * 30;
            const offsetY = mouseY * factor * 30;
            const rotation = mouseX * factor * 10;

            shape.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${1 + Math.abs(mouseY) * 0.05})`;
        });
    }

    async initGlassParallax() {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);

            const glassOrbs = document.querySelectorAll('.glass-orb, .floating-glass-element');
            glassOrbs.forEach((orb, index) => {
                if (!orb.parentElement) return;

                const speed = 0.3 + (index % 4) * 0.1;
                const yOffset = scrollY * speed * (index % 2 === 0 ? -1 : 1);
                const rotation = scrollPercent * 360 * (index % 2 === 0 ? 1 : -1);
                const scale = 1 + Math.sin(scrollPercent * Math.PI * 2 + index) * 0.1;

                orb.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`;
                orb.style.opacity = Math.max(0.1, 0.6 - scrollPercent * 0.3);
            });

            const header = document.querySelector('.glass-header');
            if (header && scrollY > 50) {
                const blurAmount = Math.min(32, 16 + scrollY * 0.05);
                const opacity = Math.min(0.95, 0.85 + scrollY * 0.001);

                header.style.backdropFilter = `blur(${blurAmount}px)`;
                header.style.background = PulseGlassApp.theme === 'dark'
                    ? `rgba(26, 32, 44, ${opacity})`
                    : `rgba(255, 255, 255, ${opacity})`;
            }
        }, { passive: true });
    }

    async initGlassMorphingElements() {
        const glassElements = document.querySelectorAll('.glass-element, .glass-card, .glass-button');

        glassElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (!PulseGlassApp.interactiveGlassEnabled) return;

                element.style.background = 'rgba(255, 255, 255, 0.35)';
                element.style.backdropFilter = 'blur(24px)';
                element.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                element.style.transform = 'translateY(-3px) scale(1.02)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.background = '';
                element.style.backdropFilter = '';
                element.style.borderColor = '';
                element.style.transform = '';
            });
        });
    }

    async initGlassScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealGlassElement(entry.target);
                    this.createSparkleEffect(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });

        const elementsToObserve = document.querySelectorAll(
            '.glass-card, .glass-feature-item, .glass-contact-card, .glass-showcase, .glass-pricing-card'
        );

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    revealGlassElement(element) {
        element.style.cssText += `
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            filter: blur(10px);
        `;

        requestAnimationFrame(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.style.filter = 'blur(0)';
        });
    }

    createSparkleEffect(element) {
        if (!element.getBoundingClientRect) return;

        const rect = element.getBoundingClientRect();
        const sparkleCount = 8;

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'glass-sparkle';
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                width: 6px;
                height: 6px;
                background: ${this.getSparkleGradient()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                backdrop-filter: blur(2px);
                animation: glassSparkle ${1000 + Math.random() * 1000}ms ease-out forwards;
                animation-delay: ${Math.random() * 500}ms;
            `;

            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 2000);
        }
    }

    getSparkleGradient() {
        const colors = [
            'radial-gradient(circle, rgba(102, 126, 234, 0.8), transparent)',
            'radial-gradient(circle, rgba(240, 147, 251, 0.8), transparent)',
            'radial-gradient(circle, rgba(79, 172, 254, 0.8), transparent)',
            'radial-gradient(circle, rgba(168, 237, 234, 0.8), transparent)',
            'radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    async initGlassHoverEffects() {
        const glassCards = document.querySelectorAll('.glass-card, .glass-pricing-card, .glass-contact-card');

        glassCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (!PulseGlassApp.interactiveGlassEnabled) return;

                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) / rect.width;
                const deltaY = (e.clientY - centerY) / rect.height;

                const rotateX = deltaY * -10;
                const rotateY = deltaX * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
                card.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.3)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    async initGlassClickEffects() {
        document.addEventListener('click', (e) => {
            const target = e.target;

            if (target.closest('.glass-element') || target.classList.contains('btn') || target.classList.contains('glass-button')) {
                this.createGlassRipple(e.clientX, e.clientY, target);
            }
        });
    }

    createGlassRipple(x, y, element) {
        const ripple = document.createElement('div');
        ripple.className = 'glass-click-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 30}px;
            top: ${y - 30}px;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.4), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: glassRipple 0.8s ease-out forwards;
        `;

        document.body.appendChild(ripple);

        if (element.classList.contains('btn-glass-primary')) {
            this.createGlassFragments(x, y);
        }

        setTimeout(() => ripple.remove(), 800);
    }

    createGlassFragments(x, y) {
        const fragmentCount = 10;

        for (let i = 0; i < fragmentCount; i++) {
            const fragment = document.createElement('div');
            fragment.className = 'glass-fragment';
            fragment.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${this.getSparkleGradient()};
                border-radius: 2px;
                pointer-events: none;
                z-index: 9999;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.4);
            `;

            const angle = (i / fragmentCount) * Math.PI * 2;
            const velocity = 80 + Math.random() * 120;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const rotation = Math.random() * 720;

            fragment.style.animation = `glassFragment-${i} 1.2s ease-out forwards`;

            const keyframes = `
                @keyframes glassFragment-${i} {
                    0% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${vx}px, ${vy + 150}px) rotate(${rotation}deg) scale(0.2);
                        opacity: 0;
                    }
                }
            `;

            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);

            document.body.appendChild(fragment);

            setTimeout(() => {
                fragment.remove();
                style.remove();
            }, 1200);
        }
    }

    setupGlassEventListeners() {
        window.addEventListener('resize', () => {
            this.repositionFloatingElements();
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseGlassAnimations();
            } else {
                this.resumeGlassAnimations();
            }
        });
    }

    repositionFloatingElements() {
        this.floatingElements.forEach(orb => {
            if (!orb.element.parentElement) return;

            const newX = Math.random() * window.innerWidth;
            const newY = Math.random() * window.innerHeight;

            orb.element.style.transition = 'all 2s ease-out';
            orb.element.style.left = newX + 'px';
            orb.element.style.top = newY + 'px';

            orb.baseX = newX;
            orb.baseY = newY;

            setTimeout(() => {
                orb.element.style.transition = '';
            }, 2000);
        });
    }

    startGlassAnimationLoop() {
        let lastTime = 0;

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            this.floatingElements.forEach(orb => {
                if (!orb.element.parentElement) return;

                orb.phase += deltaTime * 0.001;

                const offsetX = Math.sin(orb.phase) * 20 + orb.speedX * deltaTime * 0.01;
                const offsetY = Math.cos(orb.phase * 0.7) * 15 + orb.speedY * deltaTime * 0.01;

                orb.element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + Math.sin(orb.phase) * 0.1})`;
            });

            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    pauseGlassAnimations() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const animatedElements = document.querySelectorAll('.floating-glass-element, .glass-orb');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resumeGlassAnimations() {
        this.startGlassAnimationLoop();

        const animatedElements = document.querySelectorAll('.floating-glass-element, .glass-orb');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    destroy() {
        this.floatingElements.forEach(orb => {
            if (orb.element.parentElement) {
                orb.element.remove();
            }
        });

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        document.querySelectorAll('.glass-sparkle, .glass-click-ripple, .glass-fragment').forEach(el => {
            el.remove();
        });

        this.isInitialized = false;
    }
}

// Create global glass effects engine
const glassEffects = new GlassEffectsEngine();


// =============================================
// ENHANCED FORM SYSTEM WITH GLASS EFFECTS
// =============================================

class GlassFormEnhancer {
    constructor() {
        this.forms = new Map();
        this.validationRules = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        console.log('🎨 Initializing Glass Form Enhancer...');

        await Promise.all([
            this.enhanceAllForms(),
            this.setupFloatingLabels(),
            this.initSmartValidation(),
            this.setupAutoFormatting(),
            this.initGlassFormAnimations()
        ]);

        this.isInitialized = true;
        console.log('✨ Glass Form Enhancer Ready!');
    }

    async enhanceAllForms() {
        const forms = document.querySelectorAll('form, .glass-form');

        forms.forEach(form => {
            this.addGlassFormEffects(form);
            this.enhanceFormInputs(form);
            this.forms.set(form, {
                isValid: false,
                validFields: new Set(),
                invalidFields: new Set()
            });
        });
    }

    addGlassFormEffects(form) {
        form.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.createFocusGlowEffect(e.target);
                this.enhanceFormGlow(form, true);
            }
        });

        form.addEventListener('focusout', (e) => {
            setTimeout(() => {
                if (!form.contains(document.activeElement)) {
                    this.enhanceFormGlow(form, false);
                }
            }, 100);
        });
    }

    createFocusGlowEffect(input) {
        const wrapper = input.closest('.glass-input-group, .glass-form-group');
        if (!wrapper) return;

        const glow = document.createElement('div');
        glow.className = 'glass-input-focus-glow';
        glow.style.cssText = `
            position: absolute;
            inset: -2px;
            background: linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(139, 92, 246, 0.1));
            border-radius: inherit;
            pointer-events: none;
            z-index: -1;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        wrapper.style.position = 'relative';
        wrapper.appendChild(glow);

        requestAnimationFrame(() => {
            glow.style.opacity = '1';
        });

        input.addEventListener('blur', () => {
            glow.style.opacity = '0';
            setTimeout(() => glow.remove(), 300);
        }, { once: true });
    }

    enhanceFormGlow(form, isActive) {
        if (isActive) {
            form.style.boxShadow = '0 0 50px rgba(102, 126, 234, 0.3)';
            form.style.borderColor = 'rgba(102, 126, 234, 0.4)';
            form.style.background = 'rgba(255, 255, 255, 0.3)';
            form.style.backdropFilter = 'blur(32px)';
        } else {
            form.style.boxShadow = '';
            form.style.borderColor = '';
            form.style.background = '';
            form.style.backdropFilter = '';
        }
    }

    async setupFloatingLabels() {
        const inputGroups = document.querySelectorAll('.glass-input-group, .glass-form-group');

        inputGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');

            if (!input || !label) return;

            this.setupFloatingLabel(input, label, group);
        });
    }

    setupFloatingLabel(input, label, wrapper) {
        label.style.cssText = `
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            background: rgba(255, 255, 255, 0.9);
            padding: 0 0.5rem;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 1;
        `;

        const updateLabel = () => {
            const hasValue = input.value || input === document.activeElement;

            if (hasValue) {
                label.style.top = '0';
                label.style.transform = 'translateY(-50%) scale(0.85)';
                label.style.color = 'var(--primary-color)';
                label.style.background = 'rgba(102, 126, 234, 0.15)';
                label.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                label.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
            } else {
                label.style.top = '50%';
                label.style.transform = 'translateY(-50%) scale(1)';
                label.style.color = '';
                label.style.background = 'rgba(255, 255, 255, 0.9)';
                label.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                label.style.boxShadow = '';
            }
        };

        input.style.paddingTop = '1.5rem';

        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);

        updateLabel();
    }

    async initSmartValidation() {
        const inputs = document.querySelectorAll('.glass-input, input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });

            input.addEventListener('blur', () => {
                this.validateInput(input, true);
            });
        });
    }

    validateInput(input, showErrors = false) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (input.type === 'number' && value) {
            const min = parseFloat(input.getAttribute('min'));
            const max = parseFloat(input.getAttribute('max'));
            const numValue = parseFloat(value);

            if (isNaN(numValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid number';
            } else if (!isNaN(min) && numValue < min) {
                isValid = false;
                errorMessage = `Value must be at least ${min}`;
            } else if (!isNaN(max) && numValue > max) {
                isValid = false;
                errorMessage = `Value must be at most ${max}`;
            }
        }

        this.showGlassValidationFeedback(input, isValid, errorMessage, showErrors);
        this.updateFormState(input, isValid);
    }

    showGlassValidationFeedback(input, isValid, message, showErrors) {
        const wrapper = input.closest('.glass-input-group, .glass-form-group, .input-group, .form-group');
        const existingMessage = wrapper?.querySelector('.glass-validation-message');
        if (existingMessage) existingMessage.remove();

        if (isValid) {
            input.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            input.style.background = 'rgba(16, 185, 129, 0.05)';
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            input.style.background = 'rgba(239, 68, 68, 0.05)';
            input.classList.remove('valid');
            input.classList.add('invalid');

            if (showErrors && message && wrapper) {
                const msgEl = document.createElement('div');
                msgEl.className = 'glass-validation-message';
                msgEl.textContent = message;
                msgEl.style.cssText = `
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 0.5rem;
                    padding: 0.75rem;
                    background: rgba(239, 68, 68, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 8px;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    animation: glassMessageSlideIn 0.3s ease-out;
                `;

                wrapper.appendChild(msgEl);
            }
        }
    }

    updateFormState(input, isValid) {
        const form = input.closest('form');
        if (!form || !this.forms.has(form)) return;

        const formState = this.forms.get(form);
        const fieldName = input.name || input.id;

        if (isValid) {
            formState.validFields.add(fieldName);
            formState.invalidFields.delete(fieldName);
        } else {
            formState.invalidFields.add(fieldName);
            formState.validFields.delete(fieldName);
        }

        const allInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        formState.isValid = allInputs.length > 0 &&
            formState.validFields.size >= allInputs.length &&
            formState.invalidFields.size === 0;

        this.updateSubmitButton(form, formState.isValid);
    }

    updateSubmitButton(form, isValid) {
        const submitBtn = form.querySelector('button[type="submit"], .btn[type="submit"]');
        if (!submitBtn) return;

        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.style.background = 'var(--gradient-primary)';
            submitBtn.style.opacity = '1';
            submitBtn.style.transform = 'scale(1)';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.background = 'rgba(107, 114, 128, 0.5)';
            submitBtn.style.opacity = '0.6';
            submitBtn.style.transform = 'scale(0.98)';
        }
    }

    async setupAutoFormatting() {
        document.querySelectorAll('input[type="tel"], .glass-input[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }

                e.target.value = value;
            });
        });

        document.querySelectorAll('input[name*="name"], input[id*="name"]').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\b\w/g, l => l.toUpperCase());
            });
        });
    }

    async initGlassFormAnimations() {
        const formElements = document.querySelectorAll('.glass-form-group, .glass-input-group');

        formElements.forEach((element, index) => {
            element.style.cssText += `
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                transition-delay: ${index * 0.1}s;
            `;

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200);
        });
    }
}

// Create global glass form enhancer
const glassFormEnhancer = new GlassFormEnhancer();

// =============================================
// INITIALIZATION & CORE FUNCTIONS
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔮 PULSE Glassmorphism Platform Loading...');
    initGlassApp();
});

async function initGlassApp() {
    try {
        cacheElements();

        // Initialize components safely - if one fails, others continue
        await Promise.all([
            initPreloader().catch(e => console.warn('Preloader init failed:', e)),
            initGlassTheme().catch(e => console.warn('Theme init failed:', e)),
            initGlassNavigation().catch(e => console.warn('Nav init failed:', e)),
            initHero().catch(e => console.warn('Hero init failed:', e)),
            initGlassNutritionCalculator().catch(e => console.warn('Nutrition init failed:', e)),
            initGlassWorkoutTracker().catch(e => console.warn('Workout init failed:', e)),
            initGlassTestimonials().catch(e => console.warn('Testimonials init failed:', e)),
            initGlassContactForm().catch(e => console.warn('Contact form init failed:', e)),
            glassEffects.init().catch(e => console.warn('Glass effects init failed:', e)),
            glassFormEnhancer.init().catch(e => console.warn('Form enhancer init failed:', e))
        ]);

        PulseGlassApp.isLoaded = true;
        console.log('✨ PULSE Glassmorphism Platform Ready!');



    } catch (error) {
        console.error('❌ Glassmorphism initialization critical error:', error);
        // Only show user notification for critical failures that stop the app from working
        if (!PulseGlassApp.isLoaded) {
             console.warn('App loaded with some errors');
        }
    }
}

function cacheElements() {
    PulseGlassApp.elements = {
        preloader: document.getElementById('preloader'),
        header: document.getElementById('header'),
        nav: document.getElementById('nav'),
        mobileToggle: document.getElementById('mobileToggle'),
        themeToggle: document.getElementById('themeToggle'),
        contactForm: document.getElementById('contactForm'),
        nutritionCalculator: document.getElementById('nutritionCalculator'),
        workoutTracker: document.getElementById('workoutTracker'),
        testimonialsCarousel: document.getElementById('testimonialsCarousel'),
        modalContainer: document.getElementById('modalContainer'),
        notificationContainer: document.getElementById('notificationContainer')
    };
}

// =============================================
// GLASS THEME SYSTEM
// =============================================

async function initGlassTheme() {
    return new Promise((resolve) => {
        const themeToggle = PulseGlassApp.elements.themeToggle;

        document.documentElement.setAttribute('data-theme', PulseGlassApp.theme);
        updateGlassThemeIcon();
        applyGlassThemeEffects();

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleGlassTheme);
        }

        resolve();
    });
}

function toggleGlassTheme() {
    PulseGlassApp.theme = PulseGlassApp.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', PulseGlassApp.theme);
    localStorage.setItem('pulse-glass-theme', PulseGlassApp.theme);

    updateGlassThemeIcon();
    applyGlassThemeEffects();

    document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);

    const themeName = PulseGlassApp.theme === 'dark' ? 'Dark Glass' : 'Light Glass';
    showGlassNotification(`Switched to ${themeName} theme ✨`, 'success', 3000);
}

function updateGlassThemeIcon() {
    const themeToggle = PulseGlassApp.elements.themeToggle;
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = PulseGlassApp.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

function applyGlassThemeEffects() {
    const glassElements = document.querySelectorAll('.glass-element, .glass-card, .glass-header');

    glassElements.forEach(element => {
        element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

        if (PulseGlassApp.theme === 'dark') {
            element.style.background = 'rgba(45, 55, 72, 0.8)';
            element.style.borderColor = 'rgba(247, 250, 252, 0.1)';
        } else {
            element.style.background = '';
            element.style.borderColor = '';
        }
    });
}

// =============================================
// NAVIGATION WITH GLASS EFFECTS
// =============================================

async function initGlassNavigation() {
    return new Promise((resolve) => {
        const header = PulseGlassApp.elements.header;
        const nav = PulseGlassApp.elements.nav;
        const mobileToggle = PulseGlassApp.elements.mobileToggle;

        let lastScrollY = window.scrollY;

        function updateGlassHeader() {
            const scrollY = window.scrollY;

            if (header) {
                if (scrollY > 50) {
                    const blurAmount = Math.min(32, 20 + scrollY * 0.02);
                    const opacity = Math.min(0.95, 0.8 + scrollY * 0.001);

                    header.style.backdropFilter = `blur(${blurAmount}px)`;
                    header.style.background = PulseGlassApp.theme === 'dark'
                        ? `rgba(26, 32, 44, ${opacity})`
                        : `rgba(255, 255, 255, ${opacity})`;
                    header.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.15)';
                } else {
                    header.style.backdropFilter = 'blur(20px)';
                    header.style.background = PulseGlassApp.theme === 'dark'
                        ? 'rgba(26, 32, 44, 0.8)'
                        : 'rgba(255, 255, 255, 0.25)';
                    header.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.1)';
                }
            }

            // Add scrolled class for enhanced styling
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            updateActiveNavLinks();
            lastScrollY = scrollY;
        }

        window.addEventListener('scroll', updateGlassHeader, { passive: true });

        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                mobileToggle.classList.toggle('active');

                if (nav.classList.contains('active')) {
                    nav.style.backdropFilter = 'blur(32px)';
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }

        const navLinks = nav?.querySelectorAll('a[href^="#"]') || [];
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    glassEffects.createGlassRipple(e.clientX, e.clientY, link);
                }

                if (nav) {
                    nav.classList.remove('active');
                    mobileToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        resolve();
    });
}

function updateActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.glass-nav-link, .nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink && (activeLink.classList.contains('nav-link') || activeLink.classList.contains('glass-nav-link'))) {
                activeLink.classList.add('active');
            }
        }
    });
}


// =============================================
// CORE FUNCTIONALITY WITH GLASS EFFECTS
// =============================================

async function initPreloader() {
    return new Promise((resolve) => {
        const preloader = PulseGlassApp.elements.preloader;
        if (!preloader) {
            resolve();
            return;
        }

        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.backdropFilter = 'blur(0px)';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
                resolve();
            }, 500);
        }, 2500);
    });
}

async function initHero() {
    return new Promise((resolve) => {
        const counters = document.querySelectorAll('[data-target]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateGlassCounter(entry.target);
                    glassEffects.createSparkleEffect(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));

        resolve();
    });
}

function animateGlassCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        if (current < target) {
            current += increment;
            if (current > target) current = target;
            element.textContent = Math.floor(current).toLocaleString();

            const glowIntensity = (current / target) * 0.5;
            element.style.textShadow = `0 0 ${glowIntensity * 20}px rgba(102, 126, 234, ${glowIntensity})`;

            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
            element.style.textShadow = '';
        }
    };

    updateCounter();
}

// =============================================
// GLASS NUTRITION CALCULATOR
// =============================================

async function initGlassNutritionCalculator() {
    return new Promise((resolve) => {
        const calculator = PulseGlassApp.elements.nutritionCalculator;
        if (!calculator) {
            resolve();
            return;
        }

        const inputs = calculator.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => glassFormEnhancer.validateInput(e.target));
            input.addEventListener('blur', (e) => glassFormEnhancer.validateInput(e.target, true));
        });

        resolve();
    });
}

window.calculateNutrition = function () {
    const age = parseInt(document.getElementById('age')?.value) || 0;
    const weight = parseFloat(document.getElementById('weight')?.value) || 0;
    const height = parseFloat(document.getElementById('height')?.value) || 0;
    const gender = document.getElementById('gender')?.value || 'male';
    const activity = parseFloat(document.getElementById('activity')?.value) || 1.2;
    const goal = document.getElementById('goal')?.value || 'maintain';

    if (!age || !weight || !height) {
        showGlassNotification('Please fill in all required fields (Age, Weight, Height)', 'warning', 4000);

        [document.getElementById('age'), document.getElementById('weight'), document.getElementById('height')].forEach(input => {
            if (input && !input.value) {
                input.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                input.focus();
            }
        });
        return;
    }

    if (age < 16 || age > 100) {
        showGlassNotification('Age must be between 16 and 100 years', 'warning');
        return;
    }

    if (weight < 30 || weight > 200) {
        showGlassNotification('Weight must be between 30 and 200 kg', 'warning');
        return;
    }

    if (height < 100 || height > 250) {
        showGlassNotification('Height must be between 100 and 250 cm', 'warning');
        return;
    }

    const calculateBtn = event.target;
    const originalText = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<span>Calculating...</span><i class="fas fa-spinner fa-spin"></i>';
    calculateBtn.disabled = true;
    calculateBtn.style.background = 'var(--gradient-tertiary)';

    setTimeout(() => {
        try {
            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }

            let tdee = bmr * activity;

            if (goal === 'lose') {
                tdee *= 0.8;
            } else if (goal === 'gain') {
                tdee *= 1.15;
            }

            const protein = Math.round((tdee * 0.30) / 4);
            const carbs = Math.round((tdee * 0.40) / 4);
            const fats = Math.round((tdee * 0.30) / 9);

            displayGlassNutritionResults({
                calories: Math.round(tdee),
                protein,
                carbs,
                fats,
                bmr: Math.round(bmr)
            });

            PulseGlassApp.nutritionData = {
                calories: Math.round(tdee),
                protein,
                carbs,
                fats,
                bmr: Math.round(bmr),
                goal
            };

            showGlassNotification('Nutrition calculated successfully! ✨', 'success', 3000);

        } catch (error) {
            console.error('Calculation error:', error);
            showGlassNotification('Calculation failed. Please try again.', 'error');
        } finally {
            calculateBtn.innerHTML = originalText;
            calculateBtn.disabled = false;
            calculateBtn.style.background = '';
        }
    }, 1500);
};

function displayGlassNutritionResults(results) {
    const resultsContainer = document.getElementById('calculatorResults');
    if (!resultsContainer) return;

    resultsContainer.style.display = 'block';
    resultsContainer.style.opacity = '0';
    resultsContainer.style.transform = 'translateY(30px) scale(0.95)';
    resultsContainer.style.filter = 'blur(10px)';

    setTimeout(() => {
        resultsContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        resultsContainer.style.opacity = '1';
        resultsContainer.style.transform = 'translateY(0) scale(1)';
        resultsContainer.style.filter = 'blur(0)';

        const elements = {
            dailyCalories: document.getElementById('dailyCalories'),
            protein: document.getElementById('protein'),
            carbs: document.getElementById('carbs'),
            fats: document.getElementById('fats')
        };

        if (elements.dailyCalories) animateGlassValue(elements.dailyCalories, 0, results.calories, 1800);
        if (elements.protein) setTimeout(() => animateGlassValue(elements.protein, 0, results.protein, 1500, 'g'), 300);
        if (elements.carbs) setTimeout(() => animateGlassValue(elements.carbs, 0, results.carbs, 1500, 'g'), 600);
        if (elements.fats) setTimeout(() => animateGlassValue(elements.fats, 0, results.fats, 1500, 'g'), 900);

        setTimeout(() => {
            glassEffects.createSparkleEffect(resultsContainer);
        }, 1200);
    }, 100);
}

function animateGlassValue(element, start, end, duration, suffix = '') {
    const increment = (end - start) / (duration / 16);
    let current = start;

    const updateValue = () => {
        if (current < end) {
            current += increment;
            if (current > end) current = end;
            element.textContent = Math.floor(current) + suffix;

            const progress = current / end;
            element.style.textShadow = `0 0 ${progress * 15}px rgba(102, 126, 234, ${progress * 0.6})`;

            requestAnimationFrame(updateValue);
        } else {
            element.textContent = end + suffix;
            element.style.textShadow = '';
        }
    };

    updateValue();
}

// =============================================
// GLASS WORKOUT TRACKER
// =============================================

async function initGlassWorkoutTracker() {
    return new Promise((resolve) => {
        updateWorkoutDisplay();
        resolve();
    });
}

window.addExercise = function () {
    openGlassModal('exercise-form');
};

window.clearWorkout = function () {
    if (confirm('Are you sure you want to clear all exercises?')) {
        PulseGlassApp.exercises = [];
        localStorage.setItem('pulse-glass-exercises', JSON.stringify(PulseGlassApp.exercises));
        updateWorkoutDisplay();
        showGlassNotification('Workout cleared ✨', 'success');
    }
};

function removeExercise(id) {
    PulseGlassApp.exercises = PulseGlassApp.exercises.filter(ex => ex.id !== id);
    localStorage.setItem('pulse-glass-exercises', JSON.stringify(PulseGlassApp.exercises));
    updateWorkoutDisplay();
    showGlassNotification('Exercise removed', 'success');
}

function updateWorkoutDisplay() {
    const exercisesList = document.getElementById('exercisesList');
    const workoutSummary = document.getElementById('workoutSummary');

    if (!exercisesList) return;

    if (PulseGlassApp.exercises.length === 0) {
        exercisesList.innerHTML = `
            <div class="empty-state glass-empty-state">
                <div class="empty-icon">🏋️‍♂️</div>
                <p>No exercises added yet</p>
                <p class="empty-subtitle">Click "Add Exercise" to start tracking your workout</p>
            </div>
        `;
        if (workoutSummary) workoutSummary.style.display = 'none';
        return;
    }

    const exercisesHTML = PulseGlassApp.exercises.map(exercise => `
        <div class="exercise-item" style="background: var(--glass-primary); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.2);">
            <div class="exercise-info">
                <h4>${exercise.name}</h4>
                <div class="exercise-details">
                    ${exercise.sets} sets × ${exercise.reps} reps
                    ${exercise.weight ? ` @ ${exercise.weight} kg` : ''}
                </div>
            </div>
            <div class="exercise-actions">
                <button onclick="removeExercise(${exercise.id})" title="Remove exercise" 
                        style="background: var(--glass-secondary); backdrop-filter: blur(10px); border: 1px solid rgba(239, 68, 68, 0.3);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');

    exercisesList.innerHTML = exercisesHTML;

    if (workoutSummary) {
        const totalExercises = PulseGlassApp.exercises.length;
        const estimatedDuration = totalExercises * 8;
        const caloriesBurned = totalExercises * 45;

        document.getElementById('totalExercises').textContent = totalExercises;
        document.getElementById('estimatedDuration').textContent = estimatedDuration + ' min';
        document.getElementById('caloriesBurned').textContent = caloriesBurned;

        workoutSummary.style.display = 'block';
        workoutSummary.style.background = 'var(--gradient-tertiary)';
        workoutSummary.style.backdropFilter = 'blur(20px)';
    }
}

// =============================================
// GLASS TESTIMONIALS
// =============================================

async function initGlassTestimonials() {
    return new Promise((resolve) => {
        const carousel = PulseGlassApp.elements.testimonialsCarousel;
        if (!carousel) {
            resolve();
            return;
        }

        if (PulseGlassApp.testimonialAutoplay) {
            setInterval(() => {
                nextSlide();
            }, PulseGlassApp.testimonialInterval);
        }

        resolve();
    });
}

window.nextSlide = function () {
    const slides = document.querySelectorAll('.testimonial-slide, .glass-slide');
    const dots = document.querySelectorAll('.dot, .glass-dot');

    if (slides.length === 0) return;

    slides[PulseGlassApp.testimonialIndex].classList.remove('active');
    slides[PulseGlassApp.testimonialIndex].style.transform = 'translateX(-50px)';
    slides[PulseGlassApp.testimonialIndex].style.opacity = '0';
    slides[PulseGlassApp.testimonialIndex].style.filter = 'blur(5px)';

    dots[PulseGlassApp.testimonialIndex].classList.remove('active');

    PulseGlassApp.testimonialIndex = (PulseGlassApp.testimonialIndex + 1) % slides.length;

    setTimeout(() => {
        slides[PulseGlassApp.testimonialIndex].classList.add('active');
        slides[PulseGlassApp.testimonialIndex].style.transform = 'translateX(0)';
        slides[PulseGlassApp.testimonialIndex].style.opacity = '1';
        slides[PulseGlassApp.testimonialIndex].style.filter = 'blur(0)';

        dots[PulseGlassApp.testimonialIndex].classList.add('active');
    }, 100);
};

window.previousSlide = function () {
    const slides = document.querySelectorAll('.testimonial-slide, .glass-slide');
    const dots = document.querySelectorAll('.dot, .glass-dot');

    if (slides.length === 0) return;

    slides[PulseGlassApp.testimonialIndex].classList.remove('active');
    slides[PulseGlassApp.testimonialIndex].style.transform = 'translateX(50px)';
    slides[PulseGlassApp.testimonialIndex].style.opacity = '0';
    slides[PulseGlassApp.testimonialIndex].style.filter = 'blur(5px)';

    dots[PulseGlassApp.testimonialIndex].classList.remove('active');

    PulseGlassApp.testimonialIndex = PulseGlassApp.testimonialIndex === 0 ? slides.length - 1 : PulseGlassApp.testimonialIndex - 1;

    setTimeout(() => {
        slides[PulseGlassApp.testimonialIndex].classList.add('active');
        slides[PulseGlassApp.testimonialIndex].style.transform = 'translateX(0)';
        slides[PulseGlassApp.testimonialIndex].style.opacity = '1';
        slides[PulseGlassApp.testimonialIndex].style.filter = 'blur(0)';

        dots[PulseGlassApp.testimonialIndex].classList.add('active');
    }, 100);
};

window.currentSlide = function (n) {
    const slides = document.querySelectorAll('.testimonial-slide, .glass-slide');
    const dots = document.querySelectorAll('.dot, .glass-dot');

    if (slides.length === 0) return;

    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.filter = 'blur(5px)';
    });
    dots.forEach(dot => dot.classList.remove('active'));

    PulseGlassApp.testimonialIndex = n - 1;

    setTimeout(() => {
        slides[PulseGlassApp.testimonialIndex].classList.add('active');
        slides[PulseGlassApp.testimonialIndex].style.opacity = '1';
        slides[PulseGlassApp.testimonialIndex].style.filter = 'blur(0)';
        dots[PulseGlassApp.testimonialIndex].classList.add('active');
    }, 100);
};

// =============================================
// GLASS CONTACT FORM
// =============================================

async function initGlassContactForm() {
    return new Promise((resolve) => {
        const form = PulseGlassApp.elements.contactForm;
        if (!form) {
            resolve();
            return;
        }

        form.addEventListener('submit', handleGlassContactSubmit);

        resolve();
    });
}

function handleGlassContactSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]?.trim());

    if (missingFields.length > 0) {
        showGlassNotification('Please fill in all required fields ✨', 'warning', 4000);

        const firstMissing = document.getElementById(missingFields[0]);
        if (firstMissing) {
            firstMissing.focus();
            firstMissing.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            firstMissing.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showGlassNotification('Please enter a valid email address', 'warning');
        document.getElementById('email').focus();
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    submitBtn.style.background = 'var(--gradient-tertiary)';
    submitBtn.style.backdropFilter = 'blur(20px)';

    setTimeout(() => {
        try {
            console.log('Glass form submitted:', data);

            showGlassNotification('Message sent successfully! We\'ll get back to you soon. ✨', 'success', 5000);

            event.target.reset();

            const inputs = event.target.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
                input.style.background = '';
            });

            glassEffects.createSparkleEffect(event.target);

        } catch (error) {
            console.error('Glass form submission error:', error);
            showGlassNotification('Failed to send message. Please try again. ✨', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.backdropFilter = '';
        }
    }, 2000);
}


// =============================================
// GLASS MODAL SYSTEM
// =============================================

window.openModal = function (type) {
    openGlassModal(type);
};

function openGlassModal(type) {
    const modalContainer = PulseGlassApp.elements.modalContainer;
    if (!modalContainer) return;

    let modalContent = '';

    switch (type) {
        case 'trial':
            modalContent = createGlassTrialModal();
            break;
        case 'demo':
            modalContent = createGlassDemoModal();
            break;
        case 'exercise-form':
            modalContent = createGlassExerciseFormModal();
            break;
        default:
            return;
    }

    modalContainer.innerHTML = modalContent;
    const modal = modalContainer.querySelector('.modal-overlay');

    if (modal) {
        modal.style.background = 'rgba(26, 32, 44, 0.8)';
        modal.style.backdropFilter = 'blur(32px)';

        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeGlassModal();
            }
        });

        document.addEventListener('keydown', handleEscapeKey);
    }
}

function createGlassTrialModal() {
    return `
        <div class="modal-overlay">
            <div class="modal-content" style="background: var(--glass-primary); backdrop-filter: blur(24px); border: 2px solid rgba(255, 255, 255, 0.3);">
                <div class="modal-header">
                    <h3>Start Your Free Trial ✨</h3>
                    <button class="modal-close glass-button" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Get 14 days of full access to all FIT2FAT XPRESS glassmorphism features completely free!</p>
                    <form id="glassTrialForm">
                        <div class="glass-form-group">
                            <label for="trialName" class="glass-label">Full Name *</label>
                            <input type="text" id="trialName" class="glass-input" required>
                        </div>
                        <div class="glass-form-group">
                            <label for="trialEmail" class="glass-label">Email Address *</label>
                            <input type="email" id="trialEmail" class="glass-input" required>
                        </div>
                        <div class="glass-form-group">
                            <label for="trialGoal" class="glass-label">Primary Goal</label>
                            <select id="trialGoal" class="glass-select">
                                <option value="weight-loss">Weight Loss</option>
                                <option value="muscle-gain">Muscle Gain</option>
                                <option value="fitness">General Fitness</option>
                                <option value="strength">Strength Training</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-glass-primary btn-large">
                            <span>Start Free Trial</span>
                            <i class="fas fa-rocket"></i>
                        </button>
                        <p style="text-align: center; margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                            ✨ No credit card required • Cancel anytime
                        </p>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function createGlassDemoModal() {
    return `
        <div class="modal-overlay">
            <div class="modal-content" style="max-width: 800px; background: var(--glass-primary); backdrop-filter: blur(24px); border: 2px solid rgba(255, 255, 255, 0.3);">
                <div class="modal-header">
                    <h3>FIT2FAT XPRESS Glassmorphism Demo ✨</h3>
                    <button class="modal-close glass-button" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 2px solid rgba(255, 255, 255, 0.3);">
                        <iframe 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 14px;" 
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&color=white&modestbranding=1" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
                        ✨ See how FIT2FAT XPRESS glassmorphism can transform your fitness journey
                    </p>
                </div>
            </div>
        </div>
    `;
}

function createGlassExerciseFormModal() {
    return `
        <div class="modal-overlay">
            <div class="modal-content" style="background: var(--glass-primary); backdrop-filter: blur(24px); border: 2px solid rgba(255, 255, 255, 0.3);">
                <div class="modal-header">
                    <h3>Add Exercise ✨</h3>
                    <button class="modal-close glass-button" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="glassExerciseForm" onsubmit="saveGlassExercise(event)">
                        <div class="glass-form-group">
                            <label for="exerciseName" class="glass-label">Exercise Name *</label>
                            <input type="text" id="exerciseName" class="glass-input" required placeholder="e.g., Push-ups">
                        </div>
                        <div class="form-row">
                            <div class="glass-form-group">
                                <label for="exerciseSets" class="glass-label">Sets</label>
                                <input type="number" id="exerciseSets" class="glass-input" min="1" max="20" value="3">
                            </div>
                            <div class="glass-form-group">
                                <label for="exerciseReps" class="glass-label">Reps</label>
                                <input type="number" id="exerciseReps" class="glass-input" min="1" max="100" value="10">
                            </div>
                        </div>
                        <div class="glass-form-group">
                            <label for="exerciseWeight" class="glass-label">Weight (kg) - Optional</label>
                            <input type="number" id="exerciseWeight" class="glass-input" min="0" step="0.5" placeholder="0">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" class="btn btn-glass-primary">
                                <span>Add Exercise</span>
                                <i class="fas fa-plus"></i>
                            </button>
                            <button type="button" class="btn btn-glass-outline" onclick="closeGlassModal()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

window.closeModal = function () {
    closeGlassModal();
};

function closeGlassModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        modal.style.backdropFilter = 'blur(0px)';
        setTimeout(() => {
            modal.remove();
        }, 300);

        document.removeEventListener('keydown', handleEscapeKey);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeGlassModal();
    }
}

window.saveExercise = function (event) {
    saveGlassExercise(event);
};

function saveGlassExercise(event) {
    event.preventDefault();

    const name = document.getElementById('exerciseName').value.trim();
    const sets = parseInt(document.getElementById('exerciseSets').value) || 3;
    const reps = parseInt(document.getElementById('exerciseReps').value) || 10;
    const weight = parseFloat(document.getElementById('exerciseWeight').value) || 0;

    if (!name) {
        showGlassNotification('Exercise name is required ✨', 'warning');
        document.getElementById('exerciseName').focus();
        return;
    }

    const exercise = {
        id: Date.now(),
        name,
        sets,
        reps,
        weight,
        date: new Date().toISOString().split('T')[0]
    };

    PulseGlassApp.exercises.push(exercise);
    localStorage.setItem('pulse-glass-exercises', JSON.stringify(PulseGlassApp.exercises));
    updateWorkoutDisplay();

    closeGlassModal();
    showGlassNotification(`Added "${name}" to your workout! ✨`, 'success', 3000);
}

// =============================================
// GLOBAL FUNCTIONS WITH GLASS EFFECTS
// =============================================

window.selectProgram = function (programType) {
    showGlassNotification(`Selected ${programType} program! Opening details... ✨`, 'success');
    setTimeout(() => {
        openGlassModal('trial');
    }, 1500);
};

window.selectPlan = function (planType) {
    const plans = {
        starter: { name: 'Starter', price: '$29' },
        pro: { name: 'Pro', price: '$59' },
        elite: { name: 'Elite', price: '$99' }
    };

    const plan = plans[planType];
    if (plan) {
        showGlassNotification(`Selected ${plan.name} plan (${plan.price}/month)! Redirecting to checkout... ✨`, 'success', 4000);

        setTimeout(() => {
            showGlassNotification('Glassmorphism checkout system loading... ✨', 'info', 3000);
        }, 2000);
    }
};

// =============================================
// GLASS NOTIFICATION SYSTEM
// =============================================

function showGlassNotification(message, type = 'info', duration = 4000) {
    const container = PulseGlassApp.elements.notificationContainer || document.body;

    const notification = document.createElement('div');
    notification.className = `notification glass-notification ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; padding: 0.25rem; border-radius: 4px; backdrop-filter: blur(5px);">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    notification.style.cssText = `
        background: var(--glass-primary);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
        position: relative;
        overflow: hidden;
    `;

    // Add shimmer effect
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
        animation: glassShimmer 2s ease-in-out infinite;
    `;
    notification.appendChild(shimmer);

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        notification.style.backdropFilter = 'blur(24px)';
    }, 100);

    if (type === 'success') {
        setTimeout(() => {
            glassEffects.createSparkleEffect(notification);
        }, 200);
    }

    if (duration > 0) {
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(120%)';
            notification.style.backdropFilter = 'blur(0px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    return notification;
}

// =============================================
// GLASS CSS ANIMATIONS
// =============================================

const glassAnimationsStyle = document.createElement('style');
glassAnimationsStyle.textContent = `
    @keyframes glassOrbFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.6;
        }
        25% {
            transform: translateY(-20px) translateX(15px) rotate(90deg) scale(1.1);
            opacity: 0.4;
        }
        50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg) scale(0.9);
            opacity: 0.8;
        }
        75% {
            transform: translateY(15px) translateX(-20px) rotate(270deg) scale(1.05);
            opacity: 0.5;
        }
    }

    @keyframes glassSparkle {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
            filter: hue-rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
            filter: hue-rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0.3) rotate(360deg);
            filter: hue-rotate(360deg);
        }
    }

    @keyframes glassRipple {
        0% {
            transform: scale(0);
            opacity: 0.8;
        }
        100% {
            transform: scale(6);
            opacity: 0;
        }
    }

    @keyframes glassMessageSlideIn {
        0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
            backdrop-filter: blur(0px);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            backdrop-filter: blur(10px);
        }
    }

    @keyframes glassShimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    .glass-notification {
        position: relative;
        overflow: hidden;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glass-notification.show {
        transform: translateX(0);
    }

    .glass-notification.success {
        border-color: rgba(16, 185, 129, 0.3);
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
    }

    .glass-notification.error {
        border-color: rgba(239, 68, 68, 0.3);
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
    }

    .glass-notification.warning {
        border-color: rgba(245, 158, 11, 0.3);
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
    }

    .glass-notification.info {
        border-color: rgba(59, 130, 246, 0.3);
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
    }
`;

document.head.appendChild(glassAnimationsStyle);

// =============================================
// ERROR HANDLING & DEBUGGING
// =============================================

window.addEventListener('error', (e) => {
    console.error('Global glass error:', e.error);
    showGlassNotification('An error occurred. Please refresh the page if problems persist. ✨', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled glass promise rejection:', e.reason);
    showGlassNotification('Network error. Please check your connection. ✨', 'error');
});

// =============================================
// UTILITY FUNCTIONS
// =============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =============================================
// PERFORMANCE OPTIMIZATION
// =============================================

// Optimize scroll and resize events
const optimizedScrollHandler = throttle((e) => {
    // Scroll handling is already in place
}, 16);

const optimizedResizeHandler = debounce((e) => {
    if (glassEffects.isInitialized) {
        glassEffects.repositionFloatingElements();
    }
}, 250);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
window.addEventListener('resize', optimizedResizeHandler, { passive: true });

// =============================================
// EXPORT FOR DEBUGGING
// =============================================

window.PulseGlassApp = PulseGlassApp;
window.glassEffects = glassEffects;
window.glassFormEnhancer = glassFormEnhancer;

// =============================================
// FINAL INITIALIZATION
// =============================================

console.log('🔮 FIT2FAT XPRESS Glassmorphism JavaScript Loaded Successfully!');
console.log('✨ Premium Features: Glass Effects Engine, Form Enhancement, Interactive Glassmorphism');
console.log('💎 Advanced: Floating orbs, sparkle animations, glass ripples, 3D interactions');
console.log('🎯 Enhanced: All working functions with premium glassmorphism styling');
console.log('🚀 Ready to transform your fitness journey with premium glass effects! ✨💪');

// =============================================
// LAZY LOADING ENGINE
// =============================================

class GlassLazyLoader {
    constructor() {
        this.images = document.querySelectorAll('.lazy-image');
        this.observer = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        // Check for native lazy loading support
        if ('loading' in HTMLImageElement.prototype) {
            console.log('🚀 Native lazy loading supported');
            this.enableNativeLazyLoading();
        } else {
            console.log('👁️ Using Intersection Observer for lazy loading');
            this.initIntersectionObserver();
        }

        this.isInitialized = true;
    }

    enableNativeLazyLoading() {
        this.images.forEach(img => {
            if (img.dataset.loading === 'lazy') {
                img.loading = 'lazy';
            }
        });
    }

    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadImage(img) {
        img.classList.add('loaded');
    }
}

// Initialize Lazy Loader
const glassLazyLoader = new GlassLazyLoader();



// Mobile Menu Initialization
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');

    if (!mobileToggle || !nav) return;

    // Create glass backdrop for mobile menu
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop glass-backdrop';
    document.body.appendChild(backdrop);

    function toggleMenu() {
        const isOpen = nav.classList.contains('active');
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    }
}

// Clean up any orphaned elements on page unload
window.addEventListener('beforeunload', () => {
    if (glassEffects.isInitialized) {
        glassEffects.destroy();
    }
});

// =============================================
// FEATURE FUNCTIONS
// =============================================

// 1. Personalized Workouts
window.openPersonalizedWorkouts = function() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGlassModal()">
            <div class="modal-content glass" onclick="event.stopPropagation()" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>💪 Personalized Workouts</h3>
                    <button class="modal-close btn-icon" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: var(--c-text-light);">
                        Get AI-powered workout plans tailored to your fitness level, goals, and available equipment.
                    </p>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="fitness-level">Fitness Level</label>
                        <select id="fitness-level" class="form-input">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="workout-goal">Primary Goal</label>
                        <select id="workout-goal" class="form-input">
                            <option value="weight-loss">Weight Loss</option>
                            <option value="muscle-gain">Muscle Gain</option>
                            <option value="strength">Build Strength</option>
                            <option value="endurance">Improve Endurance</option>
                            <option value="flexibility">Increase Flexibility</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label for="equipment">Available Equipment</label>
                        <select id="equipment" class="form-input">
                            <option value="none">No Equipment (Bodyweight)</option>
                            <option value="basic">Basic (Dumbbells, Resistance Bands)</option>
                            <option value="full">Full Gym Access</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primary btn-block" onclick="generateWorkoutPlan()">
                        <span>Generate My Workout Plan</span>
                        <i class="fas fa-rocket"></i>
                    </button>
                    
                    <div id="workout-result" style="margin-top: 1.5rem; display: none;">
                        <div class="glass" style="padding: 1.5rem; border-radius: 12px;">
                            <h4 style="margin-bottom: 1rem; color: var(--c-primary);">✨ Your Personalized Plan</h4>
                            <p id="workout-plan-details"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showGlassModal(modalHTML);
};

window.generateWorkoutPlan = function() {
    const level = document.getElementById('fitness-level')?.value || 'beginner';
    const goal = document.getElementById('workout-goal')?.value || 'weight-loss';
    const equipment = document.getElementById('equipment')?.value || 'none';
    
    const resultDiv = document.getElementById('workout-result');
    const detailsDiv = document.getElementById('workout-plan-details');
    
    if (resultDiv && detailsDiv) {
        detailsDiv.innerHTML = `
            <strong>Level:</strong> ${level.charAt(0).toUpperCase() + level.slice(1)}<br>
            <strong>Goal:</strong> ${goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}<br>
            <strong>Equipment:</strong> ${equipment.charAt(0).toUpperCase() + equipment.slice(1)}<br><br>
            <strong>Recommended:</strong> 4 days/week, 45-60 minutes per session<br>
            <strong>Focus Areas:</strong> Full body compound movements, progressive overload
        `;
        resultDiv.style.display = 'block';
        showGlassNotification('Workout plan generated successfully! ✨', 'success');
    }
};

// 2. Nutrition Tracking
window.openNutritionTracking = function() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGlassModal()">
            <div class="modal-content glass" onclick="event.stopPropagation()" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>🍽️ Nutrition Tracking</h3>
                    <button class="modal-close btn-icon" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: var(--c-text-light);">
                        Track your daily nutrition and get personalized meal recommendations.
                    </p>
                    
                    <div class="grid grid-2" style="gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔥</div>
                            <div style="font-size: 2rem; font-weight: 700; color: var(--c-primary);">2,150</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">Daily Calories</div>
                        </div>
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">💧</div>
                            <div style="font-size: 2rem; font-weight: 700; color: var(--c-primary);">8/8</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">Glasses of Water</div>
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 12px;">
                        <h4 style="margin-bottom: 1rem;">Macros Today</h4>
                        <div style="margin-bottom: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span>Protein</span>
                                <span><strong>120g</strong> / 150g</span>
                            </div>
                            <div style="height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden;">
                                <div style="width: 80%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span>Carbs</span>
                                <span><strong>180g</strong> / 200g</span>
                            </div>
                            <div style="height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden;">
                                <div style="width: 90%; height: 100%; background: linear-gradient(90deg, #f093fb, #f5576c);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <span>Fats</span>
                                <span><strong>45g</strong> / 60g</span>
                            </div>
                            <div style="height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden;">
                                <div style="width: 75%; height: 100%; background: linear-gradient(90deg, #4facfe, #00f2fe);"></div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-block" onclick="showGlassNotification('Meal logging feature coming soon! ✨', 'info')">
                        <span>Log a Meal</span>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showGlassModal(modalHTML);
};

// 3. Progress Analytics
window.openProgressAnalytics = function() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGlassModal()">
            <div class="modal-content glass" onclick="event.stopPropagation()" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>📈 Progress Analytics</h3>
                    <button class="modal-close btn-icon" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: var(--c-text-light);">
                        Track your fitness journey with detailed insights and visualizations.
                    </p>
                    
                    <div class="grid grid-3" style="gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 800; color: var(--c-primary); margin-bottom: 0.5rem;">28</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">Days Active</div>
                        </div>
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 800; color: var(--c-primary); margin-bottom: 0.5rem;">-5.2</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">lbs Lost</div>
                        </div>
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 800; color: var(--c-primary); margin-bottom: 0.5rem;">42</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">Workouts Done</div>
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 12px;">
                        <h4 style="margin-bottom: 1rem;">Weekly Progress</h4>
                        <div style="display: flex; align-items: flex-end; gap: 0.5rem; height: 150px;">
                            ${[65, 80, 75, 90, 85, 95, 100].map((height, i) => `
                                <div style="flex: 1; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 4px; height: ${height}%; position: relative;">
                                    <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; font-weight: 600;">${height}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.75rem; color: var(--c-text-muted);">
                            <div style="flex: 1; text-align: center;">Mon</div>
                            <div style="flex: 1; text-align: center;">Tue</div>
                            <div style="flex: 1; text-align: center;">Wed</div>
                            <div style="flex: 1; text-align: center;">Thu</div>
                            <div style="flex: 1; text-align: center;">Fri</div>
                            <div style="flex: 1; text-align: center;">Sat</div>
                            <div style="flex: 1; text-align: center;">Sun</div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-block" onclick="showGlassNotification('Detailed analytics dashboard coming soon! ✨', 'info')">
                        <span>View Full Report</span>
                        <i class="fas fa-chart-bar"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showGlassModal(modalHTML);
};

// 4. Live Classes
window.openLiveClasses = function() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGlassModal()">
            <div class="modal-content glass" onclick="event.stopPropagation()" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>🎥 Live Classes</h3>
                    <button class="modal-close btn-icon" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: var(--c-text-light);">
                        Join live workout sessions with expert trainers and connect with the community.
                    </p>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; border-left: 4px solid #667eea;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                            <div>
                                <h4 style="margin-bottom: 0.25rem;">HIIT Cardio Blast</h4>
                                <div style="font-size: 0.875rem; color: var(--c-text-muted);">with Coach Sarah</div>
                            </div>
                            <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                                <i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 4px;"></i>
                                LIVE NOW
                            </span>
                        </div>
                        <div style="font-size: 0.875rem; margin-bottom: 0.75rem;">
                            <i class="fas fa-users" style="margin-right: 0.5rem;"></i>
                            <strong>127</strong> participants
                        </div>
                        <button class="btn btn-primary" onclick="showGlassNotification('Joining live class... ✨', 'success')">
                            <span>Join Now</span>
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                            <div>
                                <h4 style="margin-bottom: 0.25rem;">Yoga Flow</h4>
                                <div style="font-size: 0.875rem; color: var(--c-text-muted);">with Coach Mike</div>
                            </div>
                            <span style="font-size: 0.875rem; color: var(--c-text-muted);">Starts in 45 min</span>
                        </div>
                        <div style="font-size: 0.875rem; margin-bottom: 0.75rem;">
                            <i class="fas fa-clock" style="margin-right: 0.5rem;"></i>
                            60 minutes
                        </div>
                        <button class="btn btn-outline" onclick="showGlassNotification('Reminder set! We\\'ll notify you before the class starts. ✨', 'success')">
                            <span>Set Reminder</span>
                            <i class="fas fa-bell"></i>
                        </button>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; border-radius: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                            <div>
                                <h4 style="margin-bottom: 0.25rem;">Strength Training</h4>
                                <div style="font-size: 0.875rem; color: var(--c-text-muted);">with Coach Emma</div>
                            </div>
                            <span style="font-size: 0.875rem; color: var(--c-text-muted);">Tomorrow 9:00 AM</span>
                        </div>
                        <div style="font-size: 0.875rem; margin-bottom: 0.75rem;">
                            <i class="fas fa-dumbbell" style="margin-right: 0.5rem;"></i>
                            Intermediate Level
                        </div>
                        <button class="btn btn-outline" onclick="showGlassNotification('Added to your schedule! ✨', 'success')">
                            <span>Add to Schedule</span>
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showGlassModal(modalHTML);
};

// 5. Community Support
window.openCommunitySupport = function() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGlassModal()">
            <div class="modal-content glass" onclick="event.stopPropagation()" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>👥 Community Support</h3>
                    <button class="modal-close btn-icon" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: var(--c-text-light);">
                        Connect with thousands of members, share your progress, and stay motivated together.
                    </p>
                    
                    <div class="grid grid-2" style="gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 800; color: var(--c-primary); margin-bottom: 0.5rem;">25K+</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">Active Members</div>
                        </div>
                        <div class="glass" style="padding: 1.5rem; text-align: center; border-radius: 12px;">
                            <div style="font-size: 2.5rem; font-weight: 800; color: var(--c-primary); margin-bottom: 0.5rem;">500+</div>
                            <div style="font-size: 0.875rem; color: var(--c-text-muted);">Daily Posts</div>
                        </div>
                    </div>
                    
                    <h4 style="margin-bottom: 1rem;">Recent Success Stories</h4>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px;">
                        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">JD</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">John Doe</div>
                                <div style="font-size: 0.875rem; color: var(--c-text-muted);">Lost 30 lbs in 3 months! 🎉</div>
                            </div>
                        </div>
                        <p style="font-size: 0.9375rem; margin-bottom: 0.75rem;">
                            "The community support here is incredible! Everyone is so encouraging and helpful. Best decision I ever made!"
                        </p>
                        <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--c-text-muted);">
                            <span><i class="fas fa-heart"></i> 234</span>
                            <span><i class="fas fa-comment"></i> 45</span>
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 12px;">
                        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">SM</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">Sarah Miller</div>
                                <div style="font-size: 0.875rem; color: var(--c-text-muted);">Completed my first marathon! 🏃‍♀️</div>
                            </div>
                        </div>
                        <p style="font-size: 0.9375rem; margin-bottom: 0.75rem;">
                            "From couch to 26.2 miles! Thank you to everyone who supported me on this journey. You can do it too!"
                        </p>
                        <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--c-text-muted);">
                            <span><i class="fas fa-heart"></i> 567</span>
                            <span><i class="fas fa-comment"></i> 89</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-block" onclick="showGlassNotification('Community features coming soon! ✨', 'info')">
                        <span>Join the Community</span>
                        <i class="fas fa-users"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showGlassModal(modalHTML);
};

// 6. Wearable Integration
window.openWearableIntegration = function() {
    const modalHTML = `
        <div class="modal-overlay" onclick="closeGlassModal()">
            <div class="modal-content glass" onclick="event.stopPropagation()" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>📱 Wearable Integration</h3>
                    <button class="modal-close btn-icon" onclick="closeGlassModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 1.5rem; color: var(--c-text-light);">
                        Sync with your favorite fitness trackers and smartwatches for seamless data tracking.
                    </p>
                    
                    <h4 style="margin-bottom: 1rem;">Supported Devices</h4>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; cursor: pointer;" onclick="connectDevice('Apple Watch')">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">⌚</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Apple Watch</div>
                                    <div style="font-size: 0.875rem; color: var(--c-text-muted);">Track workouts, heart rate, calories</div>
                                </div>
                            </div>
                            <button class="btn btn-outline" onclick="event.stopPropagation(); connectDevice('Apple Watch')">
                                <span>Connect</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; cursor: pointer;" onclick="connectDevice('Fitbit')">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #4facfe, #00f2fe); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📊</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Fitbit</div>
                                    <div style="font-size: 0.875rem; color: var(--c-text-muted);">Steps, sleep, activity tracking</div>
                                </div>
                            </div>
                            <button class="btn btn-outline" onclick="event.stopPropagation(); connectDevice('Fitbit')">
                                <span>Connect</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; cursor: pointer;" onclick="connectDevice('Garmin')">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🏃</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Garmin</div>
                                    <div style="font-size: 0.875rem; color: var(--c-text-muted);">Advanced running & cycling metrics</div>
                                </div>
                            </div>
                            <button class="btn btn-outline" onclick="event.stopPropagation(); connectDevice('Garmin')">
                                <span>Connect</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 1.5rem; border-radius: 12px; cursor: pointer;" onclick="connectDevice('Samsung Health')">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #a8edea, #fed6e3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">💚</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Samsung Health</div>
                                    <div style="font-size: 0.875rem; color: var(--c-text-muted);">Comprehensive health tracking</div>
                                </div>
                            </div>
                            <button class="btn btn-outline" onclick="event.stopPropagation(); connectDevice('Samsung Health')">
                                <span>Connect</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showGlassModal(modalHTML);
};

window.connectDevice = function(deviceName) {
    showGlassNotification(`Connecting to ${deviceName}... ✨`, 'info', 2000);
    setTimeout(() => {
        showGlassNotification(`${deviceName} connected successfully! 🎉`, 'success', 3000);
    }, 2000);
};