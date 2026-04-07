/* =========================
   FALLBACK STORE (Only if App not loaded)
========================= */
if (!window.App) {
  window.App = {
    init: function(page) { console.log("App initialized (fallback)", page); },
    currentUser: { id: 1, name: 'Admin', role: 'admin' },
    store: {
      _read: function(coll) {
        try { return JSON.parse(localStorage.getItem("db:" + coll) || "[]"); } catch(e){ return []; }
      },
      _write: function(coll, data) {
        localStorage.setItem("db:" + coll, JSON.stringify(data));
      },
      list: function(coll) { return this._read(coll); },
      get: function(coll, id) { return this._read(coll).find(i => i.id == id); },
      create: function(coll, data) {
        const list = this._read(coll);
        const newItem = { ...data, id: data.id || Date.now() };
        list.push(newItem);
        this._write(coll, list);
        return newItem;
      },
      update: function(coll, id, data) {
        const list = this._read(coll);
        const idx = list.findIndex(i => i.id == id);
        if(idx > -1) {
          list[idx] = { ...list[idx], ...data };
          this._write(coll, list);
          return list[idx];
        }
        return null;
      },
      remove: function(coll, id) {
        const list = this._read(coll);
        const newList = list.filter(i => i.id != id);
        this._write(coll, newList);
      }
    }
  };
}

/* =========================
   HELPERS
========================= */
const asId = (v) => String(v);

// =========================
// i18n (AR/EN) - WORKING
// =========================
const translations = {
  ar: {
    dashboard: "لوحة المهام",
    taskManagement: "إدارة المهام",
    newTask: "مهمة جديدة",
    notifications: "الإشعارات",

    pending: "قيد الانتظار",
    progress: "جاري العمل",
    completed: "مكتملة",

    replies: "الردود",
    writeReply: "اكتب رد…",
    send: "إرسال",
    unassigned: "غير مسند",
    noReplies: "لا توجد ردود بعد",

    assignedTo: "إسناد إلى",
    priority: "الأولوية",
    dueDate: "تاريخ الاستحقاق",
    status: "الحالة",
    cancel: "إلغاء",
    save: "حفظ",

    required: "العنوان مطلوب",
    permissionDenied: "صلاحية مرفوضة",
    deleteAdminsOnly: "الحذف متاح للمشرف فقط",
    confirmDelete: "تأكيد حذف المهمة؟",
    delete: "حذف",
    view: "عرض"
  },
  en: {
    dashboard: "Tasks Dashboard",
    taskManagement: "Task Management",
    newTask: "New Task",
    notifications: "Notifications",

    pending: "Pending",
    progress: "In Progress",
    completed: "Completed",

    replies: "Replies",
    writeReply: "Write a reply…",
    send: "Send",
    unassigned: "Unassigned",
    noReplies: "No replies yet",

    assignedTo: "Assign to",
    priority: "Priority",
    dueDate: "Due date",
    status: "Status",
    cancel: "Cancel",
    save: "Save",

    required: "Title is required",
    permissionDenied: "Permission denied",
    deleteAdminsOnly: "Delete is for admins only",
    confirmDelete: "Confirm delete task?",
    delete: "Delete",
    view: "View"
  }
};

let LANG = localStorage.getItem("lang") || "ar";

function t(key) {
  return translations[LANG]?.[key] ?? key;
}

function translatePriority(p){
  const map = {
    ar: { high:"عالية", medium:"متوسطة", low:"منخفضة" },
    en: { high:"High",  medium:"Medium",  low:"Low" }
  };
  return map[LANG]?.[p] || p;
}

function applyTranslations() {
  // direction + language
  document.documentElement.lang = LANG;
  document.documentElement.dir = (LANG === "ar") ? "rtl" : "ltr";
  document.body.classList.toggle("ar", LANG === "ar");

  // texts
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });

  // button label
  const lab = document.getElementById("langLabel");
  if(lab) lab.textContent = (LANG === "ar") ? "AR" : "EN";
}

function setLanguage(nextLang){
  LANG = nextLang;
  localStorage.setItem("lang", LANG);
  applyTranslations();

  // IMPORTANT: re-render tasks to update priority/status labels inside cards
  if(typeof renderKanbanTasks === "function") renderKanbanTasks();
}

