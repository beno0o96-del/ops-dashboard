/**
 * ================================================================================
 * API Client - نظام موحد للتواصل مع خادم Laravel
 * ================================================================================
 * هذا الملف يوفر واجهة موحدة للتواصل مع جميع API endpoints بدلاً من localStorage
 * ============================================ ========================================
 */

if (!window.ApiRuntime) {
  window.ApiRuntime = (function() {
    function normalizeApiBase(url) {
      return String(url || '').trim().replace(/\/+$/, '');
    }
    function isGitHubPagesHost() {
      try {
        return /github\.io$/i.test(String(window.location.hostname || ''));
      } catch (_) {
        return false;
      }
    }
    function getConfiguredOverrideApiBase() {
      try {
        const fromConfig = normalizeApiBase(window.OD_CONFIG && window.OD_CONFIG.apiBase);
        if (fromConfig) return fromConfig;
      } catch (_) {}
      return normalizeApiBase(window.__API_BASE_OVERRIDE__);
    }
    function isInvalidGitHubPagesApiBase(url) {
      const normalized = normalizeApiBase(url);
      if (!normalized) return true;
      try {
        const parsed = new URL(normalized, window.location.href);
        const host = String(parsed.hostname || '').toLowerCase();
        const path = String(parsed.pathname || '').toLowerCase();
        if (host === 'localhost' || host === '127.0.0.1') return true;
        if (/github\.io$/i.test(host)) return true;
        if (path === '/api' || path.endsWith('/api')) return true;
      } catch (_) {
        return true;
      }
      return false;
    }
    function getStoredApiBase() {
      try {
        const stored = normalizeApiBase(localStorage.getItem('api.base'));
        if (isGitHubPagesHost() && !getConfiguredOverrideApiBase() && isInvalidGitHubPagesApiBase(stored)) {
          localStorage.removeItem('api.base');
          return '';
        }
        return stored;
      } catch (_) {
        return '';
      }
    }
    function computeDefaultApiBase() {
      try {
        const override = getConfiguredOverrideApiBase();
        if (override) return override;
        const host = String(window.location.hostname || '').toLowerCase();
        const hostStr = String(window.location.host || '');
        const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
        if (hostStr.includes(':8000')) return '/api';
        if (window.location.protocol === 'file:') return 'http://127.0.0.1:8000/api';
        if (host === 'localhost' || host === '127.0.0.1') return 'http://127.0.0.1:8000/api';
        if (/github\.io$/i.test(host)) return '';
        if (/^https?:\/\//i.test(origin)) return normalizeApiBase(origin) + '/api';
      } catch (_) {}
      return 'http://127.0.0.1:8000/api';
    }
    function resolveApiBase() {
      const stored = getStoredApiBase();
      if (stored) return stored;
      const override = getConfiguredOverrideApiBase();
      if (override) return override;
      return computeDefaultApiBase();
    }
    function setApiBase(url, persist) {
      const normalized = normalizeApiBase(url);
      try {
        if (persist === false) {
        } else if (normalized) {
          localStorage.setItem('api.base', normalized);
        } else {
          localStorage.removeItem('api.base');
        }
      } catch (_) {}
      window.BASE_URL = normalized;
      return normalized;
    }
    function hasConfiguredApiBase() {
      const stored = getStoredApiBase();
      const override = getConfiguredOverrideApiBase();
      if (isGitHubPagesHost() && !override && isInvalidGitHubPagesApiBase(stored)) return false;
      return !!(stored || override);
    }
    return {
      normalizeApiBase: normalizeApiBase,
      getStoredApiBase: getStoredApiBase,
      computeDefaultApiBase: computeDefaultApiBase,
      resolveApiBase: resolveApiBase,
      setApiBase: setApiBase,
      hasConfiguredApiBase: hasConfiguredApiBase,
      isGitHubPagesHost: isGitHubPagesHost,
      getApiBase: function() {
        const current = normalizeApiBase(window.BASE_URL);
        if (current) return current;
        return setApiBase(resolveApiBase(), false);
      }
    };
  })();
}

if (typeof window.BASE_URL === 'undefined') {
  window.BASE_URL = window.ApiRuntime.getApiBase();
}

const getBaseUrl = () => window.ApiRuntime.getApiBase();
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
    const base = getBaseUrl();
    if (!base) throw new Error('API_NOT_CONFIGURED');
    const url = `${base}/${endpoint}`;
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
      },
      deleteAttachment: async (id, attachmentId) => {
        return await request('DELETE', `violations/${id}/attachments/${attachmentId}`);
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
        const base = getBaseUrl();
        if (!base) throw new Error('API_NOT_CONFIGURED');
        url = `${base}/${url}`;
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
        const msg = (payload && (payload.error || payload.message)) || `HTTP ${res.status}`;
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
    request: request,
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
        const base = getBaseUrl();
        if (!base) throw new Error('API_NOT_CONFIGURED');
        const csrfUrl = `${getHostBase()}/sanctum/csrf-cookie`;
        try { await fetch(csrfUrl, { credentials: 'include' }); } catch (_) {}
        const res = await fetch(`${base}/login`, {
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
        const base = getBaseUrl();
        const token = localStorage.getItem('api_token') || localStorage.getItem('auth_token');
        if (!base) {
          localStorage.removeItem('api_token');
          return;
        }
        await fetch(`${base}/logout`, {
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
        if (!getBaseUrl()) return true;
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
