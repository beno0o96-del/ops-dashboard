(function () {
  var dict = {
    ar: {
      'nav.home': 'الرئيسية',
      'nav.employees': 'الموظفون',
      'nav.branches': 'الفروع',
      'nav.licenses': 'الرخص والعقود',
      'nav.violations': 'المخالفات',
      'nav.housings': 'السكنات',
      'nav.transports': 'المواصلات',
      'nav.reports': 'التقارير',
      'nav.login': 'تسجيل الدخول',
      'controls.help': 'مساعدة',
      'controls.lang': 'English',
      'index.title': 'لوحة القيادة',
      'index.card.expiries': 'قرب انتهاء التواريخ',
      'index.card.violations': 'أحدث مخالفات',
      'index.card.attachments': 'نشاط المرفقات',
      'employees.title': 'الموظفون',
      'branches.title': 'الفروع',
      'licenses.title': 'الرخص والعقود',
      'violations.title': 'المخالفات',
      'housings.title': 'السكنات',
      'transports.title': 'المواصلات',
      'reports.title': 'التقارير',
      'login.title': 'تسجيل دخول الموظفين',
      'login.subtitle': 'Olayan Employees Login',
      'login.empId.label': 'رقم الموظف',
      'login.empId.placeholder': 'أدخل رقم الموظف',
      'login.pass.label': 'كلمة المرور',
      'login.submit': 'دخول',
      'guide.title': 'جولة تعريفية',
      'guide.next': 'التالي',
      'guide.skip': 'تخطي',
      'guide.done': 'تم',
      'guide.index.1': 'هذه لوحة القيادة تعرض أهم المؤشرات بسرعة.',
      'guide.index.2': 'من الشريط العلوي يمكنك التنقل بين الوحدات.',
      'guide.index.3': 'اضغط على الموظفون لإدارة السجلات والمرفقات.',
      'guide.employees.1': 'هنا قائمة الموظفين مع بحث وفرز.',
      'guide.employees.2': 'زر إضافة لإنشاء موظف جديد.',
      'guide.employees.3': 'من عرض يمكنك فتح بروفايل الموظف.',
      'guide.branches.1': 'إنشاء الفروع وربط الموظفين بها.',
      'guide.licenses.1': 'إدارة الرخص والعقود مع التواريخ والأرشفة.',
      'guide.violations.1': 'سجل المخالفات وحالة السداد.',
      'guide.housings.1': 'إدارة السكنات وربط الموظفين.',
      'guide.transports.1': 'إدارة وسائل النقل وربطها.',
      'guide.reports.1': 'تصدير تقارير PDF وExcel.',
      'guide.admin.1': 'هذه لوحة الإدارة لعرض ملخصات النظام والتحكم المتقدم.',
      'guide.admin.2': 'استخدم شريط أوامر الذكاء الاصطناعي للوصول السريع للأقسام.',
      'guide.login.1': 'أدخل رقم الموظف وكلمة المرور.',
      'guide.login.2': 'استخدم زر العين لإظهار/إخفاء كلمة المرور.',
      'assignee.search': 'ابحث بالاسم أو SAP أو الهوية'
    },
    en: {
      'nav.home': 'Home',
      'nav.employees': 'Employees',
      'nav.branches': 'Branches',
      'nav.licenses': 'Licenses & Contracts',
      'nav.violations': 'Violations',
      'nav.housings': 'Housings',
      'nav.transports': 'Transports',
      'nav.reports': 'Reports',
      'nav.login': 'Login',
      'controls.help': 'Help',
      'controls.lang': 'العربية',
      'index.title': 'Dashboard',
      'index.card.expiries': 'Upcoming Expiries',
      'index.card.violations': 'Recent Violations',
      'index.card.attachments': 'Attachment Activity',
      'employees.title': 'Employees',
      'branches.title': 'Branches',
      'licenses.title': 'Licenses & Contracts',
      'violations.title': 'Violations',
      'housings.title': 'Housings',
      'transports.title': 'Transports',
      'reports.title': 'Reports',
      'login.title': 'Employees Login',
      'login.subtitle': 'Olayan Employees Login',
      'login.empId.label': 'Employee ID',
      'login.empId.placeholder': 'Enter employee ID',
      'login.pass.label': 'Password',
      'login.submit': 'Sign in',
      'guide.title': 'Intro Tour',
      'guide.next': 'Next',
      'guide.skip': 'Skip',
      'guide.done': 'Done',
      'guide.index.1': 'This dashboard shows key indicators quickly.',
      'guide.index.2': 'Use top navigation to switch modules.',
      'guide.index.3': 'Open Employees to manage records and attachments.',
      'guide.employees.1': 'Employees list with search and sorting.',
      'guide.employees.2': 'Use Add to create a new employee.',
      'guide.employees.3': 'Open profile from View.',
      'guide.branches.1': 'Create branches and link employees.',
      'guide.licenses.1': 'Manage licenses and contracts with dates and archive.',
      'guide.violations.1': 'Track violations and payment status.',
      'guide.housings.1': 'Manage housings and assignments.',
      'guide.transports.1': 'Manage transport assets and assignments.',
      'guide.reports.1': 'Export PDF and Excel reports.',
      'guide.admin.1': 'This admin panel shows system summaries and advanced controls.',
      'guide.admin.2': 'Use the AI command bar for quick navigation to key modules.',
      'guide.login.1': 'Enter ID and password.',
      'guide.login.2': 'Use the eye to show/hide password.',
      'assignee.search': 'Search by name or SAP or ID'
    }
  };
  dict.ar['login.tagline'] = 'لا تنتظر الفرصة، بل اصنعها';
  dict.en['login.tagline'] = 'Don’t wait for opportunity, create it';
  dict.ar['login.forgot'] = 'نسيت كلمة المرور؟';
  dict.en['login.forgot'] = 'Forgot password?';
  dict.ar['login.remember'] = 'تذكرني';
  dict.en['login.remember'] = 'Remember me';
  dict.ar['footer.copyright'] = 'جميع الحقوق محفوظة لدى مجموعة العليان للخدمات اللوجستية 2026 ©';
  dict.en['footer.copyright'] = 'All rights reserved to Olayan Logistics Group 2026';
  dict.ar['footer.developed_by'] = 'Developed by Bandar A , Abdullwahab';
  dict.en['footer.developed_by'] = 'Developed by Bandar A , Abdullwahab';
  dict.ar['search.placeholder'] = 'بحث في السجل...';
  dict.en['search.placeholder'] = 'Search logs...';
  dict.ar['table.total'] = 'إجمالي:';
  dict.en['table.total'] = 'Total:';
  dict.ar['pagination.page'] = 'صفحة';
  dict.en['pagination.page'] = 'Page';
  dict.ar['pagination.of'] = 'من';
  dict.en['pagination.of'] = 'of';
  dict.ar['no.records'] = 'لا توجد سجلات';
  dict.en['no.records'] = 'No records';
  dict.ar['ai.placeholder'] = 'اكتب: أظهر المخالفات، تحليل، فروع الرياض';
  dict.en['ai.placeholder'] = 'Type: Show violations, analysis, Riyadh branches';
  function getLang() {
    var s = localStorage.getItem('lang');
    return s || 'ar';
  }
  function isAuth() {
    return sessionStorage.getItem('auth') === '1' || localStorage.getItem('auth') === '1';
  }
  function requireAuth(page) {
    if (page !== 'login' && page !== 'index' && !isAuth()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
  function login(persist) {
    if (persist) localStorage.setItem('auth', '1');
    else sessionStorage.setItem('auth', '1');
  }
  function logout() {
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    window.location.href = 'login.html';
  }
  function setLang(l) {
    localStorage.setItem('lang', l);
    document.documentElement.lang = l === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    applyTexts();
    try { document.dispatchEvent(new CustomEvent('app:lang', { detail: { lang: l } })); } catch(e){}
  }
  function setUser(name) {
    localStorage.setItem('user_name', name || '');
  }
  function getUser() {
    return localStorage.getItem('user_name') || '';
  }
  function setBgEnabled(b) {
    localStorage.setItem('bg_enabled', b ? '1' : '0');
    var c = document.getElementById('bg-canvas');
    if (c) c.style.display = b ? 'block' : 'none';
  }
  function getBgEnabled() {
    return localStorage.getItem('bg_enabled') === '1';
  }
  function t(key) {
    var l = getLang();
    return (dict[l] && dict[l][key]) || key;
  }
  function setNodeText(n, text) {
    if (!n) return;
    if (n.childElementCount === 0) {
      n.textContent = text;
      return;
    }
    var nodes = Array.prototype.slice.call(n.childNodes || []);
    var updated = false;
    for (var i = 0; i < nodes.length; i++) {
      var c = nodes[i];
      if (c && c.nodeType === 3) {
        c.nodeValue = text;
        updated = true;
        break;
      }
    }
    if (!updated) {
      if (n.firstChild) n.insertBefore(document.createTextNode(text), n.firstChild);
      else n.appendChild(document.createTextNode(text));
    }
  }
  function applyTexts() {
    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      n.textContent = t(k);
    });
    var phNodes = document.querySelectorAll('[data-i18n-ph]');
    phNodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n-ph');
      n.setAttribute('placeholder', t(k));
    });
    var dsNodes = document.querySelectorAll('[data-en],[data-ar]');
    var lang = getLang();
    dsNodes.forEach(function (n) {
      var text = n.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
      if (text) setNodeText(n, text);
    });
    var biNodes = document.querySelectorAll('[data-bi="1"]');
    biNodes.forEach(function(n){
      var ar = n.getAttribute('data-ar') || '';
      var en = n.getAttribute('data-en') || '';
      var s = lang === 'ar' ? (ar + (en ? ' (' + en + ')' : '')) : (en + (ar ? ' (' + ar + ')' : ''));
      if (s) setNodeText(n, s);
    });
  }
  var __phrases = [
    { en: "Excellence in Service", ar: "التميز في الخدمة" },
    { en: "Leading with Innovation", ar: "الريادة بالابتكار" },
    { en: "Passion for Perfection", ar: "شغف الإتقان" },
    { en: "Together We Succeed", ar: "معاً ننجح" },
    { en: "Building the Future", ar: "نبني المستقبل" },
    { en: "Quality First", ar: "الجودة أولاً" },
    { en: "Dedication to Excellence", ar: "التفاني في التميز" },
    { en: "Inspiring Success", ar: "نلهم النجاح" },
    { en: "Commitment to Growth", ar: "الالتزام بالنمو" }
  ];
  function getAdminQuotes() {
    try {
      var s = localStorage.getItem('admin_quotes');
      var arr = s ? JSON.parse(s) : null;
      if (Array.isArray(arr) && arr.length) return arr;
    } catch(e){}
    return __phrases;
  }
  function updatePhraseGenerator() {
    var el = document.getElementById('phrase-generator');
    if (!el) return;
    var span = el.querySelector('span:last-child');
    if (!span) return;
    var list = getAdminQuotes();
    var q = list[Math.floor(Math.random() * list.length)];
    span.setAttribute('data-en', q.en);
    span.setAttribute('data-ar', q.ar);
    span.textContent = getLang()==='ar' ? q.ar : q.en;
    try { localStorage.setItem('admin_quote_current', JSON.stringify(q)); } catch(e){}
  }
  function applyGlobalQuote() {
    var q;
    try { q = JSON.parse(localStorage.getItem('admin_quote_current') || 'null'); } catch(e){ q = null; }
    var list = getAdminQuotes();
    if (!q) q = list[0] || list[Math.floor(Math.random() * list.length)];
    var lang = getLang();
    var text = lang === 'ar' ? (q.ar || '') : (q.en || '');
    var dn = document.querySelectorAll('.division-note');
    dn.forEach(function(n){
      n.textContent = text;
      n.setAttribute('data-en', q.en || '');
      n.setAttribute('data-ar', q.ar || '');
    });
    var tag = document.querySelectorAll('[data-i18n="login.tagline"]');
    tag.forEach(function(n){ n.textContent = text; });
  }
  function guideShown(page) { return true; }
  function setGuideShown(page) {}
  function buildGuide(page) { /* removed */ }
  function init(page) {
    if (!requireAuth(page)) return;
    applyTexts();
    updatePhraseGenerator();
    setInterval(updatePhraseGenerator, 8000);
    applyGlobalQuote();
    setInterval(applyGlobalQuote, 10000);
    try {
      var existingOwner = getOwner();
      var currentUser = getUser();
      if (!existingOwner && currentUser) setOwner(currentUser);
    } catch(e){}
    try {
      var ab = localStorage.getItem('api.base');
      var en = localStorage.getItem('api.enabled');
      if (ab) setApiBase(ab);
      else if (en === '1') setApiBase('http://localhost:9000/api');
    } catch(_){ }
    var shouldProbe = !!localStorage.getItem('api.base') || localStorage.getItem('api.enabled') === '1';
    if (shouldProbe) probeApi(1000);
    if (!isAuth() && page === 'index') {
      var logoutBtns = document.querySelectorAll('.logout-btn');
      logoutBtns.forEach(function(b){ b.style.display = 'none'; });
      var userSlot = document.querySelector('.user-slot');
      if (userSlot) userSlot.style.display = 'none';
      var badge = document.getElementById('user-badge');
      if (badge) badge.style.display = 'none';
      var userMenu = document.getElementById('user-menu');
      if (userMenu) userMenu.style.display = 'none';
      var aiBar = document.querySelector('.ai-bar');
      if (aiBar) aiBar.style.display = 'none';
      var helpBtn = document.getElementById('help-toggle');
      if (helpBtn) helpBtn.style.display = 'none';
      var links = document.querySelectorAll('.top-links a.nav-link');
      links.forEach(function(a){
        var href = a.getAttribute('href') || '';
        var isHome = href.indexOf('index.html') >= 0;
        var isLogin = href.indexOf('login.html') >= 0;
        if (!(isHome || isLogin)) a.style.display = 'none';
        else a.style.display = '';
      });
    }
    var badge = document.getElementById('user-badge');
    var badgeName = document.getElementById('user-badge-name');
    var menu = document.getElementById('user-menu');
    if (badge && badgeName) {
      badgeName.textContent = getUser() || (getLang()==='ar'?'المستخدم':'User');
      badge.onclick = function () {
        if (menu) menu.classList.toggle('open');
      };
      document.addEventListener('click', function (e) {
        if (menu && !badge.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('open');
        }
      });
    }
    var canvas = document.getElementById('bg-canvas');
    if (canvas && getBgEnabled()) {
      var ctx = canvas.getContext('2d');
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();
      var stars = Array.from({ length: 140 }, function () {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.1 + 0.3,
          s: Math.random() * 0.01 + 0.004,
          a: Math.random() * Math.PI
        };
      });
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(148,163,184,0.35)';
        stars.forEach(function (star) {
          star.a += star.s;
          var glow = 0.5 + Math.sin(star.a) * 0.5;
          ctx.globalAlpha = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = 'rgba(148,163,184,0.35)';
        for (var i = 0; i < stars.length; i++) {
          for (var j = i + 1; j < stars.length; j++) {
            var dx = stars[i].x - stars[j].x;
            var dy = stars[i].y - stars[j].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              var alpha = 0.25 * (1 - dist / 120);
              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
      }
      draw();
    } else if (canvas) {
      canvas.style.display = 'none';
    }
    var langBtn = document.getElementById('lang-toggle');
    var helpBtn = document.getElementById('help-toggle');
    if (langBtn) {
      langBtn.textContent = t('controls.lang');
      langBtn.onclick = function () {
        var curr = getLang();
        setLang(curr === 'ar' ? 'en' : 'ar');
        langBtn.textContent = t('controls.lang');
      };
    }
    if (helpBtn) {
      // hide help button completely
      helpBtn.style.display = 'none';
      helpBtn.onclick = null;
    }
  }
  function readColl(c) {
    var s = localStorage.getItem('db:' + c);
    try { return s ? JSON.parse(s) : []; } catch (e) { return []; }
  }
  function writeColl(c, rows) {
    localStorage.setItem('db:' + c, JSON.stringify(rows || []));
  }
  function uid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }
  function exportCSVRows(rows) {
    if (!rows || !rows.length) return '';
    var headers = Object.keys(rows.reduce(function (acc, r) {
      Object.keys(r).forEach(function (k) { acc[k] = true; });
      return acc;
    }, {}));
    var esc = function (v) {
      var s = v == null ? '' : String(v);
      s = s.replace(/"/g, '""');
      return '"' + s + '"';
    };
    var out = [headers.join(',')];
    rows.forEach(function (r) {
      out.push(headers.map(function (h) { return esc(r[h]); }).join(','));
    });
    return out.join('\n');
  }
  var Store = {
    create: function (c, data) {
      var rows = readColl(c);
      var now = Date.now();
      var rec = Object.assign({ id: uid(), archived: false, version: 1, createdAt: now, updatedAt: now }, data || {});
      rows.push(rec);
      writeColl(c, rows);
      return rec;
    },
    update: function (c, id, patch) {
      var rows = readColl(c);
      var idx = rows.findIndex(function (r) { return r.id === id; });
      if (idx === -1) return null;
      var now = Date.now();
      var rec = Object.assign({}, rows[idx], patch || {});
      rec.version = (rows[idx].version || 1) + 1;
      rec.updatedAt = now;
      rows[idx] = rec;
      writeColl(c, rows);
      return rec;
    },
    remove: function (c, id) {
      var rows = readColl(c).filter(function (r) { return r.id !== id; });
      writeColl(c, rows);
    },
    get: function (c, id) {
      return readColl(c).find(function (r) { return r.id === id; }) || null;
    },
    list: function (c, opts) {
      var rows = readColl(c);
      if (opts && typeof opts.archived === 'boolean') rows = rows.filter(function (r) { return r.archived === opts.archived; });
      return rows;
    },
    archive: function (c, id) {
      return Store.update(c, id, { archived: true });
    },
    restore: function (c, id) {
      return Store.update(c, id, { archived: false });
    },
    exportJSON: function (c) {
      return JSON.stringify(readColl(c));
    },
    exportCSV: function (c) {
      return exportCSVRows(readColl(c));
    },
    importJSON: function (c, json) {
      var arr;
      try { arr = JSON.parse(json || '[]'); } catch (e) { arr = []; }
      if (!Array.isArray(arr)) arr = [];
      writeColl(c, arr);
      return arr.length;
    }
  };
  window.logActivity = function(action, details, count){
    try {
      var logs = JSON.parse(localStorage.getItem('activity_log') || '[]');
      var base = { timestamp: new Date().toLocaleString(), user: (App.getUser && App.getUser()) || 'User', action: action, details: details, ip: '192.168.1.X' };
      var n = parseInt(count||1,10); if (isNaN(n) || n<1) n = 1;
      for (var i=0;i<n;i++){ logs.push(base); }
      localStorage.setItem('activity_log', JSON.stringify(logs));
    } catch(_){}
  };
  function bindForm(form, options) {
    var f = typeof form === 'string' ? document.getElementById(form) : form;
    if (!f || !options || !options.collection) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      var fields = f.querySelectorAll('input[name],select[name],textarea[name]');
      fields.forEach(function (el) {
        var n = el.getAttribute('name');
        var v = el.type === 'checkbox' ? el.checked : el.value;
        data[n] = v;
      });
      if (options.map && typeof options.map === 'function') data = options.map(data) || data;
      if (options.validate && typeof options.validate === 'function') {
        var ok = options.validate(data);
        if (ok === false) return;
      }
      var done = function (rec) {
        if (options.onSaved && typeof options.onSaved === 'function') options.onSaved(rec);
        if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        f.reset();
      };
      if (options.api && window.App && window.App.api && options.api.group && options.api.action) {
        var g = window.App.api[options.api.group];
        var fn = g && g[options.api.action];
        if (typeof fn === 'function') {
          fn(data).then(function (resp) {
            var rec = Store.create(options.collection, Object.assign({}, data, { apiId: resp && resp.id }));
            done(rec);
          }).catch(function () {
            var rec = Store.create(options.collection, data);
            done(rec);
          });
          return;
        }
      }
      var rec2 = Store.create(options.collection, data);
      done(rec2);
    });
  }
  var apiBase = '/api';
  function setApiBase(b) { apiBase = b || '/api'; }
  function req(method, path, body) {
    var opts = { method: method, headers: {} };
    if (body && !(body instanceof FormData)) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      opts.body = body;
    }
    return fetch(apiBase + path, opts).then(function (r) {
      if (!r.ok) return Promise.reject(r);
      return r.text().then(function(txt){
        if (!txt) return {};
        try { return JSON.parse(txt); } catch (_){ return {}; }
      });
    });
  }
  var Api = {
    setBase: setApiBase,
    employees: {
      list: function () { return req('GET', '/employees'); },
      create: function (d) { return req('POST', '/employees', d); },
      update: function (id, d) { return req('PUT', '/employees/' + id, d); },
      remove: function (id) { return req('DELETE', '/employees/' + id); },
      profile: function (id) { return req('GET', '/employees/' + id); },
      attach: function (id, file, meta) {
        var fd = new FormData();
        fd.append('file', file);
        Object.keys(meta || {}).forEach(function (k) { fd.append(k, meta[k]); });
        return req('POST', '/employees/' + id + '/attachments', fd);
      }
    },
    branches: {
      list: function () { return req('GET', '/branches'); },
      create: function (d) { return req('POST', '/branches', d); },
      update: function (id, d) { return req('PUT', '/branches/' + id, d); },
      remove: function (id) { return req('DELETE', '/branches/' + id); }
    },
    licenses: {
      list: function () { return req('GET', '/licenses'); },
      create: function (d) { return req('POST', '/licenses', d); },
      update: function (id, d) { return req('PUT', '/licenses/' + id, d); },
      remove: function (id) { return req('DELETE', '/licenses/' + id); },
      archive: function (id) { return req('POST', '/licenses/' + id + '/archive'); }
    },
    contracts: {
      list: function () { return req('GET', '/contracts'); },
      create: function (d) { return req('POST', '/contracts', d); },
      update: function (id, d) { return req('PUT', '/contracts/' + id, d); },
      remove: function (id) { return req('DELETE', '/contracts/' + id); },
      archive: function (id) { return req('POST', '/contracts/' + id + '/archive'); }
    },
    violations: {
      list: function () { return req('GET', '/violations'); },
      create: function (d) { return req('POST', '/violations', d); },
      update: function (id, d) { return req('PUT', '/violations/' + id, d); },
      remove: function (id) { return req('DELETE', '/violations/' + id); },
      archive: function (id) { return req('POST', '/violations/' + id + '/archive'); },
      attach: function (id, file, meta) {
        var fd = new FormData();
        fd.append('file', file);
        Object.keys(meta || {}).forEach(function (k) { fd.append(k, meta[k]); });
        return req('POST', '/violations/' + id + '/attachments', fd);
      },
      markPaid: function (id) { return req('POST', '/violations/' + id + '/paid'); }
    },
    housings: {
      list: function () { return req('GET', '/housings'); },
      create: function (d) { return req('POST', '/housings', d); },
      update: function (id, d) { return req('PUT', '/housings/' + id, d); },
      remove: function (id) { return req('DELETE', '/housings/' + id); }
    },
    transports: {
      list: function () { return req('GET', '/transports'); },
      create: function (d) { return req('POST', '/transports', d); },
      update: function (id, d) { return req('PUT', '/transports/' + id, d); },
      remove: function (id) { return req('DELETE', '/transports/' + id); }
    },
    tasks: {
      list: function () { return req('GET', '/tasks'); },
      create: function (d) { return req('POST', '/tasks', d); },
      update: function (id, d) { return req('PATCH', '/tasks/' + id, d); },
      remove: function (id) { return req('DELETE', '/tasks/' + id); },
      show: function (id) { return req('GET', '/tasks/' + id); },
      comment: function (id, text, files) {
        var fd = new FormData();
        fd.append('body', text || '');
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
             fd.append('attachments[]', files[i]);
          }
        }
        return req('POST', '/tasks/' + id + '/comments', fd);
      }
    },
    attachments: {
      upload: function (file, meta) {
        var fd = new FormData();
        fd.append('file', file);
        Object.keys(meta || {}).forEach(function (k) { fd.append(k, meta[k]); });
        return req('POST', '/attachments', fd);
      }
    }
  };
  var __apiAvailable = false;
  function hasApi() { return __apiAvailable; }
  function probeApi(timeoutMs) {
    var ctl = new AbortController();
    var tm = setTimeout(function(){ try{ ctl.abort(); }catch(_){ } }, Math.max(300, timeoutMs || 1200));
    return fetch(apiBase + '/violations', { method: 'GET', signal: ctl.signal, cache: 'no-store' })
      .then(function(){ __apiAvailable = true; clearTimeout(tm); })
      .catch(function(){ __apiAvailable = false; clearTimeout(tm); });
  }
  function setRole(r) { localStorage.setItem('role', r || 'user'); }
  function getRole() { return localStorage.getItem('role') || 'user'; }
  function isAdmin() { return getRole() === 'admin'; }
  function isDev() { return getRole() === 'dev'; }
  function setOwner(name) { try { localStorage.setItem('owner_name', name || ''); } catch(e){} }
  function getOwner() { try { return localStorage.getItem('owner_name') || ''; } catch(e){ return ''; } }
  function isOwner() {
    var u = getUser();
    var o = getOwner();
    return !!u && !!o && u === o;
  }
  var FALLBACK_DATA = { kpis: { openViolations: 15, closedViolations: 128, totalFines: '335,150', healthCards: '74.0%' } };
  var OlayanBoard = {
    header_kpis: {
      roi: { value: '37.8%', trend: 'up', color: '#4caf50' },
      effectiveness: { value: '93.0%', trend: 'flat', color: '#FFC107' },
      risks: { value: '12.0', trend: 'down', color: '#f44336' }
    },
    metrics_row: [
      { label: { en: 'Overall Compliance', ar: 'الامتثال العام' }, value: '+95%', color: '#00d2be' },
      { label: { en: 'High Risk Violations', ar: 'مخالفات عالية الخطورة' }, value: '12', color: '#f44336' }
    ]
  };
  function updateIndexKPIs() {
    var k = FALLBACK_DATA && FALLBACK_DATA.kpis ? FALLBACK_DATA.kpis : null;
    if (!k) return;
    var e1 = document.getElementById('kpi-open'); if (e1) e1.textContent = k.openViolations;
    var e2 = document.getElementById('kpi-closed'); if (e2) e2.textContent = k.closedViolations;
    var e3 = document.getElementById('kpi-fines'); if (e3) e3.textContent = k.totalFines;
    var e4 = document.getElementById('kpi-health'); if (e4) e4.textContent = String(k.healthCards).replace('%','') + '%';
  }
  function renderViolationsCharts() {
    var rows = Array.isArray(window.violationsCache) ? window.violationsCache : Store.list('violations');
    var lang = getLang();
    if (!Array.isArray(rows)) rows = [];
    var norm = rows.map(function(r){
      var paidBool = (r && (r.paid === true || String(r.paid).toLowerCase() === 'true'));
      return {
        id: r && r.id,
        branch: (r && r.branch) || 'غير محدد',
        region: (r && r.region) || r.Region || r.city || 'غير محدد',
        type: (r && r.type) || 'غير محدد',
        amount: Number((r && r.amount) || 0),
        date: (r && r.date) || '',
        paid: paidBool,
        status: r && r.status
      };
    });
    // KPI counts
    var completed = norm.filter(function(r){ return r.paid === true; }).length;
    var pending = norm.filter(function(r){ return r.paid !== true; }).length;
    var inprogress = norm.filter(function(r){ return r.status === 'in_progress'; }).length;
    var cEl = document.getElementById('vio-kpi-completed'); if (cEl) cEl.textContent = completed;
    var pEl = document.getElementById('vio-kpi-pending'); if (pEl) pEl.textContent = pending;
    var iEl = document.getElementById('vio-kpi-inprogress'); if (iEl) iEl.textContent = inprogress;

    if (!window.__apexCharts) window.__apexCharts = {};
    var make = function(id, opts){ var el = document.getElementById(id); if (!el) return; try { if (window.__apexCharts[id] && typeof window.__apexCharts[id].destroy === 'function') window.__apexCharts[id].destroy(); } catch(_){}; try { el.innerHTML = ''; } catch(_){}; var c = new ApexCharts(el, opts); window.__apexCharts[id] = c; c.render(); };
    (function(){ var agg = {}; norm.forEach(function(r){ var b = r.branch || 'غير محدد'; agg[b] = (agg[b]||0) + 1; }); var items = Object.keys(agg).map(function(k){ return { name:k, val:agg[k] }; }).sort(function(a,b){ return b.val-a.val; }).slice(0,15); var opts = { chart:{ type:'bar', height:260, toolbar:{show:false}}, theme:{mode:'dark'}, colors:['#4facfe'], series:[{ name: lang==='ar'?'التكرار':'Frequency', data: items.map(function(i){return i.val;}) }], xaxis:{ categories: items.map(function(i){return i.name;}), labels:{style:{colors:'#e5e7eb'}} } }; make('chart-freq', opts); })();
    (function(){ var agg = {}; norm.forEach(function(r){ var reg = r.region || 'غير محدد'; agg[reg] = (agg[reg]||0) + 1; }); var items = Object.keys(agg).map(function(k){ return { name:k, val:agg[k] }; }); var opts = { chart:{ type:'bar', height:260, toolbar:{show:false}}, theme:{mode:'dark'}, colors:['#22d3ee'], series:[{ name: lang==='ar'?'المخالفات':'Violations', data: items.map(function(i){return i.val;}) }], xaxis:{ categories: items.map(function(i){return i.name;}), labels:{style:{colors:'#e5e7eb'}} } }; make('chart-region', opts); })();
    (function(){ var agg = {}; norm.forEach(function(r){ var b = r.branch || 'غير محدد'; var a = Number(r.amount||0); agg[b] = (agg[b]||0) + a; }); var items = Object.keys(agg).map(function(k){ return { name:k, val:agg[k] }; }).sort(function(a,b){ return b.val-a.val; }).slice(0,15); var opts = { chart:{ type:'bar', height:260, toolbar:{show:false}}, theme:{mode:'dark'}, colors:['#ef4444'], series:[{ name: lang==='ar'?'المبالغ':'Amounts', data: items.map(function(i){return i.val;}) }], xaxis:{ categories: items.map(function(i){return i.name;}), labels:{style:{colors:'#e5e7eb'}} } }; make('chart-risk', opts); })();
    // Types list
    (function(){
      var el = document.getElementById('list-types'); if (!el) return;
      var agg = {};
      norm.forEach(function(r){ var t = r.type || 'غير محدد'; agg[t] = (agg[t]||0) + 1; });
      var items = Object.keys(agg).map(function(k){ return { name:k, val:agg[k] }; }).sort(function(a,b){ return b.val-a.val; }).slice(0,10);
      el.innerHTML = items.map(function(i){ return '<div class="flex items-center justify-between py-1"><span>'+ i.name +'</span><span style="color:#a0aec0">'+ i.val +'</span></div>'; }).join('');
    })();
  }
  (function(){ var timer = null; var debounced = function(){ if (timer) clearTimeout(timer); timer = setTimeout(function(){ try { renderViolationsCharts(); } catch(_){} }, 120); }; window.addEventListener('storage', function(e){ if (e && e.key === 'db:violations') debounced(); }); })();
  function renderBoardBox() {
    var box = document.getElementById('board-summary');
    if (!box) return;
    var k = OlayanBoard && OlayanBoard.header_kpis ? OlayanBoard.header_kpis : null;
    if (!k) return;
    var lang = getLang();
    var labels = {
      roi: lang === 'ar' ? 'العائد على الاستثمار' : 'ROI',
      eff: lang === 'ar' ? 'فعالية التنفيذ' : 'Effectiveness',
      risk: lang === 'ar' ? 'مؤشر المخاطر' : 'Risks'
    };
    var metrics = OlayanBoard && OlayanBoard.metrics_row ? OlayanBoard.metrics_row : [];
    var metricsHtml = '';
    if (metrics && metrics.length) {
      metricsHtml =
        '<div class="mt-4 grid gap-3 md:grid-cols-2">' +
        metrics.map(function (m) {
          var lbl = lang === 'ar' && m.label && m.label.ar ? m.label.ar : (m.label && m.label.en ? m.label.en : '');
          var val = m.value || '';
          var color = m.color || '#4facfe';
          return '<div class="p-3 rounded-lg border" style="border-color:rgba(148,163,184,0.35);background:rgba(15,23,42,0.75)">' +
            '<div class="flex items-center justify-between mb-1">' +
              '<span class="text-xs text-slate-300">' + lbl + '</span>' +
              '<span class="text-xs" style="color:' + color + ';">' + val + '</span>' +
            '</div>' +
            '<div class="w-full h-1.5 rounded-full" style="background:rgba(15,23,42,0.9);">' +
              '<div class="h-1.5 rounded-full" style="background:' + color + ';width:100%;opacity:0.55;"></div>' +
            '</div>' +
          '</div>';
        }).join('') +
        '</div>';
    }
    var phaseLabels = {
      p1: lang === 'ar' ? 'المرحلة 1: التحليل' : 'Phase 1: Analysis',
      p1s: lang === 'ar' ? 'مكتمل' : 'Completed',
      p2: lang === 'ar' ? 'المرحلة 2: التنفيذ' : 'Phase 2: Execution',
      p2s: lang === 'ar' ? 'جاري التنفيذ' : 'In Progress',
      p3: lang === 'ar' ? 'المرحلة 3: المراجعة' : 'Phase 3: Review',
      p3s: lang === 'ar' ? 'مجدول' : 'Scheduled'
    };
    var roadmapHtml =
      '<div class="ops-roadmap-container" style="margin-top:16px">' +
        '<div class="ops-line"></div>' +
        '<div class="ops-scanner"></div>' +
        '<div class="ops-item active">' +
          '<div class="ops-marker"></div>' +
          '<div class="ops-content">' +
            '<h4>' + phaseLabels.p1 + '</h4>' +
            '<div class="ops-bar"><div style="width:100%"></div></div>' +
            '<span class="ops-status">' + phaseLabels.p1s + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ops-item active pulsing">' +
          '<div class="ops-marker"></div>' +
          '<div class="ops-content">' +
            '<h4>' + phaseLabels.p2 + '</h4>' +
            '<div class="ops-bar"><div style="width:65%" class="loading-bar"></div></div>' +
            '<span class="ops-status" style="color:#FFC107">' + phaseLabels.p2s + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ops-item">' +
          '<div class="ops-marker"></div>' +
          '<div class="ops-content">' +
            '<h4>' + phaseLabels.p3 + '</h4>' +
            '<div class="ops-bar"><div style="width:40%"></div></div>' +
            '<span class="ops-status" style="color:#9CA3AF">' + phaseLabels.p3s + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    box.innerHTML =
      '<div class="space-y-4">' +
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">' +
          '<div class="p-3 rounded-lg" style="background:rgba(76,175,80,0.12);border:1px solid rgba(76,175,80,0.3)">' +
            '<div class="text-xs text-slate-300">' + labels.roi + '</div>' +
            '<div class="text-lg font-semibold">' + ((k.roi && k.roi.value) || '') + '</div>' +
          '</div>' +
          '<div class="p-3 rounded-lg" style="background:rgba(255,193,7,0.12);border:1px solid rgba(255,193,7,0.3)">' +
            '<div class="text-xs text-slate-300">' + labels.eff + '</div>' +
            '<div class="text-lg font-semibold">' + ((k.effectiveness && k.effectiveness.value) || '') + '</div>' +
          '</div>' +
          '<div class="p-3 rounded-lg" style="background:rgba(244,67,54,0.12);border:1px solid rgba(244,67,54,0.3)">' +
            '<div class="text-xs text-slate-300">' + labels.risk + '</div>' +
            '<div class="text-lg font-semibold">' + ((k.risks && k.risks.value) || '') + '</div>' +
          '</div>' +
        '</div>' +
        metricsHtml +
        roadmapHtml +
      '</div>';
  }
  function renderBranchesCoverage(){
    var wrap = document.getElementById('branches-summary'); if (!wrap) return;
    var lang = getLang();
    var rows = Store.list('violations');
    var agg = {};
    rows.forEach(function(r){ var key = (r.cost_center||'') + '|' + (r.branch||''); var a = agg[key] || { branch:(r.branch||'-'), cost_center:(r.cost_center||'-'), count:0, amount:0, active:0, archived:0 }; a.count++; a.amount += Number(r.amount||0); if (r.archived===true) a.archived++; else a.active++; agg[key] = a; });
    var items = Object.keys(agg).map(function(k){ return agg[k]; }).sort(function(a,b){ return b.count - a.count; });
    wrap.innerHTML = items.map(function(i){ var totalAmt = i.amount; var cntTxt = (lang==='ar'?'عدد: ':'Count: ') + i.count; var amtTxt = (lang==='ar'?'المبلغ: ':'Amount: ') + totalAmt; var actTxt = (lang==='ar'?'نشطة: ':'Active: ') + i.active; var arcTxt = (lang==='ar'?'مؤرشفة: ':'Archived: ') + i.archived; return '<div style="background:rgba(17,24,39,0.6); border:1px solid rgba(59,130,246,0.25); border-radius:12px; padding:12px; text-align:center;">' + '<div style="color:#94a3b8; font-size:0.8rem;">'+ (lang==='ar'?'مركز التكلفة':'Cost Center') +'</div>' + '<div style="font-weight:bold; color:#e2e8f0; margin-bottom:8px;">'+ i.cost_center + (i.branch?(' - '+ i.branch):'') +'</div>' + '<div style="display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap">' + '<span style="color:#60a5fa; font-weight:bold;">'+ cntTxt +'</span>' + '<span style="color:#64748b;">|</span>' + '<span style="color:#f87171; font-weight:bold;">'+ amtTxt +'</span>' + '<span style="color:#64748b;">|</span>' + '<span style="color:#22d3ee;">'+ actTxt +'</span>' + '<span style="color:#64748b;">|</span>' + '<span style="color:#f59e0b;">'+ arcTxt +'</span>' + '</div>' + '</div>'; }).join('');
  }
  window.toggleBranchPinned = function(id){ var r = Store.get('branches', id); if (!r) return; Store.update('branches', id, { pinned: !(r.pinned===true) }); try { window.renderBranchesControl && renderBranchesControl(); } catch(_){} try { window.renderQuickAccessFromBranches && renderQuickAccessFromBranches(); } catch(_){} };
  window.renderBranchesControl = function(){ var el = document.getElementById('branches-control'); if (!el) return; var rows = Store.list('branches'); el.innerHTML = rows.map(function(b){ var pinned = b.pinned===true; var star = pinned ? '⭐' : '☆'; var name = b.name || b.branch || b.location || '-'; var city = b.city || ''; return '<div class="p-2 rounded" style="border:1px solid rgba(148,163,184,0.35);background:rgba(15,23,42,0.7)"><div class="flex items-center justify-between"><div><div class="text-slate-200">'+ name +'</div>'+ (city?('<div class="text-xs text-slate-400">'+ city +'</div>'):'') +'</div><button class="btn" onclick="toggleBranchPinned(\''+ (b.id||'') +'\')">'+ star +'</button></div></div>'; }).join(''); };
  window.renderQuickAccessFromBranches = function(){ var cont = document.getElementById('quick-access-branches'); if (!cont) return; cont.innerHTML = ''; };
  window.migrateLegacyBranches = function(){ try { var s = localStorage.getItem('admin_branches_data'); var arr = s ? JSON.parse(s) : []; if (Array.isArray(arr) && arr.length) { var existing = Store.list('branches'); if (!existing.length) { arr.forEach(function(b){ try { var payload = { name: b.name || b.branch || '-', type: b.type || 'basic', brand: b.brand || '', email: b.email || '', cost_center: b.cost_center || b.cost || '', ops1: b.ops1 || b.ops || '', kpi_target: Number(b.kpi_target||0) || 0, kpi_value: Number(b.kpi_value||0) || 0, kpi_score: typeof b.kpi_score==='number' ? b.kpi_score : (Number(b.kpi_target||0)>0 ? Math.round(Number(b.kpi_value||0)/Number(b.kpi_target||0)*100) : 0), logo: b.logo || null, hidden: !!b.hidden } ; Store.create('branches', payload); } catch(_){ } }); } } } catch(_){ } };
  window.__branchEditingId = null;
  function readLogoFile(file){ return new Promise(function(resolve){ if(!file){ resolve(null); return; } var r = new FileReader(); r.onload = function(){ resolve(r.result); }; r.readAsDataURL(file); }); }
  window.newBranchForm = function(){
    window.__branchEditingId = null;
    var ids = ['br-name','br-type','br-brand','br-email','br-cost','br-ops','br-kpi-target','br-kpi-value','br-logo','br-opening-date','br-close-date','br-notes','br-region','br-region-other','br-city','br-award-star'];
    ids.forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = false;
      } else if (el.tagName === 'SELECT') {
        if (id === 'br-type') el.value = 'basic';
        else el.value = '';
      } else if (el.type === 'file') {
        el.value = '';
      } else {
        el.value = '';
      }
    });
    var other = document.getElementById('br-region-other'); if (other) other.style.display = 'none';
  };
  window.saveBranch = function(){
    var name = (document.getElementById('br-name') && document.getElementById('br-name').value || '').trim();
    if (!name) return;
    var type = (document.getElementById('br-type') && document.getElementById('br-type').value) || 'basic';
    var brand = (document.getElementById('br-brand') && document.getElementById('br-brand').value || '').trim();
    var email = (document.getElementById('br-email') && document.getElementById('br-email').value || '').trim();
    var cost = (document.getElementById('br-cost') && document.getElementById('br-cost').value || '').trim();
    var ops = (document.getElementById('br-ops') && document.getElementById('br-ops').value || '').trim();
    var kpiTarget = parseFloat((document.getElementById('br-kpi-target') && document.getElementById('br-kpi-target').value) || '0') || 0;
    var kpiValue = parseFloat((document.getElementById('br-kpi-value') && document.getElementById('br-kpi-value').value) || '0') || 0;
    var openingDate = (document.getElementById('br-opening-date') && document.getElementById('br-opening-date').value) || '';
    var closed = (type === 'closed');
    var closeDate = (document.getElementById('br-close-date') && document.getElementById('br-close-date').value) || '';
    var notes = (document.getElementById('br-notes') && document.getElementById('br-notes').value) || '';
    var awardManual = !!(document.getElementById('br-award-star') && document.getElementById('br-award-star').checked);
    var regionSel = document.getElementById('br-region');
    var citySel = document.getElementById('br-city');
    var regionOther = document.getElementById('br-region-other');
    var region = ((regionSel && regionSel.value) || '').trim();
    if (region === 'other') region = ((regionOther && regionOther.value) || '').trim();
    var logoFile = (document.getElementById('br-logo') && document.getElementById('br-logo').files && document.getElementById('br-logo').files[0]) || null;
    readLogoFile(logoFile).then(function(logoUrl){
      var kpiScore = kpiTarget > 0 ? Math.round((kpiValue / kpiTarget) * 100) : 0;
      var payload = {
        name: name,
        type: type,
        brand: brand,
        email: email,
        cost_center: cost,
        ops1: ops,
        kpi_target: kpiTarget,
        kpi_value: kpiValue,
        kpi_score: kpiScore,
        logo: logoUrl,
        opening_date_expected: openingDate,
        closed: closed,
        close_date: closeDate,
        region: region,
        city: (citySel && citySel.value) || '',
        notes: notes,
        hidden: false,
        award_star_manual: awardManual
      };
      var edited = !!window.__branchEditingId;
      if (edited) { Store.update('branches', window.__branchEditingId, payload); }
      else { Store.create('branches', payload); }
      window.__branchEditingId = null;
      try { renderBranchesTable(); renderBranchesControl(); renderQuickAccessFromBranches(); } catch(_){ }
      try { document.getElementById('br-logo').value=''; } catch(_){ }
      try { if (typeof toast==='function') toast('success','تم', edited ? 'تم التعديل' : 'تم الحفظ'); } catch(_){ }
    });
  };
  window.__branchesPage = window.__branchesPage || 1;
  window.__branchesPageSize = window.__branchesPageSize || 20;
  window.renderBranchesTable = function(){
    var tbody = document.getElementById('branches-table-body');
    if(!tbody) return;
    var rows = Store.list('branches');
    // normalize closed flag based on type for legacy/inconsistent records
    rows.forEach(function(b){
      if (!b || !b.id) return;
      if (b.type === 'closed' && b.closed !== true) { try { Store.update('branches', b.id, { closed: true }); } catch(_){} }
      if (b.type === 'opening' && b.closed === true) { try { Store.update('branches', b.id, { closed: false }); } catch(_){} }
    });
    var qEl = document.getElementById('br-search');
    var showHiddenEl = document.getElementById('br-show-hidden');
    var typeFilterEl = document.getElementById('br-type-filter');
    var regionFilterEl = document.getElementById('br-region-filter');
    var sizeEl = document.getElementById('br-page-size');
    var q = (qEl && qEl.value || '').trim().toLowerCase();
    var showHidden = !!(showHiddenEl && showHiddenEl.checked);
    var typeFilter = (typeFilterEl && typeFilterEl.value) || 'all';
    var regionFilter = (regionFilterEl && regionFilterEl.value) || 'all';
    var sizeVal = (sizeEl && sizeEl.value) || String(window.__branchesPageSize || 20);
    var pageSize = sizeVal === 'all' ? Infinity : (parseInt(sizeVal, 10) || 20);
    window.__branchesPageSize = pageSize === Infinity ? 0 : pageSize;
    var filtered = rows.filter(function(b){
      if (!showHidden && b.hidden===true) return false;
      if (typeFilter!=='all'){
        if ((typeFilter==='opening' && b.type!=='opening') || (typeFilter==='basic' && b.type==='opening')) return false;
      }
      if (regionFilter !== 'all'){
        if (String(b.region||'').trim() !== regionFilter) return false;
      }
      if (q){
        var hay = ((b.name||'')+' '+(b.brand||'')+' '+(b.email||'')+' '+(b.cost_center||'')+' '+(b.ops1||'')).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    var vioRows = Store.list('violations');
    var vioCount = {};
    (Array.isArray(vioRows)?vioRows:[]).forEach(function(v){ var key = norm(v.branch || v.location || ''); if (key) vioCount[key] = (vioCount[key]||0) + 1; });
    filtered.sort(function(a,b){ return String(a.name||'').localeCompare(String(b.name||''),'ar'); });
    // pagination slice
    var total = filtered.length;
    var pages = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(total / pageSize));
    if (window.__branchesPage > pages) window.__branchesPage = pages;
    if (window.__branchesPage < 1) window.__branchesPage = 1;
    var start = pageSize === Infinity ? 0 : (window.__branchesPage - 1) * pageSize;
    var end = pageSize === Infinity ? filtered.length : start + pageSize;
    var pageRows = filtered.slice(start, end);

    tbody.innerHTML = '';
    pageRows.forEach(function(b){
      var tr = document.createElement('tr');
      tr.setAttribute('data-id', b.id);
      var closedComputed = (b && (b.closed === true || b.type === 'closed'));
      var typeText = (b.type==='opening') ? 'افتتاح' : (closedComputed ? 'مغلق' : 'أساسي');
      var kpi = typeof b.kpi_score==='number' ? (b.kpi_score + '%') : '';
      var isHidden = !!b.hidden;
      var closedTxt = closedComputed ? '<span style="padding:2px 8px;border-radius:9999px;font-size:11px;background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3)">نعم</span>' : '<span style="padding:2px 8px;border-radius:9999px;font-size:11px;background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3)">لا</span>';
      var statusTxt = (b.type==='opening') ? '<span style="padding:2px 8px;border-radius:9999px;font-size:11px;background:rgba(245,158,11,0.15);color:#fcd34d;border:1px solid rgba(245,158,11,0.35)">افتتاح</span>' : (closedComputed ? '<span style="padding:2px 8px;border-radius:9999px;font-size:11px;background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3)">مغلق</span>' : '<span style="padding:2px 8px;border-radius:9999px;font-size:11px;background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3)">نشط</span>');
      var notesShort = (b.notes||'').length > 60 ? (b.notes.slice(0,57) + '...') : (b.notes||'');
      var autoNoVio = (((vioCount[norm(b.name||b.branch||'')])||0) === 0);
      var manualStar = (b.award_star_manual === true);
      var showStar = autoNoVio || manualStar;
      var rewardStar = '';
      tr.innerHTML = '<td style="text-align:center"><input type="checkbox" class="br-select" data-id="'+ b.id +'" /></td>'+
        '<td>'+ (b.name||'') + '</td>'+
        '<td>'+ (b.region||'-') +'</td>'+
        '<td>'+ (b.city||'-') +'</td>'+
        '<td>'+ statusTxt +'</td>'+
        '<td>'+ (b.brand||'') +'</td>'+
        '<td>'+ (b.cost_center||'') +'</td>'+
        '<td>'+ (b.email||'') +'</td>'+
        '<td>'+ (b.opening_date_expected||'-') +'</td>'+
        '<td>'+ (b.close_date||'-') +'</td>'+
        '<td>'+ (notesShort||'-') +'</td>'+
        '<td style="white-space:nowrap">'+
          '<button class="btn btn-icon" title="تعديل" data-act="edit">✏️</button> '+
          '<button class="btn btn-icon" title="حذف" data-act="delete">🗑️</button> '+
          '<button class="btn btn-icon" title="'+ (isHidden ? 'إظهار' : 'إخفاء') +'" data-act="toggle-vis">'+ (isHidden ? '🚫' : '👁️') +'</button>'+
        '</td>';
      var tog = tr.querySelector('[data-act="toggle-vis"]');
      if (tog) tog.onclick = function(){ Store.update('branches', b.id, { hidden: !(isHidden) }); renderBranchesTable(); };
      var ed = tr.querySelector('[data-act="edit"]');
      if (ed) ed.onclick = function(){
        window.__branchEditingId = b.id;
        var set = function(id,val){ var el = document.getElementById(id); if (el) el.value = val==null?'':val; };
        set('br-name', b.name||'');
        var tSel = document.getElementById('br-type'); if (tSel) { var tVal = b.type||'basic'; if (b.closed===true) tVal = 'closed'; tSel.value = tVal; }
        var rSel = document.getElementById('br-region'); var rOther = document.getElementById('br-region-other');
        if (rSel) {
          var val = (b.region||'').trim();
          var known = ['الغربية','الوسطى','الشرقية'];
          if (val && known.indexOf(val) >= 0) { rSel.value = val; if (rOther) { rOther.value=''; rOther.style.display='none'; } }
          else { rSel.value = 'other'; if (rOther) { rOther.value = val; rOther.style.display=''; } }
        }
        set('br-city', b.city||'');
        set('br-brand', b.brand||'');
        set('br-email', b.email||'');
        set('br-cost', b.cost_center||'');
        set('br-ops', b.ops1||'');
        set('br-kpi-target', b.kpi_target||'');
        set('br-kpi-value', b.kpi_value||'');
        set('br-opening-date', b.opening_date_expected||'');
        
        set('br-close-date', b.close_date||'');
        set('br-notes', b.notes||'');
        var aw = document.getElementById('br-award-star'); if (aw) aw.checked = (b.award_star_manual===true);
        try { if (typeof window.updateBranchFormVisibility==='function') window.updateBranchFormVisibility(); } catch(_){}
        var top = document.getElementById('br-name'); if (top) { try { top.scrollIntoView({ behavior:'smooth', block:'center' }); } catch(_){ } }
      };
      var del = tr.querySelector('[data-act="delete"]');
      if (del) del.onclick = function(){
        var isAr = typeof getLang==='function' ? (getLang()==='ar') : true;
        confirmDialog({ title: isAr ? 'تأكيد الحذف' : 'Confirm Delete', message: isAr ? 'سيتم حذف هذا الفرع. هل أنت متأكد؟' : 'This branch will be deleted. Are you sure?' })
          .then(function(ok){ if (!ok) return; Store.remove('branches', b.id); renderBranchesTable(); renderBranchesControl(); renderQuickAccessFromBranches(); try { if (typeof toast==='function') toast('success','تم','تم الحذف'); } catch(_){ } });
      };
      tbody.appendChild(tr);
    });
    var totalEl = document.getElementById('br-count-total');
    if (totalEl) {
      var hiddenAll = rows.filter(function(b){ return b.hidden===true; }).length;
      var visibleAll = (rows.length - hiddenAll);
      totalEl.innerHTML = '<span style="color:#22c55e; font-weight:600">المرئية: '+ visibleAll +'</span>'
        + ' <span style="color:#64748b">|</span> '
        + '<span style="color:#f97316; font-weight:600">المخفية: '+ hiddenAll +'</span>'
        + ' <span style="color:#64748b">|</span> '
        + '<span style="color:#60a5fa; font-weight:600">الإجمالي: '+ rows.length +'</span>';
    }
    // update page info and buttons
    var infoEl = document.getElementById('br-page-info');
    var prevBtn = document.getElementById('br-prev');
    var nextBtn = document.getElementById('br-next');
    var pages2 = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
    if (infoEl) infoEl.textContent = 'صفحة ' + window.__branchesPage + ' من ' + pages2;
    if (prevBtn) prevBtn.disabled = window.__branchesPage <= 1;
    if (nextBtn) nextBtn.disabled = window.__branchesPage >= pages2;
  };
  window.getSelectedBranchIds = function(){ try { return Array.prototype.slice.call(document.querySelectorAll('#branches-table-body input.br-select:checked')).map(function(ch){ return ch.getAttribute('data-id'); }).filter(Boolean); } catch(_) { return []; } };
  window.exportBranchesJSON = function(){ var json = Store.exportJSON('branches'); var blob = new Blob([json], { type:'application/json' }); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'branches.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); };
  window.importBranchesJSON = function(e){ var f = e && e.target && e.target.files && e.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(){ try { Store.importJSON('branches', r.result||'[]'); renderBranchesTable(); renderBranchesControl(); renderQuickAccessFromBranches(); } catch(_){ } }; r.readAsText(f); };
  window.importBranchesFromText = function(){
    var ta = document.getElementById('br-bulk-text'); if(!ta) return;
    var lines = ta.value.split('\n').map(function(l){ return l.trim(); }).filter(function(l){ return l; });
    var out = [];
    lines.forEach(function(line){
      var parts = line.split('\t').map(function(p){ return p.trim(); });
      if(parts.length>=3){
        var name = parts[0]; var cost = parts[1]; var email = parts[2];
        var brand = '';
        if (cost.indexOf('BK')>=0) brand='BK'; else if (cost.indexOf('TC')>=0) brand='TC'; else if (cost.toUpperCase().indexOf('BWW')>=0) brand='BWW';
        var type = 'basic';
        out.push({ name:name, type:type, brand:brand, email:email, cost_center:cost, ops1:'', kpi_target:0, kpi_value:0, kpi_score:0, opening_date_expected:'', closed:false, close_date:'', notes:'', hidden:false });
      }
    });
    out.forEach(function(item){ Store.create('branches', item); });
    ta.value='';
    renderBranchesTable(); renderBranchesControl(); renderQuickAccessFromBranches();
  };
  window.importBranchesFromExcel = function(e){
    try {
      var f = e && e.target && e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function(){
        try {
          if (!window.XLSX) { if (typeof toast==='function') toast('error','فشل','تعذر تحميل XLSX'); return; }
          var data = new Uint8Array(r.result);
          var wb = XLSX.read(data, { type: 'array' });
          var wsname = wb.SheetNames && wb.SheetNames[0];
          var ws = wb.Sheets[wsname];
          var rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
          var get = function(obj, keys){ for (var i=0;i<keys.length;i++){ var k = keys[i]; if (obj[k] != null && obj[k] !== '') return obj[k]; } return ''; };
          rows.forEach(function(row){
            var name = get(row, ['الاسم','Name','Branch','فرع']);
            if (!String(name).trim()) return;
            var cost = get(row, ['Cost Center','مركز التكلفة','Cost']);
            var email = get(row, ['الايميل','Email']);
            var brand = get(row, ['العلامة','Brand']);
            var type = (get(row, ['النوع','Type']) || 'basic');
            var openingDate = get(row, ['تاريخ افتتاح متوقع','OpeningDate']);
            var closedRaw = get(row, ['مغلق','Closed']);
            var closed = String(closedRaw).trim().toLowerCase();
            closed = closed === 'true' || closed === 'yes' || closed === 'نعم' ? true : false;
            var closeDate = get(row, ['تاريخ الإغلاق','CloseDate']);
            var region = get(row, ['المنطقة','Region','Area']);
            var notes = get(row, ['ملاحظات','Notes']);
            var payload = { name:name, type:type, brand:brand, email:email, cost_center:cost, ops1:'', kpi_target:0, kpi_value:0, kpi_score:0, opening_date_expected:openingDate, closed:closed, close_date:closeDate, region:region, notes:notes, hidden:false };
            Store.create('branches', payload);
          });
          try { renderBranchesTable(); renderBranchesControl(); renderQuickAccessFromBranches(); } catch(_){ }
          if (typeof toast==='function') toast('success','تم','تم استيراد الفروع من اكسل');
        } catch(err){ if (typeof toast==='function') toast('error','فشل','تعذر قراءة ملف اكسل'); }
      };
      r.readAsArrayBuffer(f);
    } catch(_){ }
  };
  function smartReply(cmd) {
    var c = (cmd || '').toLowerCase();
    if (!c) return;
    var go = function (p) { window.location.href = p; };
    if (c.includes('رئيس') || c.includes('home')) { go('index.html'); return; }
    if (c.includes('موظ') || c.includes('employee') || c.includes('staff')) { go('employees.html'); return; }
    if (c.includes('فرع') || c.includes('branch')) { go('branches.html'); return; }
    if (c.includes('رخص') || c.includes('license') || c.includes('عقود') || c.includes('contract')) { go('licenses.html'); return; }
    if (c.includes('مخال') || c.includes('violation') || c.includes('غرام')) { go('violations.html'); return; }
    if (c.includes('سكن') || c.includes('housing')) { go('housings.html'); return; }
    if (c.includes('نقل') || c.includes('transport')) { go('transports.html'); return; }
    if (c.includes('تقرير') || c.includes('report') || c.includes('board')) { go('reports.html'); return; }
    if (c.includes('تسجيل') || c.includes('login') || c.includes('دخول')) { go('login.html'); return; }
    if (typeof toast === 'function') toast('info', '🤖', 'جرب: الموظفين، الفروع، المخالفات، التقارير، تسجيل الدخول');
  }
  function smartReplyFromInput(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var v = el.value.trim();
    if (!v) return;
    smartReply(v);
  }
  window.App = { init: init, setLang: setLang, getLang: getLang, login: login, logout: logout, isAuth: isAuth, setUser: setUser, getUser: getUser, setBgEnabled: setBgEnabled, getBgEnabled: getBgEnabled, store: Store, bindForm: bindForm, api: Api, setApiBase: setApiBase, setRole: setRole, getRole: getRole, isAdmin: isAdmin, isDev: isDev, setOwner: setOwner, getOwner: getOwner, isOwner: isOwner, updateIndexKPIs: updateIndexKPIs, renderBoardBox: renderBoardBox, hasApi: hasApi, probeApi: probeApi, t: t, getQuotes: function(){ return __phrases; } };
  window.smartReplyFromInput = smartReplyFromInput;
  window.smartReply = smartReply;
  window.confirmDialog = function(opts){
    var isAr = getLang() === 'ar';
    var title = (opts && opts.title) || (isAr ? 'تأكيد' : 'Confirm');
    var message = (opts && opts.message) || (isAr ? 'هل أنت متأكد؟' : 'Are you sure?');
    var o = document.getElementById('confirm-overlay');
    if (!o) { var ok = window.confirm(message); return Promise.resolve(!!ok); }
    var titleEl = document.getElementById('confirm-title');
    var msgEl = document.getElementById('confirm-message');
    var okBtn = document.getElementById('confirm-ok');
    var cancelBtn = document.getElementById('confirm-cancel');
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    o.classList.add('open');
    return new Promise(function(resolve){
      var closeAll = function(result){ o.classList.remove('open'); if (okBtn) okBtn.onclick = null; if (cancelBtn) cancelBtn.onclick = null; };
      if (okBtn) okBtn.onclick = function(){ closeAll(true); resolve(true); };
      if (cancelBtn) cancelBtn.onclick = function(){ closeAll(false); resolve(false); };
    });
  };
  // Tasks UI helpers
  window.openTaskModal = function(){ var ov = document.getElementById('task-modal'); if (ov) ov.classList.add('open'); };
  window.closeTaskModal = function(){ var ov = document.getElementById('task-modal'); if (ov) ov.classList.remove('open'); };
  window.notifyTaskAssignee = function(task, action){ try { var to = task && task.assignee || ''; var ttl = 'مهمة'; var msg = (action||'') + (task && task.title ? (': '+ task.title) : ''); Store.create('notifications', { to: to, title: ttl, message: msg, taskId: task && task.id, created: new Date().toISOString(), read: false }); if (typeof toast==='function' && to) toast('info','تنبيه', 'تم إشعار: '+ to); } catch(_){ } };
  window.__taskEditingId = null;
  window.saveTask = function(){
    var title = document.getElementById('task-title')?.value || '';
    var desc = document.getElementById('task-desc')?.value || '';
    var assignee = document.getElementById('task-assignee')?.value || '';
    var priority = document.getElementById('task-priority')?.value || 'medium';
    var due = document.getElementById('task-due')?.value || '';
    var status = document.getElementById('task-status')?.value || 'pending';
    if (!title.trim()) { if (typeof toast==='function') toast('error','❗','يرجى إدخال العنوان'); return; }
    var payload = { title:title, desc:desc, assignee:assignee, priority:priority, due:due, status:status };
    var edited = !!window.__taskEditingId;
    var rec = edited ? Store.update('tasks', window.__taskEditingId, payload) : Store.create('tasks', payload);
    window.__taskEditingId = null;
    if (typeof notifyTaskAssignee==='function') notifyTaskAssignee(rec||payload, edited?'updated':'created');
    if (typeof toast==='function') toast('success','تم', edited ? 'تم التعديل' : 'تم الحفظ');
    closeTaskModal(); renderTasks();
  };
  window.deleteTask = function(id){
    try{ Store.remove('tasks', id); if (typeof toast==='function') toast('success','تم','تم حذف المهمة'); renderTasks(); }catch(e){ if (typeof toast==='function') toast('error','فشل','تعذر حذف المهمة'); }
  };
  window.editTask = function(id){ try { var r = Store.get('tasks', id); if (!r) return; window.__taskEditingId = id; var set = function(k,v){ var el = document.getElementById('task-'+k); if (el) el.value = v==null?'':v; }; set('title', r.title||''); set('desc', r.desc||''); set('assignee', r.assignee||''); var pr = document.getElementById('task-priority'); if (pr) pr.value = r.priority||'medium'; var st = document.getElementById('task-status'); if (st) st.value = r.status||'pending'; var dueEl = document.getElementById('task-due'); if (dueEl) dueEl.value = r.due||''; openTaskModal(); } catch(_){ } };
  window.renderKanbanTasks = function(){ try { var rows = Store.list('tasks'); var pending = rows.filter(function(r){ return (r.status||'pending')==='pending'; }); var inprog = rows.filter(function(r){ return (r.status||'pending')==='in_progress'; }); var done = rows.filter(function(r){ return (r.status||'pending')==='done'; }); var byPri = function(r){ return r.priority==='high'?'priority-high':(r.priority==='low'?'priority-low':'priority-medium'); }; var mk = function(r){ return '<div class="task-card '+ byPri(r) +'" draggable="true" ondragstart="dragTask(event)" data-id="'+ (r.id||'') +'">' + '<div class="task-priority"></div>' + '<div class="task-content">' + '<div class="task-title">'+ (r.title||'') +'</div>' + '<div class="task-desc">'+ (r.desc||'') +'</div>' + '<div class="task-meta">' + '<div class="task-assignee"><div class="assignee-avatar">'+ ((r.assignee||'').charAt(0)||'-') +'</div><span>'+ (r.assignee||'-') +'</span></div>' + '<div class="task-date">📅 '+ (r.due||'-') +'</div>' + '</div>' + '</div>' + '<div class="task-actions-overlay" style="position: absolute; top: 10px; right: 10px; opacity: 0; transition: opacity 0.2s; display: flex; gap: 5px;">' + '<button onclick="editTask(\''+ (r.id||'') +'\')" title="Edit" style="background: rgba(0,0,0,0.5); border: none; border-radius: 4px; color: #fff; cursor: pointer; padding: 6px; backdrop-filter: blur(4px);">✏️</button>' + '<button onclick="deleteTask(\''+ (r.id||'') +'\')" title="Delete" style="background: rgba(239, 68, 68, 0.8); border: none; border-radius: 4px; color: #fff; cursor: pointer; padding: 6px; backdrop-filter: blur(4px);">🗑️</button>' + '</div>' + '</div>'; }; var setCol = function(id, arr){ var el = document.getElementById(id); if (el) el.innerHTML = arr.map(mk).join(''); }; setCol('col-pending', pending); setCol('col-inprogress', inprog); setCol('col-completed', done); var cP = document.getElementById('count-pending'); if (cP) cP.textContent = String(pending.length||0); var cIP = document.getElementById('count-inprogress'); if (cIP) cIP.textContent = String(inprog.length||0); var cD = document.getElementById('count-completed'); if (cD) cD.textContent = String(done.length||0); var kd = document.getElementById('admin-task-completed'); if (kd) kd.textContent = String(done.length||0); var kp = document.getElementById('admin-task-pending'); if (kp) kp.textContent = String(pending.length||0); var kip = document.getElementById('admin-task-progress'); if (kip) kip.textContent = String(inprog.length||0); } catch(_){ } };
  window.dragTask = function(ev){ try { var id = ev.target && ev.target.closest && ev.target.closest('.task-card') && ev.target.closest('.task-card').getAttribute('data-id'); if (!id) return; ev.dataTransfer.setData('text/plain', id); ev.dataTransfer.effectAllowed = 'move'; } catch(_){ } };
  window.allowDrop = function(ev){ try { ev.preventDefault(); var el = ev.currentTarget; if (el) el.classList.add('drag-over'); } catch(_){ } };
  window.drop = function(ev, status){ try { ev.preventDefault(); var el = ev.currentTarget; if (el) el.classList.remove('drag-over'); var id = ev.dataTransfer.getData('text/plain'); if (!id) return; var r = Store.get('tasks', id); if (!r) return; var ns = status==='inprogress' ? 'in_progress' : (status==='completed' ? 'done' : 'pending'); Store.update('tasks', id, { status: ns }); if (typeof notifyTaskAssignee==='function') notifyTaskAssignee(Store.get('tasks', id)||r, 'status:'+ns); renderKanbanTasks(); } catch(_){ } };
  window.renderTasks = function(){
    var rows = Store.list('tasks'); var t = document.getElementById('tasks-table'); if (!t) return;
    var lang = getLang();
    t.innerHTML = rows.slice().reverse().map(function(r){
      var pri = r.priority || 'medium'; var st = r.status || 'pending';
      var priTxt = pri==='high' ? (lang==='ar'?'عالية':'High') : pri==='low' ? (lang==='ar'?'منخفضة':'Low') : (lang==='ar'?'متوسطة':'Medium');
      var stTxt = st==='done' ? (lang==='ar'?'مكتملة':'Completed') : st==='in_progress' ? (lang==='ar'?'جاري العمل':'In Progress') : (lang==='ar'?'قيد الانتظار':'Pending');
      return '<tr><td>'+ (r.title||'') +'</td><td>'+ (r.assignee||'-') +'</td><td>'+ priTxt +'</td><td>'+ (r.due||'-') +'</td><td>'+ stTxt +'</td>'+
        '<td><button class="btn" onclick="deleteTask(\''+ r.id +'\')" data-en="Delete" data-ar="حذف">حذف</button></td></tr>';
    }).join('');
    var d = rows.filter(function(r){return r.status==='done'}).length;
    var p = rows.filter(function(r){return r.status==='pending'}).length;
    var ip = rows.filter(function(r){return r.status==='in_progress'}).length;
    var kd = document.getElementById('task-kpi-done'); if (kd) kd.textContent = d;
    var kp = document.getElementById('task-kpi-pending'); if (kp) kp.textContent = p;
    var kip = document.getElementById('task-kpi-progress'); if (kip) kip.textContent = ip;
  };
  window.openViolationModal = function(){ var ov = document.getElementById('vio-modal'); if (ov) ov.classList.add('open'); };
  window.closeViolationModal = function(){ var ov = document.getElementById('vio-modal'); if (ov) ov.classList.remove('open'); window.__vioEditingId = null; };
  function setVioModalReadonly(flag){
    var ids = ['branch','cost-center','number','efaa','payment','date','type','amount','paid','region','appeal','appeal-date','appeal-number','finance-date'];
    ids.forEach(function(k){ var el = document.getElementById('vio-'+k); if (el) { el.disabled = !!flag; } });
    var fileInp = document.getElementById('vio-files'); if (fileInp) fileInp.disabled = !!flag;
    var clearBtn = document.getElementById('vio-files-clear'); if (clearBtn) clearBtn.disabled = !!flag;
    var saveBtn = document.getElementById('vio-save'); if (saveBtn) { saveBtn.disabled = !!flag; }
  }
  window.openViolationEdit = function(id){
    var rec = Store.get('violations', id);
    if (!rec) return;
    window.__vioEditingId = id;
    var set = function(k,v){ var el = document.getElementById('vio-'+k); if (el) el.value = v==null?'':v; };
    set('branch', rec.branch);
    set('cost-center', rec.cost_center);
    set('number', rec.vio_no || rec.number);
    set('efaa', rec.efaa_no);
    set('payment', rec.payment_no);
    set('date', rec.date);
    var t = document.getElementById('vio-type'); if (t) t.value = rec.type || '';
    var amt = document.getElementById('vio-amount'); if (amt) amt.value = Number(rec.amount||0);
    var pd = document.getElementById('vio-paid'); if (pd) pd.value = String(rec.paid===true?'true':(rec.paid==='cancelled'?'cancelled':'false'));
    set('region', rec.region);
    set('appeal', rec.appeal);
    set('appeal-date', rec.appeal_date);
    set('appeal-number', rec.appeal_number);
    set('finance-date', rec.finance_date);
    var mode = window.__vioClickMode || 'edit';
    setVioModalReadonly(mode === 'view');
    var pill = document.getElementById('vio-ro-pill');
    if (pill) pill.style.display = (mode === 'view') ? 'inline-flex' : 'none';
    window.__vioClickMode = null;
    bindViolationModalOnce();
    try { renderPersistedAttachments(id); } catch(_){ }
    window.openViolationModal();
  };
  document.addEventListener('click', function(ev){
    var btn = ev.target && ev.target.closest && ev.target.closest('button');
    if (!btn) return;
    var en = btn.getAttribute && btn.getAttribute('data-en');
    if (en === 'View') window.__vioClickMode = 'view';
    else if (en === 'Edit') window.__vioClickMode = 'edit';
  }, true);
  document.addEventListener('keydown', function(ev){
    if (ev.key === 'Escape') { try { closeViolationModal(); } catch(_){} }
    var k = ev.key || '';
    if ((ev.ctrlKey || ev.metaKey) && String(k).toLowerCase() === 's') {
      ev.preventDefault();
      var saveBtn = document.getElementById('vio-save');
      if (saveBtn && !saveBtn.disabled) { try { saveViolation(); } catch(_){} }
    }
  });
  window.printViolation = function(id){
    var r = Store.get('violations', id); if (!r) return;
    var lang = getLang();
    var w = window.open('', '_blank'); if (!w) return;
    var html = '<html><head><title>'+ (lang==='ar'?'طباعة مخالفة':'Print Violation') +'</title>'
      + '<style>body{font-family:Segoe UI,Arial;background:#0b1020;color:#e2e8f0;padding:16px} h2{margin:0 0 12px} table{border-collapse:collapse;width:100%} td{border:1px solid #334155;padding:6px} .grid{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(160px,1fr))} .card{border:1px solid #334155;border-radius:8px;padding:6px;background:#0e1426}</style>'
      + '</head><body>'
      + '<h2>'+ (lang==='ar'?'بيانات المخالفة':'Violation Data') +'</h2>'
      + '<table>'
      + [ (lang==='ar'?'الفرع: ':'Branch: ')+ (r.branch||'-'), (lang==='ar'?'المنطقة: ':'Region: ')+ (r.region||'-'), (lang==='ar'?'الوصف: ':'Description: ')+ (r.type||'-'), (lang==='ar'?'المبلغ: ':'Amount: ')+ (Number(r.amount||0)), (lang==='ar'?'التاريخ: ':'Date: ')+ (r.date||'-'), (lang==='ar'?'رقم الاعتراض: ':'Appeal No: ')+ (r.appeal_number||'-'), (lang==='ar'?'تاريخ الاعتراض: ':'Appeal Date: ')+ (r.appeal_date||'-'), (lang==='ar'?'تاريخ المالية: ':'Finance Date: ')+ (r.finance_date||'-'), (lang==='ar'?'مدفوع: ':'Paid: ')+ ((r.paid===true)?(lang==='ar'?'نعم':'Yes'):(lang==='ar'?'لا':'No')) ]
        .map(function(s){ return '<tr><td>'+s+'</td></tr>'; }).join('')
      + '</table>'
      + (function(){
      var atts = Store.list('attachments').filter(function(a){ return a && a.entity==='violation' && String(a.entityId)===String(id); });
          if (!atts.length) return '';
          var secTitle = '<h2 style="margin-top:16px">'+ (lang==='ar'?'المرفقات':'Attachments') +' ('+atts.length+')</h2>';
          var grid = '<div class="grid">'+ atts.map(function(a){
            var isImg = /^image\//.test(a.type || '');
            var isPdf = /pdf$/i.test(a.type || '') || (a.name || '').toLowerCase().endsWith('.pdf');
            var src = a.data || a.url || '';
            var content = isImg ? ('<img src="'+src+'" style="max-width:100%;height:auto;border-radius:6px">')
              : (isPdf ? ('<object data="'+src+'" type="application/pdf" style="width:100%;height:480px"></object>') : ('<div>'+ (a.name||'') +'</div>'));
            return '<div class="card"><div style="color:#cbd5e1;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+ (a.name||'') +'</div>'+ content +'</div>';
          }).join('') + '</div>';
          return secTitle + grid;
        })()
      + '</body></html>';
    w.document.write(html); try { w.document.close(); w.focus(); w.print(); } catch(_){}
    if (typeof logActivity==='function') logActivity('Print Violation', 'ID: '+id, 2);
  };
  window.deleteViolation = function(id){
    var isAr = getLang() === 'ar';
    confirmDialog({ title: isAr ? 'تأكيد الحذف' : 'Confirm Delete', message: isAr ? 'سيتم حذف هذه المخالفة. هل أنت متأكد؟' : 'This violation will be deleted. Are you sure?' })
      .then(function(ok){ if (!ok) return; Store.remove('violations', id); renderViolationsTable(); if (typeof logActivity==='function') logActivity('Delete Violation','ID: '+id, 3); if (typeof toast==='function') toast('success','تم','تم حذف المخالفة'); });
  };
  window.archiveViolation = function(id){
    var isAr = getLang() === 'ar';
    confirmDialog({ title: isAr ? 'أرشفة السجل' : 'Archive Record', message: isAr ? 'سيتم أرشفة هذه المخالفة. المتابعة؟' : 'This violation will be archived. Continue?' })
      .then(function(ok){
        if (!ok) return;
        Store.archive('violations', id);
        if (window.App && App.api && App.api.violations && typeof App.api.violations.archive === 'function') {
          try { App.api.violations.archive(id).catch(function(){}); } catch(_){ }
        }
        if (typeof logActivity==='function') logActivity('Archive Violation','ID: '+id, 1);
        renderViolationsTable();
        if (typeof renderViolationCards==='function') renderViolationCards();
        if (typeof renderBranchesCoverage==='function') renderBranchesCoverage();
        if (typeof toast==='function') toast('success','تم','تمت الأرشفة');
      });
  };
  window.restoreViolation = function(id){
    var isAr = getLang() === 'ar';
    confirmDialog({ title: isAr ? 'استعادة من الأرشيف' : 'Restore From Archive', message: isAr ? 'سيتم استعادة هذه المخالفة. المتابعة؟' : 'This violation will be restored. Continue?' })
      .then(function(ok){
        if (!ok) return;
        Store.restore('violations', id);
        if (window.App && App.api && App.api.violations && typeof App.api.violations.update === 'function') {
          try { App.api.violations.update(id, { archived: false }).catch(function(){}); } catch(_){ }
        }
        if (typeof logActivity==='function') logActivity('Restore Violation','ID: '+id, 1);
        renderViolationsTable();
        if (typeof renderViolationCards==='function') renderViolationCards();
        if (typeof renderBranchesCoverage==='function') renderBranchesCoverage();
        if (typeof toast==='function') toast('success','تم','تمت الاستعادة');
      });
  };
  function norm(v){ return String(v||'').trim(); }
  function findExistingViolationByKeys(obj){
    var rows = Store.list('violations');
    var keys = ['efaa_no','vio_no','payment_no'];
    for (var i=0;i<rows.length;i++){
      var r = rows[i];
      for (var k=0;k<keys.length;k++){
        var key = keys[k];
        if (norm(obj[key]) && norm(obj[key]) === norm(r[key])) return r;
      }
      if (norm(obj.branch) && norm(obj.date) && String(obj.amount||'')!=='' && norm(obj.type)){
        if (norm(obj.branch)===norm(r.branch) && norm(obj.date)===norm(r.date) && Number(obj.amount||0)===Number(r.amount||0) && norm(obj.type)===norm(r.type)) return r;
      }
    }
    return null;
  }
  function upsertViolation(data){ var ex = findExistingViolationByKeys(data); return ex ? Store.update('violations', ex.id, data) : Store.create('violations', data); }
  function uploadViolationFiles(rec, files, apiId){ if (!rec || !files || !files.length) return; var arr = Array.from(files); var canApi = !!(App && App.api && App.api.violations && typeof App.api.violations.attach === 'function' && hasApi() && apiId); arr.forEach(function(f){ try { if (canApi) { App.api.violations.attach(apiId, f, { entity:'violation' }).then(function(resp){ try { Store.create('attachments', { entity:'violation', entityId: rec.id, apiId: apiId, name: f.name, type: f.type, size: f.size, url: (resp && resp.url) }); } catch(_){ } }); } else { var rd = new FileReader(); rd.onload = function(e){ try { Store.create('attachments', { entity:'violation', entityId: rec.id, name: f.name, type: f.type, size: f.size, data: e.target.result }); } catch(_){ } }; rd.readAsDataURL(f); } } catch(_){ } }); try { if (typeof renderPersistedAttachments==='function') renderPersistedAttachments(rec.id); } catch(_){ } }
  window.saveViolation = function(){
    var branch = document.getElementById('vio-branch')?.value || '';
    var type = document.getElementById('vio-type')?.value || '';
    var amount = Number(document.getElementById('vio-amount')?.value || 0);
    var paid = (document.getElementById('vio-paid')?.value || 'false') === 'true';
    var date = document.getElementById('vio-date')?.value || '';
    var region = document.getElementById('vio-region')?.value || '';
    var cost_center = document.getElementById('vio-cost-center')?.value || '';
    var vio_no = document.getElementById('vio-number')?.value || '';
    var efaa_no = document.getElementById('vio-efaa')?.value || '';
    var payment_no = document.getElementById('vio-payment')?.value || '';
    var appeal = document.getElementById('vio-appeal')?.value || '';
    var appeal_date = document.getElementById('vio-appeal-date')?.value || '';
    var appeal_number = document.getElementById('vio-appeal-number')?.value || '';
    var finance_date = document.getElementById('vio-finance-date')?.value || '';
    var files = (window.__vioSelectedFiles && window.__vioSelectedFiles.length) ? window.__vioSelectedFiles : (document.getElementById('vio-files')?.files || []);
    var payload = { branch:branch, type:type, amount:amount, paid:paid, date:date, region:region, cost_center:cost_center, vio_no:vio_no, efaa_no:efaa_no, payment_no:payment_no, appeal:appeal, appeal_date:appeal_date, appeal_number:appeal_number, finance_date:finance_date };
    var rec;
    if (window.__vioEditingId) {
      rec = Store.update('violations', window.__vioEditingId, payload) || Store.get('violations', window.__vioEditingId);
      if (window.App && App.api && App.api.violations && typeof App.api.violations.update === 'function') {
        try { App.api.violations.update(window.__vioEditingId, payload).catch(function(){}); } catch(_){ }
      }
      uploadViolationFiles(rec, files || [], rec && rec.apiId);
    } else {
      rec = upsertViolation(payload);
      if (App.api && App.api.violations && typeof App.api.violations.create === 'function' && hasApi()) {
        try {
          App.api.violations.create(payload).then(function(server){
            try {
              var cur = Store.get('violations', rec.id) || {};
              Store.update('violations', rec.id, Object.assign({}, cur, { apiId: server && server.id }));
              rec = Store.get('violations', rec.id) || rec;
            } catch(_){ }
            uploadViolationFiles(rec, files || [], server && server.id);
          }).catch(function(){
            uploadViolationFiles(rec, files || [], null);
          });
        } catch(_){ }
      } else { uploadViolationFiles(rec, files || [], null); }
    }
    try { window.__vioSelectedFiles = []; var inpF = document.getElementById('vio-files'); if (inpF) inpF.value=''; } catch(_){ }
    if (typeof logActivity==='function') logActivity(window.__vioEditingId ? 'Update Violation' : 'Upsert Violation', 'ID: '+(rec && rec.id)+'; Branch: '+branch+'; Amount: '+amount, 1);
    closeViolationModal(); if (typeof toast==='function') toast('success','تم','تم حفظ المخالفة'); renderViolationsTable(); renderViolationsCharts();
  };
  window.renderViolationsTable = function(){
    var t = document.getElementById('vio-table'); if (!t) return;
    var rows = Store.list('violations'); var lang = getLang();
    window.__vioPageSize = window.__vioPageSize || 20;
    window.__vioCurrentPage = window.__vioCurrentPage || 1;
    var pageSizeEl = document.getElementById('vio-page-size');
    if (pageSizeEl) {
      var saved = localStorage.getItem('vio.page.size');
      if (saved) { pageSizeEl.value = saved; }
      else { try { pageSizeEl.value = '20'; } catch(_){} }
    }
    if (pageSizeEl && pageSizeEl.value) {
      if (pageSizeEl.value === 'all') { window.__vioPageSize = rows.length || 50; }
      else { window.__vioPageSize = parseInt(pageSizeEl.value, 10) || 50; }
    }
    if (pageSizeEl && !pageSizeEl.__boundChange) {
      pageSizeEl.__boundChange = true;
      pageSizeEl.onchange = function(){ localStorage.setItem('vio.page.size', pageSizeEl.value); window.__vioCurrentPage = 1; renderViolationsTable(); };
    }
    var totalPages = Math.max(1, Math.ceil(rows.length / window.__vioPageSize));
    if (window.__vioCurrentPage > totalPages) window.__vioCurrentPage = totalPages;
    if (window.__vioCurrentPage < 1) window.__vioCurrentPage = 1;
    var infoEl = document.getElementById('vio-page-info');
    var totalEl = document.getElementById('vio-total-count');
    var prevBtn = document.getElementById('vio-btn-prev');
    var nextBtn = document.getElementById('vio-btn-next');
    if (infoEl) infoEl.textContent = (lang==='ar'?'صفحة':'Page') + ' ' + window.__vioCurrentPage + ' ' + (lang==='ar'?'من':'of') + ' ' + totalPages;
    if (totalEl) totalEl.textContent = (lang==='ar'?'عدد المخالفات: ':'Total Violations: ') + rows.length;
    if (prevBtn) { prevBtn.disabled = window.__vioCurrentPage <= 1; prevBtn.onclick = function(){ if (window.__vioCurrentPage>1){ window.__vioCurrentPage--; renderViolationsTable(); } }; }
    if (nextBtn) { nextBtn.disabled = window.__vioCurrentPage >= totalPages; nextBtn.onclick = function(){ if (window.__vioCurrentPage<totalPages){ window.__vioCurrentPage++; renderViolationsTable(); } }; }
    var start = (window.__vioCurrentPage - 1) * window.__vioPageSize;
    var end = start + window.__vioPageSize;
    var pageRows = rows.slice().reverse().slice(start, end);
    t.innerHTML = pageRows.map(function(r){
      var paidTxt = (r && (r.paid === true || String(r.paid).toLowerCase()==='true')) ? (lang==='ar'?'نعم':'Yes') : (lang==='ar'?'لا':'No');
      var appealMap = { 'under_study': {en:'Under Study', ar:'تحت الدراسة'}, 'rejected': {en:'Rejected', ar:'رفض الاعتراض'}, 'accepted': {en:'Accepted', ar:'قبول الاعتراض'}, 'not_applicable': {en:'N/A', ar:'لا يمكن الاعتراض'} };
      var appealTxt = (appealMap[r.appeal] ? (lang==='ar' ? appealMap[r.appeal].ar : appealMap[r.appeal].en) : (r.appeal||'-'));
      return '<tr>'+
        '<td><input type="checkbox" data-id="'+ (r.id||'') +'" class="vio-chk"></td>'+
        '<td>'+ (r.branch||'') +'</td>'+
        '<td>'+ (r.cost_center||'-') +'</td>'+
        '<td>'+ (r.region||'-') +'</td>'+
        '<td>'+ (r.vio_no||'-') +'</td>'+
        '<td>'+ (r.efaa_no||'-') +'</td>'+
        '<td>'+ (r.payment_no||'-') +'</td>'+
        '<td>'+ (r.type||'-') +'</td>'+
        '<td>'+ (Number(r.amount||0)) +'</td>'+
        '<td>'+ (r.date||'-') +'</td>'+
        '<td>'+ appealTxt +'</td>'+
        '<td>'+ (r.appeal_date||'-') +'</td>'+
        '<td>'+ (r.appeal_number||'-') +'</td>'+
        '<td>'+ (r.finance_date||'-') +'</td>'+
        '<td>'+ paidTxt +'</td>'+
      '</tr>';
    }).join('');
    try {
      var trs = Array.prototype.slice.call(t.querySelectorAll('tr'));
      trs.forEach(function(tr, idx){
        var r = pageRows[idx]; if (!r) return;
        var td = document.createElement('td');
        var html = '<div style="display:flex;gap:6px;flex-wrap:wrap">'
          + '<button class="btn btn-icon" onclick="openViolationEdit(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'عرض':'View') +'"><span style="display:none" data-en="View" data-ar="عرض">عرض</span><span>👁</span></button>'
          + '<button class="btn btn-icon" onclick="printViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'طباعة':'Print') +'"><span style="display:none" data-en="Print" data-ar="طباعة">طباعة</span><span>🖨</span></button>'
          + '<button class="btn btn-icon" onclick="openViolationEdit(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'تعديل':'Edit') +'"><span style="display:none" data-en="Edit" data-ar="تعديل">تعديل</span><span>✏</span></button>'
          + '<button class="btn btn-icon" style="background:#ef4444;border:none" onclick="deleteViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'حذف':'Delete') +'"><span style="display:none" data-en="Delete" data-ar="حذف">حذف</span><span>🗑</span></button>'
          + (r && r.archived===true ? ('<button class="btn btn-icon" style="background:#10b981;border:none" onclick="restoreViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'استعادة':'Restore') +'"><span style="display:none" data-en="Restore" data-ar="استعادة">استعادة</span><span>↩</span></button>') : ('<button class="btn btn-icon" style="background:#f59e0b;border:none" onclick="archiveViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'أرشفة':'Archive') +'"><span style="display:none" data-en="Archive" data-ar="أرشفة">أرشفة</span><span>📦</span></button>'))
          + '</div>';
        td.innerHTML = html;
        tr.appendChild(td);
      });
    } catch(_){}
    var all = document.getElementById('vio-select-all'); if (all) { all.onclick = function(){ Array.from(document.querySelectorAll('.vio-chk')).forEach(function(c){ c.checked = all.checked; }); }; }
  };
  window.deleteSelectedViolations = function(){
    var ids = Array.from(document.querySelectorAll('.vio-chk:checked')).map(function(c){ return c.getAttribute('data-id'); });
    if (!ids.length) { if (typeof toast==='function') toast('info','تنبيه','لم يتم تحديد سجلات'); return; }
    var isAr = getLang() === 'ar';
    confirmDialog({ title: isAr ? 'تأكيد الحذف' : 'Confirm Delete', message: isAr ? 'سيتم حذف السجلات المحددة. هل أنت متأكد؟' : 'Selected records will be deleted. Are you sure?' })
      .then(function(ok){ if (!ok) return; ids.forEach(function(id){ Store.remove('violations', id); }); if (typeof logActivity==='function') logActivity('Delete Violations', 'IDs: '+ids.join(','), 3); renderViolationsTable(); if (typeof toast==='function') toast('success','تم','تم حذف السجلات المحددة'); });
  };
  window.renderViolationCards = function(){
    var wrap = document.getElementById('vio-cards'); if (!wrap) return;
    var filterEl = document.getElementById('vio-cards-filter');
    var mode = filterEl ? filterEl.value : 'active';
    var rows = Store.list('violations');
    if (mode === 'active') rows = rows.filter(function(r){ return r.archived !== true; });
    else if (mode === 'archived') rows = rows.filter(function(r){ return r.archived === true; });
    var lang = getLang();
    wrap.style.display = 'grid';
    wrap.innerHTML = rows.slice().reverse().map(function(r){
      var paidTxt = (r && (r.paid === true || String(r.paid).toLowerCase()==='true')) ? (lang==='ar'?'نعم':'Yes') : (lang==='ar'?'لا':'No');
      var appealMap = { 'under_study': {en:'Under Study', ar:'تحت الدراسة'}, 'rejected': {en:'Rejected', ar:'رفض الاعتراض'}, 'accepted': {en:'Accepted', ar:'قبول الاعتراض'}, 'not_applicable': {en:'N/A', ar:'لا يمكن الاعتراض'} };
      var appealTxt = (appealMap[r.appeal] ? (lang==='ar' ? appealMap[r.appeal].ar : appealMap[r.appeal].en) : (r.appeal||'-'));
      var top = '<div style="color:#94a3b8; font-size:0.8rem;">'+ (lang==='ar'?'مركز التكلفة':'Cost Center') +'</div>'+
                '<div style="font-weight:bold; color:#e2e8f0; margin-bottom:8px;">'+ (r.cost_center||'-') +'</div>';
      var actions = '<div style="display:flex; gap:6px; margin-top:8px;">'
        + '<button class="btn btn-icon" onclick="openViolationEdit(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'عرض':'View') +'">👁</button>'
        + '<button class="btn btn-icon" onclick="printViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'طباعة':'Print') +'">🖨</button>'
        + (r && r.archived===true ? ('<button class="btn btn-icon" style="background:#10b981;border:none" onclick="restoreViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'استعادة':'Restore') +'">↩</button>') : ('<button class="btn btn-icon" style="background:#f59e0b;border:none" onclick="archiveViolation(\''+ (r.id||'') +'\')" title="'+ (lang==='ar'?'أرشفة':'Archive') +'">📦</button>'))
        + '</div>';
      var atts = Store.list('attachments').filter(function(a){ return a && a.entity==='violation' && String(a.entityId)===String(r.id); });
      var attHtml = '';
      if (atts.length) {
        attHtml = '<div style="margin-top:8px">'
          + '<div style="color:#94a3b8; font-size:0.8rem; margin-bottom:4px">'+ (lang==='ar'?'المرفقات':'Attachments') +' ('+atts.length+')</div>'
          + '<div style="display:grid; gap:6px; grid-template-columns: repeat(auto-fill,minmax(100px,1fr));">'
          + atts.map(function(a){
              var isImg = /^image\//.test(a.type || '');
              var isPdf = /pdf$/i.test(a.type || '') || (a.name || '').toLowerCase().endsWith('.pdf');
              var src = a.data || a.url || '';
              var thumb = isImg ? '<img src="'+src+'" style="width:100%;height:80px;object-fit:cover;border:1px solid rgba(148,163,184,0.35);border-radius:6px">'
                : (isPdf ? '<div style="display:flex;align-items:center;justify-content:center;height:80px;border:1px solid rgba(148,163,184,0.35);border-radius:6px;background:rgba(255,255,255,0.06)">PDF</div>'
                : '<div style="display:flex;align-items:center;justify-content:center;height:80px;border:1px solid rgba(148,163,184,0.35);border-radius:6px;background:rgba(255,255,255,0.06)">'+(a.type||'file')+'</div>');
              return '<a href="'+(src || '#')+'" target="_blank" title="'+(a.name||'')+'">'+ thumb +'</a>';
            }).join('')
          + '</div>'
          + '</div>';
      }
      var body = '<div style="display:grid; grid-template-columns:1fr; gap:6px; text-align:left;">'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'الفرع':'Branch') +': </span><span style="color:#e2e8f0">'+ (r.branch||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'المنطقة':'Region') +': </span><span style="color:#e2e8f0">'+ (r.region||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'رقم المخالفة':'Violation No') +': </span><span style="color:#e2e8f0">'+ (r.vio_no||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'رقم إيفاء':'Efaa No') +': </span><span style="color:#e2e8f0">'+ (r.efaa_no||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'رقم السداد':'Payment No') +': </span><span style="color:#e2e8f0">'+ (r.payment_no||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'تاريخ':'Date') +': </span><span style="color:#e2e8f0">'+ (r.date||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'النوع/الوصف':'Type/Desc') +': </span><span style="color:#e2e8f0">'+ (r.type||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'المبلغ':'Amount') +': </span><span style="color:#f87171; font-weight:bold;">'+ (Number(r.amount||0)) +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'حالة السداد':'Paid') +': </span><span style="color:#e2e8f0">'+ paidTxt +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'حالة الاعتراض':'Appeal') +': </span><span style="color:#e2e8f0">'+ appealTxt +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'رقم الاعتراض':'Appeal No') +': </span><span style="color:#e2e8f0">'+ (r.appeal_number||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'تاريخ الاعتراض':'Appeal Date') +': </span><span style="color:#e2e8f0">'+ (r.appeal_date||'-') +'</span></div>'
        + '<div><span style="color:#94a3b8">'+ (lang==='ar'?'تاريخ الإرسال للمالية':'Finance Date') +': </span><span style="color:#e2e8f0">'+ (r.finance_date||'-') +'</span></div>'
        + '</div>';
      return '<div style="background:rgba(17,24,39,0.6); border:1px solid rgba(59,130,246,0.25); border-radius:12px; padding:12px;">'+ top + body + attHtml + actions +'</div>';
    }).join('');
  };
  (function(){ var toggle = document.getElementById('vio-cards-toggle'); var filter = document.getElementById('vio-cards-filter'); if (toggle) { toggle.onclick = function(){ var wrap = document.getElementById('vio-cards'); if (!wrap) return; wrap.style.display = (wrap.style.display==='none'||!wrap.style.display) ? 'grid' : 'none'; if (wrap.style.display==='grid') renderViolationCards(); }; } if (filter && !filter.__bound) { filter.__bound = true; filter.onchange = function(){ renderViolationCards(); }; } })();
  function bindViolationModalOnce(){
    if (window.__vioBound) return; window.__vioBound = true;
    var inp = document.getElementById('vio-files');
    var preview = document.getElementById('vio-files-preview');
    var btnClear = document.getElementById('vio-files-clear');
    var btnPrintFiles = document.getElementById('vio-files-print');
    var btnPrintData = document.getElementById('vio-data-print');
    window.__vioSelectedFiles = [];
    function renderPreview(){
      if (!preview) return;
      var lang = getLang();
      preview.innerHTML = (window.__vioSelectedFiles || []).map(function(f, idx){
        var url = f.__url || URL.createObjectURL(f);
        f.__url = url;
        var isImg = /^image\//.test(f.type || '');
        var isPdf = /pdf$/i.test(f.type || '') || (f.name || '').toLowerCase().endsWith('.pdf');
        var thumb = isImg ? '<img src="'+url+'" style="width:100%;height:100px;object-fit:cover;border:1px solid rgba(148,163,184,0.35);border-radius:8px">'
          : (isPdf ? '<div style="display:flex;align-items:center;justify-content:center;height:100px;border:1px solid rgba(148,163,184,0.35);border-radius:8px;background:rgba(255,255,255,0.06)">PDF</div>'
          : '<div style="display:flex;align-items:center;justify-content:center;height:100px;border:1px solid rgba(148,163,184,0.35);border-radius:8px;background:rgba(255,255,255,0.06)">FILE</div>');
        return '<div style="position:relative">'+ thumb +
          '<div style="margin-top:6px;font-size:12px;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+ (f.name||'') +'</div>'+
          '<button class="btn btn-icon" style="position:absolute;top:6px;right:6px;background:#ef4444;border:none" title="'+ (lang==='ar'?'حذف':'Delete') +'" data-idx="'+idx+'">🗑</button>'+
        '</div>';
      }).join('');
      Array.prototype.slice.call(preview.querySelectorAll('button[data-idx]')).forEach(function(b){
        b.onclick = function(){ var i = parseInt(b.getAttribute('data-idx'),10); if (!isNaN(i)) { window.__vioSelectedFiles.splice(i,1); renderPreview(); } };
      });
    }
    if (inp) inp.onchange = function(ev){ window.__vioSelectedFiles = Array.from(ev.target.files || []); renderPreview(); };
    if (btnClear) btnClear.onclick = function(){ window.__vioSelectedFiles = []; renderPreview(); if (inp) try { inp.value = ''; } catch(_){} };
    if (btnPrintFiles) btnPrintFiles.onclick = function(){
      var w = window.open('', '_blank'); if (!w) return;
      var items = window.__vioSelectedFiles || [];
      var html = '<div style="font-family:Segoe UI,Arial;padding:16px;background:#0b1020;color:#e2e8f0">'+ items.map(function(f){
        var url = f.__url || URL.createObjectURL(f); f.__url = url;
        var isImg = /^image\//.test(f.type || '');
        var isPdf = /pdf$/i.test(f.type || '') || (f.name || '').toLowerCase().endsWith('.pdf');
        return isImg ? ('<img src="'+url+'" style="max-width:100%;display:block;margin-bottom:12px">') : (isPdf ? ('<object data="'+url+'" type="application/pdf" style="width:100%;height:600px;margin-bottom:12px"></object>') : ('<div>'+ (f.name||'') +'</div>'));
      }).join('') + '</div>';
      w.document.write(html); try { w.document.close(); w.focus(); w.print(); } catch(_){}
    };
    if (btnPrintData) btnPrintData.onclick = function(){
      var lang = getLang();
      var r = {
        branch: document.getElementById('vio-branch')?.value || '',
        region: document.getElementById('vio-region')?.value || '',
        type: document.getElementById('vio-type')?.value || '',
        amount: Number(document.getElementById('vio-amount')?.value || 0),
        date: document.getElementById('vio-date')?.value || '',
        appeal_number: document.getElementById('vio-appeal-number')?.value || '',
        appeal_date: document.getElementById('vio-appeal-date')?.value || '',
        finance_date: document.getElementById('vio-finance-date')?.value || '',
        paid: (document.getElementById('vio-paid')?.value || 'false') === 'true'
      };
      var w = window.open('', '_blank'); if (!w) return;
      var html = '<div style="font-family:Segoe UI,Arial;padding:16px;background:#0b1020;color:#e2e8f0">'
        + '<h2 style="margin:0 0 12px">'+ (lang==='ar'?'بيانات المخالفة':'Violation Data') +'</h2>'
        + '<table style="border-collapse:collapse;width:100%">'
        + [ (lang==='ar'?'الفرع: ':'Branch: ')+ (r.branch||'-'), (lang==='ar'?'المنطقة: ':'Region: ')+ (r.region||'-'), (lang==='ar'?'الوصف: ':'Description: ')+ (r.type||'-'), (lang==='ar'?'المبلغ: ':'Amount: ')+ (Number(r.amount||0)), (lang==='ar'?'التاريخ: ':'Date: ')+ (r.date||'-'), (lang==='ar'?'رقم الاعتراض: ':'Appeal No: ')+ (r.appeal_number||'-'), (lang==='ar'?'تاريخ الاعتراض: ':'Appeal Date: ')+ (r.appeal_date||'-'), (lang==='ar'?'تاريخ المالية: ':'Finance Date: ')+ (r.finance_date||'-'), (lang==='ar'?'مدفوع: ':'Paid: ')+ ((r.paid===true)?(lang==='ar'?'نعم':'Yes'):(lang==='ar'?'لا':'No')) ]
          .map(function(s){ return '<tr><td style="border:1px solid #334155;padding:6px">'+s+'</td></tr>'; }).join('')
        + '</table>'
        + '</div>';
      w.document.write(html); try { w.document.close(); w.focus(); w.print(); } catch(_){}
    };
  }
  function renderPersistedAttachments(vioId){
    var preview = document.getElementById('vio-files-preview'); if (!preview) return;
    var rows = Store.list('attachments').filter(function(a){
      return a && a.entity==='violation' && String(a.entityId)===String(vioId);
    });
    var lang = getLang();
    Array.prototype.slice.call(preview.querySelectorAll('div[data-att-id], #persisted-att-sep')).forEach(function(n){ try{ n.remove(); }catch(_){}});
    if (!rows.length) return;
    var sep = document.createElement('div'); sep.id = 'persisted-att-sep'; sep.style.cssText = 'grid-column:1/-1;height:1px;background:rgba(148,163,184,0.25)';
    preview.appendChild(sep);
    var frag = document.createDocumentFragment();
    rows.forEach(function(a){
      var isImg = /^image\//.test(a.type || '');
      var isPdf = /pdf$/i.test(a.type || '') || (a.name || '').toLowerCase().endsWith('.pdf');
      var src = a.data || a.url || '';
      var card = document.createElement('div'); card.setAttribute('data-att-id', a.id || ''); card.style.position = 'relative';
      var thumbWrap = document.createElement('div'); thumbWrap.style.position = 'relative';
      var thumbHtml = isImg ? '<img src="'+src+'" style="width:100%;height:100px;object-fit:cover;border:1px solid rgba(148,163,184,0.35);border-radius:8px">'
        : (isPdf ? '<div style="display:flex;align-items:center;justify-content:center;height:100px;border:1px solid rgba(148,163,184,0.35);border-radius:8px;background:rgba(255,255,255,0.06);color:#e2e8f0">PDF</div>'
        : '<div style="display:flex;align-items:center;justify-content:center;height:100px;border:1px solid rgba(148,163,184,0.35);border-radius:8px;background:rgba(255,255,255,0.06);color:#e2e8f0">'+(a.type||'file')+'</div>');
      thumbWrap.innerHTML = thumbHtml + '\n' +
        '<div style="position:absolute;top:6px;right:6px;display:flex;gap:6px">'
        + '<a class="btn btn-icon" style="background:rgba(59,130,246,0.5);border:none" href="'+(src||'#')+'" target="_blank" title="'+(lang==='ar'?'فتح':'Open')+'">🔍</a>'
        + '<button class="btn btn-icon" data-del-att="'+(a.id||'')+'" style="background:#ef4444;border:none" title="'+(lang==='ar'?'حذف':'Delete')+'">🗑</button>'
        + '<button class="btn btn-icon" data-edit-att="'+(a.id||'')+'" style="background:#f59e0b;border:none" title="'+(lang==='ar'?'تعديل الاسم':'Rename')+'">✏</button>'
        + '<button class="btn btn-icon" data-save-att="'+(a.id||'')+'" style="background:#10b981;border:none;display:none" title="'+(lang==='ar'?'حفظ الاسم':'Save Name')+'">💾</button>'
        + '</div>';
      card.appendChild(thumbWrap);
      var nameRow = document.createElement('div'); nameRow.style.cssText = 'display:flex;gap:6px;margin-top:6px;align-items:center';
      var nameView = document.createElement('div'); nameView.setAttribute('data-name-view', '1'); nameView.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#cbd5e1'; nameView.textContent = a.name || '';
      var nameEdit = document.createElement('input'); nameEdit.setAttribute('data-name-edit', '1'); nameEdit.style.cssText = 'flex:1;display:none;background:#0b1020;border:1px solid #334155;color:#e2e8f0;border-radius:6px;padding:4px'; nameEdit.value = a.name || '';
      nameRow.appendChild(nameView); nameRow.appendChild(nameEdit);
      card.appendChild(nameRow);
      frag.appendChild(card);
    });
    preview.appendChild(frag);
    Array.prototype.slice.call(preview.querySelectorAll('button[data-del-att]')).forEach(function(b){
      b.onclick = function(){ var aid = b.getAttribute('data-del-att'); Store.remove('attachments', aid); var el = preview.querySelector('div[data-att-id="'+aid+'"]'); if (el) el.remove(); };
    });
    Array.prototype.slice.call(preview.querySelectorAll('button[data-edit-att]')).forEach(function(b){
      b.onclick = function(){ var id = b.getAttribute('data-edit-att'); var card = preview.querySelector('div[data-att-id="'+id+'"]'); if (!card) return; var view = card.querySelector('[data-name-view]'); var inp = card.querySelector('[data-name-edit]'); var save = card.querySelector('button[data-save-att]'); if (view && inp && save) { view.style.display = 'none'; inp.style.display = 'block'; save.style.display = 'inline-flex'; } };
    });
    Array.prototype.slice.call(preview.querySelectorAll('button[data-save-att]')).forEach(function(b){
      b.onclick = function(){ var id = b.getAttribute('data-save-att'); var card = preview.querySelector('div[data-att-id="'+id+'"]'); if (!card) return; var view = card.querySelector('[data-name-view]'); var inp = card.querySelector('[data-name-edit]'); if (!inp) return; var val = inp.value||''; var rec = Store.update('attachments', id, { name: val }); if (view){ view.textContent = val; view.style.display = 'block'; } inp.style.display = 'none'; b.style.display = 'none'; };
    });
  }
  (function(){ var inp = document.getElementById('viol-excel-input'); if (inp) {
    inp.onchange = function(ev){ var files = Array.from(ev.target.files||[]); if (!files.length) return; var count = 0; var reader = new FileReader();
      var importOne = function(f){
        var isCSV = /\.csv$/i.test(f.name);
        if (isCSV) {
          reader.onload = function(e){
            var text = e.target.result||'';
            var lines = text.split(/\r?\n/); if (!lines.length) lines=[];
            var splitCSV = function(line){ var out=[], cur='', inQ=false; for (var i=0;i<line.length;i++){ var ch = line[i]; if (ch==='"'){ inQ = !inQ; } else if (ch===',' && !inQ){ out.push(cur.trim().replace(/^"|"$/g,'')); cur=''; } else { cur += ch; } } out.push(cur.trim().replace(/^"|"$/g,'')); return out; };
            var headers = null; var hasHeader = false;
            if (lines[0]) { var h0 = splitCSV(lines[0]).map(function(x){ return String(x||'').trim(); }); hasHeader = h0.some(function(x){ return /^(الفرع|Branch)$/i.test(x); }); if (hasHeader) headers = h0; }
            for (var i=(hasHeader?1:0); i<lines.length; i++){
              var line = lines[i]; if (!line || /^\s*$/.test(line)) continue; var cols = splitCSV(line);
              var rec;
              if (hasHeader && headers){ var obj = {}; headers.forEach(function(h, idx){ obj[h] = (cols[idx]||'').trim(); }); rec = toRecFromObject(obj); }
              else { rec = toRecFromArray(cols); }
              if (rec) { upsertViolation(rec); count++; }
            }
            finalize();
          };
          try { reader.readAsText(f); } catch(_) { if (typeof toast==='function') toast('error','فشل','لم يتم قراءة الملف'); }
          try { reader.readAsText(f); } catch(_) { if (typeof toast==='function') toast('error','فشل','لم يتم قراءة الملف'); }
        } else {
          if (!window.XLSX) { if (typeof toast==='function') toast('error','تعذر','مكتبة Excel غير متاحة. استخدم CSV أو فعّل الشبكة'); return; }
          reader.onload = function(e){ var data = new Uint8Array(e.target.result); try { var wb = XLSX.read(data, { type:'array' }); var ws = wb.Sheets[wb.SheetNames[0]]; var rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:'' }); var headers = rows && rows[0] ? rows[0].map(function(x){ return String(x||'').trim(); }) : null; var hasHeader = headers ? headers.some(function(x){ return /^(الفرع|Branch)$/i.test(x); }) : false; for (var i=(hasHeader?1:0); i<(rows||[]).length; i++){ var cols = rows[i] || []; var rec; if (hasHeader && headers){ var obj = {}; headers.forEach(function(h, idx){ obj[h] = (cols[idx]||'').toString(); }); rec = toRecFromObject(obj); } else { rec = toRecFromArray(cols); } if (rec) { upsertViolation(rec); count++; } } finalize(); } catch(_) { finalize(); } };
          try { reader.readAsArrayBuffer(f); } catch(_) { if (typeof toast==='function') toast('error','فشل','لم يتم قراءة الملف'); }
        }
      };
      var parsePaid = function(v){ var s = String(v || '').trim().toLowerCase(); if (!s) return false; var truthy = ['true','yes','y','مدفوع','تم','paid','done']; var falsy = ['false','no','n','غير مدفوع','لم يتم','not paid','pending','cancelled','canceled','الغاء المخالفة']; if (truthy.indexOf(s) !== -1) return true; if (falsy.indexOf(s) !== -1) return false; return s === '1' ? true : s === '0' ? false : false; };
      var parseAppeal = function(v){ var s = String(v || '').trim().toLowerCase(); if (!s) return ''; var map = { 'under study':'under_study', 'under_study':'under_study', 'تحت الدراسة':'under_study', 'rejected':'rejected', 'رفض الاعتراض':'rejected', 'accepted':'accepted', 'قبول الاعتراض':'accepted', 'not applicable':'not_applicable', 'not_applicable':'not_applicable', 'لا يمكن الاعتراض':'not_applicable' }; return map[s] || s; };
      var getObjVal = function(o, keys){ for (var i=0;i<keys.length;i++){ var k = keys[i]; if (o.hasOwnProperty(k) && String(o[k]).trim()!=='') return o[k]; } return ''; };
      var toRecFromObject = function(o){ if (!o) return null; var rec = { branch: getObjVal(o, ['الفرع','Branch','branch']), cost_center: getObjVal(o, ['Cost center','مركز التكلفة','cost_center']), vio_no: getObjVal(o, ['رقم المخالفة','Violation No','vio_no']), efaa_no: getObjVal(o, ['رقم مخالفة إيفاء','Efaa No','efaa_no']), payment_no: getObjVal(o, ['رقم السداد','Payment No','payment_no']), date: getObjVal(o, ['تاريخ وقوع المخالفة','Date','date']), type: getObjVal(o, ['نوع المخالفة ووصفها','Type','Description','type']), amount: Number(getObjVal(o, ['المبلغ (ريال)','Amount','amount'])) || 0, paid: parsePaid(getObjVal(o, ['حالة السداد','Paid','paid'])), region: getObjVal(o, ['المنطقة','Region','region']), appeal: parseAppeal(getObjVal(o, ['حالة الاعتراض','Appeal','appeal'])), appeal_date: getObjVal(o, ['تاريخ تقديم الاعتراض','Appeal Date','appeal_date']), appeal_number: getObjVal(o, ['رقم الاعتراض','Appeal Number','appeal_number']), finance_date: getObjVal(o, ['تاريخ الإرسال للمالية','Finance Date','finance_date']) }; return rec; };
      var toRecFromArray = function(cols){ if (!cols || !cols.length) return null; var rec = { branch: cols[0] || '', cost_center: cols[1] || '', vio_no: cols[2] || '', efaa_no: cols[3] || '', payment_no: cols[4] || '', date: cols[5] || '', type: cols[6] || '', amount: Number(cols[7] || 0), paid: parsePaid(cols[8] || ''), region: cols[9] || '', appeal: parseAppeal(cols[10] || ''), appeal_date: cols[11] || '', appeal_number: cols[12] || '', finance_date: cols[13] || '' }; return rec; };
      var finalize = function(){ renderViolationsTable(); renderViolationsCharts(); if (typeof logActivity==='function') logActivity('Import Violations Excel','Count: '+count, 2); if (typeof toast==='function') toast('success','تم','تم الاستيراد ('+ count +')'); };
      files.forEach(importOne);
    };
  }})();
  setLang(getLang());
})(); 
