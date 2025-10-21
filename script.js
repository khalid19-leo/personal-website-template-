document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // 1. تهيئة المتغيرات والعناصر الأساسية
    // =============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressCircles = document.querySelectorAll('.progress-circle');
    const counterElements = document.querySelectorAll('.card-projects h3');
    
    // =============================================
    // 2. وظيفة تبديل القائمة المتنقلة (Mobile Menu)
    // =============================================
    function initMobileMenu() {
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                // تبديل حالة القائمة
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                
                // تحريك الأشرطة لصنع شكل X
                const bars = menuToggle.querySelectorAll('.bar');
                if (navMenu.classList.contains('active')) {
                    bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            });
            
            // إغلاق القائمة عند النقر على رابط
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    
                    // إعادة الأشرطة إلى حالتها الأصلية
                    const bars = menuToggle.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                });
            });
        }
    }
    
    // =============================================
// 3. أنيميشن دوائر المهارات (Progress Circles) - النسخة المحسنة
// =============================================
function initProgressCircles() {
    if (progressCircles.length === 0) return;
    
    const circleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const progress = parseInt(circle.getAttribute('data-progress'));
                const valueElement = circle.querySelector('.progress-value');
                
                // تشغيل الأنيميشن للدائرة والنص معاً
                animateCircleAndText(circle, valueElement, 0, progress, 2000);
                
                observer.unobserve(circle);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    progressCircles.forEach(circle => {
        circleObserver.observe(circle);
    });
}

// =============================================
// وظيفة جديدة: أنيميشن متزامن للدائرة والنص
// =============================================
function animateCircleAndText(circle, valueElement, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // حساب القيمة الحالية
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // 1. تحديث النص المئوي
        if (valueElement) {
            valueElement.textContent = currentValue + '%';
        }
        
        // 2. تحديث ملء الدائرة في نفس الوقت
        circle.style.setProperty('--progress', currentValue);
        
        // إضافة تدرج لوني ديناميكي للدائرة
        updateCircleGradient(circle, currentValue);
        
        // الاستمرار في الأنيميشن إذا لم ننتهِ
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // عند الانتهاء، تأكد من القيمة النهائية
            circle.style.setProperty('--progress', end);
            if (valueElement) {
                valueElement.textContent = end + '%';
            }
        }
    };
    
    window.requestAnimationFrame(step);
}

// =============================================
// تحديث التدرج اللوني للدائرة بشكل ديناميكي
// =============================================
function updateCircleGradient(circle, progress) {
    // تغيير اللون تدريجياً من الأحمر إلى الأزرق إلى الأخضر
    let color;
    if (progress < 50) {
        // من الأحمر إلى البرتقالي
        const intensity = progress / 50;
        color = `rgb(${255}, ${Math.floor(165 * intensity)}, 0)`;
    } else if (progress < 80) {
        // من البرتقالي إلى الأزرق
        const intensity = (progress - 50) / 30;
        color = `rgb(${Math.floor(255 * (1 - intensity))}, ${Math.floor(165 * (1 - intensity))}, ${Math.floor(255 * intensity)})`;
    } else {
        // من الأزرق إلى الأخضر
        const intensity = (progress - 80) / 20;
        color = `rgb(0, ${Math.floor(200 + 55 * intensity)}, ${Math.floor(255 * (1 - intensity))})`;
    }
    
    circle.style.background = `conic-gradient(${color} ${progress}%, #E8F0F8 ${progress}%)`;
}