function toggleLanguage(){
  setLanguage(LANG === "ar" ? "en" : "ar");
}

document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);

// init
applyTranslations();

function showToast({ type = "success", title = "تم", message = "", duration = 2400 } = {}) {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const icons = { success: "✅", warning: "⚠️", error: "🛑", info: "💠" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.success}</div>
    <div class="toast-body">
      <p class="toast-title">${title}</p>
      <p class="toast-msg">${message}</p>
    </div>
    <div class="toast-bar"><span style="animation-duration:${duration}ms"></span></div>
  `;
  root.appendChild(toast);
  const close = () => {
    toast.classList.add("closing");
    setTimeout(() => toast.remove(), 220);
  };
  setTimeout(close, duration);
  toast.addEventListener("click", close);
}

/* =========================
   EMPLOYEES
========================= */
window.employeeMap = {};
async function loadEmployees() {
  const select = document.getElementById('task-assignee');
  if(!select) return;

  try {
    let employees = [];
    if(typeof App !== 'undefined' && App.api && App.api.tasks) {
       try {
         const res = await fetch("/api/users-list", { headers: {'Accept': 'application/json'} });
         if(res.ok) employees = await res.json();
       } catch(e) {}
    }

    if(!employees.length) {
      const res = await fetch("/api/employees");
      if(!res.ok) throw new Error("API not found");
      employees = await res.json();
    }

    select.innerHTML = `<option value="">اختر موظف...</option>`;
    employees.forEach(e => {
      window.employeeMap[e.id] = e.name;
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.name}${e.sap_id ? " - " + e.sap_id : ""}`;
      select.appendChild(opt);
    });
  } catch {
    const mocks = [
      {id:1, name:"بندر احمد", sap_id:"101"},
      {id:2, name:"أحمد العلي", sap_id:"102"},
      {id:3, name:"سارة محمد", sap_id:null},
      {id:4, name:"نورة السعيد", sap_id:"104"}
    ];
    select.innerHTML = `<option value="">اختر موظف...</option>`;
    mocks.forEach(e => {
      window.employeeMap[e.id] = e.name;
      const opt = document.createElement("option");
      opt.value = e.id;
      opt.textContent = `${e.name}${e.sap_id ? " - " + e.sap_id : ""}`;
      select.appendChild(opt);
    });
  }

  renderKanbanTasks();
}

/* =========================
   NOTIFICATIONS DROPDOWN
========================= */
document.getElementById('notifBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const d = document.getElementById('notifDropdown');
  const isHidden = d.style.display === 'none' || d.classList.contains('hidden') || getComputedStyle(d).display === 'none';
  document.querySelectorAll('.dropdown-menu').forEach(el => {
    el.style.display = 'none';
    el.classList.add('hidden');
  });
  if(isHidden){
    d.style.display = 'block';
    d.classList.remove('hidden');
    loadNotifications();
  }
});

document.addEventListener('click', () => {
  const d = document.getElementById('notifDropdown');
  if(d) { d.style.display = 'none'; d.classList.add('hidden'); }
});

