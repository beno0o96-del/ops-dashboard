(function(){
  function load(src, cb){ var s=document.createElement('script'); s.src=src; s.onload=function(){ cb(true); }; s.onerror=function(){ cb(false); }; document.head.appendChild(s); }
  function ensureXLSX(){
    if (window.XLSX) return;
    var sources=[
      'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
      'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'
    ];
    var i=0; (function next(){ if (window.XLSX || i>=sources.length) return; load(sources[i++], next); })();
  }
  if (!window.XLSX) ensureXLSX();
  window.addEventListener('load', ensureXLSX);
})();
// --- Global Navigation ---
window.toggleSidebarGroup = function(groupId) {
  const group = document.getElementById(groupId);
  if (group) {
    group.classList.toggle('active');
  }
};

window.showSection = function(id) {
  window.__adminActiveSection = id;
  // Hide all sections
  document.querySelectorAll('section[id^="section-"]').forEach(function(s){
    s.style.display = 'none';
  });
  
  // Show target
  var s = document.getElementById('section-' + id);
  if (s) s.style.display = 'block';
  
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(function(n){
    n.classList.remove('active');
  });
  var nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');

  // Trigger render
  if (id === 'employees') { try { renderEmployeesCards(); } catch(e){} }
  else if (id === 'members') { try { renderMembers(); } catch(e){} }
  else if (id === 'roles') { try { renderRoles(); } catch(e){} }
  else if (id === 'messages') { try { renderMessages(); } catch(e){} }
  else if (id === 'complaints') { try { switchComplaintsTab('messages'); } catch(e){} }
  else if (id === 'activity') { try { renderActivityLog(); } catch(e){} }
  else if (id === 'tickets') { try { renderTickets(); } catch(e){} }
  else if (id === 'tasks') { try { renderTasks(); } catch(e){} }
  else if (id === 'violations') { try { renderViolationsDashboard(); } catch(e){} }
  else if (id === 'branches') { try { renderBranchesCoverage(); renderBranchesControl(); renderBranchesTable(); } catch(e){} }
  else if (id === 'settings') { try { renderQuotes(); } catch(e){} try { initSmtpSettings(); } catch(e){} try { initAlertTemplatesSettings(); } catch(e){} }
  else if (id === 'housings') { try { renderHousingsTable(); } catch(e){} }
  else if (id === 'transports') { try { renderTransportsTable(); } catch(e){} }
  else if (id === 'tasks') { try { renderTasks(); } catch(e){} }
  else { 
      // Default behavior or specific cleanups
      var ov = document.getElementById('emp-modal'); 
      if (ov) ov.classList.remove('open'); 
  }
};

function getAdminLang(){
  if (window.App && typeof App.getLang === 'function') return App.getLang();
  return document.documentElement.lang || 'ar';
}

function tAdmin(ar, en){
  return getAdminLang() === 'en' ? en : ar;
}

function rerenderActiveAdminSection(){
  var id = window.__adminActiveSection;
  if (!id) {
    var activeNav = document.querySelector('.nav-item.active[id^="nav-"]');
    if (activeNav) id = String(activeNav.id || '').replace(/^nav-/, '');
  }
  if (!id) return;
  try { window.showSection(id); } catch(_) {}
}

document.addEventListener('app:lang', function(){
  setTimeout(function(){
    rerenderActiveAdminSection();
    try { if (typeof updateTaskBulkState === 'function') updateTaskBulkState(); } catch(_) {}
  }, 0);
});

function initSmtpSettings(){
  if (window.__smtpInited) {
    loadSmtpSettings();
    return;
  }
  window.__smtpInited = true;

  var saveBtn = document.getElementById('smtp-save');
  var testBtn = document.getElementById('smtp-test');
  var smtpLocked = false;

  var lockIds = [
    'smtp-host','smtp-port','smtp-encryption','smtp-mailer',
    'smtp-username','smtp-password','smtp-from-address','smtp-from-name'
  ];
  lockIds.forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.disabled = false;
  });

  var smtpRequest = async function(method, endpoint, data){
    if (!window.APIClient) throw new Error('APIClient missing');
    if (typeof APIClient.request === 'function') return await APIClient.request(method, endpoint, data);
    if (typeof APIClient.fetch === 'function') {
      var response = await APIClient.fetch(endpoint, {
        method: method,
        body: data == null ? undefined : data
      });
      if (response && typeof response === 'object' && 'data' in response && response.data != null) return response.data;
      return response;
    }
    throw new Error('APIClient missing');
  };

  var normalizeEmailForTest = function(raw){
    var value = String(raw || '').trim();
    if (!value) return '';
    value = value.replace(/[\u060C،;\n\r\t]/g, ',');
    var mAny = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (mAny && mAny[0]) return String(mAny[0]).trim();
    var parts = value.split(',').map(function(x){ return String(x || '').trim(); }).filter(Boolean);
    var first = parts.length ? parts[0] : value;
    var m = first.match(/<([^>]+)>/);
    if (m && m[1]) first = String(m[1]).trim();
    return first;
  };

  var isValidEmail = function(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  };

  if (saveBtn) {
    saveBtn.onclick = async function(){
      try {
        var payload = {
          mail_mailer: (document.getElementById('smtp-mailer') && document.getElementById('smtp-mailer').value) || null,
          mail_host: (document.getElementById('smtp-host') && document.getElementById('smtp-host').value || '').trim() || null,
          mail_port: (function(){
            var v = document.getElementById('smtp-port') && document.getElementById('smtp-port').value;
            var n = parseInt(v, 10);
            return isNaN(n) ? null : n;
          })(),
          mail_encryption: (document.getElementById('smtp-encryption') && document.getElementById('smtp-encryption').value) || null,
          mail_username: (document.getElementById('smtp-username') && document.getElementById('smtp-username').value || '').trim() || null,
          mail_from_address: (document.getElementById('smtp-from-address') && document.getElementById('smtp-from-address').value || '').trim() || null,
          mail_from_name: (document.getElementById('smtp-from-name') && document.getElementById('smtp-from-name').value || '').trim() || null,
          alert_recipients: (document.getElementById('smtp-alert-recipients') && document.getElementById('smtp-alert-recipients').value || '').trim() || null
        };
        var passElUnlocked = document.getElementById('smtp-password');
        var passValUnlocked = passElUnlocked ? String(passElUnlocked.value || '') : '';
        if (passValUnlocked.trim()) payload.mail_password = passValUnlocked.trim();

        var passEl = document.getElementById('smtp-password');
        if (passEl) passEl.value = '';

        await smtpRequest('POST', 'settings', payload);
        var st = document.getElementById('smtp-status');
        if (st) st.textContent = 'تم الحفظ';
        if (typeof toast === 'function') toast('success','تم','تم حفظ إعدادات البريد');
        loadSmtpSettings();
      } catch (e) {
        var st2 = document.getElementById('smtp-status');
        if (st2) st2.textContent = 'فشل الحفظ';
        if (typeof toast === 'function') toast('error','خطأ','تعذر حفظ إعدادات البريد' + (e && e.message ? ': ' + e.message : ''));
      }
    };
  }

  if (testBtn) {
    testBtn.onclick = async function(){
      try {
        var recipientsEl = document.getElementById('smtp-alert-recipients');
        var recipientsRaw = String(recipientsEl ? recipientsEl.value : '').trim();
        if (!recipientsRaw) { if (typeof toast === 'function') toast('warning','تنبيه','اكتب بريد/بريدات في Alert Recipients أولًا'); return; }
        var emails = [];
        var found = recipientsRaw.match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/ig) || [];
        found.forEach(function(e){
          var v = String(e || '').trim().toLowerCase();
          if (v && emails.indexOf(v) === -1) emails.push(v);
        });
        if (!emails.length) { if (typeof toast === 'function') toast('warning','تنبيه','صيغة البريد غير صحيحة في Alert Recipients'); return; }
        var noteEl = document.getElementById('smtp-test-message');
        var testMessage = String(noteEl ? noteEl.value : '').trim();
        var filesEl = document.getElementById('smtp-test-attachments');
        var files = filesEl && filesEl.files ? Array.from(filesEl.files) : [];
        var st = document.getElementById('smtp-status');
        if (st) st.textContent = 'جارٍ الإرسال...';
        var payload = new FormData();
        payload.append('to', emails.join(','));
        if (testMessage) payload.append('message', testMessage);
        files.forEach(function(file){
          payload.append('attachments[]', file);
        });
        await smtpRequest('POST', 'settings/test-mail', payload);
        if (filesEl) filesEl.value = '';
        if (st) st.textContent = 'تم إرسال اختبار';
        if (typeof toast === 'function') toast('success','تم','تم إرسال بريد اختبار' + (files.length ? (' مع ' + files.length + ' مرفق') : ''));
      } catch (e) {
        var st2 = document.getElementById('smtp-status');
        if (st2) st2.textContent = 'فشل الإرسال';
        
        var user = String(document.getElementById('smtp-username')?.value || '').trim();
        var host = String(document.getElementById('smtp-host')?.value || '').trim();
        var isGmail = /@gmail\.com$/i.test(user) || host.toLowerCase().includes('gmail');
        
        var errorMsg = 'تعذر إرسال بريد الاختبار';
        if (e && e.message && (e.message.includes('valid email address') || e.message.includes('to field'))) {
          errorMsg = 'تعذر إرسال بريد الاختبار: صيغة بريد المستقبل غير صحيحة';
        } else if (isGmail && e.message && (e.message.includes('535') || e.message.includes('authentication') || e.message.includes('password'))) {
          errorMsg += '\n\nلحسابات Gmail: تأكد من استخدام "كلمة مرور التطبيق" بدلاً من كلمة مرور حسابك العادية.\nيمكنك إنشاء كلمة مرور التطبيق من: myaccount.google.com/apppasswords';
        } else if (e.message) {
          errorMsg += ': ' + e.message;
        }
        
        if (typeof toast === 'function') toast('error','خطأ',errorMsg);
        console.error('Test email failed:', e);
      }
    };
  }

  loadSmtpSettings();
}

async function loadSmtpSettings(){
  try {
    if (!window.APIClient) return;
    var v;
    if (typeof APIClient.request === 'function') v = await APIClient.request('GET', 'settings');
    else if (typeof APIClient.fetch === 'function') {
      var response = await APIClient.fetch('settings', { method: 'GET' });
      v = response && typeof response === 'object' && 'data' in response && response.data != null ? response.data : response;
    } else return;
    var setVal = function(id, val){
      var el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'SELECT') el.value = (val == null ? '' : String(val));
      else el.value = (val == null ? '' : String(val));
    };

    setVal('smtp-host', v.mail_host || '');
    setVal('smtp-port', v.mail_port || '');
    setVal('smtp-encryption', v.mail_encryption || '');
    setVal('smtp-mailer', v.mail_mailer || 'smtp');
    setVal('smtp-username', v.mail_username || '');
    setVal('smtp-from-address', v.mail_from_address || '');
    setVal('smtp-from-name', v.mail_from_name || '');
    setVal('smtp-alert-recipients', v.alert_recipients || '');

    var hint = document.getElementById('smtp-password-hint');
    if (hint) hint.textContent = v.mail_password_set ? 'App Password محفوظ (لن يظهر)' : '';

    var st = document.getElementById('smtp-status');
    if (st && !st.textContent) st.textContent = '';

    try {
      var host = String(v.mail_host || '').trim();
      var mailer = String(v.mail_mailer || '').trim().toLowerCase();
      var enc = String(v.mail_encryption || '').trim().toLowerCase();
      var port = String(v.mail_port || '').trim();
      var user = String(v.mail_username || '').trim();
      var fromAddr = String(v.mail_from_address || '').trim();
      var preferredEmail = fromAddr || user;
      var isGmail = /@gmail\.com$/i.test(preferredEmail);
      var needsFix = false;
      var fix = {};

      if (isGmail) {
        if (host.toLowerCase() !== 'smtp.gmail.com') { fix.mail_host = 'smtp.gmail.com'; needsFix = true; }
        if (mailer !== 'smtp') { fix.mail_mailer = 'smtp'; needsFix = true; }
        if (enc !== 'tls') { fix.mail_encryption = 'tls'; needsFix = true; }
        if (String(port) !== '587') { fix.mail_port = 587; needsFix = true; }
        if (preferredEmail && user !== preferredEmail) { fix.mail_username = preferredEmail; needsFix = true; }
        if (preferredEmail && fromAddr !== preferredEmail) { fix.mail_from_address = preferredEmail; needsFix = true; }
      } else {
        if (/@/.test(host)) { fix.mail_host = ''; needsFix = true; }
      }

      if (needsFix) {
        if (typeof APIClient.request === 'function') await APIClient.request('POST', 'settings', fix);
        else if (typeof APIClient.fetch === 'function') await APIClient.fetch('settings', { method: 'POST', body: fix });
        setVal('smtp-host', fix.mail_host != null ? fix.mail_host : v.mail_host || '');
        setVal('smtp-port', fix.mail_port != null ? fix.mail_port : v.mail_port || '');
        setVal('smtp-encryption', fix.mail_encryption != null ? fix.mail_encryption : v.mail_encryption || '');
        setVal('smtp-mailer', fix.mail_mailer != null ? fix.mail_mailer : v.mail_mailer || 'smtp');
        setVal('smtp-username', fix.mail_username != null ? fix.mail_username : v.mail_username || '');
        setVal('smtp-from-address', fix.mail_from_address != null ? fix.mail_from_address : v.mail_from_address || '');
      }
    } catch (_e) {}
  } catch (e) {
    var st2 = document.getElementById('smtp-status');
    if (st2) st2.textContent = '';
  }
}

function getDefaultAlertTemplates(){
  return [
    {
      key: 'health_expiry',
      title: 'انتهاء الصحية Health Expiry',
      subject: 'تنبيه قرب انتهاء — {اسم المتطلب}',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن التدريب الصحي الخاص بـ الموظف {اسم الموظف} في فرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى إعادة أو تجديد التدريب الصحي قبل تاريخ الانتهاء حسب متطلبات الجهة المختصة.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'tcoe_expiry',
      title: 'انتهاء التدريب العملي T.C.O.E',
      subject: 'تنبيه قرب انتهاء — {اسم المتطلب}',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن التدريب العملي الخاص بـ الموظف {اسم الموظف} في فرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تحديث أو تجديد التدريب العملي قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'permit_expiry_date',
      title: 'تاريخ الانتهاء Expiry Date',
      subject: 'تنبيه قرب انتهاء — {اسم المتطلب}',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن {سياق}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى اتخاذ الإجراء اللازم قبل تاريخ الانتهاء لتجنب المخالفات أو الإيقاف.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'municipality_license',
      title: 'رخصة البلدية',
      subject: 'تنبيه قرب انتهاء — رخصة البلدية',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن رخصة البلدية الخاصة بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى البدء بإجراءات تجديد الرخصة قبل تاريخ الانتهاء لتجنب الإغلاق أو الغرامات.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'civil_defense',
      title: 'الدفاع المدني',
      subject: 'تنبيه قرب انتهاء — تصريح الدفاع المدني',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن تصريح الدفاع المدني الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى التأكد من تجديد التصريح واستيفاء متطلبات الدفاع المدني قبل تاريخ الانتهاء لتجنب الإيقاف.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'delivery_permit',
      title: 'تصريح التوصيل',
      subject: 'تنبيه قرب انتهاء — تصريح التوصيل',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن تصريح التوصيل الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد تصريح التوصيل قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'permit_24h',
      title: 'تصريح 24 ساعة',
      subject: 'تنبيه قرب انتهاء — تصريح 24 ساعة',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن تصريح 24 ساعة الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد التصريح قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'outdoor_seating_permit',
      title: 'تصريح الجلسات الخارجية',
      subject: 'تنبيه قرب انتهاء — تصريح الجلسات الخارجية',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن تصريح الجلسات الخارجية الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد التصريح قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'advertising_permits',
      title: 'التصاريح الإعلانية',
      subject: 'تنبيه قرب انتهاء — التصاريح الإعلانية',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن {سياق}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد التصريح الإعلاني قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    },
    {
      key: 'clean_contract',
      title: 'عقد النظافة',
      subject: 'تنبيه قرب انتهاء — عقد النظافة',
      body: 'تنبيه رسمي:\n\nنود إشعاركم بأن عقد النظافة الخاص بفرع {اسم الفرع}\nسينتهي بتاريخ: {تاريخ الانتهاء}.\n\nالمتبقي على الانتهاء: {عدد الأيام}.\n\nحالة التنبيه: خطر مخالفة\nتحتاج إجراء: يرجى تجديد عقد النظافة قبل تاريخ الانتهاء.\n\nهذا تنبيه آلي صادر من نظام OFS.\n\nفي حال تم التجديد، يرجى تحديث البيانات في النظام.'
    }
  ];
}

