/**
 * ================================================================================
 * API-Based Data Rendering Functions
 * ================================================================================
 * دوال عرض البيانات المحدثة للعمل مع API بدلاً من localStorage
 * ================================================================================
 */

if (typeof window.getBrandLogo !== 'function') {
  window.getBrandLogo = function(brand) {
    try {
      const b = String(brand || '').toLowerCase().trim();
      if (b === 'bk' || b.includes('burger') || b.includes('bk')) return 'logos/bk.png';
      if (b === 'tc' || b.includes('texas') || b.includes('tc')) return 'logos/texas.png';
      if (b === 'bww' || b.includes('buffalo') || b.includes('bww')) return 'logos/bww.png';
      return 'logos/CompliQ1.png';
    } catch(_) {
      return 'logos/CompliQ1.png';
    }
  };
}

/**
 * تحديث جدول المخالفات عبر API
 */
window.renderViolationsTableAPI = async function() {
  try {
    let tbody = document.getElementById('violations-table-body') || 
                document.getElementById('vio-table') ||
                document.querySelector('#violations-section tbody');
    
    if (!tbody) {
      console.warn('Could not find violations table element');
      return;
    }

    const violations = await fetchDataFromAPI('violations');
    
    if (!Array.isArray(violations)) {
      tbody.innerHTML = '<tr><td colspan="16" class="text-center text-gray-500">لا توجد بيانات</td></tr>';
      return;
    }

    window.violationsCache = violations;

    // مزامنة بيانات المخالفات إلى المخزن المحلي ليستفيد منها عرض الكروت والرسوم
    try {
      if (window.App && App.store) {
        if (typeof App.store.set === 'function') {
          App.store.set('violations', violations);
        } else if (typeof App.store.importJSON === 'function') {
          App.store.importJSON('violations', JSON.stringify(violations));
        }
      }
    } catch(_) {}
    
    // Update KPIs
    if (typeof updateViolationsKPIs === 'function') {
      updateViolationsKPIs(violations);
    }

    const lang = (document.documentElement.lang === 'en' || String(localStorage.getItem('lang') || '').toLowerCase() === 'en') ? 'en' : 'ar';
    const txRegion = function(region) {
      if (lang === 'en') {
        switch(region) {
          case 'الشرقية': return 'Eastern';
          case 'الغربية': return 'Western';
          case 'الوسطى': return 'Central';
          case 'الشمالية': return 'Northern';
          case 'الجنوبية': return 'Southern';
          default: return region;
        }
      }
      return region;
    };
    const txAppealStatus = function(status) {
      const s = String(status || '').toLowerCase();
      if (lang === 'en') {
        if (s === 'under_study') return 'Under Study';
        if (s === 'accepted') return 'Accepted';
        if (s === 'rejected') return 'Rejected';
        if (s === 'not_applicable') return 'Not Applicable';
        if (s === 'cancelled') return 'Cancelled';
        if (s === 'no_appeal') return 'No Appeal';
        return status || '-';
      }
      if (s === 'under_study') return 'تحت الدراسة';
      if (s === 'accepted') return 'قبول الاعتراض';
      if (s === 'rejected') return 'رفض الاعتراض';
      if (s === 'not_applicable') return 'لا يمكن الاعتراض';
      if (s === 'cancelled') return 'إلغاء المخالفة';
      if (s === 'no_appeal') return 'لا يوجد اعتراض';
      return status || '-';
    };

    tbody.innerHTML = '';
    violations.forEach(function(v) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', v.id);
      
      const statusInfo = (() => {
        try {
          const ps = String(v.paid_status || '').toLowerCase();
          const as = String(v.appeal_status || '').toLowerCase();
          const paidRaw = String(v.paid || '').toLowerCase();
          const paidFlag = (ps === 'paid' || (paidRaw === 'true' && ps !== 'false' && ps !== 'cancelled'));

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
      const statusBadge = `<span style="font-size:10px;padding:2px 6px;border-radius:999px;${statusInfo.style}">${statusInfo.text}</span>`;

      const amtNum = Number(v.amount) || 0;
      const amtTxt = amtNum.toLocaleString();
      const dateTxt = v.date || '-';

      tr.innerHTML = `
        <td class="text-center"><input type="checkbox" class="vio-select" data-id="${v.id}"></td>
        <td class="px-2 py-2 text-sm">${v.branch || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.cost_center || v.costCenter || '-'}</td>
        <td class="px-2 py-2 text-sm">${txRegion(v.region) || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.vio_no || v.violation_no || v.id || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.efaa_no || v.efaaNo || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.payment_no || v.paymentNo || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.type || '-'}</td>
        <td class="px-2 py-2 text-sm font-mono text-right">${amtTxt}</td>
        <td class="px-2 py-2 text-sm">${dateTxt}</td>
        <td class="px-2 py-2 text-sm">${txAppealStatus(v.appeal_status)}</td>
        <td class="px-2 py-2 text-sm">${v.appeal_date || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.appeal_number || '-'}</td>
        <td class="px-2 py-2 text-sm">${v.finance_date || '-'}</td>
        <td class="px-2 py-2 text-sm text-center">${statusBadge}</td>
        <td class="px-2 py-2 text-sm vio-actions" style="white-space:nowrap">
          <div style="display:flex;gap:6px;align-items:center;justify-content:center">
            <button onclick="try{ showViolationAttachments('${v.id}'); }catch(e){}" title="المرفقات" style="width:28px;height:28px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;position:relative;display:flex;align-items:center;justify-content:center">
              <span style="pointer-events:none">&#x1F4CE;</span>
              ${
                ((window.getViolationAttachmentCount && getViolationAttachmentCount(v.id)) || 0) > 0
                ? `<span class="vio-att-count" data-id="${v.id}" style="position:absolute;top:-6px;right:-6px;background:#1d4ed8;color:#fff;border-radius:999px;min-width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;font-size:10px;line-height:16px">${(window.getViolationAttachmentCount && getViolationAttachmentCount(v.id)) || 0}</span>`
                : ''
              }
            </button>
            <button onclick="try{ editViolation('${v.id}'); }catch(e){}" title="تعديل" style="width:28px;height:28px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;display:flex;align-items:center;justify-content:center">
              <span style="pointer-events:none">&#x270F;&#xFE0F;</span>
            </button>
            <button onclick="try{ deleteViolationRecord('${v.id}'); }catch(e){}" title="حذف" style="width:28px;height:28px;border-radius:999px;background:#7f1d1d;border:1px solid #7f1d1d;color:#fff;display:flex;align-items:center;justify-content:center">
              <span style="pointer-events:none">&#x1F5D1;&#xFE0F;</span>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    // تحديث كروت المخالفات لتطابق الجدول
    try { if (typeof window.renderViolationsCards === 'function') window.renderViolationsCards(); } catch(_){}
    console.log('✓ Violations table/cards updated with', violations.length, 'records');
  } catch (error) {
    console.error('Error rendering violations table:', error);
  }
};

/**
 * تحديث جدول الفروع عبر API
 */
window.renderBranchesTableAPI = async function() {
  try {
    const tbody = document.getElementById('branches-table-body');
    if (!tbody) return;
    const lang = (document.documentElement.lang === 'en' || String(localStorage.getItem('lang') || '').toLowerCase() === 'en') ? 'en' : 'ar';
    const tx = function(ar, en) { return lang === 'en' ? en : ar; };
    const txRegion = function(region) {
      if (lang === 'en') {
        switch(region) {
          case 'الشرقية': return 'Eastern';
          case 'الغربية': return 'Western';
          case 'الوسطى': return 'Central';
          case 'الشمالية': return 'Northern';
          case 'الجنوبية': return 'Southern';
          default: return region;
        }
      }
      return region;
    };

    // جلب البيانات من API
    let branches = await fetchDataFromAPI('branches');
    
    if (!Array.isArray(branches)) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">' + tx('لا توجد بيانات', 'No data available') + '</td></tr>';
      return;
    }
    
    try {
      window.__branchesAll = branches;
    } catch(_) {}
    try {
      if (window.App && App.store && typeof App.store.set === 'function') {
        App.store.set('branches', branches);
      }
    } catch(_) {}
    
    try {
      const rf = document.getElementById('br-region-filter');
      if (rf) {
        const curr = String(rf.value || 'all');
        const uniq = {};
        branches.forEach(function(b){
          const r = String((b && b.region) || '').trim();
          if (r) uniq[r] = true;
        });
        const regions = Object.keys(uniq).sort(function(a,b){ return a.localeCompare(b, 'ar'); });
        rf.innerHTML = '<option value="all">' + tx('كل المناطق', 'All Regions') + '</option>' + regions.map(function(r){ return '<option value="'+ r +'">'+ txRegion(r) +'</option>'; }).join('');
        if (curr && (curr === 'all' || uniq[curr])) rf.value = curr;
      }
    } catch(_) {}
    
    branches = branches.slice();

    // =========================================================
    // Apply Filters (Fix for "div اغلبها لاتعمل")
    // =========================================================
    try {
      // 1. Search Query
      const searchInput = document.getElementById('br-search');
      const searchQuery = searchInput ? String(searchInput.value || '').toLowerCase().trim() : '';

      // 2. Region Filter
      const regionSelect = document.getElementById('br-region-filter');
      const regionFilter = regionSelect ? regionSelect.value : 'all';

      // 3. Type Filter
      const typeSelect = document.getElementById('br-type-filter');
      const typeFilter = typeSelect ? typeSelect.value : 'all';

      // 4. Show Hidden
      const showHiddenInput = document.getElementById('br-show-hidden');
      const showHidden = showHiddenInput ? showHiddenInput.checked : false;

      // 5. Only Pinned
      const onlyPinnedInput = document.getElementById('br-only-pinned');
      const onlyPinned = onlyPinnedInput ? onlyPinnedInput.checked : false;
      
      try {
        const filterKey = [
          searchQuery,
          regionFilter,
          typeFilter,
          showHidden ? '1' : '0',
          onlyPinned ? '1' : '0'
        ].join('|');
        if (window.__branchesFilterKey !== filterKey) {
          window.__branchesFilterKey = filterKey;
          window.__branchesPage = 1;
        }
      } catch(_) {}

      // RBAC (Role Based Access Control)
      if (window.App && App.currentUser) {
        const cu = App.currentUser();
        const role = (cu.role || '').toLowerCase();
        const allowed = (Array.isArray(cu.branches) ? cu.branches : []).map(String);
        
        if (role && role !== 'admin') {
          branches = branches.filter(function(b){
            const bid = String(b.id || b.branch_id || b.code || '').trim();
            const bnm = String(b.name || b.branch_name || '').trim();
            return allowed.includes('*') || allowed.includes(bid) || allowed.includes(bnm);
          });
        }
      }

      // Apply Filters
      branches = branches.filter(function(b) {
        // Show Hidden Logic
        if (!showHidden && b.hidden === true) return false;

        // Only Pinned Logic
        if (onlyPinned && !b.pinned) return false;

        // Type Filter Logic
        if (typeFilter !== 'all') {
          const t = String(b.type || 'basic').toLowerCase();
          const isClosed = b.closed || t === 'closed';
          const isOpening = t === 'opening';
          
          if (typeFilter === 'closed' && !isClosed) return false;
          if (typeFilter === 'opening' && !isOpening) return false;
          if (typeFilter === 'basic' && (isClosed || isOpening)) return false;
        }

        // Region Filter Logic
        if (regionFilter !== 'all') {
          const r = String(b.region || '').trim();
          if (r !== regionFilter) return false;
        }

        // Search Query Logic
        if (searchQuery) {
          const hay = ((b.name||'') + ' ' + (b.brand||'') + ' ' + (b.city||'') + ' ' + (b.region||'') + ' ' + (b.notes||'') + ' ' + (b.cost_center||'') + ' ' + (b.email||'')).toLowerCase();
          if (hay.indexOf(searchQuery) < 0) return false;
        }

        return true;
      });

      // Sort: Pinned first, then by name
      branches.sort(function(a,b){ 
        var pa = a && a.pinned===true ? 1 : 0; 
        var pb = b && b.pinned===true ? 1 : 0; 
        if (pb !== pa) return pb - pa; 
        return String(a && a.name || '').localeCompare(String(b && b.name || ''), 'ar'); 
      });

    } catch (err) {
      console.error('Error applying filters:', err);
    }
    // =========================================================

    const pageSizeEl = document.getElementById('br-page-size');
    const sizeVal = (pageSizeEl && pageSizeEl.value) ? String(pageSizeEl.value) : '20';
    const pageSize = sizeVal === 'all' ? Infinity : (parseInt(sizeVal, 10) || 20);
    const totalFiltered = branches.length;
    const pages = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(totalFiltered / pageSize));
    let page = window.__branchesPage || 1;
    page = Math.max(1, Math.min(pages, page));
    window.__branchesPage = page;
    const startIdx = pageSize === Infinity ? 0 : ((page - 1) * pageSize);
    const branchesPage = pageSize === Infinity ? branches : branches.slice(startIdx, startIdx + pageSize);
    
    try {
      const pageInfoEl = document.getElementById('br-page-info');
      if (pageInfoEl) pageInfoEl.textContent = tx('صفحة ', 'Page ') + page + '/' + pages;
      const totalEl = document.getElementById('br-count-total');
      if (totalEl) totalEl.textContent = tx('الإجمالي: ', 'Total: ') + totalFiltered;
    } catch(_) {}

    if (totalFiltered === 0) {
      tbody.innerHTML = '<tr><td colspan="15" class="text-center text-gray-500">' + tx('لا توجد بيانات مطابقة للبحث', 'No records match your search') + '</td></tr>';
      // Still update stats even if empty
      try {
        const statsEl = document.getElementById('branches-stats');
        if (statsEl) statsEl.innerHTML = '<span style="font-size:11px;padding:4px 10px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;display:inline-flex;align-items:center;gap:6px">' + tx('الإجمالي: 0', 'Total: 0') + '</span>';
      } catch(_){}
      return;
    }
    
    if (branchesPage.length === 0) {
      tbody.innerHTML = '<tr><td colspan="15" class="text-center text-gray-500">' + tx('لا توجد بيانات في هذه الصفحة', 'No data on this page') + '</td></tr>';
      return;
    }

    // بناء الجدول
    tbody.innerHTML = '';
    branchesPage.forEach(function(b) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', b.id);
      
      const type = String(b.type || '').toLowerCase();
      const isClosed = b.closed || type === 'closed';
      const isOpening = type === 'opening';
      
      let statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#065f46;color:#d1fae5">' + tx('نشط', 'Active') + '</span>';
      if (isClosed) {
        statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#7f1d1d;color:#fecaca">' + tx('مغلق', 'Closed') + '</span>';
      } else if (isOpening) {
        statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1e293b;color:#93c5fd">' + tx('افتتاح', 'Opening') + '</span>';
      }
      const brandBadge = (b.brand || b.type)
        ? `<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1f2a44;color:#cbd5e1">${b.brand || b.type}</span>`
        : '-';
      const emailCell = (b.email)
        ? `<span title="${b.email}" style="max-width:160px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle">${b.email}</span>`
        : '-';

      const dd = function(s){
        if(!s) return null;
        try {
          const d = new Date(s);
          if (isNaN(d.getTime())) return null;
          const today = new Date(); today.setHours(0,0,0,0);
          const days = Math.round((d - today)/86400000);
          return days;
        } catch(_) { return null; }
      };
      const chip = function(t, dateStr){
        const days = dd(dateStr);
        let st = 'background:#334155;color:#cbd5e1';
        let ic = '•';
        let iconHtml = '';
        if (dateStr) {
          if (days == null) { st = 'background:#334155;color:#cbd5e1'; ic = '&#x1F4C4;'; iconHtml = '<span style="margin-right:4px">&#x1F4C4;</span>'; }
          else if (days <= 0) { st = 'background:#7f1d1d;color:#fecaca'; ic = '&#x26D4;'; iconHtml = '<span style="margin-right:4px">&#x26D4;</span>'; }
          else if (days <= 30) { st = 'background:#78350f;color:#fde68a'; ic = '&#x23F3;'; iconHtml = '<span style="margin-right:4px">&#x23F3;</span>'; }
          else { st = 'background:#065f46;color:#d1fae5'; ic = '&#x2705;'; iconHtml = '<span style="margin-right:4px">&#x2705;</span>'; }
        }
        const txt = days==null || !dateStr ? (iconHtml + t) : (iconHtml + t + ' ' + '(' + days + ')');
        return `<span style="font-size:10px;padding:2px 6px;border-radius:999px;${st};display:inline-flex;align-items:center">${txt}</span>`;
      };
      const licChips = [];
      let catCounts = {};
      try { var rawMapA = localStorage.getItem('db:branch_attachments'); var mapA = rawMapA ? JSON.parse(rawMapA) : {}; var arrA = mapA[b.id] || []; arrA.forEach(function(x){ var c=x.category||'other'; catCounts[c]=(catCounts[c]||0)+1; }); } catch(_){}
      const suf = function(cat){ var n = catCounts[cat]||0; return n>0 ? (' <span style="margin-right:2px">&#x1F4CE;</span>'+n) : ''; };
      if (b.store_license || b.store_license_expiry) licChips.push(chip(tx('بلدية','Municipality')+suf('store_license'), b.store_license_expiry));
      if (b.civil_defense || b.civil_defense_expiry) licChips.push(chip(tx('مدني','Civil Defense')+suf('civil_defense'), b.civil_defense_expiry));
      if (b.permit_24h || b.permit_24h_expiry) licChips.push(chip(tx('24س','24H')+suf('permit_24h'), b.permit_24h_expiry));
      if (b.delivery_permit || b.delivery_permit_expiry) licChips.push(chip(tx('توصيل','Delivery')+suf('delivery_permit'), b.delivery_permit_expiry));
      if (b.outdoor_permit || b.outdoor_permit_expiry) licChips.push(chip(tx('خارجية','Outdoor')+suf('outdoor_permit'), b.outdoor_permit_expiry));
      const adCount = Array.isArray(b.ad_permits) ? b.ad_permits.length : 0;
      if (adCount > 0) licChips.push(`<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1d4ed8;color:#fff">${tx('إعلانات', 'Ads')} ${adCount}</span>`);
      const licCell = licChips.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">${licChips.join('')}</div>` : '-';
      const conChips = [];
      if (b.clean_contract_no || b.clean_contract_expiry) conChips.push(chip(tx('نظافة','Cleaning')+suf('clean_contract'), b.clean_contract_expiry));
      if (b.lease_contract_no || b.lease_contract_expiry) conChips.push(chip(tx('إيجار','Lease')+suf('lease_contract'), b.lease_contract_expiry));
      const conCell = conChips.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">${conChips.join('')}</div>` : '-';
      let attCount = 0;
      if (b.store_license) attCount++;
      if (b.civil_defense) attCount++;
      if (b.permit_24h) attCount++;
      if (b.delivery_permit) attCount++;
      if (b.outdoor_permit) attCount++;
      if (adCount) attCount += adCount;
      if (b.electric_meter_no) attCount++;
      if (b.water_meter_no) attCount++;
      if (b.clean_contract_no) attCount++;
      if (b.lease_contract_no) attCount++;
      try { var raw = localStorage.getItem('db:branch_attachments'); var map = raw ? JSON.parse(raw) : {}; var extra = map && map[b.id] ? map[b.id].length : 0; attCount += extra; } catch(_){}
      const attBtn = `
        <button onclick="try{ AttachmentHub.open({ scope: 'branch_uploads', ownerId: '${b.id}', title: '${tx('مرفقات الفرع', 'Branch Attachments')}' }); }catch(e){}" title="${tx('المرفقات', 'Attachments')}" style="width:28px;height:28px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;position:relative;display:flex;align-items:center;justify-content:center">
          <span style="pointer-events:none">📎</span>
          ${attCount>0 ? `<span style="position:absolute;top:-6px;right:-6px;background:#1d4ed8;color:#fff;border-radius:999px;min-width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;font-size:10px;line-height:16px">${attCount}</span>` : ''}
        </button>
      `;
      tr.innerHTML = `
        <td class="px-3 py-2 text-center"><input type="checkbox" class="br-select" data-id="${b.id}"></td>
        <td class="px-3 py-2 text-right text-sm">${b.name || '-'}</td>
        <td class="px-3 py-2 text-center text-sm">${b.region || '-'}</td>
        <td class="px-3 py-2 text-center text-sm">${b.city || '-'}</td>
        <td class="px-3 py-2 text-center text-sm">${statusBadge}</td>
        <td class="px-3 py-2 text-center text-sm">${brandBadge}</td>
        <td class="px-3 py-2 text-center text-sm">${b.cost_center || '-'}</td>
        <td class="px-3 py-2 text-center text-sm">${emailCell}</td>
        <td class="px-3 py-2 text-center text-sm">${b.opening_date_expected ? chip('', b.opening_date_expected) : '-'}</td>
        <td class="px-3 py-2 text-right text-sm">${b.close_date ? chip('', b.close_date) : '-'}</td>
        <td class="px-3 py-2 text-right text-sm">${b.notes || '-'}</td>
        <td class="px-3 py-2 text-center text-sm">${licCell}</td>
        <td class="px-3 py-2 text-center text-sm">${conCell}</td>
        <td class="px-3 py-2 text-center text-sm">${attBtn}</td>
        <td class="px-3 py-2 text-center text-sm">
          <div style="display:flex;gap:4px;align-items:center;justify-content:center;">
            <button type="button" data-branch-action="edit" data-branch-id="${b.id || b._id || b.branch_id || ''}" title="${tx('تعديل', 'Edit')}" style="min-width:30px;height:24px;border-radius:8px;background:rgba(30,64,175,0.22);border:1px solid rgba(96,165,250,0.45);color:#bfdbfe;display:flex;align-items:center;justify-content:center;cursor:pointer">
              <span style="pointer-events:none">✏️</span>
            </button>
            <button type="button" data-branch-action="delete" data-branch-id="${b.id || b._id || b.branch_id || ''}" title="${tx('حذف', 'Delete')}" style="min-width:30px;height:24px;border-radius:8px;background:rgba(127,29,29,0.25);border:1px solid rgba(248,113,113,0.45);color:#fecaca;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="if(!confirm('${tx('هل تريد حذف هذا الفرع؟', 'Are you sure you want to delete this branch?')}')) return false;">
              <span style="pointer-events:none">🗑️</span>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    try {
      const statsEl = document.getElementById('branches-stats');
      const cardsEl = document.getElementById('branches-cards');
      if (statsEl) {
        const total = totalFiltered;
        const active = branches.filter(function(b){ 
           const t = String(b.type||'').toLowerCase();
           return !b.closed && t !== 'closed' && t !== 'opening';
        }).length;
        const closed = branches.filter(function(b){ return !!b.closed || String(b.type||'').toLowerCase()==='closed'; }).length;
        const openings = branches.filter(function(b){ return String(b.type||'').toLowerCase()==='opening'; }).length;
        const chip = function(txt, st){ return `<span style="font-size:11px;padding:4px 10px;border-radius:999px;${st};display:inline-flex;align-items:center;gap:6px">${txt}</span>`; };
        statsEl.innerHTML = [
          chip(tx('الإجمالي: ', 'Total: ') + total, 'background:#0f172a;border:1px solid #334155;color:#e2e8f0'),
          chip(tx('نشطة: ', 'Active: ') + active, 'background:#065f46;color:#d1fae5'),
          chip(tx('مقفلة: ', 'Closed: ') + closed, 'background:#7f1d1d;color:#fecaca'),
          chip(tx('افتتاحات: ', 'Openings: ') + openings, 'background:#1e293b;color:#93c5fd')
        ].join('');
      }
      if (cardsEl) {
        const dd = function(s){
          if(!s) return null;
          try {
            const d = new Date(s);
            if (isNaN(d.getTime())) return null;
            const today = new Date(); today.setHours(0,0,0,0);
            return Math.round((d - today)/86400000);
          } catch(_){ return null; }
        };
        const chip = function(t, dateStr){
          const days = dd(dateStr);
          let st = 'background:#334155;color:#cbd5e1';
          let ic = '•';
          if (dateStr) {
            if (days == null) { st = 'background:#334155;color:#cbd5e1'; ic = '&#x1F4C4;'; }
            else if (days <= 0) { st = 'background:#dc2626;color:#fecaca'; ic = '&#x274C;'; }
            else if (days <= 30) { st = 'background:#ea580c;color:#fed7aa'; ic = '&#x23F3;'; }
            else { st = 'background:#059669;color:#d1fae5'; ic = '&#x2705;'; }
          }
          const txt = days==null || !dateStr ? (ic + ' ' + t) : (ic + ' ' + t + ' ' + '(' + days + ')');
          return `<span style="font-size:10px;padding:2px 6px;border-radius:999px;${st}">${txt}</span>`;
        };
        const h = function(v){
          try {
            return String(v == null ? '' : v)
              .replace(/&/g,'&amp;')
              .replace(/</g,'&lt;')
              .replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;')
              .replace(/'/g,'&#39;');
          } catch(_) { return ''; }
        };
        const readBrandLogo = function(id){
          try {
            var raw = localStorage.getItem('db:branch_brand_logos');
            var m = raw ? JSON.parse(raw) : {};
            return (m && m[String(id)]) ? m[String(id)] : null;
          } catch(_) { return null; }
        };
        const logoSrcFor = function(b){
          var local = readBrandLogo(b && b.id);
          if (local && local.url) return local.url;
          if (b && b.logo) return b.logo;
          if (typeof window.getBrandLogo === 'function') return window.getBrandLogo(b && b.brand);
          return 'logos/CompliQ1.png';
        };
        const kv = function(label, val){
          var v = (val == null || val === '') ? '-' : String(val);
          return '<div style="border:1px solid rgba(148,163,184,0.18);background:rgba(2,6,23,0.35);border-radius:10px;padding:8px 10px;min-height:54px"><div style="color:#94a3b8;font-size:11px;margin-bottom:4px">'+h(label)+'</div><div style="color:#e2e8f0;font-size:12px;word-break:break-word">'+h(v)+'</div></div>';
        };
        const toCard = function(b){
          const type = String(b.type || '').toLowerCase();
          const isClosed = b.closed || type === 'closed';
          const isOpening = type === 'opening';
          
          let statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#065f46;color:#d1fae5">' + tx('نشط', 'Active') + '</span>';
          if (isClosed) {
            statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#7f1d1d;color:#fecaca">' + tx('مغلق', 'Closed') + '</span>';
          } else if (isOpening) {
            statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1e293b;color:#93c5fd">' + tx('افتتاح', 'Opening') + '</span>';
          }
          const brandBadge = (b.brand || b.type)
            ? `<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1f2a44;color:#cbd5e1">${b.brand || b.type}</span>`
            : '';
          const licChips = [];
          let catCounts = {};
          var arrA = [];
          try { var rawMapA = localStorage.getItem('db:branch_attachments'); var mapA = rawMapA ? JSON.parse(rawMapA) : {}; arrA = mapA[b.id] || []; arrA.forEach(function(x){ var c=x.category||'other'; catCounts[c]=(catCounts[c]||0)+1; }); } catch(_){}	
          const suf = function(cat){ var n = catCounts[cat]||0; return n>0 ? (' 📎'+n) : ''; };
          const dd = function(s){
            if(!s) return null;
            try {
              const d = new Date(s);
              if (isNaN(d.getTime())) return null;
              const today = new Date(); today.setHours(0,0,0,0);
              return Math.round((d - today)/86400000);
            } catch(_){ return null; }
          };
          const chipCat = function(t, dateStr, catKey){
            const days = dd(dateStr);
            let st = 'background:#334155;color:#cbd5e1';
            if (dateStr) {
              if (days == null) st = 'background:#334155;color:#cbd5e1';
              else if (days <= 0) st = 'background:#7f1d1d;color:#fecaca';
              else if (days <= 30) st = 'background:#78350f;color:#fde68a';
              else st = 'background:#065f46;color:#d1fae5';
            }
            const attN = catCounts[catKey] || 0;
            if (attN > 0) st = 'background:#1d4ed8;color:#fff';
            const suffix = attN > 0 ? (' 📎' + attN) : '';
            const txt = days==null || !dateStr ? (t + suffix) : (t + ' (' + days + ')' + suffix);
            return `<span style="font-size:10px;padding:2px 6px;border-radius:999px;${st}">${txt}</span>`;
          };
          const adAtt = function(){
            try {
              return Object.keys(catCounts).filter(function(k){ return String(k).indexOf('ad_permit') === 0; }).reduce(function(sum, k){ return sum + (catCounts[k]||0); }, 0);
            } catch(_) { return 0; }
          };
          const qrCount = catCounts['unified_code'] || 0;
          if (qrCount > 0) licChips.push(`<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#334155;color:#cbd5e1">📎 ${tx('الرمز الموحد', 'QR Code')} ${qrCount}</span>`);
          if (b.store_license || b.store_license_expiry) licChips.push(chipCat(tx('بلدية','Municipality'), b.store_license_expiry, 'store_license'));
          if (b.civil_defense || b.civil_defense_expiry) licChips.push(chipCat(tx('مدني','Civil Defense'), b.civil_defense_expiry, 'civil_defense'));
          if (b.permit_24h || b.permit_24h_expiry) licChips.push(chipCat(tx('24س','24H'), b.permit_24h_expiry, 'permit_24h'));
          if (b.delivery_permit || b.delivery_permit_expiry) licChips.push(chipCat(tx('توصيل','Delivery'), b.delivery_permit_expiry, 'delivery_permit'));
          if (b.outdoor_permit || b.outdoor_permit_expiry) licChips.push(chipCat(tx('خارجية','Outdoor'), b.outdoor_permit_expiry, 'outdoor_permit'));
          const adCount = Array.isArray(b.ad_permits) ? b.ad_permits.length : 0;
          if (adCount > 0) licChips.push(`<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1d4ed8;color:#fff">${tx('إعلانات', 'Ads')} ${adCount}${adAtt()>0 ? (' 📎'+adAtt()) : ''}</span>`);
          const conChips = [];
          if (b.clean_contract_no || b.clean_contract_expiry) conChips.push(chip(tx('نظافة','Cleaning')+suf('clean_contract'), b.clean_contract_expiry));
          if (b.lease_contract_no || b.lease_contract_expiry) conChips.push(chip(tx('إيجار','Lease')+suf('lease_contract'), b.lease_contract_expiry));
          let attCount = Array.isArray(arrA) ? arrA.length : 0;
          const addIfMissing = function(cat, present){
            if (!present) return;
            if ((catCounts[cat]||0) === 0) attCount++;
          };
          addIfMissing('store_license', b.store_license || b.store_license_expiry);
          addIfMissing('civil_defense', b.civil_defense || b.civil_defense_expiry);
          addIfMissing('permit_24h', b.permit_24h || b.permit_24h_expiry);
          addIfMissing('delivery_permit', b.delivery_permit || b.delivery_permit_expiry);
          addIfMissing('outdoor_permit', b.outdoor_permit || b.outdoor_permit_expiry);
          addIfMissing('electric_meter', b.electric_meter_no || b.electric_account_no);
          addIfMissing('water_meter', b.water_meter_no || b.water_account_no);
          addIfMissing('clean_contract', b.clean_contract_no || b.clean_contract_expiry);
          addIfMissing('lease_contract', b.lease_contract_no || b.lease_contract_expiry);
          const attBtn = `
            <button onclick="try{ AttachmentHub.open({ scope: 'branch_uploads', ownerId: '${b.id}', title: '${tx('مرفقات الفرع', 'Branch Attachments')}' }); }catch(e){}" title="${tx('المرفقات', 'Attachments')}" style="width:28px;height:28px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;position:relative;display:flex;align-items:center;justify-content:center">
              <span style="pointer-events:none">📎</span>
              ${attCount>0 ? `<span style="position:absolute;top:-6px;right:-6px;background:#1d4ed8;color:#fff;border-radius:999px;min-width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;font-size:10px;line-height:16px">${attCount}</span>` : ''}
            </button>
          `;
          const logoSrc = logoSrcFor(b);
          const details = [
            kv('Cost Center', b.cost_center || b.costCenter || ''),
            kv(tx('الايميل','Email'), b.email || ''),
            kv('OPS', b.ops1 || ''),
            kv('اسم المشرف', b.ops_manager || ''),
            kv('ايميل المشرف', b.manager_email || ''),
            kv('تاريخ افتتاح متوقع', b.opening_date_expected || ''),
            kv('تاريخ الإغلاق', b.close_date || ''),
            kv('QR Code (مرفقات)', qrCount ? ('📎 ' + qrCount) : ''),
            kv('لوحة عمودية', b.vertical_sign_exists ? 'نعم' : 'لا'),
            kv('مقاس اللوحة', (b.vertical_sign_length || b.vertical_sign_width) ? ((b.vertical_sign_length||'')+' × '+(b.vertical_sign_width||'')+' '+(b.vertical_sign_unit||'')) : ''),
            kv('بلدية (رقم)', b.store_license || ''),
            kv('بلدية (انتهاء)', b.store_license_expiry || ''),
            kv('مدني (رقم)', b.civil_defense || ''),
            kv('مدني (انتهاء)', b.civil_defense_expiry || ''),
            kv('24 ساعة (رقم)', b.permit_24h || ''),
            kv('24 ساعة (انتهاء)', b.permit_24h_expiry || ''),
            kv('24 ساعة (تكلفة)', b.permit_24h_cost || ''),
            kv('توصيل (رقم)', b.delivery_permit || ''),
            kv('توصيل (انتهاء)', b.delivery_permit_expiry || ''),
            kv('توصيل (تكلفة)', b.delivery_permit_cost || ''),
            kv('خارجية (رقم)', b.outdoor_permit || ''),
            kv('خارجية (انتهاء)', b.outdoor_permit_expiry || ''),
            kv('خارجية (مساحة)', b.outdoor_area || ''),
            kv('خارجية (تكلفة)', b.outdoor_permit_cost || ''),
            kv('عداد الكهرباء', b.electric_meter_no || ''),
            kv('حساب الكهرباء', b.electric_account_no || ''),
            kv('عداد المياه', b.water_meter_no || ''),
            kv('حساب المياه', b.water_account_no || ''),
            kv('عقد نظافة (رقم)', b.clean_contract_no || ''),
            kv('عقد نظافة (انتهاء)', b.clean_contract_expiry || ''),
            kv('عقد إيجار (رقم)', b.lease_contract_no || ''),
            kv('عقد إيجار (انتهاء)', b.lease_contract_expiry || ''),
            kv('تصاريح إعلانية', adCount ? ('عدد: ' + adCount) : ''),
            kv(tx('ملاحظات','Notes'), b.notes || ''),
            kv('وسام لا مخالفات', b.award_star_manual ? 'مفعل' : 'غير مفعل')
          ].join('');
          return `
            <div style="border:1px solid rgba(148,163,184,0.25);background:rgba(15,23,42,0.6);border-radius:12px;padding:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <div style="display:flex;gap:10px;align-items:center;min-width:0">
                  <div style="width:44px;height:44px;border-radius:12px;background:rgba(2,6,23,0.45);border:1px solid rgba(148,163,184,0.18);display:flex;align-items:center;justify-content:center;overflow:hidden;flex:0 0 auto">
                    <img src="${h(logoSrc)}" alt="" style="width:100%;height:100%;object-fit:contain;padding:6px" onerror="this.onerror=null; this.src='logos/CompliQ1.png';">
                  </div>
                  <div style="min-width:0">
                    <div style="color:#e2e8f0;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h(b.name || '-')}</div>
                    <div style="color:#94a3b8;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h(b.region || '-')}${' • '}${h(b.city || '-')}</div>
                  </div>
                </div>
                <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${brandBadge}${statusBadge}</div>
              </div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-start;margin-bottom:6px;">${licChips.join('')}</div>
              <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-start;margin-bottom:6px;">${conChips.join('')}</div>
              <details style="border:1px solid rgba(148,163,184,0.18);border-radius:12px;padding:8px 10px;background:rgba(2,6,23,0.25);margin-bottom:8px">
                <summary style="cursor:pointer;color:#e2e8f0;font-weight:700;list-style:none">${tx('تفاصيل الفرع', 'Branch Details')}</summary>
                <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px">${details}</div>
              </details>
              <div style="display:flex;gap:6px;align-items:center;justify-content:flex-end;">
                ${attBtn}
                <button type="button" data-branch-action="edit" data-branch-id="${b.id || b._id || b.branch_id || ''}" title="${tx('تعديل', 'Edit')}" style="min-width:34px;height:28px;border-radius:8px;background:rgba(30,64,175,0.22);border:1px solid rgba(96,165,250,0.45);color:#bfdbfe;display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="pointer-events:none">✏️</span></button>
              </div>
            </div>
          `;
        };
        cardsEl.innerHTML = branchesPage.map(toCard).join('');
      }
    } catch(_) {}
  } catch (error) {
    console.error('Error rendering branches table:', error);
  }
};

// Fallback/alias for branches table rendering (admin expects renderBranchesTable)
if (typeof window.renderBranchesTable !== 'function') {
  window.renderBranchesTable = async function() {
    try {
      if (typeof window.renderBranchesTableAPI === 'function') {
        return await window.renderBranchesTableAPI();
      }
    } catch (e) {
      console.warn('renderBranchesTableAPI failed, falling back to local data', e);
    }

    try {
      const tbody = document.getElementById('branches-table-body');
      if (!tbody) return;

      const safeParse = function(key, def){
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); } catch(_) { return def; }
      };
      const localRows = (window.App && App.store && typeof App.store.list === 'function')
        ? (App.store.list('branches') || [])
        : safeParse('admin_branches_data', []);

      if (!Array.isArray(localRows) || !localRows.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">لا توجد بيانات</td></tr>';
        return;
      }

      tbody.innerHTML = '';
      localRows.forEach(function(b) {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', b.id || '');
        const type = String(b.type || '').toLowerCase();
        const isClosed = b.closed || type === 'closed';
        const isOpening = type === 'opening';
        
        let statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#065f46;color:#d1fae5">نشط</span>';
        if (isClosed) {
          statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#7f1d1d;color:#fecaca">مغلق</span>';
        } else if (isOpening) {
          statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1e293b;color:#93c5fd">افتتاح</span>';
        }
        const brandBadge = (b.brand || b.type)
          ? `<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1f2a44;color:#cbd5e1">${b.brand || b.type}</span>`
          : '-';
        const emailCell = (b.email)
          ? `<span title="${b.email}" style="max-width:160px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle">${b.email}</span>`
          : '-';
        const dd2 = function(s){
          if(!s) return null;
          try {
            const d = new Date(s);
            if (isNaN(d.getTime())) return null;
            const today = new Date(); today.setHours(0,0,0,0);
            const days = Math.round((d - today)/86400000);
            return days;
          } catch(_) { return null; }
        };
        const chip2 = function(t, dateStr){
          const days = dd2(dateStr);
          let st = 'background:#334155;color:#cbd5e1';
          let ic = '•';
          if (dateStr) {
            if (days == null) { st = 'background:#334155;color:#cbd5e1'; ic = '📄'; }
            else if (days <= 0) { st = 'background:#7f1d1d;color:#fecaca'; ic = '⛔'; }
            else if (days <= 30) { st = 'background:#78350f;color:#fde68a'; ic = '⏳'; }
            else { st = 'background:#065f46;color:#d1fae5'; ic = '✅'; }
          }
          const txt = days==null || !dateStr ? (ic + ' ' + t) : (ic + ' ' + t + ' ' + '(' + days + ')');
          return `<span style="font-size:10px;padding:2px 6px;border-radius:999px;${st}">${txt}</span>`;
        };
        const licChips2 = [];
        if (b.store_license || b.store_license_expiry) licChips2.push(chip2('بلدية', b.store_license_expiry));
        if (b.civil_defense || b.civil_defense_expiry) licChips2.push(chip2('مدني', b.civil_defense_expiry));
        if (b.permit_24h || b.permit_24h_expiry) licChips2.push(chip2('24س', b.permit_24h_expiry));
        if (b.delivery_permit || b.delivery_permit_expiry) licChips2.push(chip2('توصيل', b.delivery_permit_expiry));
        if (b.outdoor_permit || b.outdoor_permit_expiry) licChips2.push(chip2('خارجية', b.outdoor_permit_expiry));
        const adCount2 = Array.isArray(b.ad_permits) ? b.ad_permits.length : 0;
        if (adCount2 > 0) licChips2.push(`<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1d4ed8;color:#fff">إعلانات ${adCount2}</span>`);
        const licCell2 = licChips2.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">${licChips2.join('')}</div>` : '-';
        const conChips2 = [];
        if (b.clean_contract_no || b.clean_contract_expiry) conChips2.push(chip2('نظافة', b.clean_contract_expiry));
        if (b.lease_contract_no || b.lease_contract_expiry) conChips2.push(chip2('إيجار', b.lease_contract_expiry));
        const conCell2 = conChips2.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center">${conChips2.join('')}</div>` : '-';
        let attCount2 = 0;
        if (b.store_license) attCount2++;
        if (b.civil_defense) attCount2++;
        if (b.permit_24h) attCount2++;
        if (b.delivery_permit) attCount2++;
        if (b.outdoor_permit) attCount2++;
        if (adCount2) attCount2 += adCount2;
        if (b.electric_meter_no) attCount2++;
        if (b.water_meter_no) attCount2++;
        if (b.clean_contract_no) attCount2++;
        if (b.lease_contract_no) attCount2++;
        try { var raw2 = localStorage.getItem('db:branch_attachments'); var map2 = raw2 ? JSON.parse(raw2) : {}; var extra2 = map2 && map2[b.id || ''] ? map2[b.id || ''].length : 0; attCount2 += extra2; } catch(_){}
        const attBtn2 = `
          <button onclick="try{ AttachmentHub.open({ scope: 'branch_uploads', ownerId: '${b.id || ''}', title: 'مرفقات الفرع' }); }catch(e){}" title="المرفقات" style="width:28px;height:28px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;position:relative;display:flex;align-items:center;justify-content:center">
            <span style="pointer-events:none">📎</span>
            ${attCount2>0 ? `<span style="position:absolute;top:-6px;right:-6px;background:#1d4ed8;color:#fff;border-radius:999px;min-width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;font-size:10px;line-height:16px">${attCount2}</span>` : ''}
          </button>
        `;
        tr.innerHTML = `
          <td class="px-3 py-2 text-center"><input type="checkbox" class="br-select" data-id="${b.id || ''}"></td>
          <td class="px-3 py-2 text-right text-sm">${b.name || '-'}</td>
          <td class="px-3 py-2 text-center text-sm">${b.region || '-'}</td>
          <td class="px-3 py-2 text-center text-sm">${b.city || '-'}</td>
          <td class="px-3 py-2 text-center text-sm">${statusBadge}</td>
          <td class="px-3 py-2 text-center text-sm">${brandBadge}</td>
          <td class="px-3 py-2 text-center text-sm">${b.cost_center || '-'}</td>
          <td class="px-3 py-2 text-center text-sm">${emailCell}</td>
          <td class="px-3 py-2 text-center text-sm">${b.opening_date_expected ? chip('', b.opening_date_expected) : '-'}</td>
          <td class="px-3 py-2 text-right text-sm">${b.close_date ? chip('', b.close_date) : '-'}</td>
          <td class="px-3 py-2 text-right text-sm">${b.notes || '-'}</td>
          <td class="px-3 py-2 text-center text-sm">${licCell2}</td>
          <td class="px-3 py-2 text-center text-sm">${conCell2}</td>
          <td class="px-3 py-2 text-center text-sm">${attBtn2}</td>
          <td class="px-3 py-2 text-center text-sm">
            <div style="display:flex;gap:4px;align-items:center;justify-content:center;">
              <button type="button" data-branch-action="edit" data-branch-id="${b.id || b._id || b.branch_id || ''}" title="تعديل" style="min-width:30px;height:24px;border-radius:8px;background:rgba(30,64,175,0.22);border:1px solid rgba(96,165,250,0.45);color:#bfdbfe;display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="pointer-events:none">✏️</span></button>
              <button type="button" data-branch-action="delete" data-branch-id="${b.id || b._id || b.branch_id || ''}" title="حذف" style="min-width:30px;height:24px;border-radius:8px;background:rgba(127,29,29,0.25);border:1px solid rgba(248,113,113,0.45);color:#fecaca;display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="pointer-events:none">🗑️</span></button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
      
      try {
        const statsEl = document.getElementById('branches-stats');
        const cardsEl = document.getElementById('branches-cards');
        if (statsEl) {
          const total = localRows.length;
          const active = localRows.filter(function(b){ 
             const t = String(b.type||'').toLowerCase();
             return !b.closed && t !== 'closed' && t !== 'opening';
          }).length;
          const closed = localRows.filter(function(b){ return !!b.closed || String(b.type||'').toLowerCase()==='closed'; }).length;
          const openings = localRows.filter(function(b){ return String(b.type||'').toLowerCase()==='opening'; }).length;
          const chip = function(txt, st){ return `<span style="font-size:11px;padding:4px 10px;border-radius:999px;${st};display:inline-flex;align-items:center;gap:6px">${txt}</span>`; };
          statsEl.innerHTML = [
            chip('الإجمالي: ' + total, 'background:#0f172a;border:1px solid #334155;color:#e2e8f0'),
            chip('نشطة: ' + active, 'background:#065f46;color:#d1fae5'),
            chip('مقفلة: ' + closed, 'background:#7f1d1d;color:#fecaca'),
            chip('افتتاحات: ' + openings, 'background:#1e293b;color:#93c5fd')
          ].join('');
        }
        if (cardsEl) {
          const dd = function(s){
            if(!s) return null;
            try {
              const d = new Date(s);
              if (isNaN(d.getTime())) return null;
              const today = new Date(); today.setHours(0,0,0,0);
              return Math.round((d - today)/86400000);
            } catch(_){ return null; }
          };
          const chip = function(t, dateStr){
            const days = dd(dateStr);
            let st = 'background:#334155;color:#cbd5e1';
            if (dateStr) {
              if (days == null) st = 'background:#334155;color:#cbd5e1';
              else if (days <= 0) st = 'background:#7f1d1d;color:#fecaca';
              else if (days <= 30) st = 'background:#78350f;color:#fde68a';
              else st = 'background:#065f46;color:#d1fae5';
            }
            const txt = days==null || !dateStr ? t : (t + ' ' + '(' + days + ')');
            return `<span style="font-size:10px;padding:2px 6px;border-radius:999px;${st}">${txt}</span>`;
          };
          const h = function(v){
            try {
              return String(v == null ? '' : v)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g,'&quot;')
                .replace(/'/g,'&#39;');
            } catch(_) { return ''; }
          };
          const readBrandLogo = function(id){
            try {
              var raw = localStorage.getItem('db:branch_brand_logos');
              var m = raw ? JSON.parse(raw) : {};
              return (m && m[String(id)]) ? m[String(id)] : null;
            } catch(_) { return null; }
          };
          const logoSrcFor = function(b){
            var local = readBrandLogo(b && b.id);
            if (local && local.url) return local.url;
            if (b && b.logo) return b.logo;
            if (typeof window.getBrandLogo === 'function') return window.getBrandLogo(b && b.brand);
            return 'logos/CompliQ1.png';
          };
          const kv = function(label, val){
            var v = (val == null || val === '') ? '-' : String(val);
            return '<div style="border:1px solid rgba(148,163,184,0.18);background:rgba(2,6,23,0.35);border-radius:10px;padding:8px 10px;min-height:54px"><div style="color:#94a3b8;font-size:11px;margin-bottom:4px">'+h(label)+'</div><div style="color:#e2e8f0;font-size:12px;word-break:break-word">'+h(v)+'</div></div>';
          };
          const toCard = function(b){
            let statusBadge = '';
            const t = (b.type || 'basic').toLowerCase();
            if (t === 'closed' || b.closed) {
              statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#7f1d1d;color:#fecaca">مغلق</span>';
            } else if (t === 'opening') {
              statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1e293b;color:#93c5fd">افتتاح</span>';
            } else {
              statusBadge = '<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#065f46;color:#d1fae5">نشط</span>';
            }
            const brandBadge = (b.brand || b.type)
              ? `<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1f2a44;color:#cbd5e1">${h(b.brand || b.type)}</span>`
              : '';
            const licChips = [];
            let catCounts = {};
            var arrA = [];
            try { var rawMapA = localStorage.getItem('db:branch_attachments'); var mapA = rawMapA ? JSON.parse(rawMapA) : {}; arrA = mapA[b.id] || []; arrA.forEach(function(x){ var c=x.category||'other'; catCounts[c]=(catCounts[c]||0)+1; }); } catch(_){}
            const suf = function(cat){ var n = catCounts[cat]||0; return n>0 ? (' 📎'+n) : ''; };
            const adAtt = function(){
              try {
                return Object.keys(catCounts).filter(function(k){ return String(k).indexOf('ad_permit') === 0; }).reduce(function(sum, k){ return sum + (catCounts[k]||0); }, 0);
              } catch(_) { return 0; }
            };
            const qrCount = catCounts['unified_code'] || 0;
            if (qrCount > 0) licChips.push(`<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#334155;color:#cbd5e1">📎 QR Code ${qrCount}</span>`);
            if (b.store_license || b.store_license_expiry) licChips.push(chip('بلدية'+suf('store_license'), b.store_license_expiry));
            if (b.civil_defense || b.civil_defense_expiry) licChips.push(chip('مدني'+suf('civil_defense'), b.civil_defense_expiry));
            if (b.permit_24h || b.permit_24h_expiry) licChips.push(chip('24س'+suf('permit_24h'), b.permit_24h_expiry));
            if (b.delivery_permit || b.delivery_permit_expiry) licChips.push(chip('توصيل'+suf('delivery_permit'), b.delivery_permit_expiry));
            if (b.outdoor_permit || b.outdoor_permit_expiry) licChips.push(chip('خارجية'+suf('outdoor_permit'), b.outdoor_permit_expiry));
            const adCount = Array.isArray(b.ad_permits) ? b.ad_permits.length : 0;
            if (adCount > 0) licChips.push(`<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:#1d4ed8;color:#fff">إعلانات ${adCount}${adAtt()>0 ? (' 📎'+adAtt()) : ''}</span>`);
            const conChips = [];
            if (b.clean_contract_no || b.clean_contract_expiry) conChips.push(chip('نظافة'+suf('clean_contract'), b.clean_contract_expiry));
            if (b.lease_contract_no || b.lease_contract_expiry) conChips.push(chip('إيجار'+suf('lease_contract'), b.lease_contract_expiry));
            let attCount = Array.isArray(arrA) ? arrA.length : 0;
            const addIfMissing = function(cat, present){
              if (!present) return;
              if ((catCounts[cat]||0) === 0) attCount++;
            };
            addIfMissing('store_license', b.store_license || b.store_license_expiry);
            addIfMissing('civil_defense', b.civil_defense || b.civil_defense_expiry);
            addIfMissing('permit_24h', b.permit_24h || b.permit_24h_expiry);
            addIfMissing('delivery_permit', b.delivery_permit || b.delivery_permit_expiry);
            addIfMissing('outdoor_permit', b.outdoor_permit || b.outdoor_permit_expiry);
            addIfMissing('electric_meter', b.electric_meter_no || b.electric_account_no);
            addIfMissing('water_meter', b.water_meter_no || b.water_account_no);
            addIfMissing('clean_contract', b.clean_contract_no || b.clean_contract_expiry);
            addIfMissing('lease_contract', b.lease_contract_no || b.lease_contract_expiry);
            const attBtn = `
              <button onclick="try{ AttachmentHub.open({ scope: 'branch_uploads', ownerId: '${b.id || ''}', title: 'مرفقات الفرع' }); }catch(e){}" title="المرفقات" style="width:28px;height:28px;border-radius:999px;background:#0f172a;border:1px solid #334155;color:#cbd5e1;position:relative;display:flex;align-items:center;justify-content:center">
                <span style="pointer-events:none">📎</span>
                ${attCount>0 ? `<span style="position:absolute;top:-6px;right:-6px;background:#1d4ed8;color:#fff;border-radius:999px;min-width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;font-size:10px;line-height:16px">${attCount}</span>` : ''}
              </button>
            `;
            const logoSrc = logoSrcFor(b);
            const details = [
              kv(tx('Cost Center', 'Cost Center'), b.cost_center || b.costCenter || ''),
              kv('الايميل', b.email || ''),
              kv('OPS', b.ops1 || ''),
              kv('اسم المشرف', b.ops_manager || ''),
              kv('ايميل المشرف', b.manager_email || ''),
              kv('تاريخ افتتاح متوقع', b.opening_date_expected || ''),
              kv('تاريخ الإغلاق', b.close_date || ''),
              kv('QR Code (مرفقات)', qrCount ? ('📎 ' + qrCount) : ''),
              kv('لوحة عمودية', b.vertical_sign_exists ? 'نعم' : 'لا'),
              kv('مقاس اللوحة', (b.vertical_sign_length || b.vertical_sign_width) ? ((b.vertical_sign_length||'')+' × '+(b.vertical_sign_width||'')+' '+(b.vertical_sign_unit||'')) : ''),
              kv('بلدية (رقم)', b.store_license || ''),
              kv('بلدية (انتهاء)', b.store_license_expiry || ''),
              kv('مدني (رقم)', b.civil_defense || ''),
              kv('مدني (انتهاء)', b.civil_defense_expiry || ''),
              kv('24 ساعة (رقم)', b.permit_24h || ''),
              kv('24 ساعة (انتهاء)', b.permit_24h_expiry || ''),
              kv('24 ساعة (تكلفة)', b.permit_24h_cost || ''),
              kv('توصيل (رقم)', b.delivery_permit || ''),
              kv('توصيل (انتهاء)', b.delivery_permit_expiry || ''),
              kv('توصيل (تكلفة)', b.delivery_permit_cost || ''),
              kv('خارجية (رقم)', b.outdoor_permit || ''),
              kv('خارجية (انتهاء)', b.outdoor_permit_expiry || ''),
              kv('خارجية (مساحة)', b.outdoor_area || ''),
              kv('خارجية (تكلفة)', b.outdoor_permit_cost || ''),
              kv('عداد الكهرباء', b.electric_meter_no || ''),
              kv('حساب الكهرباء', b.electric_account_no || ''),
              kv('عداد المياه', b.water_meter_no || ''),
              kv('حساب المياه', b.water_account_no || ''),
              kv('عقد نظافة (رقم)', b.clean_contract_no || ''),
              kv('عقد نظافة (انتهاء)', b.clean_contract_expiry || ''),
              kv('عقد إيجار (رقم)', b.lease_contract_no || ''),
              kv('عقد إيجار (انتهاء)', b.lease_contract_expiry || ''),
              kv('تصاريح إعلانية', adCount ? ('عدد: ' + adCount) : ''),
              kv('ملاحظات', b.notes || ''),
              kv('وسام لا مخالفات', b.award_star_manual ? 'مفعل' : 'غير مفعل')
            ].join('');
            return `
              <div style="border:1px solid rgba(148,163,184,0.25);background:rgba(15,23,42,0.6);border-radius:12px;padding:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <div style="display:flex;gap:10px;align-items:center;min-width:0">
                    <div style="width:44px;height:44px;border-radius:12px;background:rgba(2,6,23,0.45);border:1px solid rgba(148,163,184,0.18);display:flex;align-items:center;justify-content:center;overflow:hidden;flex:0 0 auto">
                      <img src="${h(logoSrc)}" alt="" style="width:100%;height:100%;object-fit:contain;padding:6px" onerror="this.onerror=null; this.src='logos/CompliQ1.png';">
                    </div>
                    <div style="min-width:0">
                      <div style="color:#e2e8f0;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h(b.name || '-')}</div>
                      <div style="color:#94a3b8;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h(b.region || '-')}${' • '}${h(b.city || '-')}</div>
                    </div>
                  </div>
                  <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${brandBadge}${statusBadge}</div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-start;margin-bottom:6px;">${licChips.join('')}</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-start;margin-bottom:6px;">${conChips.join('')}</div>
                <details style="border:1px solid rgba(148,163,184,0.18);border-radius:12px;padding:8px 10px;background:rgba(2,6,23,0.25);margin-bottom:8px">
                  <summary style="cursor:pointer;color:#e2e8f0;font-weight:700;list-style:none">تفاصيل الفرع</summary>
                  <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px">${details}</div>
                </details>
                <div style="display:flex;gap:6px;align-items:center;justify-content:flex-end;">
                  ${attBtn}
                  <button type="button" data-branch-action="edit" data-branch-id="${b.id || b._id || b.branch_id || ''}" title="تعديل" style="min-width:34px;height:28px;border-radius:8px;background:rgba(30,64,175,0.22);border:1px solid rgba(96,165,250,0.45);color:#bfdbfe;display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="pointer-events:none">✏️</span></button>
                </div>
              </div>
            `;
          };
          cardsEl.innerHTML = localRows.map(toCard).join('');
        }
      } catch(_) {}
    } catch (error) {
      console.error('Error rendering branches table (local):', error);
    }
  };
}

