document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('search-toggle-btn');
  const closeBtn = document.getElementById('search-close-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');

  // Función para abrir la búsqueda
  const openSearch = () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100); // Pon el foco directo en la caja de texto
  };

  // Función para cerrar la búsqueda
  const closeSearch = () => {
    searchOverlay.classList.remove('active');
  };

  // Eventos de clic
  toggleBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);

  // Cerrar al presionar la tecla 'Escape'
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Opcional: Cerrar si el usuario hace clic fuera de la barra de búsqueda
  document.addEventListener('click', (e) => {
    if (
      searchOverlay.classList.contains('active') &&
      !searchOverlay.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeSearch();
    }
  });
});





document.addEventListener('DOMContentLoaded', () => {
  // Referencias a los elementos del buscador en el header
  const toggleBtn = document.getElementById('search-toggle-btn');
  const closeBtn = document.getElementById('search-close-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchSubmitBtn = document.getElementById('search-submit-btn');

  // Referencias a elementos específicos de catalogo.html
  const productCards = document.querySelectorAll('.product-card');
  const itemCountText = document.querySelector('.item-count');
  const catalogGridSection = document.querySelector('.catalog-grid-section');

  // Verificar en qué página nos encontramos
  const isCatalogPage = window.location.pathname.includes('catalogo.html');

  // 1. Abrir y cerrar el desplegable del buscador
  const openSearch = () => {
    searchOverlay?.classList.add('active');
    setTimeout(() => searchInput?.focus(), 100);
  };

  const closeSearch = () => {
    searchOverlay?.classList.remove('active');
  };

  toggleBtn?.addEventListener('click', openSearch);
  closeBtn?.addEventListener('click', closeSearch);

  // 2. Función principal para ejecutar la búsqueda o redirigir
  const executeSearch = () => {
    const query = searchInput.value.trim();

    if (!query) return;

    if (isCatalogPage) {
      // Si ya estamos en catálogo, filtramos dinámicamente en pantalla
      filterCatalogByQuery(query);
    } else {
      // Si estamos en Inicio u otra página, redirigimos a catalogo.html enviando la búsqueda en la URL
      const catalogPath = window.location.pathname.includes('/pages/') 
        ? 'catalogo.html' 
        : '../pages/catalogo.html'; // Ajusta la ruta si index está en la raíz

      window.location.href = `${catalogPath}?search=${encodeURIComponent(query)}`;
    }
  };

  // 3. Filtrar los productos en catalogo.html
  const filterCatalogByQuery = (query) => {
    const searchTerm = query.toLowerCase();
    let visibleCount = 0;

    productCards.forEach(card => {
      const title = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category')?.toLowerCase() || '';

      if (title.includes(searchTerm) || category.includes(searchTerm)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (itemCountText) {
      itemCountText.textContent = `${visibleCount} ${visibleCount === 1 ? 'pieza' : 'piezas'}`;
    }

    if (searchTerm !== '' && catalogGridSection) {
      catalogGridSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4. Leer parámetros URL al cargar la página (Paso 3)
  if (isCatalogPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
      if (searchInput) searchInput.value = searchQuery;
      filterCatalogByQuery(searchQuery);
    }
  }

  // 5. Escuchadores de eventos para la búsqueda
  // Búsqueda en tiempo real si ya estamos en la página de catálogo
  searchInput?.addEventListener('input', (e) => {
    if (isCatalogPage) {
      filterCatalogByQuery(e.target.value.trim());
    }
  });

  // Al hacer clic en el botón "Buscar"
  searchSubmitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    executeSearch();
  });

  // Al presionar la tecla 'Enter' dentro del input de búsqueda
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  });

  // Cerrar buscador con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
      closeSearch();
    }
  });
});



