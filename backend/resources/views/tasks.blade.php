

<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Tasks • Olayan Dashboard</title>

  <style>
    /* ====== Base / Theme ====== */
    :root{
      --bg0:#050b18;
      --bg1:#070f22;
      --panel:rgba(15,23,42,.62);
      --panel2:rgba(2,6,23,.55);
      --stroke:rgba(148,163,184,.18);
      --stroke2:rgba(255,255,255,.08);
      --text:#e5e7eb;
      --muted:#94a3b8;
      --muted2:#64748b;

      --blue:#3b82f6;
      --cyan:#38bdf8;
      --purple:#8b5cf6;
      --green:#10b981;
      --amber:#f59e0b;
      --red:#ef4444;

      --radius-xl:24px;
      --radius-lg:20px;
      --radius-md:16px;
      --radius-sm:12px;

      --shadow: 0 20px 40px -12px rgba(0,0,0,.55);
      --shadow2: 0 12px 28px rgba(0,0,0,.35);

      /* layout */
      --page-pad: 18px;
      --top-area-h: 270px; /* updated by JS */
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Kufi Arabic", "Noto Sans Arabic", sans-serif;
      background:
        radial-gradient(1200px 700px at 10% 20%, rgba(59,130,246,.22), transparent 55%),
        radial-gradient(900px 600px at 85% 30%, rgba(16,185,129,.18), transparent 55%),
        radial-gradient(900px 700px at 40% 95%, rgba(56,189,248,.12), transparent 60%),
        linear-gradient(180deg, var(--bg0), var(--bg1));
      color:var(--text);
      overflow-x:hidden;
    }

    a{color:inherit; text-decoration:none}
    button,input,select,textarea{font:inherit}

    /* ====== Beautiful Scrollbars ====== */
    .kanban-body, .reply-list, .modal, body{
      scrollbar-width: thin;
      scrollbar-color: rgba(56,189,248,.55) rgba(2,6,23,.35);
    }
    .kanban-body::-webkit-scrollbar,
    .reply-list::-webkit-scrollbar,
    .modal::-webkit-scrollbar{
      width: 10px;
      height: 10px;
    }
    .kanban-body::-webkit-scrollbar-track,
    .reply-list::-webkit-scrollbar-track,
    .modal::-webkit-scrollbar-track{
      background: rgba(2,6,23,.35);
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.06);
    }
    .kanban-body::-webkit-scrollbar-thumb,
    .reply-list::-webkit-scrollbar-thumb,
    .modal::-webkit-scrollbar-thumb{
      background: linear-gradient(180deg, rgba(56,189,248,.75), rgba(59,130,246,.55));
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.12);
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
    }
    .kanban-body::-webkit-scrollbar-thumb:hover,
    .reply-list::-webkit-scrollbar-thumb:hover,
    .modal::-webkit-scrollbar-thumb:hover{
      background: linear-gradient(180deg, rgba(56,189,248,.95), rgba(59,130,246,.75));
    }

    /* ====== Top Nav ====== */
    .top-nav{
      position: sticky;
      top:0;
      z-index: 100;
      padding: 12px var(--page-pad);
      backdrop-filter: blur(18px);
      background: rgba(2,6,23,.55);
      border-bottom: 1px solid rgba(255,255,255,.06);
    }
    .top-nav-inner{
      max-width: 1200px;
      margin: 0 auto;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 12px;
    }

    .brand{
      display:flex; align-items:center; gap:10px;
      padding: 8px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(15,23,42,.45);
    }
    .brand-badge{
      font-weight:900;
      letter-spacing:.6px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(59,130,246,.35);
      background: rgba(59,130,246,.10);
    }
    .brand-text{
      display:flex; flex-direction:column; line-height:1.1;
    }
    .brand-text b{font-size:.95rem}
    .brand-text span{font-size:.78rem; color:var(--muted)}

    .nav-links{
      display:flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content:center;
      align-items: center;
      flex:1;
      min-width: 200px;
    }
    .nav-link{
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid transparent;
      color: var(--muted);
      background: transparent;
      transition:.2s ease;
      white-space:nowrap;
      display: inline-flex;
      align-items: center;
      height: 34px;
    }
    .nav-link:hover{color:var(--text); background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.06)}
    .nav-link.active{
      color: var(--text);
      background: rgba(59,130,246,.10);
      border-color: rgba(59,130,246,.25);
    }

    .nav-actions{
      display:flex; align-items:center; gap:10px;
    }
    .pill{
      display:inline-flex; align-items:center; gap:8px;
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(15,23,42,.45);
      cursor:pointer;
      transition:.2s ease;
      user-select:none;
      position: relative;
    }
    .pill:hover{transform: translateY(-1px); background: rgba(15,23,42,.58)}
    .btn-primary{
      position: relative;
      padding: 12px 16px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.10);
      background: linear-gradient(135deg, rgba(14,165,233,.95), rgba(37,99,235,.92));
      color: white;
      cursor:pointer;
      font-weight:800;
      display:inline-flex; align-items:center; gap:8px;
      box-shadow: 0 10px 24px rgba(14,165,233,.28);
      transition:.22s ease;
      white-space:nowrap;
    }
    .btn-primary:hover{transform: translateY(-2px); box-shadow: 0 16px 30px rgba(14,165,233,.38)}
    .btn-primary:active{transform: translateY(0px) scale(.98)}
    .btn-ghost{
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(15,23,42,.40);
      color: var(--text);
      cursor:pointer;
      transition:.2s ease;
    }
    .btn-ghost:hover{background: rgba(15,23,42,.58)}
    .icon{ width:18px; height:18px; display:inline-block; }

    /* ====== Page container ====== */
    .page{
      max-width: 1600px;
      margin: 14px auto 28px;
      padding: 0 var(--page-pad);
    }

    /* ====== Header card ====== */
    .top-header{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 14px;
      padding: 18px 18px;
      background: rgba(15, 23, 42, 0.58);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
    }

    .header-left{
      display:flex; align-items:center; gap: 14px;
      min-width: 260px;
    }
    .header-icon-box{
      width: 62px; height:62px;
      border-radius: 20px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display:flex; align-items:center; justify-content:center;
      box-shadow: 0 12px 26px rgba(59,130,246,.35);
      position:relative; overflow:hidden;
      flex: 0 0 auto;
    }
    .header-icon-box::after{
      content:"";
      position:absolute; inset:-40%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,.25), transparent);
      animation: shine 4s linear infinite;
    }
    @keyframes shine{
      0%{transform: translateX(-40%) rotate(20deg)}
      100%{transform: translateX(40%) rotate(20deg)}
    }
    .header-text h1{
      margin:0;
      font-size: 1.55rem;
      font-weight: 900;
      letter-spacing:-.4px;
    }
    .header-text p{
      margin:6px 0 0;
      color: var(--muted);
      font-weight:600;
      font-size:.92rem;
    }
    .header-sub{
      margin-top:8px;
      color: rgba(56,189,248,.95);
      font-size:.82rem;
      font-weight:700;
    }

    /* ====== Summary strip ====== */
    .summary-strip{
      margin-top: 14px;
      padding: 14px 14px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.08);
      background:
        radial-gradient(500px 160px at 15% 40%, rgba(59,130,246,.24), transparent 70%),
        radial-gradient(500px 160px at 85% 40%, rgba(16,185,129,.18), transparent 70%),
        linear-gradient(135deg, rgba(15,23,42,.68), rgba(2,6,23,.60));
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow2);
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 12px;
      overflow:hidden;
      position: relative;
    }

    /* Bell moved to be clean + clear */
    .notif-wrap{ position: relative; display:flex; align-items:center; gap:10px; }
    .bell-btn{
      width: 44px; height:44px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(2,6,23,.30);
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      box-shadow: 0 10px 24px rgba(0,0,0,.22);
      transition: .18s ease;
      position: relative;
    }
    .bell-btn:hover{ transform: translateY(-1px); background: rgba(2,6,23,.42); }
    .bell-btn:active{ transform: scale(.98); }
    .bell-btn .bell-ico{ font-size: 1.3rem; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35)); transition: .3s; }
    .bell-btn:hover .bell-ico { transform: rotate(15deg); }
    .bell-ico.pulse {
      animation: bellPulse 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
      color: #fbbf24;
      text-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
    }
    @keyframes bellPulse {
      0% { transform: scale(1) rotate(0deg); }
      10% { transform: scale(1.2) rotate(-10deg); }
      20% { transform: scale(1.2) rotate(10deg); }
      30% { transform: scale(1.2) rotate(-10deg); }
      40% { transform: scale(1) rotate(0deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    /* Motivation Ticker - Moved under Brand */
    .motivation-box {
      margin-top: 5px;
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 22px;
      max-width: 180px;
      overflow: hidden;
      margin-inline: auto;
    }
    .motivation-text {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      white-space: nowrap;
      animation: fadeInOut 8s infinite;
      text-align: center;
    }
    @keyframes fadeInOut {
      0%, 10% { opacity: 0; transform: translateY(2px); }
      15%, 85% { opacity: 1; transform: translateY(0); }
      90%, 100% { opacity: 0; transform: translateY(-2px); }
    }

    .bell-badge{
      position:absolute;
      top: -6px;
      inset-inline-end: -6px;
      background: var(--red);
      color:#fff;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 999px;
      font-size: .72rem;
      display:none;
      align-items:center;
      justify-content:center;
      border: 2px solid rgba(7,15,34,1);
      font-weight: 1000;
      box-shadow: 0 12px 18px rgba(239,68,68,.25);
    }

    .summary-pills{
      display:flex;
      gap: 10px;
      flex-wrap:wrap;
      align-items:center;
      justify-content:flex-start;
      flex:1;
    }
    .summary-pill{
      display:flex; align-items:center; gap:10px;
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(15,23,42,.45);
      min-width: 150px;
      justify-content:space-between;
    }
    .summary-pill .label{
      display:flex; align-items:center; gap:8px;
      color: var(--muted);
      font-weight:800;
      text-transform: uppercase;
      font-size: .82rem;
    }
    .summary-pill .count{
      font-weight: 1000;
      font-size: 1.05rem;
      color: #fff;
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.06);
      min-width: 44px;
      text-align:center;
    }
    .tagDot{width:10px;height:10px;border-radius:99px}
    .dot-pending{background: rgba(245,158,11,.9)}
    .dot-progress{background: rgba(59,130,246,.95)}
    .dot-review{background: rgba(139,92,246,.95)}
    .dot-completed{background: rgba(16,185,129,.95)}

    /* ====== Kanban (Enhanced) ====== */
    .kanban-board{
      margin-top: 24px;
      display:grid;
      grid-template-columns: repeat(4, minmax(300px, 1fr));
      gap: 24px;
      align-items: start;
      min-height: 0;
      padding-bottom: 24px;
      overflow-x: auto;
    }

    .kanban-column{
      background: rgba(15, 23, 42, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      backdrop-filter: blur(24px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      display:flex;
      flex-direction:column;
      min-height: 0;
      overflow:hidden;
      height: calc(100vh - 380px); /* Adjusted for safety */
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .kanban-column:hover{
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
    }

    .kanban-header{
      padding: 16px 20px;
      font-weight: 800;
      border-bottom: 1px solid rgba(255,255,255,.06);
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 10px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
    }

    .kanban-header .left{
      display:flex; align-items:center; gap:10px;
      min-width: 0;
    }

    .kanban-header .title{
      font-size: 1.05rem;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    
    .task-count{
      font-weight: 800;
      font-size: .75rem;
      padding: 4px 10px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.9);
      box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
      min-width: 32px;
      text-align:center;
    }

    .status-pending{border-top: 4px solid #f59e0b; color: #fbbf24;}
    .status-progress{border-top: 4px solid #3b82f6; color: #60a5fa;}
    .status-review{border-top: 4px solid #8b5cf6; color: #a78bfa;}
    .status-completed{border-top: 4px solid #10b981; color: #34d399;}

    .kanban-body{
      padding: 16px;
      display:flex;
      flex-direction:column;
      gap: 16px;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    /* Task card (Enhanced) */
    .task-card{
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px;
      position:relative;
      cursor:pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .task-card:hover{
      transform: translateY(-4px) scale(1.01);
      background: rgba(30, 41, 59, 0.9);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
      z-index: 10;
    }
    
    .task-top{
      display:flex; align-items:flex-start; justify-content:space-between; gap: 12px;
      margin-bottom: 2px;
    }
    .task-title{
      margin:0;
      font-size: 0.95rem;
      font-weight: 800;
      color: #f1f5f9;
      line-height: 1.5;
      letter-spacing: -0.01em;
      max-width: 100%;
      word-break: break-word;
      display: flex;
      align-items: center;
    }
    .t-prefix {
      color: #38bdf8;
      font-size: 1.1em;
      margin-inline-end: 8px;
      filter: drop-shadow(0 0 8px rgba(56,189,248,0.3));
    }
    .task-desc{
      margin: 6px 0 0;
      color: #94a3b8;
      font-weight: 500;
      font-size: .88rem;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-height: 3.2em;
    }

    .badge{
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: .68rem;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      flex: 0 0 auto;
      white-space:nowrap;
    }
    .p-high{ background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.2); }
    .p-medium{ background: rgba(245, 158, 11, 0.15); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.2); }
    .p-low{ background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); }

    .task-meta{
      margin-top:auto;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,.06);
      display:flex;
      align-items:center;
      justify-content:space-between;
      flex-wrap: wrap;
      gap:10px;
      color: #64748b;
      font-size: .78rem;
      font-weight: 600;
    }
    .meta-left,.meta-right{display:flex;align-items:center;gap:8px}
    .meta-right { margin-inline-start: auto; flex-shrink: 0; }
    
    .task-assignee-row {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px dashed rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--muted);
      font-weight: 700;
      width: 100%;
    }
    .chip{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 4px 10px;
      border-radius: 99px;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 0.75rem;
      transition: all 0.2s;
      white-space:nowrap;
    }
    .chip:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
    .dotUser{
      display: block;
      width:8px;height:8px;border-radius:99px;background: rgba(56,189,248,.85);
      box-shadow: 0 0 0 6px rgba(56,189,248,.08);
    }

    /* Status pill in card */
    .status-pill{
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.06);
      font-weight: 950;
      font-size: .76rem;
      white-space:nowrap;
      flex-shrink: 0;
    }
    .status-pill.status-pending{ color: rgba(245,158,11,.95); border-color: rgba(245,158,11,.25); background: rgba(245,158,11,.10); }
    .status-pill.status-progress{ color: rgba(96,165,250,.95); border-color: rgba(59,130,246,.25); background: rgba(59,130,246,.10); }
    .status-pill.status-review{ color: rgba(167,139,250,.95); border-color: rgba(139,92,246,.25); background: rgba(139,92,246,.10); }
    .status-pill.status-completed{ color: rgba(52,211,153,.95); border-color: rgba(16,185,129,.25); background: rgba(16,185,129,.10); }

    /* ====== Actions overlay (Enhanced) ====== */
    .task-actions{
      position:absolute;
      top: 12px;
      inset-inline-end: 12px;
      display:flex;
      flex-direction: column;
      gap: 6px;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
      background: rgba(15, 23, 42, 0.8);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(4px);
    }
    .task-card:hover .task-actions{ opacity:1; transform: translateX(0); }
    
    .action-btn{
      width: 32px; height:32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #94a3b8;
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition: all 0.15s;
    }
    .action-btn:hover{ background: rgba(255,255,255,0.1); color: #fff; transform: scale(1.1); }
    .action-edit:hover{ color: #60a5fa; }
    .action-reply:hover{ color: #34d399; }
    .action-del:hover{ color: #f87171; }

    /* Mobile: show actions always a bit */
    @media (max-width: 700px){
      .task-actions{opacity:1; transform:none}
    }

    /* ====== Footer ====== */
    footer{
      margin-top: 16px;
      padding: 14px 0 20px;
      color: rgba(226,232,240,.8);
      text-align:center;
      font-weight: 750;
      font-size: .9rem;
      opacity:.9;
    }

    /* ====== Modal ====== */
    .modal-overlay{
      position:fixed; inset:0;
      display:none;
      align-items:center;
      justify-content:center;
      background: rgba(0,0,0,.58);
      backdrop-filter: blur(10px);
      z-index: 1000;
      padding: 16px;
    }
    .modal{
      width: min(860px, 100%);
      max-height: 90vh;
      overflow:auto;
      background: rgba(15,23,42,.86);
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 20px;
      box-shadow: var(--shadow);
      position:relative;
    }
    .modal-head{
      padding: 16px 16px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      display:flex; align-items:center; justify-content:space-between; gap:10px;
    }
    .modal-title{
      margin:0;
      font-size: 1.15rem;
      font-weight: 1000;
    }
    .modal-close{
      width: 40px; height:40px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(2,6,23,.50);
      color: #fff;
      cursor:pointer;
    }
    .modal-body{padding: 16px}
    .grid2{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .field label{
      display:block;
      margin-bottom: 6px;
      color: var(--muted);
      font-weight: 850;
      font-size:.9rem;
    }
    .field input,.field select,.field textarea{
      width:100%;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(148,163,184,.22);
      background: rgba(2,6,23,.35);
      color: #fff;
      outline:none;
    }
    .field textarea{min-height: 90px; resize: vertical}
    .modal-foot{
      padding: 14px 16px;
      border-top: 1px solid rgba(255,255,255,.08);
      display:flex; gap: 10px;
      justify-content:flex-end;
    }
    .btn{
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.10);
      cursor:pointer;
      font-weight: 950;
    }
    .btn.secondary{background: rgba(255,255,255,.08); color:#e5e7eb}
    .btn.primary{background: rgba(59,130,246,.95); color:#fff; border-color: rgba(59,130,246,.35)}
    .btn.danger{background: rgba(239,68,68,.90); color:#fff; border-color: rgba(239,68,68,.30)}
    .btn:active{transform: scale(.98)}

    /* ====== Enhanced Reply Modal ====== */
    .reply-modal-body {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 75vh;
      max-height: 80vh;
      background: rgba(10, 15, 30, 0.4);
    }
    
    .reply-header {
      padding: 14px 20px;
      background: rgba(15, 23, 42, 0.7);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      flex-shrink: 0;
      backdrop-filter: blur(10px);
    }
    
    .reply-meta-info {
      color: #e2e8f0;
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .reply-role-badge {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
      color: #60a5fa;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 800;
      border: 1px solid rgba(59, 130, 246, 0.25);
      letter-spacing: 0.5px;
      box-shadow: 0 2px 10px rgba(59, 130, 246, 0.1);
    }
    
    .reply-attachments-area {
      padding: 12px 20px;
      background: rgba(15, 23, 42, 0.3);
      border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
      display: none;
      flex-shrink: 0;
    }

    .reply-list {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      background: transparent;
      border: none;
      border-radius: 0;
      max-height: none;
      min-height: 0;
    }
    
    .reply {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: 20px;
      border-bottom-left-radius: 4px; /* Assume others msg by default */
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.04);
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(5px);
      transition: transform 0.2s;
    }
    .reply:hover { transform: translateY(-1px); }
    
    .reply .who {
      font-size: 0.82rem;
      color: #94a3b8;
      margin-bottom: 4px;
      display:flex; align-items:center; gap:6px;
    }
    .reply .who::before {
      content:""; display:inline-block; width:24px; height:24px; 
      background: linear-gradient(135deg, #475569, #334155);
      border-radius:50%;
    }
    
    .reply .msg {
      color: #f1f5f9;
      font-size: 0.95rem;
      line-height: 1.6;
      font-weight: 500;
    }
    
    .reply .time {
      align-self: flex-end;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.3);
      margin-top: 6px;
      font-weight: 600;
    }

    /* Footer Compose Area */
    .reply-footer {
      padding: 16px 20px;
      background: rgba(15, 23, 42, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      flex-shrink: 0;
      backdrop-filter: blur(20px);
    }
    
    .reply-compose {
      display: flex;
      gap: 12px;
      align-items: center;
      background: rgba(2, 6, 23, 0.4);
      padding: 6px 8px 6px 16px;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.2s ease;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .reply-compose:focus-within {
      border-color: rgba(59, 130, 246, 0.5);
      background: rgba(2, 6, 23, 0.6);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
    
    .reply-compose input[type="text"] {
      flex: 1;
      background: transparent;
      border: none;
      padding: 10px 0;
      font-size: 0.95rem;
      box-shadow: none !important;
      color: #fff;
      min-width: 0;
    }

    .reply-compose input[type="file"] {
      font-size: 0.85rem;
      color: var(--muted);
      max-width: 220px;
    }
    
    .reply-btn-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    
    .reply-btn-send:hover {
      transform: scale(1.1) rotate(-10deg);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
    
    .reply-btn-attach {
      color: #94a3b8;
      background: transparent;
      border: none;
      padding: 8px;
      cursor: pointer;
      transition: color 0.2s;
      font-size: 1.2rem;
      display:flex; align-items:center; justify-content:center;
    }
    
    .reply-btn-attach:hover {
      color: #60a5fa;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
    }
    
    .file-row {
      margin-top: 10px;
      padding-inline-start: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-start;
    }

    /* Custom Scrollbar for reply list */
    .reply-list::-webkit-scrollbar { width: 6px; }
    .reply-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
    }
    .reply-list::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }

    /* ====== Notification Panel ====== */
    .notif-panel{
      position:absolute;
      top: calc(100% + 10px);
      inset-inline-end: 0;
      width: min(420px, calc(100vw - 32px));
      max-height: 60vh;
      overflow:auto;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(15,23,42,.86);
      backdrop-filter: blur(16px);
      box-shadow: 0 22px 50px rgba(0,0,0,.45);
      display:none;
      z-index: 1200;
    }
    .notif-panel.open{ display:block; }
    .notif-head{
      padding: 12px 12px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .notif-head b{ font-weight:1000; }
    .notif-actions{ display:flex; gap:8px; }
    .notif-item{
      padding: 12px 12px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      display:flex;
      gap: 10px;
      cursor:pointer;
      transition: .15s ease;
    }
    .notif-item:hover{ background: rgba(255,255,255,.04); }
    .notif-dot{
      width:10px;height:10px;border-radius:999px;
      margin-top: 6px;
      background: rgba(56,189,248,.85);
      box-shadow: 0 0 0 6px rgba(56,189,248,.08);
      flex: 0 0 auto;
    }
    .notif-item.read .notif-dot{ background: rgba(148,163,184,.35); box-shadow:none; }
    .notif-body{ min-width:0; flex:1; }
    .notif-title{ font-weight: 1000; color:#f8fafc; font-size:.92rem; margin:0; }
    .notif-desc{ margin:4px 0 0; color:#cbd5e1; font-weight: 750; font-size:.84rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .notif-time{ color: var(--muted2); font-weight: 850; font-size: .78rem; white-space:nowrap; }

    /* ====== Attachment Viewer ====== */
    .viewer{
      width: min(980px, 100%);
      max-height: 90vh;
      overflow:hidden;
      display:flex;
      flex-direction:column;
    }
    .viewer-body{
      padding: 12px;
      overflow:auto;
      background: rgba(2,6,23,.35);
      flex:1;
    }
    .viewer-frame{
      width:100%;
      height: 70vh;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 14px;
      background: rgba(0,0,0,.25);
    }
    .viewer-img{
      max-width: 100%;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.10);
      display:block;
      margin: 0 auto;
    }

    /* ====== Toast ====== */
    .toast-root{
      position: fixed;
      bottom: 18px;
      inset-inline-end: 18px;
      display:flex;
      flex-direction:column;
      gap: 12px;
      z-index: 9999;
      pointer-events:none;
    }
    .toast{
      pointer-events:auto;
      width: min(360px, calc(100vw - 36px));
      border-radius: 16px;
      border: 1px solid rgba(148,163,184,.22);
      background: linear-gradient(180deg, rgba(15,23,42,.78), rgba(2,6,23,.86));
      backdrop-filter: blur(18px);
      color: #e5e7eb;
      padding: 12px 14px;
      box-shadow: 0 18px 40px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.04);
      position:relative;
      overflow:hidden;
      display:flex;
      gap: 10px;
      align-items:flex-start;
      animation: toastIn .28s ease both;
    }
    @keyframes toastIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    .toast.closing{animation: toastOut .22s ease both}
    @keyframes toastOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(.98)}}
    .toast::before{
      content:"";
      position:absolute;
      inset:-40%;
      background:
        radial-gradient(circle at 30% 40%, rgba(56,189,248,.22), transparent 45%),
        radial-gradient(circle at 70% 60%, rgba(59,130,246,.18), transparent 50%),
        radial-gradient(circle at 45% 80%, rgba(16,185,129,.14), transparent 55%);
      filter: blur(10px);
      animation: waterMove 2.6s ease-in-out infinite;
      opacity:.9;
    }
    @keyframes waterMove{
      0%{transform:translate(-2%,-2%) rotate(0deg)}
      50%{transform:translate(2%,2%) rotate(2deg)}
      100%{transform:translate(-2%,-2%) rotate(0deg)}
    }
    .toast-icon{
      width: 34px; height:34px;
      border-radius: 14px;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(148,163,184,.18);
      position:relative;
      z-index:2;
      font-weight:1000;
    }
    .toast-body{position:relative; z-index:2; flex:1}
    .toast-title{font-weight:1000; font-size:.9rem; margin:0 0 4px; color:#f8fafc}
    .toast-msg{margin:0; font-size:.84rem; line-height:1.45; color:#cbd5e1}
    .toast-bar{position:absolute; left:0; bottom:0; height:3px; width:100%; background: rgba(148,163,184,.18); z-index:2}
    .toast-bar>span{
      display:block; height:100%; width:100%;
      transform-origin:left;
      background: linear-gradient(90deg, rgba(56,189,246,.95), rgba(59,130,246,.85));
      animation: barShrink linear both;
    }
    @keyframes barShrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}
    .toast.success .toast-icon{border-color: rgba(16,185,129,.35); background: rgba(16,185,129,.12)}
    .toast.warning .toast-icon{border-color: rgba(245,158,11,.35); background: rgba(245,158,11,.12)}
    .toast.error .toast-icon{border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.12)}

    /* ====== Responsive ====== */
    @media (max-width: 980px){
      .top-nav-inner{flex-wrap:wrap}
      .nav-links{order:3; width:100%; justify-content:flex-start}
      .page{padding: 0 14px}
      .top-header{flex-direction:column; align-items:flex-start}
      .header-left{min-width: 0}
      .summary-strip{flex-direction:column; align-items:stretch}
      .summary-pills{justify-content:stretch}
      .summary-pill{min-width: 0}
      .kanban-board{ grid-template-columns: 1fr; }
      .kanban-column{ height: auto; max-height: none; }
      .kanban-body{ max-height: 52vh; }
      .grid2{grid-template-columns:1fr}
      .notif-wrap{ justify-content: flex-end; }
    }

    /* Input/Select/Textarea Theme */
    input, select, textarea {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      outline: none;
      transition: all 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: rgba(59, 130, 246, 0.5);
      background: rgba(15, 23, 42, 0.8);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
    ::placeholder { color: rgba(148, 163, 184, 0.5); }
  </style>
</head>

<body>
  <!-- ===== Top nav ===== -->
  <div class="top-nav">
    <div class="top-nav-inner">
      <div class="brand">
        <span class="brand-badge">OLAYAN</span>
        <div class="brand-text">
          <b data-i18n="company">شركة العليان للخدمات الغذائية</b>
          <span data-i18n="brand_sub">Olayan Food Services (OFS)</span>
          <div class="motivation-box" id="motivationBox"></div>
        </div>
      </div>

      <div class="nav-links" aria-label="Main" style="flex-wrap:nowrap; overflow-x:auto; padding-bottom:0;">
        <a class="nav-link" href="index.html" data-i18n="nav_home">الرئيسية</a>
        <a class="nav-link active" href="tasks.html" data-i18n="nav_tasks">المهام</a>
        <a class="nav-link" href="employees.html" data-i18n="nav_employees">الموظفين</a>
        <a class="nav-link" href="branches.html" data-i18n="nav_branches">الفروع</a>
        <a class="nav-link" href="licenses.html" data-i18n="nav_licenses">الرخص</a>
        <a class="nav-link" href="violations.html" data-i18n="nav_violations">المخالفات</a>
        <a class="nav-link" href="login.html" data-i18n="nav_login">تسجيل الدخول</a>
      </div>



      <div class="nav-actions">
        <div class="notif-wrap">
          <button class="bell-btn" id="btnBell" title="Notifications">
            <span class="bell-ico">🔔</span>
            <span class="bell-badge" id="bellBadge">0</span>
          </button>

          <div class="notif-panel" id="notifPanel" aria-label="Notifications Panel">
            <div class="notif-head">
              <b id="notifTitle">الإشعارات</b>
              <div class="notif-actions">
                <button class="btn secondary" id="btnMarkAllRead" style="padding:8px 10px" data-i18n="notif_markAll">قراءة الكل</button>
                <button class="btn secondary" id="btnClearNotifs" style="padding:8px 10px" data-i18n="notif_clear">مسح</button>
              </div>
            </div>
            <div id="notifList"></div>
          </div>
        </div>

        <button class="pill" id="btnLang" title="Switch Language"
          style="background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.3); color:#93c5fd;">
          <span id="langLabel" style="font-weight:800; font-size:0.85rem; letter-spacing:0.5px;">AR/EN</span>
        </button>

      </div>
    </div>
  </div>

  <div class="page">
    <!-- ===== Header ===== -->
    <div class="top-header" id="topHeader">
      <div class="header-left">
        <div class="header-icon-box" aria-hidden="true">
          <span style="position:relative;z-index:2;font-size:28px">✅</span>
        </div>
        <div class="header-text">
          <h1 data-i18n="page_title">إدارة المهام</h1>
          <p data-i18n="page_sub">تتبع وإنجاز مهام الفريق بكفاءة عالية.</p>
          <div class="header-sub" data-i18n="dev_line">تطوير: Bandar A, Abdull wahab • شركة العليان للخدمات الغذائية</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:flex-end">
        <button class="btn-primary" id="btnAdd">
          <span class="icon">＋</span>
          <span data-i18n="new_task">مهمة جديدة</span>
        </button>
      </div>
    </div>

    <!-- ===== Summary strip ===== -->
    <div class="summary-strip" id="summaryStrip">
      <div class="summary-pills">
        <div class="summary-pill">
          <div class="label"><span class="tagDot dot-completed"></span><span data-i18n="completed">مكتملة</span></div>
          <div class="count" id="sumCompleted">0</div>
        </div>
        <div class="summary-pill">
          <div class="label"><span class="tagDot dot-review"></span><span data-i18n="review">مراجعة</span></div>
          <div class="count" id="sumReview">0</div>
        </div>
        <div class="summary-pill">
          <div class="label"><span class="tagDot dot-progress"></span><span data-i18n="progress">جاري العمل</span></div>
          <div class="count" id="sumProgress">0</div>
        </div>
        <div class="summary-pill">
          <div class="label"><span class="tagDot dot-pending"></span><span data-i18n="pending">قيد الانتظار</span></div>
          <div class="count" id="sumPending">0</div>
        </div>
      </div>
    </div>

    <!-- ===== Board ===== -->
    <div class="kanban-board" id="board">
      <div class="kanban-column" data-status="pending">
        <div class="kanban-header status-pending">
          <div class="left"><span class="title" data-i18n="pending">قيد الانتظار</span></div>
          <span class="task-count" id="colPending">0</span>
        </div>
        <div class="kanban-body" id="listPending"></div>
      </div>

      <div class="kanban-column" data-status="progress">
        <div class="kanban-header status-progress">
          <div class="left"><span class="title" data-i18n="progress">جاري العمل</span></div>
          <span class="task-count" id="colProgress">0</span>
        </div>
        <div class="kanban-body" id="listProgress"></div>
      </div>

      <div class="kanban-column" data-status="review">
        <div class="kanban-header status-review">
          <div class="left"><span class="title" data-i18n="review">مراجعة</span></div>
          <span class="task-count" id="colReview">0</span>
        </div>
        <div class="kanban-body" id="listReview"></div>
      </div>

      <div class="kanban-column" data-status="completed">
        <div class="kanban-header status-completed">
          <div class="left"><span class="title" data-i18n="completed">مكتملة</span></div>
          <span class="task-count" id="colCompleted">0</span>
        </div>
        <div class="kanban-body" id="listCompleted"></div>
      </div>
    </div>

    <footer data-i18n="footer">© 2026 جميع الحقوق محفوظة لدى شركة العليان للخدمات الغذائية</footer>
  </div>

  <!-- ===== Modals ===== -->
  <!-- Add/Edit Task -->
  <div class="modal-overlay" id="taskModal">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
      <div class="modal-head">
        <h3 class="modal-title" id="taskModalTitle" data-i18n="task_modal_title">مهمة جديدة</h3>
        <button class="modal-close" id="taskModalClose">✕</button>
      </div>
      <div class="modal-body">
        <div class="grid2">
          <div class="field">
            <label data-i18n="title">العنوان</label>
            <input id="fTitle" type="text" data-i18n-ph="title_ph" placeholder="..." />
          </div>
          <div class="field">
            <label data-i18n="assignee">إسناد إلى</label>
            <input type="text" id="fAssigneeSearch" placeholder="🔍 بحث (الاسم، SAP، الهوية)..." 
                   style="margin-bottom:6px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:4px; padding:6px; font-size:0.85rem; width:100%; box-sizing:border-box;" />
            <select id="fAssignee" class="input-select">
              <option value="">-- غير محدد --</option>
            </select>
          </div>

          <div class="field">
            <label data-i18n="branch">الفرع</label>
            <input id="fBranch" type="text" list="branchList" data-i18n-ph="branch_ph" placeholder="اختياري (أو * للكل)" />
            <datalist id="branchList"></datalist>
          </div>

          <div class="field" style="grid-column:1/-1">
            <label data-i18n="description">الوصف</label>
            <textarea id="fDesc" data-i18n-ph="desc_ph" placeholder="..."></textarea>
          </div>

          <div class="field">
            <label data-i18n="priority">الأولوية</label>
            <select id="fPriority">
              <option value="low" data-i18n="low">منخفضة</option>
              <option value="medium" data-i18n="medium">متوسطة</option>
              <option value="high" data-i18n="high">عالية</option>
            </select>
          </div>

          <div class="field">
            <label data-i18n="status">الحالة</label>
            <select id="fStatus">
              <option value="pending" data-i18n="pending">قيد الانتظار</option>
              <option value="progress" data-i18n="progress">جاري العمل</option>
              <option value="review" data-i18n="review">مراجعة</option>
              <option value="completed" data-i18n="completed">مكتملة</option>
            </select>
          </div>

          <div class="field">
            <label data-i18n="due_date">تاريخ الاستحقاق</label>
            <input id="fDue" type="date" />
          </div>

          <div class="field">
            <label data-i18n="attachments">المرفقات</label>
            <input id="fFiles" type="file" multiple />
            <div class="file-hint" data-i18n="attach_hint">يمكنك رفع (صور / PDF / فيديو / أي ملف).</div>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn secondary" id="btnCancelTask" data-i18n="cancel">إلغاء</button>
        <button class="btn primary" id="btnSaveTask" data-i18n="save">حفظ</button>
      </div>
    </div>
  </div>

  <!-- Replies Modal -->
  <div class="modal-overlay" id="replyModal">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h3 class="modal-title" id="replyTitle" data-i18n="replies">الردود</h3>
        <button class="modal-close" id="replyClose">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex; gap:10px; align-items:center; justify-content:space-between; flex-wrap:wrap">
          <div style="color:var(--muted); font-weight:900" id="replyTaskMeta">—</div>
          <div style="color:var(--muted2); font-weight:850; font-size:.85rem" id="replyRoleHint">—</div>
        </div>

        <div id="replyTaskAttachments" style="margin-top:10px; padding-bottom:10px; border-bottom:1px dashed rgba(255,255,255,0.1)"></div>

        <div class="reply-list" id="replyList"></div>

        <div class="reply-compose">
          <input type="text" id="replyInput" data-i18n-ph="reply_ph" placeholder="اكتب رد..." />
          <input type="file" id="replyFiles" multiple />
          <button class="btn primary" id="replySend" data-i18n="send">إرسال</button>
        </div>
        <div class="file-row">
          <span class="file-hint" data-i18n="attach_hint">يمكنك رفع (صور / PDF / فيديو / أي ملف).</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Delete -->
  <div class="modal-overlay" id="confirmModal">
    <div class="modal" style="width:min(520px,100%)" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h3 class="modal-title" data-i18n="confirm_delete_title">تأكيد الحذف</h3>
        <button class="modal-close" id="confirmClose">✕</button>
      </div>
      <div class="modal-body">
        <p style="margin:0;color:#cbd5e1;font-weight:850" data-i18n="confirm_delete_msg">
          هل أنت متأكد من حذف هذه المهمة؟ لا يمكن التراجع بعد الحذف.
        </p>
      </div>
      <div class="modal-foot">
        <button class="btn secondary" id="confirmNo" data-i18n="cancel">إلغاء</button>
        <button class="btn danger" id="confirmYes" data-i18n="delete">حذف</button>
      </div>
    </div>
  </div>

  <!-- Attachment Viewer -->
  <div class="modal-overlay" id="attachmentModal">
    <div class="modal viewer" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h3 class="modal-title" id="attachTitle" data-i18n="preview">Preview</h3>
        <div style="display:flex; gap:8px; align-items:center">
          <button class="btn secondary" id="attachDownload" style="padding:8px 10px" data-i18n="download">حفظ</button>
          <button class="btn secondary" id="attachPrint" style="padding:8px 10px" data-i18n="print">طباعة</button>
          <button class="modal-close" id="attachClose">✕</button>
        </div>
      </div>
      <div class="viewer-body" id="attachBody"></div>
    </div>
  </div>

  <!-- Toast Root -->
  <div class="toast-root" id="toastRoot"></div>

  <script src="js/api-client.js"></script>
  <script src="app.js"></script>
  <script>
    /* =========================================================
       AUTH (Role-Based)
       ========================================================= */
    var AUTH_KEYS = {
      token: ["ofs_auth_token","auth_token","token"],
      role:  ["ofs_auth_role","auth_role","role"],
      user:  ["ofs_auth_user","auth_user","user_name","username"]
    };

    function getStoredAny(keys){
      for(const k of keys){
        const v = localStorage.getItem(k);
        if(v && String(v).trim() !== "") return v;
      }
      return null;
    }

    function setStored(k, v){
      try{ localStorage.setItem(k, v); return true; }
      catch(e){ return false; }
    }

    function getAuth(){
      return {
        token: getStoredAny(AUTH_KEYS.token),
        role:  getStoredAny(AUTH_KEYS.role),
        user:  getStoredAny(AUTH_KEYS.user) || "guest",
      };
    }

    function guardAuth(){
      const a = getAuth();
      if(!a.token){
        console.warn("[AUTH] token missing. Redirecting...");
        window.location.href = "login.html";
        return false;
      }
      // Allow all logged-in users (RBAC handles visibility)
      return true;
    }

    if(!guardAuth()){
      throw new Error("Unauthorized");
    }

    /* =========================================================
       I18N
       ========================================================= */
    const i18n = {
      ar: {
        company: "شركة العليان للخدمات الغذائية",
        nav_home:"الرئيسية", nav_tasks:"المهام", nav_employees:"الموظفين", nav_branches:"الفروع",
        nav_licenses:"الرخص", nav_violations:"المخالفات", nav_login:"تسجيل الدخول",
        page_title:"إدارة المهام",
        page_sub:"تتبع وإنجاز مهام الفريق بكفاءة عالية.",
        dev_line:"تطوير: Bandar A, Abdull wahab • شركة العليان للخدمات الغذائية",
        pending:"قيد الانتظار", progress:"جاري العمل", review:"مراجعة", completed:"مكتملة",
        new_task:"مهمة جديدة",
        logout:"تسجيل خروج",
        title:"العنوان", description:"الوصف", assignee:"إسناد إلى",
        priority:"الأولوية", status:"الحالة", due_date:"تاريخ الاستحقاق",
        attachments:"المرفقات", attach_hint:"يمكنك رفع (صور / PDF / فيديو / أي ملف).",
        low:"منخفضة", medium:"متوسطة", high:"عالية",
        cancel:"إلغاء", save:"حفظ",
        replies:"الردود", send:"إرسال",
        confirm_delete_title:"تأكيد الحذف",
        confirm_delete_msg:"هل أنت متأكد من حذف هذه المهمة؟ لا يمكن التراجع بعد الحذف.",
        delete:"حذف",
        toast_saved:"تم الحفظ",
        toast_updated:"تم التعديل",
        toast_deleted:"تم الحذف",
        toast_reply:"تم إرسال الرد",
        toast_notif_on:"تم تفعيل الإشعارات",
        toast_notif_off:"تم رفض الإذن للإشعارات",
        admin_only_reply:"الرد مسموح للإدمن فقط",
        task_modal_title:"مهمة جديدة",
        task_modal_edit:"تعديل المهمة",
        notifs_title:"الإشعارات",
        notifs_empty:"لا توجد إشعارات",
        act_open:"فتح صفحة المهام",
        act_add:"إضافة مهمة",
        act_edit:"تعديل مهمة",
        act_delete:"حذف مهمة",
        act_reply:"إضافة رد",
        
        // Roles & UI dynamic
        role_admin: "مسؤول النظام",
        role_employee: "موظف",
        role_staff: "طاقم",
        no_replies: "لا توجد ردود بعد",
        
        // Buttons dynamic
        preview_btn: "معاينة",
        preview_pdf_btn: "معاينة PDF",
        download_btn: "حفظ",
        print_btn: "طباعة",
        
        // Hints / Warnings
        preview_hint: "(إذا لم تظهر المعاينة: الملف كبير أو لم يتم حفظه كـ DataURL)",
        no_preview_hint: "(بدون معاينة: الملف كبير أو غير مدعوم للتخزين)",
        no_inline_viewer: "لا يوجد عرض مباشر لهذا النوع. استخدم زر الحفظ.",
        
        // Toasts / Errors
        msg_req: "يجب كتابة رسالة أو إرفاق ملف",
        no_preview_data: "لا توجد بيانات للمعاينة (الملف كبير أو غير مخزن)",
        no_download_data: "لا توجد بيانات للحفظ",
        no_print_data: "لا توجد بيانات للطباعة",
        unsupported_print: "الطباعة غير مدعومة",
        storage_full: "الذاكرة ممتلئة أو محظورة. حاول تفريغ المساحة.",
        storage_blocked: "الذاكرة محظورة. تأكد من إعدادات المتصفح.",
        
        notif_markAll: "قراءة الكل",
        notif_clear: "مسح",
        brand_badge: "العليان",
        logout_title: "تسجيل خروج",
        logout_msg: "تم بنجاح",
        act_logout: "تم تسجيل الخروج",
        browser_task_deleted: "تم حذف مهمة",
        notif_toast_title: "الإشعارات",
      },
      en: {
        company: "Olayan Food Services",
        nav_home:"Home", nav_tasks:"Tasks", nav_employees:"Employees", nav_branches:"Branches",
        nav_licenses:"Licenses", nav_violations:"Violations", nav_login:"Login",
        page_title:"Tasks Management",
        page_sub:"Track, assign, and complete team tasks efficiently.",
        dev_line:"Developed by Bandar A, Abdull wahab • Olayan Food Services",
        pending:"Pending", progress:"In Progress", completed:"Completed",
        new_task:"New Task",
        logout:"Logout",
        title:"Title", description:"Description", assignee:"Assignee", branch:"Branch",
        priority:"Priority", status:"Status", due_date:"Due Date",
        attachments:"Attachments", attach_hint:"Upload (image / PDF / video / any file).",
        low:"Low", medium:"Medium", high:"High",
        cancel:"Cancel", save:"Save",
        replies:"Replies", send:"Send",
        confirm_delete_title:"Confirm Delete",
        confirm_delete_msg:"Are you sure you want to delete this task? This cannot be undone.",
        delete:"Delete",
        toast_saved:"Saved",
        toast_updated:"Updated",
        toast_deleted:"Deleted",
        toast_reply:"Reply sent",
        toast_notif_on:"Notifications enabled",
        toast_notif_off:"Notification permission denied",
        admin_only_reply:"Replies are admin-only",
        task_modal_title:"New Task",
        task_modal_edit:"Edit Task",
        notifs_title:"Notifications",
        notifs_empty:"No notifications",
        act_open:"Opened Tasks page",
        act_add:"Task added",
        act_edit:"Task updated",
        act_delete:"Task deleted",
        act_reply:"Reply added",
        
        // Roles & UI dynamic
        role_admin: "System Admin",
        role_employee: "Employee",
        role_staff: "Staff",
        no_replies: "No replies yet",
        
        // Buttons dynamic
        preview_btn: "Preview",
        preview_pdf_btn: "Preview PDF",
        download_btn: "Download",
        print_btn: "Print",
        
        // Hints / Warnings
        preview_hint: "(If preview fails: File too large or not stored as DataURL)",
        no_preview_hint: "(No preview: File too large or not supported)",
        no_inline_viewer: "No inline viewer for this type. Use Download.",
        
        // Toasts / Errors
        msg_req: "Message or attachment required",
        no_preview_data: "No preview data (file too large or not stored)",
        no_download_data: "No stored data for download",
        no_print_data: "No stored data to print",
        unsupported_print: "Unsupported print",
        storage_full: "localStorage blocked/Full. Use same origin & clear space.",
        storage_blocked: "localStorage is blocked. Check browser settings.",
        
        notif_markAll: "Mark All Read",
        notif_clear: "Clear",
        reply_ph: "Type a reply...",
        assignee_ph: "admin / Employee Name",
        branch_ph: "Optional (or * for all)",
        desc_ph: "...",
        title_ph: "...",
        preview: "Preview",
        download: "Download",
        print: "Print",
        footer: "© 2026 Olayan Food Services. All rights reserved.",
        brand_sub: "Olayan Food Services (OFS)",
      }
    };

    const LANG_KEY = "ofs_lang";
    function getLang(){
      const saved = localStorage.getItem(LANG_KEY);
      if(saved === "en" || saved === "ar") return saved;
      return document.documentElement.lang === "en" ? "en" : "ar";
    }
    function setLang(lang){
      localStorage.setItem(LANG_KEY, lang);
      const isAr = lang === "ar";
      document.documentElement.lang = lang;
      document.body.setAttribute("dir", isAr ? "rtl" : "ltr");
      applyTranslations();
      updateLangButton();
      renderAll();
      addActivity("lang", "Language switched", {lang});
    }

    function t(key){
      const lang = getLang();
      return (i18n[lang] && i18n[lang][key]) || key;
    }

    function applyTranslations(){
      const lang = getLang();
      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const k = el.getAttribute("data-i18n");
        if(i18n[lang] && i18n[lang][k]) el.textContent = i18n[lang][k];
      });
      document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
        const k = el.getAttribute("data-i18n-ph");
        if(i18n[lang] && i18n[lang][k]) el.placeholder = i18n[lang][k];
      });
      const nt = document.getElementById("notifTitle");
      if(nt) nt.textContent = t("notifs_title");
    }

    function updateLangButton(){
      document.getElementById("langLabel").textContent = "AR/EN";
    }

    /* ====== Helper: UUID (Polyfill) ====== */
    function generateUUID() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    /* =========================================================
       Activity Log (for نشاطات عامة)
       ========================================================= */
    const ACT_KEY = "ofs_activity_log_v1";
    function loadActivity(){
      try{
        const raw = localStorage.getItem(ACT_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      }catch(e){ return []; }
    }
    function addActivity(type, message, meta={}){
      const arr = loadActivity();
      arr.unshift({
        id: generateUUID(),
        time: Date.now(),
        who: getAuth().user || "admin",
        type,
        message,
        meta
      });
      // keep last 400
      localStorage.setItem(ACT_KEY, JSON.stringify(arr.slice(0,400)));
    }

    /* =========================================================
       Notifications Center (Panel + Badge)
       ========================================================= */
    const NOTIF_KEY = "ofs_notifs_v1";
    function loadNotifs(){
      try{
        const raw = localStorage.getItem(NOTIF_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      }catch(e){ return []; }
    }
    function saveNotifs(arr){
      localStorage.setItem(NOTIF_KEY, JSON.stringify(arr.slice(0,200)));
    }
    function pushNotif(title, desc, taskId=null, titleKey=null, descKey=null){
      const arr = loadNotifs();
      arr.unshift({
        id: generateUUID(),
        time: Date.now(),
        title,
        desc,
        taskId,
        titleKey,
        descKey,
        read: false
      });
      saveNotifs(arr);
      refreshNotifUI();
    }
    function unreadCount(){
      return loadNotifs().filter(n=>!n.read).length;
    }
    function setBellBadge(n){
      const b = document.getElementById("bellBadge");
      if(n>0){
        b.style.display = "inline-flex";
        b.textContent = String(n);
      }else{
        b.style.display = "none";
      }
    }
    function refreshNotifUI(){
      const list = document.getElementById("notifList");
      const arr = loadNotifs();
      setBellBadge(unreadCount());
      list.innerHTML = "";

      if(!arr.length){
        const empty = document.createElement("div");
        empty.style.padding = "14px";
        empty.style.color = "var(--muted)";
        empty.style.fontWeight = "900";
        empty.textContent = t("notifs_empty");
        empty.setAttribute("data-i18n", "notifs_empty");
        list.appendChild(empty);
        return;
      }

      arr.forEach(n=>{
        const item = document.createElement("div");
        item.className = "notif-item" + (n.read ? " read" : "");
        const time = new Date(n.time).toLocaleString(getLang()==="ar" ? "ar-SA" : "en-US");
        
        const tTitle = n.titleKey ? t(n.titleKey) : n.title;
        const tDesc = n.descKey ? t(n.descKey) : n.desc;
        
        item.innerHTML = `
          <div class="notif-dot"></div>
          <div class="notif-body">
            <p class="notif-title" ${n.titleKey ? `data-i18n="${n.titleKey}"` : ""}>${escapeHtml(tTitle)}</p>
            <p class="notif-desc" ${n.descKey ? `data-i18n="${n.descKey}"` : ""}>${escapeHtml(tDesc)}</p>
          </div>
          <div class="notif-time">${time}</div>
        `;
        item.addEventListener("click", ()=>{
          n.read = true;
          saveNotifs(arr);
          refreshNotifUI();
          if(n.taskId){
            openReplies(n.taskId);
            closeNotifPanel();
          }
        });
        list.appendChild(item);
      });
    }

    function toggleNotifPanel(){
      const p = document.getElementById("notifPanel");
      p.classList.toggle("open");
      if(p.classList.contains("open")){
        refreshNotifUI();
      }
    }
    function closeNotifPanel(){
      const p = document.getElementById("notifPanel");
      p.classList.remove("open");
    }

    async function ensureNotificationPermission(){
      if(!("Notification" in window)) return;
      if(Notification.permission === "granted") return;
      if(Notification.permission === "denied") return;
      const perm = await Notification.requestPermission();
      if(perm === "granted"){
        toast("success", t("notifs_title"), t("toast_notif_on"));
        addActivity("notif", "Notification permission granted");
      }else{
        toast("warning", t("notifs_title"), t("toast_notif_off"));
        addActivity("notif", "Notification permission denied");
      }
    }

    function notifyBrowser(title, body){
      try{
        if(!("Notification" in window)) return;
        if(Notification.permission !== "granted") return;
        new Notification(title, { body });
      }catch(e){}
    }

    /* =========================================================
       Tasks storage
       ========================================================= */
    const STORAGE_KEY = "db:tasks";
    let tasks = [];
    let editingId = null;
    let deletingId = null;
    let replyingId = null;

    function normalizeTaskRecord(task){
      if(!task || typeof task !== 'object') return null;
      const statusRaw = task.status || task.status_raw || '';
      let status = statusRaw;
      if(statusRaw === 'in_progress') status = 'progress';
      if(statusRaw === 'done') status = 'completed';
      const desc = (task.desc ?? task.description ?? '');
      const due = (task.due ?? task.due_date ?? '');
      const branch = (task.branch ?? task.branch_id ?? '');
      
      let replies = Array.isArray(task.replies) ? task.replies : [];
      let attachments = Array.isArray(task.attachments) ? task.attachments : [];

      // Convert API comments to replies
      if(task.comments && Array.isArray(task.comments)){
         replies = task.comments.map(c => ({
            who: c.user ? (c.user.name || c.user.username) : "Unknown",
            time: new Date(c.created_at).getTime(),
            msg: c.body || "",
            files: (c.attachments || []).map(a => ({
               name: a.original_name,
               type: a.mime_type,
               size: a.size,
               dataUrl: a.url || a.path
            }))
         }));
      }

      return { ...task, status, desc, due, branch, replies, attachments };
    }

    function normalizeTasks(list){
      let changed = false;
      const out = [];
      (list || []).forEach(t=>{
        const n = normalizeTaskRecord(t);
        if(!n) return;
        out.push(n);
      });
      return out;
    }

    function seedIfEmpty(){
      if(tasks.length) return;
      // Only seed if we really have nothing and no API connection? 
      // For now, let's keep it but maybe we should check if we tried API.
      const auth = getAuth();
      tasks = [
        {
          id: generateUUID(),
          title: "جرّد المستودع",
          desc: "تأكد من أصناف المستودع والتطابق مع السجلات.",
          assignee: "أحمد",
          priority: "low",
          status: "progress",
          due: "2026-01-28",
          createdBy: auth.user,
          replies: [],
          attachments: []
        },
        {
          id: generateUUID(),
          title: "انقطاع كهرباء",
          desc: "متابعة البلاغ والتنسيق مع شركة الكهرباء.",
          assignee: "admin",
          priority: "medium",
          status: "completed",
          due: "2026-02-22",
          createdBy: auth.user,
          replies: [{who:"admin", time: Date.now(), msg:"تم الإغلاق والمتابعة.", files: []}],
          attachments: []
        }
      ];
      save();
    }

    async function load(){
      // 1. Load from local cache first
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        tasks = raw ? JSON.parse(raw) : [];
        if(!Array.isArray(tasks)) tasks = [];
      }catch(e){
        tasks = [];
      }
      tasks = normalizeTasks(tasks);
      renderAll();

      // 2. Fetch from API
      try {
        const serverData = await APIClient.tasks.list();
        const list = Array.isArray(serverData) ? serverData : (serverData.data || []);
        
        if(Array.isArray(list)){
           // We might want to merge, but simpler to replace with server truth
           // normalizeTaskRecord will handle field mapping
           tasks = list.map(t => normalizeTaskRecord(t)).filter(x=>x);
           save(); // Update local cache
           renderAll();
        }
      } catch(e){
        console.warn("API load failed", e);
      }
      
      seedIfEmpty();
    }

    function save(){
      try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      }catch(e){
        toast("error","Storage", t("storage_full"));
      }
    }

    /* =========================================================
       Data Fetching & Normalization
       ========================================================= */
    function normalizeTaskRecord(t){
      // 1. Status Mapping
      let s = t.status || "pending";
      if(s === "in_progress") s = "progress";
      if(s === "done") s = "completed";

      // 2. Field Mapping (Backend -> Frontend)
      // Backend: description, due_date
      // Frontend: desc, due
      const desc = t.description !== undefined ? t.description : (t.desc || "");
      const due = t.due_date !== undefined ? t.due_date : (t.due || "");

      // 3. Assignee Mapping
      let asg = t.assignee;
      if(asg && typeof asg === 'object'){
         asg = { id: asg.id, name: asg.name || asg.username || "User" };
      }

      return {
        ...t,
        id: t.id, // Ensure ID is preserved
        status: s,
        desc: desc,
        due: due,
        assignee: asg,
        priority: t.priority || "medium",
        title: t.title || "Untitled",
        attachments: t.attachments || [],
        replies: t.replies || []
      };
    }

    async function fetchTasks(){
      if(!window.APIClient || !window.APIClient.tasks) return;
      try {
        const serverTasks = await APIClient.tasks.list();
        if(Array.isArray(serverTasks)){
           // Merge or Replace? 
           // For now, let's replace local tasks with server tasks to ensure sync
           // But we should be careful about offline changes. 
           // Since this is a dashboard, server is truth.
           tasks = serverTasks.map(normalizeTaskRecord);
           save(); // Cache to local storage
           renderAll();
           console.log("Tasks synced from server:", tasks.length);
        }
      } catch(e){
        console.warn("Failed to fetch tasks from server:", e);
      }
    }

    /* =========================================================
       Rendering
       ========================================================= */
    function statusLabel(s){
      if(s === "pending") return t("pending");
      if(s === "progress") return t("progress");
      if(s === "review") return t("review");
      if(s === "completed") return t("completed");
      return s;
    }

    function priorityLabel(p){
      if(p === "high") return t("high");
      if(p === "medium") return t("medium");
      if(p === "low") return t("low");
      return p;
    }

    function formatDateISO(iso){
      if(!iso) return "—";
      return iso;
    }

    function countReplies(task){
      return (task.replies && task.replies.length) ? task.replies.length : 0;
    }

    function renderAll(){
      // Filter by RBAC (canAccessBranch)
      let visibleTasks = tasks;
      if(window.canAccessBranch && window.getCurrentMember){
         let member = window.getCurrentMember();
         // Safety fallback for localhost if app.js is cached/outdated
         if(!member && (location.hostname==='localhost' || location.hostname==='127.0.0.1')){
            member = { username: "dev_admin", role: "admin", branches: ["*"] };
         }
         
         if(member){
            visibleTasks = tasks.filter(t => window.canAccessBranch(t.branch, member));
         }
      }

      const pending = visibleTasks.filter(x=>x.status==="pending");
      const progress = visibleTasks.filter(x=>x.status==="progress");
      const review = visibleTasks.filter(x=>x.status==="review");
      const completed = visibleTasks.filter(x=>x.status==="completed");

      setText("sumPending", pending.length);
      setText("sumProgress", progress.length);
      setText("sumReview", review.length);
      setText("sumCompleted", completed.length);

      setText("colPending", pending.length);
      setText("colProgress", progress.length);
      setText("colReview", review.length);
      setText("colCompleted", completed.length);

      renderList("listPending", pending);
      renderList("listProgress", progress);
      renderList("listReview", review);
      renderList("listCompleted", completed);

      updateTopAreaHeight();
      refreshNotifUI();
    }

    function setText(id, v){
      const el = document.getElementById(id);
      if(el) el.textContent = String(v);
    }

    function renderList(containerId, list){
      const el = document.getElementById(containerId);
      el.innerHTML = "";
      list.forEach(task=> el.appendChild(taskCard(task)));
    }

    function taskCard(task){
      const card = document.createElement("div");
      card.className = "task-card";
      card.dataset.id = task.id;

      const badgeClass =
        task.priority === "high" ? "badge p-high" :
        task.priority === "medium" ? "badge p-medium" :
        "badge p-low";

      const repliesCount = countReplies(task);
      const assigneeName = (task.assignee && typeof task.assignee === 'object') 
        ? escapeHtml(task.assignee.name || "Unknown")
        : escapeHtml(task.assignee || "Unassigned");

      card.innerHTML = `
        <div class="task-actions">
          <button class="action-btn action-reply" title="${t("replies")}">💬</button>
          <button class="action-btn action-edit" title="Edit">✎</button>
          <button class="action-btn action-del" title="Delete">🗑</button>
        </div>

        <div class="task-top">
          <div style="min-width:0;flex:1">
            <h4 class="task-title"><span class="t-prefix">📝</span> ${escapeHtml(task.title || "")}</h4>
            <p class="task-desc">${escapeHtml(task.desc || "")}</p>
          </div>
          <span class="${badgeClass}">${priorityLabel(task.priority)}</span>
        </div>

        <div class="task-meta">
          <div class="meta-left">
            <span class="chip" title="${t("replies")}">💬 ${repliesCount}</span>
            <span class="chip">📅 ${formatDateISO(task.due)}</span>
          </div>
          <div class="meta-right">
            <span class="status-pill status-${task.status}">${statusLabel(task.status)}</span>
          </div>
        </div>
        
        <div class="task-assignee-row" title="${assigneeName}">
           <span class="dotUser"></span>
           <span>${assigneeName}</span>
        </div>
      `;

      const btnReply = card.querySelector(".action-reply");
      const btnEdit  = card.querySelector(".action-edit");
      const btnDel   = card.querySelector(".action-del");

      btnReply.addEventListener("click", (e)=>{ e.stopPropagation(); openReplies(task.id); });
      btnEdit.addEventListener("click", (e)=>{ e.stopPropagation(); openEdit(task.id); });
      btnDel.addEventListener("click", (e)=>{ e.stopPropagation(); askDelete(task.id); });

      card.addEventListener("click", ()=> openReplies(task.id));
      return card;
    }

    function escapeHtml(str){
      return String(str)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
    }

    /* =========================================================
       Modals: Add/Edit
       ========================================================= */
    const taskModal = document.getElementById("taskModal");
    const taskModalTitle = document.getElementById("taskModalTitle");

    function openTaskModal(isEdit){
      updateAssigneeList(); // Refresh list every time modal opens
      updateBranchList();   // Refresh branch list
      taskModal.style.display = "flex";
      taskModalTitle.textContent = isEdit ? t("task_modal_edit") : t("task_modal_title");
    }

    function updateBranchList(){
      const list = document.getElementById("branchList");
      if(!list) return;
      list.innerHTML = "";
      
      let branches = ["*"];
      try {
        const raw = localStorage.getItem("ofs_branches_v1");
        if(raw) {
          const arr = JSON.parse(raw);
          if(Array.isArray(arr)) {
            branches = arr.map(b => b.name || b.branch_name || b.id);
          }
        }
      } catch(e){}
      
      // Unique and sort
      branches = [...new Set(branches)].sort();
      
      branches.forEach(val => {
        const op = document.createElement("option");
        op.value = val;
        list.appendChild(op);
      });
    }

    function renderAssigneeOptions(opts){
       const list = document.getElementById("fAssignee");
       if(!list) return;
       const currentVal = list.value;
       list.innerHTML = '<option value="">-- غير محدد --</option>';
       opts.forEach(o => {
         const op = document.createElement("option");
         op.value = o.value;
         op.textContent = o.label;
         list.appendChild(op);
       });
       // Restore if valid
       if(currentVal && opts.some(o=>o.value===currentVal)) list.value = currentVal;
    }

    function updateAssigneeList(){
      const list = document.getElementById("fAssignee");
      if(!list) return;
      
      let options = [];
      
      // 1. Add System Admins
      const admins = ["admin", "bandar", "dev"];
      admins.forEach(name => {
        options.push({ value: name, label: `${t("role_admin")} (${name})` });
      });

      // 2. Add Employees from LocalStorage (db:employees)
      try {
        const raw = localStorage.getItem("db:employees");
        if(raw){
          const emps = JSON.parse(raw);
          if(Array.isArray(emps)){
             emps.forEach(emp => {
               if(emp.archived) return;
               const name = emp.nameAr || emp.nameEn || emp.name || emp.id;
               const roleKey = (emp.role || "").toLowerCase() === "admin" ? "role_admin" : "role_employee";
               const sap = emp.sapId || emp.sap_id || "";
               const nid = emp.id_number || emp.nationalId || emp.iqamaId || "";
               
               let label = `${t(roleKey)} (${name})`;
               if(sap) label += ` [SAP: ${sap}]`;
               if(nid) label += ` [ID: ${nid}]`;

               options.push({ value: name, label: label });
             });
          }
        }
      } catch(e){ console.error("Error loading employees for tasks", e); }
      
      // Store globally
      window.allAssigneeOptions = options;
      renderAssigneeOptions(options);

      // 3. Fetch from API (if available)
      if(window.APIClient && window.APIClient.users){
         APIClient.users.list().then(users => {
             if(Array.isArray(users)){
                 let changed = false;
                 users.forEach(u => {
                    const val = u.username || u.name;
                    if(!options.some(o=>o.value===val)){
                        options.push({ value: val, label: `User (${u.name || val})` });
                        changed = true;
                    }
                 });
                 if(changed){
                   window.allAssigneeOptions = options;
                   renderAssigneeOptions(options);
                 }
             }
         }).catch(e=>{});
      }
    }
    function closeTaskModal(){
      taskModal.style.display = "none";
      editingId = null;
      clearTaskForm();
    }
    function clearTaskForm(){
      document.getElementById("fTitle").value = "";
      document.getElementById("fDesc").value = "";
      document.getElementById("fAssignee").value = "";
      document.getElementById("fPriority").value = "medium";
      document.getElementById("fStatus").value = "pending";
      document.getElementById("fDue").value = "";
      document.getElementById("fFiles").value = "";
    }

    async function openEdit(id){
      const task = tasks.find(x=>x.id===id);
      if(!task) return;
      editingId = id;

      document.getElementById("fTitle").value = task.title || "";
      document.getElementById("fDesc").value = task.desc || "";
      
      let assigneeVal = "";
      if(task.assignee && typeof task.assignee === 'object'){
         assigneeVal = task.assignee.id; 
      } else {
         assigneeVal = task.assignee || "";
      }
      document.getElementById("fAssignee").value = assigneeVal;

      document.getElementById("fPriority").value = task.priority || "medium";
      document.getElementById("fStatus").value = task.status || "pending";
      document.getElementById("fDue").value = task.due || "";
      document.getElementById("fFiles").value = "";

      openTaskModal(true);
    }

    function openAdd(){
      editingId = null;
      clearTaskForm();
      openTaskModal(false);
    }

    async function collectFiles(inputEl){
      const files = Array.from(inputEl.files || []);
      const out = [];

      for(const f of files){
        const item = {name:f.name, type:f.type, size:f.size};

        // Save small previews:
        // images <= 1MB
        // pdf <= 1.5MB
        const isImg = f.type.startsWith("image/");
        const isPdf = f.type === "application/pdf";
        if((isImg && f.size <= 1024*1024) || (isPdf && f.size <= 1536*1024)){
          try{ item.dataUrl = await fileToDataUrl(f); }catch(e){}
        }

        out.push(item);
      }
      return out;
    }

    function fileToDataUrl(file){
      return new Promise((res, rej)=>{
        const r = new FileReader();
        r.onload = ()=> res(String(r.result||""));
        r.onerror = rej;
        r.readAsDataURL(file);
      });
    }

    const BASE_URL = "http://127.0.0.1:8000/api";
    async function syncToServer(endpoint, data){
      try{
        const res = await fetch(BASE_URL + endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if(!res.ok) throw new Error("Server rejected");
      }catch(e){
        console.warn("Sync failed — will retry later:", e);
      }
    }

    async function saveTaskFromForm(){
      const auth = getAuth();
      const title = document.getElementById("fTitle").value.trim();
      const desc = document.getElementById("fDesc").value.trim();
      const assigneeId = document.getElementById("fAssignee").value.trim();
      const assigneeName = document.getElementById("fAssignee").options[document.getElementById("fAssignee").selectedIndex]?.text || "Unassigned";
      
      const priority = document.getElementById("fPriority").value;
      const status = document.getElementById("fStatus").value;
      const due = document.getElementById("fDue").value || "";

      if(!title){
        toast("warning","Validation", "Title is required");
        return;
      }

      const files = await collectFiles(document.getElementById("fFiles"));

      if(editingId){
        const idx = tasks.findIndex(x=>x.id===editingId);
        if(idx>-1){
          const updatedTask = {
            ...tasks[idx],
            title, desc, priority, status, due,
            assignee: assigneeId ? { id: assigneeId, name: assigneeName } : "Unassigned", // Optimistic update as object
            assigned_to: assigneeId || null,
            attachments: [...(tasks[idx].attachments||[]), ...files]
          };
          tasks[idx] = updatedTask;
          save();
          
          try {
             // For API update we send assigned_to: ID (or null)
             await APIClient.tasks.update(editingId, { ...updatedTask, assigned_to: assigneeId || null });
          } catch(e) {
             console.warn("API update failed, saved locally", e);
          }
          
          renderAll();
          toast("success", t("toast_updated"), `${title}`);

          pushNotif(t("toast_updated"), title, editingId, "toast_updated");
          addActivity("task", t("act_edit"), {taskId: editingId, title});
          notifyBrowser(t("act_edit"), title);
        }
      }else{
        // Create new
        const tempId = generateUUID();
        const newTask = {
          id: tempId,
          title, desc, priority, status, due,
          assignee: assigneeId ? { id: assigneeId, name: assigneeName } : "Unassigned",
          assigned_to: assigneeId || null,
          createdBy: auth.user,
          replies: [],
          attachments: files
        };
        tasks.unshift(newTask);
        save();
        renderAll();
        
        try {
           const created = await APIClient.tasks.create({ ...newTask, assigned_to: assigneeId || null });
           if(created && created.id){
             const idx = tasks.findIndex(x => x.id === tempId);
             if(idx > -1){
               // Replace local task with server task (updates ID and timestamps)
               tasks[idx] = normalizeTaskRecord(created);
               save();
               renderAll();
             }
           }
        } catch(e) {
           console.warn("API create failed, saved locally", e);
        }
        
        toast("success", t("toast_saved"), `${title}`);

        pushNotif(t("toast_saved"), title, tempId, "toast_saved");
        addActivity("task", t("act_add"), {taskId: tempId, title});
        notifyBrowser(t("new_task"), title);
      }

      closeTaskModal();
    }

    /* =========================================================
       Replies
       ========================================================= */
    const replyModal = document.getElementById("replyModal");
    const replyList = document.getElementById("replyList");

    function openReplies(id){
      const task = tasks.find(x=>x.id===id);
      if(!task) return;
      replyingId = id;

      document.getElementById("replyTaskMeta").textContent =
        `${task.title || ""} • ${statusLabel(task.status)} • ${priorityLabel(task.priority)} • ${formatDateISO(task.due)}`;

      const role = (getAuth().role || "").toLowerCase();
      document.getElementById("replyRoleHint").textContent =
        role === "admin" ? "Admin" : t("admin_only_reply");

      // Render Task Attachments
      const taskFilesEl = document.getElementById("replyTaskAttachments");
      if(task.attachments && task.attachments.length > 0){
         taskFilesEl.innerHTML = renderReplyFiles(task.attachments, -1);
         taskFilesEl.style.display = "block";
      } else {
         taskFilesEl.innerHTML = "";
         taskFilesEl.style.display = "none";
      }

      renderReplies(task);
      replyModal.style.display = "flex";
      document.getElementById("replyInput").value = "";
      document.getElementById("replyFiles").value = "";
    }

    function closeReplies(){
      replyModal.style.display = "none";
      replyingId = null;
    }

    function renderReplies(task){
      replyList.innerHTML = "";
      const replies = task.replies || [];
      if(!replies.length){
        const empty = document.createElement("div");
        empty.style.color = "var(--muted)";
        empty.style.fontWeight = "900";
        empty.textContent = t("no_replies");
        replyList.appendChild(empty);
        return;
      }

      replies.forEach((r, idx)=>{
        const item = document.createElement("div");
        item.className = "reply";
        const time = new Date(r.time).toLocaleString(getLang()==="ar" ? "ar-SA" : "en-US");

        item.innerHTML = `
          <div style="min-width:0">
            <div class="who">${escapeHtml(r.who || "")}</div>
            <p class="msg">${escapeHtml(r.msg || "")}</p>
            ${renderReplyFiles(r.files || [], idx)}
          </div>
          <div class="time">${time}</div>
        `;
        replyList.appendChild(item);
      });

      replyList.scrollTop = replyList.scrollHeight;
    }

    function renderReplyFiles(files, replyIdx){
      if(!files.length) return "";

      const btnStyle = `
        display:inline-flex;align-items:center;gap:6px;
        padding:6px 10px;border-radius:12px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(2,6,23,.35);
        cursor:pointer;color:#e5e7eb;
        font-weight:900;font-size:.8rem;
        margin-inline-end:8px;margin-top:6px;
      `;

      const blocks = files.map((f, fileIdx)=>{
        const safeName = escapeHtml(f.name || "file");
        const canPreview = !!f.dataUrl;

        // Image preview
        if(canPreview && String(f.type||"").startsWith("image/")){
          return `
            <div style="margin-top:10px">
              <img src="${f.dataUrl}" alt="${safeName}"
                style="max-width:260px;border-radius:14px;border:1px solid rgba(255,255,255,.10);display:block;margin-bottom:6px" />
              <div>
                <button style="${btnStyle}" onclick="openAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">👁 ${t("preview_btn")}</button>
                <button style="${btnStyle}" onclick="downloadAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">⬇ ${t("download_btn")}</button>
                <button style="${btnStyle}" onclick="printAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">🖨 ${t("print_btn")}</button>
              </div>
            </div>
          `;
        }

        // PDF preview
        if(canPreview && String(f.type||"") === "application/pdf"){
          return `
            <div style="margin-top:10px;color:#cbd5e1;font-weight:850">
              📎 ${safeName} <span style="color:var(--muted2)">(${Math.round((f.size||0)/1024)} KB)</span>
              <div>
                <button style="${btnStyle}" onclick="openAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">👁 ${t("preview_pdf_btn")}</button>
                <button style="${btnStyle}" onclick="downloadAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">⬇ ${t("download_btn")}</button>
                <button style="${btnStyle}" onclick="printAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">🖨 ${t("print_btn")}</button>
              </div>
              <div style="margin-top:8px;color:var(--muted);font-weight:800;font-size:.82rem">
                ${t("preview_hint")}
              </div>
            </div>
          `;
        }

        // Other files
        return `
          <div style="margin-top:10px;color:#cbd5e1;font-weight:850">
            📎 ${safeName} <span style="color:var(--muted2)">(${Math.round((f.size||0)/1024)} KB)</span>
            ${canPreview ? `
              <div>
                <button style="${btnStyle}" onclick="downloadAttachment('${replyingId}', ${replyIdx}, ${fileIdx}); return false;">⬇ ${t("download_btn")}</button>
              </div>
            ` : `
              <div style="margin-top:6px;color:var(--muted);font-weight:800;font-size:.82rem">
                ${t("no_preview_hint")}
              </div>
            `}
          </div>
        `;
      }).join("");

      return `<div>${blocks}</div>`;
    }

    async function sendReply(){
      if(!replyingId) return;
      const role = (getAuth().role || "").toLowerCase();
      if(role !== "admin"){
        toast("warning","Reply", t("admin_only_reply"));
        return;
      }

      const task = tasks.find(x=>x.id===replyingId);
      if(!task) return;

      const msg = document.getElementById("replyInput").value.trim();
      const files = await collectFiles(document.getElementById("replyFiles"));

      if(!msg && files.length===0){
        toast("warning","Reply", t("msg_req"));
        return;
      }

      task.replies = task.replies || [];
      task.replies.push({
        who: getAuth().user || "admin",
        time: Date.now(),
        msg,
        files
      });

      save();
      renderReplies(task);
      renderAll();
      toast("success", t("toast_reply"), task.title || "");

      pushNotif(t("toast_reply"), task.title || "", task.id, "toast_reply");
      addActivity("task", t("act_reply"), {taskId: task.id, title: task.title});
      notifyBrowser(t("act_reply"), task.title || "Task");

      document.getElementById("replyInput").value = "";
      document.getElementById("replyFiles").value = "";
    }

    /* =========================================================
       Attachment Viewer / Print / Download
       ========================================================= */
    const attachmentModal = document.getElementById("attachmentModal");
    const attachBody = document.getElementById("attachBody");
    const attachTitle = document.getElementById("attachTitle");
    const attachDownload = document.getElementById("attachDownload");
    const attachPrint = document.getElementById("attachPrint");

    let currentAttach = null; // {dataUrl,type,name}

    function findAttachment(taskId, replyIdx, fileIdx){
      const task = tasks.find(x=>x.id===taskId);
      if(!task) return null;

      let f = null;
      if(replyIdx === -1){
        f = (task.attachments||[])[fileIdx];
      } else {
        const rep = (task.replies||[])[replyIdx];
        if(!rep) return null;
        f = (rep.files||[])[fileIdx];
      }

      if(!f || !f.dataUrl) return null;
      return f;
    }

    window.openAttachment = function(taskId, replyIdx, fileIdx){
      const f = findAttachment(taskId, replyIdx, fileIdx);
      if(!f){
        toast("warning","Preview", t("no_preview_data"));
        return;
      }
      currentAttach = { dataUrl: f.dataUrl, type: f.type||"", name: f.name||"file" };
      openViewer();
    }

    window.downloadAttachment = function(taskId, replyIdx, fileIdx){
      const f = findAttachment(taskId, replyIdx, fileIdx);
      if(!f){
        toast("warning","Download", t("no_download_data"));
        return;
      }
      downloadDataUrl(f.dataUrl, f.name || "file");
    }

    window.printAttachment = function(taskId, replyIdx, fileIdx){
      const f = findAttachment(taskId, replyIdx, fileIdx);
      if(!f){
        toast("warning","Print", t("no_print_data"));
        return;
      }
      printDataUrl(f.dataUrl, f.type || "", f.name || "file");
    }

    function openViewer(){
      attachTitle.textContent = currentAttach ? currentAttach.name : t("preview");
      attachBody.innerHTML = "";

      if(!currentAttach) return;

      if(String(currentAttach.type).startsWith("image/")){
        attachBody.innerHTML = `<img class="viewer-img" src="${currentAttach.dataUrl}" alt="${escapeHtml(currentAttach.name)}" />`;
      } else if(String(currentAttach.type) === "application/pdf"){
        attachBody.innerHTML = `<iframe class="viewer-frame" src="${currentAttach.dataUrl}"></iframe>`;
      } else {
        attachBody.innerHTML = `<div style="color:var(--muted);font-weight:900">${t("no_inline_viewer")}</div>`;
      }

      attachmentModal.style.display = "flex";
    }

    function closeViewer(){
      attachmentModal.style.display = "none";
      currentAttach = null;
      attachBody.innerHTML = "";
    }

    function downloadDataUrl(dataUrl, filename){
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    function printDataUrl(dataUrl, mime, filename){
      const w = window.open("", "_blank");
      if(!w){ toast("warning","Print","Popup blocked"); return; }

      const isImg = String(mime).startsWith("image/");
      const isPdf = String(mime) === "application/pdf";

      w.document.open();
      w.document.write(`
        <!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(filename)}</title></head>
        <body style="margin:0;background:#111">
          ${isImg ? `<img src="${dataUrl}" style="max-width:100%;display:block;margin:0 auto" onload="window.print();">`
                 : isPdf ? `<iframe src="${dataUrl}" style="width:100%;height:100vh;border:0" onload="setTimeout(()=>window.print(),250)"></iframe>`
                 : `<p style="color:#fff;font-family:Arial">Unsupported print.</p>`}
        </body></html>
      `);
      w.document.close();
    }

    /* viewer buttons */
    attachDownload.addEventListener("click", ()=>{
      if(!currentAttach) return;
      downloadDataUrl(currentAttach.dataUrl, currentAttach.name);
    });
    attachPrint.addEventListener("click", ()=>{
      if(!currentAttach) return;
      printDataUrl(currentAttach.dataUrl, currentAttach.type, currentAttach.name);
    });
    document.getElementById("attachClose").addEventListener("click", closeViewer);
    attachmentModal.addEventListener("click", (e)=>{ if(e.target === attachmentModal) closeViewer(); });

    /* =========================================================
       Delete with confirmation
       ========================================================= */
    const confirmModal = document.getElementById("confirmModal");

    function askDelete(id){
      deletingId = id;
      confirmModal.style.display = "flex";
    }
    function closeConfirm(){
      confirmModal.style.display = "none";
      deletingId = null;
    }
    function doDelete(){
      if(!deletingId) return;
      const task = tasks.find(x=>x.id===deletingId);
      tasks = tasks.filter(x=>x.id!==deletingId);
      save();
      renderAll();
      toast("success", t("toast_deleted"), task ? (task.title||"") : "");

      pushNotif(t("toast_deleted"), task ? (task.title||"") : "", null, "toast_deleted");
      addActivity("task", t("act_delete"), {title: task ? task.title : ""});
      notifyBrowser(t("act_delete"), task ? (task.title||"") : "Task");

      closeConfirm();
    }

    /* =========================================================
       Toast helper
       ========================================================= */
    function toast(type, title, msg, duration=2800){
      const root = document.getElementById("toastRoot");
      const tEl = document.createElement("div");
      tEl.className = "toast " + (type || "success");
      const icon = type === "error" ? "!" : type === "warning" ? "⚠" : "✓";
      tEl.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-body">
          <p class="toast-title">${escapeHtml(title||"")}</p>
          <p class="toast-msg">${escapeHtml(msg||"")}</p>
        </div>
        <div class="toast-bar"><span style="animation-duration:${duration}ms"></span></div>
      `;
      root.appendChild(tEl);

      setTimeout(()=>{
        tEl.classList.add("closing");
        setTimeout(()=> tEl.remove(), 260);
      }, duration);
    }

    /* =========================================================
       Layout height for scroll columns
       ========================================================= */
    function updateTopAreaHeight(){
      const topNav = document.querySelector(".top-nav");
      const header = document.getElementById("topHeader");
      const sum = document.getElementById("summaryStrip");
      const navH = topNav ? topNav.getBoundingClientRect().height : 0;
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const sumH = sum ? sum.getBoundingClientRect().height : 0;
      const extra = 80;
      const total = Math.round(navH + headerH + sumH + extra);
      document.documentElement.style.setProperty("--top-area-h", total + "px");
    }

    /* =========================================================
       Wire events
       ========================================================= */
    function bind(id, event, fn){
      const el = document.getElementById(id);
      if(el) el.addEventListener(event, fn);
    }

    function wire(){
      bind("btnAdd", "click", openAdd);

      bind("taskModalClose", "click", closeTaskModal);
      bind("btnCancelTask", "click", closeTaskModal);
      bind("btnSaveTask", "click", saveTaskFromForm);
      taskModal.addEventListener("click", (e)=>{ if(e.target === taskModal) closeTaskModal(); });

      bind("replyClose", "click", closeReplies);
      bind("replySend", "click", sendReply);
      replyModal.addEventListener("click", (e)=>{ if(e.target === replyModal) closeReplies(); });

      bind("confirmClose", "click", closeConfirm);
      bind("confirmNo", "click", closeConfirm);
      bind("confirmYes", "click", doDelete);
      confirmModal.addEventListener("click", (e)=>{ if(e.target === confirmModal) closeConfirm(); });

      bind("btnLang", "click", ()=>{
        const lang = getLang();
        setLang(lang === "ar" ? "en" : "ar");
      });

      // Bell: ensure permission + toggle panel
      bind("btnBell", "click", async (e)=>{
        e.stopPropagation();
        await ensureNotificationPermission();
        toggleNotifPanel();
      });

      bind("btnMarkAllRead", "click", ()=>{
        const arr = loadNotifs();
        arr.forEach(n=> n.read = true);
        saveNotifs(arr);
        refreshNotifUI();
      });
      bind("btnClearNotifs", "click", ()=>{
        saveNotifs([]);
        refreshNotifUI();
      });

      // close notif panel on outside click
      document.addEventListener("click", (e)=>{
        const panel = document.getElementById("notifPanel");
        const btn = document.getElementById("btnBell");
        if(panel.classList.contains("open")){
          if(!panel.contains(e.target) && !btn.contains(e.target)){
            closeNotifPanel();
          }
        }
      });



      window.addEventListener("resize", ()=> updateTopAreaHeight());
      window.addEventListener("load", ()=> updateTopAreaHeight());

      // Assignee Search
      const searchInput = document.getElementById("fAssigneeSearch");
      if(searchInput){
        searchInput.addEventListener("input", (e)=>{
          const txt = e.target.value.toLowerCase();
          const all = window.allAssigneeOptions || [];
          const filtered = all.filter(o => o.label.toLowerCase().includes(txt) || String(o.value).toLowerCase().includes(txt));
          renderAssigneeOptions(filtered);
        });
      }
    }

    /* =========================================================
       Fun Features: Motivation + Pulse
       ========================================================= */
    function startBellPulse(){
      const ico = document.querySelector(".bell-ico");
      if(ico) ico.classList.add("pulse");
    }

    function initMotivation(){
      const box = document.getElementById("motivationBox");
      if(!box) return;

      let phrases = [];
      try {
        const raw = localStorage.getItem("db:quotes");
        if(raw) phrases = JSON.parse(raw);
      } catch(e){}

      if(!Array.isArray(phrases) || phrases.length === 0){
        phrases = [
          {ar: "✨ النجاح يصنعه العظماء", en: "✨ Success is made by the great"},
          {ar: "🚀 كل مهمة تنجزها تقربنا من الهدف", en: "🚀 Every task brings us closer"},
          {ar: "💡 إبداعك يصنع الفرق", en: "💡 Your creativity makes the difference"},
          {ar: "🤝 فريق واحد .. هدف واحد", en: "🤝 One Team .. One Goal"},
          {ar: "⭐ استمر في التميز", en: "⭐ Keep Excelling"},
          {ar: "🔥 لا تؤجل عمل اليوم إلى الغد", en: "🔥 Do not delay today's work"},
          {ar: "🌟 أنت جزء مهم من نجاح العليان", en: "🌟 You are vital to Olayan's success"}
        ];
      }

      let idx = 0;
      function showNext(){
        const lang = getLang(); // ar or en
        const p = phrases[idx];
        const text = lang === "ar" ? p.ar : p.en;
        
        // Reset animation
        box.innerHTML = "";
        void box.offsetWidth; // trigger reflow
        
        const span = document.createElement("div");
        span.className = "motivation-text";
        span.textContent = text;
        box.appendChild(span);

        idx = (idx + 1) % phrases.length;
      }

      showNext();
      setInterval(showNext, 8000); // Change every 8s
    }

    /* =========================================================
       Init  (NO DUPLICATION - FIXED)
       ========================================================= */
    (function init(){
      const savedLang = getLang();
      if(savedLang === "en"){
        document.body.setAttribute("dir","ltr");
        document.documentElement.lang = "en";
      }else{
        document.body.setAttribute("dir","rtl");
        document.documentElement.lang = "ar";
      }
      applyTranslations();
      updateLangButton();

      load();
      wire();
      renderAll();
      refreshNotifUI();

      // Sync when tasks updated from another page/tab (e.g., admin panel)
      window.addEventListener("storage", (e)=>{
        if(e.key === STORAGE_KEY){
          load();
          renderAll();
          refreshNotifUI();
        }
      });
      
      // Fun features
      startBellPulse();
      initMotivation();

      addActivity("open", t("act_open"), {page:"tasks"});

      // tiny storage test
      const ok = setStored("__ofs_test","1");
      if(ok) localStorage.removeItem("__ofs_test");
      else toast("warning","Storage", t("storage_blocked"));

      // Fetch latest from server
      fetchTasks();
    })();
  </script>
</body>
</html>