// No-op fallbacks to avoid breaking admin branches section
if (typeof window.renderBranchesControl !== 'function') {
  window.renderBranchesControl = function() {};
}
if (typeof window.renderBranchesCoverage !== 'function') {
  window.renderBranchesCoverage = function() {};
}

(function wireBranchRowActionButtons(){
  if (window.__branchActionButtonsWired) return;
  window.__branchActionButtonsWired = true;
  document.addEventListener('click', function(e){
    try {
      var btn = e.target && e.target.closest ? e.target.closest('button[data-branch-action][data-branch-id]') : null;
      if (!btn) return;
      var action = btn.getAttribute('data-branch-action');
      var id = btn.getAttribute('data-branch-id');
      if (!id || id === 'undefined' || id === 'null') {
        console.error('Branch action button: ID missing', btn);
        if (typeof toast === 'function') toast('error', 'خطأ', 'معرف الفرع غير موجود');
        return;
      }
      
      console.log('Branch action triggered:', action, id);

      if (action === 'edit') {
        if (typeof window.editBranch === 'function') window.editBranch(id);
        else if (typeof toast === 'function') toast('error', 'خطأ', 'وظيفة التعديل غير متاحة');
      } else if (action === 'delete') {
        if (typeof window.deleteBranchRecord === 'function') window.deleteBranchRecord(id);
        else if (typeof toast === 'function') toast('error', 'خطأ', 'وظيفة الحذف غير متاحة');
      }
    } catch(err) {
      console.error('Branch action button failed:', err);
      try { if (typeof toast === 'function') toast('error', 'خطأ', 'تعذر تنفيذ العملية'); } catch(_) {}
    }
  }, true);
})();