document.addEventListener('DOMContentLoaded', () => {
  // 1. Selección de elementos del DOM
  const favoritesToggleBtn = document.getElementById('favorites-toggle-btn');
  const closeFavoritesBtn = document.getElementById('close-favorites-btn');
  const favoritesModal = document.getElementById('favorites-modal');
  const favoritesListContainer = document.getElementById('favorites-list-container');
  const favoritesBadge = document.getElementById('favorites-badge');

  // 2. Cargar favoritos desde localStorage al iniciar la página
  let favorites = JSON.parse(localStorage.getItem('wishlist_crochet')) || [];

  // Función auxiliar para guardar el estado actual en localStorage
  function saveToLocalStorage() {
    localStorage.setItem('wishlist_crochet', JSON.stringify(favorites));
  }

  // 3. Control del Modal (Abrir y Cerrar)
  const openModal = () => favoritesModal?.classList.add('active');
  const closeModal = () => favoritesModal?.classList.remove('active');

  if (favoritesToggleBtn) favoritesToggleBtn.addEventListener('click', openModal);
  if (closeFavoritesBtn) closeFavoritesBtn.addEventListener('click', closeModal);

  if (favoritesModal) {
    favoritesModal.addEventListener('click', (e) => {
      if (e.target === favoritesModal) closeModal();
    });
  }

  // 4. Función para renderizar el panel y sincronizar los botones en pantalla
  function renderFavoritesUI() {
    // Actualizar el número del badge y controlar su visibilidad
    if (favoritesBadge) {
      const count = favorites.length;
      favoritesBadge.textContent = count;

      // Si hay al menos 1 elemento lo muestra, si es 0 lo oculta
      if (count > 0) {
        favoritesBadge.style.display = 'flex';
      } else {
        favoritesBadge.style.display = 'none';
      }
    }

    // Limpiar contenedor dinámico
    if (favoritesListContainer) {
      favoritesListContainer.innerHTML = '';

      if (favorites.length === 0) {
        favoritesListContainer.innerHTML = `
          <p class="empty-favorites-msg">No tienes productos en tus favoritos.</p>
        `;
      } else {
        favorites.forEach((product) => {
          const itemHTML = `
            <article class="favorite-item" data-id="${product.id}">
              <img src="${product.img}" alt="${product.title}" class="favorite-item-img">
              
              <div class="favorite-item-info">
                <span class="favorite-item-category">${product.category}</span>
                <h3 class="favorite-item-title">${product.title}</h3>
                <span class="favorite-item-price">${product.price}</span>
              </div>

              <div class="favorite-item-actions">
                <button type="button" class="btn-add-cart-modal">Añadir al carrito</button>
                <button type="button" class="btn-remove-favorite" aria-label="Eliminar de favoritos" data-id="${product.id}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </article>
          `;
          favoritesListContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Escuchar la basurita en el modal
        const removeButtons = favoritesListContainer.querySelectorAll('.btn-remove-favorite');
        removeButtons.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const idToRemove = e.currentTarget.getAttribute('data-id');
            removeFromFavorites(idToRemove);
          });
        });
      }
    }

    // Marca o desmarca los botones de corazón en el catálogo presente según lo guardado
    updateCatalogHeartState();
  }

  // Marcar los corazones pintados si el producto existe en localStorage
  function updateCatalogHeartState() {
    const catalogCards = document.querySelectorAll('.product-card');
    catalogCards.forEach((card) => {
      const cardId = card.getAttribute('data-id');
      const wishlistBtn = card.querySelector('.wishlist-btn');

      if (wishlistBtn) {
        const isSaved = favorites.some((item) => item.id === cardId);
        if (isSaved) {
          wishlistBtn.classList.add('active');
        } else {
          wishlistBtn.classList.remove('active');
        }
      }
    });
  }

  // 5. Agregar / Eliminar desde las tarjetas
  function toggleFavorite(cardElement, wishlistBtn) {
    const id = cardElement.getAttribute('data-id');
    const title = cardElement.getAttribute('data-title');
    const category = cardElement.getAttribute('data-category');
    const price = cardElement.getAttribute('data-price');
    const img = cardElement.getAttribute('data-img');

    const existingIndex = favorites.findIndex((item) => item.id === id);

    if (existingIndex === -1) {
      favorites.push({ id, title, category, price, img });
    } else {
      favorites.splice(existingIndex, 1);
    }

    saveToLocalStorage();
    renderFavoritesUI();
  }

  // 6. Eliminar directamente desde la basura
  function removeFromFavorites(id) {
    favorites = favorites.filter((item) => item.id !== id);
    saveToLocalStorage();
    renderFavoritesUI();
  }

  // Escuchar clics en los corazones del catálogo
  const catalogWishlistBtns = document.querySelectorAll('.wishlist-btn');
  catalogWishlistBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (card) {
        toggleFavorite(card, e.currentTarget);
      }
    });
  });

  // Ejecutar el renderizado inicial al cargar cualquier vista
  renderFavoritesUI();
});



