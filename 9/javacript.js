// Міста за країнами
const citiesByCountry = {
    ukraine: ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'],
    poland: ['Варшава', 'Краків', 'Вроцлав', 'Познань', 'Гданськ'],
    germany: ['Берлін', 'Мюнхен', 'Гамбург', 'Кельн', 'Франкфурт'],
    usa: ['Нью-Йорк', 'Лос-Анджелес', 'Чикаго', 'Хьюстон', 'Сан-Франциско']
};

// Перемикання вкладок
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Видаляємо активний клас з усіх вкладок та форм
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
        
        // Додаємо активний клас до натиснутої вкладки та відповідної форми
        const tabId = tab.getAttribute('data-tab');
        tab.classList.add('active');
        document.getElementById(tabId + 'Form').classList.add('active');
        
        // Очищаємо повідомлення форм
        document.querySelectorAll('.form-message').forEach(msg => {
            msg.classList.remove('success');
            msg.textContent = '';
        });
    });
});

// Показати/приховати пароль
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggle.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            toggle.textContent = '👁️';
        }
    });
});

// Заповнення випадаючого списку міст на основі вибраної країни
const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');

countrySelect.addEventListener('change', () => {
    const selectedCountry = countrySelect.value;
    
    // Очищення випадаючого списку міст
    citySelect.innerHTML = '';
    
    if (selectedCountry) {
        // Активуємо випадаючий список міст
        citySelect.disabled = false;
        
        // Додаємо опцію за замовчуванням
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Виберіть місто';
        citySelect.appendChild(defaultOption);
        
        // Додаємо міста для вибраної країни
        citiesByCountry[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase();
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } else {
        // Деактивуємо випадаючий список міст
        citySelect.disabled = true;
        
        // Додаємо опцію за замовчуванням
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Спочатку виберіть країну';
        citySelect.appendChild(defaultOption);
    }
});

// Функції валідації
function validateName(name) {
    return name.length >= 3 && name.length <= 15;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
}

function validateBirthDate(birthDate) {
    if (!birthDate) return false;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    
    // Перевіряємо, чи дата в майбутньому
    if (birthDateObj > today) {
        return { valid: false, message: 'Дата народження не може бути у майбутньому' };
    }
    
    // Обчислюємо вік
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    
    // Перевіряємо, чи користувачу не менше 12 років
    if (age < 12) {
        return { valid: false, message: 'Вам має бути не менше 12 років для реєстрації' };
    }
    
    return { valid: true };
}

// Функції валідації форми
function validateInputField(input, validationFn, errorMsgId, errorMsg) {
    const value = input.value.trim();
    const errorElement = document.getElementById(errorMsgId);
    
    if (!value) {
        input.classList.remove('valid', 'invalid');
        errorElement.textContent = 'Це поле обов\'язкове';
        errorElement.classList.add('visible');
        return false;
    }
    
    const isValid = typeof validationFn === 'function' ? validationFn(value) : validationFn.valid;
    
    if (isValid) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        errorElement.classList.remove('visible');
        return true;
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorElement.textContent = typeof validationFn === 'function' ? errorMsg : validationFn.message;
        errorElement.classList.add('visible');
        return false;
    }
}

// Валідація форми авторизації
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username');
    const password = document.getElementById('login-password');
    const rememberMe = document.getElementById('rememberMe');
    const messageContainer = document.getElementById('login-message');
    
    // Валідація імені користувача
    const isUsernameValid = validateInputField(
        username,
        name => name.length > 0,
        'username-error',
        'Введіть ім\'я користувача'
    );
    
    // Валідація паролю
    const isPasswordValid = validateInputField(
        password,
        validatePassword,
        'login-password-error',
        'Пароль повинен містити не менше 6 символів'
    );
    
    // Якщо всі поля валідні, показуємо повідомлення про успіх
    if (isUsernameValid && isPasswordValid) {
        // Імітуємо успішну авторизацію
        messageContainer.textContent = 'Авторизація успішна!';
        messageContainer.classList.add('success');
        
        // Скидаємо форму
        loginForm.reset();
        document.querySelectorAll('#loginForm .form-control').forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
    }
});

