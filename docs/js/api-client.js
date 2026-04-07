/**
 * ================================================================================
 * API Client - نظام موحد للتواصل مع خادم Laravel
 * ================================================================================
 * هذا الملف يوفر واجهة موحدة للتواصل مع جميع API endpoints بدلاً من localStorage
 * ============================================ ========================================
 */

// Initialize BASE_URL globally if not exists
if (typeof window.BASE_URL === 'undefined') {
  window.BASE_URL = (function() {
    // If served from Laravel (port 8000), always use relative path to avoid CORS
    // Check if port is 8000 OR if hostname ends with 8000 (just in case)
    const hostStr = window.location.host; // includes port if present
    if (hostStr.includes(':8000')) {
      console.log('Running on port 8000, using relative API path');
      return '/api';
    }
    
    // If served from Live Server or file system, point to port 8000 on the same host
    // Unified to use 127.0.0.1 (IPv4) for better compatibility
    if (window.location.hostname === 'localhost') {
        console.log('Using IPv4 127.0.0.1 for API');
        return 'http://127.0.0.1:8000/api';
    }

    const host = window.location.hostname || '127.0.0.1';
    const url = `http://${host}:8000/api`;
    console.log('Running on external port, using absolute API path:', url);
    return url;
  })();
}

// Use window.BASE_URL internally
const getBaseUrl = () => window.BASE_URL;
const getHostBase = () => {
  try {
    const loc = window.location;
    return loc.origin || (loc.protocol + '//' + loc.host);
  } catch (_) {
    return '';
  }
};

function parseJsonFromMixedText(text) {
  const txt = String(text || '');
  if (!txt) return null;
  const starts = [];
  for (let i = 0; i < txt.length; i++) {
    if (txt.charCodeAt(i) === 123) starts.push(i);
  }
  for (let i = starts.length - 1; i >= 0; i--) {
    try {
      const raw = txt.slice(starts[i]).trim();
      if (!raw) continue;
      return JSON.parse(raw);
    } catch (_) {}
  }
  return null;
}