function loadNotifications(){
  const list = document.getElementById('notifList');
  if(!list) return;

  // استرجاع المهام من localStorage مباشرة
  let tasks = [];
  try {
    const raw = localStorage.getItem('db:tasks');
    tasks = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch (e) {
    tasks = [];
  }
  const dueTasks = tasks.filter(tk => {
    if(tk.status === 'done') return false;
    if(!tk.due) return false;
    const today = new Date().toISOString().split('T')[0];
    return tk.due <= today;
  });

  let html = '';
  dueTasks.forEach(tk => {
    html += `
      <div style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; gap:10px; cursor:pointer; background:rgba(239, 68, 68, 0.1);"
           onclick="openTaskFromNotification('${asId(tk.id)}')">
        <div style="font-size:1.2rem;">⏰</div>
        <div>
          <div style="color:#f87171; font-weight:600; font-size:0.9rem;">موعد استحقاق</div>
          <div style="color:#cbd5e1; font-size:0.85rem;">المهمة "${tk.title}" تستحق اليوم!</div>
          <div style="color:#94a3b8; font-size:0.7rem; margin-top:4px;">الآن</div>
        </div>
      </div>`;
  });

  list.innerHTML = html || `<div style="padding:20px; text-align:center; color:#94a3b8;">لا توجد إشعارات جديدة</div>`;
}

function openTaskFromNotification(taskId) {
  const d = document.getElementById('notifDropdown');
  if(d) { d.style.display='none'; d.classList.add('hidden'); }

  const card = document.querySelector(`.task-card[data-id="${asId(taskId)}"]`);
  if(card) {
    card.scrollIntoView({behavior:"smooth", block:"center"});
    openDrawer(card);
  }
}

/* =========================
   COMMENTS DRAWER + ATTACHMENTS (FIX FREEZE)
========================= */
const drawerOverlay = document.getElementById("commentsDrawer");
const drawerClose = document.getElementById("drawerClose");
const drawerTitle = document.getElementById("drawerTitle");
const drawerSub = document.getElementById("drawerSub");
const drawerBody = document.getElementById("drawerBody");
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");

const attachmentInput = document.getElementById("attachmentInput");
const attachmentPreview = document.getElementById("attachmentPreview");
let attachedFiles = [];

attachmentInput?.addEventListener("change", () => {
  attachedFiles = Array.from(attachmentInput.files || []);
  if(attachmentPreview) attachmentPreview.innerHTML = "";
  attachedFiles.forEach(file => {
    const div = document.createElement("div");
    div.className = "attach-item";
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      div.appendChild(img);
    } else {
      div.textContent = "📄 " + file.name;
    }
    attachmentPreview?.appendChild(div);
  });
});

let activeCard = null;
const commentsStore = new Map();

function ensureCardId(card){
  // IMPORTANT: use dataset.id (task id) as key
  return asId(card.dataset.id);
}

function openDrawer(card){
  activeCard = card;
  const title = card.querySelector("h4")?.textContent?.trim() || "المهمة";
  drawerTitle.textContent = t("replies");
  drawerSub.textContent = title;

  const id = ensureCardId(card);
  const comments = commentsStore.get(id) || [];
  renderComments(comments);

  drawerOverlay.style.display = "block";
  setTimeout(() => commentInput?.focus(), 150);
}

function closeDrawer(){
  drawerOverlay.style.display = "none";
  activeCard = null;
  if(commentInput) commentInput.value = "";
  attachedFiles = [];
  if(attachmentInput) attachmentInput.value = "";
  if(attachmentPreview) attachmentPreview.innerHTML = "";
}

drawerClose?.addEventListener("click", closeDrawer);
drawerOverlay?.addEventListener("click", (e) => { if(e.target === drawerOverlay) closeDrawer(); });

function renderComments(comments){
  drawerBody.innerHTML = "";
  if(!comments.length){
    drawerBody.innerHTML = `<div class="comment"><div class="txt">${t("noReplies")}</div></div>`;
    return;
  }

  comments.forEach(c => {
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `
      <div class="meta">
        <span>${c.by}</span>
        <span>${c.at}</span>
      </div>
      <div class="txt">${c.text || ""}</div>
    `;

    if (c.attachments?.length) {
      const attachContainer = document.createElement("div");
      attachContainer.className = "attachment-preview";
      attachContainer.style.padding = "4px 0";
      attachContainer.style.background = "transparent";
      attachContainer.style.border = "none";

      c.attachments.forEach(file => {
        const a = document.createElement("div");
        
        if (file.type?.startsWith("image/")) {
          a.innerHTML = `<img src="${file.url}" class="max-w-full h-auto rounded-lg border border-white/10 mt-2">`;
        } else {
          a.innerHTML = `<a href="${file.url}" target="_blank" download="${file.name}" class="text-sky-400 underline text-sm block mt-1">📎 ${file.name}</a>`;
        }

        attachContainer.appendChild(a);
      });

      el.appendChild(attachContainer);
    }

    drawerBody.appendChild(el);
  });

  drawerBody.scrollTop = drawerBody.scrollHeight;
}

