(function () {
  try { document.documentElement.style.visibility = 'hidden'; } catch(e){}
  // Sync tasks storage (Backward compatibility)
  (function syncTasksStorage(){ 
    const a = localStorage.getItem("admin_tasks"); 
    const d = localStorage.getItem("db:tasks"); 
    if (a && !d) localStorage.setItem("db:tasks", a); 
    if (d && !a) localStorage.setItem("admin_tasks", d); 
  })();

  console.log('App.js starting...');
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
      'login.subtitle': 'Employees Login',
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
      'assignee.search': 'ابحث بالاسم أو SAP أو الهوية',
      'ai.placeholder': 'اكتب: أظهر المخالفات، تحليل، فروع الرياض'
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
      'login.subtitle': 'Employees Login',
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
      'assignee.search': 'Search by name or SAP or ID',
      'ai.placeholder': 'Type: show violations, analysis, Riyadh branches'
    }
  };
  dict.ar['login.tagline'] = 'لا تنتظر الفرصة، بل اصنعها';
  dict.en['login.tagline'] = 'Don’t wait for opportunity, create it';
  dict.ar['login.forgot'] = 'نسيت كلمة المرور؟';
  dict.en['login.forgot'] = 'Forgot password?';
  dict.ar['login.remember'] = 'تذكرني';
  dict.en['login.remember'] = 'Remember me';
  dict.ar['footer.copyright'] = 'جميع الحقوق محفوظة لدى كومبليك © 2026';
  dict.en['footer.copyright'] = 'All rights reserved – CompliQ © 2026';
  dict.ar['footer.developed_by'] = 'جميع الحقوق محفوظة لدى كومبليك © 2026';
  dict.en['footer.developed_by'] = 'All rights reserved – CompliQ © 2026';
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
    var autoDev = localStorage.getItem('dev.autoAuth') !== '0';
    if (autoDev && (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) return true;
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
  async function logout() {
    try {
      if (window.APIClient && APIClient.auth && typeof APIClient.auth.logout === 'function') {
        await APIClient.auth.logout();
      }
    } catch (e) { console.warn('Logout API failed', e); }
    try {
      localStorage.removeItem('api_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('user_name');
    } catch(_) {}
    sessionStorage.removeItem('auth');
    localStorage.removeItem('auth');
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
      if (!text) return;
      var tag = (n.tagName || '').toUpperCase();
      if (tag === 'INPUT') {
        var tp = (n.getAttribute('type') || '').toLowerCase();
        if (tp === 'button' || tp === 'submit' || tp === 'reset') {
          n.value = text;
          return;
        }
        n.setAttribute('placeholder', text);
        return;
      }
      if (tag === 'TEXTAREA') {
        n.setAttribute('placeholder', text);
        return;
      }
      setNodeText(n, text);
    });
    var biNodes = document.querySelectorAll('[data-bi="1"]');
    biNodes.forEach(function(n){
      var ar = n.getAttribute('data-ar') || '';
      var en = n.getAttribute('data-en') || '';
      var s = lang === 'ar' ? (ar + (en ? ' (' + en + ')' : '')) : (en + (ar ? ' (' + ar + ')' : ''));
      if (s) setNodeText(n, s);
    });
  }
  function setApiBase(url) {
    localStorage.setItem('api.base', url);
    // You might want to update some global config here
  }
  function probeApi(ms) {
    // Stub for API probing
    console.log('Probing API...');
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
    try { highlightActiveNav(); } catch(e){}
    try {
      var existingOwner = getOwner();
      var currentUser = getUser();
      if (!existingOwner && currentUser) setOwner(currentUser);
    } catch(e){}
    try {
      var ab = localStorage.getItem('api.base');
      setApiBase(ab || 'http://127.0.0.1:8000/api');
    } catch(_){ }
    var shouldProbe = !!localStorage.getItem('api.base') || localStorage.getItem('api.enabled') === '1';
    if (shouldProbe) probeApi(1000);
    var __hasToken = (sessionStorage.getItem('auth') === '1' || localStorage.getItem('auth') === '1');
    if (!__hasToken && page !== 'login') {
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
      if (helpBtn) helpBtn.style.display = '';
      var links = document.querySelectorAll('header a[href$=".html"]');
      links.forEach(function(a){
        var href = a.getAttribute('href') || '';
        var isHome = href.indexOf('index.html') >= 0;
        a.style.display = isHome ? '' : 'none';
      });
      var sideLinks = document.querySelectorAll('.side-link[href$=".html"]');
      sideLinks.forEach(function(a){
        var href = a.getAttribute('href') || '';
        var clean = href.split('#')[0].split('?')[0];
        var name = clean.split('/').pop();
        var allowed = ['index.html','login.html','admin.html'];
        if (!name || allowed.indexOf(name) === -1) {
          a.style.display = 'none';
        } else {
          a.style.display = '';
        }
      });
      var adminTags = document.querySelectorAll('.division span[data-en="Admin Panel"], .division span[data-ar="لوحة التحكم"]');
      adminTags.forEach(function(s){ s.style.display = 'none'; });
      // Hide user slot (avatar/logout) when not logged in
      var userSlot = document.querySelector('.user-slot');
      if(userSlot) userSlot.style.display = 'none';
      Array.from(document.body.children).forEach(function(el){
        var tag = (el.tagName || '').toLowerCase();
        if (tag === 'header') return;
        if (el.id === 'sideMenuOverlay' || el.id === 'sideMenu') return;
        if (el.id === 'welcome-section') return; // Skip welcome section
        el.setAttribute('data-prev-display', el.style.display || '');
        el.style.display = 'none';
      });
      // Show welcome section if exists
      var welcome = document.getElementById('welcome-section');
      if (welcome) {
        welcome.classList.remove('hidden');
        welcome.style.display = 'block'; // Ensure it is visible
      }
    }
    if (__hasToken) {
      var welcome = document.getElementById('welcome-section');
      if (welcome) welcome.style.display = 'none';
      Array.from(document.body.children).forEach(function(el){
        var tag = (el.tagName || '').toLowerCase();
        if (tag === 'header') return;
        if (el.id === 'sideMenuOverlay' || el.id === 'sideMenu') return;
        if (el.hasAttribute && el.hasAttribute('data-prev-display')) {
          el.style.display = el.getAttribute('data-prev-display') || '';
          el.removeAttribute('data-prev-display');
        }
      });
      var pagePerms = {
        index: 'dashboard.view',
        violations: 'violations.view',
        employees: 'employees.view'
      };
      var need = pagePerms[page];
      if (need && !can(need)) {
        Array.from(document.body.children).forEach(function(el){
          var tag = (el.tagName || '').toLowerCase();
          if (tag === 'header') return;
          if (el.id === 'sideMenuOverlay' || el.id === 'sideMenu') return;
          el.setAttribute('data-prev-display', el.style.display || '');
          el.style.display = 'none';
        });
      }
    }
    if (typeof window.toggleUserMenu !== 'function') {
      window.toggleUserMenu = function () {
        var menu = document.getElementById('user-menu');
        var badge = document.getElementById('user-badge');
        if (!menu) return;
        menu.classList.toggle('open');
        if (badge) badge.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
        if (!menu.classList.contains('open') || !badge) return;
        var rect = badge.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = (rect.bottom + 8) + 'px';
        if ((document.documentElement && document.documentElement.dir) === 'rtl') {
          menu.style.left = rect.left + 'px';
          menu.style.right = 'auto';
        } else {
          menu.style.right = (window.innerWidth - rect.right) + 'px';
          menu.style.left = 'auto';
        }
      };
    }
    var badge = document.getElementById('user-badge');
    var badgeName = document.getElementById('user-badge-name');
    var menu = document.getElementById('user-menu');
    if (badge && badgeName) {
      badgeName.textContent = getUser() || (getLang()==='ar'?'المستخدم':'User');
      badge.onclick = function () { if (typeof window.toggleUserMenu==='function') window.toggleUserMenu(); };
      document.addEventListener('click', function (e) {
        if (menu && !badge.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('open');
        }
      });
      applyUserAvatar();
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
    if (menu) {
      var profileLink = menu.querySelector('a[data-en="My Profile"]') || menu.querySelector('a[data-ar="ملفّي"]') || menu.querySelector('a');
      if (profileLink) {
        profileLink.onclick = function(e){ e.preventDefault(); if (typeof window.showProfile==='function') window.showProfile(); };
      }
    }
    if (helpBtn) {
      helpBtn.textContent = t('controls.help');
      helpBtn.style.display = '';
      helpBtn.className = 'px-3 py-1.5 rounded-full border border-slate-300/25 bg-white/10 text-slate-100 hover:bg-white/15 backdrop-blur-md shadow shadow-slate-900/30 transition';
      helpBtn.onclick = function(){ if (typeof window.openSupportTicket==='function') window.openSupportTicket(); };
    }
    try { document.documentElement.style.visibility = ''; } catch(e){}
  }
  
  // =============================
  // Nav Active Highlighter (Reversible)
  // =============================
  function isAutoActiveOn() {
    return localStorage.getItem('nav.autoActive') !== '0';
  }
  function highlightActiveNav() {
    if (!isAutoActiveOn()) return;
    var path = (window.location.pathname || '').split('/').pop() || 'index.html';
    function normalize(href) {
      if (!href) return '';
      var s = href.split('#')[0].split('?')[0];
      return s.split('/').pop();
    }
    var selectors = ['.glass-nav a', '.top-links a.nav-link', 'nav a.nav-link', 'nav a'];
    var seen = new Set();
    selectors.forEach(function(sel){
      var nodes = document.querySelectorAll(sel);
      nodes.forEach(function(a){
        if (seen.has(a)) return;
        seen.add(a);
        a.classList.remove('active','nav-active');
        var href = a.getAttribute('href');
        if (!href) return;
        var nh = normalize(href);
        if (nh === path || (path === '' && nh === 'index.html')) {
          a.classList.add('active','nav-active');
        }
      });
    });
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

  // Expose Store and App to window
  window.Store = Store;
  
  function setRole(r) {
    localStorage.setItem('auth_role', r);
    localStorage.setItem('role', r);
  }
  function getRole() {
    return localStorage.getItem('auth_role') || localStorage.getItem('role') || 'user';
  }
  function isAdmin() {
    return getRole() === 'admin';
  }
  function isOwner() {
    var r = getRole();
    return r === 'admin' || r === 'owner';
  }
  function isDev() {
    var r = getRole();
    return r === 'admin' || r === 'dev';
  }
  function can(permission){
    try {
      if (isAdmin()) return true;
      var roleId = getRole();
      var roles = (window.App && App.store && App.store.list) ? (App.store.list('roles') || []) : [];
      var r = roles.find(function(x){ return x && (x.id === roleId || x.name === roleId); });
      if (r && r.permissions && Object.prototype.hasOwnProperty.call(r.permissions, permission)) {
        return !!r.permissions[permission];
      }
      var lp;
      try { lp = JSON.parse(localStorage.getItem('auth_perms') || 'null'); } catch(e){ lp = null; }
      if (lp && typeof lp === 'object' && Object.prototype.hasOwnProperty.call(lp, permission)) return !!lp[permission];
    } catch(e){}
    return false;
  }
  function applyUserAvatar(){
    try{
      var avatar = document.querySelector('.user-avatar');
      if (!avatar || !window.App || !App.store || !App.store.list) return;
      var cu = (window.App && App.currentUser ? App.currentUser() : null);
      var username = localStorage.getItem('ofs_auth_user') || (typeof getUser==='function' ? getUser() : '') || '';
      var sap = cu && (cu.sap || cu.sap_id || cu.SAP_ID || cu.SAP);
      var members = App.store.list('members') || [];
      var m = null;
      if (sap) {
        m = members.find(function(x){ return x && (x.sapId === sap || x.sap === sap || x.sap_id === sap); }) || null;
      }
      if (!m && username) {
        m = members.find(function(x){ return x && x.username === username; }) || null;
      }
      if (!m || !m.avatar) return;
      avatar.style.backgroundImage = 'url(' + m.avatar + ')';
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.style.boxShadow = '0 0 0 2px rgba(15,23,42,0.9)';
    } catch(e){}
  }

  var App = {
     getLang: getLang,
     setLang: setLang,
     getUser: getUser,
     setUser: setUser,
     getRole: getRole,
     setRole: setRole,
     isAdmin: isAdmin,
     isOwner: isOwner,
     isDev: isDev,
     isAuth: isAuth,
     login: login,
     logout: logout,
     init: init,
     t: t,
     store: Store,
     setApiBase: setApiBase
   };
  window.App = App;

  if (typeof window.BASE_URL === 'undefined') {
    window.BASE_URL = (function() {
      const hostStr = window.location.host;
      if (hostStr.includes(':8000')) {
        return '/api';
      }
      if (window.location.hostname === 'localhost') {
        return 'http://127.0.0.1:8000/api';
      }
      const host = window.location.hostname || '127.0.0.1';
      return `http://${host}:8000/api`;
    })();
  }
  if (typeof window.syncToServer !== 'function') {
    window.syncToServer = async function(endpoint, data){
      try{
        const res = await fetch(window.BASE_URL + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if(!res.ok) throw new Error('Server rejected');
      }catch(e){
        console.warn('Sync failed — will retry later:', e);
      }
    };
  }

  window.logActivity = function(action, module, details){
    try {
      const act = {
        id: Date.now(),
        action: action,
        module: module || 'System',
        details: details || '',
        user: (App.getUser && App.getUser()) || 'System',
        date: new Date().toLocaleString("ar-SA")
      };
      // Use Store if available, otherwise fallback or skip
      if(window.Store && window.Store.create) {
        window.Store.create('activity', act);
      }
      if (typeof window.syncToServer === 'function') {
        window.syncToServer('/activity', act);
      }
    } catch(e){ console.error(e); }

    try {
      // Keep legacy support if needed (optional, but good for safety)
      var logs = JSON.parse(localStorage.getItem('activity_log') || '[]');
      logs.unshift(action + ' | ' + (module||'') + ' | ' + (details||'') + ' | ' + new Date().toLocaleTimeString());
      if(logs.length > 50) logs.length = 50;
      localStorage.setItem('activity_log', JSON.stringify(logs));
    } catch(e){ console.error(e); }
  };
})();

// ===============================
// App.store (Unified Local Storage Shim)
// ===============================
(function(){
  window.App = window.App || {};
  
  // Ensure App.store exists and has set method
  if (!App.store) {
     App.store = {};
  }
  
  // Shim for set method if not exists
  if (!App.store.set) {
    App.store.set = function(c, rows) {
      localStorage.setItem('db:' + c, JSON.stringify(rows || []));
    };
  }
  
  // Shim for list method if not exists (redundant if using above Store, but safe)
  if (!App.store.list) {
    App.store.list = function(c) {
      var s = localStorage.getItem('db:' + c);
      try { return s ? JSON.parse(s) : []; } catch (e) { return []; }
    };
  }
  
  // Shim for create method if not exists
  if (!App.store.create) {
    App.store.create = function(c, data) {
       var rows = App.store.list(c);
       var now = Date.now();
       var rec = Object.assign({ id: Date.now().toString(36)+Math.random().toString(36).slice(2), archived: false, version: 1, createdAt: now, updatedAt: now }, data || {});
       rows.push(rec);
       App.store.set(c, rows);
       return rec;
    };
  }
})();

// ===============================
// Global Helpers (Employees, Cost Centers, Access)
// ===============================
(function(){
  // Auto-detect employees list from localStorage
  window.getAllEmployeesAuto = function(){
    const EMP_KEYS_CANDIDATES = [ 
      "ofs_employees_v1", "ofs_employees", "employees", "employees_data", "ofs_staff", "staff"
    ];
    // Try known candidates
    for (const k of EMP_KEYS_CANDIDATES){ 
      const raw = localStorage.getItem('db:' + k) || localStorage.getItem(k); 
      try {
        const v = raw ? JSON.parse(raw) : null;
        if (Array.isArray(v) && v.length) return v; 
      } catch(e){}
    }
    // Fallback: use App.store.list('employees')
    return App.store.list('employees');
  };

  // Get all Cost Centers from employees
  window.getAllCostCenters = function(){ 
    const emps = getAllEmployeesAuto(); 
    const set = new Set(); 
    emps.forEach(function(e){ 
      const cc = String(e.cost_center || e.costCenter || e.cc || "").trim(); 
      if (cc) set.add(cc); 
    }); 
    return Array.from(set).sort(); 
  };

  // Get current member object (full details)
  window.getCurrentMember = function(){
    const username = (localStorage.getItem("ofs_auth_user") || "").trim();
    if(!username) return null;
    
    // 1. Try App.store members
    const members = App.store.list("members");
    const m = members.find(function(x){ return x.username === username; });
    if(m) return m;

    // 2. Fallback: create a mock member if admin
    // If logged in as admin but no member record exists (legacy admin)
    const role = localStorage.getItem("ofs_auth_role");
    if(role === "admin"){
       return { username: "admin", role: "admin", branches: ["*"], costCenters: ["*"] };
    }
    
    return null;
  };

  // Check if current user can access a branch
  window.canAccessBranch = function(branchId, member){
    if (!member) member = (window.getCurrentMember && window.getCurrentMember());
    if (!member) return false;
    if (member.role === "admin") return true;

    const b = (member.branches || []).map(String);
    const target = String(branchId || "").trim();
    
    // If target is empty, do we allow? 
    // Usually yes if it's not specific to a branch.
    if (!target) return true; 

    return b.includes("*") || b.includes(target);
  };

  // Check if current user can access an employee
  window.canAccessEmployee = function(emp, member){ 
    if (!member) member = (window.getCurrentMember && window.getCurrentMember());
    if (!member) return false; 
    
    // Admin sees all
    if (member.role === "admin") return true; 
    
    const empBranch = String(emp.branch_id || emp.branchId || emp.branch || "").trim(); 
    const empCC     = String(emp.cost_center || emp.costCenter || emp.cc || "").trim(); 
    
    const b = (member.branches || []).map(String); 
    const c = (member.costCenters || member.cost_centers || []).map(String); 
    
    // Check Branch
    const branchOK = b.includes("*") || (empBranch && b.includes(empBranch)); 
    // Check Cost Center
    const ccOK     = c.includes("*") || (empCC && c.includes(empCC)); 
    
    // MUST match both
    return branchOK && ccOK; 
  };
})();

// ===============================
// Unified Attachment Hub
// ===============================
(function(){
  window.AttachmentHub = {
    // Open the attachment modal
    // scope: 'employee_docs', ownerId: '123', title: 'User Documents'
    open: function(opts){
      this.opts = opts || {};
      this.scope = opts.scope || 'uploads';
      this.ownerId = String(opts.ownerId || '');
      
      const modal = document.getElementById('attachments-modal');
      if(!modal) {
        console.error('AttachmentHub: #attachments-modal not found');
        return;
      }
      
      document.getElementById('att-title').textContent = opts.title || 'المرفقات';
      
      // Bind events
      const self = this;
      const fileInput = document.getElementById('att-file');
      const pickBtn = document.getElementById('att-pick');
      const saveBtn = document.getElementById('att-save');
      const clearBtn = document.getElementById('att-clear');
      
      if(pickBtn) pickBtn.onclick = function(){ fileInput.click(); };
      if(saveBtn) saveBtn.onclick = function(){ self.saveFiles(); };
      if(clearBtn) clearBtn.onclick = function(){ self.clearFiles(); };
      
      modal.classList.add('open');
      this.render();
    },
    
    // Render the list of attachments
    render: function(){
      const lang = (typeof getLang === 'function' ? getLang() : (document.documentElement && document.documentElement.lang) || 'ar');
      const isAr = String(lang || 'ar').toLowerCase() === 'ar';
      const listEl = document.getElementById('att-list');
      if(!listEl) return;
      listEl.innerHTML = '';
      
      const allDocs = App.store.list(this.scope) || [];
      const myDocs = allDocs.filter(function(d){ 
        return String(d.ownerId) === String(window.AttachmentHub.ownerId); 
      });
      
      if(myDocs.length === 0){
        listEl.innerHTML = '<div style="color:#aaa;text-align:center;padding:20px;">' + (isAr ? 'لا توجد مرفقات' : 'No attachments') + '</div>';
        return;
      }
      
      myDocs.forEach(function(doc){
        const div = document.createElement('div');
        div.style.cssText = "display:flex;align-items:center;background:rgba(255,255,255,0.05);padding:8px;border-radius:8px;justify-content:space-between;";
        
        const info = document.createElement('div');
        info.innerHTML = `
          <div style="font-weight:bold;font-size:14px;">${doc.name || 'File'}</div>
          <div style="font-size:11px;color:#888;">${doc.date || ''} - ${Math.round((doc.size||0)/1024)} KB</div>
        `;
        
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '5px';
        
        // Preview Button
        if(doc.dataUrl){
          const btnView = document.createElement('button');
          btnView.className = 'btn';
          btnView.style.padding = '4px 8px';
          btnView.style.background = '#1d4ed8';
          btnView.style.border = '1px solid #1d4ed8';
          btnView.style.color = '#fff';
          btnView.title = isAr ? 'عرض' : 'Preview';
          btnView.textContent = '👁';
          btnView.onclick = function(){ window.AttachmentHub.preview(doc); };
          actions.appendChild(btnView);
        }
        
        // Delete Button
        const btnDel = document.createElement('button');
        btnDel.className = 'btn';
        btnDel.style.padding = '4px 8px';
        btnDel.style.background = '#dc2626';
        btnDel.style.border = '1px solid #dc2626';
        btnDel.style.color = '#fff';
        btnDel.title = isAr ? 'حذف' : 'Delete';
        btnDel.textContent = '✕';
        btnDel.onclick = function(){ window.AttachmentHub.delete(doc.id); };
        actions.appendChild(btnDel);
        
        div.appendChild(info);
        div.appendChild(actions);
        listEl.appendChild(div);
      });
    },
    
    // Save selected files
    saveFiles: function(){
      const fileInput = document.getElementById('att-file');
      if(!fileInput || !fileInput.files.length) return;
      
      const files = Array.from(fileInput.files);
      const self = this;
      let processed = 0;
      
      files.forEach(function(file){
        const reader = new FileReader();
        reader.onload = function(e){
          const dataUrl = e.target.result;
          // Check size limit (450KB)
          const isSmall = file.size <= 450 * 1024;
          
          const doc = {
            id: Date.now() + Math.random().toString().slice(2,8),
            ownerId: self.ownerId,
            name: file.name,
            type: file.type,
            size: file.size,
            date: new Date().toLocaleString(),
            dataUrl: isSmall ? dataUrl : null // Only save data if small
          };
          
          const allDocs = App.store.list(self.scope) || [];
          allDocs.push(doc);
          App.store.set(self.scope, allDocs);
          
          if(!isSmall && typeof toast === 'function') toast('warning', 'File Too Large', 'Metadata saved only (File > 450KB)');
          if(window.logActivity) window.logActivity('Upload', self.scope, file.name);
          
          processed++;
          if(processed === files.length){
            fileInput.value = ''; // Clear input
            self.render();
          }
        };
        reader.readAsDataURL(file);
      });
    },

    clearFiles: function(){
      const lang = (typeof getLang === 'function' ? getLang() : (document.documentElement && document.documentElement.lang) || 'ar');
      const isAr = String(lang || 'ar').toLowerCase() === 'ar';
      if(!confirm(isAr ? 'هل أنت متأكد من حذف كل المرفقات؟' : 'Are you sure you want to delete all attachments?')) return;
      const allDocs = App.store.list(this.scope) || [];
      const keptDocs = allDocs.filter(function(d){
        return String(d.ownerId) !== String(window.AttachmentHub.ownerId);
      });
      App.store.set(this.scope, keptDocs);
      this.render();
      if(window.logActivity) window.logActivity('Clear', this.scope, this.ownerId);
    },
    
    delete: function(id){
      const lang = (typeof getLang === 'function' ? getLang() : (document.documentElement && document.documentElement.lang) || 'ar');
      const isAr = String(lang || 'ar').toLowerCase() === 'ar';
      if(!confirm(isAr ? 'هل تريد حذف هذا المرفق؟' : 'Delete this attachment?')) return;
      const allDocs = App.store.list(this.scope) || [];
      const newDocs = allDocs.filter(function(d){ return d.id !== id; });
      App.store.set(this.scope, newDocs);
      this.render();
      if(window.logActivity) window.logActivity('Delete', this.scope, id);
    },
    
    preview: function(doc){
       // Simple preview in new window or modal
       if(!doc.dataUrl) return;
       var w = window.open("");
       if(doc.type.indexOf('image') >= 0){
         w.document.write('<img src="'+doc.dataUrl+'" style="max-width:100%">');
       } else if(doc.type.indexOf('pdf') >= 0){
         w.document.write('<iframe src="'+doc.dataUrl+'" style="width:100%;height:100vh;border:0"></iframe>');
       } else {
         w.document.write('Preview not supported for this type.');
       }
    }
  };
})();

// ===============================
// User Management & UI Helpers
// ===============================
(function(){
  // User Management
  function setCurrentUser(u){ 
    localStorage.setItem('current_user', JSON.stringify(u || {})); 
  } 
  function getCurrentUser(){ 
    try { return JSON.parse(localStorage.getItem('current_user') || '{}'); } catch(e){ return {}; } 
  }
  
  // Expose to App
  if(window.App){
    App.currentUser = getCurrentUser;
    App.setCurrentUser = setCurrentUser;
  }

  // Toast Notification (Simple Implementation)
  window.toast = function(type, title, msg){
    const div = document.createElement('div');
    div.style.cssText = "position:fixed;bottom:20px;right:20px;padding:12px 20px;background:rgba(15,23,42,0.9);color:white;border-radius:8px;z-index:9999;backdrop-filter:blur(5px);border-left:4px solid " + (type==='success'?'#4ade80':type==='warning'?'#facc15':'#f87171') + ";box-shadow:0 10px 30px rgba(0,0,0,0.5);font-size:14px;";
    div.innerHTML = `<strong style="display:block;margin-bottom:4px">${title}</strong>${msg}`;
    document.body.appendChild(div);
    setTimeout(()=> {
      div.style.opacity = '0';
      div.style.transition = 'opacity 0.5s';
      setTimeout(()=>div.remove(), 500);
    }, 3000);
  };

  // Confirm Dialog (Native Fallback)
  window.confirmDialog = function(opts){
    return new Promise((resolve)=>{
      // You can replace this with a custom modal later
      if(confirm((opts.title ? opts.title + '\n\n' : '') + (opts.message || 'Are you sure?'))) resolve(true);
      else resolve(false);
    });
  };
  window.showProfile = function(){
    var menu = document.getElementById('user-menu');
    if (menu) menu.classList.remove('open');
    var lang = (document.documentElement && document.documentElement.lang) === 'ar' ? 'ar' : 'en';
    var overlay = document.getElementById('profile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'profile-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.display = 'none';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '2000';
      var box = document.createElement('div');
      box.id = 'profile-box';
      box.style.maxWidth = '560px';
      box.style.width = '94vw';
      box.style.background = 'rgba(17,20,50,0.85)';
      box.style.backdropFilter = 'blur(12px)';
      box.style.border = '1px solid rgba(79,172,254,0.25)';
      box.style.borderRadius = '16px';
      box.style.boxShadow = '0 18px 48px rgba(0,0,0,0.55)';
      box.style.padding = '16px';
      var header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.style.marginBottom = '12px';
      var hTitle = document.createElement('div');
      hTitle.id = 'profile-title';
      hTitle.style.color = '#e5e7eb';
      hTitle.style.fontWeight = '600';
      hTitle.style.fontSize = '1.05rem';
      var closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.className = 'btn btn-ghost';
      closeBtn.style.padding = '4px 10px';
      closeBtn.style.borderRadius = '8px';
      closeBtn.onclick = function(){ overlay.style.display = 'none'; };
      header.appendChild(hTitle);
      header.appendChild(closeBtn);
      var grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = '140px 1fr';
      grid.style.gap = '16px';
      var left = document.createElement('div');
      left.style.display = 'flex';
      left.style.flexDirection = 'column';
      left.style.alignItems = 'center';
      left.style.gap = '8px';
      var avatar = document.createElement('div');
      avatar.id = 'profile-avatar';
      avatar.style.width = '120px';
      avatar.style.height = '120px';
      avatar.style.borderRadius = '50%';
      avatar.style.background = 'rgba(255,255,255,0.06)';
      avatar.style.border = '1px solid rgba(255,255,255,0.1)';
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.overflow = 'hidden';
      var img = document.createElement('img');
      img.id = 'profile-avatar-img';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      img.style.objectFit = 'cover';
      avatar.appendChild(img);
      var file = document.createElement('input');
      file.type = 'file';
      file.id = 'profile-avatar-file';
      file.accept = 'image/*';
      file.style.display = 'none';
      var pick = document.createElement('button');
      pick.textContent = lang==='ar'?'تغيير الصورة':'Change Photo';
      pick.className = 'btn btn-ghost';
      pick.style.padding = '6px 10px';
      pick.onclick = function(){ file.click(); };
      left.appendChild(avatar);
      left.appendChild(pick);
      left.appendChild(file);
      var right = document.createElement('div');
      function field(labelKey, id, disabled){
        var wrap = document.createElement('div');
        wrap.style.marginBottom = '8px';
        var lab = document.createElement('div');
        lab.style.color = '#cbd5e1';
        lab.style.fontSize = '12px';
        lab.style.marginBottom = '4px';
        lab.textContent = labelKey;
        var inp = document.createElement('input');
        inp.id = id;
        inp.className = 'form-control';
        inp.style.width = '100%';
        if (disabled) inp.disabled = true;
        wrap.appendChild(lab);
        wrap.appendChild(inp);
        return wrap;
      }
      var fName = field(lang==='ar'?'الاسم':'Name','profile-name', true);
      var fSap = field('SAP ID','profile-sap', true);
      var fCc = field('Cost Center','profile-cc', true);
      var fEmail = field('Email','profile-email');
      var fPhone = field(lang==='ar'?'الجوال':'Phone','profile-phone');
      var fCity = field(lang==='ar'?'المدينة':'City','profile-city');
      var fRegion = field(lang==='ar'?'المنطقة':'Region','profile-region');
      var fRole = field(lang==='ar'?'الدور':'Role','profile-role', true);
      right.appendChild(fName);
      right.appendChild(fSap);
      right.appendChild(fCc);
      right.appendChild(fEmail);
      right.appendChild(fPhone);
      right.appendChild(fCity);
      right.appendChild(fRegion);
      right.appendChild(fRole);
      var actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.justifyContent = 'flex-end';
      actions.style.gap = '8px';
      actions.style.marginTop = '6px';
      var btnSave = document.createElement('button');
      btnSave.id = 'profile-save';
      btnSave.textContent = lang==='ar'?'حفظ':'Save';
      btnSave.className = 'btn btn-primary';
      var btnClose = document.createElement('button');
      btnClose.textContent = lang==='ar'?'إغلاق':'Close';
      btnClose.className = 'btn btn-ghost';
      btnClose.onclick = function(){ overlay.style.display = 'none'; };
      actions.appendChild(btnClose);
      actions.appendChild(btnSave);
      grid.appendChild(left);
      grid.appendChild(right);
      box.appendChild(header);
      box.appendChild(grid);
      box.appendChild(actions);
      overlay.appendChild(box);
      overlay.addEventListener('click', function(e){ if(e.target === overlay){ overlay.style.display = 'none'; } });
      document.body.appendChild(overlay);
      file.addEventListener('change', function(){
        var f = file.files && file.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function(ev){ img.src = ev.target.result; img.setAttribute('data-b64', ev.target.result); };
        r.readAsDataURL(f);
      });
      btnSave.onclick = function(){
        var username = localStorage.getItem('ofs_auth_user') || (typeof getUser==='function' ? getUser() : '') || '';
        var cu = (window.App && App.currentUser ? App.currentUser() : null);
        var sapVal = document.getElementById('profile-sap').value || '';
        var ccVal = document.getElementById('profile-cc').value || '';
        if (!sapVal && cu) sapVal = (cu.sap || cu.sap_id || cu.SAP_ID || cu.SAP || '') || sapVal;
        if (!ccVal && cu) ccVal = (cu.cost_center || cu.costCenter || cu.cc || '') || ccVal;
        var members = App.store.list('members') || [];
        var rec = members.find(function(x){ return x.username === username; });
        var empName = document.getElementById('profile-name').value || '';
        var patch = {
          username: username,
          name: empName,
          sapId: sapVal,
          costCenter: ccVal,
          email: document.getElementById('profile-email').value || '',
          phone: document.getElementById('profile-phone').value || '',
          city: document.getElementById('profile-city').value || '',
          region: document.getElementById('profile-region').value || '',
          role: document.getElementById('profile-role').value || '',
          avatar: document.getElementById('profile-avatar-img').getAttribute('data-b64') || document.getElementById('profile-avatar-img').src || ''
        };
        if (rec && rec.id) {
          rec = App.store.update('members', rec.id, patch) || rec;
        } else {
          rec = App.store.create('members', patch);
        }
        try { if (typeof window.syncToServer==='function') window.syncToServer('/profile', { username: username, profile: patch }); } catch(e){}
        try { if (typeof toast==='function') toast('success', lang==='ar'?'تم الحفظ':'Saved', lang==='ar'?'تم تحديث الملف':'Profile updated'); } catch(e){}
        try { if (typeof applyUserAvatar==='function') applyUserAvatar(); } catch(e){}
        overlay.style.display = 'none';
      };
    }
    var langNow = (document.documentElement && document.documentElement.lang) === 'ar' ? 'ar' : 'en';
    var username = localStorage.getItem('ofs_auth_user') || (typeof getUser==='function' ? getUser() : '') || '';
    var role = localStorage.getItem('auth_role') || localStorage.getItem('role') || '';
    var cu = (window.App && App.currentUser ? App.currentUser() : null);
    var employees = (typeof getAllEmployeesAuto==='function' ? getAllEmployeesAuto() : []);
    var emp = employees.find(function(e){
      var n = (e.name || e.employee_name || e.fullname || '').trim();
      return n && n === username;
    }) || null;
    var members = App.store.list('members') || [];
    var m = members.find(function(x){ return x.username === username; }) || null;
    var displayName = (emp && (emp.name || emp.employee_name || emp.fullname)) || username || (langNow==='ar'?'المستخدم':'User');
    var email = (m && m.email) || (emp && (emp.email || emp.mail)) || '';
    var phone = (m && m.phone) || (emp && (emp.mobile || emp.phone)) || '';
    var city = (m && m.city) || (emp && (emp.city || '')) || '';
    var region = (m && m.region) || (emp && (emp.region || '')) || '';
    var sap = (m && (m.sapId || m.sap || m.sap_id)) || (cu && (cu.sap || cu.sap_id || cu.SAP_ID || cu.SAP)) || (emp && (emp.sap || emp.sap_id || emp.SAP_ID || emp.SAP)) || '';
    var cc = (m && (m.costCenter || m.cost_center || m.cc)) || (cu && (cu.cost_center || cu.costCenter || cu.cc)) || (emp && (emp.cost_center || emp.costCenter || emp.cc)) || '';
    var avatarB64 = (m && m.avatar) || '';
    document.getElementById('profile-title').textContent = langNow==='ar'?'ملفي':'My Profile';
    document.getElementById('profile-name').value = displayName;
    document.getElementById('profile-sap').value = sap;
    document.getElementById('profile-cc').value = cc;
    document.getElementById('profile-email').value = email;
    document.getElementById('profile-phone').value = phone;
    document.getElementById('profile-city').value = city;
    document.getElementById('profile-region').value = region;
    document.getElementById('profile-role').value = role || (emp && (emp.role || '')) || '';
    var imgEl = document.getElementById('profile-avatar-img');
    if (avatarB64) { imgEl.src = avatarB64; imgEl.setAttribute('data-b64', avatarB64); }
    else { imgEl.removeAttribute('src'); imgEl.removeAttribute('data-b64'); imgEl.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'; }
    var ov = document.getElementById('profile-overlay');
    ov.style.display = 'flex';
  };
  window.openSupportTicket = function(){
    var existing = document.getElementById('support-overlay');
    if (existing) { existing.style.display = 'flex'; return; }
    var lang = (document.documentElement && document.documentElement.lang) === 'ar' ? 'ar' : 'en';
    var overlay = document.createElement('div');
    overlay.id = 'support-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';
    var box = document.createElement('div');
    box.style.maxWidth = '520px';
    box.style.width = '94vw';
    box.style.background = 'rgba(17,20,50,0.85)';
    box.style.backdropFilter = 'blur(12px)';
    box.style.border = '1px solid rgba(79,172,254,0.25)';
    box.style.borderRadius = '14px';
    box.style.boxShadow = '0 8px 24px rgba(31,38,135,0.35)';
    box.style.padding = '16px';
    var title = document.createElement('div');
    title.textContent = lang==='ar'?'طلب دعم':'Support Ticket';
    title.style.color = '#e5e7eb';
    title.style.fontWeight = '600';
    title.style.marginBottom = '10px';
    title.style.fontSize = '1rem';
    var nameInput = document.createElement('input');
    nameInput.placeholder = lang==='ar'?'الاسم':'Name';
    nameInput.style.width = '100%';
    nameInput.style.marginBottom = '8px';
    nameInput.className = 'form-control';
    var phoneInput = document.createElement('input');
    phoneInput.placeholder = lang==='ar'?'الجوال':'Mobile';
    phoneInput.style.width = '100%';
    phoneInput.style.marginBottom = '8px';
    phoneInput.className = 'form-control';
    var emailInput = document.createElement('input');
    emailInput.placeholder = lang==='ar'?'الايميل':'Email';
    emailInput.style.width = '100%';
    emailInput.style.marginBottom = '8px';
    emailInput.className = 'form-control';
    var subj = document.createElement('input');
    subj.placeholder = lang==='ar'?'العنوان':'Subject';
    subj.style.width = '100%';
    subj.style.marginBottom = '8px';
    subj.className = 'form-control';
    var cat = document.createElement('select');
    cat.style.width = '100%';
    cat.style.marginBottom = '8px';
    cat.className = 'form-control';
    ['عام','تقني','رصيد/حساب','مرفقات','أخرى'].forEach(function(ar,i){
      var opt = document.createElement('option');
      opt.value = i.toString();
      opt.textContent = lang==='ar'?ar:['General','Technical','Account','Attachments','Other'][i];
      cat.appendChild(opt);
    });
    var attachments = [];
    var attWrap = document.createElement('div');
    attWrap.style.display = 'none';
    attWrap.style.padding = '10px';
    attWrap.style.border = '1px dashed rgba(79,172,254,0.35)';
    attWrap.style.borderRadius = '10px';
    attWrap.style.marginBottom = '8px';
    var attTitle = document.createElement('div');
    attTitle.textContent = lang==='ar'?'المرفقات':'Attachments';
    attTitle.style.color = '#cbd5e1';
    attTitle.style.fontSize = '0.9rem';
    attTitle.style.marginBottom = '8px';
    var attList = document.createElement('div');
    attList.style.display = 'flex';
    attList.style.flexDirection = 'column';
    attList.style.gap = '6px';
    var attActions = document.createElement('div');
    attActions.style.display = 'flex';
    attActions.style.gap = '8px';
    var attBtn = document.createElement('button');
    attBtn.textContent = lang==='ar'?'أضف مرفق':'Add File';
    attBtn.style.background = 'rgba(255,255,255,0.06)';
    attBtn.style.border = '1px solid rgba(255,255,255,0.08)';
    attBtn.style.color = '#fff';
    attBtn.style.padding = '6px 10px';
    attBtn.style.borderRadius = '10px';
    attBtn.style.cursor = 'pointer';
    var attInput = document.createElement('input');
    attInput.type = 'file';
    attInput.multiple = true;
    attInput.style.display = 'none';
    function renderAttachments(){
      attList.innerHTML = '';
      attachments.forEach(function(a, idx){
        var row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.gap = '8px';
        var info = document.createElement('div');
        info.style.color = '#e5e7eb';
        info.style.fontSize = '0.85rem';
        info.textContent = (a.name || 'file') + (a.size ? (' • ' + Math.round(a.size/1024) + 'KB') : '');
        var del = document.createElement('button');
        del.textContent = lang==='ar'?'حذف':'Remove';
        del.style.background = 'rgba(239,68,68,0.15)';
        del.style.border = '1px solid rgba(239,68,68,0.35)';
        del.style.color = '#fecaca';
        del.style.padding = '4px 8px';
        del.style.borderRadius = '8px';
        del.style.cursor = 'pointer';
        del.onclick = function(){ attachments.splice(idx,1); renderAttachments(); };
        row.appendChild(info);
        row.appendChild(del);
        attList.appendChild(row);
      });
    }
    attBtn.onclick = function(){ attInput.click(); };
    attInput.onchange = function(e){
      var files = Array.from(e.target.files || []);
      if (!files.length) return;
      files.forEach(function(f){
        var reader = new FileReader();
        reader.onload = function(ev){
          attachments.push({ name: f.name, size: f.size, type: f.type, data: ev.target.result });
          renderAttachments();
        };
        try { reader.readAsDataURL(f); } catch(err){}
      });
      // reset input to allow re-adding same file
      e.target.value = '';
    };
    attActions.appendChild(attBtn);
    attWrap.appendChild(attTitle);
    attWrap.appendChild(attList);
    attWrap.appendChild(attActions);
    cat.onchange = function(){
      var show = (cat.value === '3');
      attWrap.style.display = show ? 'block' : 'none';
    };
    var desc = document.createElement('textarea');
    desc.placeholder = lang==='ar'?'وصف المشكلة أو الطلب':'Describe your issue or request';
    desc.style.width = '100%';
    desc.style.height = '120px';
    desc.className = 'form-control';
    var btns = document.createElement('div');
    btns.style.marginTop = '12px';
    btns.style.display = 'flex';
    btns.style.justifyContent = 'flex-end';
    btns.style.gap = '8px';
    var cancel = document.createElement('button');
    cancel.textContent = lang==='ar'?'إلغاء':'Cancel';
    cancel.style.background = 'rgba(255,255,255,0.06)';
    cancel.style.border = '1px solid rgba(255,255,255,0.08)';
    cancel.style.color = '#fff';
    cancel.style.padding = '8px 12px';
    cancel.style.borderRadius = '10px';
    cancel.style.cursor = 'pointer';
    cancel.onclick = function(){ document.body.removeChild(overlay); };
    var send = document.createElement('button');
    send.textContent = lang==='ar'?'إرسال':'Send';
    send.style.background = 'rgba(37,99,235,0.5)';
    send.style.border = '1px solid rgba(37,99,235,0.7)';
    send.style.color = '#bfdbfe';
    send.style.padding = '8px 12px';
    send.style.borderRadius = '10px';
    send.style.cursor = 'pointer';
    send.onclick = async function(){
      // التحقق من الحقول المطلوبة
      var name = (nameInput.value || '').trim();
      var subject = (subj.value || '').trim();
      var description = (desc.value || '').trim();
      
      if (!name || !subject || !description) {
        try { 
          toast('error', lang==='ar'?'خطأ':'Error', lang==='ar'?'يرجى ملء جميع الحقول المطلوبة':'Please fill all required fields'); 
        } catch(e){}
        return;
      }
      
      var ticket = { 
        name: name, 
        phone: (phoneInput.value || '').trim(), 
        email: (emailInput.value || '').trim(), 
        subject: subject, 
        category: cat.value, 
        desc: description, 
        attachments: attachments, 
        status: 'new',
        createdAt: Date.now()
      };
      var saved = null;
      try {
        if (window.APIClient && APIClient.tickets && APIClient.tickets.create) {
          saved = await APIClient.tickets.create(ticket);
        }
      } catch(e){
        console.warn('API create ticket failed, will fallback to local storage', e);
      }
      if (!saved) {
        var arr;
        try { arr = JSON.parse(localStorage.getItem('support:tickets') || '[]'); } catch(e){ arr = []; }
        ticket.id = Date.now().toString(36);
        arr.push(ticket);
        localStorage.setItem('support:tickets', JSON.stringify(arr));
      }
      document.body.removeChild(overlay);
      try { toast('success', lang==='ar'?'تم':'Done', lang==='ar'?'تم إرسال الطلب':'Ticket submitted'); } catch(e){}
    };
    btns.appendChild(cancel);
    btns.appendChild(send);
    box.appendChild(title);
    box.appendChild(nameInput);
    box.appendChild(phoneInput);
    box.appendChild(emailInput);
    box.appendChild(subj);
    box.appendChild(cat);
    box.appendChild(attWrap);
    box.appendChild(desc);
    box.appendChild(btns);
    overlay.appendChild(box);
    overlay.addEventListener('click', function(e){ if(e.target === overlay){ document.body.removeChild(overlay); } });
    document.body.appendChild(overlay);
  };
})();
console.log('App.js loaded successfully');