// Helpers: Branches bulk selection and deletion
if (typeof window.getSelectedBranchIds !== 'function') {
  window.getSelectedBranchIds = function(){
    try {
      var boxes = document.querySelectorAll('#branches-table-body input.br-select:checked');
      var ids = [];
      boxes.forEach(function(b){ var id = b.getAttribute('data-id'); if (id != null && id !== '') ids.push(id); });
      return ids;
    } catch(_) { return []; }
  };
}

(function wireBranchesBulkActions(){
  try {
    var selAll = document.getElementById('br-select-all');
    if (selAll && !selAll.dataset.wired) {
      selAll.dataset.wired = '1';
      selAll.onchange = function(){
        try {
          var boxes = document.querySelectorAll('#branches-table-body input.br-select');
          boxes.forEach(function(b){ b.checked = selAll.checked; });
        } catch(_){}
      };
    }
    var delSel = document.getElementById('br-delete-selected');
    if (delSel && !delSel.dataset.wired) {
      delSel.dataset.wired = '1';
      delSel.onclick = async function(){
        try {
          var ids = (typeof getSelectedBranchIds==='function') ? getSelectedBranchIds() : [];
          if (!ids.length) { if (typeof toast==='function') toast('info','تنبيه','لم يتم تحديد أي فروع'); return; }
          var ok = true;
          if (typeof confirmDialog === 'function') {
            ok = await confirmDialog({ title:'تأكيد الحذف', message:'سيتم حذف '+ ids.length +' فرع/فروع. هل أنت متأكد؟', confirmText:'حذف', cancelText:'إلغاء' });
          } else {
            ok = window.confirm('سيتم حذف '+ ids.length +' فرع/فروع. هل أنت متأكد؟');
          }
          if (!ok) return;
          for (var i=0;i<ids.length;i++){
            try { await deleteRecord('branches', ids[i]); } catch(_){}
          }
          renderBranchesTable();
          if (typeof renderBranchesControl === 'function') renderBranchesControl();
          if (typeof renderQuickAccessFromBranches === 'function') renderQuickAccessFromBranches();
          if (typeof toast==='function') toast('success','تم','تم حذف المحدد');
        } catch(e) {
          console.error('Bulk delete branches failed:', e);
        }
      };
    }
  } catch(_) {}
})();