addCommentBtn?.addEventListener("click", async () => {
  if(!activeCard) return;
  const txt = (commentInput.value || "").trim();
  if(!txt && !attachedFiles.length){
    showToast({ type:"warning", title:"تنبيه", message:"اكتب الرد أو ارفق ملف", duration: 1800 });
    return;
  }

  const id = ensureCardId(activeCard);
  
  try {
    if(App.api && App.api.tasks) {
      await App.api.tasks.comment(id, txt, attachedFiles);
      // Refresh comments
      openDrawer(activeCard);
    } else {
       // Fallback
       const list = commentsStore.get(id) || [];
       const at = new Date().toLocaleString('ar-SA');
       const atts = attachedFiles.map(f => ({
         name: f.name,
         type: f.type,
         url: URL.createObjectURL(f)
       }));
       list.push({ by: "أنت", at, text: txt, attachments: atts });
       commentsStore.set(id, list);
       App.store.update('tasks', id, { comments: list });
       renderComments(list);
    }
    
    // reset UI
    if(commentInput) commentInput.value = "";
    attachedFiles = [];
    if(attachmentInput) attachmentInput.value = "";
    if(attachmentPreview) attachmentPreview.innerHTML = "";
    showToast({ type:"success", title:"تم الإرسال", message:"تمت إضافة الرد بنجاح", duration: 1800 });
    
  } catch(e) {
    console.error(e);
    showToast({ type:"error", title:"خطأ", message:"فشل إرسال الرد", duration: 2000 });
  }
});

commentInput?.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    e.preventDefault();
    addCommentBtn.click();
  }
});

/* =========================
   TASK CARD FACTORY (AR PRIORITY + FIXED IDS)
========================= */
function createTaskCard(task) {
  const div = document.createElement('div');
  div.className = 'task-card';
  div.draggable = true;

  const id = asId(task.id);
  div.dataset.id = id;

  const assigneeName = (window.employeeMap && window.employeeMap[task.assignee])
    ? window.employeeMap[task.assignee]
    : (task.assignee || "");

  const assigneeText = assigneeName || t('unassigned');
  const dateText = task.due || "—";

  div.ondragstart = (e) => drag(e, id);
  div.onclick = (e) => { if(!e.target.closest('.task-action-btn')) openDrawer(div); };

  div.innerHTML = `
    <div class="task-head">
      <h4 class="task-title">${task.title}</h4>
      <span class="priority-badge priority-${task.priority}">${translatePriority(task.priority)}</span>
    </div>

    <p class="task-desc">${task.description || ''}</p>

    <div class="task-footer">
      <div class="task-assignee">
        <span class="dot"></span>
        <span class="assignee-name">${assigneeText}</span>
      </div>

      <div class="task-date">
        <span class="cal">📅</span>
        <span class="date-text">${dateText}</span>
      </div>
    </div>
  `;

  return div;
}

document.addEventListener("click", (e) => {
  // Event listener for other interactions if needed
});

