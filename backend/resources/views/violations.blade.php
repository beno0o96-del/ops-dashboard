@extends('layouts.app')

@section('title', 'Violations')

@section('content')
<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row justify-between items-center gap-4">
     <div>
       <h1 class="text-2xl font-bold text-white mb-1" data-en="Violations Dashboard" data-ar="لوحة المخالفات">Violations Dashboard</h1>
       <p class="text-slate-400 text-sm" data-en="Monitor and manage operational violations" data-ar="مراقبة وإدارة المخالفات التشغيلية">Monitor and manage operational violations</p>
     </div>
     <div class="flex gap-2">
       <button class="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition" onclick="openAddViolationModal()">
         <span>+</span>
         <span data-en="Add Violation" data-ar="إضافة مخالفة">Add Violation</span>
       </button>
     </div>
  </div>

  <!-- KPIs -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
     <!-- Card 1: Completed -->
     <div class="kpi-card p-4 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-sm">
        <div class="text-sm text-slate-400 mb-1" data-en="Completed (Paid)" data-ar="مكتملة (مدفوعة)">Completed (Paid)</div>
        <div class="text-3xl font-bold text-green-400" id="vio-kpi-completed">0</div>
     </div>
     <!-- Card 2: Pending -->
     <div class="kpi-card p-4 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-sm">
        <div class="text-sm text-slate-400 mb-1" data-en="Pending Payment" data-ar="بانتظار السداد">Pending Payment</div>
        <div class="text-3xl font-bold text-yellow-400" id="vio-kpi-pending">0</div>
     </div>
     <!-- Card 3: In Progress -->
     <div class="kpi-card p-4 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-sm">
        <div class="text-sm text-slate-400 mb-1" data-en="In Progress" data-ar="جاري العمل">In Progress</div>
        <div class="text-3xl font-bold text-blue-400" id="vio-kpi-inprogress">0</div>
     </div>
  </div>

  <!-- Charts -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
     <div class="bg-slate-800/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <h3 class="text-lg font-semibold mb-4 text-white border-b border-white/5 pb-2" data-en="Frequency" data-ar="التكرار">Frequency</h3>
        <div id="chart-freq" class="w-full h-64"></div>
     </div>
     <div class="bg-slate-800/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <h3 class="text-lg font-semibold mb-4 text-white border-b border-white/5 pb-2" data-en="By Region" data-ar="حسب المنطقة">By Region</h3>
        <div id="chart-region" class="w-full h-64"></div>
     </div>
     <div class="bg-slate-800/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <h3 class="text-lg font-semibold mb-4 text-white border-b border-white/5 pb-2" data-en="Risk Analysis (Amounts)" data-ar="تحليل المخاطر (المبالغ)">Risk Analysis (Amounts)</h3>
        <div id="chart-risk" class="w-full h-64"></div>
     </div>
  </div>

  <!-- Types List & Table -->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
     <!-- Types List -->
     <div class="lg:col-span-1 bg-slate-800/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm h-fit">
        <h3 class="text-lg font-semibold mb-4 text-white border-b border-white/5 pb-2" data-en="Violation Types" data-ar="أنواع المخالفات">Violation Types</h3>
        <div id="list-types" class="space-y-2 text-sm"></div>
     </div>
     
     <!-- Main Table -->
     <div class="lg:col-span-3 bg-slate-800/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <h3 class="text-lg font-semibold mb-4 text-white border-b border-white/5 pb-2" data-en="Violations Log" data-ar="سجل المخالفات">Violations Log</h3>
        <div class="overflow-x-auto">
           <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-700/50 text-slate-200 uppercase text-xs">
                 <tr>
                    <th class="px-4 py-3 rounded-tl-lg" data-en="ID" data-ar="الرقم">ID</th>
                    <th class="px-4 py-3" data-en="Date" data-ar="التاريخ">Date</th>
                    <th class="px-4 py-3" data-en="Branch" data-ar="الفرع">Branch</th>
                    <th class="px-4 py-3" data-en="Type" data-ar="النوع">Type</th>
                    <th class="px-4 py-3" data-en="Amount" data-ar="المبلغ">Amount</th>
                    <th class="px-4 py-3" data-en="Status" data-ar="الحالة">Status</th>
                    <th class="px-4 py-3 rounded-tr-lg" data-en="Actions" data-ar="إجراءات">Actions</th>
                 </tr>
              </thead>
              <tbody id="violations-table-body" class="divide-y divide-white/5">
                 <!-- Rows will be injected via JS -->
                 <tr><td colspan="7" class="text-center py-8 text-slate-500">Loading...</td></tr>
              </tbody>
           </table>
        </div>
     </div>
  </div>