/**
 * تحديث جدول الموظفين عبر API
 */
window.renderEmployeesTableAPI = async function() {
  try {
    const tbody = document.getElementById('employees-table-body');
    if (!tbody) return;

    // جلب البيانات من API
    const employees = await fetchDataFromAPI('employees');
    
    if (!Array.isArray(employees)) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">لا توجد بيانات</td></tr>';
      return;
    }

    // بناء الجدول
    tbody.innerHTML = '';
    employees.forEach(function(e) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', e.id);
      
      const statusBadge = e.status === 'active'
        ? '<span class="px-2 py-1 text-xs rounded bg-green-900 text-green-200">نشط</span>'
        : '<span class="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">' + (e.status || 'غير معروف') + '</span>';

      tr.innerHTML = `
        <td class="px-4 py-2 text-sm">${e.id}</td>
        <td class="px-4 py-2 text-sm">${e.name || '-'}</td>
        <td class="px-4 py-2 text-sm">${e.sap_id || '-'}</td>
        <td class="px-4 py-2 text-sm">${e.email || '-'}</td>
        <td class="px-4 py-2 text-sm">${e.department || '-'}</td>
        <td class="px-4 py-2 text-sm">${statusBadge}</td>
        <td class="px-4 py-2 text-sm">
          <button onclick="editEmployee('${e.id}')" class="text-blue-400 hover:text-blue-300 mr-2">تعديل</button>
          <button onclick="deleteEmployeeRecord('${e.id}')" class="text-red-400 hover:text-red-300">حذف</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error rendering employees table:', error);
  }
};

/**
 * تحديث جدول الرخص عبر API
 */
window.renderLicensesTableAPI = async function() {
  try {
    const tbody = document.getElementById('licenses-table-body');
    if (!tbody) return;

    // جلب البيانات من API
    const licenses = await fetchDataFromAPI('licenses');
    
    if (!Array.isArray(licenses)) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">لا توجد بيانات</td></tr>';
      return;
    }

    // بناء الجدول
    tbody.innerHTML = '';
    licenses.forEach(function(l) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', l.id);

      tr.innerHTML = `
        <td class="px-4 py-2 text-sm">${l.id}</td>
        <td class="px-4 py-2 text-sm">${l.license_number || '-'}</td>
        <td class="px-4 py-2 text-sm">${l.type || '-'}</td>
        <td class="px-4 py-2 text-sm">${l.issue_date || '-'}</td>
        <td class="px-4 py-2 text-sm">${l.expiry_date || '-'}</td>
        <td class="px-4 py-2 text-sm">${l.issuing_authority || '-'}</td>
        <td class="px-4 py-2 text-sm">
          <button onclick="editLicense('${l.id}')" class="text-blue-400 hover:text-blue-300 mr-2">تعديل</button>
          <button onclick="deleteLicenseRecord('${l.id}')" class="text-red-400 hover:text-red-300">حذف</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error rendering licenses table:', error);
  }
};

