/**
 * Helper functions for branches management
 */

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = (val === null || val === undefined) ? '' : val;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : null;
}

// Alias for backward compatibility
window.editBranch = function(id) {
  if (typeof window.loadBranchForEdit === 'function') {
    window.loadBranchForEdit(id);
  }
};

window.loadBranchForEdit = async function(id) {
  try {
    // 1. Find branch
    let branch = null;
    if (window.App && window.App.store) {
      const list = window.App.store.list('branches');
      if (Array.isArray(list)) {
        branch = list.find(b => String(b.id) === String(id));
      }
    }
    
    // If not found in store, try API or local cache fallback
    if (!branch) {
      try {
        if (typeof APIClient !== 'undefined' && APIClient.branches) {
          const res = await APIClient.branches.get(id);
          branch = res.data || res;
        }
      } catch (e) {
        console.warn('API fetch failed, falling back to local storage', e);
        // Fallback to local storage
        const raw = localStorage.getItem('admin_branches_data');
        const localList = raw ? JSON.parse(raw) : [];
        branch = localList.find(b => String(b.id) === String(id));
      }
    }

    if (!branch) {
      console.error('Branch not found:', id);
      if(typeof toast === 'function') toast('error', 'خطأ', 'لم يتم العثور على بيانات الفرع');
      return;
    }

    // 2. Open Modal (using toggleBranchForm logic if exists, or direct display)
    const modal = document.getElementById('branch-modal'); // Assuming there's a modal, or we scroll to form
    // In admin.html, the form is inline in "branches-content".
    // We should scroll to the form.
    const formSection = document.getElementById('branches-content');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 3. Set global editing ID
    window.__branchEditingId = id;

    // 4. Populate Fields
    // Main Fields
    setValue('br-name', branch.name);
    setValue('br-type', branch.type || 'basic');
    setValue('br-brand', branch.brand);
    setValue('br-region', branch.region);
    setValue('br-city', branch.city);
    setValue('br-cost', branch.cost_center || branch.costCenter);
    setValue('br-email', branch.email);
    
    // OPS / Manager
    setValue('br-ops', branch.ops1 || branch.ops_manager || branch.manager_ops || '');
    setValue('br-ops-manager-name', branch.ops_manager || branch.manager_name || '');
    setValue('br-ops-manager-email', branch.manager_email || '');

    // Vertical Sign
    const vSign = branch.vertical_sign_exists ? 'yes' : 'no';
    setValue('br-vertical-sign-exists', vSign);
    const vWrap = document.getElementById('br-vertical-sign-size-wrap');
    if(vWrap) {
        vWrap.style.display = (vSign === 'yes') ? 'block' : 'none';
        setValue('br-vertical-sign-length', branch.vertical_sign_length);
        setValue('br-vertical-sign-width', branch.vertical_sign_width);
        setValue('br-vertical-sign-unit', branch.vertical_sign_unit || 'm');
    }

    // Dates
    // Check if dates are YYYY-MM-DD or full ISO
    const formatDate = (d) => d ? d.split('T')[0] : '';
    setValue('br-opening-date', formatDate(branch.opening_date_expected || branch.opening_date));
    setValue('br-close-date', formatDate(branch.close_date));

    // Handle Type visibility
    const typeVal = branch.type || 'basic';
    const openWrap = document.getElementById('br-opening-date-wrap');
    const closeWrap = document.getElementById('br-close-date-wrap');
    if(openWrap) openWrap.style.display = (typeVal === 'opening') ? 'block' : 'none';
    if(closeWrap) closeWrap.style.display = (typeVal === 'closed' || branch.closed) ? 'block' : 'none';


    // Licenses & Permits
    setValue('br-store-license', branch.store_license || '');
    setValue('br-store-license-expiry', branch.store_license_expiry || '');
    setValue('br-civil-defense', branch.civil_defense || '');
    setValue('br-civil-defense-expiry', branch.civil_defense_expiry || '');
    setValue('br-24h-permit', branch.permit_24h || '');
    setValue('br-24h-permit-expiry', branch.permit_24h_expiry || '');
    setValue('br-24h-cost', branch.permit_24h_cost || '');
    setValue('br-delivery-permit', branch.delivery_permit || '');
    setValue('br-delivery-permit-expiry', branch.delivery_permit_expiry || '');
    setValue('br-delivery-cost', branch.delivery_permit_cost || '');
    setValue('br-outdoor-permit', branch.outdoor_permit || '');
    setValue('br-outdoor-permit-expiry', branch.outdoor_permit_expiry || '');
    setValue('br-outdoor-area', branch.outdoor_area || '');
    setValue('br-outdoor-cost', branch.outdoor_permit_cost || '');

    // Helper for checkbox sections
    const setSection = (checkId, contentId) => {
        const cb = document.getElementById(checkId);
        const content = document.getElementById(contentId);
        if(cb) {
            cb.checked = false;
            if(content) content.style.display = 'none';
        }
    };

    // Electric
    setSection('br-electric-exists', 'br-electric-content');
    setValue('br-electric-meter', branch.electric_meter_no || '');
    setValue('br-electric-account', branch.electric_account_no || '');

    // Water
    setSection('br-water-exists', 'br-water-content');
    setValue('br-water-meter', branch.water_meter_no || '');
    setValue('br-water-account', branch.water_account_no || '');

    // Clean
    setSection('br-clean-exists', 'br-clean-content');
    setValue('br-clean-contract', branch.clean_contract_no || '');
    setValue('br-clean-expiry', branch.clean_contract_expiry || '');
    setValue('br-clean-status', branch.clean_contract_status || 'valid');

    // Lease
    setSection('br-lease-exists', 'br-lease-content');
    setValue('br-lease-contract', branch.lease_contract_no || '');
    setValue('br-lease-expiry', branch.lease_contract_expiry || '');
    setValue('br-lease-status', branch.lease_contract_status || 'valid');

    // =============================================================
    // Attachments Handling (Standard & Ad Permits)
    // =============================================================
    
    // 1. Standard Attachments
    if (branch.attachments && Array.isArray(branch.attachments)) {
        const attMap = [
            { pv: 'br-unified-file-preview', cat: 'unified_code' },
            { pv: 'br-brand-logo-preview', cat: 'brand_logo' },
            { pv: 'br-store-license-preview', cat: 'store_license' },
            { pv: 'br-civil-defense-preview', cat: 'civil_defense' },
            { pv: 'br-vertical-sign-preview', cat: 'vertical_sign' },
            { pv: 'br-24h-permit-preview', cat: 'permit_24h' },
            { pv: 'br-delivery-permit-preview', cat: 'delivery_permit' },
            { pv: 'br-outdoor-preview', cat: 'outdoor_permit' },
            { pv: 'br-electric-preview', cat: 'electric_meter' },
            { pv: 'br-water-preview', cat: 'water_meter' },
            { pv: 'br-clean-preview', cat: 'clean_contract' },
            { pv: 'br-lease-preview', cat: 'lease_contract' }
        ];
        
        attMap.forEach(function(m){
            const pvEl = document.getElementById(m.pv);
            if(pvEl) {
                // Clear existing content to avoid duplication
                pvEl.innerHTML = '';
                const relevant = branch.attachments.filter(a => a.category === m.cat);
                if(relevant.length && typeof window.brRenderSavedAttachments === 'function') {
                    window.brRenderSavedAttachments(pvEl, relevant);
                }
            }
        });
    }

    // 2. Ad Permits & Their Attachments
    const adList = document.getElementById('ad-permits-list');
    if(adList) {
        adList.innerHTML = ''; // Clear existing cards
        const permits = Array.isArray(branch.ad_permits) ? branch.ad_permits : [];
        
        if(permits.length > 0) {
            if(typeof window.createAdPermitCard === 'function') {
                permits.forEach(p => {
                    // Create card (appends to list automatically)
                    window.createAdPermitCard(p);
                    
                    // Render attachments for this permit
                    if (branch.attachments && Array.isArray(branch.attachments) && p.id) {
                        const fileInput = adList.querySelector(`input[data-permit-id="${p.id}"]`);
                        if(fileInput) {
                            const card = fileInput.closest('[data-role="ad-permit"]');
                            if(card) {
                                const pv = card.querySelector('[data-role="ad-permit-preview"]');
                                if(pv) {
                                    // Match category 'ad_permit:ID'
                                    const relevant = branch.attachments.filter(a => a.category === 'ad_permit:' + p.id);
                                    if(relevant.length && typeof window.brRenderSavedAttachments === 'function') {
                                        window.brRenderSavedAttachments(pv, relevant);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        
        if(typeof window.updateAdPermitsEmptyState === 'function') {
            window.updateAdPermitsEmptyState();
        }
    }


    // Update Button Text
    const saveBtn = document.getElementById('btn-branch-save');
    if (saveBtn) {
      saveBtn.textContent = 'حفظ التعديلات';
      saveBtn.classList.remove('btn-primary');
      saveBtn.classList.add('bg-green-600', 'hover:bg-green-500', 'text-white');
    }

    if (typeof toast === 'function') toast('info', 'تعديل', 'جاري تعديل بيانات الفرع: ' + branch.name);

  } catch (error) {
    console.error('Error loading branch for edit:', error);
    if(typeof toast === 'function') toast('error', 'خطأ', 'حدث خطأ أثناء تحميل بيانات الفرع');
  }
};

window.setupBranchEventListeners = function() {
    // New Branch Button
    const btnNew = document.getElementById('btn-branch-new');
    if (btnNew) {
        btnNew.onclick = function() {
            window.__branchEditingId = null;
            // Reset form
            const inputs = document.querySelectorAll('#branches-content input:not([type="button"]), #branches-content select, #branches-content textarea');
            inputs.forEach(input => {
                if(input.type === 'checkbox') input.checked = false;
                else input.value = '';
            });
            
            // Reset sections visibility
            const sections = [
                'br-vertical-sign-size-wrap',
                'br-opening-date-wrap',
                'br-close-date-wrap',
                'br-electric-content',
                'br-water-content',
                'br-clean-content',
                'br-lease-content'
            ];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.style.display = 'none';
            });
            
            // Reset Button
            const saveBtn = document.getElementById('btn-branch-save');
            if (saveBtn) {
                saveBtn.textContent = 'حفظ الفرع';
                saveBtn.classList.add('btn-primary');
                saveBtn.classList.remove('bg-green-600', 'hover:bg-green-500', 'text-white');
            }
            
            if (typeof toast === 'function') toast('info', 'جديد', 'وضع إضافة فرع جديد');
        };
    }

    // Toggle Sections Listeners
    const toggles = [
        { check: 'br-vertical-sign-exists', content: 'br-vertical-sign-size-wrap', condition: val => val === 'yes' },
        { check: 'br-electric-exists', content: 'br-electric-content', isCheckbox: true },
        { check: 'br-water-exists', content: 'br-water-content', isCheckbox: true },
        { check: 'br-clean-exists', content: 'br-clean-content', isCheckbox: true },
        { check: 'br-lease-exists', content: 'br-lease-content', isCheckbox: true }
    ];

    toggles.forEach(t => {
        const el = document.getElementById(t.check);
        if(el) {
            el.addEventListener('change', function() {
                const content = document.getElementById(t.content);
                if(content) {
                    if(t.isCheckbox) {
                        content.style.display = this.checked ? 'grid' : 'none';
                    } else {
                        content.style.display = t.condition(this.value) ? 'block' : 'none';
                    }
                }
            });
        }
    });

    // Branch Type Listener
    const typeSelect = document.getElementById('br-type');
    if(typeSelect) {
        typeSelect.addEventListener('change', function() {
            const val = this.value;
            const openWrap = document.getElementById('br-opening-date-wrap');
            const closeWrap = document.getElementById('br-close-date-wrap');
            if(openWrap) openWrap.style.display = (val === 'opening') ? 'block' : 'none';
            if(closeWrap) closeWrap.style.display = (val === 'closed') ? 'block' : 'none';
        });
    }
};

/**
 * تبديل حالة إخفاء/إظهار الفرع
 */
window.toggleBranchVisibility = async function(id, currentHiddenStatus) {
  try {
    const newHiddenStatus = !currentHiddenStatus;
    await APIClient.branches.update(id, { hidden: newHiddenStatus });
    if (typeof toast === 'function') toast('success', 'تم', newHiddenStatus ? 'تم إخفاء الفرع' : 'تم إظهار الفرع');
    if (typeof window.renderBranchesTableAPI === 'function') window.renderBranchesTableAPI();
  } catch (error) {
    console.error('Error toggling branch visibility:', error);
    if (typeof toast === 'function') toast('error', 'خطأ', 'فشل تحديث حالة الفرع');
  }
};

/**
 * تأكيد حذف الفرع (UI Interaction)
 */
window.confirmDeleteBranch = function(id, btnElement) {
  const wrapper = btnElement.closest('.relative') || btnElement.parentElement; // Fallback
  if (!wrapper) return;

  if (!wrapper.dataset.original) {
    wrapper.dataset.original = wrapper.innerHTML;
  }

  wrapper.innerHTML = `
    <div class="flex items-center gap-1 bg-slate-800 rounded p-1 absolute top-0 right-0 z-10 shadow-lg border border-slate-700" style="display:flex; gap:4px; align-items:center;">
      <button onclick="window.performDeleteBranch('${id}')" class="text-red-400 hover:text-red-300 p-1" title="تأكيد الحذف" style="color:#f87171;">
        🗑️ تأكيد
      </button>
      <button onclick="window.cancelDeleteBranch(this)" class="text-slate-400 hover:text-white p-1" title="إلغاء" style="color:#94a3b8;">
        ❌
      </button>
    </div>
  `;
};

window.cancelDeleteBranch = function(btnElement) {
  const wrapper = btnElement.closest('.relative') || btnElement.parentElement?.parentElement;
  if (wrapper && wrapper.dataset.original) {
    wrapper.innerHTML = wrapper.dataset.original;
  }
};

window.performDeleteBranch = async function(id) {
  try {
    if(confirm('هل أنت متأكد تماماً من حذف هذا الفرع؟ لا يمكن التراجع عن هذا الإجراء.')) {
        if(typeof APIClient !== 'undefined' && APIClient.branches) {
            await APIClient.branches.delete(id);
        } else {
            // Local fallback
            const raw = localStorage.getItem('admin_branches_data');
            let list = raw ? JSON.parse(raw) : [];
            list = list.filter(b => String(b.id) !== String(id));
            localStorage.setItem('admin_branches_data', JSON.stringify(list));
        }
        
        if (typeof toast === 'function') toast('success', 'تم', 'تم حذف الفرع بنجاح');
        if (typeof window.renderBranchesTableAPI === 'function') window.renderBranchesTableAPI();
        else if (typeof window.renderBranchesTable === 'function') window.renderBranchesTable();
    }
  } catch (error) {
    console.error('Error deleting branch:', error);
    if (typeof toast === 'function') toast('error', 'خطأ', 'فشل حذف الفرع');
  }
};

// Also define deleteBranchRecord which is used in render-api.js
window.deleteBranchRecord = window.performDeleteBranch;


// Initialize listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if(typeof window.setupBranchEventListeners === 'function') {
      window.setupBranchEventListeners();
  }
});

// =============================================================
// Fix: Date Input Handling (Arabic to English, Format YYYY/MM/DD)
// =============================================================
(function(){
  if(window.__dateInputFixWired) return;
  window.__dateInputFixWired = true;
  
  // Use event delegation on document
  document.addEventListener('input', function(e){
    if(e.target && e.target.classList.contains('date-input-fix')){
      var input = e.target;
      var val = input.value;
      
      // 1. Convert Arabic digits to English
      val = val.replace(/[٠-٩]/g, function(d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
      
      // 2. Remove any non-digit characters
      var clean = val.replace(/\D/g, '');
      
      // 3. Limit to 8 digits (YYYYMMDD)
      if(clean.length > 8) clean = clean.substring(0, 8);
      
      // 4. Format as YYYY/MM/DD
      var formatted = '';
      if(clean.length > 0) {
        formatted = clean.substring(0, 4);
        if(clean.length >= 5) formatted += '/' + clean.substring(4, 6);
        if(clean.length >= 7) formatted += '/' + clean.substring(6, 8);
      }
      
      // 5. Update value if changed
      if(input.value !== formatted) {
        input.value = formatted;
      }
    }
  });

  // Hijri to Gregorian Conversion on Blur
  document.addEventListener('change', function(e){
    if(e.target && e.target.classList.contains('date-input-fix')){
      var val = e.target.value;
      if(!val || val.length !== 10) return;
      
      var parts = val.split('/');
      if(parts.length !== 3) return;
      
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10);
      var d = parseInt(parts[2], 10);
      
      // Check if Hijri (Year between 1300 and 1500)
      if(y > 1300 && y < 1500) {
        // Simple Hijri to Gregorian approximation (Tabular Islamic)
        var jd = Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m - Math.floor((m - 1) / 2) + d + 1948440 - 385;
        
        // Convert JD to Gregorian
        var l = jd + 68569;
        var n = Math.floor((4 * l) / 146097);
        l = l - Math.floor((146097 * n + 3) / 4);
        var i = Math.floor((4000 * (l + 1)) / 1461001);
        l = l - Math.floor((1461 * i) / 4) + 31;
        var j = Math.floor((80 * l) / 2447);
        var day = l - Math.floor((2447 * j) / 80);
        l = Math.floor(j / 11);
        var month = j + 2 - 12 * l;
        var year = 100 * (n - 49) + i + l;
        
        // Pad and set
        var gVal = year + '/' + String(month).padStart(2,'0') + '/' + String(day).padStart(2,'0');
        
        // Validate Date (JS Date handles overflow e.g. June 31 -> July 1)
        var checkDate = new Date(year, month - 1, day);
        var checkY = checkDate.getFullYear();
        var checkM = checkDate.getMonth() + 1;
        var checkD = checkDate.getDate();
        
        // Re-format to ensure validity (e.g. leap years, month lengths)
        var finalVal = checkY + '/' + String(checkM).padStart(2,'0') + '/' + String(checkD).padStart(2,'0');
        
        e.target.value = finalVal;
        
        // Trigger input event to update any bound listeners
        var eventInput = new Event('input', { bubbles: true });
        e.target.dispatchEvent(eventInput);

        // Trigger change event to ensure validation logic runs (e.g. daysBetween)
        var eventChange = new Event('change', { bubbles: true });
        e.target.dispatchEvent(eventChange);
        
        if(typeof toast === 'function') toast('success', 'تم التحويل', 'تم تحويل التاريخ من هجري (' + val + ') إلى ميلادي (' + finalVal + ')');
      }
    }
  });
})();