</div>

<!-- Add Modal (Simple placeholder for now) -->
<div id="violation-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center">
  <div class="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
    <h2 class="text-xl font-bold text-white mb-4" data-en="Add Violation" data-ar="إضافة مخالفة">Add Violation</h2>
    <form id="violation-form" class="space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-1" data-en="Branch" data-ar="الفرع">Branch</label>
        <input type="text" name="branch" class="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" required>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-slate-400 mb-1" data-en="Type" data-ar="النوع">Type</label>
          <input type="text" name="type" class="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" required>
        </div>
        <div>
           <label class="block text-sm text-slate-400 mb-1" data-en="Amount" data-ar="المبلغ">Amount</label>
           <input type="number" name="amount" class="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" required>
        </div>
      </div>
      <div>
         <label class="block text-sm text-slate-400 mb-1" data-en="Date" data-ar="التاريخ">Date</label>
         <input type="date" name="date" class="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" required>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button type="button" class="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-white/5" onclick="closeAddViolationModal()" data-en="Cancel" data-ar="إلغاء">Cancel</button>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white" data-en="Save" data-ar="حفظ">Save</button>
      </div>
    </form>
  </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
  // Add global functions for the view
  window.openAddViolationModal = function() {
    document.getElementById('violation-modal').classList.remove('hidden');
  };
  window.closeAddViolationModal = function() {
    document.getElementById('violation-modal').classList.add('hidden');
  };

  document.addEventListener('DOMContentLoaded', function() {
    // Render charts from app.js logic
    if (typeof renderViolationsCharts === 'function') {
       renderViolationsCharts();
    }
    
    // Render Table
    renderViolationsTable();

    // Bind Form
    const form = document.getElementById('violation-form');
    if(form) {
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());
        data.id = Date.now().toString(36);
        data.paid = false;
        data.status = 'open';
        
        // Save using Store
        if(window.Store) {
          Store.create('violations', data);
          closeAddViolationModal();
          renderViolationsTable();
          if (typeof renderViolationsCharts === 'function') renderViolationsCharts();
        }
      });
    }
  });

  function renderViolationsTable() {
     const tbody = document.getElementById('violations-table-body');
     if (!tbody) return;
     
     const rows = (window.Store && Store.list('violations')) || [];
     if (!rows || !rows.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-slate-500" data-en="No records found" data-ar="لا توجد سجلات">No records found</td></tr>';
        return;
     }
     
     // Sort by date desc
     rows.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0));

     tbody.innerHTML = rows.map(r => `
        <tr class="border-b border-white/5 hover:bg-white/5 transition group">
           <td class="px-4 py-3 font-mono text-xs text-slate-500 group-hover:text-slate-300">${r.id ? r.id.substring(0,8) : '-'}</td>
           <td class="px-4 py-3">${r.date || '-'}</td>
           <td class="px-4 py-3 font-medium text-white">${r.branch || '-'}</td>
           <td class="px-4 py-3 text-blue-300">${r.type || '-'}</td>
           <td class="px-4 py-3 font-bold text-red-400">${r.amount ? Number(r.amount).toLocaleString() : '0'}</td>
           <td class="px-4 py-3">
              <span class="px-2 py-1 rounded text-xs font-bold ${r.paid ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}">
                 ${r.paid ? (document.documentElement.lang=='ar'?'مدفوع':'Paid') : (document.documentElement.lang=='ar'?'معلق':'Pending')}
              </span>
           </td>
           <td class="px-4 py-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="p-1 hover:bg-white/10 rounded text-blue-400" onclick="alert('Edit ' + '${r.id}')">✏️</button>
              <button class="p-1 hover:bg-white/10 rounded text-red-400" onclick="if(confirm('Delete?')) { Store.remove('violations', '${r.id}'); renderViolationsTable(); renderViolationsCharts(); }">🗑️</button>
           </td>
        </tr>
     `).join('');
  }
</script>
@endpush