/**
 * تحديث جدول السكنات عبر API
 */
window.renderHousingsTableAPI = async function() {
  try {
    const tbody = document.getElementById('housings-table-body');
    if (!tbody) return;

    // جلب البيانات من API
    const housings = await fetchDataFromAPI('housings');
    
    if (!Array.isArray(housings)) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">لا توجد بيانات</td></tr>';
      return;
    }

    // بناء الجدول
    tbody.innerHTML = '';
    housings.forEach(function(h) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', h.id);
      
      const statusBadge = h.status === 'available'
        ? '<span class="px-2 py-1 text-xs rounded bg-green-900 text-green-200">متاح</span>'
        : '<span class="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">' + (h.status || 'غير معروف') + '</span>';

      tr.innerHTML = `
        <td class="px-4 py-2 text-sm">${h.id}</td>
        <td class="px-4 py-2 text-sm">${h.name || '-'}</td>
        <td class="px-4 py-2 text-sm">${h.location || '-'}</td>
        <td class="px-4 py-2 text-sm">${h.type || '-'}</td>
        <td class="px-4 py-2 text-sm">${h.capacity || '-'}</td>
        <td class="px-4 py-2 text-sm">${statusBadge}</td>
        <td class="px-4 py-2 text-sm">
          <button onclick="editHousing('${h.id}')" class="text-blue-400 hover:text-blue-300 mr-2">تعديل</button>
          <button onclick="deleteHousingRecord('${h.id}')" class="text-red-400 hover:text-red-300">حذف</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error rendering housings table:', error);
  }
};

/**
 * تحديث جدول وسائل النقل عبر API
 */
window.renderTransportsTableAPI = async function() {
  try {
    const tbody = document.getElementById('transports-table-body');
    if (!tbody) return;

    // جلب البيانات من API
    const transports = await fetchDataFromAPI('transports');
    
    if (!Array.isArray(transports)) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">لا توجد بيانات</td></tr>';
      return;
    }

    // بناء الجدول
    tbody.innerHTML = '';
    transports.forEach(function(t) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', t.id);
      
      const statusBadge = t.status === 'active'
        ? '<span class="px-2 py-1 text-xs rounded bg-green-900 text-green-200">نشط</span>'
        : '<span class="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300">' + (t.status || 'غير معروف') + '</span>';

      tr.innerHTML = `
        <td class="px-4 py-2 text-sm">${t.id}</td>
        <td class="px-4 py-2 text-sm">${t.name || '-'}</td>
        <td class="px-4 py-2 text-sm">${t.plate_number || '-'}</td>
        <td class="px-4 py-2 text-sm">${t.type || '-'}</td>
        <td class="px-4 py-2 text-sm">${t.capacity || '-'}</td>
        <td class="px-4 py-2 text-sm">${statusBadge}</td>
        <td class="px-4 py-2 text-sm">
          <button onclick="editTransport('${t.id}')" class="text-blue-400 hover:text-blue-300 mr-2">تعديل</button>
          <button onclick="deleteTransportRecord('${t.id}')" class="text-red-400 hover:text-red-300">حذف</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error rendering transports table:', error);
  }
};