function initAlertTemplatesSettings(){
  var listEl = document.getElementById('alert-templates-list');
  var saveBtn = document.getElementById('alert-template-save');
  var addBtn = document.getElementById('alert-template-add');
  var resetBtn = document.getElementById('alert-template-reset');
  var statusEl = document.getElementById('alert-template-status');
  if (!listEl || !saveBtn || !addBtn || !resetBtn) return;

  var templates = [];
  var isCurrentUserAdmin = function(){
    try {
      if (window.App && typeof App.isAdmin === 'function' && App.isAdmin()) return true;
      var role = '';
      if (window.App && typeof App.getRole === 'function') role = App.getRole();
      else if (window.App && typeof App.currentUser === 'function') role = (App.currentUser() || {}).role || '';
      else role = localStorage.getItem('auth_role') || localStorage.getItem('role') || '';
      role = String(role || '').toLowerCase();
      return role === 'admin' || role === 'administrator' || role === 'مدير النظام';
    } catch(_) { return false; }
  };
  var request = async function(method, endpoint, data){
    if (!window.APIClient) throw new Error('APIClient missing');
    if (typeof APIClient.request === 'function') return await APIClient.request(method, endpoint, data);
    if (typeof APIClient.fetch === 'function') {
      var response = await APIClient.fetch(endpoint, { method: method, body: data == null ? undefined : data });
      return response && typeof response === 'object' && 'data' in response && response.data != null ? response.data : response;
    }
    throw new Error('APIClient missing');
  };

  var normalize = function(item){
    return {
      key: String(item && item.key || '').trim(),
      title: String(item && item.title || '').trim(),
      subject: String(item && item.subject || '').trim(),
      body: String(item && item.body || '').trim(),
      threshold_days: String(item && item.threshold_days || '').trim(),
      manual_recipients: String(item && item.manual_recipients || '').trim()
    };
  };

  var render = function(){
    var canManage = isCurrentUserAdmin();
    saveBtn.disabled = !canManage;
    addBtn.disabled = !canManage;
    resetBtn.disabled = !canManage;
    if (!canManage) {
      saveBtn.classList.add('opacity-50','cursor-not-allowed');
      addBtn.classList.add('opacity-50','cursor-not-allowed');
      resetBtn.classList.add('opacity-50','cursor-not-allowed');
    } else {
      saveBtn.classList.remove('opacity-50','cursor-not-allowed');
      addBtn.classList.remove('opacity-50','cursor-not-allowed');
      resetBtn.classList.remove('opacity-50','cursor-not-allowed');
    }
    listEl.innerHTML = templates.map(function(t, idx){
      return '<div class="p-3 rounded-xl border border-slate-700/60 bg-slate-900/40" data-idx="' + idx + '">' +
        '<div class="grid md:grid-cols-2 gap-2">' +
        '<div><label class="block text-slate-400 text-xs mb-1">عدد الأيام للتنبيه</label><input class="form-control alert-t-threshold" placeholder="60,30,15,0" value="' + (t.threshold_days || '').replace(/"/g,'&quot;') + '"' + (canManage ? '' : ' disabled') + '></div>' +
        '<div><label class="block text-slate-400 text-xs mb-1">إيميلات يدوية لهذا القالب</label><input class="form-control alert-t-recipients" placeholder="owner@example.com, audit@example.com" value="' + (t.manual_recipients || '').replace(/"/g,'&quot;') + '"' + (canManage ? '' : ' disabled') + '></div>' +
        '<input class="form-control alert-t-key" placeholder="key (مثال: municipality_license)" value="' + (t.key || '').replace(/"/g,'&quot;') + '"' + (canManage ? '' : ' disabled') + '>' +
        '<input class="form-control alert-t-title" placeholder="العنوان الظاهر" value="' + (t.title || '').replace(/"/g,'&quot;') + '"' + (canManage ? '' : ' disabled') + '>' +
        '<input class="form-control md:col-span-2 alert-t-subject" placeholder="Subject" value="' + (t.subject || '').replace(/"/g,'&quot;') + '"' + (canManage ? '' : ' disabled') + '>' +
        '<textarea class="form-control md:col-span-2 alert-t-body" rows="5" placeholder="Body"' + (canManage ? '' : ' disabled') + '>' + (t.body || '') + '</textarea>' +
        '<div class="md:col-span-2 flex justify-end"><button type="button" class="btn alert-t-remove' + (canManage ? '' : ' opacity-50 cursor-not-allowed') + '"' + (canManage ? '' : ' disabled') + '>حذف</button></div>' +
        '</div></div>';
    }).join('');
  };

  var bindListEvents = function(){
    listEl.addEventListener('input', function(e){
      if (!isCurrentUserAdmin()) return;
      var card = e.target.closest('[data-idx]');
      if (!card) return;
      var idx = parseInt(card.getAttribute('data-idx'), 10);
      if (isNaN(idx) || !templates[idx]) return;
      templates[idx].threshold_days = String(card.querySelector('.alert-t-threshold')?.value || '').trim();
      templates[idx].manual_recipients = String(card.querySelector('.alert-t-recipients')?.value || '').trim();
      templates[idx].key = String(card.querySelector('.alert-t-key')?.value || '').trim();
      templates[idx].title = String(card.querySelector('.alert-t-title')?.value || '').trim();
      templates[idx].subject = String(card.querySelector('.alert-t-subject')?.value || '').trim();
      templates[idx].body = String(card.querySelector('.alert-t-body')?.value || '').trim();
    });
    listEl.addEventListener('click', function(e){
      var btn = e.target.closest('.alert-t-remove');
      if (!btn) return;
      if (!isCurrentUserAdmin()) {
        if (typeof toast === 'function') toast('warning','تنبيه','الحذف مسموح فقط للأدمن');
        return;
      }
      if (!window.confirm('هل أنت متأكد من حذف هذا القالب؟')) return;
      var card = e.target.closest('[data-idx]');
      if (!card) return;
      var idx = parseInt(card.getAttribute('data-idx'), 10);
      if (isNaN(idx)) return;
      templates.splice(idx, 1);
      render();
    });
  };

  if (!window.__alertTemplatesInited) {
    window.__alertTemplatesInited = true;
    bindListEvents();
    addBtn.onclick = function(){
      if (!isCurrentUserAdmin()) { if (typeof toast === 'function') toast('warning','تنبيه','التعديل مسموح فقط للأدمن'); return; }
      templates.push({ key: '', title: '', subject: 'تنبيه قرب انتهاء — {اسم المتطلب}', body: '', threshold_days: '', manual_recipients: '' });
      render();
    };
    resetBtn.onclick = function(){
      if (!isCurrentUserAdmin()) { if (typeof toast === 'function') toast('warning','تنبيه','التعديل مسموح فقط للأدمن'); return; }
      templates = getDefaultAlertTemplates().map(normalize);
      render();
      if (statusEl) statusEl.textContent = 'تمت إعادة القوالب الافتراضية';
    };
    saveBtn.onclick = async function(){
      try {
        if (!isCurrentUserAdmin()) {
          if (typeof toast === 'function') toast('warning','تنبيه','الحفظ مسموح فقط للأدمن');
          return;
        }
        var clean = templates.map(normalize).filter(function(t){ return t.key; });
        clean = clean.map(function(t){
          var thresholdValues = (String(t.threshold_days || '').match(/-?\d+/g) || [])
            .map(function(v){ return parseInt(v, 10); })
            .filter(function(v){ return !isNaN(v) && v >= 0; });
          var normalizedThresholds = Array.from(new Set(thresholdValues)).sort(function(a, b){ return b - a; });
          var emails = Array.from(new Set((String(t.manual_recipients || '').match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/ig) || []).map(function(e){
            return String(e || '').trim().toLowerCase();
          })));
          return Object.assign({}, t, {
            threshold_days: normalizedThresholds.join(','),
            manual_recipients: emails.join(',')
          });
        });
        await request('POST', 'settings', {
          alert_templates_json: JSON.stringify(clean)
        });
        templates = clean;
        render();
        if (statusEl) statusEl.textContent = 'تم حفظ القوالب';
        if (typeof toast === 'function') toast('success','تم','تم حفظ قوالب التنبيهات');
      } catch (e) {
        if (statusEl) statusEl.textContent = 'فشل حفظ القوالب';
        if (typeof toast === 'function') toast('error','خطأ','تعذر حفظ قوالب التنبيهات' + (e && e.message ? ': ' + e.message : ''));
      }
    };
  }

  (async function(){
    try {
      var settings = await request('GET', 'settings');
      var stored = [];
      try { stored = JSON.parse(String(settings && settings.alert_templates_json || '[]')); } catch(_) { stored = []; }
      var legacyThreshold = String(settings && settings.alert_threshold_days || '').trim();
      var legacyRecipients = String(settings && settings.alert_manual_recipients || '').trim();
      var defaults = getDefaultAlertTemplates().map(normalize);
      var map = {};
      defaults.forEach(function(t){ map[t.key] = t; });
      if (Array.isArray(stored)) {
        stored.map(normalize).forEach(function(t){ if (t.key) map[t.key] = t; });
      }
      Object.keys(map).forEach(function(k){
        if (!map[k].threshold_days) map[k].threshold_days = legacyThreshold || '60,30,15,0';
        if (!map[k].manual_recipients) map[k].manual_recipients = legacyRecipients || '';
      });
      if (Array.isArray(stored)) {
        stored.map(normalize).forEach(function(t){
          if (t.key && !map[t.key]) {
            if (!t.threshold_days) t.threshold_days = legacyThreshold || '60,30,15,0';
            if (!t.manual_recipients) t.manual_recipients = legacyRecipients || '';
            map[t.key] = t;
          }
        });
      }
      templates = Object.keys(map).map(function(k){ return map[k]; });
      render();
      if (statusEl && !statusEl.textContent) statusEl.textContent = '';
    } catch (e) {
      templates = getDefaultAlertTemplates().map(normalize);
      render();
      if (statusEl) statusEl.textContent = '';
    }
  })();
}

function renderDashboardKPIs(){
  var section = document.getElementById('section-dashboard');
  if (!section) return;
  var v = [];
  try { v = (App.store && App.store.list) ? (App.store.list('violations') || []) : []; } catch(e){}
  var sum = 0, open = 0, closed = 0;
  v.forEach(function(r){
    var amt = Number(r.amount || r.fine || r.total || 0);
    if (!isNaN(amt)) sum += amt;
    var paid = (r.paid === true) || (String(r.paid).toLowerCase() === 'true') || (String(r.status||'').toLowerCase().indexOf('closed') >= 0);
    if (paid) closed++; else open++;
  });
  var elF = section.querySelector('#kpi-fines');
  if (elF) elF.textContent = sum.toLocaleString();
  var elO = section.querySelector('#kpi-open');
  if (elO) elO.textContent = open;
  var elC = section.querySelector('#kpi-closed');
  if (elC) elC.textContent = closed;
  var emps = [];
  try { emps = (App.store && App.store.list) ? (App.store.list('employees') || []) : []; } catch(e){}
  var withDates = 0, valid = 0;
  emps.forEach(function(e){
    var ds = e.healthExpiry || e.healthCardExp || e.health_expiry;
    if (!ds) return;
    var d = new Date(ds);
    if (isNaN(d.getTime())) return;
    withDates++;
    var now = new Date(); var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (d >= today) valid++;
  });
  var elH = section.querySelector('#kpi-health');
  if (elH) elH.textContent = withDates ? (Math.round((valid / withDates) * 100) + '%') : '0%';
}
window.addEventListener('load', function(){ try { renderDashboardKPIs(); } catch(e){} });

/* ===============================
   SAFE STORAGE LAYER (NON-DESTRUCTIVE)
================================ */

window.DB_KEYS = {
  branches: 'db:branches',
  licenses: 'db:licenses',
  housings: 'db:housings',
  transports: 'db:transports',
  violations: 'db:violations',
  employees: 'db:employees',
  tasks: 'db:tasks',
  training_sessions: 'db:training_sessions',
  training_metrics: 'db:training_metrics',
  members: 'db:members',
  roles: 'db:roles',
  activity: 'db:activity',
  quotes: 'db:quotes'
};

window.renderQuotes = function() {
  const list = safeList(DB_KEYS.quotes) || [];
  const tbody = document.querySelector('#quotes-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-slate-500">لا توجد عبارات مضافة</td></tr>';
    return;
  }

  list.forEach(q => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors';
    tr.innerHTML = `
      <td class="p-2 text-right text-slate-300 font-medium">${q.ar || '-'}</td>
      <td class="p-2 text-left text-slate-400 font-mono text-xs">${q.en || '-'}</td>
      <td class="p-2 text-center">
        <button class="text-red-400 hover:text-red-300 transition-colors p-1" onclick="deleteQuote('${q.id}')" title="حذف">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};  // (closing IIFE already ended – nothing to add here)

window.saveQuote = function() {
  const ar = document.getElementById('quote-ar').value.trim();
  const en = document.getElementById('quote-en').value.trim();

  if (!ar && !en) {
    if(typeof toast === 'function') toast('warning', 'حقل فارغ', 'يرجى إدخال العبارة بالعربية أو الإنجليزية');
    return;
  }

  const quote = {
    id: 'q_' + Date.now(),
    ar: ar,
    en: en,
    created_at: new Date().toISOString()
  };

  upsertItem(DB_KEYS.quotes, quote);
  
  // Clear inputs
  document.getElementById('quote-ar').value = '';
  document.getElementById('quote-en').value = '';
  
  renderQuotes();
  if(typeof toast === 'function') toast('success', 'تم الإضافة', 'تم إضافة العبارة بنجاح');
};

window.deleteQuote = function(id) {
  if(!confirm('هل أنت متأكد من حذف هذه العبارة؟')) return;
  
  const list = safeList(DB_KEYS.quotes) || [];
  const filtered = list.filter(q => q.id !== id);
  safeSave(DB_KEYS.quotes, filtered);
  
  renderQuotes();
  if(typeof toast === 'function') toast('success', 'تم الحذف', 'تم حذف العبارة');
};

/* ===============================
   EMPLOYEES FUNCTIONS
================================ */

window.renderEmployeesCards = function() {
  const container = document.getElementById('employees-grid');
  const search = document.getElementById('employee-search')?.value.toLowerCase();
  const branchFilter = document.getElementById('branch-filter')?.value;
  const statusFilter = document.getElementById('status-filter')?.value;
  
  if (!container) return;
  
  let data = window.App?.store?.list('employees') || [];
  
  // Filter data
  const filtered = data.filter(item => {
    const matchSearch = !search || (item.name && item.name.toLowerCase().includes(search)) || 
                       (item.position && item.position.toLowerCase().includes(search));
    const matchBranch = !branchFilter || (item.branch && item.branch === branchFilter);
    const matchStatus = !statusFilter || (item.status && item.status === statusFilter);
    return matchSearch && matchBranch && matchStatus;
  });
  
  // Update stats
  document.getElementById('total-employees').textContent = data.length;
  document.getElementById('active-employees').textContent = data.filter(e => e.status === 'active').length;
  document.getElementById('pending-employees').textContent = data.filter(e => e.status === 'pending').length;
  document.getElementById('expired-employees').textContent = data.filter(e => e.status === 'expired').length;
  
  // Render cards
  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center p-8 text-gray-500">لا توجد نتائج</div>';
    return;
  }
  
  filtered.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'emp-card';
    
    const initials = emp.name ? emp.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    const statusClass = {
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'expired': 'bg-red-100 text-red-800'
    }[emp.status] || 'bg-gray-100 text-gray-800';
    
    const branchName = {
      'riyadh': 'الرياض',
      'jeddah': 'جدة',
      'dammam': 'الدمام'
    }[emp.branch] || emp.branch;
    
    card.innerHTML = `
      <div class="emp-photo">${initials}</div>
      <div class="emp-name">${emp.name || 'غير محدد'}</div>
      <div class="emp-role">${emp.position || 'غير محدد'}</div>
      <div class="emp-detail">
        <span>الفرع:</span>
        <span>${branchName}</span>
      </div>
      <div class="emp-detail">
        <span>الحالة:</span>
        <span class="px-2 py-1 rounded-full text-xs ${statusClass}">${emp.status || 'غير محدد'}</span>
      </div>
      <div class="emp-actions">
        <button class="btn-sm btn-primary-sm" onclick="editEmployee('${emp.id}')">تعديل</button>
        <button class="btn-sm btn-secondary-sm" onclick="viewEmployee('${emp.id}')">عرض</button>
      </div>
    `;
    
    container.appendChild(card);
  });
};

window.openEmployeeModal = function() {
  document.getElementById('employee-modal').style.display = 'flex';
  document.getElementById('employee-form').reset();
};

window.closeEmployeeModal = function() {
  document.getElementById('employee-modal').style.display = 'none';
};

window.saveEmployee = function() {
  const name = document.getElementById('emp-name').value;
  const sap = document.getElementById('emp-sap').value;
  const position = document.getElementById('emp-position').value;
  const branch = document.getElementById('emp-branch').value;
  const status = document.getElementById('emp-status').value;
  const joinDate = document.getElementById('emp-join-date').value;
  
  if (!name) {
    alert('يرجى إدخال اسم الموظف');
    return;
  }
  
  const employee = {
    id: 'emp_' + Date.now(),
    name: name,
    sap: sap,
    position: position,
    branch: branch,
    status: status,
    joinDate: joinDate,
    created_at: new Date().toISOString()
  };
  
  if (window.App?.store) {
    window.App.store.add('employees', employee);
  }
  
  closeEmployeeModal();
  renderEmployeesCards();
  
  if (typeof toast === 'function') {
    toast('success', 'تم الحفظ', 'تم إضافة الموظف بنجاح');
  }
};

/* ===============================
   HOUSINGS FUNCTIONS
================================ */

window.renderGrid = function() {
  const container = document.getElementById('housings-grid');
  const search = document.getElementById('search-housings')?.value.toLowerCase();
  const cityFilter = document.getElementById('filter-city')?.value;
  const statusFilter = document.getElementById('filter-status')?.value;
  
  if (!container) return;
  
  let data = window.App?.store?.list('housings') || [];
  
  // Filter data
  const filtered = data.filter(item => {
    const matchSearch = !search || (item.name && item.name.toLowerCase().includes(search)) || 
                       (item.location && item.location.toLowerCase().includes(search));
    const matchCity = !cityFilter || (item.city && item.city === cityFilter);
    const matchStatus = !statusFilter || (item.status && item.status === statusFilter);
    return matchSearch && matchCity && matchStatus;
  });
  
  // Update stats
  document.getElementById('total-housings').textContent = data.length;
  document.getElementById('available-housings').textContent = data.filter(h => h.status === 'available').length;
  document.getElementById('occupied-housings').textContent = data.filter(h => h.status === 'occupied').length;
  document.getElementById('maintenance-housings').textContent = data.filter(h => h.status === 'maintenance').length;
  
  // Render cards
  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center p-8 text-gray-500">لا توجد نتائج</div>';
    return;
  }
  
  filtered.forEach(housing => {
    const card = document.createElement('div');
    card.className = 'housing-card';
    
    const statusClass = {
      'available': 'status-available',
      'occupied': 'status-occupied',
      'maintenance': 'status-maintenance'
    }[housing.status] || 'bg-gray-100 text-gray-800';
    
    const statusText = {
      'available': 'متاح',
      'occupied': 'مشغول',
      'maintenance': 'صيانة'
    }[housing.status] || housing.status;
    
    const cityName = {
      'riyadh': 'الرياض',
      'jeddah': 'جدة',
      'dammam': 'الدمام'
    }[housing.city] || housing.city;
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="font-semibold text-lg">${housing.name || 'غير محدد'}</h3>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">المدينة:</span>
          <span>${cityName}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">العنوان:</span>
          <span>${housing.address || 'غير محدد'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">السعة:</span>
          <span>${housing.capacity || 0} شخص</span>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="btn-sm btn-primary-sm" onclick="editHousing('${housing.id}')">تعديل</button>
        <button class="btn-sm btn-secondary-sm" onclick="viewHousing('${housing.id}')">عرض</button>
      </div>
    `;
    
    container.appendChild(card);
  });
};

window.openHousingModal = function() {
  document.getElementById('housing-modal').style.display = 'flex';
  document.getElementById('housing-form').reset();
};

window.closeHousingModal = function() {
  document.getElementById('housing-modal').style.display = 'none';
};

window.saveHousing = function() {
  const name = document.getElementById('housing-name').value;
  const city = document.getElementById('housing-city').value;
  const status = document.getElementById('housing-status').value;
  const capacity = document.getElementById('housing-capacity').value;
  const address = document.getElementById('housing-address').value;
  
  if (!name) {
    alert('يرجى إدخال اسم السكن');
    return;
  }
  
  const housing = {
    id: 'housing_' + Date.now(),
    name: name,
    city: city,
    status: status,
    capacity: parseInt(capacity) || 1,
    address: address,
    created_at: new Date().toISOString()
  };
  
  if (window.App?.store) {
    window.App.store.add('housings', housing);
  }
  
  closeHousingModal();
  renderGrid();
  
  if (typeof toast === 'function') {
    toast('success', 'تم الحفظ', 'تم إضافة السكن بنجاح');
  }
};

window.editHousing = function(id) {
  const data = window.App?.store?.list('housings') || [];
  const housing = data.find(h => h.id === id);
  if (housing) {
    openHousingModal();
    document.getElementById('housing-name').value = housing.name || '';
    document.getElementById('housing-city').value = housing.city || 'riyadh';
    document.getElementById('housing-status').value = housing.status || 'available';
    document.getElementById('housing-capacity').value = housing.capacity || 1;
    document.getElementById('housing-address').value = housing.address || '';
  }
};

window.viewHousing = function(id) {
  const data = window.App?.store?.list('housings') || [];
  const housing = data.find(h => h.id === id);
  if (housing) {
    alert(`تفاصيل السكن:\nالاسم: ${housing.name}\nالمدينة: ${housing.city}\nالعنوان: ${housing.address}\nالحالة: ${housing.status}\nالسعة: ${housing.capacity} شخص`);
  }
};


/* ===============================
   MEMBERS FUNCTIONS
================================ */

window.renderMembers = async function() {
  console.log('renderMembers called');
  const tbody = document.getElementById('members-table-body');
  if (!tbody) {
    console.warn('members-table-body not found');
    return;
  }

  // Use APIClient.users.list() instead of local storage
  let members = [];
  try {
    members = await listMembers(); // Now returns a Promise
    console.log('Members from listMembers():', members.length, members);
  } catch (e) {
    console.warn("Failed to get members from API or local storage", e);
    members = [];
  }

  if (!Array.isArray(members)) members = [];

  tbody.innerHTML = '';
  if (members.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8 text-slate-500">' + tAdmin('لا يوجد أعضاء لعرضهم.', 'No members to display.') + '</td></tr>';
    return;
  }

  members.forEach(member => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/30';
    const roleClass = `role-${member.role || 'default'}`;
    
    tr.innerHTML = `
      <td class="px-6 py-4 font-medium text-white">${member.name}</td>
      <td class="px-6 py-4 text-slate-400">${member.email}</td>
      <td class="px-6 py-4"><span class="role-badge ${roleClass}">${member.role}</span></td>
      <td class="px-6 py-4 text-slate-400">${member.branch_access && member.branch_access.length > 0 ? member.branch_access.join(', ') : tAdmin('الكل', 'All')}</td>
      <td class="px-6 py-4 text-right">
        <button onclick="openMemberModal('${member.id}')" class="font-medium text-blue-500 hover:underline">${tAdmin('تعديل', 'Edit')}</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.openMemberModal = async (memberId = null) => {
  const modal = document.getElementById('member-modal');
  const form = document.getElementById('member-form');
  const modalTitle = document.getElementById('member-modal-title');
  const passwordInput = document.getElementById('member-password');
  
  form.reset();
  document.getElementById('member-id').value = '';
  
  // Populate branches
  const branchSelect = document.getElementById('member-branch-access');
  branchSelect.innerHTML = '';
  const branches = await window.App.store.list('branches') || [];
  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch.id;
    option.textContent = branch.name_ar || branch.name_en;
    branchSelect.appendChild(option);
  });

  if (memberId) {
    modalTitle.textContent = tAdmin('تعديل عضو', 'Edit Member');
    // Use APIClient to fetch from /api/users-list which has fallback data
    let users = [];
    try {
      users = await APIClient.request('GET', 'users-list') || [];
      console.log('Users for modal:', users.length, users);
    } catch (error) {
      console.warn('Error fetching users for modal:', error);
      users = [];
    }
    const user = users.find(u => u.id === memberId);
    if (user) {
      document.getElementById('member-id').value = user.id;
      document.getElementById('member-name').value = user.name;
      document.getElementById('member-email').value = user.email;
      document.getElementById('member-role').value = user.role;
      
      if (user.branch_access && Array.isArray(user.branch_access)) {
        Array.from(branchSelect.options).forEach(option => {
          if (user.branch_access.includes(option.value)) {
            option.selected = true;
          }
        });
      }
    }
    passwordInput.placeholder = tAdmin('اتركه فارغاً لعدم التغيير', 'Leave empty to keep unchanged');
  } else {
    modalTitle.textContent = tAdmin('إضافة عضو جديد', 'Add New Member');
    passwordInput.placeholder = "";
  }
  
  modal.style.display = 'flex';
};

window.closeMemberModal = () => {
  document.getElementById('member-modal').style.display = 'none';
};

window.syncMembers = async () => {
    if (typeof toast !== 'function') return;
    toast('info', 'بدء المزامنة', 'جاري مزامنة بيانات الأعضاء...');
    try {
        // Use local storage instead of API
        const members = listMembers();
        console.log('syncMembers - using local members:', members.length);
        // No need to set to store since listMembers already gets from store
        renderMembers();
        toast('success', 'اكتملت المزامنة', 'تم تحديث بيانات الأعضاء بنجاح.');
    } catch (error) {
        console.error('Sync failed:', error);
        toast('error', 'فشلت المزامنة', 'تعذر مزامنة بيانات الأعضاء.');
    }
};

document.getElementById('member-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const memberId = document.getElementById('member-id').value;
  const name = document.getElementById('member-name').value;
  const email = document.getElementById('member-email').value;
  const password = document.getElementById('member-password').value;
  const role = document.getElementById('member-role').value;
  const branchAccess = Array.from(document.getElementById('member-branch-access').selectedOptions).map(opt => opt.value);

  const memberData = {
    id: memberId || `member_${Date.now()}`,
    name,
    email,
    role,
    branch_access: branchAccess,
  };

  if (password) {
    memberData.password = password;
  }

  try {
    // Use local storage instead of API
    console.log('Saving member to local storage:', memberData);
    upsertMember(memberData);
    renderMembers();
    closeMemberModal();
    if (typeof toast === 'function') toast('success', 'تم الحفظ', 'تم حفظ بيانات العضو بنجاح.');
  } catch (error) {
    console.error('Failed to save member:', error);
    if (typeof toast === 'function') toast('error', 'فشل الحفظ', 'لم يتم حفظ بيانات العضو.');
  }
});


/* ===============================
   LICENSES FUNCTIONS
================================ */

window.renderLicenses = async function() {
  const grid = document.getElementById('licenses-grid');
  if (!grid) return;

  const search = document.getElementById('license-search').value.toLowerCase();
  const typeFilter = document.getElementById('license-type-filter').value;
  const statusFilter = document.getElementById('license-status-filter').value;

  let licenses = [];
  try {
    licenses = await window.App.api.list('licenses');
    if (licenses) window.App.store.set('licenses', licenses);
  } catch (e) {
    console.warn("API fetch failed for licenses, using local cache", e);
    licenses = window.App.store.list('licenses');
  }
  
  if (!Array.isArray(licenses)) licenses = [];

  const filtered = licenses.filter(lic => {
    const expiryDate = new Date(lic.expiry_date);
    const today = new Date();
    const daysDiff = (expiryDate - today) / (1000 * 60 * 60 * 24);

    let status = 'active';
    if (daysDiff < 0) status = 'expired';
    else if (daysDiff <= 30) status = 'expiring_soon';

    const matchSearch = !search || lic.name.toLowerCase().includes(search) || (lic.number && lic.number.includes(search));
    const matchType = typeFilter === 'all' || lic.type === typeFilter;
    const matchStatus = statusFilter === 'all' || status === statusFilter;

    return matchSearch && matchType && matchStatus;
  });

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center p-8 text-slate-500">' + tAdmin('لا توجد رخص تطابق الفلتر.', 'No licenses match the current filter.') + '</div>';
    return;
  }

  filtered.forEach(lic => {
    const card = document.createElement('div');
    card.className = 'glass-card p-4 flex flex-col justify-between';
    
    const expiryDate = new Date(lic.expiry_date);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    let statusClass = 'bg-green-500/20 text-green-300';
    let statusText = tAdmin('سارية (' + daysDiff + ' يوم متبقي)', 'Active (' + daysDiff + ' days left)');
    if (daysDiff < 0) {
      statusClass = 'bg-red-500/20 text-red-300';
      statusText = tAdmin('منتهية منذ ' + Math.abs(daysDiff) + ' يوم', 'Expired ' + Math.abs(daysDiff) + ' days ago');
    } else if (daysDiff <= 30) {
      statusClass = 'bg-yellow-500/20 text-yellow-300';
      statusText = tAdmin('قرب الانتهاء (' + daysDiff + ' يوم متبقي)', 'Expiring soon (' + daysDiff + ' days left)');
    }

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-bold text-lg text-white">${lic.name}</h3>
          <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${statusText}</span>
        </div>
        <p class="text-sm text-slate-400 mb-1">${tAdmin('النوع', 'Type')}: ${lic.type}</p>
        <p class="text-sm text-slate-400">${tAdmin('رقم', 'Number')}: ${lic.number || '-'}</p>
      </div>
      <div class="text-xs text-slate-500 mt-4">
        ${tAdmin('تاريخ الإصدار', 'Issue Date')}: ${new Date(lic.issue_date).toLocaleDateString()} <br>
        ${tAdmin('تاريخ الانتهاء', 'Expiry Date')}: ${expiryDate.toLocaleDateString()}
      </div>
    `;
    grid.appendChild(card);
  });
};


/* ===============================
   BRANCHES FUNCTIONS
================================ */

window.renderBranches = async function() {
  const grid = document.getElementById('branches-grid');
  if (!grid) return;

  let branches = [];
  try {
    branches = await window.App.api.list('branches');
    if (branches) window.App.store.set('branches', branches);
  } catch (e) {
    console.warn("API fetch failed for branches, using local cache", e);
    branches = window.App.store.list('branches');
  }

  if (!Array.isArray(branches)) branches = [];

  grid.innerHTML = '';
  if (branches.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center p-8 text-slate-500">' + tAdmin('لا توجد فروع لعرضها.', 'No branches to display.') + '</div>';
    return;
  }

  branches.forEach(branch => {
    const card = document.createElement('div');
    card.className = 'glass-card p-5';
    
    const statusClasses = {
      active: 'bg-green-500/20 text-green-300',
      inactive: 'bg-red-500/20 text-red-300',
      maintenance: 'bg-yellow-500/20 text-yellow-300'
    };
    const statusTexts = {
      active: tAdmin('نشط', 'Active'),
      inactive: tAdmin('غير نشط', 'Inactive'),
      maintenance: tAdmin('صيانة', 'Maintenance')
    };

    card.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-xl font-bold text-white">${getAdminLang() === 'en' ? (branch.name_en || branch.name_ar) : (branch.name_ar || branch.name_en)}</h3>
        <span class="text-xs px-2 py-1 rounded-full ${statusClasses[branch.status] || ''}">${statusTexts[branch.status] || branch.status}</span>
      </div>
      <p class="text-sm text-slate-400 mb-4">${branch.city || ''}, ${branch.region || ''}</p>
      <div class="text-sm text-slate-300 space-y-2">
        <p><i class="fas fa-user-tie fa-fw mr-2 text-slate-500"></i> ${branch.manager_name || tAdmin('غير محدد', 'Not specified')}</p>
        <p><i class="fas fa-phone fa-fw mr-2 text-slate-500"></i> ${branch.phone || tAdmin('غير محدد', 'Not specified')}</p>
      </div>
      <div class="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
        <button onclick="openBranchModal('${branch.id}')" class="text-blue-400 hover:text-blue-300 transition">
          ${tAdmin('تعديل', 'Edit')} <i class="fas fa-edit ml-1"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
};

window.openBranchModal = async (branchId = null) => {
  const modal = document.getElementById('branch-modal');
  const form = document.getElementById('branch-form');
  const modalTitle = document.getElementById('branch-modal-title');
  
  form.reset();
  document.getElementById('branch-id').value = '';
  switchTab(null, 'basic-info');

  if (branchId) {
    modalTitle.textContent = tAdmin('تعديل فرع', 'Edit Branch');
    const branches = await window.App.store.list('branches') || [];
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      document.getElementById('branch-id').value = branch.id;
      document.getElementById('branch-name_ar').value = branch.name_ar;
      document.getElementById('branch-name_en').value = branch.name_en;
      document.getElementById('branch-status').value = branch.status;
      document.getElementById('branch-manager_name').value = branch.manager_name;
      document.getElementById('branch-phone').value = branch.phone;
      document.getElementById('branch-region').value = branch.region;
      document.getElementById('branch-city').value = branch.city;
      document.getElementById('branch-google_maps_url').value = branch.google_maps_url;
    }
  } else {
    modalTitle.textContent = tAdmin('إضافة فرع جديد', 'Add New Branch');
  }
  
  modal.style.display = 'flex';
};

window.closeBranchModal = () => {
  document.getElementById('branch-modal').style.display = 'none';
};

window.switchTab = (event, tabName) => {
  if (event) {
    const tabButtons = event.target.parentElement.children;
    for (let i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove('active');
    }
    event.target.classList.add('active');
  }

  const tabContents = document.getElementById('branch-modal').querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
};

document.getElementById('branch-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const branchId = document.getElementById('branch-id').value;
  
  const branchData = {
    id: branchId || `branch_${Date.now()}`,
    name_ar: document.getElementById('branch-name_ar').value,
    name_en: document.getElementById('branch-name_en').value,
    status: document.getElementById('branch-status').value,
    manager_name: document.getElementById('branch-manager_name').value,
    phone: document.getElementById('branch-phone').value,
    region: document.getElementById('branch-region').value,
    city: document.getElementById('branch-city').value,
    google_maps_url: document.getElementById('branch-google_maps_url').value,
  };

  try {
    // Use local storage instead of API
    console.log('Saving branch to local storage:', branchData);
    window.App.store.upsert('branches', branchData);
    renderBranches();
    closeBranchModal();
    if (typeof toast === 'function') toast('success', 'تم الحفظ', 'تم حفظ بيانات الفرع بنجاح.');
  } catch (error) {
    console.error('Failed to save branch:', error);
    if (typeof toast === 'function') toast('error', 'فشل الحفظ', 'لم يتم حفظ بيانات الفرع.');
  }
});


// Note: These functions are adapted from violations.html and integrated into the admin dashboard context.

window.renderViolationsDashboard = async function() {
  const section = document.getElementById('section-violations');
  if (!section) return;

  let rows = [];
  try {
    rows = await window.App.api.list('violations');
    if (rows) window.App.store.set('violations', rows);
  } catch (e) {
    console.warn("API fetch failed for violations, using local cache", e);
    rows = window.App.store.list('violations');
  }

  if (!Array.isArray(rows)) rows = [];

  const accessibleRows = rows.filter(r => {
    if (typeof window.canAccessBranch !== 'function') return true;
    return window.canAccessBranch(r.branch);
  });

  const normalizedRows = accessibleRows.map(r => ({
    ...r,
    paid: (r.paid === true || String(r.paid).toLowerCase() === 'true'),
    amount: Number(r.amount || 0),
    region: r.region || tAdmin('الرياض', 'Riyadh'),
    displayNo: r.vio_no || r.id || '-'
  }));

  // Populate Region Filter
  const filterSelect = section.querySelector('#region-filter');
  let filteredRows = normalizedRows;

  if (filterSelect) {
    const regions = [...new Set(normalizedRows.map(r => r.region))].sort();
    const currentVal = filterSelect.value;
    
    const existingOpts = Array.from(filterSelect.options).map(o => o.value).filter(v => v !== 'all');
    const optionsChanged = existingOpts.length !== regions.length || !existingOpts.every((v, i) => v === regions[i]);

    if (optionsChanged) {
      filterSelect.innerHTML = '<option value="all" class="bg-slate-800 text-slate-200">' + tAdmin('كل المناطق', 'All Regions') + '</option>';
      regions.forEach(reg => {
        const opt = document.createElement('option');
        opt.value = reg;
        opt.textContent = reg;
        opt.className = 'bg-slate-800 text-slate-200';
        filterSelect.appendChild(opt);
      });
      if (regions.includes(currentVal)) {
        filterSelect.value = currentVal;
      }
    }
    
    if (filterSelect.value !== 'all') {
      filteredRows = normalizedRows.filter(r => r.region === filterSelect.value);
    }
  }

  updateViolationsKPIs(filteredRows);
  renderViolationsTable(filteredRows);
  renderViolationsCharts(filteredRows);
};

function updateViolationsKPIs(rows) {
  const section = document.getElementById('section-violations');
  if (!section) return;

  const normalizeDigits = (value) => {
    const s = String(value ?? '');
    return s
      .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  };

  const parseAmount = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const s = normalizeDigits(value).replace(/,/g, '').trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const isPaid = (r) => {
    if (!r) return false;
    if (r.paid === true) return true;
    const paidStr = String(r.paid ?? '').trim().toLowerCase();
    if (paidStr === 'true' || paidStr === '1' || paidStr === 'yes') return true;
    if (paidStr === 'false' || paidStr === '0' || paidStr === '' || paidStr === 'no') return false;
    const statusStr = String(r.status ?? r.payment_status ?? '').trim().toLowerCase();
    return statusStr.includes('paid') || statusStr.includes('closed');
  };

  let open = 0;
  let closed = 0;
  let sum = 0;
  rows.forEach((r) => {
    if (isPaid(r)) closed++;
    else open++;
    sum += parseAmount(r.amount ?? r.fine ?? r.total);
  });

  const elFines = section.querySelector('#vio-kpi-fines');
  if (elFines) elFines.textContent = sum.toLocaleString();

  const elClosed = section.querySelector('#vio-kpi-closed');
  if (elClosed) elClosed.textContent = closed;

  const elOpen = section.querySelector('#vio-kpi-open');
  if (elOpen) elOpen.textContent = open;
}

function renderViolationsTable(rows) {
  const section = document.getElementById('section-violations');
  if (!section) return;
  
  const tbody = section.querySelector('#violations-table-body') || section.querySelector('#vio-table');
  if (!tbody) return;

  // Simple pagination (can be enhanced)
  const page = 1;
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedRows = rows.slice(start, end);

  tbody.innerHTML = '';
  if (paginatedRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center p-8 text-slate-500">' + tAdmin('لا توجد مخالفات تطابق الفلتر الحالي.', 'No violations match the current filter.') + '</td></tr>';
    return;
  }

  paginatedRows.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-white/5 transition border-b border-slate-700 last:border-0';
    const statusClass = r.paid ? 'text-green-400' : 'text-red-400';
    const statusText = r.paid ? tAdmin('مدفوعة', 'Paid') : tAdmin('مفتوحة', 'Open');

    tr.innerHTML = `
      <td class="p-3 text-sm text-slate-300">${r.displayNo}</td>
      <td class="p-3 text-sm text-slate-300">${r.branch || '-'}</td>
      <td class="p-3 text-sm text-slate-300">${r.type || '-'}</td>
      <td class="p-3 text-sm font-mono text-amber-400">${r.amount.toLocaleString()}</td>
      <td class="p-3 text-sm"><span class="${statusClass}">${statusText}</span></td>
      <td class="p-3 text-sm text-slate-400">${new Date(r.date).toLocaleDateString()}</td>
      <td class="p-3 text-sm text-slate-400">${r.region}</td>
      <td class="p-3">
        <div class="flex items-center justify-center gap-2">
          <button class="p-2 bg-slate-500/20 hover:bg-slate-500/40 text-slate-400 rounded transition" onclick="viewViolation('${r.id}')" title="${tAdmin('عرض', 'View')}">👁</button>
          <button class="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-500 rounded transition" onclick="editViolation('${r.id}')" title="${tAdmin('تعديل', 'Edit')}">✏</button>
          <button class="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded transition" onclick="confirmDeleteViolation('${r.id}')" title="${tAdmin('حذف', 'Delete')}">🗑</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderViolationsCharts(rows) {
    // Placeholder for chart rendering logic if ApexCharts is available
    // Example:
    // if (window.ApexCharts) {
    //   const chartEl = document.getElementById('violations-chart');
    //   if(chartEl) {
    //      // ... chart logic
    //   }
    // }
}

window.openViolationModal = function(id = null) {
  const modal = document.getElementById('violation-modal');
  const form = document.getElementById('violation-form');
  const modalTitle = document.getElementById('violation-modal-title');
  
  form.reset();
  document.getElementById('violation-id').value = '';

  if (id) {
    modalTitle.textContent = 'تعديل مخالفة';
    const violation = window.App.store.get('violations', id);
    if (violation) {
      document.getElementById('violation-id').value = violation.id;
      document.getElementById('violation-type').value = violation.type;
      document.getElementById('violation-amount').value = violation.amount;
      document.getElementById('violation-date').value = violation.date;
      document.getElementById('violation-branch').value = violation.branch;
      document.getElementById('violation-paid').checked = violation.paid;
    }
  } else {
    modalTitle.textContent = 'إضافة مخالفة جديدة';
  }
  
  modal.classList.add('open');
};

window.closeViolationModal = function() {
  document.getElementById('violation-modal').classList.remove('open');
};

window.saveViolation = async function() {
  try {
    const branchEl = document.getElementById('vio-branch');
    const typeEl = document.getElementById('vio-type');
    const amountEl = document.getElementById('vio-amount');
    const missing = [];
    if (!branchEl || !branchEl.value.trim()) missing.push('الفرع');
    if (!typeEl || !typeEl.value.trim()) missing.push('النوع/الوصف');
    const amt = amountEl ? parseFloat(amountEl.value) : NaN;
    if (!amountEl || isNaN(amt)) missing.push('المبلغ');
    [branchEl, typeEl, amountEl].forEach(function(el){ if(el){ el.classList.remove('border-red-500'); }});
    if (missing.length) {
      [branchEl, typeEl, amountEl].forEach(function(el){ if(el && (!el.value || !el.value.trim())){ try{ el.classList.add('border-red-500'); }catch(_){} }});
      if (typeof toast === 'function') toast('warning', 'حقول مطلوبة', 'حقول مطلوبة: ' + missing.join('، '));
      return;
    }

    const data = {
      branch: branchEl.value.trim(),
      cost_center: document.getElementById('vio-cost-center')?.value || '',
      vio_no: document.getElementById('vio-number')?.value || '',
      efaa_no: document.getElementById('vio-efaa')?.value || '',
      payment_no: document.getElementById('vio-payment')?.value || '',
      date: document.getElementById('vio-date')?.value || '',
      type: typeEl.value.trim(),
      description: document.getElementById('vio-type')?.value || '',
      amount: amt,
      paid: document.getElementById('vio-paid')?.value === 'true' || document.getElementById('vio-paid')?.value === 'paid',
      region: document.getElementById('vio-region')?.value || '',
      appeal_status: document.getElementById('vio-appeal')?.value || '',
      appeal_number: document.getElementById('vio-appeal-number')?.value || '',
      appeal_date: document.getElementById('vio-appeal-date')?.value || '',
      finance_date: document.getElementById('vio-finance-date')?.value || ''
    };

    let result;
    if (window.__vioEditingId) {
      result = await window.APIClient.violations.update(window.__vioEditingId, data);
      if (typeof toast === 'function') toast('success', 'تم التحديث', 'تم تحديث المخالفة بنجاح');
    } else {
      result = await window.APIClient.violations.create(data);
      if (typeof toast === 'function') toast('success', 'تم الحفظ', 'تم حفظ المخالفة بنجاح');
    }

    try {
      const violationId = window.__vioEditingId || (result && (result.id || (result.data && result.data.id)));
      if (violationId && typeof window.vioUploadQueuedAttachments === 'function') {
        await window.vioUploadQueuedAttachments(violationId);
      }
    } catch(_){}

    try {
      if (window.App && App.store && typeof App.store.set === 'function') {
        const list = await window.APIClient.violations.list();
        App.store.set('violations', list);
      }
    } catch(_){}

    window.closeModal('vio-modal');
    window.__vioEditingId = null;
    if (typeof window.renderViolationsTableAPI === 'function') {
      window.renderViolationsTableAPI();
    } else if (typeof renderViolationsDashboard === 'function') {
      renderViolationsDashboard();
    }
  } catch (error) {
    console.error('Save Violation Error:', error);
    if (typeof toast === 'function') toast('error', 'خطأ', 'فشل حفظ المخالفة: ' + (error.message || ''));
  }
};

window.editViolation = function(id) {
  openViolationModal(id);
};

window.viewViolation = function(id) {
    const violation = window.App.store.get('violations', id);
    if(violation) {
        const details = `
            النوع: ${violation.type}
            المبلغ: ${violation.amount}
            التاريخ: ${violation.date}
            الفرع: ${violation.branch}
            الحالة: ${violation.paid ? 'مدفوعة' : 'مفتوحة'}
        `;
        alert('تفاصيل المخالفة:\n' + details);
    }
};

window.confirmDeleteViolation = function(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المخالفة نهائياً؟')) {
        deleteViolation(id);
    }
};

async function deleteViolation(id) {
    try {
        await window.App.api.delete('violations', id);
        window.App.store.delete('violations', id);
        if (typeof toast === 'function') toast('success', 'تم الحذف', 'تم حذف المخالفة بنجاح');
        try { if (typeof vioNotify === 'function') vioNotify('success','حذف','تم حذف المخالفة'); } catch(_){}
        renderViolationsDashboard();
    } catch (error) {
        console.error('Delete Violation Error:', error);
        if (typeof toast === 'function') toast('error', 'خطأ', 'فشل حذف المخالفة: ' + (error.message || ''));
    }
}

window.editEmployee = function(id) {
  // Implementation for editing employee
  const data = window.App?.store?.list('employees') || [];
  const employee = data.find(e => e.id === id);
  if (employee) {
    openEmployeeModal();
    document.getElementById('emp-name').value = employee.name || '';
    document.getElementById('emp-sap').value = employee.sap || '';
    document.getElementById('emp-position').value = employee.position || '';
    document.getElementById('emp-branch').value = employee.branch || 'riyadh';
    document.getElementById('emp-status').value = employee.status || 'active';
    document.getElementById('emp-join-date').value = employee.joinDate || '';
  }
};

window.viewEmployee = function(id) {
  // Implementation for viewing employee details
  const data = window.App?.store?.list('employees') || [];
  const employee = data.find(e => e.id === id);
  if (employee) {
    alert(`تفاصيل الموظف:\nالاسم: ${employee.name}\nالوظيفة: ${employee.position}\nالفرع: ${employee.branch}\nالحالة: ${employee.status}`);
  }
};

// Bind Quote Events
document.addEventListener('DOMContentLoaded', () => {
  const btnAdd = document.getElementById('quote-add');
  if (btnAdd) btnAdd.onclick = window.saveQuote;

  const btnClear = document.getElementById('quote-clear');
  if (btnClear) {
    btnClear.onclick = () => {
      document.getElementById('quote-ar').value = '';
      document.getElementById('quote-en').value = '';
    };
  }
});

window.safeList = function (key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

window.safeSave = function (key, list) {
  localStorage.setItem(key, JSON.stringify(list));
};

window.vioReadAttachmentMap = function(){
  try {
    const raw = localStorage.getItem('db:violation_attachments');
    const map = raw ? JSON.parse(raw) : {};
    return map && typeof map === 'object' ? map : {};
  } catch(_) {
    return {};
  }
};

window.vioWriteAttachmentMap = function(map){
  try { localStorage.setItem('db:violation_attachments', JSON.stringify(map || {})); } catch(_) {}
};

window.vioNormalizeAttachment = function(item){
  if (!item || typeof item !== 'object') return null;
  const normalized = Object.assign({}, item);
  normalized.name = normalized.name || normalized.file_name || 'attachment';
  normalized.type = normalized.type || normalized.mime_type || '';
  normalized.size = Number(normalized.size || normalized.file_size || 0) || 0;
  normalized.db_id = normalized.db_id || normalized.id || normalized.attachment_id || '';
  normalized.path = normalized.path || normalized.file_path || '';
  normalized.url = normalized.url || normalized.previewUrl || normalized.file_url || '';
  if (!normalized.url && normalized.path) {
    const cleanPath = String(normalized.path).replace(/^\/+/, '');
    normalized.url = /^https?:\/\//i.test(cleanPath)
      ? cleanPath
      : '/' + (cleanPath.indexOf('storage/') === 0 ? cleanPath : ('storage/' + cleanPath));
  }
  normalized.persisted = normalized.persisted !== false && (!!normalized.db_id || !!normalized.url || !!normalized.path);
  return normalized;
};

window.vioMergeAttachmentLists = function(){
  const merged = [];
  const seen = new Set();
  Array.prototype.slice.call(arguments).forEach(function(list){
    (Array.isArray(list) ? list : []).forEach(function(item){
      const normalized = window.vioNormalizeAttachment(item);
      if (!normalized) return;
      const key = String(normalized.db_id || '') || [normalized.url || '', normalized.name || '', normalized.path || ''].join('|');
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(normalized);
    });
  });
  return merged;
};

window.vioGetSavedAttachments = function(id, attachments){
  const storedMap = window.vioReadAttachmentMap();
  const stored = id ? storedMap[id] || [] : [];
  const record = (window.App && App.store && typeof App.store.get === 'function' && id)
    ? App.store.get('violations', id)
    : null;
  const recordAttachments = record ? [].concat(record.attachments || [], record.files || []) : [];
  return window.vioMergeAttachmentLists(attachments, recordAttachments, stored);
};

window.vioPersistSavedAttachments = function(id, attachments){
  if (!id) return [];
  const normalized = window.vioMergeAttachmentLists(attachments);
  const map = window.vioReadAttachmentMap();
  map[id] = normalized;
  window.vioWriteAttachmentMap(map);
  try {
    if (window.App && App.store && typeof App.store.list === 'function' && typeof App.store.set === 'function') {
      const list = App.store.list('violations') || [];
      const next = list.map(function(v){
        if (String(v && v.id) !== String(id)) return v;
        return Object.assign({}, v, { attachments: normalized });
      });
      App.store.set('violations', next);
    }
  } catch(_) {}
  return normalized;
};

window.getViolationAttachmentCount = function(id){
  try {
    return window.vioGetSavedAttachments(id).length;
  } catch {
    return 0;
  }
};

window.showViolationAttachments = function(id, attachments, title){
  try {
    const atts = window.vioGetSavedAttachments(id, attachments);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    const box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '760px';
    const head = document.createElement('div');
    head.className = 'modal-header';
    const titleEl = document.createElement('div');
    titleEl.textContent = title || 'المرفقات';
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    const close = document.createElement('button');
    close.className = 'modal-close';
    close.textContent = '×';
    close.onclick = function(){ document.body.removeChild(overlay); };
    head.appendChild(titleEl);
    head.appendChild(actions);
    head.appendChild(close);
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.style.maxHeight = '70vh';
    body.style.overflowY = 'auto';
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(200px,1fr))';
    grid.style.gap = '12px';
    if (!atts.length) {
      const empty = document.createElement('div');
      empty.style.color = '#94a3b8';
      empty.textContent = 'لا توجد مرفقات';
      body.appendChild(empty);
    } else {
      atts.forEach(function(a){
        a = window.vioNormalizeAttachment(a) || a;
        const card = document.createElement('div');
        card.style.border = '1px solid #334155';
        card.style.borderRadius = '8px';
        card.style.padding = '8px';
        card.style.position = 'relative';
        const del = document.createElement('button');
        del.className = 'btn';
        del.textContent = '×';
        del.style.position = 'absolute';
        del.style.top = '6px';
        del.style.right = '6px';
        del.style.padding = '2px 8px';
        del.onclick = async function(e){
          e.preventDefault();
          e.stopPropagation();
          const ok = await window.confirmDialog({
            title: 'حذف المرفق',
            message: 'هل أنت متأكد من حذف هذا المرفق؟',
            confirmText: 'حذف',
            cancelText: 'إلغاء'
          });
          if (!ok) return;
          try {
            if (id && a.db_id && window.APIClient && APIClient.special && APIClient.special.violations && typeof APIClient.special.violations.deleteAttachment === 'function') {
              await APIClient.special.violations.deleteAttachment(id, a.db_id);
            }
          } catch(err) {
            if (typeof toast === 'function') toast('error', 'خطأ', (err && err.message) ? err.message : 'تعذر حذف المرفق');
            return;
          }
          const current = window.vioGetSavedAttachments(id).filter(function(x){
            const normalized = window.vioNormalizeAttachment(x) || {};
            if (a.db_id && normalized.db_id) return String(normalized.db_id) !== String(a.db_id);
            return !((normalized.url || '') === (a.url || '') && (normalized.name || '') === (a.name || ''));
          });
          window.vioPersistSavedAttachments(id, current);
          document.body.removeChild(overlay);
          window.showViolationAttachments(id, current, title);
        };
        const name = document.createElement('div');
        name.style.color = '#cbd5e1';
        name.style.fontSize = '12px';
        name.style.marginBottom = '6px';
        name.textContent = a.name || 'file';
        const area = document.createElement('div');
        if (a.url && String(a.type||'').indexOf('image') === 0) {
          const img = document.createElement('img');
          img.src = a.url;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '6px';
          area.appendChild(img);
        } else if (a.url) {
          const previewBtn = document.createElement('button');
          previewBtn.className = 'btn btn-icon-sm';
          previewBtn.innerHTML = '👁️';
          previewBtn.title = 'معاينة الملف';
          previewBtn.setAttribute('data-tooltip', 'معاينة الملف');
          previewBtn.onclick = function(e){
            e.preventDefault();
            window.vioOpenAttachmentViewer(a);
          };
          area.appendChild(previewBtn);
        } else {
          const span = document.createElement('div');
          span.style.color = '#94a3b8';
          span.textContent = 'لا يوجد رابط';
          area.appendChild(span);
        }
        if (a.url) {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.gap = '6px';
          row.style.marginTop = '8px';
          const dl = document.createElement('a');
          dl.className = 'btn btn-icon-sm';
          dl.innerHTML = '📥';
          dl.href = a.url;
          dl.download = a.name || 'attachment';
          dl.title = 'تحميل الملف';
          dl.setAttribute('data-tooltip', 'تحميل الملف');
          const open = document.createElement('a');
          open.className = 'btn btn-icon-sm';
          open.innerHTML = '🔗';
          open.href = a.url;
          open.target = '_blank';
          open.title = 'فتح في نافذة جديدة';
          open.setAttribute('data-tooltip', 'فتح في نافذة جديدة');
          const printBtn = document.createElement('button');
          printBtn.className = 'btn btn-icon-sm';
          printBtn.innerHTML = '🖨️';
          printBtn.title = 'طباعة الملف';
          printBtn.setAttribute('data-tooltip', 'طباعة الملف');
          printBtn.onclick = function(e){
            e.preventDefault();
            window.vioPrintAttachment(a);
          };
          row.appendChild(open);
          row.appendChild(printBtn);
          row.appendChild(dl);
          area.appendChild(row);
        }
        card.appendChild(del);
        card.appendChild(name);
        card.appendChild(area);
        grid.appendChild(card);
      });
      body.appendChild(grid);
    }
    const foot = document.createElement('div');
    foot.className = 'modal-footer';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'إغلاق';
    btn.onclick = function(){ document.body.removeChild(overlay); };
    foot.appendChild(btn);
    box.appendChild(head);
    box.appendChild(body);
    box.appendChild(foot);
    overlay.appendChild(box);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) { document.body.removeChild(overlay); }});
    document.body.appendChild(overlay);
  } catch(_){}
};

window.vioNotify = function(type, title, message){
  const host = document.getElementById('vio-notices');
  if (!host) return;
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.justifyContent = 'space-between';
  row.style.padding = '8px 10px';
  row.style.border = '1px solid #334155';
  row.style.borderRadius = '8px';
  row.style.background = type === 'success' ? '#064e3b' : (type === 'error' ? '#7f1d1d' : '#1e293b');
  row.style.color = '#e2e8f0';
  const txt = document.createElement('div');
  txt.textContent = (title ? (title + ' — ') : '') + (message || '');
  const x = document.createElement('button');
  x.className = 'btn';
  x.textContent = '×';
  x.onclick = function(){ host.removeChild(row); };
  row.appendChild(txt);
  row.appendChild(x);
  host.insertBefore(row, host.firstChild);
  setTimeout(function(){ try{ host.removeChild(row); }catch(_){ } }, 5000);
};

window.confirmDialog = function(opts){
  var title = (opts && opts.title) || 'تأكيد الحذف';
  var message = (opts && opts.message) || 'هل أنت متأكد من حذف هذا السجل؟';
  var confirmText = (opts && opts.confirmText) || 'حذف';
  var cancelText = (opts && opts.cancelText) || 'إلغاء';
  return new Promise(function(resolve){
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    var box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '460px';
    var head = document.createElement('div');
    head.className = 'modal-header';
    var t = document.createElement('div');
    t.textContent = title;
    var close = document.createElement('button');
    close.className = 'modal-close';
    close.textContent = '×';
    close.onclick = function(){ document.body.removeChild(overlay); resolve(false); };
    head.appendChild(t);
    head.appendChild(close);
    var body = document.createElement('div');
    body.className = 'modal-body';
    var msg = document.createElement('div');
    msg.style.color = '#cbd5e1';
    msg.style.lineHeight = '1.8';
    msg.textContent = message;
    body.appendChild(msg);
    var foot = document.createElement('div');
    foot.className = 'modal-footer';
    var btnCancel = document.createElement('button');
    btnCancel.className = 'btn';
    btnCancel.textContent = cancelText;
    btnCancel.onclick = function(){ document.body.removeChild(overlay); resolve(false); };
    var btnConfirm = document.createElement('button');
    btnConfirm.className = 'btn btn-danger';
    btnConfirm.textContent = confirmText;
    btnConfirm.onclick = function(){ document.body.removeChild(overlay); resolve(true); };
    foot.appendChild(btnCancel);
    foot.appendChild(btnConfirm);
    box.appendChild(head);
    box.appendChild(body);
    box.appendChild(foot);
    overlay.appendChild(box);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) { document.body.removeChild(overlay); resolve(false); }});
    document.body.appendChild(overlay);
  });
};

window.__vioPendingAttachments = window.__vioPendingAttachments || [];
window.__vioAttachmentViewer = window.__vioAttachmentViewer || { overlay: null, media: null, zoomValue: null, title: null, current: null, scale: 1 };

window.vioLoadEditorAttachments = function(violationId){
  const saved = violationId ? window.vioGetSavedAttachments(violationId) : [];
  window.__vioPendingAttachments = saved.map(function(item){
    const normalized = window.vioNormalizeAttachment(item) || {};
    normalized.status = normalized.status || 'ready';
    normalized.persisted = true;
    normalized.file = null;
    normalized.previewUrl = normalized.previewUrl || normalized.url || '';
    return normalized;
  });
  try { window.vioRenderPendingAttachments(); } catch(_) {}
};

window.vioResetPendingAttachments = function(keepSaved){
  const violationId = window.__vioEditingId || '';
  try {
    window.__vioPendingAttachments = keepSaved && violationId
      ? window.vioGetSavedAttachments(violationId).map(function(item){
          const normalized = window.vioNormalizeAttachment(item) || {};
          normalized.status = 'ready';
          normalized.persisted = true;
          normalized.file = null;
          normalized.previewUrl = normalized.previewUrl || normalized.url || '';
          return normalized;
        })
      : [];
  } catch(_) {
    window.__vioPendingAttachments = [];
  }
  try { window.vioRenderPendingAttachments(); } catch(_) {}
};

window.vioEnsureAttachmentViewer = function(){
  const state = window.__vioAttachmentViewer || {};
  if (state.overlay && state.media && state.zoomValue && state.title) return state;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '1300';
  const box = document.createElement('div');
  box.className = 'modal-content';
  box.style.maxWidth = '90vw';
  box.style.width = '980px';
  box.style.height = '85vh';
  box.style.display = 'flex';
  box.style.flexDirection = 'column';

  const head = document.createElement('div');
  head.className = 'modal-header';
  head.style.gap = '8px';
  const title = document.createElement('div');
  title.style.flex = '1';
  title.style.color = '#e2e8f0';
  title.style.fontSize = '14px';
  title.textContent = 'معاينة المرفق';
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '6px';
  actions.style.alignItems = 'center';

  const zoomOut = document.createElement('button');
  zoomOut.className = 'btn';
  zoomOut.textContent = '−';
  const zoomValue = document.createElement('span');
  zoomValue.style.minWidth = '56px';
  zoomValue.style.textAlign = 'center';
  zoomValue.style.color = '#cbd5e1';
  zoomValue.style.fontSize = '12px';
  zoomValue.textContent = '100%';
  const zoomIn = document.createElement('button');
  zoomIn.className = 'btn';
  zoomIn.textContent = '+';
  const zoomReset = document.createElement('button');
  zoomReset.className = 'btn';
  zoomReset.textContent = '100%';
  const printBtn = document.createElement('button');
  printBtn.className = 'btn';
  printBtn.textContent = 'طباعة';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn';
  saveBtn.textContent = 'حفظ';
  const close = document.createElement('button');
  close.className = 'modal-close';
  close.textContent = '×';

  actions.appendChild(zoomOut);
  actions.appendChild(zoomValue);
  actions.appendChild(zoomIn);
  actions.appendChild(zoomReset);
  actions.appendChild(printBtn);
  actions.appendChild(saveBtn);

  head.appendChild(title);
  head.appendChild(actions);
  head.appendChild(close);

  const body = document.createElement('div');
  body.className = 'modal-body';
  body.style.flex = '1';
  body.style.minHeight = '0';
  body.style.background = '#020617';
  body.style.border = '1px solid #1e293b';
  body.style.borderRadius = '12px';
  body.style.overflow = 'auto';
  body.style.display = 'flex';
  body.style.alignItems = 'center';
  body.style.justifyContent = 'center';
  body.style.padding = '12px';

  const media = document.createElement('div');
  media.style.transformOrigin = 'center center';
  media.style.transition = 'transform .15s ease';
  media.style.maxWidth = '100%';
  media.style.maxHeight = '100%';
  body.appendChild(media);

  box.appendChild(head);
  box.appendChild(body);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const setScale = function(scale){
    const next = Math.max(0.25, Math.min(4, Number(scale || 1)));
    state.scale = next;
    media.style.transform = 'scale(' + next + ')';
    zoomValue.textContent = Math.round(next * 100) + '%';
  };

  const closeViewer = function(){
    overlay.classList.remove('open');
    state.current = null;
  };

  close.onclick = closeViewer;
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeViewer(); });
  zoomIn.onclick = function(){ setScale((state.scale || 1) + 0.2); };
  zoomOut.onclick = function(){ setScale((state.scale || 1) - 0.2); };
  zoomReset.onclick = function(){ setScale(1); };
  printBtn.onclick = function(){ if (typeof window.vioPrintAttachment === 'function') window.vioPrintAttachment(state.current); };
  saveBtn.onclick = function(){ if (typeof window.vioSaveAttachment === 'function') window.vioSaveAttachment(state.current); };

  state.overlay = overlay;
  state.media = media;
  state.zoomValue = zoomValue;
  state.title = title;
  state.setScale = setScale;
  state.close = closeViewer;
  window.__vioAttachmentViewer = state;
  return state;
};

window.vioGetAttachmentSource = function(item){
  if (!item) return '';
  return String(item.url || item.previewUrl || '');
};

window.vioResolveAttachmentResponse = function(res){
  const data = (res && res.data && typeof res.data === 'object') ? res.data : {};
  const path = String((res && res.path) || data.path || data.file_path || '').trim();
  let url = String((res && res.url) || data.url || '').trim();
  if (!url && path) {
    const cleanPath = path.replace(/^\/+/, '');
    const storagePath = cleanPath.indexOf('storage/') === 0 ? cleanPath : ('storage/' + cleanPath);
    if (/^https?:\/\//i.test(storagePath)) url = storagePath;
    else if (storagePath.charAt(0) === '/') url = storagePath;
    else url = '/' + storagePath;
  }
  const dbId = (res && (res.id || data.id)) || '';
  return { url: url, path: path, dbId: dbId };
};

window.vioSaveAttachment = function(item){
  const src = window.vioGetAttachmentSource(item);
  if (!src) return;
  const a = document.createElement('a');
  a.href = src;
  a.download = (item && item.name) ? item.name : 'attachment';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.vioPrintAttachment = function(item){
  const src = window.vioGetAttachmentSource(item);
  if (!src) return;
  const isImg = !!(item && item.type && String(item.type).indexOf('image') === 0);
  const w = window.open('', '_blank');
  if (!w) return;
  const content = isImg
    ? '<img src="' + src + '" style="max-width:100%"/>'
    : '<iframe src="' + src + '" style="width:100%;height:95vh;border:0"></iframe>';
  w.document.write('<html><head><title>طباعة مرفق</title></head><body dir="rtl">' + content + '<script>setTimeout(function(){window.print();},250);<\/script></body></html>');
  w.document.close();
};

window.vioOpenAttachmentViewer = function(item){
  const src = window.vioGetAttachmentSource(item);
  if (!src) {
    try { if (typeof toast === 'function') toast('warning', 'لا يوجد ملف', 'لا يوجد ملف متاح للمعاينة'); } catch(_) {}
    return;
  }
  const state = window.vioEnsureAttachmentViewer();
  state.current = item;
  state.media.innerHTML = '';
  state.title.textContent = item && item.name ? item.name : 'معاينة المرفق';
  const isImg = !!(item && item.type && String(item.type).indexOf('image') === 0);
  if (isImg) {
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '72vh';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 10px 40px rgba(2,6,23,.65)';
    state.media.appendChild(img);
  } else {
    const frame = document.createElement('iframe');
    frame.src = src;
    frame.style.width = '78vw';
    frame.style.height = '72vh';
    frame.style.border = '1px solid #334155';
    frame.style.borderRadius = '10px';
    frame.style.background = '#fff';
    state.media.appendChild(frame);
  }
  state.setScale(1);
  state.overlay.classList.add('open');
};

window.vioUploadQueuedAttachments = async function(violationId){
  const items = Array.isArray(window.__vioPendingAttachments) ? window.__vioPendingAttachments : [];
  if (!violationId || !items.length) return;
  const uploaded = window.vioGetSavedAttachments(violationId);
  for (const it of items) {
    if (!it || !it.file || it.persisted) continue;
    it.status = 'uploading';
    it.errorMessage = '';
    window.vioRenderPendingAttachments();
    try {
      const fd = new FormData();
      fd.append('file', it.file);
      const costCenterEl = document.getElementById('vio-cost-center');
      const costCenterValue = costCenterEl ? String(costCenterEl.value || '').trim() : '';
      if (costCenterValue) fd.append('cost_center', costCenterValue);
      const res = await APIClient.special.violations.attach(violationId, fd);
      const resolved = window.vioResolveAttachmentResponse(res);
      const url = resolved.url;
      const path = resolved.path;
      const dbId = resolved.dbId;
      it.url = url;
      it.path = path;
      it.db_id = dbId;
      it.persisted = !!(url || path || dbId);
      it.status = url ? 'ready' : 'error';
      if (!url) it.errorMessage = 'لم يتم استلام رابط الملف من السيرفر';
      if (it.persisted) uploaded.push(window.vioNormalizeAttachment(it));
    } catch (e) {
      it.status = 'error';
      it.errorMessage = (e && e.message) ? String(e.message) : 'خطأ غير معروف';
    } finally {
      try { it.file = null; } catch(_) {}
      window.vioRenderPendingAttachments();
    }
  }
  window.vioPersistSavedAttachments(violationId, uploaded);
};

window.vioRenderPendingAttachments = function(){
  const preview = document.getElementById('vio-files-preview');
  if (!preview) return;
  preview.style.maxHeight = '260px';
  preview.style.overflowY = 'auto';
  const items = Array.isArray(window.__vioPendingAttachments) ? window.__vioPendingAttachments : [];
  preview.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'text-slate-400 text-sm';
    empty.textContent = 'لا توجد مرفقات محددة';
    preview.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(160px,1fr))';
  grid.style.gap = '10px';

  items.forEach(function(it){
    const card = document.createElement('div');
    card.style.border = '1px solid #334155';
    card.style.borderRadius = '10px';
    card.style.padding = '8px';
    card.style.background = '#0b1220';
    card.style.position = 'relative';

    const del = document.createElement('button');
    del.className = 'btn';
    del.textContent = '×';
    del.style.position = 'absolute';
    del.style.top = '6px';
    del.style.right = '6px';
    del.style.padding = '2px 8px';
    del.onclick = async function(){
      try {
        if (it.persisted && window.__vioEditingId && it.db_id && window.APIClient && APIClient.special && APIClient.special.violations && typeof APIClient.special.violations.deleteAttachment === 'function') {
          const ok = await window.confirmDialog({ title: 'حذف المرفق', message: 'هل أنت متأكد من حذف هذا المرفق؟', confirmText: 'حذف', cancelText: 'إلغاء' });
          if (!ok) return;
          await APIClient.special.violations.deleteAttachment(window.__vioEditingId, it.db_id);
          const saved = window.vioGetSavedAttachments(window.__vioEditingId).filter(function(x){
            const normalized = window.vioNormalizeAttachment(x) || {};
            return String(normalized.db_id || '') !== String(it.db_id || '');
          });
          window.vioPersistSavedAttachments(window.__vioEditingId, saved);
        }
        window.__vioPendingAttachments = (window.__vioPendingAttachments || []).filter(function(x){ return x.id !== it.id && String(x.db_id || '') !== String(it.db_id || ''); });
        window.vioRenderPendingAttachments();
      } catch(err) {
        if (typeof toast === 'function') toast('error', 'خطأ', (err && err.message) ? err.message : 'تعذر حذف المرفق');
      }
    };

    const media = document.createElement('div');
    media.style.marginBottom = '8px';
    media.style.borderRadius = '8px';
    media.style.overflow = 'hidden';
    media.style.border = '1px solid #1f2a44';

    if (it.previewUrl && it.type && String(it.type).indexOf('image') === 0) {
      const img = document.createElement('img');
      img.src = it.previewUrl;
      img.alt = it.name || 'attachment';
      img.style.width = '100%';
      img.style.height = '110px';
      img.style.objectFit = 'cover';
      media.appendChild(img);
    } else {
      const box = document.createElement('div');
      box.style.height = '110px';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'center';
      box.style.color = '#94a3b8';
      box.style.fontSize = '28px';
      box.textContent = '📄';
      media.appendChild(box);
    }

    const status = document.createElement('div');
    status.style.fontSize = '11px';
    status.style.marginBottom = '6px';
    status.style.color = it.status === 'ready' ? '#86efac' : (it.status === 'error' ? '#fca5a5' : (it.status === 'queued' ? '#fde68a' : '#e2e8f0'));
    status.textContent = it.status === 'ready'
      ? 'تم الرفع'
      : (it.status === 'error'
        ? ('فشل الرفع' + (it.errorMessage ? ': ' + it.errorMessage : ''))
        : (it.status === 'queued' ? 'بانتظار حفظ المخالفة' : 'جاري الرفع...'));

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = it.name || '';
    nameInput.placeholder = 'اسم المرفق';
    nameInput.className = 'w-full';
    nameInput.style.background = '#0f172a';
    nameInput.style.border = '1px solid #334155';
    nameInput.style.borderRadius = '8px';
    nameInput.style.padding = '6px 8px';
    nameInput.style.color = '#e2e8f0';
    nameInput.oninput = function(){
      try {
        const v = nameInput.value || '';
        (window.__vioPendingAttachments || []).forEach(function(x){ if (x.id === it.id) x.name = v; });
        if (it.persisted && window.__vioEditingId) {
          const saved = window.vioGetSavedAttachments(window.__vioEditingId).map(function(x){
            const normalized = window.vioNormalizeAttachment(x) || {};
            if (String(normalized.db_id || '') === String(it.db_id || '') || String(normalized.url || '') === String(it.url || '')) normalized.name = v;
            return normalized;
          });
          window.vioPersistSavedAttachments(window.__vioEditingId, saved);
        }
      } catch(_) {}
    };

    const links = document.createElement('div');
    links.style.display = 'flex';
    links.style.gap = '6px';
    links.style.marginTop = '8px';
    if (it.url) {
      const open = document.createElement('a');
      open.className = 'btn btn-icon-sm';
      open.innerHTML = '🔗';
      open.href = it.url;
      open.target = '_blank';
      open.title = 'فتح في نافذة جديدة';
      open.setAttribute('data-tooltip', 'فتح في نافذة جديدة');
      const dl = document.createElement('a');
      dl.className = 'btn btn-icon-sm';
      dl.innerHTML = '📥';
      dl.href = it.url;
      dl.download = it.name || 'attachment';
      dl.title = 'تحميل الملف';
      dl.setAttribute('data-tooltip', 'تحميل الملف');
      const previewBtn = document.createElement('button');
      previewBtn.className = 'btn btn-icon-sm';
      previewBtn.innerHTML = '👁️';
      previewBtn.title = 'معاينة الملف';
      previewBtn.setAttribute('data-tooltip', 'معاينة الملف');
      previewBtn.onclick = function(e){
        e.preventDefault();
        window.vioOpenAttachmentViewer(it);
      };
      // زر طباعة
      const printBtn = document.createElement('button');
      printBtn.className = 'btn btn-icon-sm';
      printBtn.innerHTML = '🖨️';
      printBtn.title = 'طباعة الملف';
      printBtn.setAttribute('data-tooltip', 'طباعة الملف');
      printBtn.onclick = function(e){
        e.preventDefault();
        window.vioPrintAttachment(it);
      };
      
      links.appendChild(open);
      links.appendChild(printBtn);
      links.appendChild(dl);
      links.appendChild(previewBtn);
    } else if (it.previewUrl || it.file) {
      const previewBtn = document.createElement('button');
      previewBtn.className = 'btn';
      previewBtn.textContent = 'معاينة';
      previewBtn.onclick = function(e){
        e.preventDefault();
        window.vioOpenAttachmentViewer(it);
      };
      links.appendChild(previewBtn);
    }

    card.appendChild(del);
    card.appendChild(media);
    card.appendChild(status);
    card.appendChild(nameInput);
    card.appendChild(links);
    grid.appendChild(card);
  });

  preview.appendChild(grid);
};

window.vioUploadAttachmentFile = async function(file){
  const fd = new FormData();
  const violationId = window.__vioEditingId;
  const costCenterEl = document.getElementById('vio-cost-center');
  const costCenterValue = costCenterEl ? String(costCenterEl.value || '').trim() : '';
  fd.append('file', file);
  if (costCenterValue) fd.append('cost_center', costCenterValue);
  if (violationId) {
    return await APIClient.special.violations.attach(violationId, fd);
  }
  return null;
};

window.vioHandleViolationFilesSelected = async function(files){
  const arr = Array.from(files || []);
  if (!arr.length) return;
  const pending = Array.isArray(window.__vioPendingAttachments) ? window.__vioPendingAttachments : [];
  arr.forEach(function(f){
    const id = 'att_' + Date.now() + '_' + Math.random().toString(16).slice(2);
    const item = {
      id: id,
      name: f.name,
      type: f.type || '',
      size: f.size || 0,
      file: f,
      previewUrl: '',
      url: '',
      path: '',
      status: window.__vioEditingId ? 'uploading' : 'queued',
      persisted: false
    };
    try { item.previewUrl = URL.createObjectURL(f); } catch(_) {}
    pending.push(item);
  });
  window.__vioPendingAttachments = pending;
  window.vioRenderPendingAttachments();

  if (!window.__vioEditingId) return;

  const uploaded = window.vioGetSavedAttachments(window.__vioEditingId);
  await Promise.all(pending.map(async function(it){
    if (it.status !== 'uploading' || !it.file) return;
    try {
      const res = await window.vioUploadAttachmentFile(it.file);
      const resolved = window.vioResolveAttachmentResponse(res);
      const url = resolved.url;
      const path = resolved.path;
      const dbId = resolved.dbId;
      it.url = url;
      it.path = path;
      it.db_id = dbId;
      it.persisted = !!(url || path || dbId);
      if (url) {
        it.status = 'ready';
        uploaded.push(window.vioNormalizeAttachment(it));
      } else {
        it.status = 'error';
        it.errorMessage = 'لم يتم استلام رابط الملف من السيرفر';
      }
    } catch(e) {
      it.status = 'error';
      it.errorMessage = (e && e.message) ? String(e.message) : 'خطأ غير معروف';
    } finally {
      try { it.file = null; } catch(_) {}
      window.vioRenderPendingAttachments();
    }
  }));
  if (window.__vioEditingId) window.vioPersistSavedAttachments(window.__vioEditingId, uploaded);
};

window.vioPrintPendingAttachments = function(){
  const items = Array.isArray(window.__vioPendingAttachments) ? window.__vioPendingAttachments : [];
  const ready = items.filter(function(x){ return x && x.url; });
  if (!ready.length) {
    try { if (typeof toast === 'function') toast('warning','لا يوجد','لا توجد مرفقات للطباعة'); } catch(_) {}
    return;
  }
  const w = window.open('', '_blank');
  if (!w) return;
  const html = ready.map(function(a){
    const isImg = a.type && String(a.type).indexOf('image') === 0;
    if (isImg) return '<div style="page-break-inside:avoid;margin:12px 0"><div style="font:14px Arial;margin-bottom:6px">'+(a.name||'')+'</div><img src="'+a.url+'" style="max-width:100%"/></div>';
    return '<div style="margin:12px 0;font:14px Arial"><a href="'+a.url+'">'+(a.name||a.url)+'</a></div>';
  }).join('');
  w.document.write('<html><head><title>مرفقات المخالفة</title></head><body dir="rtl">'+html+'<script>setTimeout(function(){window.print();},200);<\/script></body></html>');
  w.document.close();
};

document.addEventListener('DOMContentLoaded', function(){
  const filesEl = document.getElementById('vio-files');
  if (filesEl && !filesEl.__vioBound) {
    filesEl.__vioBound = true;
    filesEl.addEventListener('change', function(){
      try { window.vioHandleViolationFilesSelected(filesEl.files); } catch(_) {}
      try { filesEl.value = ''; } catch(_) {}
    });
  }

  const btnClear = document.getElementById('vio-files-clear');
  if (btnClear && !btnClear.__vioBound) {
    btnClear.__vioBound = true;
    btnClear.addEventListener('click', async function(e){
      e.preventDefault();
      const items = Array.isArray(window.__vioPendingAttachments) ? window.__vioPendingAttachments.slice() : [];
      if (!items.length) {
        window.vioResetPendingAttachments(false);
        return;
      }
      const ok = await window.confirmDialog({ title: 'حذف المرفقات', message: 'هل تريد حذف جميع المرفقات المعروضة؟', confirmText: 'حذف', cancelText: 'إلغاء' });
      if (!ok) return;
      if (window.__vioEditingId) {
        for (const item of items) {
          if (!item || !item.persisted || !item.db_id) continue;
          try {
            if (window.APIClient && APIClient.special && APIClient.special.violations && typeof APIClient.special.violations.deleteAttachment === 'function') {
              await APIClient.special.violations.deleteAttachment(window.__vioEditingId, item.db_id);
            }
          } catch(_) {}
        }
        window.vioPersistSavedAttachments(window.__vioEditingId, []);
      }
      window.vioResetPendingAttachments(false);
    });
  }

  const btnPrint = document.getElementById('vio-files-print');
  if (btnPrint && !btnPrint.__vioBound) {
    btnPrint.__vioBound = true;
    btnPrint.addEventListener('click', function(e){
      e.preventDefault();
      window.vioPrintPendingAttachments();
    });
  }

  try { window.vioRenderPendingAttachments(); } catch(_) {}
});

window.upsertItem = function (key, item) {
  let list = safeList(key);
  if (!item.id) item.id = 'id_' + Date.now() + '_' + Math.random().toString(16).slice(2);

  const idx = list.findIndex(x => x.id === item.id);
  if (idx > -1) list[idx] = item;
  else list.push(item);

  safeSave(key, list);
  return item;
};

// ربط الفروع بالحفظ الصحيح
window.saveBranch = async function() {
  const regionSel = document.getElementById('br-region');
  const regionOther = document.getElementById('br-region-other');
  let region = (regionSel?.value || '').trim();
  if (region === 'other') region = (regionOther?.value || '').trim();

  const kpiTarget = parseFloat(document.getElementById('br-kpi-target')?.value || '0') || 0;
  const kpiValue = parseFloat(document.getElementById('br-kpi-value')?.value || '0') || 0;
  const kpiScore = kpiTarget > 0 ? Math.round((kpiValue / kpiTarget) * 100) : 0;

  const data = {
    name: document.getElementById('br-name')?.value || document.getElementById('branch-name')?.value || '',
    type: document.getElementById('br-type')?.value || 'basic',
    brand: document.getElementById('br-brand')?.value || '',
    email: document.getElementById('br-email')?.value || '',
    cost_center: document.getElementById('br-cost')?.value || document.getElementById('branch-cc')?.value || '',
    ops1: document.getElementById('br-ops')?.value || '',
    kpi_target: kpiTarget,
    kpi_value: kpiValue,
    kpi_score: kpiScore,
    opening_date_expected: document.getElementById('br-opening-date')?.value || '',
    close_date: document.getElementById('br-close-date')?.value || '',
    region: region,
    city: document.getElementById('br-city')?.value || document.getElementById('branch-city')?.value || '',
    notes: document.getElementById('br-notes')?.value || '',
    hidden: false,
    award_star_manual: document.getElementById('br-award-star')?.checked || false
  };

  const id = window.__branchEditingId || document.getElementById('br-id')?.value || document.getElementById('branch-id')?.value;
  
  try {
    if (id) {
       // استخدام APIClient عبر المورد المحدد
       await APIClient.branches.update(id, data);
       if (typeof toast === 'function') toast('success', 'تم التحديث', 'تم تحديث الفرع بنجاح');
    } else {
       await APIClient.branches.create(data);
       if (typeof toast === 'function') toast('success', 'تم الحفظ', 'تم حفظ الفرع بنجاح');
    }
    
    // تحديث الجدول إذا كنا في لوحة التحكم
    if (typeof renderBranchesTableAPI === 'function') {
        renderBranchesTableAPI();
    }
    
    // إغلاق المودال إذا كان مفتوحاً
    const modal = document.getElementById('branch-modal');
    if (modal) modal.classList.remove('open');
    
  } catch (error) {
    console.error('Save Branch Error:', error);
    if (typeof toast === 'function') toast('error', 'خطأ', 'فشل حفظ الفرع: ' + error.message);
  }
};

// ربط التراخيص بالحفظ الصحيح
window.saveLicense = async function() {
  const data = {
    branch_id: document.getElementById('lic-branch')?.value,
    type: document.getElementById('lic-type')?.value,
    expiry_date: document.getElementById('lic-expiry')?.value
  };
  const id = document.getElementById('lic-id')?.value;

  try {
    if (id) {
      await APIClient.licenses.update(id, data);
    } else {
      await APIClient.licenses.create(data);
    }
    if (typeof toast === 'function') toast('success', 'تم الحفظ', 'تم حفظ الترخيص بنجاح');
  } catch (error) {
    console.error('Save License Error:', error);
    if (typeof toast === 'function') toast('error', 'خطأ', 'فشل حفظ الترخيص: ' + error.message);
  }
};

/*
// ربط السكنات بالحفظ الصحيح - MOVED TO unified-saves.js
window.saveHousing = async function() {
  // ... implementation removed to avoid conflict ...
};
*/

window.collectViolationForm = function() {
  return {
    id: document.getElementById('vio-id')?.value,
    branch: document.getElementById('vio-branch')?.value,
    cost_center: document.getElementById('vio-cost-center')?.value,
    vio_no: document.getElementById('vio-number')?.value,
    efaa_no: document.getElementById('vio-efaa')?.value,
    payment_no: document.getElementById('vio-payment')?.value,
    date: document.getElementById('vio-date')?.value,
    type: document.getElementById('vio-type')?.value,
    amount: document.getElementById('vio-amount')?.value,
    paid: document.getElementById('vio-paid')?.value,
    region: document.getElementById('vio-region')?.value,
    appeal_status: document.getElementById('vio-appeal')?.value,
    appeal_number: document.getElementById('vio-appeal-number')?.value,
    appeal_date: document.getElementById('vio-appeal-date')?.value,
    finance_date: document.getElementById('vio-finance-date')?.value
  };
};

// تم نقل saveViolation إلى unified-saves.js
// window.saveViolation = function() { ... }

async function syncToServer(endpoint, data) {
  try {
    const base = (function() {
      if (typeof BASE_URL !== 'undefined' && BASE_URL) return BASE_URL;
      if (window.BASE_URL) return window.BASE_URL;
      
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
    const res = await fetch(base + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Server rejected");

    console.log("Synced:", endpoint, data.id || "");
    return true;
  } catch (e) {
    console.warn("Sync failed — will retry later:", e);
    return false;
  }
}

function setSyncLoading(isLoading) {
  const btn = document.getElementById("sync-all-btn");
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    btn.innerText = "⏳ جاري المزامنة...";
  } else {
    btn.disabled = false;
    btn.innerText = "🔄 مزامنة الكل مع السيرفر";
  }
}

async function syncAllToServer() {
  const role = (window.App && App.getRole) ? App.getRole() : (window.App && App.currentUser ? (App.currentUser().role || '') : (localStorage.getItem('user_role') || ''));
  if (String(role).toLowerCase() !== "dev") {
    if (typeof toast === 'function') toast("error", "غير مصرح", "هذه الميزة مخصصة للمطور فقط");
    return;
  }

  setSyncLoading(true);
  const toastId = typeof toast === 'function'
    ? toast("info", "جارٍ المزامنة", "جاري إرسال البيانات للسيرفر...")
    : null;

  const maps = [
    { key: DB_KEYS.violations, endpoint: "/violations" },
    { key: DB_KEYS.branches,   endpoint: "/branches" },
    { key: DB_KEYS.licenses,   endpoint: "/licenses" },
    { key: DB_KEYS.housings,   endpoint: "/housings" },
    { key: DB_KEYS.employees,  endpoint: "/employees" },
    { key: DB_KEYS.tasks,      endpoint: "/tasks" },
    { key: DB_KEYS.members,    endpoint: "/members" },
    { key: DB_KEYS.roles,      endpoint: "/roles" },
    { key: DB_KEYS.transports, endpoint: "/transports" },
    { key: DB_KEYS.activity,   endpoint: "/activity" },
    { key: DB_KEYS.training_sessions, endpoint: "/training_sessions" },
    { key: DB_KEYS.training_metrics, endpoint: "/training_metrics" }
  ];

  let success = 0;
  let failed = 0;

  for (const m of maps) {
    const list = safeList(m.key);

    for (const item of list) {
      const ok = await syncToServer(m.endpoint, item);
      if (ok) success++;
      else failed++;
    }
  }

  if (typeof toast === 'function') {
    if (failed === 0) {
      toast("success", "اكتملت المزامنة", `تم إرسال ${success} سجل بنجاح`);
    } else {
      toast("warning", "اكتملت جزئيًا", `${success} نجح | ${failed} فشل`);
    }
  }
  setSyncLoading(false);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sync-all-btn");
  const role = (window.App && App.getRole) ? App.getRole() : (window.App && App.currentUser ? (App.currentUser().role || '') : (localStorage.getItem('user_role') || ''));
  if (String(role).toLowerCase() === "dev") {
    btn?.classList.remove("d-none");
  }

  // Sync tasks table when updated from tasks page (other tab)
  window.addEventListener("storage", (e)=>{
    if(e.key === (window.DB_KEYS && DB_KEYS.tasks)){
      try { renderTasks(); } catch(_) {}
    }
  });
  try { hydrateTasksFromServer(); } catch(_) {}
});

window.hydrateTasksFromServer = async function(){
  try {
    if (!window.APIClient || !APIClient.tasks || !APIClient.tasks.list) return;
    const serverData = await APIClient.tasks.list();
    const list = Array.isArray(serverData) ? serverData : (serverData && serverData.data ? serverData.data : []);
    if (!Array.isArray(list)) return;
    const local = safeList(DB_KEYS.tasks) || [];
    const merged = [];
    const seen = new Set();
    list.forEach(function(t){
      const row = {
        id: t && t.id ? t.id : ('task_' + Date.now() + '_' + Math.random().toString(16).slice(2)),
        title: t && t.title ? t.title : '',
        description: t && (t.description || t.desc) ? (t.description || t.desc) : '',
        desc: t && (t.description || t.desc) ? (t.description || t.desc) : '',
        assignee: t && t.assignee ? (typeof t.assignee === 'object' ? (t.assignee.name || t.assignee.username || '') : t.assignee) : '',
        priority: t && t.priority ? t.priority : 'medium',
        due_date: t && (t.due_date || t.due) ? (t.due_date || t.due) : '',
        due: t && (t.due || t.due_date) ? (t.due || t.due_date) : '',
        status: normalizeTaskStatus(t && (t.status || t.status_raw)),
        status_raw: denormalizeTaskStatus(normalizeTaskStatus(t && (t.status || t.status_raw))),
        branch_id: t && (t.branch_id || (t.branch && t.branch.id)) ? String(t.branch_id || (t.branch && t.branch.id)) : '',
        branch: t && t.branch ? t.branch : '',
        attachments: t && Array.isArray(t.attachments) ? t.attachments : [],
        replies: t && Array.isArray(t.replies) ? t.replies : []
      };
      const id = String(row.id || '');
      if (!id || seen.has(id)) return;
      merged.push(row);
      seen.add(id);
    });
    local.forEach(function(t){
      const id = String(t && t.id || '');
      if (!id || seen.has(id)) return;
      merged.push(t);
      seen.add(id);
    });
    safeSave(DB_KEYS.tasks, merged);
    renderTasks();
  } catch(_) {}
};

function normalizeTaskStatus(status){
  if(status === 'in_progress') return 'progress';
  if(status === 'done') return 'completed';
  return status || 'pending';
}
function denormalizeTaskStatus(status){
  if(status === 'progress') return 'in_progress';
  if(status === 'completed') return 'done';
  return status || 'pending';
}

window.saveTask = function() {
  const statusRaw = document.getElementById('task-status')?.value || 'pending';
  const dueDate = document.getElementById('task-due')?.value || '';
  const description = document.getElementById('task-desc')?.value || '';
  const taskBranchValue = document.getElementById('task-branch')?.value || '';
  let id = window.__taskEditingId || document.getElementById('task-id')?.value;
  if (!id) id = 'task_' + Date.now() + '_' + Math.random().toString(16).slice(2);
  
  const data = {
    id: id,
    title: document.getElementById('task-title')?.value || '',
    description: description,
    desc: description,
    assignee: document.getElementById('task-assignee')?.value || '',
    priority: document.getElementById('task-priority')?.value || 'medium',
    due_date: dueDate,
    due: dueDate,
    status: normalizeTaskStatus(statusRaw),
    status_raw: statusRaw,
    branch_id: taskBranchValue,
    branch: taskBranchValue
  };

  upsertItem(DB_KEYS.tasks, data);
  syncToServer('/tasks', data);
  
  // Fallback: ensure localStorage is updated for immediate rendering
  try {
    const raw = localStorage.getItem(DB_KEYS.tasks);
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    const idx = list.findIndex(function(t){ return String(t && t.id) === String(data.id); });
    if (idx >= 0) list[idx] = data; else list.push(data);
    localStorage.setItem(DB_KEYS.tasks, JSON.stringify(list));
  } catch(_){}
  
  // Dispatch sync events for cross-page updates
  try {
    window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: { action: (window.__taskEditingId ? 'update' : 'create'), data } }));
    window.dispatchEvent(new CustomEvent('dataChanged', { detail: { type: 'tasks', action: (window.__taskEditingId ? 'update' : 'create'), data } }));
  } catch(_){}
  
  if (typeof renderTasks === 'function') renderTasks();
  window.closeModal('task-modal');
  if (typeof toast === 'function') toast('success', 'تم الحفظ', 'تم حفظ المهمة بنجاح');
};

function getAdminLang(){
  if (window.App && typeof App.getLang === 'function') return App.getLang();
  return document.documentElement.lang || 'ar';
}

function statusLabelAdmin(status){
  const lang = getAdminLang();
  const s = normalizeTaskStatus(status);
  if(lang === 'ar'){
    if(s === 'pending') return 'قيد الانتظار';
    if(s === 'progress') return 'جاري العمل';
    if(s === 'review') return 'مراجعة';
    if(s === 'completed') return 'مكتملة';
  }
  if(s === 'pending') return 'Pending';
  if(s === 'progress') return 'In Progress';
  if(s === 'review') return 'Review';
  if(s === 'completed') return 'Completed';
  return s;
}

function priorityLabelAdmin(priority){
  const lang = getAdminLang();
  if(lang === 'ar'){
    if(priority === 'low') return 'منخفضة';
    if(priority === 'medium') return 'متوسطة';
    if(priority === 'high') return 'عالية';
  }
  if(priority === 'low') return 'Low';
  if(priority === 'medium') return 'Medium';
  if(priority === 'high') return 'High';
  return priority || '';
}

function escapeAdmin(text){
  return String(text || '').replace(/[&<>"']/g, function(ch){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
  });
}

window.renderTasks = function(){
  const list = safeList(DB_KEYS.tasks) || [];
  const rows = document.getElementById('tasks-table');
  if(!rows) return;

  const norm = list.map(t => ({
    ...t,
    status: normalizeTaskStatus(t.status || t.status_raw),
    due: t.due || t.due_date || '',
    description: t.description || t.desc || ''
  }));

  const pending = norm.filter(t=>t.status === 'pending').length;
  const progress = norm.filter(t=>t.status === 'progress').length;
  const done = norm.filter(t=>t.status === 'completed').length;
  const review = norm.filter(t=>t.status === 'review').length;

  const elPending = document.getElementById('task-kpi-pending');
  const elProgress = document.getElementById('task-kpi-progress');
  const elDone = document.getElementById('task-kpi-done');
  const elReview = document.getElementById('task-kpi-review');
  if(elPending) elPending.textContent = String(pending);
  if(elProgress) elProgress.textContent = String(progress);
  if(elDone) elDone.textContent = String(done);
  if(elReview) elReview.textContent = String(review);

  const lang = document.documentElement.lang || 'ar';
  const idLabel = lang === 'ar' ? 'المعرّف' : 'ID';
  const branchNameById = new Map();
  (safeList(DB_KEYS.branches) || []).forEach(function(branch){
    if (!branch) return;
    const id = String(branch.id || branch.branch_id || branch.code || '').trim();
    if (!id) return;
    const name = getAdminLang() === 'en'
      ? (branch.name_en || branch.name_ar || branch.name || branch.title || branch.branch_name || id)
      : (branch.name_ar || branch.name_en || branch.name || branch.title || branch.branch_name || id);
    branchNameById.set(id, String(name));
  });

  rows.innerHTML = '';
  if(!norm.length){
    rows.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94a3b8;padding:15px">' + tAdmin('لا توجد مهام', 'No tasks') + '</td></tr>';
    return;
  }

  norm.slice().reverse().forEach((t, index)=>{
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors';
    const taskId = String(t.id || '—');
    const taskBranchId = String(t.branch_id || (t.branch && t.branch.id) || (typeof t.branch === 'string' ? t.branch : '') || '').trim();
    const branchFromObject = t.branch && typeof t.branch === 'object'
      ? (t.branch.name_ar || t.branch.name_en || t.branch.name || t.branch.title || t.branch.branch_name || '')
      : '';
    const taskBranchName = branchNameById.get(taskBranchId)
      || branchNameById.get(String(t.branch || '').trim())
      || branchFromObject
      || (typeof t.branch === 'string' && !branchNameById.has(taskBranchId) ? t.branch : '')
      || '—';
    
    let statusClass = 'bg-slate-600';
    let statusMarkerClass = 'bg-slate-200';
    if(t.status === 'pending') statusClass = 'bg-slate-500';
    if(t.status === 'pending') statusMarkerClass = 'bg-amber-200';
    if(t.status === 'progress') statusClass = 'bg-blue-600';
    if(t.status === 'progress') statusMarkerClass = 'bg-blue-200';
    if(t.status === 'review') statusClass = 'bg-purple-600';
    if(t.status === 'review') statusMarkerClass = 'bg-purple-200';
    if(t.status === 'completed') statusClass = 'bg-emerald-600';
    if(t.status === 'completed') statusMarkerClass = 'bg-emerald-200';

    tr.innerHTML = `
      <td class="p-2 text-center"><input type="checkbox" class="task-checkbox accent-blue-500 cursor-pointer" value="${escapeAdmin(t.id)}" onclick="updateTaskBulkState()"></td>
      <td class="p-2 text-center text-slate-500 font-mono text-xs">${index + 1}</td>
      <td class="p-2 text-slate-200">
        <div class="font-medium">${escapeAdmin(t.title)}</div>
        <div class="text-[11px] text-slate-500 mt-0.5">${escapeAdmin(idLabel)}: ${escapeAdmin(taskId)}</div>
      </td>
      <td class="p-2 text-slate-300">${escapeAdmin(t.assignee || '—')}</td>
      <td class="p-2 text-slate-300">${escapeAdmin(taskBranchName)}</td>
      <td class="p-2 text-slate-300">${escapeAdmin(priorityLabelAdmin(t.priority))}</td>
      <td class="p-2 text-slate-400 text-xs font-mono">${escapeAdmin(t.due || '—')}</td>
      <td class="p-2 text-center">
        <span class="px-2 py-0.5 rounded text-[11px] text-white ${statusClass} inline-flex items-center gap-1.5">
          <span class="inline-block w-1.5 h-1.5 rounded-[2px] ${statusMarkerClass}"></span>
          ${escapeAdmin(statusLabelAdmin(t.status))}
        </span>
      </td>
      <td class="p-2 text-center">
        <div class="flex items-center justify-center gap-1 flex-wrap">
          <button class="text-cyan-300 hover:text-cyan-200 transition-colors p-1" title="${tAdmin('معاينة', 'Preview')}" onclick="previewTaskCard('${escapeAdmin(t.id)}')">👁️</button>
          <button class="text-amber-300 hover:text-amber-200 transition-colors p-1" title="${tAdmin('طباعة', 'Print')}" onclick="printTaskCard('${escapeAdmin(t.id)}')">🖨️</button>
          <button class="text-emerald-300 hover:text-emerald-200 transition-colors p-1" title="${tAdmin('رد', 'Reply')}" onclick="replyTask('${escapeAdmin(t.id)}')">💬</button>
          <button class="text-violet-300 hover:text-violet-200 transition-colors p-1" title="${tAdmin('المرفقات', 'Attachments')}" onclick="viewTaskAttachments('${escapeAdmin(t.id)}')">📎</button>
          <button class="text-blue-400 hover:text-blue-300 transition-colors p-1" title="${tAdmin('تعديل', 'Edit')}" onclick="editTask('${escapeAdmin(t.id)}')">✏️</button>
          <button class="text-red-400 hover:text-red-300 transition-colors p-1" title="${tAdmin('حذف', 'Delete')}" onclick="deleteTask('${escapeAdmin(t.id)}')">🗑️</button>
        </div>
      </td>
    `;
    rows.appendChild(tr);
  });
  updateTaskBulkState();
};

window.toggleTaskSelectAll = function(el) {
  const checks = document.querySelectorAll('.task-checkbox');
  checks.forEach(c => c.checked = el.checked);
  updateTaskBulkState();
};

window.updateTaskBulkState = function() {
  const checked = document.querySelectorAll('.task-checkbox:checked');
  const btn = document.getElementById('btn-delete-selected');
  const selectAll = document.getElementById('task-select-all');
  
  if(btn) {
    if(checked.length > 0) {
      btn.classList.remove('hidden');
      const lang = document.documentElement.lang || 'ar';
      btn.querySelector('span').textContent = (lang === 'ar' ? 'حذف المحدد (' : 'Delete Selected (') + checked.length + ')';
    } else {
      btn.classList.add('hidden');
    }
  }
  
  if(selectAll) {
      const all = document.querySelectorAll('.task-checkbox');
      if(all.length > 0 && checked.length === all.length) {
          selectAll.checked = true;
          selectAll.indeterminate = false;
      } else if (checked.length > 0) {
          selectAll.checked = false;
          selectAll.indeterminate = true;
      } else {
          selectAll.checked = false;
          selectAll.indeterminate = false;
      }
  }
};

window.deleteSelectedTasks = function() {
  const checked = document.querySelectorAll('.task-checkbox:checked');
  if(checked.length === 0) return;
  
  const ids = Array.from(checked).map(c => c.value);
  const lang = document.documentElement.lang || 'ar';
  if(!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف ' + ids.length + ' مهمة؟' : 'Delete ' + ids.length + ' tasks?')) return;
  
  const list = safeList(DB_KEYS.tasks) || [];
  const filtered = list.filter(t => !ids.includes(String(t.id)));
  safeSave(DB_KEYS.tasks, filtered);
  
  if(typeof APIClient !== 'undefined' && APIClient.tasks && APIClient.tasks.delete) {
      ids.forEach(id => APIClient.tasks.delete(id).catch(e=>{}));
  }
  
  renderTasks();
  if (typeof toast === 'function') toast('success', lang === 'ar' ? 'تم الحذف' : 'Deleted', lang === 'ar' ? 'تم حذف المهام المحددة' : 'Selected tasks deleted');
  
  const selectAll = document.getElementById('task-select-all');
  if(selectAll) { selectAll.checked = false; selectAll.indeterminate = false; }
};

window.editTask = function(id){
  const list = safeList(DB_KEYS.tasks) || [];
  const task = list.find(t=>String(t.id) === String(id));
  if(!task) return;
  window.__taskEditingId = task.id;
  document.getElementById('task-title').value = task.title || '';
  document.getElementById('task-desc').value = task.description || task.desc || '';
  document.getElementById('task-assignee').value = task.assignee || '';
  document.getElementById('task-priority').value = task.priority || 'medium';
  document.getElementById('task-due').value = task.due || task.due_date || '';
  document.getElementById('task-status').value = denormalizeTaskStatus(task.status || task.status_raw);
  const branchSelect = document.getElementById('task-branch');
  if (branchSelect) {
    const branchValue = task.branch_id || (task.branch && task.branch.id) || task.branch || '';
    branchSelect.value = String(branchValue || '');
    branchSelect.dataset.selectedId = String(branchValue || '');
  }
  openTaskModal();
};

window.getTaskSerialNumber = function(taskId){
  const base = 1000;
  const list = safeList(DB_KEYS.tasks) || [];
  const idx = list.findIndex(function(t){ return String(t && t.id) === String(taskId); });
  return idx >= 0 ? (base + idx) : base;
};

window.replyTask = function(id){
  const list = safeList(DB_KEYS.tasks) || [];
  const idx = list.findIndex(function(t){ return String(t && t.id) === String(id); });
  if(idx < 0) return;
  const message = window.prompt('اكتب نص الرد');
  if(message === null) return;
  const text = String(message || '').trim();
  if(!text){
    if(typeof toast === 'function') toast('warning', 'تنبيه', 'نص الرد مطلوب');
    return;
  }
  const current = list[idx] || {};
  const actor = (window.App && typeof App.currentUser === 'function' && App.currentUser())
    ? (App.currentUser().name || App.currentUser().username || App.currentUser().email || 'admin')
    : (localStorage.getItem('user_name') || localStorage.getItem('username') || 'admin');
  const replies = Array.isArray(current.replies) ? current.replies.slice() : [];
  replies.push({ who: actor, msg: text, time: Date.now(), files: [] });
  const updated = { ...current, replies };
  list[idx] = updated;
  safeSave(DB_KEYS.tasks, list);
  syncToServer('/tasks', updated);
  renderTasks();
  if(typeof toast === 'function') toast('success', 'تم', 'تمت إضافة الرد');
};

window.viewTaskAttachments = function(id){
  const list = safeList(DB_KEYS.tasks) || [];
  const task = list.find(function(t){ return String(t && t.id) === String(id); });
  if(!task) return;
  const attachments = Array.isArray(task.attachments) ? task.attachments : [];
  
  // استخدام نفس واجهة عرض المرفقات للمخالفات
  window.showViolationAttachments(id, attachments, 'مرفقات المهمة: ' + (task.title || 'مهمة'));
};

window.__taskCardHtml = function(task){
  const status = statusLabelAdmin(normalizeTaskStatus(task.status || task.status_raw));
  const priority = priorityLabelAdmin(task.priority || 'medium');
  const due = task.due || task.due_date || '—';
  const assignee = task.assignee || '—';
  const serial = window.getTaskSerialNumber(task.id);
  const desc = task.description || task.desc || '—';
  return `
    <div style="font-family: Tahoma, Arial, sans-serif; padding: 20px; color: #0f172a;">
      <div style="border:1px solid #e2e8f0;border-radius:12px;padding:18px;background:#ffffff;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px;">
          <h2 style="margin:0;font-size:18px;">${escapeAdmin(task.title || 'بدون عنوان')}</h2>
          <span style="font-size:12px;padding:4px 8px;border-radius:8px;background:#e2e8f0;">${escapeAdmin(status)}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;font-size:13px;">
          <div><b>المسؤول:</b> ${escapeAdmin(assignee)}</div>
          <div><b>الأولوية:</b> ${escapeAdmin(priority)}</div>
          <div><b>الاستحقاق:</b> ${escapeAdmin(due)}</div>
          <div><b>الرقم:</b> ${escapeAdmin(serial)}</div>
        </div>
        <div style="padding:10px;border-radius:8px;background:#f8fafc;font-size:13px;line-height:1.8;">
          ${escapeAdmin(desc)}
        </div>
      </div>
    </div>
  `;
};

window.previewTaskCard = function(id){
  const list = safeList(DB_KEYS.tasks) || [];
  const task = list.find(t => String(t.id) === String(id));
  if(!task) return;
  const w = window.open('', '_blank', 'width=900,height=700');
  if(!w){
    if(typeof toast === 'function') toast('warning', 'تنبيه', 'المتصفح منع نافذة المعاينة');
    return;
  }
  w.document.write('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>معاينة المهمة</title></head><body style="margin:0;background:#f1f5f9;">' + window.__taskCardHtml(task) + '</body></html>');
  w.document.close();
};

window.printTaskCard = function(id){
  const list = safeList(DB_KEYS.tasks) || [];
  const task = list.find(t => String(t.id) === String(id));
  if(!task) return;
  const w = window.open('', '_blank', 'width=900,height=700');
  if(!w){
    if(typeof toast === 'function') toast('warning', 'تنبيه', 'المتصفح منع نافذة الطباعة');
    return;
  }
  w.document.write('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>طباعة المهمة</title></head><body style="margin:0;background:#ffffff;">' + window.__taskCardHtml(task) + '<script>window.onload=function(){window.print();};<\/script></body></html>');
  w.document.close();
};

window._pendingDeleteTaskId = null;
window.deleteTask = function(id){
  window._pendingDeleteTaskId = id;
  const m = document.getElementById('taskConfirmModal');
  if(m) {
      m.classList.add('open');
      m.style.display = 'flex';
  }
  const yes = document.getElementById('taskConfirmYes');
  if(yes){
    yes.onclick = function(){
        const tid = window._pendingDeleteTaskId;
        if(!tid) return;
        const list = safeList(DB_KEYS.tasks) || [];
        const filtered = list.filter(t=>String(t.id) !== String(tid));
        safeSave(DB_KEYS.tasks, filtered);
        
        if(typeof APIClient !== 'undefined' && APIClient.tasks && APIClient.tasks.delete) {
             APIClient.tasks.delete(tid).catch(e=>{});
        }

        if (typeof renderTasks === 'function') renderTasks();
        if (typeof toast === 'function') toast('success', 'تم الحذف', 'تم حذف المهمة بنجاح');
        
        window.closeModal('taskConfirmModal');
        window._pendingDeleteTaskId = null;
    };
  }
};

// تعزيز سجل النشاطات بالمزامنة
if (typeof window.logActivity === 'function') {
  const __origLogActivity = window.logActivity;
  window.logActivity = function(action, section, details) {
    const res = __origLogActivity.apply(this, arguments);
    try {
      const row = {
        id: 'act_' + Date.now() + '_' + Math.random().toString(16).slice(2),
        action: action || '',
        section: section || '',
        details: details || '',
        date: new Date().toISOString()
      };
      upsertItem(DB_KEYS.activity, row);
      syncToServer('/activity', row);
    } catch(_){ }
    return res;
  };
}

window.closeModal = function(id) {
    var m = document.getElementById(id);
    if (m) {
      m.classList.remove('open');
      if (m.classList && m.classList.contains('modal-overlay')) m.style.display = '';
      else m.style.display = 'none';
    }
  };

  // --- Standardized Modal Wrappers (Compatibility with App.js) ---
  window.openTaskModal = function() {
    var m = document.getElementById('task-modal');
    if(m) { 
      m.classList.add('open'); 
      m.style.display = 'flex'; 
      populateEmployeeDropdown();
      populateTaskBranchDropdown();
    }
  };
  window.closeTaskModal = function() {
    window.closeModal('task-modal');
    window.__taskEditingId = null;
    const branchSelect = document.getElementById('task-branch');
    if (branchSelect) {
      branchSelect.value = '';
      delete branchSelect.dataset.selectedId;
    }
  };

  window.populateTaskBranchDropdown = async function() {
    const branchSelect = document.getElementById('task-branch');
    if (!branchSelect) return;

    const selectedId = String(branchSelect.dataset.selectedId || branchSelect.value || '');
    const seen = new Set();
    const branches = [];

    const appendRows = function(rows) {
      if (!Array.isArray(rows)) return;
      rows.forEach(function(row) {
        if (!row || typeof row !== 'object') return;
        const id = row.id || row.branch_id || row.code;
        const idStr = String(id || '').trim();
        if (!idStr || seen.has(idStr)) return;
        seen.add(idStr);
        branches.push({
          id: idStr,
          name: row.name_ar || row.name_en || row.name || row.title || row.branch_name || idStr
        });
      });
    };

    try {
      if (window.App && window.App.api) {
        if (typeof window.App.api.list === 'function') {
          appendRows(await window.App.api.list('branches'));
        } else if (typeof window.App.api.fetchData === 'function') {
          appendRows(await window.App.api.fetchData('branches'));
        } else if (window.App.api.branches && typeof window.App.api.branches.list === 'function') {
          appendRows(await window.App.api.branches.list());
        }
      }
    } catch(_) {}

    try {
      if (window.App && window.App.store && typeof window.App.store.list === 'function') {
        appendRows(window.App.store.list('branches'));
      }
    } catch(_) {}

    try { appendRows(JSON.parse(localStorage.getItem('db:branches') || '[]')); } catch(_) {}
    try { appendRows(JSON.parse(localStorage.getItem('admin_branches_data') || '[]')); } catch(_) {}
    try { appendRows(JSON.parse(localStorage.getItem('branches') || '[]')); } catch(_) {}
    try { appendRows(JSON.parse(localStorage.getItem('ofs_branches_v1') || '[]')); } catch(_) {}

    branchSelect.innerHTML = '<option value="">اختر فرع...</option>';
    branches.forEach(function(branch){
      const option = document.createElement('option');
      option.value = branch.id;
      option.textContent = branch.name;
      branchSelect.appendChild(option);
    });

    if (selectedId) {
      branchSelect.value = selectedId;
      delete branchSelect.dataset.selectedId;
    }
  };

  // وظيفة لملء قائمة الموظفين في مهمة
  window.populateEmployeeDropdown = function() {
    const assigneeSelect = document.getElementById('task-assignee');
    if (!assigneeSelect) return;
    
    // حفظ القيمة الحالية
    const currentValue = assigneeSelect.value;
    
    // مسح الخيارات الحالية باستثناء الخيار الافتراضي
    while (assigneeSelect.options.length > 1) {
      assigneeSelect.remove(1);
    }
    
    // جلب بيانات الموظفين
    let employees = [];
    try {
      // محاولة استخدام App.store أولاً
      if (window.App && window.App.store && typeof window.App.store.list === 'function') {
        employees = window.App.store.list('employees') || [];
      }
      
      // إذا لم تنجح، جرب localStorage مباشرة
      if (employees.length === 0) {
        const raw = localStorage.getItem('db:employees');
        if (raw) {
          employees = JSON.parse(raw);
          if (!Array.isArray(employees)) employees = [];
        }
      }
    } catch (e) {
      console.error('Error loading employees:', e);
      employees = [];
    }
    
    // إضافة الموظفين إلى القائمة
    employees.forEach(employee => {
      if (employee.name && employee.status === 'active') {
        const option = document.createElement('option');
        option.value = employee.name;
        option.textContent = employee.name;
        if (employee.position) {
          option.textContent += ` - ${employee.position}`;
        }
        if (employee.branch) {
          option.textContent += ` (${employee.branch})`;
        }
        assigneeSelect.appendChild(option);
      }
    });
    
    // استعادة القيمة السابقة إذا كانت موجودة
    if (currentValue) {
      assigneeSelect.value = currentValue;
    }
  };

  window.openViolationModal = function(id) {
    var m = document.getElementById('vio-modal');
    var form = document.getElementById('violation-form');
    if (form && !id) form.reset();
    window.__vioEditingId = id || null;
    if (id) {
      var violation = (window.App && App.store && typeof App.store.get === 'function') ? App.store.get('violations', id) : null;
      if (violation) {
        var setVal = function(fieldId, value){
          var el = document.getElementById(fieldId);
          if (el) el.value = value == null ? '' : value;
        };
        setVal('vio-branch', violation.branch);
        setVal('vio-cost-center', violation.cost_center);
        setVal('vio-number', violation.vio_no);
        setVal('vio-efaa', violation.efaa_no);
        setVal('vio-payment', violation.payment_no);
        setVal('vio-date', violation.date);
        setVal('vio-type', violation.type || violation.description);
        setVal('vio-amount', violation.amount);
        setVal('vio-paid', violation.paid_status || (violation.paid ? 'true' : 'false'));
        setVal('vio-region', violation.region);
        setVal('vio-appeal', violation.appeal_status);
        setVal('vio-appeal-number', violation.appeal_number);
        setVal('vio-appeal-date', violation.appeal_date);
        setVal('vio-finance-date', violation.finance_date);
      }
      window.vioLoadEditorAttachments(id);
    } else {
      window.vioResetPendingAttachments(false);
    }
    if(m) { m.classList.add('open'); m.style.display = 'flex'; }
  };
  window.closeViolationModal = function() {
    window.closeModal('vio-modal');
    window.__vioEditingId = null;
    window.vioResetPendingAttachments(false);
  };

  // ملاحظة: دالة saveViolation تم نقلها إلى unified-saves.js
  // سيتم استدعاؤها من هناك بعد تحميل APIClient

// Initial Render on Load
window.addEventListener('load', function(){
    // Default to something, maybe dashboard or leave as is if admin.html handles it
});

(function(){
  var MEMBERS_COL = 'members'; 
  var MEMBERS_AUTO_SYNC_KEY = 'members_auto_sync_last_at';
  var MEMBERS_AUTO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;
  function nowISO(){ return new Date().toISOString(); } 
  // UUID Helper with robust fallback
  function uid(){ 
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  function normalizeSap(s){ return String(s||'').trim(); } 
  
  // Username is exactly SAP ID if present
  function genUsernameFromSap(sap){ return normalizeSap(sap); } 
  
  function usernameExists(username, list){ 
    username = String(username||'').toLowerCase(); 
    return (list||[]).some(function(m){ return String(m.username||'').toLowerCase() === username; }); 
  } 
  
  function ensureUniqueUsername(base, list){ 
    var u = String(base||'').trim() || 'user'; 
    if(!usernameExists(u, list)) return u; 
    for(var i=1;i<=99;i++){ var x = u + '_' + i; if(!usernameExists(x, list)) return x; } 
    return u + '_' + Math.random().toString(16).slice(2,5); 
  } 
  
  function listMembers(){ 
    try { 
      return App.store.list(MEMBERS_COL) || [];
    } catch(e){ 
      return []; 
    }
  } 
  
  // --- Branches & Cost Centers Logic ---
  var BRANCHES_KEY = "ofs_branches_v1";
  var EMP_KEYS_CANDIDATES = ["ofs_employees_v1", "ofs_employees", "employees", "employees_data", "ofs_staff", "staff"];

  function safeJsonParse(raw){ try { return JSON.parse(raw); } catch { return null; } }

  function getAllEmployeesAuto(){
    // 1) Try known candidates
    for (var i=0; i<EMP_KEYS_CANDIDATES.length; i++){
      var k = EMP_KEYS_CANDIDATES[i];
      var raw = localStorage.getItem(k);
      var v = raw ? safeJsonParse(raw) : null;
      if (Array.isArray(v) && v.length) return v;
    }
    // 2) Scan all keys
    for (var k in localStorage){
      var raw2 = localStorage.getItem(k);
      var v2 = raw2 ? safeJsonParse(raw2) : null;
      if (!Array.isArray(v2) || !v2.length) continue;
      var sample = v2[0] || {};
      var hasSap = ("sap" in sample) || ("sap_id" in sample) || ("sapId" in sample);
      var hasCC  = ("cost_center" in sample) || ("costCenter" in sample) || ("cc" in sample);
      var hasBr  = ("branch_id" in sample) || ("branchId" in sample) || ("branch" in sample);
      if (hasSap && (hasCC || hasBr)) return v2;
    }
    return [];
  }

  function getAllCostCenters(){
    var emps = getAllEmployeesAuto();
    var set = new Set();
    emps.forEach(function(e){
      var cc = String(e.cost_center || e.costCenter || e.cc || "").trim();
      if (cc) set.add(cc);
    });
    return Array.from(set).sort();
  }

  function getAllBranches(){
    try{
      var raw = localStorage.getItem(BRANCHES_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    }catch(e){ return []; }
  }

  function renderMemberBranches(selectedArr){
    var box = document.getElementById('memBranchesBox');
    if(!box) return;
    var branches = getAllBranches();
    var selected = new Set((selectedArr || []).map(String));
    
    box.innerHTML = branches.length ? '' : '<div style="color:#94a3b8;font-weight:900">لا توجد فروع محفوظة بعد — افتح صفحة الفروع لتحديث البيانات.</div>';
    
    branches.forEach(function(b){
      var id = String(b.id || b.branch_id || b.code || '');
      var name = String(b.name || b.branch_name || b.title || id);
      var label = document.createElement('label');
      label.style.cssText = "display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.45);cursor:pointer";
      var chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'memBranchCheck';
      chk.value = id;
      if(selected.has(id)) chk.checked = true;
      
      label.appendChild(chk);
      var sp1 = document.createElement('span'); sp1.style.fontWeight='900'; sp1.textContent = name; label.appendChild(sp1);
      var sp2 = document.createElement('span'); sp2.style.color='#94a3b8'; sp2.style.fontWeight='850'; sp2.textContent = '('+id+')'; label.appendChild(sp2);
      box.appendChild(label);
    });
  }

  function renderMemberCostCenters(selectedArr){
    var box = document.getElementById('memCCBox');
    if(!box) return;
    var list = getAllCostCenters();
    var selected = new Set((selectedArr || []).map(String));
    
    box.innerHTML = list.length ? '' : '<div style="color:#94a3b8;font-weight:900">No Cost Centers Found</div>';
    
    list.forEach(function(cc){
      var label = document.createElement('label');
      label.style.cssText = "display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.45);cursor:pointer";
      var chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'memCCCheck';
      chk.value = cc;
      if(selected.has(cc)) chk.checked = true;
      
      label.appendChild(chk);
      var sp = document.createElement('span'); sp.style.fontWeight='900'; sp.textContent = cc; label.appendChild(sp);
      box.appendChild(label);
    });
  }

  function collectSelectedBranches(){
    var nodes = document.querySelectorAll('.memBranchCheck:checked');
    var res = [];
    for(var i=0; i<nodes.length; i++) res.push(nodes[i].value);
    return res;
  }

  function collectSelectedCostCenters(){
    var nodes = document.querySelectorAll('.memCCCheck:checked');
    var res = [];
    for(var i=0; i<nodes.length; i++) res.push(nodes[i].value);
    return res;
  }

  function toggleSupervisorScopes(role){
    var bWrap = document.getElementById('mem-branches-wrap');
    var cWrap = document.getElementById('mem-cc-wrap');
    var show = (role === 'supervisor');
    if(bWrap) bWrap.style.display = show ? '' : 'none';
    if(cWrap) cWrap.style.display = show ? '' : 'none';
  }

  function upsertMember(member, opts){ 
    opts = opts || {};
    var list = listMembers(); 
    if(!member.id) member.id = uid(); 
    
    // Prevent SAP duplication
    if(member.sap){ 
      var sap = normalizeSap(member.sap); 
      var existsOther = list.some(function(x){ return normalizeSap(x.sap) === sap && x.id !== member.id; }); 
      if(existsOther){ 
        if(typeof toast === 'function') toast('warning','تنبيه','يوجد عضو بنفس SAP ID مسبقًا'); 
        throw new Error('SAP duplicated'); 
      } 
    }

    // username rules
    if (member.sap) { 
      member.username = normalizeSap(member.sap); 
    } else { 
      // Only generate if not provided or empty
      if(!member.username) member.username = ensureUniqueUsername('user', list);
      else member.username = ensureUniqueUsername(member.username, list);
    } 
    
    member.role = member.role || 'user'; 
    member.source = member.source || (member.sap ? 'employee' : 'manual'); 
    member.updatedAt = nowISO(); 
    if(!member.createdAt) member.createdAt = nowISO(); 
    
    var idx = list.findIndex(function(x){ return x.id === member.id; }); 
    if(idx >= 0) list[idx] = Object.assign({}, list[idx], member); 
    else list.unshift(member); 
    
    App.store.importJSON(MEMBERS_COL, JSON.stringify(list)); 
    try {
      if (!opts.skipServerSync && window.DB_KEYS && typeof upsertItem === 'function') {
        upsertItem(DB_KEYS.members, member);
        syncToServer('/members', member);
      }
    } catch(_) {}
    
    // Activity Log
    if(window.logActivity) window.logActivity(idx >= 0 ? 'تعديل عضو' : 'إضافة عضو', 'الأعضاء', member.name);
    
    return member; 
  } 
  
  function deleteMember(id){ 
    var list = listMembers().filter(function(x){ return x.id !== id; }); 
    App.store.importJSON(MEMBERS_COL, JSON.stringify(list)); 
    if(window.logActivity) window.logActivity('حذف عضو', 'الأعضاء', 'ID: ' + id);
  } 
  
  function ensureMemberFromEmployee(emp, opts){ 
    if(!emp) return null; 
    var sap = normalizeSap(emp.sap); 
    if(!sap) return null; 
    var members = listMembers(); 
    var exist = members.find(function(m){ return normalizeSap(m.sap) === sap; }); 
    if(exist){ 
      exist.name = emp.name || exist.name; 
      if(emp.idNum) exist.idNum = emp.idNum;
      exist.source = 'employee'; 
      exist.updatedAt = nowISO(); 
      upsertMember(exist, opts); 
      return exist; 
    } 
    var m = { 
      id: uid(), 
      name: emp.name || ('SAP ' + sap), 
      sap: sap,
      idNum: emp.idNum || '', 
      username: sap, 
      role: 'user', 
      source: 'employee', 
      note: 'Auto from Employees' 
    }; 
    return upsertMember(m, opts); 
  } 
  
  function syncMembersFromEmployees(opts){ 
    opts = opts || {};
    console.log('Starting syncMembersFromEmployees...');
    var emps = []; 
    try { 
      emps = App.store.list('employees') || []; 
      console.log('Found employees for sync:', emps.length);
    } catch(e){ 
      console.warn('Failed to get employees for sync:', e);
      emps = []; 
    } 
    var created = 0; 
    emps.forEach(function(e){ 
      var before = listMembers().length; 
      try {
        var res = ensureMemberFromEmployee(e, opts); 
        var after = listMembers().length; 
        if(res && after > before) created++; 
      } catch(err){}
    }); 
    console.log('Sync complete. New members created:', created);
    if(!opts.silent && typeof toast === 'function') toast('success','تم','تمت المزامنة. (جديد: ' + created + ')'); 
    // Re-enable renderMembers after sync is complete
    if (created > 0) {
      renderMembers();
    }
  }  

  function shouldRunMembersAutoSync(){
    try{
      var lastRaw = localStorage.getItem(MEMBERS_AUTO_SYNC_KEY);
      var last = Number(lastRaw || 0);
      if (!last || !isFinite(last)) return true;
      return (Date.now() - last) >= MEMBERS_AUTO_SYNC_INTERVAL_MS;
    } catch(_){
      return true;
    }
  }

  function markMembersAutoSyncNow(){
    try { localStorage.setItem(MEMBERS_AUTO_SYNC_KEY, String(Date.now())); } catch(_) {}
  }
  
  var editingMemberId = null; 
  function fillMemberRolesSelect(selected){
    var sel = document.getElementById('mem-role');
    if(!sel) return;
    var roles = [];
    try { roles = App.store.list('roles') || []; } catch(e){}
    if(!roles.length) roles = [{id:'user', nameEn:'User', nameAr:'مستخدم'}, {id:'admin', nameEn:'Admin', nameAr:'مدير'}];
    
    var lang = (App.getLang && App.getLang()) || 'ar';
    sel.innerHTML = roles.map(function(r){
      var label = (lang==='en') ? (r.nameEn||r.id) : (r.nameAr||r.id||r.name);
      // Simple escape
      label = String(label).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      var val = String(r.id||r.name).replace(/"/g, '&quot;');
      return '<option value="'+val+'">'+label+'</option>';
    }).join('');
    sel.value = selected || 'user';
  }

  window.openMemberModal = function(){ 
    editingMemberId = null; 
    document.getElementById('member-modal-title').textContent = 'إضافة عضو'; 
    document.getElementById('mem-name').value = ''; 
    document.getElementById('mem-sap').value = ''; 
    document.getElementById('mem-username').value = ''; 
    // Populate roles
    fillMemberRolesSelect('user');
    
    document.getElementById('mem-note').value = ''; 
    document.getElementById('member-modal').classList.add('open'); 
    document.getElementById('member-modal').style.display = 'flex'; 
  }; 
  window.openMemberEdit = function(id){ 
    var m = listMembers().find(function(x){ return x.id === id; }); 
    if(!m) return; 
    editingMemberId = id; 
    document.getElementById('member-modal-title').textContent = 'تعديل عضو'; 
    document.getElementById('mem-name').value = m.name || ''; 
    document.getElementById('mem-sap').value = m.sap || ''; 
    document.getElementById('mem-username').value = m.username || ''; 
    
    // Populate roles
    fillMemberRolesSelect(m.role || 'user');
    
    document.getElementById('mem-note').value = m.note || ''; 
    document.getElementById('member-modal').style.display = 'flex'; 
  }; 
  
  var _pendingDeleteMemberId = null; 
  window.confirmMemberDelete = function(id){ 
    _pendingDeleteMemberId = id; 
    var m = document.getElementById('memConfirmModal'); 
    if(m){ m.style.display = 'flex'; } 
    var yes = document.getElementById('memConfirmYes'); 
    if(yes){ 
      yes.onclick = function(){ 
        deleteMember(_pendingDeleteMemberId); 
        _pendingDeleteMemberId = null; 
        window.closeModal('memConfirmModal'); 
        if(typeof toast === 'function') toast('success','تم','تم حذف العضو'); 
        renderMembers(); 
      }; 
    } 
  }; 
  
  function saveMemberFromModal(){  
    var name = document.getElementById('mem-name').value.trim(); 
    var sap = document.getElementById('mem-sap').value.trim(); 
    var username = document.getElementById('mem-username').value.trim(); 
    var role = document.getElementById('mem-role').value; 
    var note = document.getElementById('mem-note').value.trim(); 
    if(!name){ if(typeof toast === 'function') toast('warning','تنبيه','الاسم مطلوب'); return; } 
    try {
      upsertMember({ 
        id: editingMemberId || null, 
        name: name, 
        sap: sap || null, 
        username: username || null, 
        role: role, 
        note: note, 
        source: sap ? 'employee' : 'manual' 
      }); 
      if(typeof toast === 'function') toast('success','تم','تم الحفظ'); 
      window.closeModal('member-modal'); 
      renderMembers(); 
    } catch(e){}
  } 
  
  // Function to create sample employees if none exist
  function createSampleEmployeesIfNeeded() {
    console.log('Checking if sample employees need to be created...');
    try {
      var employees = App.store.list('employees') || [];
      console.log('Current employees in store:', employees.length);
      if (employees.length === 0) {
        console.log('No employees found, creating sample data...');
        // Create sample employees
        var sampleEmployees = [
          {
            id: '1',
            name: 'أحمد محمد',
            sap: '10001',
            idNum: '1234567890',
            position: 'مدير',
            department: 'إدارة',
            branch: 'الرياض',
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: '2', 
            name: 'فاطمة علي',
            sap: '10002',
            idNum: '0987654321',
            position: 'موظفة',
            department: 'موارد بشرية',
            branch: 'جدة',
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'خالد سعيد',
            sap: '10003', 
            idNum: '1122334455',
            position: 'محاسب',
            department: 'مالية',
            branch: 'الدمام',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ];
        
        App.store.set('employees', sampleEmployees);
        console.log('Sample employees created:', sampleEmployees.length);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Failed to create sample employees:', e);
      return false;
    }
  }
  
  window.addEventListener('load', function(){ 
    var bNew = document.getElementById('btn-member-new'); if(bNew) bNew.onclick = openMemberModal; 
    var bSave = document.getElementById('btn-member-save'); if(bSave) bSave.onclick = saveMemberFromModal; 
    
    // Add debounce to search and filter inputs
    var s = document.getElementById('mem-search'); 
    if(s) {
      var searchTimeout;
      s.oninput = function(){ 
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function(){
          if(document.getElementById('members-table-body')) renderMembers(); 
        }, 300);
      }; 
    }
    
    var f = document.getElementById('mem-filter-source'); 
    if(f) {
      var filterTimeout;
      f.onchange = function(){ 
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(function(){
          if(document.getElementById('members-table-body')) renderMembers(); 
        }, 100);
      }; 
    }
    
    var syncBtn = document.getElementById('btn-members-sync');
    if(syncBtn) {
      syncBtn.onclick = function(){
        syncMembersFromEmployees({ skipServerSync: true, silent: false });
        markMembersAutoSyncNow();
      };
    }
    
    // Create sample employees if needed, then sync members
    createSampleEmployeesIfNeeded();
    if (shouldRunMembersAutoSync()) {
      syncMembersFromEmployees({ skipServerSync: true, silent: true });
      markMembersAutoSyncNow();
    }
  }); 
  
  window.ensureMemberFromEmployee = ensureMemberFromEmployee; 
  window.syncMembersFromEmployees = syncMembersFromEmployees; 
})();

// --- Roles Module ---
var ROLES_COL = 'roles';

// 1) Permissions Constants
const PERMS = [
  // Dashboard
  { key:'dashboard.view', ar:'عرض لوحة التحكم', en:'View Dashboard' },
  
  // Members
  { key:'members.view', ar:'عرض الأعضاء', en:'View Members' },
  { key:'members.create', ar:'إضافة عضو', en:'Create Member' },
  { key:'members.update', ar:'تعديل عضو', en:'Update Member' },
  { key:'members.delete', ar:'حذف عضو', en:'Delete Member' },
  
  // Roles
  { key:'roles.view', ar:'عرض الأدوار', en:'View Roles' },
  { key:'roles.manage', ar:'إدارة الأدوار والصلاحيات', en:'Manage Roles/Perms' },
  
  // Employees
  { key:'employees.view', ar:'عرض الموظفين', en:'View Employees' },
  { key:'employees.manage', ar:'إدارة الموظفين', en:'Manage Employees' },
  
  // Violations
  { key:'violations.view', ar:'عرض المخالفات', en:'View Violations' },
  { key:'violations.manage', ar:'إدارة المخالفات', en:'Manage Violations' },
  
  // Messages / Archive
  { key:'messages.view', ar:'عرض الرسائل', en:'View Messages' },
  { key:'messages.send', ar:'إرسال رسالة', en:'Send Message' },
  { key:'messages.archive', ar:'أرشفة', en:'Archive' },
  
  // Complaints / Requests
  { key:'tickets.view', ar:'عرض الشكاوى والطلبات', en:'View Tickets' },
  { key:'tickets.reply', ar:'الرد', en:'Reply' },
  { key:'tickets.manage', ar:'إدارة/إغلاق/تعيين', en:'Manage Tickets' },
  
  // Activity
  { key:'activity.view', ar:'عرض سجل النشاطات', en:'View Activity Log' },
];

function listRoles() { return App.store.list(ROLES_COL); }

function seedRolesIfEmpty(){
  var list = [];
  try { list = listRoles() || []; } catch(e){}
  if(list.length) return;

  var allPerms = {};
  PERMS.forEach(function(p){ allPerms[p.key] = true; });

  var roles = [
    { id:'admin', name:'مدير النظام', permissions: allPerms }, // Admin gets all
    { id:'user',  name:'مستخدم',     permissions: {
      'dashboard.view': true,
      'employees.view': true,
      'violations.view': true,
      'members.view': false,
      'roles.view': false,
      'roles.manage': false,
      'messages.view': true,
      'messages.send': false,
      'tickets.view': true,
      'activity.view': false,
    }},
    { id:'hr',    name:'الموارد البشرية', permissions: {
      'dashboard.view': true,
      'employees.view': true,
      'employees.manage': true,
      'violations.view': true,
      'members.view': true,
      'members.update': true,
      'roles.manage': false,
      'messages.view': true,
      'messages.send': true,
      'tickets.view': true,
      'tickets.reply': true,
      'activity.view': true,
    }},
    { id:'manager', name:'مدير', permissions: {
      'dashboard.view': true,
      'employees.view': true,
      'violations.view': true,
      'messages.view': true,
      'messages.send': true,
      'tickets.view': true,
      'tickets.manage': true,
      'activity.view': true,
    }},
  ];

  App.store.importJSON(ROLES_COL, JSON.stringify(roles));
  if(typeof toast === 'function') toast('info', 'System', 'Roles seeded successfully');
}

function renderRoles() {
  var tbody = document.querySelector('#roles-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  listRoles().forEach(function(r){
    var tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors';
    var permsCount = Object.keys(r.permissions || {}).filter(function(k){ return r.permissions[k]; }).length;
    tr.innerHTML = '<td class="p-4 font-medium text-white">' + (r.name || '') + '</td>' +
      '<td class="p-4 text-slate-400">' + permsCount + ' permissions</td>' +
      '<td class="p-4 text-center">' +
      '<button class="text-blue-400 hover:text-blue-300 mx-1" onclick="openRoleModal(\'' + r.id + '\')">✏️</button>' +
      '<button class="text-red-400 hover:text-red-300 mx-1" onclick="deleteRole(\'' + r.id + '\')">🗑️</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function openRoleModal(id) {
  var modal = document.getElementById('role-modal');
  if (!modal) return;
  var role = id ? listRoles().find(function(r){ return r.id === id; }) : { permissions:{} };
  if (!role) return;
  document.getElementById('role-modal-title').textContent = id ? 'تعديل الدور' : 'إضافة دور جديد';
  document.getElementById('role-name').value = role.name || '';
  var fullAccessEl = document.getElementById('role-full-access');
  var fullAccessChecked = !!role.full_access || PERMS.every(function(p){ return !!(role.permissions && role.permissions[p.key]); });
  if (fullAccessEl) fullAccessEl.checked = fullAccessChecked;
  
  // Generate permissions grid from PERMS
  var grid = document.getElementById('role-permissions-grid');
  grid.innerHTML = '';
  
  // Group by category (optional, but nice) or just list
  PERMS.forEach(function(p){
    var div = document.createElement('div');
    div.className = 'flex items-center gap-2 p-1 hover:bg-slate-800/50 rounded';
    
    var chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.className = 'rounded bg-slate-700 border-slate-600 focus:ring-0';
    chk.checked = !!(role.permissions && role.permissions[p.key]);
    chk.id = 'perm-' + p.key.replace(/\./g,'-');
    chk.dataset.key = p.key; // Store key for easy retrieval
    
    var lbl = document.createElement('label');
    lbl.htmlFor = chk.id;
    lbl.className = 'text-sm text-slate-300 cursor-pointer select-none';
    lbl.textContent = p.ar + ' (' + p.en + ')';
    
    div.appendChild(chk);
    div.appendChild(lbl);
    grid.appendChild(div);
  });
  var applyFullAccessMode = function(){
    if (!fullAccessEl) return;
    var allChecks = grid.querySelectorAll('input[type="checkbox"]');
    allChecks.forEach(function(c){
      if (fullAccessEl.checked) {
        c.checked = true;
        c.disabled = true;
      } else {
        c.disabled = false;
      }
    });
  };
  if (fullAccessEl) {
    fullAccessEl.onchange = applyFullAccessMode;
  }
  applyFullAccessMode();

  document.getElementById('role-save-btn').onclick = function() {
    var name = document.getElementById('role-name').value;
    if (!name) return toast('error','Error','Name is required');
    
    var newPerms = {};
    var checkboxes = grid.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(c){
      if(c.checked) newPerms[c.dataset.key] = true;
    });
    if (fullAccessEl && fullAccessEl.checked) {
      PERMS.forEach(function(p){ newPerms[p.key] = true; });
    }

    var data = {
      id: role.id || ('role_' + Date.now()),
      name: name,
      permissions: newPerms,
      full_access: !!(fullAccessEl && fullAccessEl.checked)
    };
    
    if (role.id) App.store.update(ROLES_COL, role.id, data);
    else App.store.create(ROLES_COL, data);
    try {
      if (window.DB_KEYS && typeof upsertItem === 'function') {
        upsertItem(DB_KEYS.roles, data);
        syncToServer('/roles', data);
      }
    } catch(_) {}
    
    if(window.logActivity) window.logActivity(role.id ? ' تعديل دور' : 'إضافة دور', 'الأدوار', name);
    
    modal.classList.remove('open');
    modal.style.display = 'none'; // Ensure display none
    renderRoles();
    if(typeof toast === 'function') toast('success','تم','تم حفظ الدور');
  };
  
  modal.classList.add('open');
  modal.style.display = 'flex';
}
function deleteRole(id) {
    confirmDialog({ title: 'حذف الدور', message: 'هل أنت متأكد؟' }).then(function(yes){
        if(yes){
            App.store.remove(ROLES_COL, id);
            logActivity('حذف دور', 'الأدوار', id);
            renderRoles();
            toast('success','تم','تم الحذف');
        }
    });
}
function can(permission){
   var user = (App.getUser && App.getUser()) || { role: 'Admin' }; // Mock current user
   if (user.role === 'Admin') return true; // Admin has all
   var roles = listRoles();
   var roleId = (window.App && typeof App.getRole === 'function') ? App.getRole() : '';
   var r = roles.find(function(x){ return x.name === user.role || x.id === roleId || x.name === roleId; });
   if (r && r.full_access) return true;
   return r && r.permissions && r.permissions[permission];
}

// --- Messages Module ---
var MSG_COL = 'messages';
var __msgTab = 'inbox';
function listMessages() { return App.store.list(MSG_COL); }
function renderMessages(tab) {
  if (tab) __msgTab = tab;
  var tbody = document.querySelector('#messages-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  // Style tabs
  if(document.getElementById('msg-tab-inbox')) document.getElementById('msg-tab-inbox').className = __msgTab==='inbox' ? 'btn btn-primary text-xs' : 'btn btn-secondary text-xs';
  if(document.getElementById('msg-tab-archive')) document.getElementById('msg-tab-archive').className = __msgTab==='archive' ? 'btn btn-primary text-xs' : 'btn btn-secondary text-xs';

  var list = listMessages().filter(function(m){
    return __msgTab === 'archive' ? m.archived : !m.archived;
  });
  // Sort desc
  list.sort(function(a,b){ return (b.id||0) - (a.id||0); });

  list.forEach(function(m){
    var tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors';
    tr.innerHTML = '<td class="p-4 text-slate-400 text-xs">' + (m.date || '') + '</td>' +
      '<td class="p-4 text-white">' + (m.from || '') + ' ➔ ' + (m.to || '') + '</td>' +
      '<td class="p-4 text-white font-medium">' + (m.title || '') + '</td>' +
      '<td class="p-4 text-slate-300 text-xs">' + (m.body || '') + '</td>' +
      '<td class="p-4 text-center">' +
      '<button class="text-blue-400 hover:text-blue-300 mx-1" onclick="viewMessage(\'' + m.id + '\')">👁️</button>' +
      '<button class="text-yellow-400 hover:text-yellow-300 mx-1" onclick="archiveMessage(\'' + m.id + '\')">' + (m.archived ? '📤' : '📥') + '</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}
function openMessageModal() {
  var modal = document.getElementById('msg-modal');
  if (!modal) return;
  document.getElementById('msg-title').value = '';
  document.getElementById('msg-body').value = '';
  
  // Populate To dropdown
  var sel = document.getElementById('msg-to');
  sel.innerHTML = '<option value="All">All Users</option>';
  listRoles().forEach(function(r){
    var opt = document.createElement('option');
    opt.value = 'Role:' + r.name;
    opt.textContent = 'Role: ' + r.name;
    sel.appendChild(opt);
  });
  // Add some users
  var members = App.store.list('members');
  members.forEach(function(m){
      var opt = document.createElement('option');
      opt.value = m.username || m.name;
      opt.textContent = m.name;
      sel.appendChild(opt);
  });

  document.getElementById('msg-send-btn').onclick = function() {
    var to = document.getElementById('msg-to').value;
    var title = document.getElementById('msg-title').value;
    var body = document.getElementById('msg-body').value;
    if (!title || !body) return toast('error','Error','Missing fields');
    
    var msg = {
      id: Date.now(),
      from: 'Admin', // Mock
      to: to,
      title: title,
      body: body,
      archived: false,
      date: new Date().toLocaleString('ar-SA')
    };
    App.store.create(MSG_COL, msg);
    logActivity('إرسال رسالة', 'الرسائل', title);
    modal.classList.remove('open');
    renderMessages();
    toast('success','Sent','Message sent');
  };
  modal.classList.add('open');
}
function archiveMessage(id) {
    var list = listMessages();
    var m = list.find(function(x){ return String(x.id) === String(id); });
    if (m) {
        m.archived = !m.archived;
        App.store.update(MSG_COL, m.id, m);
        renderMessages();
        toast('success','Done','Message ' + (m.archived ? 'archived' : 'restored'));
    }
}
function viewMessage(id) {
    var m = listMessages().find(function(x){ return String(x.id) === String(id); });
    if (!m) return;
    alert('From: ' + m.from + '\nTo: ' + m.to + '\n\n' + m.title + '\n\n' + m.body);
}

// --- Complaints Module ---
var COMP_COL = 'complaints';
var __compFilter = 'all';
function listComplaints() { 
  return App.store.list(COMP_COL); 
}
function renderComplaints(filter) {
  if (filter) __compFilter = filter;
  var tbody = document.querySelector('#complaints-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  var list = listComplaints();
  
  // Apply RBAC (canAccessBranch)
  if(window.canAccessBranch && window.getCurrentMember){
     var member = window.getCurrentMember();
     // If user is not admin, filter by branch
     if(member.role !== 'admin'){
        list = list.filter(function(c){
           // If complaint has no branch, maybe show it? Or assume global? 
           // For now, let's assume tickets might not have branch, so we only filter if they do.
           // OR: if user is restricted to branches, they should only see tickets from those branches.
           // If ticket has no branch field, we might need to look at createdBy user's branch?
           // Let's assume 'branch' field exists or we skip filtering if missing (to be safe)
           // BUT usually tickets should be linked to branch.
           if(!c.branch) return true; 
           return window.canAccessBranch(c.branch, member);
        });
     }
  }

  if (__compFilter !== 'all') {
      list = list.filter(function(c){ return c.status === __compFilter; });
  }
  
  var catMap = {'0':'عام','1':'تقني','2':'رصيد/حساب','3':'مرفقات','4':'أخرى'};
  list.forEach(function(c){
    var tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors';
    var badgeColor = c.status==='new'?'red':(c.status==='closed'?'green':'yellow');
    var typeLabel = (c.type in catMap) ? catMap[c.type] : (c.type || '');
    tr.innerHTML = '<td class="p-4 text-slate-400 text-xs">#' + c.id + '</td>' +
      '<td class="p-4 text-white font-medium">' + (c.title || '') + '</td>' +
      '<td class="p-4 text-slate-300">' + typeLabel + '</td>' +
      '<td class="p-4 text-slate-300">' + (c.priority || '') + '</td>' +
      '<td class="p-4"><span class="badge badge-'+badgeColor+'">' + (c.status || '') + '</span></td>' +
      '<td class="p-4 text-slate-400 text-xs">' + (c.createdBy || '') + '</td>' +
      '<td class="p-4 text-center">' +
      '<button class="text-blue-400 hover:text-blue-300 mx-1" onclick="openComplaintModal(\'' + c.id + '\')">✏️</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}
function openComplaintModal(id) {
  var modal = document.getElementById('complaint-modal');
  if (!modal) return;
  var isNew = !id;
  var comp = isNew ? { id: Date.now(), status: 'new', replies: [] } : listComplaints().find(function(c){ return String(c.id) === String(id); });
  if (!comp) return;

  document.getElementById('complaint-modal-title').textContent = isNew ? 'New Ticket' : 'Ticket #' + comp.id;
  document.getElementById('comp-title').value = comp.title || '';
  document.getElementById('comp-type').value = comp.type || 'complaint';
  document.getElementById('comp-priority').value = comp.priority || 'medium';
  document.getElementById('comp-status').value = comp.status || 'new';
  document.getElementById('comp-details').value = comp.details || '';
  
  // Render replies
  var box = document.getElementById('comp-replies-box');
  box.innerHTML = '';
  box.classList.remove('hidden');
  if (comp.replies && comp.replies.length) {
      comp.replies.forEach(function(r){
          var d = document.createElement('div');
          d.className = 'mb-2 p-2 bg-slate-800 rounded border border-slate-700';
          d.innerHTML = '<div class="text-xs text-blue-400 mb-1">' + r.user + ' <span class="text-slate-500">(' + r.date + ')</span></div>' +
                        '<div class="text-sm text-slate-200">' + r.text + '</div>';
          box.appendChild(d);
      });
  } else {
      box.textContent = 'No replies yet.';
  }

  // Reply button logic
  document.getElementById('comp-reply-btn').onclick = function() {
      var txt = document.getElementById('comp-reply-input').value;
      if (!txt) return;
      if (!comp.replies) comp.replies = [];
      comp.replies.push({
          user: 'Admin',
          date: new Date().toLocaleString('ar-SA'),
          text: txt
      });
      document.getElementById('comp-reply-input').value = '';
      logActivity('رد على تذكرة', 'الشكاوى', comp.title);
      var d = document.createElement('div');
      d.className = 'mb-2 p-2 bg-slate-800 rounded border border-slate-700';
      d.innerHTML = '<div class="text-xs text-blue-400 mb-1">Admin <span class="text-slate-500">(Now)</span></div>' +
                    '<div class="text-sm text-slate-200">' + txt + '</div>';
      box.appendChild(d);
  };

  document.getElementById('comp-save-btn').onclick = function() {
    var data = {
      id: comp.id,
      title: document.getElementById('comp-title').value,
      type: document.getElementById('comp-type').value,
      priority: document.getElementById('comp-priority').value,
      status: document.getElementById('comp-status').value,
      details: document.getElementById('comp-details').value,
      createdBy: comp.createdBy || 'Admin',
      replies: comp.replies || []
    };
    if (isNew) App.store.create(COMP_COL, data);
    else App.store.update(COMP_COL, data.id, data);
    logActivity(isNew ? 'فتح تذكرة' : 'تحديث تذكرة', 'الشكاوى', data.title);
    modal.classList.remove('open');
    renderComplaints();
    toast('success','Saved','Ticket saved');
  };
  modal.classList.add('open');
}

// --- Inbox for employees/members (DB + local fallback) ---
var INBOX_COL = 'messages';
function switchComplaintsTab(tab){
  var inboxWrap = document.getElementById('inbox-wrap');
  var compWrap = document.getElementById('complaints-wrap');
  var btnM = document.getElementById('comp-tab-messages');
  var btnC = document.getElementById('comp-tab-complaints');
  if(!inboxWrap || !compWrap) return;
  if(tab === 'messages'){
    inboxWrap.style.display = '';
    compWrap.style.display = 'none';
    if(btnM) btnM.className = 'btn btn-primary text-xs';
    if(btnC) btnC.className = 'btn btn-secondary text-xs';
    renderInbox();
  }else{
    inboxWrap.style.display = 'none';
    compWrap.style.display = '';
    if(btnM) btnM.className = 'btn btn-secondary text-xs';
    if(btnC) btnC.className = 'btn btn-primary text-xs';
    renderComplaints();
  }
}
async function listInbox(){
  try{
    if(window.APIClient && APIClient.inbox && APIClient.inbox.list){
      var rows = await APIClient.inbox.list();
      return rows || [];
    }
  }catch(e){ console.warn('inbox.list failed', e); }
  return App.store.list(INBOX_COL) || [];
}
async function renderInbox(){
  var tbody = document.querySelector('#inbox-table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  var rows = await listInbox();
  rows.sort(function(a,b){ return (new Date(b.created_at||b.date||0)) - (new Date(a.created_at||a.date||0)); });
  rows.forEach(function(m){
    var tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors';
    var dateTxt = m.created_at ? new Date(m.created_at).toLocaleString('ar-SA') : (m.date || '');
    var toTxt = m.to_name || m.to || (m.to_type ? (m.to_type + (m.to_id?(' #' + m.to_id):'')) : '');
    var fromTxt = m.from_name || m.from || (m.from_type ? (m.from_type + (m.from_id?(' #' + m.from_id):'')) : 'Admin');
    var status = (m.status || 'new');
    tr.innerHTML =
      '<td class="p-4 text-slate-400 text-xs">' + dateTxt + '</td>' +
      '<td class="p-4 text-white">' + fromTxt + ' ➔ ' + toTxt + '</td>' +
      '<td class="p-4 text-white font-medium">' + (m.title || '') + '</td>' +
      '<td class="p-4 text-slate-300 text-xs">' + (m.priority || 'normal') + '</td>' +
      '<td class="p-4"><span class="badge ' + (status==='new'?'badge-red':(status==='read'?'badge-green':'badge-yellow')) + '">' + status + '</span></td>' +
      '<td class="p-4 text-center">' +
      '<button class="text-blue-400 hover:text-blue-300 mx-1" onclick="viewInboxMessage(\'' + (m.id || '') + '\')">👁️</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}
async function openInboxModal(){
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000';
  var box = document.createElement('div');
  box.style.maxWidth = '640px';
  box.style.width = '96vw';
  box.style.background = 'rgba(17,20,50,0.95)';
  box.style.border = '1px solid rgba(79,172,254,0.25)';
  box.style.borderRadius = '14px';
  box.style.boxShadow = '0 8px 24px rgba(31,38,135,0.35)';
  box.style.padding = '16px';
  var h = document.createElement('div');
  h.textContent = 'رسالة جديدة';
  h.style.color = '#e5e7eb';
  h.style.fontWeight = '600';
  h.style.marginBottom = '10px';
  var to = document.createElement('select');
  to.style.width = '100%';
  to.style.padding = '8px';
  to.style.marginBottom = '8px';
  var subj = document.createElement('input');
  subj.placeholder = 'العنوان';
  subj.style.width = '100%';
  subj.style.padding = '8px';
  subj.style.marginBottom = '8px';
  var body = document.createElement('textarea');
  body.placeholder = 'نص الرسالة';
  body.style.width = '100%';
  body.style.minHeight = '140px';
  body.style.padding = '8px';
  body.style.marginBottom = '8px';
  // Load recipients
  var options = [{value:'All', label:'All Users'}];
  try{
    if(window.APIClient && APIClient.users && APIClient.users.list){
      var users = await APIClient.users.list();
      (users || []).forEach(function(u){
        var name = u.name || u.username || ('User#'+u.id);
        options.push({value:'user:'+u.id, label:'User: '+name});
      });
    }
  }catch(e){}
  try{
    var members = (window.APIClient && APIClient.members && APIClient.members.list) ? await APIClient.members.list() : (App.store.list('members')||[]);
    (members || []).forEach(function(m){
      var name = m.name || m.username || ('Member#'+m.id);
      var id = m.id || m.username || name;
      options.push({value:'member:'+id, label:'Member: '+name});
    });
  }catch(e){}
  options.forEach(function(o){
    var opt = document.createElement('option');
    opt.value = o.value;
    opt.textContent = o.label;
    to.appendChild(opt);
  });
  var actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.justifyContent = 'flex-end';
  actions.style.gap = '8px';
  var cancel = document.createElement('button');
  cancel.textContent = 'إلغاء';
  cancel.className = 'btn btn-secondary';
  cancel.onclick = function(){ document.body.removeChild(overlay); };
  var send = document.createElement('button');
  send.textContent = 'إرسال';
  send.className = 'btn btn-primary';
  send.onclick = async function(){
    if(!subj.value || !body.value) { toast('error','خطأ','الحقول مطلوبة'); return; }
    var val = to.value || 'All';
    var parts = val.split(':');
    var payload = {
      from_name: 'Admin',
      from_type: 'admin',
      to_type: parts[0] || 'all',
      to_id: parts[1] || null,
      to_name: val,
      title: subj.value,
      body: body.value,
      priority: 'normal',
      status: 'new'
    };
    var ok = false;
    try{
      if(window.APIClient && APIClient.inbox && APIClient.inbox.create){
        await APIClient.inbox.create(payload);
        ok = true;
      }
    }catch(e){ console.warn('inbox.create failed', e); }
    if(!ok){
      payload.id = Date.now();
      payload.date = new Date().toLocaleString('ar-SA');
      App.store.create(INBOX_COL, payload);
    }
    logActivity('إرسال رسالة', 'الرسائل', payload.title);
    toast('success','تم','تم الإرسال');
    document.body.removeChild(overlay);
    renderInbox();
  };
  actions.appendChild(cancel);
  actions.appendChild(send);
  box.appendChild(h);
  box.appendChild(to);
  box.appendChild(subj);
  box.appendChild(body);
  box.appendChild(actions);
  overlay.appendChild(box);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}
async function viewInboxMessage(id){
  var rows = await listInbox();
  var m = rows.find(function(x){ return String(x.id) === String(id); });
  if(!m) return;
  try{
    if(window.APIClient && APIClient.inbox && APIClient.inbox.update && m.status !== 'read'){
      await APIClient.inbox.update(m.id, { status: 'read' });
    } else {
      m.status = 'read';
      App.store.update(INBOX_COL, m.id, m);
    }
  }catch(e){}
  alert('من: ' + (m.from_name || m.from || '') + '\nإلى: ' + (m.to_name || m.to || '') + '\n\n' + (m.title || '') + '\n\n' + (m.body || ''));
  renderInbox();
}

// --- Support Tickets (from public site) ---
async function listTickets() {
  try {
    if (window.APIClient && APIClient.tickets && APIClient.tickets.list) {
      return await APIClient.tickets.list();
    }
  } catch(e){ console.warn('tickets.list failed', e); }
  try {
    var arr = JSON.parse(localStorage.getItem('support:tickets') || '[]');
    return arr;
  } catch(e){ return []; }
}
async function renderTickets() {
  var tbody = document.querySelector('#tickets-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  var rows = await listTickets();
  rows.forEach(function(t){
    var tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors';
    var catMap = {'0':'عام','1':'تقني','2':'رصيد/حساب','3':'مرفقات','4':'أخرى'};
    var cat = (String(t.category) in catMap) ? catMap[String(t.category)] : (t.category || '');
    var from = t.name || t.email || t.phone || '-';
    var created = t.created_at || t.createdAt ? new Date(t.created_at || t.createdAt).toLocaleString('ar-SA') : '-';
    tr.innerHTML = '' +
      '<td class="p-4 text-slate-400 text-xs">#' + (t.id || '-') + '</td>' +
      '<td class="p-4 text-white font-medium">' + (t.subject || '') + '</td>' +
      '<td class="p-4 text-slate-300">' + cat + '</td>' +
      '<td class="p-4"><span class="badge ' + ((t.status==='new')?'badge-red':(t.status==='closed'?'badge-green':'badge-yellow')) + '">' + (t.status || '') + '</span></td>' +
      '<td class="p-4 text-slate-300">' + from + '</td>' +
      '<td class="p-4 text-slate-400 text-xs">' + created + '</td>' +
      '<td class="p-4 text-center"><button class="text-blue-400 hover:text-blue-300 mx-1" onclick="openTicketModal(\'' + (t.id || '') + '\')">👁️</button></td>';
    tbody.appendChild(tr);
  });
}

async function openTicketModal(id) {
  var ticket = null;
  try {
    if (window.APIClient && APIClient.tickets && APIClient.tickets.get && id) {
      ticket = await APIClient.tickets.get(id);
    }
  } catch(e){}
  if (!ticket) {
    var rows = await listTickets();
    ticket = rows.find(function(x){ return String(x.id) === String(id); }) || null;
  }
  if (!ticket) return;
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000';
  var box = document.createElement('div');
  box.style.maxWidth = '720px';
  box.style.width = '96vw';
  box.style.background = 'rgba(17,20,50,0.95)';
  box.style.border = '1px solid rgba(79,172,254,0.25)';
  box.style.borderRadius = '14px';
  box.style.boxShadow = '0 8px 24px rgba(31,38,135,0.35)';
  box.style.padding = '16px';
  box.style.maxHeight = '92vh';
  box.style.display = 'flex';
  box.style.flexDirection = 'column';
  var header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '12px';
  var h = document.createElement('div');
  h.textContent = 'Ticket #' + (ticket.id || '-');
  h.style.color = '#e5e7eb';
  h.style.fontWeight = '600';
  h.style.fontSize = '1rem';
  var actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '8px';
  var toggleAttBtn = document.createElement('button');
  toggleAttBtn.textContent = '📎';
  toggleAttBtn.title = 'إظهار/إخفاء المرفقات';
  toggleAttBtn.style.background = 'rgba(255,255,255,0.06)';
  toggleAttBtn.style.border = '1px solid rgba(255,255,255,0.08)';
  toggleAttBtn.style.color = '#fff';
  toggleAttBtn.style.padding = '6px 10px';
  toggleAttBtn.style.borderRadius = '10px';
  toggleAttBtn.style.cursor = 'pointer';
  var printBtn = document.createElement('button');
  printBtn.textContent = '🖨️';
  printBtn.title = 'Print';
  printBtn.style.background = 'rgba(255,255,255,0.06)';
  printBtn.style.border = '1px solid rgba(255,255,255,0.08)';
  printBtn.style.color = '#fff';
  printBtn.style.padding = '6px 10px';
  printBtn.style.borderRadius = '10px';
  printBtn.style.cursor = 'pointer';
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.title = 'Close';
  closeBtn.style.background = 'rgba(255,255,255,0.06)';
  closeBtn.style.border = '1px solid rgba(255,255,255,0.08)';
  closeBtn.style.color = '#fff';
  closeBtn.style.padding = '6px 10px';
  closeBtn.style.borderRadius = '10px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = function(){ document.body.removeChild(overlay); };
  actions.appendChild(toggleAttBtn);
  actions.appendChild(printBtn);
  actions.appendChild(closeBtn);
  header.appendChild(h);
  header.appendChild(actions);
  var contentWrap = document.createElement('div');
  contentWrap.style.overflowY = 'auto';
  contentWrap.style.borderTop = '1px solid rgba(255,255,255,0.06)';
  contentWrap.style.marginTop = '8px';
  var initialH = Math.round(window.innerHeight * 0.7);
  contentWrap.style.height = initialH + 'px';
  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = '1fr 1fr';
  grid.style.gap = '10px';
  var f1 = document.createElement('div');
  f1.style.color = '#cbd5e1';
  f1.innerHTML = '<div style="color:#94a3b8;font-size:0.8rem;">Subject</div><div style="color:#e5e7eb;font-weight:600;">' + (ticket.subject || '') + '</div>';
  var catMap = {'0':'عام','1':'تقني','2':'رصيد/حساب','3':'مرفقات','4':'أخرى'};
  var cat = (String(ticket.category) in catMap) ? catMap[String(ticket.category)] : (ticket.category || '');
  var f2 = document.createElement('div');
  f2.style.color = '#cbd5e1';
  f2.innerHTML = '<div style="color:#94a3b8;font-size:0.8rem;">Category</div><div style="color:#e5e7eb;">' + cat + '</div>';
  var f3 = document.createElement('div');
  f3.style.color = '#cbd5e1';
  f3.innerHTML = '<div style="color:#94a3b8;font-size:0.8rem;">From</div><div style="color:#e5e7eb;">' + (ticket.name || '-') + ' ' + (ticket.email ? '('+ticket.email+')' : '') + ' ' + (ticket.phone ? ticket.phone : '') + '</div>';
  var f4 = document.createElement('div');
  f4.style.color = '#cbd5e1';
  f4.innerHTML = '<div style="color:#94a3b8;font-size:0.8rem;">Status</div><div style="color:#e5e7eb;">' + (ticket.status || '') + '</div>';
  grid.appendChild(f1);
  grid.appendChild(f2);
  grid.appendChild(f3);
  grid.appendChild(f4);
  var desc = document.createElement('div');
  desc.style.marginTop = '10px';
  desc.style.color = '#e5e7eb';
  var dTitle = document.createElement('div');
  dTitle.style.color = '#94a3b8';
  dTitle.style.fontSize = '0.9rem';
  dTitle.style.marginBottom = '6px';
  dTitle.textContent = 'Details';
  var dBody = document.createElement('div');
  dBody.textContent = ticket.desc || '';
  desc.appendChild(dTitle);
  desc.appendChild(dBody);
  var attWrap = document.createElement('div');
  attWrap.style.marginTop = '12px';
  var aTitle = document.createElement('div');
  aTitle.textContent = 'Attachments';
  aTitle.style.color = '#94a3b8';
  aTitle.style.fontSize = '0.9rem';
  aTitle.style.marginBottom = '6px';
  var aList = document.createElement('div');
  aList.style.display = 'grid';
  aList.style.gridTemplateColumns = '1fr';
  aList.style.gap = '10px';
  var atts = ticket.attachments || [];
  atts.forEach(function(a, i){
    var row = document.createElement('div');
    row.style.border = '1px solid rgba(255,255,255,0.08)';
    row.style.borderRadius = '10px';
    row.style.padding = '8px';
    row.style.color = '#e5e7eb';
    var name = a.name || ('file'+(i+1));
    var type = a.type || '';
    var data = a.data || '';
    var head = document.createElement('div');
    head.style.display = 'flex';
    head.style.justifyContent = 'space-between';
    head.style.alignItems = 'center';
    head.style.marginBottom = '6px';
    var lbl = document.createElement('div');
    lbl.textContent = name + (a.size ? (' • ' + Math.round(a.size/1024) + 'KB') : '');
    var dl = document.createElement('a');
    dl.textContent = 'Download';
    dl.href = data || '#';
    dl.download = name;
    dl.style.color = '#93c5fd';
    dl.style.textDecoration = 'underline';
    head.appendChild(lbl);
    head.appendChild(dl);
    var preview = document.createElement('div');
    if (type && type.indexOf('image') === 0 && data) {
      var img = document.createElement('img');
      img.src = data;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '480px';
      img.style.borderRadius = '8px';
      preview.appendChild(img);
    } else if ((type && type.indexOf('pdf') >= 0) && data) {
      var ifr = document.createElement('iframe');
      ifr.src = data;
      ifr.style.width = '100%';
      ifr.style.height = '420px';
      ifr.style.border = '0';
      preview.appendChild(ifr);
    } else if (data) {
      var link = document.createElement('a');
      link.href = data;
      link.textContent = 'Open';
      link.target = '_blank';
      link.style.color = '#93c5fd';
      preview.appendChild(link);
    } else {
      var no = document.createElement('div');
      no.textContent = 'No preview';
      no.style.color = '#94a3b8';
      preview.appendChild(no);
    }
    row.appendChild(head);
    row.appendChild(preview);
    aList.appendChild(row);
  });
  attWrap.appendChild(aTitle);
  attWrap.appendChild(aList);
  // Toggle attachments visibility
  toggleAttBtn.onclick = function(){
    var isHidden = attWrap.style.display === 'none';
    attWrap.style.display = isHidden ? '' : 'none';
  };
  // Resizer handle
  var resizer = document.createElement('div');
  resizer.style.height = '10px';
  resizer.style.cursor = 'ns-resize';
  resizer.style.background = 'rgba(255,255,255,0.06)';
  resizer.style.borderTop = '1px solid rgba(255,255,255,0.08)';
  resizer.style.borderBottomLeftRadius = '12px';
  resizer.style.borderBottomRightRadius = '12px';
  resizer.title = 'اسحب للأعلى/الأسفل لتغيير الارتفاع';
  var isResizing = false;
  var startY = 0;
  var startH = 0;
  resizer.addEventListener('mousedown', function(e){
    isResizing = true;
    startY = e.clientY;
    startH = contentWrap.clientHeight;
    document.body.style.userSelect = 'none';
  });
  window.addEventListener('mousemove', function(e){
    if (!isResizing) return;
    var dy = e.clientY - startY;
    var nh = Math.max(300, Math.min(startH + dy, Math.round(window.innerHeight * 0.9)));
    contentWrap.style.height = nh + 'px';
  });
  window.addEventListener('mouseup', function(){
    isResizing = false;
    document.body.style.userSelect = '';
  });
  printBtn.onclick = function(){
    var w = window.open('', '_blank');
    if (!w) return;
    var html = '<html><head><meta charset="utf-8"><title>Ticket #' + (ticket.id || '-') + '</title></head><body style="font-family:Arial; color:#111;">';
    html += '<h2>Ticket #' + (ticket.id || '-') + '</h2>';
    html += '<div><strong>Subject:</strong> ' + (ticket.subject || '') + '</div>';
    html += '<div><strong>Category:</strong> ' + cat + '</div>';
    html += '<div><strong>Status:</strong> ' + (ticket.status || '') + '</div>';
    html += '<div><strong>From:</strong> ' + (ticket.name || '-') + ' ' + (ticket.email ? '('+ticket.email+')' : '') + ' ' + (ticket.phone ? ticket.phone : '') + '</div>';
    html += '<hr><div><strong>Details:</strong><br>' + (ticket.desc ? String(ticket.desc).replace(/</g,'&lt;').replace(/>/g,'&gt;') : '') + '</div>';
    if (atts && atts.length) {
      html += '<hr><h3>Attachments</h3>';
      atts.forEach(function(a){
        var n = a.name || 'file';
        var t = a.type || '';
        var d = a.data || '';
        html += '<div style="margin-bottom:12px;"><div><strong>' + n + '</strong></div>';
        if (t.indexOf('image') === 0 && d) {
          html += '<img src="' + d + '" style="max-width:100%; margin-top:6px;"/>';
        } else if (t.indexOf('pdf') >= 0 && d) {
          html += '<iframe src="' + d + '" style="width:100%;height:500px;border:0;margin-top:6px;"></iframe>';
        } else if (d) {
          html += '<div><a href="' + d + '" target="_blank">Open</a></div>';
        } else {
          html += '<div>No preview</div>';
        }
        html += '</div>';
      });
    }
    html += '</body></html>';
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };
  box.appendChild(header);
  contentWrap.appendChild(grid);
  contentWrap.appendChild(desc);
  contentWrap.appendChild(attWrap);
  box.appendChild(contentWrap);
  box.appendChild(resizer);
  overlay.appendChild(box);
  overlay.addEventListener('click', function(e){ if(e.target === overlay){ document.body.removeChild(overlay); } });
  document.body.appendChild(overlay);
}

// --- Activity Module ---
var ACT_COL = 'activity';
function listActivity() { return App.store.list(ACT_COL); }

function renderPresence() {
  const grid = document.getElementById('user-status-grid');
  if (!grid) return;

  let members = [];
  if (typeof listMembers === 'function') {
      members = listMembers();
  } else if (window.MEMBERS_COL) {
      members = App.store.list(MEMBERS_COL);
  } else {
      members = App.store.list('members');
  }
  
  let presence = [];
  try { presence = JSON.parse(localStorage.getItem('db:presence') || '[]'); } catch(e){}
  
  // Merge presence into a map for quick lookup
  const presenceMap = {};
  presence.forEach(p => { presenceMap[p.username] = p; });

  // Create a combined list of all known users (members + any extra active sessions)
  const allUsers = [...members];
  
  // Add any active sessions that are not in members list (e.g. Admin)
  presence.forEach(p => {
    const exists = allUsers.find(m => m.username === p.username || m.sap === p.username);
    if (!exists) {
      allUsers.push({ username: p.username, name: p.name || p.username, role: p.role || 'Unknown' });
    }
  });

  if (allUsers.length === 0) {
    grid.innerHTML = '<div class="text-slate-500 text-sm col-span-full">No users found.</div>';
    return;
  }

  const now = Date.now();
  grid.innerHTML = allUsers.map(u => {
    const p = presenceMap[u.username] || presenceMap[u.sap];
    let status = 'offline';
    let lastSeenText = 'Offline';
    let statusColor = 'bg-slate-500';

    if (p) {
      const diff = now - (p.lastSeen || 0);
      if (diff < 2 * 60 * 1000) { // < 2 mins
        status = 'online';
        lastSeenText = 'Online';
        statusColor = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      } else if (diff < 5 * 60 * 1000) { // < 5 mins
        status = 'away';
        lastSeenText = 'Away (' + Math.floor(diff/60000) + 'm ago)';
        statusColor = 'bg-orange-500';
      } else {
        lastSeenText = 'Last seen ' + new Date(p.lastSeen).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      }
    }

    const name = u.name || u.username;
    const role = u.role || u.job_title || 'User';

    return `
      <div class="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3 flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 font-bold">
            ${name.charAt(0).toUpperCase()}
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${statusColor}"></div>
        </div>
        <div>
          <div class="text-slate-200 text-sm font-bold truncate w-32" title="${name}">${name}</div>
          <div class="text-slate-400 text-xs flex items-center gap-1">
            <span>${role}</span>
            <span class="text-slate-600">•</span>
            <span class="${status === 'online' ? 'text-green-400' : 'text-slate-500'}">${lastSeenText}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderActivityLog() {
  renderPresence(); // Update presence whenever log is refreshed

  var tbody = document.querySelector('#activity-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  var term = (document.getElementById('activity-search') && document.getElementById('activity-search').value.toLowerCase()) || '';
  
  var list = listActivity();
  list.sort(function(a,b){ return (b.id||0) - (a.id||0); }); // Newest first
  
  if (term) {
      list = list.filter(function(a){
          return (a.action||'').toLowerCase().includes(term) || 
                 (a.details||'').toLowerCase().includes(term) ||
                 (a.user||'').toLowerCase().includes(term);
      });
  }
  
  // Limit to last 100 for performance
  list.slice(0, 100).forEach(function(a){
    var tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors';
    tr.innerHTML = '<td class="p-4 text-slate-400 text-xs">' + (a.date || '') + '</td>' +
      '<td class="p-4 text-blue-400 text-xs font-bold">' + (a.user || '') + '</td>' +
      '<td class="p-4 text-white font-medium">' + (a.action || '') + '</td>' +
      '<td class="p-4 text-slate-300 text-xs">' + (a.module || '') + '</td>' +
      '<td class="p-4 text-slate-400 text-sm">' + (a.details || '') + '</td>';
    tbody.appendChild(tr);
  });
}

// Update logActivity global
window.logActivity = function(action, moduleOrDetails, detailsOrCount) {
    var module = 'General';
    var details = '';
    
    if (detailsOrCount && typeof detailsOrCount === 'number') {
        module = 'System';
        details = moduleOrDetails + ' (' + detailsOrCount + ')';
    } else {
        module = moduleOrDetails || 'General';
        details = detailsOrCount || '';
    }

    var act = {
        id: Date.now(),
        action: action,
        module: module,
        details: details,
        user: (App.getUser && App.getUser()) || 'Admin',
        date: new Date().toLocaleString('ar-SA')
    };
    try { App.store.create(ACT_COL, act); } catch(e){}
};
window.saveViolation = function() {
  var data = {
    type: document.getElementById('vio-type')?.value || '',
    description: document.getElementById('vio-desc')?.value || '',
    paid: document.getElementById('vio-paid')?.value === 'paid',
    region: document.getElementById('vio-region')?.value || '',
    cost_center: document.getElementById('vio-cost-center')?.value || '',
    vio_no: document.getElementById('vio-number')?.value || '',
    efaa_no: document.getElementById('vio-efaa')?.value || '',
    payment_no: document.getElementById('vio-payment')?.value || '',
    amount: document.getElementById('vio-amount')?.value || '',
    branch: document.getElementById('vio-branch')?.value || '',
    date: document.getElementById('vio-date')?.value || '',
    appeal_status: document.getElementById('vio-appeal')?.value || '',
    appeal_number: document.getElementById('vio-appeal-number')?.value || '',
    appeal_date: document.getElementById('vio-appeal-date')?.value || '',
    finance_date: document.getElementById('vio-finance-date')?.value || ''
  };
  
  // Validate required fields
  if (!data.branch || !data.type || !data.amount) {
    console.error('Missing required fields:', {branch: data.branch, type: data.type, amount: data.amount});
    alert('الرجاء ملء الحقول الإجبارية: الفرع، النوع، والمبلغ');
    return;
  }
  
  console.log('Sending violation data:', data);
  
  var base = (function() {
    if (window.App && App.getApiBase) return App.getApiBase();
    if (localStorage.getItem('api.base')) return localStorage.getItem('api.base');
    
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
  fetch(base + '/violations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    console.log('Response status:', res.status);
    return res.json().then(json => ({status: res.status, data: json}));
  })
  .then(({status, data: res}) => {
    console.log('Response data:', res);
    if(status === 201 || res.id || res.data) {
      try {
        if (window.App && App.store && typeof App.store.create === 'function') {
          var newId = (res && (res.id || (res.data && res.data.id))) || Date.now();
          var localRow = Object.assign({}, data, { id: newId });
          App.store.create('violations', localRow);
        }
      } catch(_){ }
      closeModal('vio-modal');
      if(typeof toast === 'function') toast('success','تم','تم حفظ المخالفة بنجاح');
      // Refresh violations table from API
      if(typeof renderViolationsTableAPI === 'function') {
        console.log('Refreshing violations table from API...');
        renderViolationsTableAPI();
      } else if(typeof renderViolationsTable === 'function') {
        renderViolationsTable();
      }
    } else {
      console.error('Server error:', res);
      alert('حدث خطأ: ' + (res.message || JSON.stringify(res)));
    }
  })
  .catch(err => {
    console.error('Fetch error:', err);
    alert('خطأ في الاتصال: ' + err.message);
  })
  .catch(() => alert('تعذر الاتصال بالسيرفر'));
}

// --- Violations Table (Local Render) ---
window.renderViolationsTable = function(){
  var tbody = document.getElementById('vio-table');
  if (!tbody || !window.App || !App.store || !App.store.list) return;
  var rows = App.store.list('violations') || [];
  if (!Array.isArray(rows)) rows = [];
  if (!rows.length && typeof window.renderViolationsTableAPI === 'function') {
    window.renderViolationsTableAPI();
    return;
  }

  // Update KPIs
  if (typeof updateViolationsKPIs === 'function') {
    updateViolationsKPIs(rows);
  }

  rows = rows.slice().sort(function(a,b){
    return new Date(b.date||b.createdAt||0) - new Date(a.date||a.createdAt||0);
  });

  var sizeEl = document.getElementById('vio-page-size');
  var sizeVal = (sizeEl && sizeEl.value) || '20';
  var pageSize = sizeVal === 'all' ? Infinity : (parseInt(sizeVal,10) || 20);
  window.__vioPage = window.__vioPage || 1;
  var totalPages = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(rows.length / pageSize));
  if (window.__vioPage > totalPages) window.__vioPage = totalPages;
  if (window.__vioPage < 1) window.__vioPage = 1;
  var start = (window.__vioPage - 1) * pageSize;
  var end = start + pageSize;
  var pageRows = pageSize === Infinity ? rows : rows.slice(start, end);

  var infoEl = document.getElementById('vio-page-info');
  if (infoEl) infoEl.textContent = (App.t ? App.t('pagination.page') : 'صفحة') + ' ' + window.__vioPage + ' ' + (App.t ? App.t('pagination.of') : 'من') + ' ' + totalPages;
  var totalEl = document.getElementById('vio-total-count');
  if (totalEl) totalEl.textContent = (App.t ? App.t('table.total') : 'إجمالي:') + ' ' + rows.length;

  var prevBtn = document.getElementById('vio-btn-prev');
  var nextBtn = document.getElementById('vio-btn-next');
  if (prevBtn) prevBtn.disabled = window.__vioPage <= 1;
  if (nextBtn) nextBtn.disabled = window.__vioPage >= totalPages;

  var selectAll = document.getElementById('vio-select-all');
  window.__vioSelect = window.__vioSelect || {};

  function paymentStatusInfo(v){
    try {
      var paidStatus = String(v.paid_status || '').toLowerCase();
      var appeal = String(v.appeal_status || '').toLowerCase();
      var paidRaw = String(v.paid || '').toLowerCase();
      var paid = (paidStatus === 'paid' || (paidRaw === 'true' && paidStatus !== 'false' && paidStatus !== 'cancelled'));
      if (appeal === 'accepted' || paidStatus === 'cancelled' || appeal === 'cancelled') return { text: 'إلغاء المخالفة', style: 'background:#065f46;color:#d1fae5' };
      if (appeal === 'rejected') return { text: 'تم السداد', style: 'background:#065f46;color:#d1fae5' };
      if (paid) return { text: 'تم السداد', style: 'background:#1e40af;color:#dbeafe' };
      if (paidStatus === 'under_study' || appeal === 'under_study') return { text: 'تحت الدراسة', style: 'background:#78350f;color:#fde68a' };
      if (paidStatus === 'not_applicable' || appeal === 'not_applicable' || paidStatus === 'no_appeal') return { text: 'لا يمكن الاعتراض', style: 'background:#374151;color:#e5e7eb' };
      return { text: 'لم يتم السداد', style: 'background:#7f1d1d;color:#fecaca' };
    } catch(_) {
      return { text: 'لم يتم السداد', style: 'background:#7f1d1d;color:#fecaca' };
    }
  }
  function paidBadge(v){
    var info = paymentStatusInfo(v);
    return '<span style="font-size:10px;padding:2px 6px;border-radius:999px;'+info.style+'">'+info.text+'</span>';
  }
  function appealStatusLabel(status){
    var s = String(status || '').toLowerCase();
    if (s === 'under_study') return 'تحت الدراسة';
    if (s === 'accepted') return 'قبول الاعتراض';
    if (s === 'rejected') return 'رفض الاعتراض';
    if (s === 'not_applicable') return 'لا يمكن الاعتراض';
    if (s === 'cancelled') return 'إلغاء المخالفة';
    if (s === 'no_appeal') return 'لا يوجد اعتراض';
    return status || '-';
  }

  tbody.innerHTML = pageRows.length ? '' : '<tr><td colspan="16" class="text-center text-slate-400 py-6">'+(App.t ? App.t('no.records') : 'لا توجد سجلات')+'</td></tr>';

  pageRows.forEach(function(v){
    var id = v.id || v.vio_no || v.violation_no || Date.now() + Math.random();
    var tr = document.createElement('tr');
    var amtNum = v.amount != null ? Number(v.amount) : null;
    var amtTxt = (amtNum != null && !isNaN(amtNum)) ? amtNum.toLocaleString() : (v.amount || '-');
    var d = v.date ? new Date(v.date) : null;
    var dateTxt = (d && !isNaN(d.getTime())) ? d.toLocaleDateString('ar-SA') : (v.date || '-');
    var branchTxt = v.branch ? ('<span class="vio-pill">'+v.branch+'</span>') : '-';
    tr.innerHTML = ''+
      '<td class="text-center"><input type="checkbox" class="vio-select" data-id="'+id+'"></td>'+
      '<td>'+branchTxt+'</td>'+
      '<td>'+(v.cost_center||v.costCenter||v.tc||'-')+'</td>'+
      '<td>'+(v.region||'-')+'</td>'+
      '<td>'+(v.vio_no||v.violation_no||v.number||v.id||'-')+'</td>'+
      '<td>'+(v.efaa_no||v.efaaNo||'-')+'</td>'+
      '<td>'+(v.payment_no||v.paymentNo||'-')+'</td>'+
      '<td>'+(v.type||'-')+'</td>'+
      '<td class="text-right font-mono">'+amtTxt+'</td>'+
      '<td>'+dateTxt+'</td>'+
      '<td>'+appealStatusLabel(v.appeal_status||'-')+'</td>'+
      '<td>'+(v.appeal_date||'-')+'</td>'+
      '<td>'+(v.appeal_number||'-')+'</td>'+
      '<td>'+(v.finance_date||'-')+'</td>'+
    '<td>'+paidBadge(v)+'</td>'+
    '<td class="vio-actions" style="white-space:nowrap"><div class="vio-actions-wrap" style="display:flex;gap:6px;align-items:center;justify-content:center"></div></td>';
    tbody.appendChild(tr);

    try {
      var wrap = tr.querySelector('.vio-actions-wrap');
      if (wrap) {
        var makeIconBtn = function(bg, border, color, label){
          var btn = document.createElement('button');
          btn.title = label || '';
          btn.style.cssText = 'width:28px;height:28px;border-radius:999px;position:relative;display:flex;align-items:center;justify-content:center;background:'+bg+';border:1px solid '+border+';color:'+color;
          return btn;
        };
        // Attachments
        var btnAtt = makeIconBtn('#0f172a','#334155','#cbd5e1','المرفقات');
        btnAtt.innerHTML = '<span style="pointer-events:none">📎</span>';
        btnAtt.onclick = function(){ try{ showViolationAttachments(id); }catch(e){} };
        var c = (window.getViolationAttachmentCount && getViolationAttachmentCount(id)) || 0;
        if (c > 0) {
          var badge = document.createElement('span');
          badge.className = 'vio-att-count';
          badge.setAttribute('data-id', id);
          badge.style.cssText = 'position:absolute;top:-6px;right:-6px;background:#1d4ed8;color:#fff;border-radius:999px;min-width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;font-size:10px;line-height:16px';
          badge.textContent = c;
          btnAtt.appendChild(badge);
        }
        // Edit
        var btnEdit = makeIconBtn('#0f172a','#334155','#cbd5e1','تعديل');
        btnEdit.innerHTML = '<span style="pointer-events:none">✏️</span>';
        btnEdit.onclick = function(){ try{ editViolation(id); }catch(e){} };
        // Delete
        var btnDel = makeIconBtn('#7f1d1d','#7f1d1d','#fff','حذف');
        btnDel.innerHTML = '<span style="pointer-events:none">🗑️</span>';
        btnDel.onclick = function(){ try{ deleteViolationRecord(id); }catch(e){} };

        wrap.appendChild(btnAtt);
        wrap.appendChild(btnEdit);
        wrap.appendChild(btnDel);
      }
    } catch(_) {}
  });

  if (selectAll) {
    var allChecked = pageRows.length && pageRows.every(function(r){
      var rid = r.id || r.vio_no || r.violation_no;
      return !!window.__vioSelect[rid];
    });
    selectAll.checked = !!allChecked;
    selectAll.onchange = function(){
      pageRows.forEach(function(r){
        var rid = r.id || r.vio_no || r.violation_no;
        if (selectAll.checked) window.__vioSelect[rid] = true;
        else delete window.__vioSelect[rid];
      });
      renderViolationsTable();
    };
  }
  var boxes = tbody.querySelectorAll('input.vio-select');
  boxes.forEach(function(b){
    var rid = b.getAttribute('data-id');
    b.checked = !!window.__vioSelect[rid];
    b.onchange = function(){
      if (b.checked) window.__vioSelect[rid] = true;
      else delete window.__vioSelect[rid];
      if (selectAll) {
        var all = pageRows.length && pageRows.every(function(r){
          var id2 = r.id || r.vio_no || r.violation_no;
          return !!window.__vioSelect[id2];
        });
        selectAll.checked = !!all;
      }
    };
  });

  if (!window.__vioHandlersSet) {
    window.__vioHandlersSet = true;
    if (sizeEl) sizeEl.onchange = function(){ window.__vioPage = 1; renderViolationsTable(); };
    if (prevBtn) prevBtn.onclick = function(){ window.__vioPage = Math.max(1, (window.__vioPage||1) - 1); renderViolationsTable(); };
    if (nextBtn) nextBtn.onclick = function(){ window.__vioPage = (window.__vioPage||1) + 1; renderViolationsTable(); };
  }
  try { if (document.getElementById('vio-cards')) renderViolationsCards(); } catch(_){}
};

window.deleteSelectedViolations = function(){
  (async function(){
    if (!window.App || !App.store || !App.store.remove) return;
    var ids = Object.keys(window.__vioSelect || {});
    if (!ids.length) { if (typeof toast==='function') toast('info','تنبيه','لم يتم تحديد أي عناصر'); return; }
    var ok = true;
    if (typeof window.confirmDialog === 'function') {
      ok = await window.confirmDialog({
        title: 'تأكيد الحذف',
        message: 'هل أنت متأكد من حذف ('+ids.length+') من المخالفات المحددة؟',
        confirmText: 'حذف',
        cancelText: 'إلغاء'
      });
    } else {
      ok = window.confirm('هل أنت متأكد من حذف ('+ids.length+') عناصر؟');
    }
    if (!ok) return;
    ids.forEach(function(id){ try { App.store.remove('violations', id); } catch(_){ } });
    window.__vioSelect = {};
    renderViolationsTable();
  })();
};

// --- Violations Charts (Admin) ---
window.renderViolationsCharts = function(){
  var rows = (window.App && App.store && App.store.list && App.store.list('violations')) || [];
  if (!Array.isArray(rows)) rows = [];

  var byBranch = {};
  var byRegion = {};
  var riskByBranch = {};
  var byType = {};
  rows.forEach(function(r){
    var branch = (r.branch || 'غير محدد');
    var region = (r.region || 'غير محدد');
    var type = (r.type || 'غير محدد');
    var amt = Number(r.amount || 0) || 0;
    byBranch[branch] = (byBranch[branch] || 0) + 1;
    byRegion[region] = (byRegion[region] || 0) + 1;
    riskByBranch[branch] = (riskByBranch[branch] || 0) + amt;
    byType[type] = (byType[type] || 0) + 1;
  });

  function topEntries(obj, limit){
    return Object.keys(obj).map(function(k){ return { k:k, v: obj[k] }; })
      .sort(function(a,b){ return b.v - a.v; }).slice(0, limit || 8);
  }

  var freq = topEntries(byBranch, 8);
  var reg = topEntries(byRegion, 8);
  var risk = topEntries(riskByBranch, 8);
  var types = topEntries(byType, 8);

  var freqEl = document.getElementById('chart-freq');
  var regEl = document.getElementById('chart-region');
  var riskEl = document.getElementById('chart-risk');
  var typesEl = document.getElementById('list-types');

  if (freqEl) freqEl.innerHTML = '';
  if (regEl) regEl.innerHTML = '';
  if (riskEl) riskEl.innerHTML = '';
  if (typesEl) typesEl.innerHTML = '';

  if (!window.ApexCharts) {
    if (freqEl) freqEl.innerHTML = '<div class="text-slate-400 text-sm">لا توجد بيانات</div>';
    if (regEl) regEl.innerHTML = '<div class="text-slate-400 text-sm">لا توجد بيانات</div>';
    if (riskEl) riskEl.innerHTML = '<div class="text-slate-400 text-sm">لا توجد بيانات</div>';
  } else {
    if (freqEl) {
      var chart1 = new ApexCharts(freqEl, {
        chart: { type:'bar', height:240, toolbar:{ show:false } },
        theme: { mode:'dark' },
        series: [{ name:'المخالفات', data: freq.map(function(x){ return x.v; }) }],
        xaxis: { categories: freq.map(function(x){ return x.k; }) }
      });
      chart1.render();
    }
    if (regEl) {
      var chart2 = new ApexCharts(regEl, {
        chart: { type:'donut', height:240 },
        theme: { mode:'dark' },
        labels: reg.map(function(x){ return x.k; }),
        series: reg.map(function(x){ return x.v; })
      });
      chart2.render();
    }
    if (riskEl) {
      var chart3 = new ApexCharts(riskEl, {
        chart: { type:'bar', height:240, toolbar:{ show:false } },
        theme: { mode:'dark' },
        series: [{ name:'المبالغ', data: risk.map(function(x){ return x.v; }) }],
        xaxis: { categories: risk.map(function(x){ return x.k; }) }
      });
      chart3.render();
    }
  }

  if (typesEl) {
    typesEl.innerHTML = types.length ? types.map(function(x){
      return '<div class="flex items-center justify-between text-sm text-slate-300 border-b border-slate-700/50 py-1">'
        + '<span>'+x.k+'</span>'
        + '<span class="text-slate-400">'+x.v+'</span>'
        + '</div>';
    }).join('') : '<div class="text-slate-400 text-sm">لا توجد بيانات</div>';
  }
};

// --- Violations Cards (Dual View) ---
function buildViolationCard(v) {
  var id = v.id || v.vio_no || v.violation_no || v.number || '';
  var branch = v.branch || v.location || '-';
  var region = v.region || '-';
  var cc = v.cost_center || v.costCenter || v.tc || '-';
  function appealStatusLabel(status){
    var s = String(status || '').toLowerCase();
    if (s === 'under_study') return 'تحت الدراسة';
    if (s === 'accepted') return 'قبول الاعتراض';
    if (s === 'rejected') return 'رفض الاعتراض';
    if (s === 'not_applicable') return 'لا يمكن الاعتراض';
    if (s === 'cancelled') return 'إلغاء المخالفة';
    if (s === 'no_appeal') return 'لا يوجد اعتراض';
    return status || '—';
  }
  var info = (function(){
    try {
      var ps = String(v.paid_status||'').toLowerCase();
      var as = String(v.appeal_status||'').toLowerCase();
      var paidRaw = String(v.paid || '').toLowerCase();
      var paidFlag = (ps === 'paid' || (paidRaw === 'true' && ps !== 'false' && ps !== 'cancelled'));
      if (as === 'accepted' || ps === 'cancelled' || as === 'cancelled') return { text: 'إلغاء المخالفة', style: 'background:#065f46;color:#d1fae5' };
      if (as === 'rejected') return { text: 'تم السداد', style: 'background:#065f46;color:#d1fae5' };
      if (paidFlag) return { text: 'تم السداد', style: 'background:#1e40af;color:#dbeafe' };
      if (ps === 'under_study' || as === 'under_study') return { text: 'تحت الدراسة', style: 'background:#78350f;color:#fde68a' };
      if (ps === 'not_applicable' || as === 'not_applicable' || ps === 'no_appeal') return { text: 'لا يمكن الاعتراض', style: 'background:#374151;color:#e5e7eb' };
      return { text: 'لم يتم السداد', style: 'background:#7f1d1d;color:#fecaca' };
    } catch(_) {
      return { text: 'لم يتم السداد', style: 'background:#7f1d1d;color:#fecaca' };
    }
  })();
  var paidTxt = info.text;
  var paidCls = info.style;
  var amount = (v.amount != null && !isNaN(Number(v.amount))) ? Number(v.amount).toLocaleString('ar-SA') : (v.amount || '-');
  var date = v.date || '-';
  var appealStatus = appealStatusLabel(v.appeal_status || v.appeal || '—');
  var appealDate = v.appeal_date || '—';
  var appealNo = v.appeal_number || '—';
  var finDate = v.finance_date || '—';
  var vioNo = v.vio_no || v.violation_no || v.number || '—';
  var efaaNo = v.efaa_no || v.efaaNo || '—';
  var payNo = v.payment_no || v.paymentNo || '—';
  var type = v.type || '—';
  var header = ''+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">'+
      '<div style="color:#e2e8f0;font-weight:700;">'+
        '<span style="margin-inline-start:6px;">'+branch+'</span>'+
        '<span style="color:#94a3b8;font-weight:500;margin-inline-start:6px;">'+region+'</span>'+
        '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">cost center: '+cc+'</div>'+
      '</div>'+
      '<span style="font-size:12px;padding:4px 8px;border-radius:999px;'+paidCls+'">'+paidTxt+'</span>'+
    '</div>';
  var infoTable = ''+
    '<div style="margin-top:10px">'+
      '<div style="color:#e2e8f0;font-weight:700;margin-bottom:8px">تفاصيل المخالفة</div>'+
      '<table style="width:100%;border-collapse:separate;border-spacing:0 8px;table-layout:fixed">'+
        '<tbody>'+
          '<tr>'+
            '<td style="width:50%;padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">رقم المخالفة</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+vioNo+'</span>'+
            '</td>'+
            '<td style="width:50%;padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">رقم مخالفة ايفاء</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+efaaNo+'</span>'+
            '</td>'+
          '</tr>'+
          '<tr>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">رقم السداد</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+payNo+'</span>'+
            '</td>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">المبلغ</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#fca5a5;font-size:13px;font-weight:700">'+amount+' ريال</span>'+
            '</td>'+
          '</tr>'+
          '<tr>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">نوع المخالفة</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+type+'</span>'+
            '</td>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">التاريخ</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+date+'</span>'+
            '</td>'+
          '</tr>'+
          '<tr>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">حالة الاعتراض</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#f59e0b;font-size:13px;font-weight:700">'+appealStatus+'</span>'+
            '</td>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">تاريخ تقديم الاعتراض</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+appealDate+'</span>'+
            '</td>'+
          '</tr>'+
          '<tr>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">رقم الاعتراض</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+appealNo+'</span>'+
            '</td>'+
            '<td style="padding:10px;border:1px solid #334155;border-radius:8px;background:#020617;text-align:right;word-break:break-word">'+
              '<span style="color:#94a3b8;font-size:12px;font-weight:600">تاريخ الإرسال للمالية</span>'+
              '<span style="display:inline-block;width:1px;height:14px;background:#94a3b8;opacity:.8;vertical-align:middle;margin:0 8px"></span>'+
              '<span style="color:#e2e8f0;font-size:13px">'+finDate+'</span>'+
            '</td>'+
          '</tr>'+
        '</tbody>'+
      '</table>'+
    '</div>';
  var actions = ''+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">'+
      '<button onclick="try{ editViolation(\''+id+'\'); }catch(e){}" class="btn" style="background:#1d4ed8;color:#fff;border-color:#1e40af">عرض التفاصيل</button>'+
      '<button onclick="try{ showViolationAttachments(\''+id+'\'); }catch(e){}" class="btn" style="background:#475569;color:#e2e8f0;border-color:#64748b">المرفقات ('+((window.getViolationAttachmentCount && getViolationAttachmentCount(id)) || 0)+')</button>'+
      '<button onclick="window.print && print()" class="btn" style="background:#334155;color:#e2e8f0;border-color:#475569">طباعة</button>'+
    '</div>';
  var attsHtml = (function(){
    try {
      var raw = localStorage.getItem('db:violation_attachments');
      var map = raw ? JSON.parse(raw) : {};
      var arr = map[id] || [];
      if (!arr.length) return '';
      var grid = arr.slice(0, 4).map(function(a){
        if (a.url && String(a.type||'').indexOf('image') === 0) {
          return '<div><img src="'+a.url+'" style="max-width:100%;border-radius:6px"/></div>';
        } else if (a.url) {
          return '<div><a class="btn btn-icon-sm" target="_blank" href="'+a.url+'" title="فتح في نافذة جديدة" data-tooltip="فتح في نافذة جديدة">🔗</a></div>';
        } else {
          return '<div style="color:#94a3b8">—</div>';
        }
      }).join('');
      return '<div style="margin-top:12px"><div style="color:#e2e8f0;font-weight:700;margin-bottom:8px">المرفقات</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">'+grid+'</div></div>';
    } catch(_) { return ''; }
  })();
  return '<div class="vio-card" style="padding:12px;">'
    + header
    + infoTable
    + attsHtml
    + actions
    + '</div>';
}

window.renderViolationsCards = function(){
  var wrap = document.getElementById('vio-cards');
  if (!wrap) return;
  var rows = (window.App && App.store && App.store.list && App.store.list('violations')) || [];
  if (!Array.isArray(rows)) rows = [];
  
  // Get filter values
  var filterEl = document.getElementById('vio-cards-filter');
  var mode = filterEl ? filterEl.value : 'active';
  
  var regionFilterEl = document.getElementById('region-filter');
  var regionFilter = regionFilterEl ? regionFilterEl.value : 'all';
  
  var filtered = rows.filter(function(v){
    if (mode === 'all') return true;
    var paid = (v && (v.paid === true || String(v.paid).toLowerCase() === 'true'));
    if (mode === 'archived') return paid || String(v.appeal_status||'').toLowerCase()==='cancelled';
    // active
    return !paid;
  });
  
  // Apply region filter
  if (regionFilter !== 'all') {
    filtered = filtered.filter(function(v) {
      var region = String(v.region || '').toLowerCase();
      return region === regionFilter.toLowerCase();
    });
  }
  
  wrap.innerHTML = filtered.map(buildViolationCard).join('') || '<div class="text-slate-400 text-sm">لا توجد بيانات</div>';
};

// Populate region filter dropdown
window.populateRegionFilter = function() {
  var regionFilterEl = document.getElementById('region-filter');
  if (!regionFilterEl) return;
  
  var rows = (window.App && App.store && App.store.list && App.store.list('violations')) || [];
  if (!Array.isArray(rows)) rows = [];
  
  // Get unique regions
  var regions = new Set();
  rows.forEach(function(v) {
    var region = v.region;
    if (region && typeof region === 'string' && region.trim()) {
      regions.add(region.trim());
    }
  });
  
  // Clear existing options except "All Regions"
  var allOption = regionFilterEl.querySelector('option[value="all"]');
  regionFilterEl.innerHTML = '';
  if (allOption) {
    regionFilterEl.appendChild(allOption);
  } else {
    var defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = 'جميع المناطق';
    defaultOption.setAttribute('data-en', 'All Regions');
    defaultOption.setAttribute('data-ar', 'جميع المناطق');
    regionFilterEl.appendChild(defaultOption);
  }
  
  // Add region options
  var sortedRegions = Array.from(regions).sort();
  sortedRegions.forEach(function(region) {
    var option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionFilterEl.appendChild(option);
  });
};

// ==============================
// LICENSES & CONTRACTS MODULE
// ==============================
window.DB_KEYS = window.DB_KEYS || {};
window.DB_KEYS.licenses = 'db:licenses';

window.openLicenseModal = function() {
  document.getElementById('lic-emp-id').value = '';
  document.getElementById('lic-emp-name').value = '';
  document.getElementById('lic-type').value = 'license';
  document.getElementById('lic-subtype').value = '';
  document.getElementById('lic-number').value = '';
  document.getElementById('lic-issued').value = '';
  document.getElementById('lic-expiry').value = '';
  document.getElementById('lic-authority').value = '';
  document.getElementById('lic-notes').value = '';
  
  window.__licenseEditingId = null;
  const modal = document.getElementById('license-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('open');
  }
};

window.closeLicenseModal = function() {
  const modal = document.getElementById('license-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open');
  }
  window.__licenseEditingId = null;
};

window.saveLicense = function() {
  const empId = document.getElementById('lic-emp-id').value.trim();
  const empName = document.getElementById('lic-emp-name').value.trim();
  const type = document.getElementById('lic-type').value;
  const subtype = document.getElementById('lic-subtype').value.trim();
  const number = document.getElementById('lic-number').value.trim();
  const issued = document.getElementById('lic-issued').value;
  const expiry = document.getElementById('lic-expiry').value;
  const authority = document.getElementById('lic-authority').value.trim();
  const notes = document.getElementById('lic-notes').value.trim();
  
  if (!empId || !empName || !type || !number || !expiry) {
    if (typeof toast === 'function') toast('warning', 'حقول مطلوبة', 'يرجى ملء رقم الموظف، الاسم، النوع، الرقم، وتاريخ الانتهاء');
    return;
  }
  
  const data = {
    id: window.__licenseEditingId || 'lic_' + Date.now() + '_' + Math.random().toString(16).slice(2),
    employee_id: empId,
    employee_name: empName,
    type: type,
    subtype: subtype,
    number: number,
    issued_date: issued,
    expiry_date: expiry,
    issuing_authority: authority,
    notes: notes,
    created_at: window.__licenseEditingId ? undefined : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Save to localStorage
  const licenses = safeList(window.DB_KEYS.licenses) || [];
  const idx = licenses.findIndex(l => l.id === data.id);
  if (idx > -1) {
    licenses[idx] = Object.assign({}, licenses[idx], data);
  } else {
    licenses.push(data);
  }
  safeSave(window.DB_KEYS.licenses, licenses);
  
  // Sync to server
  if (typeof syncToServer === 'function') {
    syncToServer('/licenses', data);
  }
  
  if (typeof logActivity === 'function') {
    logActivity(idx > -1 ? 'تعديل ترخيص' : 'إضافة ترخيص', 'التراخيص والعقود', empName);
  }
  
  closeLicenseModal();
  renderLicensesTable();
  
  if (typeof toast === 'function') {
    toast('success', 'تم الحفظ', 'تم حفظ الترخيص/العقد بنجاح');
  }
};

window.editLicense = function(id) {
  const licenses = safeList(window.DB_KEYS.licenses) || [];
  const license = licenses.find(l => l.id === id);
  
  if (!license) return;
  
  window.__licenseEditingId = license.id;
  document.getElementById('lic-emp-id').value = license.employee_id || '';
  document.getElementById('lic-emp-name').value = license.employee_name || '';
  document.getElementById('lic-type').value = license.type || 'license';
  document.getElementById('lic-subtype').value = license.subtype || '';
  document.getElementById('lic-number').value = license.number || '';
  document.getElementById('lic-issued').value = license.issued_date || '';
  document.getElementById('lic-expiry').value = license.expiry_date || '';
  document.getElementById('lic-authority').value = license.issuing_authority || '';
  document.getElementById('lic-notes').value = license.notes || '';
  
  window.openLicenseModal();
};

window.deleteLicense = function(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الترخيص/العقد؟')) return;
  
  const licenses = safeList(window.DB_KEYS.licenses) || [];
  const filtered = licenses.filter(l => l.id !== id);
  safeSave(window.DB_KEYS.licenses, filtered);
  
  if (typeof logActivity === 'function') {
    logActivity('حذف ترخيص', 'التراخيص والعقود', id);
  }
  
  renderLicensesTable();
  
  if (typeof toast === 'function') {
    toast('success', 'تم الحذف', 'تم حذف الترخيص/العقد');
  }
};

window.renderLicensesTable = function() {
  const tbody = document.getElementById('licenses-table');
  if (!tbody) return;
  
  const licenses = safeList(window.DB_KEYS.licenses) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thirtyDaysAhead = new Date(today);
  thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);
  
  let total = 0;
  let expiring = 0;
  let expired = 0;
  
  licenses.forEach(l => {
    total++;
    const expiryDate = new Date(l.expiry_date);
    expiryDate.setHours(0, 0, 0, 0);
    
    if (expiryDate < today) {
      expired++;
    } else if (expiryDate <= thirtyDaysAhead) {
      expiring++;
    }
  });
  
  // Update KPIs
  const totalEl = document.getElementById('lic-kpi-total');
  const expiringEl = document.getElementById('lic-kpi-expiring');
  const expiredEl = document.getElementById('lic-kpi-expired');
  
  if (totalEl) totalEl.textContent = String(total);
  if (expiringEl) expiringEl.textContent = String(expiring);
  if (expiredEl) expiredEl.textContent = String(expired);
  
  // Clear table
  tbody.innerHTML = '';
  
  if (licenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:15px">لا توجد تراخيص أو عقود</td></tr>';
    return;
  }
  
  // Sort by expiry date
  const sorted = [...licenses].sort((a, b) => {
    return new Date(a.expiry_date) - new Date(b.expiry_date);
  });
  
  sorted.forEach((license, index) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors';
    
    // Determine status
    const expiryDate = new Date(license.expiry_date);
    expiryDate.setHours(0, 0, 0, 0);
    let statusClass = 'bg-emerald-600';
    let statusText = 'سارية';
    
    if (expiryDate < today) {
      statusClass = 'bg-red-600';
      statusText = 'منتهية';
    } else if (expiryDate <= thirtyDaysAhead) {
      statusClass = 'bg-yellow-600';
      statusText = 'قارب الانتهاء';
    }
    
    // Type label
    const typeLabel = license.type === 'license' ? 'ترخيص' : 
                     license.type === 'contract' ? 'عقد' : 'إذن';
    
    tr.innerHTML = `
      <td class="p-2 text-center text-slate-500 font-mono text-xs">${index + 1}</td>
      <td class="p-2 text-slate-200">${license.employee_name}</td>
      <td class="p-2 text-slate-300">${typeLabel}</td>
      <td class="p-2 text-slate-400 text-xs">${license.subtype || '-'}</td>
      <td class="p-2 text-slate-400 font-mono text-xs">${license.number || '-'}</td>
      <td class="p-2 text-slate-400 font-mono text-xs">${license.issued_date || '-'}</td>
      <td class="p-2 text-slate-400 font-mono text-xs">${license.expiry_date || '-'}</td>
      <td class="p-2 text-center">
        <span class="px-2 py-0.5 rounded text-[11px] text-white ${statusClass}">${statusText}</span>
      </td>
      <td class="p-2 flex gap-2 justify-center">
        <button class="text-blue-400 hover:text-blue-300 transition-colors p-1" title="تعديل" onclick="editLicense('${license.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
        </button>
        <button class="text-red-400 hover:text-red-300 transition-colors p-1" title="حذف" onclick="deleteLicense('${license.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// ==============================
// Initialize on page load
// ==============================
document.addEventListener('DOMContentLoaded', function() {
  // Bind showSection to licenses
  const origShowSection = window.showSection;
  window.showSection = function(id) {
    if (origShowSection) origShowSection(id);
    if (id === 'licenses') {
      try { renderLicensesTable(); } catch(e) {}
    }
    if (id === 'violations') {
      try {
        var cards = document.getElementById('vio-cards');
        if (cards) cards.style.display = 'grid';
        renderViolationsTable();
        renderViolationsCards();
        var tgl = document.getElementById('vio-cards-toggle');
        if (tgl) tgl.onclick = function(){
          var el = document.getElementById('vio-cards');
          if (!el) return;
          el.style.display = (el.style.display === 'none' || !el.style.display) ? 'grid' : 'none';
        };
        var flt = document.getElementById('vio-cards-filter');
        if (flt) flt.onchange = function(){ renderViolationsCards(); };
        
        // Initialize region filter
        var regionFlt = document.getElementById('region-filter');
        if (regionFlt) {
          regionFlt.onchange = function(){ renderViolationsCards(); };
          populateRegionFilter();
        }
      } catch(_){}
    }
  };
  
  // Bind license excel import
  const licExcelInput = document.getElementById('lic-excel-input');
  if (licExcelInput) {
    licExcelInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          if (window.XLSX && window.XLSX.read) {
            const workbook = window.XLSX.read(evt.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = window.XLSX.utils.sheet_to_json(sheet);
            
            const licenses = safeList(window.DB_KEYS.licenses) || [];
            let imported = 0;
            
            data.forEach(row => {
              if (row['Employee ID'] && row['License Expiry']) {
                const license = {
                  id: 'lic_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                  employee_id: String(row['Employee ID'] || ''),
                  employee_name: String(row['Employee Name'] || ''),
                  type: String(row['Type'] || 'license'),
                  subtype: String(row['Sub-Type'] || ''),
                  number: String(row['License Number'] || ''),
                  issued_date: String(row['Issued Date'] || ''),
                  expiry_date: String(row['License Expiry'] || row['Expiry Date'] || ''),
                  issuing_authority: String(row['Authority'] || ''),
                  notes: String(row['Notes'] || ''),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                licenses.push(license);
                imported++;
              }
            });
            
            safeSave(window.DB_KEYS.licenses, licenses);
            renderLicensesTable();
            
            if (typeof toast === 'function') {
              toast('success', 'استيراد ناجح', `تم استيراد ${imported} ترخيص/عقد`);
            }
          } else {
            if (typeof toast === 'function') {
              toast('error', 'خطأ', 'مكتبة XLSX غير متاحة');
            }
          }
        } catch (err) {
          console.error('Excel import error:', err);
          if (typeof toast === 'function') {
            toast('error', 'خطأ في الاستيراد', err.message);
          }
        }
      };
      reader.readAsBinaryString(file);
      e.target.value = '';
    });
  }
});
