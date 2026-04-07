<!DOCTYPE html>
<html lang="{{ str_replace('_','-', app()->getLocale()) }}" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', 'OFS Dashboard')</title>
  <meta name="theme-color" content="#0b0e2b">

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Styles -->
  <link rel="stylesheet" href="{{ asset('style-base.css') }}">
  <link rel="stylesheet" href="{{ asset('style-home.css') }}">
  <link rel="stylesheet" href="{{ asset('style-tasks.css') }}">
  <link rel="icon" type="image/svg+xml" href="{{ asset('olayan-mark.svg') }}">

  @stack('head')
</head>
<body class="en">
  <canvas id="bg-canvas"></canvas>
  
  <header class="top-nav">
    <div class="top-left">
      <img src="{{ asset('olayan-mark.svg') }}" alt="Olayan">
      <div class="division">
        <div class="division-name" data-en="Olayan Food Division" data-ar="قطاع الأغذية - العليان">Olayan Food Division</div>
        <div class="division-note" data-en="Your only limit is your mind." data-ar="حدودك الوحيدة هي عقلك">Your only limit is your mind.</div>
        <span style="margin-inline-start:10px; padding:4px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:999px; font-size:.8rem; color:#a0c4ff; background: rgba(255,255,255,0.06);" data-en="Admin Panel" data-ar="لوحة التحكم">لوحة التحكم</span>
      </div>
    </div>
    <nav class="top-links">
      <a href="{{ url('/dashboard') }}" class="nav-link {{ request()->is('dashboard') ? 'active' : '' }}" data-en="Home" data-ar="الرئيسية">Home</a>
      <a href="{{ url('/employees') }}" class="nav-link {{ request()->is('employees*') ? 'active' : '' }}" data-en="Employees" data-ar="الموظفون">Employees</a>
      <a href="{{ url('/branches') }}" class="nav-link {{ request()->is('branches*') ? 'active' : '' }}" data-en="Branches" data-ar="الفروع">Branches</a>
      <a href="{{ url('/licenses') }}" class="nav-link {{ request()->is('licenses*') ? 'active' : '' }}" data-en="Licenses & Contracts" data-ar="الرخص والعقود">Licenses & Contracts</a>
      <a href="{{ url('/violations') }}" class="nav-link {{ request()->is('violations*') ? 'active' : '' }}" data-en="Violations" data-ar="المخالفات">Violations</a>
      <a href="{{ url('/housings') }}" class="nav-link {{ request()->is('housings*') ? 'active' : '' }}" data-en="Housings" data-ar="السكنات">Housings</a>
      <a href="{{ url('/transports') }}" class="nav-link {{ request()->is('transports*') ? 'active' : '' }}" data-en="Transports" data-ar="المواصلات">Transports</a>
      <a href="{{ url('/reports') }}" class="nav-link {{ request()->is('reports*') ? 'active' : '' }}" data-en="Reports" data-ar="التقارير">Reports</a>
      
      <!-- Actions -->
      @yield('header_actions')

      <button id="help-toggle" class="px-3 py-1 rounded bg-gray-100 text-gray-800"></button>
      <button class="lang-btn-mini" onclick="setLang('ar')">AR</button>
      <button class="lang-btn-mini" onclick="setLang('en')">EN</button>
      <button class="hamburger-btn" onclick="toggleMenu()" aria-label="menu" style="margin-inline-start:8px; display:inline-flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: #fff; padding: 6px 10px; border-radius: 10px; cursor: pointer;">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      <div class="user-slot">
        <div id="user-badge" class="user-badge">
          <div class="user-avatar"></div>
          <span id="user-badge-name"></span>
        </div>
        <div id="user-menu" class="user-menu">
          <a href="#" data-en="My Profile" data-ar="ملفّي">My Profile</a>
          <button onclick="App.logout()" data-en="Logout" data-ar="تسجيل الخروج">Logout</button>
        </div>
        <button class="logout-btn" onclick="App.logout()" data-en="Logout" data-ar="تسجيل الخروج">Logout</button>
      </div>
    </nav>
  </header>

  <div class="side-menu-overlay" id="sideMenuOverlay" onclick="toggleMenu()"></div>
  <aside class="side-menu" id="sideMenu">
    <div class="side-menu-header">
      <img src="{{ asset('olayan-mark.svg') }}" class="side-menu-logo" alt="Logo">
      <button class="close-menu-btn" onclick="toggleMenu()">&times;</button>
    </div>
    <nav class="side-menu-nav">
      <a href="{{ url('/dashboard') }}" class="side-link {{ request()->is('dashboard') ? 'active' : '' }}">
        <i>🏠</i> <span data-en="Home" data-ar="الرئيسية">Home</span>
      </a>
      <a href="{{ url('/tasks') }}" class="side-link {{ request()->is('tasks*') ? 'active' : '' }}">
        <i>✅</i> <span data-en="Tasks" data-ar="المهام">Tasks</span>
      </a>
      <a href="{{ url('/employees') }}" class="side-link {{ request()->is('employees*') ? 'active' : '' }}">
        <i>👥</i> <span data-en="Employees" data-ar="الموظفين">Employees</span>
      </a>
      <a href="{{ url('/violations') }}" class="side-link {{ request()->is('violations*') ? 'active' : '' }}">
        <i>⚠️</i> <span data-en="Violations" data-ar="المخالفات">Violations</span>
      </a>
      <a href="{{ url('/training') }}" class="side-link {{ request()->is('training*') ? 'active' : '' }}">
        <i>🎓</i> <span data-en="Training" data-ar="التدريب">Training</span>
      </a>
      <a href="{{ url('/branches') }}" class="side-link {{ request()->is('branches*') ? 'active' : '' }}">
        <i>🏬</i> <span data-en="Branches" data-ar="الفروع">Branches</span>
      </a>
      <a href="{{ url('/board') }}" class="side-link {{ request()->is('board*') ? 'active' : '' }}">
        <i>📊</i> <span data-en="Management Report" data-ar="تقرير الإدارة">Management Report</span>
      </a>
      <a href="{{ url('/login') }}" class="side-link">
        <i>👤</i> <span data-en="Employee Login" data-ar="دخول الموظفين">Employee Login</span>
      </a>
      <a href="{{ url('/admin') }}" class="side-link">
        <i>🔐</i> <span data-en="Admin Login" data-ar="دخول الإدارة">Admin Login</span>
      </a>
    </nav>
    <div style="margin-top: auto; padding-top: 20px;">
      <div class="lang-switch" style="display: flex; gap: 10px; justify-content: center;">
        <button class="lang-btn" onclick="setLang('ar')" style="flex:1;">العربية</button>
        <button class="lang-btn" onclick="setLang('en')" style="flex:1;">English</button>
      </div>
      <div class="sidebar-footer" style="margin-top: 20px; text-align: center; font-size: 0.7rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
        <div class="gradient-text" style="margin-bottom: 5px; font-weight: bold;" data-en="All rights reserved – Olayan Food Services Company © 2026" data-ar="جميع الحقوق محفوظة – شركة العليان للخدمات الغذائية © 2026">جميع الحقوق محفوظة – شركة العليان للخدمات الغذائية © 2026</div>
        <div class="gradient-text" style="direction: ltr; font-weight: 500;" data-en="Developed by Bandar A. Abdulwahab" data-ar="تطوير: بندر عبدالوهاب">Developed by Bandar A. Abdulwahab</div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main>
    @yield('content')
  </main>

  <footer class="site-footer">
    <div data-en="All rights reserved – Olayan Food Services Company © 2026" data-ar="جميع الحقوق محفوظة – شركة العليان للخدمات الغذائية © 2026">All rights reserved – Olayan Food Services Company © 2026</div>
    <div data-en="Developed by Bandar A. Abdulwahab" data-ar="تطوير: بندر عبدالوهاب">Developed by Bandar A. Abdulwahab</div>
  </footer>

  <!-- Scripts -->
  <script src="{{ asset('js/app.js') }}?v=8"></script>
  <script>
    function setLang(l) {
      if (window.App && typeof window.App.setLang === 'function') {
        App.setLang(l);
      }
      document.body.className = l === 'ar' ? 'ar' : 'en';
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    }
    
    // Initialize App if available
    document.addEventListener('DOMContentLoaded', function() {
      if (window.App && typeof window.App.init === 'function') {
        App.init('index');
      }
    });

    function openMenu(){ 
      var ov=document.getElementById('sideMenuOverlay'); 
      var m=document.getElementById('sideMenu'); 
      if(ov) ov.classList.add('open'); 
      if(m) m.classList.add('open'); 
    }
    function closeMenu(){ 
      var ov=document.getElementById('sideMenuOverlay'); 
      var m=document.getElementById('sideMenu'); 
      if(ov) ov.classList.remove('open'); 
      if(m) m.classList.remove('open'); 
    }
    function toggleMenu(){ 
      var m=document.getElementById('sideMenu'); 
      if(m && m.classList.contains('open')) closeMenu(); 
      else openMenu(); 
    }
  </script>
  @stack('scripts')
</body>
</html>