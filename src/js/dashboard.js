document.addEventListener('DOMContentLoaded', () => {
  // 1. Proteger ruta: Devolver a cuenta.html si no hay sesión activa
  const activeUser = JSON.parse(localStorage.getItem('user_session_crochet'));
  if (!activeUser || !activeUser.isLoggedIn) {
    window.location.href = 'cuenta.html';
    return;
  }

  // 2. Personalizar la cabecera del perfil en el sidebar
  const nameDisplay = document.getElementById('dash-user-name');
  const subtitleDisplay = document.getElementById('dash-user-subtitle');

  if (nameDisplay) nameDisplay.textContent = `Hola, ${activeUser.name || 'Cliente'}`;
  if (subtitleDisplay) subtitleDisplay.textContent = `Cliente desde ${activeUser.createdYear || '2024'}`;

  // 3. Sistema de Cierre de Sesión
  const logoutBtn = document.getElementById('dash-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user_session_crochet');
      window.location.href = 'cuenta.html';
    });
  }

  // 4. Mapeo de Plantillas / Vistas del Dashboard
  const contentArea = document.getElementById('dash-content-area');
  const tabButtons = document.querySelectorAll('.dash-tab-btn');

  const tabTemplates = {
    // Dentro de src/js/dashboard.js -> reemplazar tabTemplates.perfil por una función dinámica:

      perfil: () => {
        const userSession = JSON.parse(localStorage.getItem('user_session_crochet')) || {};
        const orders = JSON.parse(localStorage.getItem('user_orders_crochet')) || [];
        const addresses = JSON.parse(localStorage.getItem('user_addresses_crochet')) || [];

        // 1. Lógica para la tarjeta de Último Pedido
        const lastOrder = orders.length > 0 ? orders[0] : null;
        const orderCardHTML = lastOrder 
          ? `
            <div class="dash-summary-card dash-card-sand">
              <div class="dash-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <span class="dash-card-label">ÚLTIMO PEDIDO</span>
                <h3 class="dash-card-value">${lastOrder.id} · ${lastOrder.status}</h3>
              </div>
              <a href="dashboard.html?tab=pedidos" class="dash-card-link">Rastrear envío &rarr;</a>
            </div>
          `
          : `
            <div class="dash-summary-card dash-card-sand">
              <div class="dash-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <span class="dash-card-label">ÚLTIMO PEDIDO</span>
                <h3 class="dash-card-value" style="font-size: 1.15rem; color: #777;">Sin pedidos aún</h3>
              </div>
              <a href="catalogo.html" class="dash-card-link">Explorar catálogo &rarr;</a>
            </div>
          `;

        // 2. Lógica para la tarjeta de Dirección Principal
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;
        const addressCardHTML = defaultAddress 
          ? `
            <div class="dash-summary-card dash-card-lavender">
              <div class="dash-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 6v14l6-3 6 3 6-3v-14l-6 3-6-3-6 3z"/><path d="M7 3v14"/><path d="M13 6v14"/></svg>
              </div>
              <div>
                <span class="dash-card-label">DIRECCIÓN PRINCIPAL</span>
                <h3 class="dash-card-value">${defaultAddress.alias} · ${defaultAddress.city}</h3>
              </div>
              <a href="dashboard.html?tab=direcciones" class="dash-card-link">Ver direcciones &rarr;</a>
            </div>
          `
          : `
            <div class="dash-summary-card dash-card-lavender">
              <div class="dash-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 6v14l6-3 6 3 6-3v-14l-6 3-6-3-6 3z"/><path d="M7 3v14"/><path d="M13 6v14"/></svg>
              </div>
              <div>
                <span class="dash-card-label">DIRECCIÓN PRINCIPAL</span>
                <h3 class="dash-card-value" style="font-size: 1.15rem; color: #777;">Sin dirección guardada</h3>
              </div>
              <a href="dashboard.html?tab=direcciones" class="dash-card-link">Añadir dirección &rarr;</a>
            </div>
          `;

        return `
          <div class="dash-header-section">
            <span class="dash-sub-caption">— MI CUENTA</span>
            <h1 class="dash-title">Hola, ${userSession.name || 'Cliente'}</h1>
            <p class="dash-description">Este es tu rincón para tenerlo todo ordenado y a mano.</p>
          </div>

          <div class="dash-cards-row">
            ${orderCardHTML}
            ${addressCardHTML}
          </div>

          <div class="dash-banner-card">
            <div class="dash-banner-content">
              <span class="dash-sub-caption">— PARA TI</span>
              <h2 class="dash-title" style="font-size: 2rem;">Un espacio hecho a tu medida</h2>
              <p class="dash-description" style="margin-top: 0.8rem;">
                Guarda tus datos para comprar con calma y seguir cada pieza desde el taller hasta tu casa.
              </p>
            </div>
            <div class="dash-banner-image">
              <img src="../src/assets/img/producto-conejita.jpg" alt="Pieza artesanal de crochet">
            </div>
          </div>
        `;
      },
    // Dentro de src/js/dashboard.js -> reemplazar tabTemplates.pedidos por esta función dinámica:

    pedidos: () => {
      const orders = JSON.parse(localStorage.getItem('user_orders_crochet')) || [];

      // 1. Si el usuario NO tiene pedidos registrados
      if (orders.length === 0) {
        return `
          <div class="dash-header-section">
            <span class="dash-sub-caption">— HISTORIAL DE COMPRAS</span>
            <h1 class="dash-title">Mis Pedidos</h1>
            <p class="dash-description">Sigue tus piezas o vuelve a consultar un pedido anterior.</p>
          </div>

          <div class="empty-state-card">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 class="empty-state-title">Aún no has realizado ningún pedido</h3>
            <p class="empty-state-description">
              Cuando te enamores de una de nuestras piezas hechas a mano y completes tu compra, podrás seguir el estado de tu paquete desde aquí.
            </p>
            <a href="catalogo.html" class="btn-dash-save" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
              Explorar el catálogo <span>&rarr;</span>
            </a>
          </div>
        `;
      }

      // 2. Si el usuario SÍ tiene pedidos guardados en localStorage
      const ordersHTML = orders.map(order => {
        // Determinar clase del badge de estado
        let badgeClass = 'badge-on-way';
        if (order.status?.toLowerCase() === 'entregado') badgeClass = 'badge-delivered';
        if (order.status?.toLowerCase() === 'preparando') badgeClass = 'badge-preparing';

        // Generar imágenes de miniaturas
        const thumbsHTML = (order.items || []).map(item => `
          <img src="${item.img || '../src/assets/img/producto-conejita.jpg'}" alt="${item.title || 'Pieza'}" class="order-thumb-img">
        `).join('');

        return `
          <article class="order-card">
            <div class="order-card-header">
              <div class="order-meta-group">
                <div class="order-meta-item">
                  <span class="order-label">NÚMERO DE PEDIDO</span>
                  <span class="order-value font-serif">${order.id}</span>
                </div>
                <div class="order-meta-item">
                  <span class="order-label">FECHA DE COMPRA</span>
                  <span class="order-value">${order.date}</span>
                </div>
              </div>
              <span class="order-status-badge ${badgeClass}">${order.status}</span>
            </div>

            <div class="order-card-body">
              <div class="order-thumbnails">
                ${thumbsHTML}
              </div>

              <div class="order-actions-group">
                <div class="order-total-box">
                  <span class="order-label">TOTAL</span>
                  <span class="order-price">${order.total}</span>
                </div>
                <button type="button" class="btn-order-action">
                  ${order.status?.toLowerCase() === 'en camino' ? 'Rastrear envío' : 'Ver detalles'} <span>&rarr;</span>
                </button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      return `
        <div class="dash-header-section">
          <span class="dash-sub-caption">— HISTORIAL DE COMPRAS</span>
          <h1 class="dash-title">Mis Pedidos</h1>
          <p class="dash-description">Sigue tus piezas o vuelve a consultar un pedido anterior.</p>
        </div>

        <div class="orders-list-wrapper">
          ${ordersHTML}
        </div>
      `;
    },// Dentro de src/js/dashboard.js -> reemplazar tabTemplates.direcciones por esta función dinámica:

    // Dentro de src/js/dashboard.js -> reemplazar tabTemplates.direcciones por:

    direcciones: () => {
      const addresses = JSON.parse(localStorage.getItem('user_addresses_crochet')) || [];
      const userSession = JSON.parse(localStorage.getItem('user_session_crochet')) || {};

      // Contenido principal según si hay direcciones o no
      let contentHTML = '';

      if (addresses.length === 0) {
        contentHTML = `
          <div class="empty-state-card">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 6v14l6-3 6 3 6-3v-14l-6 3-6-3-6 3z"/>
                <path d="M7 3v14"/>
                <path d="M13 6v14"/>
              </svg>
            </div>
            <h3 class="empty-state-title">Aún no tienes direcciones guardadas</h3>
            <p class="empty-state-description">
              Añade tu dirección principal para agilizar el proceso de entrega cuando realices un pedido.
            </p>
            <button type="button" class="btn-dash-save btn-open-addr-trigger" style="margin-top: 0.5rem;">
              + Agregar mi primera dirección
            </button>
          </div>
        `;
      } else {
        const cards = addresses.map((addr, index) => `
          <article class="address-card" data-index="${index}">
            <div class="address-card-header">
              <div class="address-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 6v14l6-3 6 3 6-3v-14l-6 3-6-3-6 3z"/>
                  <path d="M7 3v14"/>
                  <path d="M13 6v14"/>
                </svg>
              </div>
              <div class="address-title-box">
                <h3 class="address-alias">${addr.alias || 'Dirección'}</h3>
                ${addr.isDefault ? '<span class="address-badge-default">Predeterminada</span>' : ''}
              </div>
            </div>

            <div class="address-card-body">
              <p class="address-recipient">${userSession.name || 'Cliente'}</p>
              <p class="address-text">${addr.street || ''} · ${addr.city || ''}</p>
              <p class="address-phone">${addr.phone || ''}</p>
            </div>

            <hr class="address-divider">

            <div class="address-card-actions">
              <button type="button" class="address-action-btn edit-address-btn" data-index="${index}">Editar</button>
              <button type="button" class="address-action-btn delete-btn delete-address-btn" data-index="${index}">Eliminar</button>
            </div>
          </article>
        `).join('');

        contentHTML = `<div class="addresses-grid">${cards}</div>`;
      }

      return `
        <div class="dash-header-with-action">
          <div class="dash-header-section">
            <span class="dash-sub-caption">— TUS LUGARES</span>
            <h1 class="dash-title">Direcciones de Envío</h1>
            <p class="dash-description">Elige dónde quieres recibir tus próximas piezas.</p>
          </div>
          
          <button type="button" class="btn-add-address btn-open-addr-trigger">
            + Agregar nueva dirección
          </button>
        </div>

        ${contentHTML}

        <!-- MODAL PARA CREAR / EDITAR DIRECCIÓN -->
        <div id="address-modal" class="favorites-modal-overlay">
          <div class="favorites-modal-card" style="max-width: 480px;">
            <div class="favorites-modal-header">
              <div class="header-titles">
                <span class="sub-caption">— TUS LUGARES</span>
                <h2 class="modal-title" id="addr-modal-title">Agregar dirección</h2>
              </div>
              <button type="button" id="close-addr-modal-btn" class="close-modal-btn">&times;</button>
            </div>

            <form id="address-form" style="padding: 1.2rem 0 0 0; display: flex; flex-direction: column; gap: 1.1rem;">
              <input type="hidden" id="addr-edit-index" value="-1">

              <div class="form-group-dash">
                <label for="addr-alias" class="dash-field-label">Alias de la dirección (ej: Casa, Trabajo)</label>
                <input type="text" id="addr-alias" class="dash-field-input" placeholder="Casa" required>
              </div>

              <div class="form-group-dash">
                <label for="addr-street" class="dash-field-label">Calle, número y piso</label>
                <input type="text" id="addr-street" class="dash-field-input" placeholder="Calle 82 #24 - 2º B" required>
              </div>

              <div class="form-group-dash">
                <label for="addr-city" class="dash-field-label">Ciudad y Código Postal</label>
                <input type="text" id="addr-city" class="dash-field-input" placeholder="28004 Medellin" required>
              </div>

              <div class="form-group-dash">
                <label for="addr-phone" class="dash-field-label">Teléfono de contacto</label>
                <input type="tel" id="addr-phone" class="dash-field-input" placeholder="+314 612 34578" required>
              </div>

              <div style="display: flex; align-items: center; gap: 0.6rem; margin-top: 0.2rem;">
                <input type="checkbox" id="addr-default" style="accent-color: #63473d; width: 16px; height: 16px; cursor: pointer;">
                <label for="addr-default" style="font-size: 0.85rem; color: #2c2b29; cursor: pointer;">Marcar como dirección predeterminada</label>
              </div>

              <button type="submit" class="btn-dash-save" style="width: 100%; margin-top: 0.5rem;">
                Guardar dirección
              </button>
            </form>
          </div>
        </div>
      `;
    },
    configuracion: `
      <div class="dash-header-section">
        <span class="dash-sub-caption">— DATOS Y SEGURIDAD</span>
        <h1 class="dash-title">Configuración de Cuenta</h1>
        <p class="dash-description">Actualiza tus datos personales cuando lo necesites.</p>
      </div>

      <div class="settings-card">
        <form id="settings-form">
          <div class="settings-section">
            <div class="settings-section-info">
              <h2 class="settings-section-title">Datos personales</h2>
              <p class="settings-section-sub">La información que usamos para tus pedidos.</p>
            </div>

            <div class="settings-fields-group">
              <div class="form-group-dash">
                <label for="settings-name" class="dash-field-label">Nombre completo</label>
                <input type="text" id="settings-name" class="dash-field-input" value="${activeUser.name || ''}" required>
              </div>

              <div class="form-group-dash">
                <label for="settings-email" class="dash-field-label">Correo electrónico</label>
                <input type="email" id="settings-email" class="dash-field-input" value="${activeUser.email || ''}" required>
              </div>

              <div class="form-group-dash">
                <label for="settings-phone" class="dash-field-label">Teléfono</label>
                <input type="tel" id="settings-phone" class="dash-field-input" value="${activeUser.phone || '+34 612 345 678'}" placeholder="+34 000 000 000">
              </div>
            </div>
          </div>

          <hr class="settings-divider">

          <div class="settings-section align-center">
            <div class="settings-section-info">
              <h2 class="settings-section-title">Seguridad</h2>
              <p class="settings-section-sub">Tu contraseña se actualizó recientemente.</p>
            </div>

            <button type="button" class="btn-change-pwd" id="btn-open-pwd-modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Cambiar contraseña
            </button>
          </div>

          <hr class="settings-divider">

          <div class="settings-actions">
            <button type="button" class="btn-dash-cancel" id="btn-cancel-settings">Cancelar</button>
            <button type="submit" class="btn-dash-save">Guardar cambios</button>
          </div>
        </form>
      </div>

      <div id="pwd-modal" class="favorites-modal-overlay">
        <div class="favorites-modal-card" style="max-width: 440px;">
          <div class="favorites-modal-header">
            <div class="header-titles">
              <span class="sub-caption">— SEGURIDAD</span>
              <h2 class="modal-title">Cambiar contraseña</h2>
            </div>
            <button type="button" id="close-pwd-btn" class="close-modal-btn">&times;</button>
          </div>

          <form id="pwd-form" style="padding: 1.5rem 0 0 0; display: flex; flex-direction: column; gap: 1.2rem;">
            <div class="form-group-dash">
              <label for="current-pwd" class="dash-field-label">Contraseña actual</label>
              <input type="password" id="current-pwd" class="dash-field-input" placeholder="••••••••" required>
            </div>

            <div class="form-group-dash">
              <label for="new-pwd" class="dash-field-label">Nueva contraseña</label>
              <input type="password" id="new-pwd" class="dash-field-input" placeholder="Mínimo 6 caracteres" required>
            </div>

            <button type="submit" class="btn-dash-save" style="width: 100%; margin-top: 0.5rem;">
              Actualizar contraseña
            </button>
          </form>
        </div>
      </div>
    `
  };

  // 5. Función para activar la interactividad de la pestaña de Configuración
  function initSettingsEvents() {
    const settingsForm = document.getElementById('settings-form');
    const btnCancel = document.getElementById('btn-cancel-settings');
    
    const pwdModal = document.getElementById('pwd-modal');
    const btnOpenPwd = document.getElementById('btn-open-pwd-modal');
    const btnClosePwd = document.getElementById('close-pwd-btn');
    const pwdForm = document.getElementById('pwd-form');

    // Guardar cambios personales
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newName = document.getElementById('settings-name').value.trim();
        const newEmail = document.getElementById('settings-email').value.trim().toLowerCase();
        const newPhone = document.getElementById('settings-phone').value.trim();

        if (!newName || !newEmail) return;

        const session = JSON.parse(localStorage.getItem('user_session_crochet')) || {};
        session.name = newName;
        session.email = newEmail;
        session.phone = newPhone;

        localStorage.setItem('user_session_crochet', JSON.stringify(session));

        // Actualizar saludo del sidebar de inmediato
        const nameDisplay = document.getElementById('dash-user-name');
        if (nameDisplay) nameDisplay.textContent = `Hola, ${newName}`;

        alert('¡Datos personales guardados correctamente!');
      });
    }

    // Cancelar y reestablecer campos
    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        const session = JSON.parse(localStorage.getItem('user_session_crochet')) || {};
        document.getElementById('settings-name').value = session.name || '';
        document.getElementById('settings-email').value = session.email || '';
        document.getElementById('settings-phone').value = session.phone || '+34 612 345 678';
      });
    }

    // Abrir modal contraseña
    if (btnOpenPwd && pwdModal) {
      btnOpenPwd.addEventListener('click', () => pwdModal.classList.add('active'));
    }

    // Cerrar modal contraseña
    if (btnClosePwd && pwdModal) {
      btnClosePwd.addEventListener('click', () => pwdModal.classList.remove('active'));
    }

    // Cambiar contraseña
    if (pwdForm) {
      pwdForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPwd = document.getElementById('new-pwd').value;
        if (newPwd.length < 6) {
          alert('La contraseña debe tener al menos 6 caracteres.');
          return;
        }

        const session = JSON.parse(localStorage.getItem('user_session_crochet')) || {};
        session.password = newPwd;
        localStorage.setItem('user_session_crochet', JSON.stringify(session));

        alert('¡Contraseña actualizada con éxito!');
        pwdForm.reset();
        pwdModal.classList.remove('active');
      });
    }
  }

  // 6. Función para renderizar el contenido dinámico y sus eventos
    const renderTab = (tabKey) => {
      if (contentArea && tabTemplates[tabKey]) {
        const templateContent = typeof tabTemplates[tabKey] === 'function' 
          ? tabTemplates[tabKey]() 
          : tabTemplates[tabKey];

        contentArea.innerHTML = templateContent;
      }

      // Resaltar botones en el sidebar
      tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Inicializar eventos de las pestañas
      if (tabKey === 'configuracion') {
        initSettingsEvents();
      } else if (tabKey === 'direcciones') {
        initAddressEvents();
      }
    };

  // 7. Cargar pestaña inicial desde la URL o por defecto 'perfil'
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'perfil';
  renderTab(initialTab);

  // 8. Escuchar clics en los botones del sidebar
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTab = btn.getAttribute('data-tab');
      renderTab(selectedTab);
    });
  });
});


function initAddressEvents() {
  const addrModal = document.getElementById('address-modal');
  const closeBtn = document.getElementById('close-addr-modal-btn');
  const addrForm = document.getElementById('address-form');
  const openTriggers = document.querySelectorAll('.btn-open-addr-trigger');

  // Abrir modal para nueva dirección
  openTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('addr-modal-title').textContent = 'Agregar dirección';
      document.getElementById('addr-edit-index').value = '-1';
      addrForm.reset();
      addrModal.classList.add('active');
    });
  });

  // Cerrar modal
  if (closeBtn && addrModal) {
    closeBtn.addEventListener('click', () => addrModal.classList.remove('active'));
  }

  // Enviar Formulario (Crear / Editar)
  if (addrForm) {
    addrForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const editIndex = parseInt(document.getElementById('addr-edit-index').value, 10);
      const alias = document.getElementById('addr-alias').value.trim();
      const street = document.getElementById('addr-street').value.trim();
      const city = document.getElementById('addr-city').value.trim();
      const phone = document.getElementById('addr-phone').value.trim();
      const isDefault = document.getElementById('addr-default').checked;

      let addresses = JSON.parse(localStorage.getItem('user_addresses_crochet')) || [];

      // Si se marca como predeterminada, quitar flag a las demás
      if (isDefault) {
        addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
      }

      const newAddress = { alias, street, city, phone, isDefault: isDefault || addresses.length === 0 };

      if (editIndex >= 0) {
        addresses[editIndex] = newAddress;
      } else {
        addresses.push(newAddress);
      }

      localStorage.setItem('user_addresses_crochet', JSON.stringify(addresses));

      addrModal.classList.remove('active');
      // Re-renderizar la pestaña para mostrar los cambios
      renderTab('direcciones');
    });
  }

  // Escuchar botones de Eliminar
  document.querySelectorAll('.delete-address-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      let addresses = JSON.parse(localStorage.getItem('user_addresses_crochet')) || [];
      
      addresses.splice(idx, 1);
      
      // Si eliminamos la predeterminada y quedan direcciones, asignar la primera
      if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
        addresses[0].isDefault = true;
      }

      localStorage.setItem('user_addresses_crochet', JSON.stringify(addresses));
      renderTab('direcciones');
    });
  });

  // Escuchar botones de Editar
  document.querySelectorAll('.edit-address-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      const addresses = JSON.parse(localStorage.getItem('user_addresses_crochet')) || [];
      const item = addresses[idx];

      if (item) {
        document.getElementById('addr-modal-title').textContent = 'Editar dirección';
        document.getElementById('addr-edit-index').value = idx;
        document.getElementById('addr-alias').value = item.alias || '';
        document.getElementById('addr-street').value = item.street || '';
        document.getElementById('addr-city').value = item.city || '';
        document.getElementById('addr-phone').value = item.phone || '';
        document.getElementById('addr-default').checked = !!item.isDefault;

        addrModal.classList.add('active');
      }
    });
  });
}