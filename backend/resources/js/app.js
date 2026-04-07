import './bootstrap';

// Global functions for user profile and support ticket
window.showProfile = function(){
  var menu = document.getElementById('user-menu');
  if (menu) menu.classList.remove('open');
  var existing = document.getElementById('profile-overlay');
  if (existing) {
    existing.style.display = 'flex';
    return;
  }
  var lang = (document.documentElement && document.documentElement.lang) === 'ar' ? 'ar' : 'en';
  var name = (typeof getUser === 'function' ? getUser() : '') || (lang==='ar'?'المستخدم':'User');
  var u = null;
  try { u = JSON.parse(localStorage.getItem('user') || 'null'); } catch(e){ u = null; }
  var overlay = document.createElement('div');
  overlay.id = 'profile-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '1000';
  var box = document.createElement('div');
  box.style.maxWidth = '420px';
  box.style.width = '92vw';
  box.style.background = 'rgba(17,20,50,0.85)';
  box.style.backdropFilter = 'blur(12px)';
  box.style.border = '1px solid rgba(79,172,254,0.25)';
  box.style.borderRadius = '14px';
  box.style.boxShadow = '0 8px 24px rgba(31,38,135,0.35)';
  box.style.padding = '16px';
  var title = document.createElement('div');
  title.textContent = lang==='ar'?'ملفي':'My Profile';
  title.style.color = '#e5e7eb';
  title.style.fontWeight = '600';
  title.style.marginBottom = '10px';
  title.style.fontSize = '1rem';
  var row1 = document.createElement('div');
  row1.style.color = '#cbd5e1';
  row1.style.fontSize = '0.9rem';
  row1.style.marginBottom = '6px';
  row1.textContent = lang==='ar'?'الاسم: ':'Name: ' + name;
  var email = u && u.email ? u.email : null;
  var role = u && u.role ? u.role : null;
  var row2 = document.createElement('div');
  row2.style.color = '#cbd5e1';
  row2.style.fontSize = '0.9rem';
  row2.style.marginBottom = '6px';
  row2.textContent = lang==='ar'?'البريد: ':'Email: ' + email;
  var row3 = document.createElement('div');
  row3.style.color = '#cbd5e1';
  row3.style.fontSize = '0.9rem';
  row3.style.marginBottom = '12px';
  row3.textContent = lang==='ar'?'الدور: ':'Role: ' + (role || (lang==='ar'?'موظف':'Employee'));
  var btns = document.createElement('div');
  btns.style.display = 'flex';
  btns.style.justifyContent = 'flex-end';
  btns.style.gap = '8px';
  var closeBtn = document.createElement('button');
  closeBtn.textContent = lang==='ar'?'إغلاق':'Close';
  closeBtn.style.background = 'rgba(79,172,254,0.2)';
  closeBtn.style.border = '1px solid rgba(79,172,254,0.3)';
  closeBtn.style.color = '#fff';
  closeBtn.style.padding = '8px 12px';
  closeBtn.style.borderRadius = '10px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = function(){ document.body.removeChild(overlay); };
  btns.appendChild(closeBtn);
  box.appendChild(title);
  box.appendChild(row1);
  if (email) box.appendChild(row2);
  if (role) box.appendChild(row3);
  box.appendChild(btns);
  overlay.appendChild(box);
  overlay.addEventListener('click', function(e){ if(e.target === overlay){ document.body.removeChild(overlay); } });
  document.body.appendChild(overlay);
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
  var subj = document.createElement('input');
  subj.placeholder = lang==='ar'?'العنوان':'Subject';
  subj.style.width = '100%';
  subj.style.marginBottom = '8px';
  subj.className = 'form-control';
  var cat = document.createElement('select');
  cat.style.width = '100%';
  cat.style.marginBottom = '8px';
  cat.className = 'form-control';
  var categories = [
    {val:'',label:lang==='ar'?'اختر الفئة...':'Choose category...'},
    {val:'bug',label:lang==='ar'?'خلل تقني':'Bug Report'},
    {val:'feature',label:lang==='ar'?'اقتراح ميزة':'Feature Request'},
    {val:'help',label:lang==='ar'?'مساعدة':'General Help'},
    {val:'account',label:lang==='ar'?'حسابي':'Account Issue'}
  ];
  categories.forEach(function(c){
    var opt = document.createElement('option');
    opt.value = c.val;
    opt.textContent = c.label;
    cat.appendChild(opt);
  });
  var msg = document.createElement('textarea');
  msg.placeholder = lang==='ar'?'الوصف التفصيلي...':'Detailed description...';
  msg.style.width = '100%';
  msg.style.minHeight = '90px';
  msg.style.marginBottom = '10px';
  msg.className = 'form-control';
  var btns = document.createElement('div');
  btns.style.display = 'flex';
  btns.style.justifyContent = 'flex-end';
  btns.style.gap = '8px';
  var sendBtn = document.createElement('button');
  sendBtn.textContent = lang==='ar'?'إرسال':'Send';
  sendBtn.style.background = 'rgba(79,172,254,0.2)';
  sendBtn.style.border = '1px solid rgba(79,172,254,0.3)';
  sendBtn.style.color = '#fff';
  sendBtn.style.padding = '8px 14px';
  sendBtn.style.borderRadius = '10px';
  sendBtn.style.cursor = 'pointer';
  sendBtn.onclick = function(){
    var data = {subject:subj.value,category:cat.value,message:msg.value};
    if(!data.subject||!data.message){alert(lang==='ar'?'يرجى ملء الحقول المطلوبة.':'Please fill required fields.');return;}
    sendBtn.disabled = true;
    sendBtn.textContent = lang==='ar'?'جارٍ الإرسال...':'Sending...';
    fetch('/api/support/ticket',{
      method:'POST',
      headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name="csrf-token"]')?document.querySelector('meta[name="csrf-token"]').content:''},
      body:JSON.stringify(data)
    })
    .then(function(r){return r.json();})
    .then(function(r){
      alert(lang==='ar'?'تم الإرسال بنجاح!':'Sent successfully!');
      document.body.removeChild(overlay);
    })
    .catch(function(e){
      alert(lang==='ar'?'حدث خطأ أثناء الإرسال.':'Error occurred while sending.');
      sendBtn.disabled = false;
      sendBtn.textContent = lang==='ar'?'إرسال':'Send';
    });
  };
  var closeBtn = document.createElement('button');
  closeBtn.textContent = lang==='ar'?'إلغاء':'Cancel';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = '1px solid rgba(148,163,184,0.3)';
  closeBtn.style.color = '#cbd5e1';
  closeBtn.style.padding = '8px 14px';
  closeBtn.style.borderRadius = '10px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = function(){ document.body.removeChild(overlay); };
  btns.appendChild(closeBtn);
  btns.appendChild(sendBtn);
  box.appendChild(title);
  box.appendChild(subj);
  box.appendChild(cat);
  box.appendChild(msg);
  box.appendChild(btns);
  overlay.appendChild(box);
  overlay.addEventListener('click', function(e){ if(e.target === overlay){ document.body.removeChild(overlay); } });
  document.body.appendChild(overlay);
};