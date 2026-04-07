
const baseUrl = (function() {
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

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const text = await response.text();
            console.error(`Failed to create ${endpoint}: ${response.status} ${response.statusText}`);
            console.error('Error details:', text.substring(0, 500)); // Log first 500 chars
            return null;
        }
        
        const json = await response.json();
        console.log(`Created ${endpoint} ID: ${json.id || '?'}`);
        return json;
    } catch (error) {
        console.error(`Error creating ${endpoint}:`, error.message);
        return null;
    }
}

async function seed() {
    console.log('Starting data seeding...');

    // 1. Branches
    const branches = [
        { name: "الرياض الرئيسية", region: "الوسطى", city: "الرياض", brand: "Olayan", cost_center: "CC-101", email: "riyadh@example.com", notes: "الفرع الرئيسي" },
        { name: "جدة فرع التحلية", region: "الغربية", city: "جدة", brand: "Burger King", cost_center: "CC-202", email: "jeddah@example.com", notes: "فرع مزدحم" },
        { name: "الدمام الكورنيش", region: "الشرقية", city: "الدمام", brand: "Olayan", cost_center: "CC-303", email: "dammam@example.com", notes: "يحتاج صيانة" }
    ];

    for (const b of branches) {
        await postData('branches', b);
    }

    // 2. Violations (Mixed paid/unpaid)
    const violations = [
        { type: "البلدية", branch: "الرياض الرئيسية", amount: 500, date: "2023-01-15", paid: false, appeal_status: "under_study", vio_no: "V-1001" },
        { type: "مكتب العمل", branch: "الرياض الرئيسية", amount: 2000, date: "2023-02-20", paid: true, appeal_status: "accepted", vio_no: "V-1002" },
        { type: "الدفاع المدني", branch: "جدة فرع التحلية", amount: 1500, date: "2023-03-05", paid: false, appeal_status: "not_applicable", vio_no: "V-2001" }
    ];

    for (const v of violations) {
        await postData('violations', v);
    }

    // 3. Employees
    const employees = [
        { name: "أحمد علي", role: "مدير فرع", branch: "الرياض الرئيسية", job_title: "مدير" },
        { name: "خالد عمر", role: "كاشير", branch: "الرياض الرئيسية", job_title: "كاشير" },
        { name: "سعيد محمد", role: "طباخ", branch: "جدة فرع التحلية", job_title: "طباخ" },
        { name: "فهد العتيبي", role: "مشرف", branch: "الدمام الكورنيش", job_title: "مشرف" }
    ];

    for (const e of employees) {
        await postData('employees', e);
    }

    // 4. Training
    const training = [
        { course_name: "سلامة الغذاء", date: "2023-03-10", trainer: "د. سامي", branch: "الرياض الرئيسية", location: "الرياض الرئيسية" },
        { course_name: "خدمة العملاء", date: "2023-04-15", trainer: "أ. نورة", branch: "جدة فرع التحلية", location: "جدة فرع التحلية" }
    ];

    for (const t of training) {
        await postData('training', t);
    }

    // 5. Licenses
    const licenses = [
        { name: "رخصة البلدية", number: "LIC-12345", expiry_date: "2024-01-01", status: "valid", branch: "الرياض الرئيسية", type: "رخصة بلدية" },
        { name: "رخصة الدفاع المدني", number: "CIV-999", expiry_date: "2023-12-01", status: "expired", branch: "جدة فرع التحلية", type: "دفاع مدني" }
    ];

    for (const l of licenses) {
        await postData('licenses', l);
    }

    // 6. Contracts
    const contracts = [
        { name: "عقد مكافحة الحشرات", type: "خدمة", end_date: "2024-05-01", branch: "الرياض الرئيسية", vendor: "شركة الصفر" },
        { name: "عقد صيانة التكييف", type: "صيانة", end_date: "2024-06-15", branch: "الدمام الكورنيش", vendor: "الجو البارد" }
    ];

    for (const c of contracts) {
        await postData('contracts', c);
    }

    // 7. Housings
    const housings = [
        { name: "سكن العليا", type: "شقة", capacity: 5, occupied: 3, branch: "الرياض الرئيسية", address: "الرياض - حي العليا", assigned_branches: ["الرياض الرئيسية"] },
        { name: "سكن التحلية", type: "فيلا", capacity: 10, occupied: 8, branch: "جدة فرع التحلية", address: "جدة - التحلية", assigned_branches: ["جدة فرع التحلية"] }
    ];

    for (const h of housings) {
        await postData('housings', h);
    }

    // 8. Transports
    const transports = [
        { name: "سيارة التوصيل 1", car_type: "تويوتا هايلكس", plate_number: "ABC-123", status: "active", branch: "الرياض الرئيسية", assigned_branches: ["الرياض الرئيسية"], driver_name: "محمد خان", model: "2022" },
        { name: "باص الموظفين", car_type: "باص كوستر", plate_number: "XYZ-999", status: "maintenance", branch: "جدة فرع التحلية", assigned_branches: ["جدة فرع التحلية"], driver_name: "علي حسن", model: "2020" }
    ];

    for (const t of transports) {
        await postData('transports', t);
    }

    console.log('Seeding completed!');
}

seed();
