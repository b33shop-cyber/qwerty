// -------------------- Анимация появления элементов при прокрутке (Intersection Observer) --------------------
const animatedElements = document.querySelectorAll('.feature-card, .about-text, .about-image');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
};

const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            appearObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

animatedElements.forEach(el => {
    if (el.classList.contains('feature-card')) {
        appearObserver.observe(el);
    } else {
        // для текста и картинки в about плавный фид без спец-класса visible по умолчанию, добавим прозрачность
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.5s ease';
        appearObserver.observe(el);
        // дополнительно назначаем класс появления
        const origObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    origObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        origObserver.observe(el);
    }
});

// Ставим visible для карточек если они на старте
document.querySelectorAll('.feature-card').forEach(card => {
    if (card.getBoundingClientRect().top < window.innerHeight) {
        card.classList.add('visible');
    }
});

// -------------------- Анимация счетчиков (статистика в секции about) --------------------
const statNumbers = document.querySelectorAll('.stat-number');
let animated = false;

function animateCounters() {
    if (animated) return;
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
        animated = true;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const increment = target / 60;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
    }
}

window.addEventListener('scroll', () => {
    animateCounters();
    // добавление эффекта для хедера при скролле
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(10, 12, 16, 0.95)';
        header.style.backdropFilter = 'blur(16px)';
    } else {
        header.style.background = 'rgba(10, 12, 16, 0.85)';
    }
});
animateCounters(); // вызов при загрузке, если видно

// -------------------- Мобильное меню (бургер) --------------------
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // анимация иконки гамбургера (опционально)
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Закрываем меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// -------------------- Плавный скролл к якорям --------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// -------------------- Обработка формы + тост уведомление --------------------
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const toast = document.getElementById('toastNotification');

function showToast(message, isError = false) {
    toast.textContent = message || (isError ? '❌ Ошибка' : '✨ Сообщение успешно отправлено!');
    if (isError) {
        toast.style.borderLeftColor = '#ff6b6b';
        toast.style.color = '#ffb3b3';
    } else {
        toast.style.borderLeftColor = '#64FFDA';
        toast.style.color = '#64FFDA';
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        // сброс цвета через 300ms, но оставим стиль
        setTimeout(() => {
            toast.style.borderLeftColor = '#64FFDA';
            toast.style.color = '#64FFDA';
        }, 300);
    }, 3000);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        let isValid = true;
        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.style.borderColor = '#ff6b6b';
        } else nameInput.style.borderColor = '';
        
        const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            isValid = false;
            emailInput.style.borderColor = '#ff6b6b';
        } else emailInput.style.borderColor = '';
        
        if (!messageInput.value.trim()) {
            isValid = false;
            messageInput.style.borderColor = '#ff6b6b';
        } else messageInput.style.borderColor = '';
        
        if (isValid) {
            // Имитация отправки на сервер
            formFeedback.innerHTML = '<span style="color: #64FFDA;">✓ Отправка... </span>';
            setTimeout(() => {
                formFeedback.innerHTML = '<span style="color: #64FFDA;">✓ Спасибо! Мы свяжемся с вами в ближайшее время.</span>';
                contactForm.reset();
                showToast('Спасибо! Заявка получена ✅', false);
                setTimeout(() => {
                    formFeedback.innerHTML = '';
                }, 4000);
            }, 600);
        } else {
            formFeedback.innerHTML = '<span style="color: #ff6b6b;">✗ Заполните все поля корректно (имя, email, сообщение).</span>';
            showToast('Пожалуйста, проверьте форму', true);
            setTimeout(() => {
                if (formFeedback.innerHTML.includes('корректно')) formFeedback.innerHTML = '';
            }, 3500);
        }
    });
}

// Кнопки "Начать путь" и "Узнать больше" — интерактивное поведение
const ctaBtn = document.getElementById('mainCtaBtn');
const demoBtn = document.getElementById('demoBtn');

if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            // небольшой эффект подсветки формы
            const formWrap = document.querySelector('.contact-wrapper');
            if (formWrap) {
                formWrap.style.transition = 'box-shadow 0.2s';
                formWrap.style.boxShadow = '0 0 0 2px var(--accent-primary)';
                setTimeout(() => { formWrap.style.boxShadow = ''; }, 800);
            }
        }
    });
}

if (demoBtn) {
    demoBtn.addEventListener('click', () => {
        showToast('Смотрите раздел "О нас" с нашими достижениями!', false);
        const aboutSection = document.getElementById('about');
        if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Дополнительно анимация для наведения на карточки + эффект свечения
const cards = document.querySelectorAll('.feature-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.01)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Инициализация: если счетчики уже видны при загрузке
window.addEventListener('load', () => {
    animateCounters();
    // Проверка видимости анимаций карт
    document.querySelectorAll('.feature-card').forEach(card => {
        if (card.getBoundingClientRect().top < window.innerHeight - 50) {
            card.classList.add('visible');
        }
    });
});