document.addEventListener('DOMContentLoaded', () => {
  // 1. Selección de elementos del DOM del Carrito
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartListContainer = document.getElementById('cart-list-container');
  const cartBadge = document.getElementById('cart-badge');
  const cartTitleText = document.getElementById('cart-title-text');
  const cartSubtotalPrice = document.getElementById('cart-subtotal-price');

  // 2. Cargar carrito desde localStorage
  let cart = JSON.parse(localStorage.getItem('cart_crochet')) || [];

  function saveCartToLocalStorage() {
    localStorage.setItem('cart_crochet', JSON.stringify(cart));
  }

  // 3. Control de apertura / cierre del Carrito
  const openCart = () => cartDrawerOverlay?.classList.add('active');
  const closeCart = () => cartDrawerOverlay?.classList.remove('active');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  // Helper para convertir el texto del precio (ej: "38,00 €") a número
  function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    const cleanStr = priceString.replace('€', '').replace(',', '.').trim();
    return parseFloat(cleanStr) || 0;
  }

  // 4. Renderizado dinámico del Carrito
  function renderCartUI() {
    // Calcular el número total de unidades en el carrito
    const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Actualizar el badge del header
    if (cartBadge) {
      cartBadge.textContent = totalItemsCount;
      cartBadge.style.display = totalItemsCount > 0 ? 'flex' : 'none';
    }

    // Actualizar título de la cabecera del carrito
    if (cartTitleText) {
      const itemText = totalItemsCount === 1 ? '1 ítem' : `${totalItemsCount} ítems`;
      cartTitleText.textContent = `Tu Carrito (${itemText})`;
    }

    // Limpiar contenedor de lista
    if (cartListContainer) {
      cartListContainer.innerHTML = '';

      if (cart.length === 0) {
        cartListContainer.innerHTML = `
          <p class="empty-cart-msg">Tu carrito está vacío.</p>
        `;
      } else {
        cart.forEach((product) => {
          const itemHTML = `
            <article class="cart-item" data-id="${product.id}">
              <img src="${product.img}" alt="${product.title}" class="cart-item-img">
              
              <div class="cart-item-info">
                <span class="cart-item-category">${product.category}</span>
                <h3 class="cart-item-title">${product.title}</h3>
                <span class="cart-item-price">${product.price}</span>

                <!-- Controles de Cantidad -->
                <div class="quantity-controls">
                  <button type="button" class="qty-btn qty-minus" data-id="${product.id}">-</button>
                  <span class="qty-number">${product.quantity}</span>
                  <button type="button" class="qty-btn qty-plus" data-id="${product.id}">+</button>
                </div>
              </div>

              <!-- Basurita -->
              <button type="button" class="btn-remove-cart" aria-label="Eliminar ítem" data-id="${product.id}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </article>
          `;
          cartListContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Escuchar clics en los botones de cantidad (+) y (-)
        const minusBtns = cartListContainer.querySelectorAll('.qty-minus');
        const plusBtns = cartListContainer.querySelectorAll('.qty-plus');
        const removeBtns = cartListContainer.querySelectorAll('.btn-remove-cart');

        minusBtns.forEach(btn => {
          btn.addEventListener('click', (e) => updateQuantity(e.currentTarget.getAttribute('data-id'), -1));
        });

        plusBtns.forEach(btn => {
          btn.addEventListener('click', (e) => updateQuantity(e.currentTarget.getAttribute('data-id'), 1));
        });

        removeBtns.forEach(btn => {
          btn.addEventListener('click', (e) => removeFromCart(e.currentTarget.getAttribute('data-id')));
        });
      }
    }

    // Calcular Subtotal acumulado
    const subtotal = cart.reduce((sum, item) => {
      return sum + (parsePrice(item.price) * item.quantity);
    }, 0);

    if (cartSubtotalPrice) {
      cartSubtotalPrice.textContent = `${subtotal.toFixed(2).replace('.', ',')} €`;
    }
  }

  // 5. Función para añadir un producto al Carrito
// 5. Función para añadir un producto al Carrito (con blindaje contra null)
  function addToCart(productData) {
    // Si falta algún dato crítico, abortar la inserción para no corromper el carrito
    if (!productData || !productData.id || productData.id === 'null' || productData.title === 'null') {
      console.warn('Intento de agregar un producto inválido prevenido:', productData);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.id === productData.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...productData, quantity: 1 });
    }

    saveCartToLocalStorage();
    renderCartUI();
    openCart();
  }

  // 6. Cambiar cantidad de un producto (+ o -)
  function updateQuantity(id, change) {
    const item = cart.find((prod) => prod.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(id);
        return;
      }
      saveCartToLocalStorage();
      renderCartUI();
    }
  }

  // 7. Eliminar del carrito por ID
  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCartToLocalStorage();
    renderCartUI();
  }

  // 8. Vincular botones de "Añadir a la cesta" en el Catálogo
  const addToCartButtons = document.querySelectorAll('.add-to-cart-overlay, .btn-add-cart');

  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (card) {
        // 1. Intentar leer desde los atributos data-*
        let id = card.getAttribute('data-id');
        let title = card.getAttribute('data-title');
        let category = card.getAttribute('data-category');
        let price = card.getAttribute('data-price');
        let img = card.getAttribute('data-img');

        // 2. Si no están en los atributos data-*, extraerlos directamente del DOM como respaldo
        if (!title) {
          title = card.querySelector('.product-name')?.textContent.trim() || 'Producto';
        }
        if (!id) {
          id = title.toLowerCase().replace(/\s+/g, '-');
        }
        if (!category) {
          category = card.querySelector('.product-category')?.textContent.trim() || 'CROCHET';
        }
        if (!price) {
          price = card.querySelector('.product-price, .price')?.textContent.trim() || '0,00 €';
        }
        if (!img) {
          img = card.querySelector('img')?.getAttribute('src') || '';
        }

        addToCart({ id, title, category, price, img });
      }
    });
  });

  // Vincular eventos de "Añadir al carrito" que estén dentro del modal de favoritos
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart-modal')) {
      const favoriteItem = e.target.closest('.favorite-item');
      if (favoriteItem) {
        const id = favoriteItem.getAttribute('data-id');
        const img = favoriteItem.querySelector('.favorite-item-img')?.getAttribute('src');
        const title = favoriteItem.querySelector('.favorite-item-title')?.textContent;
        const category = favoriteItem.querySelector('.favorite-item-category')?.textContent;
        const price = favoriteItem.querySelector('.favorite-item-price')?.textContent;

        addToCart({ id, title, category, price, img });
      }
    }
  });

  // Renderizado inicial al cargar la página
  renderCartUI();
});




