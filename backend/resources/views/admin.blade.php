<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-en="Admin Panel" data-ar="لوحة الإدارة">لوحة الإدارة</title>
  
  <!-- External Libraries -->
  <link rel="icon" type="image/svg+xml" href="olayan-mark.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  
  <!-- Core Stylesheets -->
  <link rel="stylesheet" href="style-admin.css?v=20260207_palette2">
  <link rel="stylesheet" href="{{ asset('assets/css/admin-components.css') }}">
  
  <!-- Core Scripts -->
  <script src="js/api-client.js?v=20260207_fix_db"></script>
  <script src="js/helpers.js?v=20260207_fix_db"></script>
  <script src="app.js?v=20260207_fix_db"></script>
  <script src="admin.js?v=20260207_fix_db"></script>
  <script src="js/render-api.js?v=20260207_fix_db"></script>
  <script src="js/unified-saves.js?v=1"></script>
  
  <!-- Additional Styles for Charts and Custom Elements -->
  <style>
    .d-none { display: none !important; }
    .apexcharts-flip-y {
      transform: scaleY(-1) translateY(-100%);
      transform-origin: top;
      transform-box: fill-box;
    }
    .apexcharts-flip-x {
      transform: scaleX(-1);
      transform-origin: center;
      transform-box: fill-box;
    }
    .apexcharts-legend {
      display: flex;
      overflow: auto;
      padding: 0 10px;
    }
    .apexcharts-legend.apexcharts-legend-group-horizontal {
      flex-direction: column;
    }
    .apexcharts-legend-group {
      display: flex;
    }
    .apexcharts-legend-group-vertical {
      flex-direction: column-reverse;
    }
    .apexcharts-legend.apx-legend-position-bottom, .apexcharts-legend.apx-legend-position-top {
      flex-wrap: wrap;
    }
    .apexcharts-legend.apx-legend-position-right, .apexcharts-legend.apx-legend-position-left {
      flex-direction: column;
      bottom: 0;
    }
    .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-left, .apexcharts-legend.apx-legend-position-top.apexcharts-align-left, .apexcharts-legend.apx-legend-position-right, .apexcharts-legend.apx-legend-position-left {
      justify-content: flex-start;
      align-items: flex-start;
    }
    .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-center, .apexcharts-legend.apx-legend-position-top.apexcharts-align-center {
      justify-content: center;
      align-items: center;
    }
    .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-right, .apexcharts-legend.apx-legend-position-top.apexcharts-align-right {
      justify-content: flex-end;
      align-items: flex-end;
    }
    .apexcharts-legend-series {
      cursor: pointer;
      line-height: normal;
      display: flex;
      align-items: center;
    }
    .apexcharts-legend-text {
      position: relative;
      font-size: 14px;
    }
    .apexcharts-legend-text *, .apexcharts-legend-marker * {
      pointer-events: none;
    }
    .apexcharts-legend-marker {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 1px;
    }
    .apexcharts-legend-series.apexcharts-no-click {
      cursor: auto;
    }
    .apexcharts-legend .apexcharts-hidden-zero-series, .apexcharts-legend .apexcharts-hidden-null-series {
      display: none !important;
    }
    .apexcharts-inactive-legend {
      opacity: 0.45;
    }
    #vio-page-size {
      background: rgba(15, 23, 42, 0.9);
      color: #cbd5e1;
      border: 1px solid rgba(148, 163, 184, 0.35);
      border-radius: 10px;
      padding: 6px 10px;
    }
    #vio-page-size option {
      background: #0b1020;
      color: #cbd5e1;
    }
    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
    }
    .chart-container {
      min-height: 220px;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .chart-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(15,23,42,.6);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .admin-layout {
        flex-direction: column;
      }
      .admin-sidebar {
        width: 100%;
        height: auto;
        position: relative;
      }
      .admin-main {
        margin-right: 0;
      }
    }
  </style>
