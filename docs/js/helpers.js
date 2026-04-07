
/**
 * ================================================================================
 * Modal & Helper Functions
 * ================================================================================
 * دوال مساعدة لإدارة modals والعمليات العامة
 * ================================================================================
 */

/**
 * فتح Modal
 */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    modal.style.display = 'flex';
  }
};

/**
 * إغلاق Modal
 */
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
};

/**
 * دالة تحميل صورة وتحويلها إلى Base64
 */
window.readFileAsBase64 = function(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

/**
 * دالة لتحديث عنصر Form بناءً على البيانات
 */
window.setFormValues = function(formData) {
  Object.keys(formData).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = formData[key];
      } else {
        element.value = formData[key] || '';
      }
    }
  });
};

/**
 * دالة لتنظيف Form
 */
window.clearForm = function(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
  
  // مسح ID التحرير
  window.__vioEditingId = null;
  window.__branchEditingId = null;
  window.__empEditingId = null;
  window.__licEditingId = null;
  window.__housEditingId = null;
  window.__transEditingId = null;
};

// تهيئة نموذج الفرع لإضافة جديد
window.newBranchForm = function() {
  try {
    var ids = [
      'br-name','br-type','br-brand','br-email','br-cost','br-ops','br-kpi-target','br-kpi-value',
      'br-region','br-region-other','br-city','br-opening-date','br-close-date','br-notes'
    ];
    ids.forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      } else {
        el.value = '';
      }
    });
    var award = document.getElementById('br-award-star');
    if (award) award.checked = false;
    window.__branchEditingId = null;
  } catch (e) {
    console.warn('newBranchForm failed:', e);
  }
};

/**
 * دالة للتحقق من اتصال API
 */
window.checkAPIConnection = async function() {
  try {
    const isConnected = await APIClient.test();
    if (isConnected) {
      console.log('✓ API Connection OK');
      return true;
    } else {
      console.error('✗ API Connection Failed');
      return false;
    }
  } catch (error) {
    console.error('API Connection Error:', error);
    return false;
  }
};

/**
 * دالة لجلب البيانات من API (Wrapper)
 * تستخدم بواسطة render-api.js
 */
const __helpersPendingRequests = {};
const __helpersApiCacheIntervalMs = 6 * 60 * 60 * 1000;
const __helpersRateLimitedResources = { members: true, violations: true, branches: true };

window.fetchDataFromAPI = async function(resource, options) {
  const opts = options || {};
  const forceRefresh = !!opts.forceRefresh;
  const dataKey = `cache:${resource}:data`;
  const tsKey = `cache:${resource}:ts`;
  const isRateLimited = !!__helpersRateLimitedResources[resource];

  if (!forceRefresh && isRateLimited) {
    try {
      const tsRaw = localStorage.getItem(tsKey);
      const ts = Number(tsRaw || 0);
      const ageMs = Date.now() - ts;
      if (ts > 0 && isFinite(ts) && ageMs < __helpersApiCacheIntervalMs) {
        const cached = localStorage.getItem(dataKey);
        if (cached) return JSON.parse(cached);
      }
    } catch (_) {}
  }

  const pendingKey = `${resource}:${forceRefresh ? 'force' : 'normal'}`;
  if (__helpersPendingRequests[pendingKey]) return __helpersPendingRequests[pendingKey];

  const requestPromise = (async () => {
    try {
      if (window.APIClient && window.APIClient[resource]) {
        const data = await window.APIClient[resource].list();
        try {
          localStorage.setItem(dataKey, JSON.stringify(data));
          localStorage.setItem(tsKey, String(Date.now()));
        } catch (_) {}
        return data;
      }
      console.warn(`Resource ${resource} not found in APIClient`);
      return [];
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      try {
        const cached = localStorage.getItem(dataKey);
        if (cached) return JSON.parse(cached);
      } catch (_) {}
      return [];
    } finally {
      delete __helpersPendingRequests[pendingKey];
    }
  })();

  __helpersPendingRequests[pendingKey] = requestPromise;
  return requestPromise;
};

/**
 * دالة لتهيئة الصفحة عند التحميل
 */
window.initializePage = async function() {
  try {
    // التحقق من اتصال API
    const connected = await checkAPIConnection();
    if (!connected) {
      console.warn('⚠ API is not connected, some features may not work');
      showAPIMessage(false, 'تحذير', 'خادم API غير متاح');
      return;
    }

    console.log('Loading initial data from API...');
    
    // يمكن إضافة تحميل بيانات أولية هنا
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

/**
 * دالة لتشغيل عملية عند تحميل الصفحة
 */
window.addEventListener('load', function() {
  // تهيئة أساسية
  if (typeof initializePage === 'function') {
    initializePage();
  }
});

/**
 * دالة مساعدة للتنسيق
 */
window.formatCurrency = function(value) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(value);
};

window.formatDate = function(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('ar-SA');
};

/**
 * دالة لتحديث العنوان الديناميكي
 */
window.setPageTitle = function(title) {
  document.title = title;
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.textContent = title;
  }
};

console.log('✓ Modal & Helper Functions loaded successfully');