/**
 * دوال التعديل - فتح Modal وملء البيانات
 */
window.editViolation = async function(id) {
  try {
    const violation = await APIClient.violations.get(id);
    window.__vioEditingId = id;
    
    function setValue(id, value) {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = value == null ? '' : String(value);
    }

    // ملء الحقول (متوافق مع vio-modal في admin.html)
    const typeText = [violation.type, violation.description].filter(Boolean).join(' - ');
    setValue('vio-branch', violation.branch || violation.location || '');
    setValue('vio-cost-center', violation.cost_center || violation.costCenter || violation.tc || '');
    setValue('vio-number', violation.vio_no || violation.violation_no || violation.number || violation.id || '');
    setValue('vio-efaa', violation.efaa_no || violation.efaaNo || '');
    setValue('vio-payment', violation.payment_no || violation.paymentNo || '');
    setValue('vio-date', violation.date || '');
    setValue('vio-type', typeText || '');
    setValue('vio-amount', violation.amount || '');
    setValue('vio-region', violation.region || '');
    setValue('vio-appeal-number', violation.appeal_number || '');
    setValue('vio-appeal-date', violation.appeal_date || '');
    setValue('vio-finance-date', violation.finance_date || '');

    // Appeal status mapping (ensure option exists)
    const appealEl = document.getElementById('vio-appeal');
    const paidEl = document.getElementById('vio-paid');
    const syncPaidFromAppeal = function() {
      if (!appealEl || !paidEl) return;
      const appealVal = String(appealEl.value || '').toLowerCase();
      if (appealVal === 'accepted') paidEl.value = 'cancelled';
      else if (appealVal === 'rejected') paidEl.value = 'true';
    };
    if (appealEl) {
      const raw = String(violation.appeal_status || '').trim();
      const allowed = ['under_study', 'rejected', 'accepted', 'not_applicable'];
      appealEl.value = allowed.includes(raw) ? raw : 'not_applicable';
      appealEl.onchange = syncPaidFromAppeal;
    }

    if (paidEl) {
      const paidStatus = String(violation.paid_status || '').trim().toLowerCase();
      const paidRaw = String(violation.paid || '').trim().toLowerCase();
      const isCancelled = ['cancelled', 'canceled', 'ملغي', 'ملغاة', 'إلغاء المخالفة', 'الغاء المخالفة'].includes(paidStatus);
      const isPaid = ['paid', 'true', '1', 'yes', 'تم السداد', 'مسدد'].includes(paidStatus)
        || ['true', '1', 'yes'].includes(paidRaw);
      paidEl.value = isCancelled ? 'cancelled' : (isPaid ? 'true' : 'false');
    }
    syncPaidFromAppeal();

    // Attachments preview
    const preview = document.getElementById('vio-files-preview');
    if (preview) {
      const atts = [].concat(violation.attachments || [], violation.files || []);
      preview.innerHTML = atts.length ? '' : '<div class="text-slate-400 text-sm">لا توجد مرفقات</div>';
      atts.forEach(url => {
        try {
          const ext = (url.split('.').pop() || '').toLowerCase();
          let el;
          if (['png','jpg','jpeg','gif','webp','bmp','svg'].includes(ext)) {
            el = document.createElement('img');
            el.src = url;
            el.alt = 'attachment';
            el.style.maxWidth = '100%';
            el.style.borderRadius = '8px';
          } else {
            el = document.createElement('a');
            el.href = url;
            el.target = '_blank';
            el.textContent = 'فتح المرفق';
            el.className = 'btn';
          }
          preview.appendChild(el);
        } catch(_) {}
      });
    }
    
    window.openModal('vio-modal');
  } catch (error) {
    showAPIMessage(false, 'خطأ', 'تعذر تحميل البيانات: ' + error.message);
  }
};