</head>
<body class="ar">
  <!-- Background Canvas -->
  <canvas id="bg-canvas"></canvas>
  
  <!-- Toast Container -->
  <div id="toast-container"></div>
  
  <!-- Modal Components -->
  <div id="admin-modals-container"></div>
  
  <!-- Main Admin Content -->
  <div id="admin-content" class="admin-layout" style="display:none;">
    <!-- Sidebar Component -->
    <div id="admin-sidebar-container"></div>
    
    <!-- Main Content Area -->
    <main class="admin-main">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-title" id="page-title" data-en="Admin Dashboard" data-ar="لوحة التحكم">
          <button id="sidebar-toggle" class="sidebar-toggle">☰</button>
          <span data-en="Admin Dashboard" data-ar="لوحة التحكم">لوحة التحكم</span>
        </div>
        <div class="header-actions">
          <div class="lang-switch inline-flex items-center gap-2">
            <button class="btn btn-secondary" onclick="setLang('en')">EN</button>
            <span class="text-slate-500">/</span>
            <button class="btn btn-secondary" onclick="setLang('ar')">AR</button>
          </div>
          <div class="status-pill" id="phrase-generator"><span>💡</span><span data-en="Inspiration" data-ar="إلهام">إلهام</span></div>
          <div class="status-pill" id="update-source-indicator"><span>📊</span><span data-en="Last Update: Excel" data-ar="آخر تحديث: Excel" data-bi="1">Last Update: Excel</span></div>
          <div class="ai-command-bar">
            <input id="ai-command-input" class="ai-command-input" type="text" data-i18n-ph="ai.placeholder" placeholder="اكتب: أظهر المخالفات، تحليل، فروع الرياض" />
            <button class="ai-command-btn" type="button" onclick="smartReplyFromInput('ai-command-input')">
              <span>🤖</span><span data-en="AI" data-ar="ذكاء">AI</span>
            </button>
          </div>
          <button class="btn btn-secondary" onclick="App.logout()" data-en="Logout" data-ar="تسجيل الخروج">Logout</button>
        </div>
      </header>
      
      <!-- Content Sections -->
      <div class="admin-content-wrapper">
        <!-- Dashboard Section -->
        <section id="section-dashboard">
          <div class="kpis-grid">
            <div class="kpi-card">
              <div class="kpi-label" data-en="HEALTH CARDS COMPLIANCE" data-ar="نسبة التزام الكروت الصحية">HEALTH CARDS COMPLIANCE</div>
              <div class="kpi-value" id="kpi-health" style="color:#4facfe;">74%</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label" data-en="TOTAL FINES (SAR)" data-ar="إجمالي الغرامات (ريال)">TOTAL FINES (SAR)</div>
              <div class="kpi-value" id="kpi-fines" style="color:#f87171;">335,150</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label" data-en="CLOSED VIOLATIONS" data-ar="مخالفات مغلقة">CLOSED VIOLATIONS</div>
              <div class="kpi-value" id="kpi-closed" style="color:#34d399;">128</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label" data-en="OPEN VIOLATIONS" data-ar="مخالفات مفتوحة">OPEN VIOLATIONS</div>
              <div class="kpi-value" id="kpi-open" style="color:#fbbf24;">15</div>
            </div>
          </div>
          
          <div class="data-card">
            <div class="card-header" data-en="Executive Board Report" data-ar="تقرير الإدارة التنفيذي" data-bi="1">Executive Board Report</div>
            <div id="board-summary"></div>
          </div>
          
          <div id="section-analytics-inner" style="margin-bottom: 30px;">
            <div class="section-header">
              <span class="section-title" data-en="Strategic Analytics (AI)" data-ar="التحليل الاستراتيجي (AI)" data-bi="1">Strategic Analytics (AI)</span>
              <div style="display:flex; gap:10px; align-items:center;">
                <select id="ai-year-filter" class="form-control" style="width:180px;">
                  <option value="all" data-en="All Years" data-ar="كل السنوات">كل السنوات</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
                <input type="date" id="ai-date-from" class="form-control" style="width:150px" data-en="From" data-ar="من">
                <input type="date" id="ai-date-to" class="form-control" style="width:150px" data-en="To" data-ar="إلى">
                <button class="btn btn-secondary" onclick="generateStrategicReport()" data-en="Apply Filters" data-ar="تطبيق الفلاتر">تطبيق الفلاتر</button>
                <button class="btn btn-primary" id="ai-refresh" onclick="generateStrategicReport()" data-en="Refresh Analysis" data-ar="تحديث التحليل">🔄 تحديث التحليل</button>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin: 16px;">
              <div class="stat-card" style="border-right: 4px solid #10b981;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <h3 data-en="Operational Efficiency" data-ar="الكفاءة التشغيلية" data-bi="1">Operational Efficiency</h3>
                  <span style="font-size:1.4rem;">⚙️</span>
                </div>
                <p id="ai-insight-ops" style="color:#cbd5e1; line-height:1.6; font-size:0.9rem;">…</p>
              </div>
              <div class="stat-card" style="border-right: 4px solid #ef4444;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <h3 data-en="Financial Risks" data-ar="المخاطر المالية" data-bi="1">Financial Risks</h3>
                  <span style="font-size:1.4rem;">📉</span>
                </div>
                <p id="ai-insight-risk" style="color:#cbd5e1; line-height:1.6; font-size:0.9rem;">…</p>
              </div>
              <div class="stat-card" style="border-right: 4px solid #3b82f6;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <h3 data-en="Workforce Stability" data-ar="استقرار القوى العاملة" data-bi="1">Workforce Stability</h3>
                  <span style="font-size:1.4rem;">👥</span>
                </div>
                <p id="ai-insight-hr" style="color:#cbd5e1; line-height:1.6; font-size:0.95rem;">…</p>
              </div>
              <div class="stat-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%); border:1px solid rgba(245, 158, 11, 0.3);">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <h3 data-en="AI Recommendation" data-ar="توصية الذكاء الاصطناعي" data-bi="1">AI Recommendation</h3>
                </div>
                <p id="ai-recommendation" style="color:#fff; font-weight:bold; line-height:1.6; font-size:0.95rem;">…</p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Other Sections Placeholder -->
        <section id="section-tasks" style="display:none;">
          <div class="data-card">
            <div class="card-header" data-en="Tasks Management" data-ar="إدارة المهام">Tasks Management</div>
            <div id="tasks-content">محتوى المهام قيد التطوير...</div>
          </div>
        </section>
        
        <section id="section-employees" style="display:none;">
          <div class="data-card">
            <div class="card-header" data-en="Employees Management" data-ar="إدارة الموظفين">Employees Management</div>
            <div id="employees-content">محتوى الموظفين قيد التطوير...</div>
          </div>
        </section>
        
        <section id="section-violations" style="display:none;">
          <div class="data-card">
            <div class="card-header" data-en="Violations Management" data-ar="إدارة المخالفات">Violations Management</div>
            <div id="violations-content">محتوى المخالفات قيد التطوير...</div>
          </div>
        </section>
        
        <!-- Add more sections as needed -->
      </div>
    </main>
  </div>
  
  <!-- Component Loader Script -->
  <script>
    // Load modular components
    document.addEventListener('DOMContentLoaded', function() {
      // Load modals
      fetch("{{ asset('components/admin-modals.html') }}")
        .then(response => response.text())
        .then(html => {
          document.getElementById('admin-modals-container').innerHTML = html;
        })
        .catch(error => console.error('Error loading modals:', error));
      
      // Load sidebar
      fetch("{{ asset('components/admin-sidebar.html') }}")
        .then(response => response.text())
        .then(html => {
          document.getElementById('admin-sidebar-container').innerHTML = html;
          
          // Initialize sidebar functionality after loading
          initializeSidebar();
        })
        .catch(error => console.error('Error loading sidebar:', error));
    });
    
    // Initialize sidebar functionality
    function initializeSidebar() {
      // Add sidebar toggle functionality
      const sidebarToggle = document.getElementById('sidebar-toggle');
      const sidebar = document.querySelector('.admin-sidebar');
      
      if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
          sidebar.classList.toggle('collapsed');
        });
      }
      
      // Initialize navigation group toggles
      const navGroupHeaders = document.querySelectorAll('.nav-group-header');
      navGroupHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const group = this.parentElement;
          const content = group.querySelector('.nav-group-content');
          const arrow = this.querySelector('.arrow-icon');
          
          if (content.style.display === 'block' || content.style.display === '') {
            content.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
          } else {
            content.style.display = 'block';
            arrow.style.transform = 'rotate(90deg)';
          }
        });
      });
    }
    
    // Section navigation
    function showSection(sectionId) {
      // Hide all sections
      const sections = document.querySelectorAll('section[id^="section-"]');
      sections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Show selected section
      const targetSection = document.getElementById('section-' + sectionId);
      if (targetSection) {
        targetSection.style.display = 'block';
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
          const sectionTitles = {
            'dashboard': 'لوحة التحكم',
            'tasks': 'المهام',
            'employees': 'الموظفين',
            'violations': 'المخالفات',
            'branches': 'الفروع',
            'licenses': 'التراخيص',
            'members': 'الأعضاء',
            'roles': 'الأدوار',
            'messages': 'الرسائل',
            'activity': 'سجل النشاطات',
            'complaints': 'الشكاوى',
            'settings': 'الإعدادات'
          };
          
          pageTitle.innerHTML = '<button id="sidebar-toggle" class="sidebar-toggle">☰</button> ' + 
                               (sectionTitles[sectionId] || 'لوحة التحكم');
        }
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        const activeNavItem = document.getElementById('nav-' + sectionId);
        if (activeNavItem) {
          activeNavItem.classList.add('active');
        }
      }
    }
    
    // Toggle sidebar group
    function toggleSidebarGroup(groupId) {
      const group = document.getElementById(groupId);
      if (group) {
        group.classList.toggle('active');
      }
    }
    
    // Language switching
    function setLang(lang) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      // Update all data attributes
      const elements = document.querySelectorAll('[data-en][data-ar]');
      elements.forEach(element => {
        if (lang === 'en') {
          element.textContent = element.getAttribute('data-en');
        } else {
          element.textContent = element.getAttribute('data-ar');
        }
      });
    }
    
    // Toast notification function
    function toast(type, title, message) {
      const toastContainer = document.getElementById('toast-container');
      if (toastContainer) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
          <div class="toast-header">
            <strong>${title}</strong>
            <button type="button" class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
          </div>
          <div class="toast-body">${message}</div>
        `;
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 5000);
      }
    }
    
    // Smart reply from AI input
    function smartReplyFromInput(inputId) {
      const input = document.getElementById(inputId);
      if (input && input.value.trim()) {
        toast('info', 'AI', 'جاري معالجة الطلب: ' + input.value);
        input.value = '';
      }
    }
    
    // Generate strategic report
    function generateStrategicReport() {
      toast('info', 'AI Analysis', 'جاري تحديث التحليل الاستراتيجي...');
      
      // Simulate AI analysis
      setTimeout(() => {
        document.getElementById('ai-insight-ops').textContent = 'الكفاءة التشغيلية في مستوى جيد مع تحسن ملحوظ في الأداء.';
        document.getElementById('ai-insight-risk').textContent = 'مخاطر مالية محدودة مع ضرورة مراقبة التكاليف التشغيلية.';
        document.getElementById('ai-insight-hr').textContent = 'استقرار جيد في القوى العاملة مع معدل دوران منخفض.';
        document.getElementById('ai-recommendation').textContent = 'يوصى بتعزيز برامج التدريب لتحسين الكفاءة التشغيلية.';
      }, 2000);
    }
    
    // Initialize dashboard on page load
    window.addEventListener('load', function() {
      // Show dashboard by default
      showSection('dashboard');
      
      // Initialize AI analysis
      generateStrategicReport();
    });
  </script>
</body>
</html>