// =============================================
// 5. وظيفة العد التصاعدي (للمهارات والإحصائيات) - النسخة المعدلة
// =============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // حساب القيمة الحالية
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // تحديث النص
        if (element.classList.contains('progress-value')) {
            element.textContent = currentValue + '%';
        } else {
            element.textContent = '+' + currentValue;
        }
        
        // الاستمرار في الأنيميشن إذا لم ننتهِ
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
    // =============================================
    // 4. أنيميشن عد الأرقام (Counter Animation)
    // =============================================
    function initCounterAnimation() {
        if (counterElements.length === 0) return;
        
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.textContent.replace('+', ''));
                    
                    // إضافة كلاس الأنيميشن
                    element.classList.add('count-animation');
                    
                    // تشغيل العد
                    animateValue(element, 0, target, 2500);
                    
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counterElements.forEach(element => {
            counterObserver.observe(element);
        });
    }
    
    // =============================================
    // 5. وظيفة العد التصاعدي (للمهارات والإحصائيات)
    // =============================================
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // حساب القيمة الحالية
            const currentValue = Math.floor(progress * (end - start) + start);
            
            // تحديث النص
            if (element.classList.contains('progress-value')) {
                element.textContent = currentValue + '%';
            } else {
                element.textContent = '+' + currentValue;
            }
            
            // الاستمرار في الأنيميشن إذا لم ننتهِ
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // =============================================
    // 6. أنيميشن العناصر عند التمرير (Scroll Animations)
    // =============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card-services, .cards-images img, .contact-form, .content-contact');
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            // إيقاف الأنيميشن مؤقتاً حتى يظهر العنصر
            element.style.animationPlayState = 'paused';
            scrollObserver.observe(element);
        });
    }
    
    // =============================================
    // 7. التنقل السلس (Smooth Scrolling)
    // =============================================
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // تعويض الهيدر الثابت
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // =============================================
    // 8. تأثيرات Hover التفاعلية
    // =============================================
    function initHoverEffects() {
        // تأثيرات لبطاقات الخدمات
        const serviceCards = document.querySelectorAll('.card-services');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-10px) scale(1)';
            });
        });
        
        // تأثيرات للصور
        const workImages = document.querySelectorAll('.cards-images img');
        workImages.forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.08)';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-10px) scale(1.05)';
            });
        });
    }
    
    // =============================================
    // 9. تفعيل النموذج (Form Handling)
    // =============================================
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // محاكاة إرسال النموذج
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                // تأثير التحميل
                submitButton.textContent = 'جاري الإرسال...';
                submitButton.disabled = true;
                
                // محاكاة الإرسال (يمكن استبدالها بـ AJAX)
                setTimeout(() => {
                    submitButton.textContent = 'تم الإرسال بنجاح! ✓';
                    submitButton.style.backgroundColor = '#4CAF50';
                    
                    // إعادة التعيين بعد 3 ثوانٍ
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                        contactForm.reset();
                    }, 3000);
                }, 2000);
            });
        }
    }
    
    // =============================================
    // 10. تأثير التمرير للهيدر (Scroll Header Effect)
    // =============================================
    function initScrollHeader() {
        const header = document.querySelector('.header-container');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(242, 247, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--header-bg)';
                header.style.backdropFilter = 'none';
            }
            
            // إخفاء/إظهار الهيدر حسب اتجاه التمرير
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = window.scrollY;
        });
    }
    
    // =============================================
    // 11. تهيئة جميع الوظائف
    // =============================================
    function initAll() {
        initMobileMenu();
        initProgressCircles();
        initCounterAnimation();
        initScrollAnimations();
        initSmoothScroll();
        initHoverEffects();
        initContactForm();
        initScrollHeader();
        
        console.log('✅ جميع الأنيميشنات والوظائف مفعلة بنجاح!');
    }
    
    // =============================================
    // 12. بدء التشغيل
    // =============================================
    initAll();
    
});

// =============================================
// 13. تحميل الصور بكفاءة (Lazy Loading)
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// =============================================
// 14. منع السياق الاختياري للصور (اختياري)
// =============================================
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// =============================================
// 15. تحسين الأداء للأنيميشنات
// =============================================
// استخدام requestAnimationFrame للأنيميشنات المستمرة
function animateOnScroll() {
    // يمكن إضافة أنيميشنات مستمرة هنا إذا لزم الأمر
}

// تشغيل الأنيميشنات المستمرة
if (window.requestAnimationFrame) {
    window.requestAnimationFrame(animateOnScroll);
}