class ClicklyApp {
  constructor() {
    this.ajaxContent = document.getElementById('ajax-content');
    this.selectedProduct = null;
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.cartItems = [];
    this.deferredPrompt = null;
    this.cache = new Map();
    this.pageHistory = [];
    this.init();
  }

  init() {
    this.loadSavedTheme();
    this.initializeNavigation();
    this.initializeToggleMenus();
    this.bindEvents();
    this.addRippleEffect();
    this.addCarouselScrolling();
    this.createLightbox();
    this.loadPage('home2.html');
  }

  bindEvents() {
    const elements = {
      themeToggle: document.getElementById('themeToggle'),
      hamburgerBtn: document.getElementById('hamburgerBtn'),
      sidebarOverlay: document.getElementById('sidebarOverlay')
    };

    if (elements.themeToggle) elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    if (elements.hamburgerBtn) elements.hamburgerBtn.addEventListener('click', () => this.toggleSidebar());
    if (elements.sidebarOverlay) elements.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    const exitCancel = document.getElementById('exitCancel');
    const exitConfirm = document.getElementById('exitConfirm');
    if (exitCancel) exitCancel.addEventListener('click', () => this.hideExitModal());
    if (exitConfirm) exitConfirm.addEventListener('click', () => this.exitApp());

    document.addEventListener('click', (e) => {
      if (e.target.closest('.header-back-btn')) {
        e.preventDefault();
        this.goBack();
        return;
      }
      
      const dataPageElement = e.target.closest('[data-page]');
      if (dataPageElement && !e.target.closest('.nav-item') && !e.target.closest('.sidebar-link')) {

        const carousel = dataPageElement.closest('.carousel');
        if (carousel && carousel.dataset.preventClick === 'true') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        e.preventDefault();
        const page = dataPageElement.dataset.page;
        if (page) {
          this.loadPage(page);
          this.closeAllSubmenus();
          this.closeSidebar();
        }
      }
      
      const dataModalElement = e.target.closest('[data-modal]');
      if (dataModalElement) {
        e.preventDefault();
        const modalId = dataModalElement.dataset.modal;
        if (modalId) this.openModal(modalId);
      }
      
      const closeModalElement = e.target.closest('[data-close-modal]');
      if (closeModalElement) {
        e.preventDefault();
        const modalId = closeModalElement.dataset.closeModal;
        if (modalId) this.closeModal(modalId);
      }
      
      const switchModalElement = e.target.closest('[data-switch-modal]');
      if (switchModalElement) {
        e.preventDefault();
        const fromModal = switchModalElement.dataset.switchModal;
        const toModal = switchModalElement.dataset.toModal;
        if (fromModal && toModal) this.switchModal(fromModal, toModal);
      }
    });

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => this.handleKeydown(e));
    window.addEventListener('popstate', e => this.handlePopstate(e));
    window.addEventListener('beforeinstallprompt', e => this.handleInstallPrompt(e));
    window.addEventListener('appinstalled', () => this.handleAppInstalled());
    window.addEventListener('load', () => this.handleWindowLoad());
  }

  handleKeydown(e) {
    const blockedKeys = [123, ...(e.ctrlKey && e.shiftKey ? [73, 74] : []), ...(e.ctrlKey ? [85] : [])];
    if (blockedKeys.includes(e.keyCode)) e.preventDefault();
    if (e.keyCode === 27) this.closeSidebar();
    if (e.key === 'Escape') this.closeLightbox();
  }

  handlePopstate(event) {
    console.log('Popstate event fired!', event);

    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      console.log('Closing sidebar');
      this.closeSidebar();
      return;
    }

    console.log('Going back via popstate');
    this.goBack();
  }

  handleInstallPrompt(e) {
    e.preventDefault();
    this.deferredPrompt = e;
    setTimeout(() => {
      const container = document.getElementById('pwa-banner-container');
      if (container) this.showInstallPrompt();
    }, 500);
  }

  handleAppInstalled() {
    this.dismissInstallPrompt();
    this.dismissManualInstallPrompt();
  }

  handleWindowLoad() {
    this.updateFavoritesUI();
    setTimeout(() => this.hidePreloader(), 500);
    setTimeout(() => this.convertPageNumbersToPersian(), 100);
    this.observeContentChanges();
  }

  hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hide');
  }

  showPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.remove('hide');
  }

  async fetchPageContent(page) {
    if (this.cache.has(page)) return this.cache.get(page);

    try {
      const response = await fetch(page);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const content = await response.text();
      this.cache.set(page, content);
      return content;
    } catch (error) {
      console.error('خطا در بارگذاری صفحه:', error);
      return this.getErrorTemplate();
    }
  }

  getErrorTemplate() {
    return `
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center pl-4">
        <div class="text-4xl mb-4">😕</div>
        <h2 class="text-xl font-bold mb-2">خطا در بارگذاری صفحه</h2>
        <p class="text-muted">از اتصال به اینترنت مطمئن شوید و مجددا تلاش کنید.</p>
        <button onclick="app.loadPage('home2.html')" class="mt-4 px-6 py-2 rounded-xl bg-brand text-white font-semibold hover:bg-brand/90 transition-all">تلاش مجدد</button>
      </div>
    `;
  }

  async loadPage(page) {
    this.showPreloader();
    
    try {
      const lastPage = this.pageHistory[this.pageHistory.length - 1];
      if (page !== lastPage) {
        this.pageHistory.push(page);
        if (this.pageHistory.length > 10) {
          this.pageHistory.shift();
        }
        history.pushState({page: page}, '', window.location.href);
      }
      
      const content = await this.fetchPageContent(page);
      this.ajaxContent.style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, 150));
      
      this.ajaxContent.innerHTML = content;
      window.scrollTo(0, 0);
      
      requestAnimationFrame(() => {
        this.ajaxContent.style.opacity = '1';
      });
      
      this.updateHeaderContent(page);
      this.initializeInteractivity();
      this.updateActiveNavigation(page);
      this.addRippleEffect();
      this.addCarouselScrolling();
      this.initializeSecondarySlider();
      
    } catch (error) {
      console.error('خطا در لود صفحه:', error);
      this.ajaxContent.innerHTML = this.getErrorTemplate();
    } finally {
      this.hidePreloader();
    }
  }

  updateHeaderContent(page) {
    const headerContent = document.getElementById('header-content');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (!headerContent) return;
    if (hamburgerBtn) {
      if (page === 'home2.html' || page === 'home.html') {
        hamburgerBtn.style.display = 'flex';
      } else {
        hamburgerBtn.style.display = 'none';
      }
    }

    if (page === 'home2.html' || page === 'home.html') {
      headerContent.innerHTML = `
        <div class="flex items-center gap-3 cursor-pointer" data-page="home2.html">
          <img src="assets/imgs/logo.png" class="w-10 h-10 rounded-md shadow-md grid place-items-center" aria-hidden="true" />
          <div>
            <div class="text-sm text-muted-light dark:text-muted-dark">C l i c k l y</div>
            <div class="text-lg font-extrabold">فروشگاه تو!</div>
          </div>
        </div>
      `;
    } else {
      const firstHeading = this.ajaxContent.querySelector('h1, h2');
      const headingText = firstHeading ? firstHeading.textContent.trim() : 'صفحه';
      
      headerContent.innerHTML = `
        <div class="flex items-center gap-3 py-1">
          <button class="header-back-btn w-10 h-10 rounded-xl bg-white dark:bg-card grid place-items-center hover:bg-gray-50 dark:hover:bg-card/60">
            <span class="text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"/></svg></span>
          </button>
          <h1 class="text-xl md:text-xl font-extrabold">${headingText}</h1>
        </div>
      `;
    }
  }

  goBack() {
    const currentPage = this.pageHistory[this.pageHistory.length - 1];

    if ((currentPage === 'home2.html' || currentPage === 'home.html') && this.pageHistory.length <= 1) {
      this.showExitModal();
      return;
    }
    
    if (this.pageHistory.length <= 1) {
      this.loadPage('home2.html');
      return;
    }

    this.pageHistory.pop();
    const previousPage = this.pageHistory[this.pageHistory.length - 1];
    this.loadPageWithoutHistory(previousPage);
  }

  async loadPageWithoutHistory(page) {
    this.showPreloader();
    
    try {
      const content = await this.fetchPageContent(page);
      this.ajaxContent.style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, 150));
      
      this.ajaxContent.innerHTML = content;
      window.scrollTo(0, 0);
      
      requestAnimationFrame(() => {
        this.ajaxContent.style.opacity = '1';
      });
      
      this.updateHeaderContent(page);
      this.initializeInteractivity();
      this.updateActiveNavigation(page);
      this.addRippleEffect();
      this.addCarouselScrolling();
      this.initializeSecondarySlider();
      
    } catch (error) {
      console.error('خطا در لود صفحه:', error);
      this.ajaxContent.innerHTML = this.getErrorTemplate();
    } finally {
      this.hidePreloader();
    }
  }

  getPreviousPage() {
    if (this.pageHistory.length >= 2) {
      return this.pageHistory[this.pageHistory.length - 2];
    }
    return 'home2.html';
  }

  updateActiveNavigation(page) {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const activeNavItem = document.querySelector(`[data-page="${page}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');
    
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    const activeSidebarLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
    if (activeSidebarLink) activeSidebarLink.classList.add('active');
  }

  initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      newItem.addEventListener('click', this.handleNavClick.bind(this));
    });

    document.querySelectorAll('#sidebar ul li a').forEach(link => {
      link.addEventListener('click', (e) => {
        const page = link.dataset.page;
        if (page) {
          e.preventDefault();
          this.loadPage(page);
        }
        this.closeAllSubmenus();
        this.closeSidebar();
      });
    });
  }

  handleNavClick(e) {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    if (page) {
      this.loadPage(page);
      this.closeSidebar();
    }
  }

  initializeInteractivity() {
    if (this.deferredPrompt && document.getElementById('pwa-banner-container')) {
      this.showInstallPrompt();
    }
    this.updatePostContent();

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', this.handleNavClick.bind(this));
    });


    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = e.currentTarget.dataset.modal;
        if (modalId) this.openModal(modalId);
      });
    });

    document.querySelectorAll('[data-scroll-to]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.dataset.scrollTo;
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({behavior: 'smooth'});
      });
    });

    document.querySelectorAll('[data-lightbox]').forEach(img => {
      img.addEventListener('click', () => this.openLightbox(img.src));
    });

    document.querySelectorAll('[data-switch-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const [fromId, toId] = e.currentTarget.dataset.switchModal.split(',');
        if (fromId && toId) this.switchModal(fromId, toId);
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = e.currentTarget.dataset.closeModal;
        if (modalId) this.closeModal(modalId);
      });
    });

    document.querySelectorAll('[data-filter-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.currentTarget.dataset.filterCategory;
        if (category) this.filterPostsByCategory(category);
      });
    });

    document.querySelectorAll('[data-post-title]').forEach(post => {
      post.addEventListener('click', (e) => {
        const carousel = post.closest('.carousel');
        if (carousel && carousel.dataset.preventClick === 'true') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        e.preventDefault();
        const { postTitle, postImage, postSummary, postCategory } = e.currentTarget.dataset;
        if (postTitle) this.loadPostPage(postTitle, postImage, postSummary, postCategory);
      });
    });

    document.querySelectorAll('[data-dismiss-install]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.dismissManualInstallPrompt();
      });
    });

    document.querySelectorAll('[data-trigger-file-input]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const inputId = e.currentTarget.dataset.triggerFileInput;
        const input = document.getElementById(inputId);
        if (input) input.click();
      });
    });

    document.querySelectorAll('[data-image-upload]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.handleImageUpload(e);
      });
    });

    document.querySelectorAll('[data-select-gender]').forEach(label => {
      label.addEventListener('click', (e) => {
        const gender = e.currentTarget.dataset.selectGender;
        this.selectGender(e.currentTarget, gender);
      });
    });

    this.initializeFavorites();
    this.initializeTabs();
    this.initializeProductOptions();
    this.initializeQuantityControls();
    this.initializePaymentOptions();
    this.initializeModals();
    this.initializeArticleClicks();
    this.initializeBlogItems();
  }

  initializeFavorites() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productName = this.getProductName(btn);
        this.toggleFavorite(productName);
      });
    });
  }

  getProductName(btn) {
    const article = btn.closest('article');
    const h3Element = article?.querySelector('h3');
    
    if (h3Element) return h3Element.textContent;
    
    const postTitle = document.getElementById('post-title');
    return postTitle ? postTitle.textContent : 'پست وبلاگ';
  }

  initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.setActiveTab(tab);
        this.filterProductsByCategory(tab.dataset.category);
      });
    });
  }

  setActiveTab(activeTab) {
    document.querySelectorAll('.tab').forEach(tab => {
      const isActive = tab === activeTab;
      tab.classList.toggle('active', isActive);
      tab.classList.toggle('bg-brand', isActive);
      tab.classList.toggle('text-white', isActive);
      tab.classList.toggle('bg-white', !isActive);
      tab.classList.toggle('dark:bg-card/80', !isActive);
      tab.classList.toggle('text-muted-light', !isActive);
      tab.classList.toggle('dark:text-muted', !isActive);
    });
  }

  filterProductsByCategory(category) {
    const products = document.querySelectorAll('#popular-carousel article');
    products.forEach(product => {
      const shouldShow = category === 'all' || product.dataset.category === category;
      product.style.display = shouldShow ? '' : 'none';
      product.style.opacity = '1';
    });
  }

  initializeProductOptions() {
    const optionTypes = ['size', 'milk', 'brand', 'sendtime', 'pcolor'];
    optionTypes.forEach(type => {
      document.querySelectorAll(`[data-${type}]`).forEach(btn => {
        btn.addEventListener('click', () => this.selectOption(type, btn));
      });
    });
  }

  selectOption(type, selectedBtn) {
    document.querySelectorAll(`[data-${type}]`).forEach(btn => {
      const isSelected = btn === selectedBtn;
      btn.classList.toggle('border-brand', isSelected);
      btn.classList.toggle('bg-brand', isSelected);
      btn.classList.toggle('text-white', isSelected);
      btn.classList.toggle('border-ring-light', !isSelected);
      btn.classList.toggle('dark:border-ring', !isSelected);
      btn.classList.toggle('bg-white', !isSelected);
      btn.classList.toggle('dark:bg-card', !isSelected);
      btn.classList.toggle('text-muted-light', !isSelected);
      btn.classList.toggle('dark:text-muted', !isSelected);
    });
  }

  initializeQuantityControls() {
    // Handle all quantity control groups on the page
    const quantityGroups = document.querySelectorAll('.flex.items-center.bg-white.dark\\:bg-card\\/80.rounded-xl.border.border-ring-light.dark\\:border-ring');
    
    quantityGroups.forEach(group => {
      const minusBtn = group.querySelector('.qty-btn.minus');
      const plusBtn = group.querySelector('.qty-btn.plus');
      const quantityElement = group.querySelector('.quantity');
      
      if (minusBtn && plusBtn && quantityElement) {
        minusBtn.onclick = () => this.updateQuantity(quantityElement, -1);
        plusBtn.onclick = () => this.updateQuantity(quantityElement, 1);
      }
    });
    
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.handleAddToCart());
    }
    
    if (this.selectedProduct && document.getElementById('productName')) {
      this.updateProductDisplay();
    }
  }

  updateQuantity(quantityElement, change) {
    // Check if element exists
    if (!quantityElement) {
      console.error('Quantity element not found');
      return;
    }
    
    // Get current quantity, default to 1 if parsing fails
    const currentQty = parseInt(quantityElement.textContent) || 1;
    const newQty = Math.max(1, currentQty + change);
    quantityElement.textContent = newQty;
  }

  handleAddToCart() {
    const productName = document.getElementById('productName')?.textContent || 'محصول';
    const quantity = parseInt(document.querySelector('.quantity')?.textContent || '1');
    
    for (let i = 0; i < quantity; i++) {
      this.addToCart(productName);
    }
    this.showNotification(`${quantity} عدد ${productName} به سبد اضافه شد`);
  }

  updateProductDisplay() {
    const elements = {
      name: document.getElementById('productName'),
      price: document.getElementById('productPrice'),
      image: document.querySelector('.product-image')
    };

    if (elements.name) elements.name.textContent = this.selectedProduct.name;
    if (elements.price) elements.price.textContent = this.selectedProduct.price;
    if (elements.image && this.selectedProduct.image) {
      elements.image.src = this.selectedProduct.image;
    }
    
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
      this.updateFavoriteButton(favoriteBtn, this.selectedProduct.name);
      favoriteBtn.addEventListener('click', () => this.toggleFavorite(this.selectedProduct.name));
    }
  }

  updateFavoriteButton(btn, productName) {
    const svgElement = btn.querySelector('svg path');
    const isFavorite = this.favorites.includes(productName);
    
    if (svgElement) {
      svgElement.setAttribute('fill', isFavorite ? 'currentColor' : 'none');
      svgElement.setAttribute('stroke', 'currentColor');
    }
    
    btn.classList.toggle('text-red-600', isFavorite);
    btn.classList.toggle('text-red-500', !isFavorite);
    btn.classList.toggle('hover:text-red-600', !isFavorite);
  }

  initializePaymentOptions() {
    document.querySelectorAll('.payment-option').forEach(option => {
      option.addEventListener('click', () => this.selectPaymentOption(option));
    });

    const paymentBtn = document.getElementById('paymentBtn');
    if (paymentBtn) {
      paymentBtn.addEventListener('click', () => this.loadPage('payment.html'));
    }

    const confirmPaymentBtn = document.querySelector('.confirm-payment-btn');
    if (confirmPaymentBtn) {
      confirmPaymentBtn.addEventListener('click', () => this.openModal('successModal'));
    }
  }

  selectPaymentOption(selectedOption) {
    document.querySelectorAll('.payment-option').forEach(option => {
      const isSelected = option === selectedOption;
      option.classList.toggle('active', isSelected);
      option.classList.toggle('bg-gradient-to-r', isSelected);
      option.classList.toggle('from-brand/10', isSelected);
      option.classList.toggle('to-brand-2/10', isSelected);
      option.classList.toggle('border-brand', isSelected);
      option.classList.toggle('bg-white', !isSelected);
      option.classList.toggle('dark:bg-card', !isSelected);
      option.classList.toggle('border-ring-light', !isSelected);
      option.classList.toggle('dark:border-ring', !isSelected);
    });
    selectedOption.querySelector('input').checked = true;
  }

  initializeModals() {
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    if (modalConfirmBtn) {
      modalConfirmBtn.addEventListener('click', () => {
        this.closeModal('successModal');
        this.loadPage('home2.html');
        this.updateActiveNavigation('home2.html');
      });
    }
  }

  initializeArticleClicks() {
    document.querySelectorAll('article').forEach(article => {
      if (article.getAttribute('onclick')?.includes('loadPostPage')) return;
      
      article.addEventListener('click', (e) => {
        const carousel = article.closest('.carousel');
        if (carousel && carousel.dataset.preventClick === 'true') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        if (!e.target.classList.contains('add')) {
          const productData = this.extractProductData(article);
          if (productData.name && productData.price) {
            this.openProductDetail(productData.name, productData.price, productData.image);
          }
        }
      });
    });

    document.querySelectorAll('.add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const carousel = btn.closest('.carousel');
        if (carousel && carousel.dataset.preventClick === 'true') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        e.stopPropagation();
        const itemName = this.extractProductData(btn.closest('article')).name || 'محصول';
        this.addToCart(itemName);
        this.animateButton(btn);
      });
    });
  }

  extractProductData(article) {
    if (!article) return {};
    return {
      name: article.querySelector('h3')?.textContent,
      price: article.querySelector('strong')?.textContent,
      image: article.querySelector('img')?.src
    };
  }

  animateButton(btn) {
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = 'scale(1)', 150);
  }

  initializeBlogItems() {
    document.querySelectorAll('[onclick*="loadPostPage"]').forEach(blogItem => {
      const newBlogItem = blogItem.cloneNode(true);
      blogItem.parentNode.replaceChild(newBlogItem, blogItem);
      
      newBlogItem.addEventListener('click', (e) => {
        e.preventDefault();
        const onclickAttr = newBlogItem.getAttribute('onclick');
        if (onclickAttr) eval(onclickAttr);
      });
    });
  }

  openProductDetail(productName, productPrice, productImage) {
    this.selectedProduct = {
      name: productName,
      price: productPrice,
      image: productImage || 'assets/imgs/p11.webp'
    };
    this.loadPage('product.html');
  }

  toggleFavorite(productName) {
    const index = this.favorites.indexOf(productName);
    const action = index === -1 ? 'add' : 'remove';
    
    if (action === 'add') {
      this.favorites.push(productName);
      this.showNotification(`${productName} به علاقه‌مندی‌ها اضافه شد`);
    } else {
      this.favorites.splice(index, 1);
      this.showNotification(`${productName} از علاقه‌مندی‌ها حذف شد`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.updateFavoritesUI();
  }

  updateFavoritesUI() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      const article = btn.closest('article');
      const h3Element = article?.querySelector('h3');
      if (h3Element) {
        this.updateFavoriteButton(btn, h3Element.textContent);
      }
    });

    this.toggleEmptyFavoritesDisplay();
  }

  toggleEmptyFavoritesDisplay() {
    const emptyFavorites = document.getElementById('emptyFavorites');
    const productsGrid = document.querySelector('.grid');
    
    if (emptyFavorites && productsGrid) {
      const isEmpty = this.favorites.length === 0;
      productsGrid.classList.toggle('hidden', isEmpty);
      emptyFavorites.classList.toggle('hidden', !isEmpty);
      emptyFavorites.classList.toggle('flex', isEmpty);
    }
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebar.classList.contains('open')) {
      this.closeSidebar();
    } else {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('active');
      history.pushState({sidebarOpen: true}, '', window.location.href);
    }
  }

  closeSidebar() {
    const elements = ['sidebar', 'sidebarOverlay'].map(id => document.getElementById(id));
    elements.forEach(el => {
      if (el) el.classList.remove(el.id === 'sidebar' ? 'open' : 'active');
    });
  }

  closeAllSubmenus() {
    document.querySelectorAll('[data-toggle]').forEach(toggleBtn => {
      const targetId = toggleBtn.dataset.toggle;
      const submenu = document.getElementById(targetId);
      const arrow = toggleBtn.querySelector('.toggle-arrow');
      
      if (submenu) {
        submenu.classList.add('hidden');
        submenu.classList.remove('flex');
      }
      if (arrow) {
        arrow.style.transform = 'rotate(0deg)';
      }
    });
  }

  showExitModal() {
    const modal = document.getElementById('exitModal');
    if (modal) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
      const modalContent = modal.querySelector('div > div');
      if (modalContent) {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
      }
    }
  }

  hideExitModal() {
    const modal = document.getElementById('exitModal');
    if (modal) {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100');
      const modalContent = modal.querySelector('div > div');
      if (modalContent) {
        modalContent.classList.add('scale-95');
        modalContent.classList.remove('scale-100');
      }
    }
  }

  exitApp() {
    if (this.isPWA()) {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        window.close();
      }
      if (!window.closed) {
        window.location.href = 'about:blank';
        setTimeout(() => window.close(), 100);
      }
    } else {
      window.close();

      if (!window.closed) {
        window.location.href = 'about:blank';
        setTimeout(() => {
          alert('لطفاً تب مرورگر را به صورت دستی ببندید.');
        }, 100);
      }
    }
  }

  isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
  }

  initializeToggleMenus() {
    document.querySelectorAll('[data-toggle]').forEach(toggleBtn => {
      toggleBtn.addEventListener('click', () => this.handleToggleMenu(toggleBtn));
    });
  }

  handleToggleMenu(toggleBtn) {
    const targetId = toggleBtn.dataset.toggle;
    const submenu = document.getElementById(targetId);
    const arrow = toggleBtn.querySelector('.toggle-arrow');
    
    if (submenu) {
      const isHidden = submenu.classList.contains('hidden');
      submenu.classList.toggle('hidden', !isHidden);
      submenu.classList.toggle('flex', isHidden);
      if (arrow) arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }

  addToCart(itemName) {
    this.cartItems.push(itemName);
    this.updateCartCount();
    this.showNotification(`${itemName} به سبد اضافه شد`);
  }

  updateCartCount() {
    document.querySelectorAll('#cartCount, #cartCount2').forEach(element => {
      if (element) element.textContent = this.cartItems.length;
    });
  }

  showNotification(message) {
    const notification = this.createNotificationElement(message);
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => notification.style.right = '1rem');
    
    setTimeout(() => {
      notification.style.right = '-100%';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  createNotificationElement(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 -right-full z-[1000] bg-brand text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-brand/30 transition-all duration-300 ml-4';
    notification.textContent = message;
    return notification;
  }

  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    html.classList.toggle('dark', !isDark);
    localStorage.theme = isDark ? 'light' : 'dark';
    this.updateThemeButtonIcon(isDark ? 'light' : 'dark');
  }

  updateThemeButtonIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.title = theme === 'light' ? 'حالت شب' : 'حالت روز';
    }
    this.updateThemeMetaTags(theme);
  }

  updateThemeMetaTags(theme) {
    const metaConfig = {
      'theme-color': theme === 'dark' ? '#17171c' : '#ffffff',
      'tile-color': theme === 'dark' ? '#17171c' : '#ffffff',
      'nav-button-color': theme === 'dark' ? '#17171c' : '#ffffff',
      'status-bar-style': theme === 'dark' ? 'black-translucent' : 'default',
      'mobile-status-bar': theme === 'dark' ? 'black-translucent' : 'default'
    };
    
    Object.entries(metaConfig).forEach(([id, content]) => {
      const element = document.getElementById(id);
      if (element) element.setAttribute('content', content);
    });
  }

  loadSavedTheme() {
    const isDark = localStorage.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    this.updateThemeButtonIcon(isDark ? 'dark' : 'light');
  }

  addRippleEffect() {
    const selectors = '.card, .btn, .add, .icon-btn, .nav-item, .tab, .size-btn, .milk-btn';
    document.querySelectorAll(selectors).forEach(el => el.classList.add('ripple'));
  }

  addCarouselScrolling() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      this.setupCarouselInteraction(carousel);
    });
  }

  setupCarouselInteraction(carousel) {
    const state = { 
      isDown: false, 
      startX: 0, 
      scrollLeft: 0, 
      lastX: 0, 
      velocity: 0, 
      rafId: null,
      hasDragged: false,
      dragThreshold: 5
    };
    carousel.style.cursor = 'grab';

    const handlers = {
      start: (x) => {
        Object.assign(state, {
          isDown: true,
          startX: x - carousel.offsetLeft,
          scrollLeft: carousel.scrollLeft,
          lastX: x,
          velocity: 0,
          hasDragged: false
        });
        carousel.style.cursor = 'grabbing';
        cancelAnimationFrame(state.rafId);
      },
      
      move: (x) => {
        if (!state.isDown) return;
        const walk = (x - carousel.offsetLeft - state.startX);

        if (Math.abs(walk) > state.dragThreshold) {
          state.hasDragged = true;
        }
        
        carousel.scrollLeft = state.scrollLeft - walk;
        state.velocity = x - state.lastX;
        state.lastX = x;
      },
      
      end: () => {
        const wasDragging = state.hasDragged;
        state.isDown = false;
        carousel.style.cursor = 'grab';
        this.startMomentum(carousel, state);
        if (wasDragging) {
          carousel.dataset.preventClick = 'true';
          setTimeout(() => {
            delete carousel.dataset.preventClick;
          }, 100);
        }
      }
    };

    carousel.addEventListener('mousedown', e => { e.preventDefault(); handlers.start(e.pageX); });
    carousel.addEventListener('mousemove', e => handlers.move(e.pageX));
    carousel.addEventListener('mouseup', handlers.end);
    carousel.addEventListener('mouseleave', handlers.end);
  }

  startMomentum(carousel, state) {
    if (Math.abs(state.velocity) <= 0.1) return;
    
    let momentum = state.velocity * 0.95;
    const momentumLoop = () => {
      carousel.scrollLeft -= momentum;
      momentum *= 0.95;
      if (Math.abs(momentum) > 0.1) {
        state.rafId = requestAnimationFrame(momentumLoop);
      }
    };
    state.rafId = requestAnimationFrame(momentumLoop);
  }

  loadPostPage(title, image, summary, category) {
    localStorage.setItem('currentPost', JSON.stringify({ title, image, summary, category }));
    this.loadPage('post.html');
  }

  filterPostsByCategory(category) {
    const posts = document.querySelectorAll('[data-category]');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(btn => {
      const isActive = btn.textContent.trim() === category || (category === 'همه' && btn.textContent.trim() === 'همه');
      btn.classList.toggle('active', isActive);
    });
    
    posts.forEach(post => {
      const shouldShow = category === 'همه' || post.getAttribute('data-category') === category;
      post.style.display = shouldShow ? 'block' : 'none';
    });
  }

  updatePostContent() {
    const postData = localStorage.getItem('currentPost');
    if (!postData) return;
    
    const post = JSON.parse(postData);
    const mappings = [
      ['post-title', post.title, 'textContent'],
      ['post-image', post.image, 'src'],
      ['post-summary', post.summary, 'textContent'],
      ['post-category', post.category, 'textContent']
    ];

    mappings.forEach(([id, value, property]) => {
      const element = document.getElementById(id);
      if (element && value) element[property] = value;
    });
  }

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  switchModal(fromId, toId) {
    this.closeModal(fromId);
    setTimeout(() => this.openModal(toId), 100);
  }

  initializeSecondarySlider() {
    const slidesContainer = document.getElementById('main-slider');
    const dotsElement = document.getElementById('dots');
    
    if (!slidesContainer || !dotsElement || slidesContainer.children.length === 0) return;
    
    const slider = new SliderController(slidesContainer, dotsElement);
    slider.initialize();
  }

  createLightbox() {
    if (document.getElementById('lightbox')) return;

    const lightboxHTML = `
      <div id="lightbox" class="lightbox">
        <div class="lightbox-content">
          <button class="lightbox-close" onclick="app.closeLightbox()">×</button>
          <img id="lightbox-image" class="lightbox-image" src="" alt="Product Image" />
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('lightbox');
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) this.closeLightbox();
    });
  }

  openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  showInstallPrompt() {
    const existingBanner = document.getElementById('installBanner');
    if (existingBanner) existingBanner.remove();

    const pwaBannerContainer = document.getElementById('pwa-banner-container');
    if (pwaBannerContainer) {
      this.showInlineInstallPrompt(pwaBannerContainer);
    } else {
      this.showFixedInstallPrompt();
    }
  }

  showInlineInstallPrompt(container) {
    const installBanner = this.createInstallBanner(false);
    container.appendChild(installBanner);
    setTimeout(() => {
      installBanner.style.transform = 'scale(1)';
      installBanner.style.opacity = '1';
    }, 100);
  }

  showFixedInstallPrompt() {
    const installBanner = this.createInstallBanner(true);
    document.body.appendChild(installBanner);
    setTimeout(() => installBanner.style.transform = 'translateY(0)', 100);
  }

  createInstallBanner(isFixed) {
    const installBanner = document.createElement('div');
    installBanner.id = 'installBanner';
    
    if (isFixed) {
      installBanner.className = 'fixed top-0 left-0 right-0 bg-gradient-to-r from-brand to-brand-2 text-white p-4 z-[9998] shadow-lg transform -translate-y-full transition-transform duration-300';
      installBanner.innerHTML = this.getFixedInstallHTML();
    } else {
      installBanner.className = 'bg-gradient-to-r from-brand-2 to-brand text-white p-4 rounded-xl shadow-md transform scale-95 transition-all duration-300 opacity-0';
      installBanner.innerHTML = this.getInlineInstallHTML();
    }
    
    return installBanner;
  }

  getFixedInstallHTML() {
    return `
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/20 grid place-items-center">📱</div>
          <div>
            <div class="font-bold text-sm">نصب اپلیکیشن</div>
            <div class="text-xs opacity-90">کلیکلی را روی دستگاه خود نصب کنید</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="app.installApp()" class="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">نصب</button>
          <button onclick="app.dismissInstallPrompt()" class="w-8 h-8 rounded-lg hover:bg-white/20 grid place-items-center transition-colors">✕</button>
        </div>
      </div>
    `;
  }

  getInlineInstallHTML() {
    return `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div>
            <div class="font-bold text-base">نصب اپلیکیشن</div>
            <div class="text-sm opacity-90">دسترسی سریع‌تر و بهتر</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="app.installApp()" class="bg-brand/40 hover:bg-brand/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors">نصب</button>
          <button onclick="app.dismissInstallPrompt()" class="w-8 h-8 rounded-lg hover:bg-brand-2/20 grid place-items-center transition-colors text-brand">✕</button>
        </div>
      </div>
    `;
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        this.deferredPrompt = null;
        this.dismissInstallPrompt();
      });
    }
  }

  dismissInstallPrompt() {
    const banner = document.getElementById('installBanner');
    if (banner) {
      if (banner.classList.contains('fixed')) {
        banner.style.transform = 'translateY(-100%)';
      } else {
        banner.style.transform = 'scale(0.8)';
        banner.style.opacity = '0';
      }
      setTimeout(() => banner.remove(), 300);
    }
  }

  showManualInstallPrompt() {
    setTimeout(() => {
      if (window.innerWidth <= 768) {
        const manualBanner = this.createManualInstallBanner();
        document.body.appendChild(manualBanner);
        setTimeout(() => manualBanner.style.transform = 'translateY(0)', 100);
        setTimeout(() => this.dismissManualInstallPrompt(), 8000);
      }
    }, 3000);
  }

  createManualInstallBanner() {
    const manualBanner = document.createElement('div');
    manualBanner.id = 'manualInstallBanner';
    manualBanner.className = 'fixed bottom-20 left-4 right-4 bg-gradient-to-r from-brand to-brand-2 text-white p-4 rounded-xl shadow-lg z-[9998] transform translate-y-full transition-transform duration-300';
    manualBanner.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/20 grid place-items-center">📱</div>
          <div>
            <div class="font-bold text-sm">نصب دستی اپلیکیشن</div>
            <div class="text-xs opacity-90">از منوی مرورگر "Add to Home Screen" را انتخاب کنید</div>
          </div>
        </div>
        <button onclick="app.dismissManualInstallPrompt()" class="w-8 h-8 rounded-lg hover:bg-white/20 grid place-items-center transition-colors">✕</button>
      </div>
    `;
    return manualBanner;
  }

  dismissManualInstallPrompt() {
    const banner = document.getElementById('pwa-banner-container');
    if (banner) {
      banner.style.display = 'none';
      localStorage.setItem('pwaPromptDismissed', 'true');
    }
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
          profileImage.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  selectGender(selectedLabel, gender) {
    document.querySelectorAll('[data-select-gender]').forEach(label => {
      const isSelected = label === selectedLabel;
      const input = label.querySelector('input[type="radio"]');
      
      if (input) input.checked = isSelected;
      
      label.classList.toggle('bg-brand/10', isSelected);
      label.classList.toggle('border-brand', isSelected);
      label.classList.toggle('text-brand', isSelected);
      label.classList.toggle('border-gray-200', !isSelected);
      label.classList.toggle('dark:border-ring', !isSelected);
    });
  }

  convertToPersianNumbers(str) {
    if (!str) return '';
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/[0-9]/g, w => persianNumbers[+w]);
  }

  convertPageNumbersToPersian() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const nodeList = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
      if (currentNode.nodeType === 3 && /\d/.test(currentNode.nodeValue)) {
        nodeList.push(currentNode);
      }
    }

    nodeList.forEach(node => {
      node.nodeValue = this.convertToPersianNumbers(node.nodeValue);
    });

    document.querySelectorAll('input, textarea').forEach(el => {
      if (el.value) el.value = this.convertToPersianNumbers(el.value);
      if (el.placeholder) el.placeholder = this.convertToPersianNumbers(el.placeholder);
    });
  }

  observeContentChanges() {
    const observer = new MutationObserver(() => this.convertPageNumbersToPersian());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}

class SliderController {
  constructor(container, dotsElement) {
    this.container = container;
    this.dotsElement = dotsElement;
    this.totalSlides = container.children.length;
    this.dots = Array.from(dotsElement.children);
    this.currentIndex = 0;
    this.intervalTime = 3000;
    this.slideInterval = null;
  }

  initialize() {
    this.setupDotNavigation();
    this.setupDragControls();
    this.showSlide(this.currentIndex);
    this.startInterval();
  }

  showSlide(index) {
    this.container.style.transform = `translateX(-${index * 100}%)`;
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('bg-white', i === index);
      dot.classList.toggle('bg-white/70', i !== index);
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.showSlide(this.currentIndex);
  }

  setupDotNavigation() {
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        this.currentIndex = idx;
        this.showSlide(this.currentIndex);
        this.resetInterval();
      });
    });
  }

  setupDragControls() {
    const dragState = { startX: 0, isDragging: false, moved: 0 };

    const dragStart = (x) => {
      Object.assign(dragState, { startX: x, isDragging: true, moved: 0 });
      this.container.style.transition = 'none';
      clearInterval(this.slideInterval);
    };

    const dragMove = (x) => {
      if (!dragState.isDragging) return;
      dragState.moved = x - dragState.startX;
      const translateX = -this.currentIndex * 100 + (dragState.moved / this.container.clientWidth * 100);
      this.container.style.transform = `translateX(${translateX}%)`;
    };

    const dragEnd = () => {
      if (!dragState.isDragging) return;
      dragState.isDragging = false;
      this.container.style.transition = 'transform 0.6s ease-in-out';
      
      if (dragState.moved > 50) {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
      } else if (dragState.moved < -50) {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
      }
      
      this.showSlide(this.currentIndex);
      this.startInterval();
    };

    this.container.addEventListener('touchstart', e => dragStart(e.touches[0].clientX));
    this.container.addEventListener('touchmove', e => dragMove(e.touches[0].clientX));
    this.container.addEventListener('touchend', dragEnd);
    this.container.addEventListener('mousedown', e => dragStart(e.clientX));
    this.container.addEventListener('mousemove', e => dragMove(e.clientX));
    this.container.addEventListener('mouseup', dragEnd);
    this.container.addEventListener('mouseleave', dragEnd);
  }

  startInterval() {
    this.slideInterval = setInterval(() => this.nextSlide(), this.intervalTime);
  }

  resetInterval() {
    clearInterval(this.slideInterval);
    this.startInterval();
  }
}

function loadPostPage(title, image, summary, category) {
  app.loadPostPage(title, image, summary, category);
}

function filterPostsByCategory(category) {
  app.filterPostsByCategory(category);
}

function openModal(id) {
  app.openModal(id);
}

function closeModal(id) {
  app.closeModal(id);
}

function switchModal(fromId, toId) {
  app.switchModal(fromId, toId);
}

function openLightbox(imageSrc) {
  app.openLightbox(imageSrc);
}

const app = new ClicklyApp();