// ==========================================
// MENÚ DESPLEGABLE DE USUARIO
// ==========================================
const userToggleBtn = document.getElementById('user-toggle-btn');
const userDropdownMenu = document.getElementById('user-dropdown-menu');
const userGreetingTitle = document.getElementById('user-greeting-title');
const userGreetingSubtitle = document.getElementById('user-greeting-subtitle');
const userMenuOptions = document.getElementById('user-menu-options');

// 1. Alternar visibilidad del menú
if (userToggleBtn && userDropdownMenu) {
  userToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague al documento
    userDropdownMenu.classList.toggle('active');
  });

  // Cerrar el menú si el usuario hace clic fuera de él
  document.addEventListener('click', (e) => {
    if (!userDropdownMenu.contains(e.target) && !userToggleBtn.contains(e.target)) {
      userDropdownMenu.classList.remove('active');
    }
  });
}

// 2. Función para actualizar la vista según el estado de la sesión
function updateProfileMenuUI() {
  // Comprobar si hay un usuario en localStorage
  const activeUser = JSON.parse(localStorage.getItem('user_session_crochet'));

  if (activeUser && activeUser.isLoggedIn) {
    // ESTADO: USUARIO LOGUEADO
    if (userGreetingTitle) userGreetingTitle.textContent = `¡Hola, ${activeUser.name}!`;
    if (userGreetingSubtitle) userGreetingSubtitle.textContent = activeUser.email;

    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '' : 'pages/';

    if (userMenuOptions) {
      userMenuOptions.innerHTML = `
        <li>
          <a href="${basePath}cuenta.html?tab=pedidos" class="user-menu-link">
            <span>Mis Pedidos</span>
            <span class="chevron">&rsaquo;</span>
          </a>
        </li>
        <li>
          <a href="${basePath}cuenta.html?tab=direcciones" class="user-menu-link">
            <span>Direcciones de Envío</span>
            <span class="chevron">&rsaquo;</span>
          </a>
        </li>
        <li>
          <a href="${basePath}cuenta.html?tab=configuracion" class="user-menu-link">
            <span>Configuración de Cuenta</span>
            <span class="chevron">&rsaquo;</span>
          </a>
        </li>
        <hr class="user-dropdown-divider">
        <li>
          <button type="button" id="logout-btn" class="user-menu-link highlight-link" style="width:100%; border:none; background:none; cursor:pointer; text-align:left;">
            <span>Cerrar Sesión</span>
            <span class="arrow">&rarr;</span>
          </button>
        </li>
      `;

      // Evento para cerrar sesión
      document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('user_session_crochet');
        updateProfileMenuUI();
      });
    }
  } else {
    // ESTADO: INVITADO
    if (userGreetingTitle) userGreetingTitle.textContent = 'Tu espacio personal';
    if (userGreetingSubtitle) userGreetingSubtitle.textContent = 'Todo lo tuyo, en un solo lugar';
  }
}