window.APIClient = (function() {
  
  // قائمة الموارد المتاحة
  const resources = {
    'violations': 'violations',
    'branches': 'branches',
    'employees': 'employees',
    'members': 'members',
    'licenses': 'licenses',
    'contracts': 'contracts',
    'housings': 'housings',
    'transports': 'transports',
    'training': 'training',
    'tasks': 'tasks',
    'attachments': 'attachments',
    'users': 'users',
    'roles': 'roles',
    'tickets': 'tickets',
    'inbox': 'inbox'
  };

  /**
   * دالة عامة لإرسال طلبات HTTP
   */
  async function request(method, endpoint, data = null) {
    const url = `${getBaseUrl()}/${endpoint}`;
    const token = localStorage.getItem('api_token') || localStorage.getItem('auth_token');
    const xsrf = (document.cookie || '').split('; ').find(c => c.startsWith('XSRF-TOKEN=')); 
    const xsrfVal = xsrf ? decodeURIComponent(xsrf.split('=')[1]) : null;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(xsrfVal && method !== 'GET' ? { 'X-XSRF-TOKEN': xsrfVal } : {})
      },
      cache: 'no-store', // Prevent caching
      mode: 'cors',
      credentials: 'include'
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      if (typeof FormData !== 'undefined' && data instanceof FormData) {
        delete options.headers['Content-Type'];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    try {
      console.log(`[API] ${method} ${url}`);
      const response = await fetch(url, options);
      
      // Handle empty responses (e.g. 204 No Content)
      if (response.status === 204) {
        return null;
      }

      const contentType = String(response.headers.get('content-type') || '').toLowerCase();
      let json = null;
      if (contentType.includes('application/json')) {
        json = await response.json().catch(() => null);
      } else {
        const txt = await response.text().catch(() => '');
        json = parseJsonFromMixedText(txt);
        if (!json) json = { message: txt || `HTTP ${response.status}` };
      }
      
      if (!response.ok) {
        const errorMessage = (json && typeof json === 'object' && (json.message || json.error))
          ? (json.message || json.error)
          : `HTTP ${response.status}`;
        console.error(`API Error (${response.status}):`, json || errorMessage);
        throw new Error(errorMessage);
      }

      return json;
    } catch (error) {
      console.error(`API Request Failed: ${method} ${url}`, error);
      throw error;
    }
  }

  /**
   * API للموارد (CRUD operations)
   */
  function createResourceAPI(resourceName) {
    return {
      /**
       * جلب جميع السجلات
       */
      async list() {
        return await request('GET', resourceName);
      },

      /**
       * جلب سجل واحد
       */
      async get(id) {
        return await request('GET', `${resourceName}/${id}`);
      },

      /**
       * إنشاء سجل جديد
       */
      async create(data) {
        return await request('POST', resourceName, data);
      },

      /**
       * تحديث سجل موجود
       */
      async update(id, data) {
        return await request('PUT', `${resourceName}/${id}`, data);
      },

      /**
       * حذف سجل
       */
      async delete(id) {
        return await request('DELETE', `${resourceName}/${id}`);
      }
    };
  }

  /**
   * API للعمليات الخاصة
   */
  const specialOps = {
    // عمليات المخالفات
    violations: {
      markPaid: async (id) => {
        return await request('POST', `violations/${id}/paid`);
      },
      archive: async (id) => {
        return await request('POST', `violations/${id}/archive`);
      },
      attach: async (id, fileOrData) => {
        let payload = fileOrData;
        if (typeof FormData !== 'undefined' && typeof File !== 'undefined' && fileOrData instanceof File) {
          const fd = new FormData();
          fd.append('file', fileOrData);
          payload = fd;
        }
        return await request('POST', `violations/${id}/attachments`, payload);
      }
    },

    // عمليات الموظفين
    employees: {
      attach: async (id, fileOrData) => {
        let payload = fileOrData;
        if (typeof FormData !== 'undefined' && typeof File !== 'undefined' && fileOrData instanceof File) {
          const fd = new FormData();
          fd.append('file', fileOrData);
          payload = fd;
        }
        return await request('POST', `employees/${id}/attachments`, payload);
      }
    },

    // عمليات الرخص
    licenses: {
      archive: async (id) => {
        return await request('POST', `licenses/${id}/archive`);
      }
    },

    // عمليات العقود
    contracts: {
      archive: async (id) => {
        return await request('POST', `contracts/${id}/archive`);
      }
    }
  };

  /**
   * واجهة API العامة
   */
  const api = {
    async fetch(urlOrEndpoint, options = {}) {
      const token = localStorage.getItem('api_token') || localStorage.getItem('auth_token');
      const method = String(options.method || 'GET').toUpperCase();
      let url = String(urlOrEndpoint || '').trim();
      if (!url) throw new Error('Missing endpoint');
      if (url.startsWith('http://') || url.startsWith('https://')) {
      } else if (url.startsWith('/api/')) {
        url = `${getHostBase()}${url}`;
      } else if (url.startsWith('/')) {
        url = `${getHostBase()}${url}`;
      } else {
        url = `${getBaseUrl()}/${url}`;
      }
      const headers = Object.assign({
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }, options.headers || {});
      const reqOptions = {
        method,
        headers,
        credentials: 'include',
        cache: 'no-store',
        mode: 'cors'
      };
      if (token && !reqOptions.headers['Authorization']) {
        reqOptions.headers['Authorization'] = `Bearer ${token}`;
      }
      if (options.body != null) {
        if (typeof FormData !== 'undefined' && options.body instanceof FormData) {
          delete reqOptions.headers['Content-Type'];
          reqOptions.body = options.body;
        } else if (typeof options.body === 'string') {
          reqOptions.headers['Content-Type'] = reqOptions.headers['Content-Type'] || 'application/json';
          reqOptions.body = options.body;
        } else {
          reqOptions.headers['Content-Type'] = reqOptions.headers['Content-Type'] || 'application/json';
          reqOptions.body = JSON.stringify(options.body);
        }
      }
      const res = await fetch(url, reqOptions);
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      let payload = null;
      if (ct.includes('application/json')) {
        payload = await res.json().catch(() => null);
      } else {
        const txt = await res.text().catch(() => '');
        payload = parseJsonFromMixedText(txt);
        if (!payload) payload = { message: txt };
      }
      if (!res.ok) {
        const msg = (payload && (payload.message || payload.error)) || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      if (payload && typeof payload === 'object' && ('success' in payload || 'data' in payload)) {
        return Object.assign({ success: true }, payload);
      }
      if (Array.isArray(payload)) {
        return { success: true, data: payload };
      }
      return { success: true, data: payload };
    },
    branchesSpecial: {
      async attach(id, fileOrData, category) {
        let payload = fileOrData;
        if (typeof FormData !== 'undefined') {
          const fd = new FormData();
          if (fileOrData instanceof File) {
            fd.append('file', fileOrData);
          } else if (fileOrData && fileOrData.file) {
            fd.append('file', fileOrData.file);
          }
          if (category) fd.append('category', category);
          payload = fd;
        }
        return await request('POST', `branches/${id}/attachments`, payload);
      }
    },
    auth: {
      async login(identifier, password) {
        const csrfUrl = `${getHostBase()}/sanctum/csrf-cookie`;
        try { await fetch(csrfUrl, { credentials: 'include' }); } catch (_) {}
        const res = await fetch(`${getBaseUrl()}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include',
          body: JSON.stringify({ identifier, password })
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || 'Login failed');
        if (json && json.token) {
          localStorage.setItem('api_token', json.token);
        }
        if (json && json.user) {
          localStorage.setItem('current_user', JSON.stringify(json.user));
        }
        return json;
      },
      async logout() {
        const token = localStorage.getItem('api_token') || localStorage.getItem('auth_token');
        await fetch(`${getBaseUrl()}/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include'
        }).catch(() => {});
        localStorage.removeItem('api_token');
      }
    },
    // إضافة جميع الموارد
    violations: createResourceAPI('violations'),
    branches: createResourceAPI('branches'),
    employees: createResourceAPI('employees'),
    licenses: createResourceAPI('licenses'),
    contracts: createResourceAPI('contracts'),
    housings: createResourceAPI('housings'),
    transports: createResourceAPI('transports'),
    tasks: createResourceAPI('tasks'),
    attachments: createResourceAPI('attachments'),
    users: createResourceAPI('users'),
    roles: createResourceAPI('roles'),
    tickets: createResourceAPI('tickets'),
    inbox: createResourceAPI('inbox'),

    // العمليات الخاصة
    special: specialOps,

    /**
     * دالة مساعدة لجلب جميع البيانات لمورد معين
     * (للتوافق مع الكود الذي يستخدم getAll)
     */
    async getAll(resourceName) {
      if (this[resourceName] && typeof this[resourceName].list === 'function') {
        return await this[resourceName].list();
      }
      throw new Error(`Resource ${resourceName} not found or does not support list()`);
    },

    /**
     * جلب البيانات بأمان (مع معالجة الأخطاء وإرجاع مصفوفة فارغة في حالة الفشل)
     * بديل آمن لـ getAll يستخدم في العرض لتجنب توقف الواجهة
     */
    async fetchData(resourceName) {
      try {
        if (this[resourceName] && typeof this[resourceName].list === 'function') {
          return await this[resourceName].list();
        }
        console.warn(`Resource ${resourceName} not found or does not support list()`);
        return [];
      } catch (error) {
        console.error(`Error fetching ${resourceName}:`, error);
        return [];
      }
    },

    /**
     * دالة مساعدة لاختبار الاتصال
     */
    async test() {
      try {
        const response = await fetch(`${getBaseUrl()}/violations`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        return response.ok;
      } catch (error) {
        console.error('API Connection Test Failed:', error);
        return false;
      }
    }
  };

  return api;
})();

// ============================================================
// دالة مساعدة عامة للتعامل مع toast والتنبيهات
// ============================================================
window.showAPIMessage = function(success, title, message) {
  try {
    if (typeof toast === 'function') {
      toast(success ? 'success' : 'error', title, message);
    } else {
      alert(message);
    }
  } catch (e) {
    alert(message);
  }
};

// ============================================================
// دالة مساعدة لتحويل Promise-based إلى callback-based
// (للتوافقية مع الكود القديم)
// ============================================================
window.wrapAsync = function(asyncFn) {
  return function(...args) {
    return asyncFn(...args)
      .catch(error => {
        console.error('Operation failed:', error);
        showAPIMessage(false, 'خطأ', error.message || 'حدث خطأ أثناء العملية');
      });
  };
};

// تسجيل في window.App إذا كان موجوداً
if (typeof window.App !== 'undefined' && window.App) {
  window.App.api = window.APIClient;
}

console.log('✓ API Client loaded successfully');
