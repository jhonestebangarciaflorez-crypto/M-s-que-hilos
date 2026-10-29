// ==========================================
// FASE 1: AUTENTICACIÓN Y VALIDACIONES (MOCK)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Helper: Validar formato de correo electrónico
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper: Obtener usuarios registrados desde localStorage
  function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registered_users_crochet')) || [];
  }

  // Helper: Guardar nuevo usuario
  function saveUser(newUser) {
    const users = getRegisteredUsers();
    users.push(newUser);
    localStorage.setItem('registered_users_crochet', JSON.stringify(users));
  }

  // Helper: Establecer sesión activa
  function setActiveSession(user) {
    const sessionData = {
      isLoggedIn: true,
      name: user.name,
      email: user.email,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('user_session_crochet', JSON.stringify(sessionData));
  }

  // 1. PROCESO DE REGISTRO
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('register-name');
      const emailInput = document.getElementById('register-email');
      const passwordInput = document.getElementById('register-password');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;

      // Validaciones
      if (name.length < 2) {
        alert('Por favor, ingresa un nombre válido.');
        return;
      }

      if (!isValidEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
      }

      if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      // Comprobar si el correo ya existe
      const existingUsers = getRegisteredUsers();
      const userExists = existingUsers.some(user => user.email === email);

      if (userExists) {
        alert('Este correo ya está registrado. Intenta iniciar sesión.');
        return;
      }

      // Guardar usuario e iniciar sesión automáticamente
      const newUser = { name, email, password };
      saveUser(newUser);
      setActiveSession(newUser);

      alert(`¡Cuenta creada con éxito! Bienvenida, ${name}.`);

      // Redirigir al inicio o a la vista de usuario
      window.location.href = '../index.html';
    });
  }

  // 2. PROCESO DE INICIO DE SESIÓN
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;

      if (!isValidEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
      }

      // Validar credenciales
      const registeredUsers = getRegisteredUsers();
      const userMatch = registeredUsers.find(
        user => user.email === email && user.password === password
      );

      if (!userMatch) {
        alert('Correo electrónico o contraseña incorrectos.');
        return;
      }

      // Guardar sesión activa
      setActiveSession(userMatch);

      alert(`¡Hola de nuevo, ${userMatch.name}!`);

      // Redirigir al inicio
      window.location.href = '../index.html';
    });
  }
});



document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirigir al Dashboard si ya existe una sesión activa
  const activeUser = JSON.parse(localStorage.getItem('user_session_crochet'));
  if (activeUser && activeUser.isLoggedIn) {
    window.location.href = 'dashboard.html';
    return;
  }

  // 2. Referencias a Formularios y Elementos
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // --- REGISTRO DE USUARIO ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('register-name').value.trim();
      const emailInput = document.getElementById('register-email').value.trim().toLowerCase();
      const passwordInput = document.getElementById('register-password').value;

      if (!nameInput || !emailInput || !passwordInput) return;

      // Crear objeto del usuario con la estructura que lee app.js
      const newSession = {
        isLoggedIn: true,
        name: nameInput,
        email: emailInput,
        createdYear: new Date().getFullYear().toString()
      };

      // Guardar en localStorage
      localStorage.setItem('user_session_crochet', JSON.stringify(newSession));

      // Redirigir al espacio personal
      window.location.href = 'dashboard.html';
    });
  }

  // --- INICIO DE SESIÓN ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('login-email').value.trim().toLowerCase();
      const passwordInput = document.getElementById('login-password').value;

      if (!emailInput || !passwordInput) return;

      // Obtener sesión previa o crear una basada en el correo ingresado
      const savedSession = JSON.parse(localStorage.getItem('user_session_crochet'));

      // Extraer un nombre predeterminado si no existía registro previo
      const derivedName = savedSession?.name || emailInput.split('@')[0];
      const nameFormatted = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

      const activeSession = {
        isLoggedIn: true,
        name: nameFormatted,
        email: emailInput,
        createdYear: savedSession?.createdYear || '2026'
      };

      localStorage.setItem('user_session_crochet', JSON.stringify(activeSession));

      // Comprobar si venía de querer finalizar una compra
      const redirectToCheckout = localStorage.getItem('redirect_to_checkout');
      if (redirectToCheckout) {
        localStorage.removeItem('redirect_to_checkout');
        window.location.href = 'carrito.html'; // O la vista de Checkout
      } else {
        window.location.href = 'dashboard.html';
      }
    });
  }
});