// Ejecutar revisión de usuario al cargar
updateProfileMenuUI();



// Funcionalidad para el Acordeón de Preguntas Frecuentes (FAQ)
document.addEventListener('DOMContentLoaded', () => {
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');

            // Cierra las demás preguntas para mantener limpio el acordeón (opcional)
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    item.querySelector('.faq-content').style.maxHeight = null;
                }
            });

            // Alterna el estado de la pregunta clickeada
            if (isActive) {
                faqItem.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                faqContent.style.maxHeight = null;
            } else {
                faqItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                // Asigna dinámicamente el scrollHeight para animación fluida
                faqContent.style.maxHeight = faqContent.scrollHeight + "px";
            }
        });
    });
});






// ==========================================
// CONMUTADOR DE PESTAÑAS (LOGIN / REGISTRO)
// ==========================================
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (tabLoginBtn && tabRegisterBtn && loginForm && registerForm) {
  // Clic en pestaña Registrarme
  tabRegisterBtn.addEventListener('click', () => {
    tabLoginBtn.classList.remove('active');
    tabRegisterBtn.classList.add('active');

    loginForm.classList.add('hidden-form');
    registerForm.classList.remove('hidden-form');
  });

  // Clic en pestaña Iniciar sesión
  tabLoginBtn.addEventListener('click', () => {
    tabRegisterBtn.classList.remove('active');
    tabLoginBtn.classList.add('active');

    registerForm.classList.add('hidden-form');
    loginForm.classList.remove('hidden-form');
  });
}


