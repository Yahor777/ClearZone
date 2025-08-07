// Состояние приложения
const app = {
    currentUser: null,
    currentStep: 1,
    maxSteps: 4,
    forms: {},
    validation: {}
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupFormValidation();
    setupMultiStepForm();
    loadUserState();
});

function initializeApp() {
    // Настройка минимальной даты для форм
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    // Настройка телефонных масок
    setupPhoneMasks();
    
    // Настройка переключения видимости паролей
    setupPasswordToggles();
}

function setupEventListeners() {
    // Модальные окна
    setupModalEvents();
    
    // Навигация
    setupNavigationEvents();
    
    // Формы
    setupFormEvents();
    
    // Dashboard
    setupDashboardEvents();
    
    // Мобильное меню
    setupMobileMenu();
}

// === МОДАЛЬНЫЕ ОКНА ===
function setupModalEvents() {
    const authModal = document.getElementById('authModal');
    const dashboardModal = document.getElementById('dashboardModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeButtons = document.querySelectorAll('.close');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const openDashboard = document.getElementById('openDashboard');
    const closeDashboard = document.getElementById('closeDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    // Открытие модалки авторизации
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            authModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Закрытие модалок
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Закрытие по клику вне модалки
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Переключение между входом и регистрацией
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthForm('register');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthForm('login');
        });
    }

    // Открытие панели управления
    if (openDashboard) {
        openDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            dashboardModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Выход из аккаунта
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function switchAuthForm(form) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalTitle = document.getElementById('modalTitle');

    if (form === 'register') {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        modalTitle.textContent = 'Zarejestruj się';
    } else {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        modalTitle.textContent = 'Zaloguj się';
    }
}

// === НАВИГАЦИЯ ===
function setupNavigationEvents() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Эффект изменения header при прокрутке
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// === ФОРМЫ ===
function setupFormEvents() {
    // Обработка форм авторизации
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm = document.getElementById('contactForm');
    const newOrderForm = document.getElementById('newOrderForm');
    const profileForm = document.getElementById('profileForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    if (newOrderForm) {
        newOrderForm.addEventListener('submit', handleNewOrder);
    }

    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // Валидация
    if (!validateEmail(email)) {
        showError('Nieprawidłowy adres email');
        return;
    }

    if (password.length < 6) {
        showError('Hasło musi mieć co najmniej 6 znaków');
        return;
    }

    // Симуляция входа
    try {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Симуляция API

        // Сохранение пользователя
        const userData = {
            name: 'Jan Kowalski',
            email: email,
            phone: '+48 123 456 789'
        };
        
        app.currentUser = userData;
        localStorage.setItem('clearzone_user', JSON.stringify(userData));
        
        updateUIForLoggedInUser(userData);
        closeModal(document.getElementById('authModal'));
        showSuccess('Zostałeś pomyślnie zalogowany!');
        
    } catch (error) {
        showError('Błąd logowania. Spróbuj ponownie.');
    } finally {
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Валидация
    const validation = validateRegistrationForm(data);
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }

    try {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 1500)); // Симуляция API

        // Сохранение пользователя
        const userData = {
            name: data.name,
            email: data.email,
            phone: data.phone
        };
        
        app.currentUser = userData;
        localStorage.setItem('clearzone_user', JSON.stringify(userData));
        
        updateUIForLoggedInUser(userData);
        closeModal(document.getElementById('authModal'));
        showSuccess('Konto zostało utworzone pomyślnie!');
        
    } catch (error) {
        showError('Błąd rejestracji. Spróbuj ponownie.');
    } finally {
        hideLoading();
    }
}

async function handleContactForm(e) {
    e.preventDefault();
    
    // Проверяем, что форма полностью заполнена
    if (app.currentStep < app.maxSteps) {
        nextStep();
        return;
    }

    const formData = new FormData(e.target);
    
    try {
        showLoading();
        
        // Отправка через Formspree
        const response = await fetch(e.target.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showSuccess('Twoje zapytanie zostało wysłane! Skontaktujemy się z Tobą w ciągu 24 godzin.');
            e.target.reset();
            resetMultiStepForm();
        } else {
            throw new Error('Network error');
        }
    } catch (error) {
        showError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
        hideLoading();
    }
}