/* =========================
   KANBAN RENDER
========================= */
function renderKanbanTasks() {
  // استرجاع المهام من localStorage مباشرة
  let tasks = [];
  try {
    const raw = localStorage.getItem('db:tasks');
    tasks = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch (e) {
    tasks = [];
  }

  // sort newest first by due (handle null/undefined dates)
  tasks.sort((a,b) => {
    const dA = a.due ? new Date(a.due).getTime() : Number.MAX_SAFE_INTEGER;
    const dB = b.due ? new Date(b.due).getTime() : Number.MAX_SAFE_INTEGER;
    return dA - dB; // sort ascending (oldest first)
  });

  const cols = {
    pending: document.getElementById('col-pending'),
    inprogress: document.getElementById('col-inprogress'),
    completed: document.getElementById('col-completed')
  };

  Object.values(cols).forEach(el => { if(el) el.innerHTML = ''; });

  const counts = { pending: 0, inprogress: 0, completed: 0 };

  tasks.forEach(task => {
    // normalize status
    let s = task.status;
    if(s === 'in_progress') s = 'inprogress';
    if(s === 'done') s = 'completed';
    if(!cols[s]) s = 'pending';

    counts[s]++;

    // load comments from task (if any)
    const id = asId(task.id);
    if(task.comments && Array.isArray(task.comments) && !commentsStore.has(id)) {
      commentsStore.set(id, task.comments);
    }

    cols[s].appendChild(createTaskCard(task));
  });

  // update metrics
  document.getElementById('metric-pending').textContent = counts.pending;
  document.getElementById('metric-inprogress').textContent = counts.inprogress;
  document.getElementById('metric-completed').textContent = counts.completed;

  // update column counters
  document.getElementById('col-count-pending').textContent = counts.pending;
  document.getElementById('col-count-inprogress').textContent = counts.inprogress;
  document.getElementById('col-count-completed').textContent = counts.completed;

  // ensure translations always applied
  applyTranslations();
}

function allowDrop(ev){ ev.preventDefault(); }
function drag(ev, id){
  ev.dataTransfer.setData("text", asId(id));
  ev.dataTransfer.effectAllowed = "move";
}
function drop(ev, status){
  ev.preventDefault();
  const id = asId(ev.dataTransfer.getData("text"));
  if(!id) return;

  let newStatus = status;
  if(status === 'inprogress') newStatus = 'in_progress';
  if(status === 'completed') newStatus = 'done';

  App.store.update('tasks', id, { status: newStatus });
  renderKanbanTasks();
  showToast({ type:"info", title:"تم النقل", message:"تم نقل المهمة بنجاح", duration: 1600 });
}

/* =========================
   TASK MODAL (kept)
========================= */
function openTaskModal(){ document.getElementById('task-modal').style.display='flex'; }
function closeTaskModal(){ document.getElementById('task-modal').style.display='none'; }

async function saveTask(){
  const title = (document.getElementById('task-title').value || "").trim();
  if(!title){
    showToast({ type:"warning", title:"تنبيه", message:"العنوان مطلوب", duration: 1800 });
    return;
  }
  
  const rawData = {
    title,
    description: document.getElementById('task-desc').value || "",
    assignee: document.getElementById('task-assignee').value || "",
    priority: document.getElementById('task-priority').value || "medium",
    due: document.getElementById('task-due').value || "",
    status: document.getElementById('task-status').value || "pending"
  };

  try {
    if(App.api && App.api.tasks) {
      // Map to API format
      const payload = {
        title: rawData.title,
        description: rawData.description,
        status: rawData.status,
        priority: rawData.priority,
        due_date: rawData.due || null,
        assigned_to: rawData.assignee || null
      };
      await App.api.tasks.create(payload);
      showToast({ type:"success", title:"تمت الإضافة", message:`تم إضافة: ${rawData.title}`, duration: 1800 });
    } else {
      const newRec = App.store.create('tasks', rawData);
      showToast({ type:"success", title:"تمت الإضافة", message:`تم إضافة: ${newRec.title}`, duration: 1800 });
      
      // حفظ إضافي في localStorage للتأكد من المزامنة
      try {
        const raw = localStorage.getItem('db:tasks');
        const list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
        list.push(newRec);
        localStorage.setItem('db:tasks', JSON.stringify(list));
      } catch(_) {}
      
      // إضافة نظام المزامنة - إرسال حدث عند إنشاء مهمة جديدة
      window.dispatchEvent(new CustomEvent('tasksUpdated', { 
        detail: { 
          action: 'create', 
          data: newRec 
        } 
      }));
      window.dispatchEvent(new CustomEvent('dataChanged', { 
        detail: { 
          type: 'tasks', 
          action: 'create', 
          data: newRec 
        } 
      }));
    }
    renderKanbanTasks();
    closeTaskModal();
  } catch(e) {
    console.error(e);
    showToast({ type:"error", title:"خطأ", message:"فشل حفظ المهمة", duration: 2000 });
  }
}

/* INIT */
if(window.App && window.App.init) window.App.init('tasks');
applyTranslations();
loadEmployees();
renderKanbanTasks();

// Re-render on storage changes
window.addEventListener('storage', (e) => {
  if(e?.key && e.key.includes('db:tasks')) renderKanbanTasks();
});