// Валідація форми реєстрації
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const phone = document.getElementById('phone');
    const birthDate = document.getElementById('birthDate');
    const sexOptions = document.getElementsByName('sex');
    const country = document.getElementById('country');
    const city = document.getElementById('city');
    const messageContainer = document.getElementById('register-message');
    
    // Валідація імені
    const isFirstNameValid = validateInputField(
        firstName,
        validateName,
        'firstName-error',
        'Ім\'я повинно бути від 3 до 15 символів'
    );
    
    // Валідація прізвища
    const isLastNameValid = validateInputField(
        lastName,
        validateName,
        'lastName-error',
        'Прізвище повинно бути від 3 до 15 символів'
    );
    
    // Валідація електронної пошти
    const isEmailValid = validateInputField(
        email,
        validateEmail,
        'email-error',
        'Введіть коректну електронну адресу'
    );
    
    // Валідація паролю
    const isPasswordValid = validateInputField(
        password,
        validatePassword,
        'password-error',
        'Пароль повинен містити не менше 6 символів'
    );
    
    // Валідація підтвердження паролю
    const isConfirmPasswordValid = validateInputField(
        confirmPassword,
        value => value === password.value,
        'confirmPassword-error',
        'Паролі не співпадають'
    );
    
    // Валідація телефону
    const isPhoneValid = validateInputField(
        phone,
        validatePhone,
        'phone-error',
        'Введіть коректний номер телефону у форматі +380XXXXXXXXX'
    );
    
    // Валідація дати народження
    const isBirthDateValid = validateInputField(
        birthDate,
        validateBirthDate(birthDate.value),
        'birthDate-error',
        'Виберіть коректну дату народження'
    );
    
    // Валідація статі
    let isSexSelected = false;
    for (const option of sexOptions) {
        if (option.checked) {
            isSexSelected = true;
            break;
        }
    }
    
    const sexError = document.getElementById('sex-error');
    if (!isSexSelected) {
        sexError.textContent = 'Виберіть стать';
        sexError.classList.add('visible');
    } else {
        sexError.classList.remove('visible');
    }
    
    // Валідація країни
    const isCountrySelected = validateInputField(
        country,
        value => value !== '',
        'country-error',
        'Виберіть країну'
    );
    
    // Валідація міста
    const isCitySelected = validateInputField(
        city,
        value => value !== '',
        'city-error',
        'Виберіть місто'
    );
    
    // Якщо всі поля валідні, показуємо повідомлення про успіх
    if (
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        isPhoneValid &&
        isBirthDateValid &&
        isSexSelected &&
        isCountrySelected &&
        isCitySelected
    ) {
        // Імітуємо успішну реєстрацію
        messageContainer.textContent = 'Реєстрація успішна!';
        messageContainer.classList.add('success');
        
        // Скидаємо форму
        registerForm.reset();
        document.querySelectorAll('#registerForm .form-control').forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">Спочатку виберіть країну</option>';
    }
});

// Додаємо обробники подій input для валідації в реальному часі
// Форма авторизації
document.getElementById('username').addEventListener('input', function() {
    validateInputField(
        this,
        name => name.length > 0,
        'username-error',
        'Введіть ім\'я користувача'
    );
});

document.getElementById('login-password').addEventListener('input', function() {
    validateInputField(
        this,
        validatePassword,
        'login-password-error',
        'Пароль повинен містити не менше 6 символів'
    );
});

// Форма реєстрації
document.getElementById('firstName').addEventListener('input', function() {
    validateInputField(
        this,
        validateName,
        'firstName-error',
        'Ім\'я повинно бути від 3 до 15 символів'
    );
});

document.getElementById('lastName').addEventListener('input', function() {
    validateInputField(
        this,
        validateName,
        'lastName-error',
        'Прізвище повинно бути від 3 до 15 символів'
    );
});

document.getElementById('email').addEventListener('input', function() {
    validateInputField(
        this,
        validateEmail,
        'email-error',
        'Введіть коректну електронну адресу'
    );
});

document.getElementById('password').addEventListener('input', function() {
    validateInputField(
        this,
        validatePassword,
        'password-error',
        'Пароль повинен містити не менше 6 символів'
    );
    
    // Перевалідація поля підтвердження паролю при зміні паролю
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword.value) {
        validateInputField(
            confirmPassword,
            value => value === this.value,
            'confirmPassword-error',
            'Паролі не співпадають'
        );
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    validateInputField(
        this,
        value => value === document.getElementById('password').value,
        'confirmPassword-error',
        'Паролі не співпадають'
    );
});

document.getElementById('phone').addEventListener('input', function() {
    validateInputField(
        this,
        validatePhone,
        'phone-error',
        'Введіть коректний номер телефону у форматі +380XXXXXXXXX'
    );
});

document.getElementById('birthDate').addEventListener('change', function() {
    validateInputField(
        this,
        validateBirthDate(this.value),
        'birthDate-error',
        'Виберіть коректну дату народження'
    );
});

document.getElementsByName('sex').forEach(option => {
    option.addEventListener('change', () => {
        document.getElementById('sex-error').classList.remove('visible');
    });
});