async function handleNewOrder(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Симуляция создания заказа
        const order = {
            id: '#' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
            ...data,
            status: 'pending',
            date: new Date().toLocaleDateString('pl-PL'),
            price: calculateOrderPrice(data)
        };

        // Сохранение заказа
        let orders = JSON.parse(localStorage.getItem('clearzone_orders') || '[]');
        orders.unshift(order);
        localStorage.setItem('clearzone_orders', JSON.stringify(orders));

        showSuccess('Zamówienie zostało złożone pomyślnie!');
        e.target.reset();
        switchTab('orders');
        updateOrdersDisplay();
        
    } catch (error) {
        showError('Błąd podczas składania zamówienia. Spróbuj ponownie.');
    } finally {
        hideLoading();
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 800));

        // Обновление данных пользователя
        if (app.currentUser) {
            app.currentUser.name = data.name;
            app.currentUser.phone = data.phone;
            localStorage.setItem('clearzone_user', JSON.stringify(app.currentUser));
            updateUIForLoggedInUser(app.currentUser);
        }

        showSuccess('Profil został zaktualizowany pomyślnie!');
        
    } catch (error) {
        showError('Błąd podczas aktualizacji profilu. Spróbuj ponownie.');
    } finally {
        hideLoading();
    }
}

// === ВАЛИДАЦИЯ ФОРМ ===
function setupFormValidation() {
    // Валидация в реальном времени
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', () => validateField(input, validateEmail));
        input.addEventListener('input', () => clearFieldError(input));
    });

    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('blur', () => validateField(input, validatePhone));
        input.addEventListener('input', () => clearFieldError(input));
    });

    document.querySelectorAll('input[name="name"]').forEach(input => {
        input.addEventListener('blur', () => validateField(input, validateName));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Валидация паролей
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        if (input.name === 'password' || input.id === 'registerPassword') {
            input.addEventListener('input', () => updatePasswordStrength(input));
        }
        input.addEventListener('blur', () => validatePasswordField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Валидация подтверждения пароля
    const confirmPasswordInputs = document.querySelectorAll('input[name="confirmPassword"]');
    confirmPasswordInputs.forEach(input => {
        input.addEventListener('blur', () => validatePasswordConfirmation(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(input, validator) {
    const isValid = validator(input.value);
    const container = input.closest('.input-container');
    const feedback = container.querySelector('.input-feedback');
    
    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        if (feedback) {
            feedback.textContent = '✓ Prawidłowe';
            feedback.className = 'input-feedback success';
        }
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        if (feedback) {
            feedback.textContent = getErrorMessage(input.type);
            feedback.className = 'input-feedback error';
        }
    }
}

function clearFieldError(input) {
    input.classList.remove('invalid', 'valid');
    const container = input.closest('.input-container');
    const feedback = container.querySelector('.input-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'input-feedback';
    }
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^(\+48|48)?[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{3}$/;
    return regex.test(phone.replace(/\s/g, ''));
}

function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/.test(name);
}

function validatePassword(password) {
    return password.length >= 8;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
}

function updatePasswordStrength(input) {
    const password = input.value;
    const strength = calculatePasswordStrength(password);
    const container = input.closest('.form-group');
    const strengthBar = container.querySelector('.strength-fill');
    const strengthText = container.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;

    const levels = ['weak', 'fair', 'good', 'strong'];
    const texts = ['Słabe', 'Średnie', 'Dobre', 'Bardzo silne'];
    
    strengthBar.className = 'strength-fill';
    
    if (password.length === 0) {
        strengthText.textContent = 'Wprowadź hasło';
    } else if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Słabe hasło';
    } else if (strength === 3) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Średnie hasło';
    } else if (strength === 4) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Dobre hasło';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Bardzo silne hasło';
    }
}

function validatePasswordField(input) {
    const isValid = validatePassword(input.value);
    validateField(input, () => isValid);
}

function validatePasswordConfirmation(input) {
    const password = document.querySelector('input[name="password"]')?.value;
    const confirmPassword = input.value;
    const isValid = password === confirmPassword && password.length > 0;
    
    const container = input.closest('.input-container');
    const feedback = container.querySelector('.input-feedback');
    
    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        if (feedback) {
            feedback.textContent = '✓ Hasła są zgodne';
            feedback.className = 'input-feedback success';
        }
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        if (feedback) {
            feedback.textContent = 'Hasła nie są zgodne';
            feedback.className = 'input-feedback error';
        }
    }
}

function validateRegistrationForm(data) {
    if (!validateName(data.name)) {
        return { isValid: false, message: 'Nieprawidłowe imię i nazwisko' };
    }
    if (!validateEmail(data.email)) {
        return { isValid: false, message: 'Nieprawidłowy adres email' };
    }
    if (!validatePhone(data.phone)) {
        return { isValid: false, message: 'Nieprawidłowy numer telefonu' };
    }
    if (!validatePassword(data.password)) {
        return { isValid: false, message: 'Hasło musi mieć co najmniej 8 znaków' };
    }
    if (data.password !== data.confirmPassword) {
        return { isValid: false, message: 'Hasła nie są zgodne' };
    }
    return { isValid: true };
}

function getErrorMessage(type) {
    const messages = {
        'email': 'Nieprawidłowy format email',
        'tel': 'Nieprawidłowy numer telefonu',
        'text': 'To pole jest wymagane',
        'password': 'Hasło musi mieć co najmniej 8 znaków'
    };
    return messages[type] || 'Nieprawidłowa wartość';
}

// === МНОГОШАГОВАЯ ФОРМА ===
function setupMultiStepForm() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevStep);
    }

    // Калькулятор цены
    setupPriceCalculator();
}

function nextStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${app.currentStep}"]`);
    
    // Валидация текущего шага
    if (!validateCurrentStep()) {
        return;
    }

    if (app.currentStep < app.maxSteps) {
        // Скрываем текущий шаг
        currentStepEl.classList.remove('active');
        
        // Переходим к следующему шагу
        app.currentStep++;
        const nextStepEl = document.querySelector(`.form-step[data-step="${app.currentStep}"]`);
        nextStepEl.classList.add('active');
        
        updateFormProgress();
        updateFormNavigation();
    }
}

function prevStep() {
    if (app.currentStep > 1) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${app.currentStep}"]`);
        currentStepEl.classList.remove('active');
        
        app.currentStep--;
        const prevStepEl = document.querySelector(`.form-step[data-step="${app.currentStep}"]`);
        prevStepEl.classList.add('active');
        
        updateFormProgress();
        updateFormNavigation();
    }
}

function updateFormProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        const percentage = (app.currentStep / app.maxSteps) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Krok ${app.currentStep} z ${app.maxSteps}`;
    }
}

function updateFormNavigation() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitForm');
    
    if (prevBtn) {
        prevBtn.style.display = app.currentStep > 1 ? 'flex' : 'none';
    }
    
    if (nextBtn && submitBtn) {
        if (app.currentStep === app.maxSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${app.currentStep}"]`);
    const requiredInputs = currentStepEl.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('invalid');
            isValid = false;
        } else {
            input.classList.remove('invalid');
            
            // Дополнительная валидация по типу
            if (input.type === 'email' && !validateEmail(input.value)) {
                input.classList.add('invalid');
                isValid = false;
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                input.classList.add('invalid');
                isValid = false;
            }
        }
    });
    
    if (!isValid) {
        showError('Proszę wypełnić wszystkie wymagane pola poprawnie');
    }
    
    return isValid;
}

function resetMultiStepForm() {
    app.currentStep = 1;
    
    // Скрываем все шаги
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Показываем первый шаг
    const firstStep = document.querySelector('.form-step[data-step="1"]');
    if (firstStep) {
        firstStep.classList.add('active');
    }
    
    updateFormProgress();
    updateFormNavigation();
}

// === КАЛЬКУЛЯТОР ЦЕН ===
function setupPriceCalculator() {
    const serviceInputs = document.querySelectorAll('input[name="serviceType"]');
    const areaInput = document.getElementById('orderArea');
    
    serviceInputs.forEach(input => {
        input.addEventListener('change', updatePrice);
    });
    
    if (areaInput) {
        areaInput.addEventListener('input', updatePrice);
    }
}

function updatePrice() {
    const selectedService = document.querySelector('input[name="serviceType"]:checked');
    const area = document.getElementById('orderArea')?.value || 0;
    
    if (!selectedService) return;
    
    const basePrices = {
        'daily': 270,
        'weekly': 320,
        'onetime': 400
    };
    
    let basePrice = basePrices[selectedService.value] || 270;
    let surcharge = 0;
    
    // Доплата за площадь свыше 100 м²
    if (area > 100) {
        surcharge = Math.ceil((area - 100) / 10) * 20;
    }
    
    const totalPrice = basePrice + surcharge;
    
    // Обновляем отображение цены
    const basePriceEl = document.getElementById('basePrice');
    const areaSurchargeEl = document.getElementById('areaSurcharge');
    const areaSurchargePriceEl = document.getElementById('areaSurchargePrice');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (basePriceEl) basePriceEl.textContent = `${basePrice} zł`;
    if (totalPriceEl) totalPriceEl.textContent = `${totalPrice} zł`;
    
    if (areaSurchargeEl && areaSurchargePriceEl) {
        if (surcharge > 0) {
            areaSurchargeEl.style.display = 'flex';
            areaSurchargePriceEl.textContent = `${surcharge} zł`;
        } else {
            areaSurchargeEl.style.display = 'none';
        }
    }
}