window.editBranch = async function(id) {
  try {
    const branch = await APIClient.branches.get(id);
    window.__branchEditingId = id;
    
    // ملء الحقول
    const setVal = (elId, v) => {
      const el = document.getElementById(elId);
      if (el) el.value = (v == null) ? '' : v;
    };
    const setChk = (elId, v) => {
      const el = document.getElementById(elId);
      if (el) el.checked = !!v;
    };

    setVal('br-name', branch.name || '');
    setVal('br-type', branch.type || 'basic');
    setVal('br-brand', branch.brand || '');
    setVal('br-email', branch.email || '');
    setVal('br-cost', branch.cost_center || '');
    setVal('br-ops', branch.ops1 || '');
    setVal('br-kpi-target', branch.kpi_target || '');
    setVal('br-kpi-value', branch.kpi_value || '');
    setVal('br-region', branch.region || '');
    setVal('br-city', branch.city || '');
    setVal('br-opening-date', branch.opening_date_expected || '');
    setVal('br-close-date', branch.close_date || '');
    setVal('br-notes', branch.notes || '');
    setChk('br-award-star', !!branch.award_star_manual);

    setVal('br-store-license', branch.store_license || '');
    setVal('br-store-license-expiry', branch.store_license_expiry || '');
    setVal('br-civil-defense', branch.civil_defense || '');
    setVal('br-civil-defense-expiry', branch.civil_defense_expiry || '');

    setVal('br-vertical-sign-exists', branch.vertical_sign_exists ? 'yes' : 'no');
    setVal('br-vertical-sign-length', branch.vertical_sign_length || '');
    setVal('br-vertical-sign-width', branch.vertical_sign_width || '');
    setVal('br-vertical-sign-unit', branch.vertical_sign_unit || 'm');
    try {
      const vs = document.getElementById('br-vertical-sign-exists');
      if (vs) vs.dispatchEvent(new Event('change'));
    } catch (_) {}

    setVal('br-24h-permit', branch.permit_24h || '');
    setVal('br-24h-permit-expiry', branch.permit_24h_expiry || '');
    setVal('br-24h-cost', branch.permit_24h_cost || '');

    setVal('br-delivery-permit', branch.delivery_permit || '');
    setVal('br-delivery-permit-expiry', branch.delivery_permit_expiry || '');
    setVal('br-delivery-cost', branch.delivery_permit_cost || '');

    setVal('br-outdoor-permit', branch.outdoor_permit || '');
    setVal('br-outdoor-expiry', branch.outdoor_permit_expiry || '');
    setVal('br-outdoor-area', branch.outdoor_area || '');
    setVal('br-outdoor-cost', branch.outdoor_permit_cost || '');

    if (typeof window.renderAdPermitsFromData === 'function') {
      window.renderAdPermitsFromData(branch.ad_permits || []);
    }
    
    window.openModal('br-modal');
    try { var lg = document.getElementById('br-brand-logo-file'); if (lg) lg.value = ''; } catch(_){}
    try { if (typeof brRenderBrandLogoPreview === 'function') brRenderBrandLogoPreview(id); } catch(_){}
  } catch (error) {
    showAPIMessage(false, 'خطأ', 'تعذر تحميل البيانات: ' + error.message);
  }
};

/**
 * دوال الحذف
 */
window.deleteViolationRecord = async function(id) {
  if (await deleteRecord('violations', id)) {
    renderViolationsTableAPI();
  }
};

window.deleteBranchRecord = async function(id) {
  if (await deleteRecord('branches', id)) {
    renderBranchesTableAPI();
  }
};

window.deleteEmployeeRecord = async function(id) {
  if (await deleteRecord('employees', id)) {
    renderEmployeesTableAPI();
  }
};

window.deleteLicenseRecord = async function(id) {
  if (await deleteRecord('licenses', id)) {
    renderLicensesTableAPI();
  }
};

window.deleteHousingRecord = async function(id) {
  if (await deleteRecord('housings', id)) {
    renderHousingsTableAPI();
  }
};

window.deleteTransportRecord = async function(id) {
  if (await deleteRecord('transports', id)) {
    renderTransportsTableAPI();
  }
};

console.log('✓ API-Based Data Rendering Functions loaded successfully');
