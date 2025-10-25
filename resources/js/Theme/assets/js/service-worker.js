// Service Worker Registration and PWA Installation Handler

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
        
        showServiceWorkerStatus('success');
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
        showServiceWorkerStatus('error');
      });
  });
} else {
  
  console.log('Service Worker is not supported');
  showServiceWorkerStatus('unsupported');
  
  showManualInstallPrompt();
}

function showServiceWorkerStatus(status) {
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const messages = {
      success: '✅ Service Worker فعال شد',
      error: '❌ خطا در فعال‌سازی Service Worker',
      unsupported: '⚠️ مرورگر شما Service Worker پشتیبانی نمی‌کند'
    };
    
    if (messages[status]) {
      console.log(messages[status]);
    }
  }
}

function showManualInstallPrompt() {
  
  setTimeout(() => {
    
    if (window.innerWidth <= 768) {
      const manualBanner = document.createElement('div');
      manualBanner.id = 'manualInstallBanner';
      manualBanner.className = 'fixed bottom-20 left-4 right-4 bg-gradient-to-r from-brand to-brand-2 text-white p-4 rounded-xl shadow-lg z-[9998] transform translate-y-full transition-transform duration-300';
      manualBanner.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 grid place-items-center">
              📱
            </div>
            <div>
              <div class="font-bold text-sm">نصب دستی اپلیکیشن</div>
              <div class="text-xs opacity-90">از منوی مرورگر "Add to Home Screen" را انتخاب کنید</div>
            </div>
          </div>
          <button data-dismiss-install class="w-8 h-8 rounded-lg hover:bg-white/20 grid place-items-center transition-colors">
            ✕
          </button>
        </div>
      `;
      
      document.body.appendChild(manualBanner);
      setTimeout(() => {
        manualBanner.style.transform = 'translateY(0)';
      }, 100);
      
      
      setTimeout(() => {
        dismissManualInstallPrompt();
      }, 8000);
    }
  }, 3000);
}

function dismissManualInstallPrompt() {
  const banner = document.getElementById('manualInstallBanner');
  if (banner) {
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      banner.remove();
    }, 300);
  }
}

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  dismissInstallPrompt();
  dismissManualInstallPrompt();
});