function calculateOrderPrice(data) {
    const basePrices = {
        'daily': 270,
        'weekly': 320,
        'onetime': 400
    };
    
    let basePrice = basePrices[data.serviceType] || 270;
    let surcharge = 0;
    
    if (data.area && data.area > 100) {
        surcharge = Math.ceil((data.area - 100) / 10) * 20;
    }
    
    return `${basePrice + surcharge} zł`;
}

// === DASHBOARD ===
function setupDashboardEvents() {
    // Навигация по табам
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tabName) {
    // Скрываем все табы
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем выбранный таб
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Обновляем навигацию
    document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Обновляем данные для конкретных табов
    if (tabName === 'orders') {
        updateOrdersDisplay();
    }
}

function updateOrdersDisplay() {
    const ordersList = document.querySelector('.orders-list');
    if (!ordersList) return;
    
    const orders = JSON.parse(localStorage.getItem('clearzone_orders') || '[]');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>Brak zamówień</h3>
                <p>Nie masz jeszcze żadnych zamówień. Złóż pierwsze zamówienie już dziś!</p>
                <button class="btn-primary" onclick="switchTab('new-order')">
                    <i class="fas fa-plus"></i>
                    Nowe zamówienie
                </button>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <div class="order-status ${order.status}">${getStatusText(order.status)}</div>
            </div>
            <div class="order-details">
                <p><strong>${getServiceText(order.serviceType)}</strong></p>
                <p><i class="fas fa-map-marker-alt"></i> ${order.address}</p>
                <p><i class="fas fa-calendar"></i> ${order.date}, ${order.time}</p>
                <p><i class="fas fa-money-bill-wave"></i> ${order.price}</p>
            </div>
            <div class="order-actions">
                <button class="btn-secondary">Zobacz szczegóły</button>
                ${order.status === 'pending' ? '<button class="btn-danger">Anuluj</button>' : '<button class="btn-primary">Zamów ponownie</button>'}
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Zaplanowane',
        'completed': 'Zakończone',
        'cancelled': 'Anulowane'
    };
    return statuses[status] || status;
}

function getServiceText(serviceType) {
    const services = {
        'daily': 'Sprzątanie codzienne',
        'weekly': 'Sprzątanie tygodniowe',
        'onetime': 'Sprzątanie jednorazowe'
    };
    return services[serviceType] || serviceType;
}

// === УТИЛИТЫ ===
function setupPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('48')) {
                value = value.substring(2);
            }
            
            if (value.length > 0 && !value.startsWith('48')) {
                if (value.length <= 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                    if (value.length === 11) { // 3 цифры + пробел + 3 цифры + пробел + 3 цифры
                        value = '+48 ' + value;
                    }
                }
            }
            
            e.target.value = value;
        });
    });
}

function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// === УПРАВЛЕНИЕ СОСТОЯНИЕМ ПОЛЬЗОВАТЕЛЯ ===
function loadUserState() {
    const savedUser = localStorage.getItem('clearzone_user');
    if (savedUser) {
        app.currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser(app.currentUser);
    }
}

function updateUIForLoggedInUser(userData) {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const dashboardUserName = document.getElementById('dashboardUserName');
    const dashboardUserEmail = document.getElementById('dashboardUserEmail');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = userData.name;
    if (dashboardUserName) dashboardUserName.textContent = userData.name;
    if (dashboardUserEmail) dashboardUserEmail.textContent = userData.email;
    
    // Заполняем поля профиля
    const profileName = document.getElementById('profileName');
    const profilePhone = document.getElementById('profilePhone');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileName) profileName.value = userData.name;
    if (profilePhone) profilePhone.value = userData.phone;
    if (profileEmail) profileEmail.value = userData.email;
}

function logout() {
    app.currentUser = null;
    localStorage.removeItem('clearzone_user');
    localStorage.removeItem('clearzone_orders');
    
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    
    closeModal(document.getElementById('dashboardModal'));
    showSuccess('Zostałeś wylogowany pomyślnie');
}

// === УВЕДОМЛЕНИЯ ===
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.getElementById(type === 'success' ? 'successMessage' : 'errorMessage');
    const textElement = document.getElementById(type === 'success' ? 'successText' : 'errorText');
    
    if (notification && textElement) {
        textElement.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

function showLoading() {
    // Можно добавить загрузочный индикатор
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = 'default';
}

// === АНИМАЦИИ ===
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Элементы для анимации
    document.querySelectorAll('.contact-card, .stat-card, .order-card, .service-option').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Инициализация анимаций после загрузки DOM
document.addEventListener('DOMContentLoaded', setupScrollAnimations);
