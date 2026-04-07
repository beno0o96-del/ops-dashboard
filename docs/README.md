# 🎯 نظام إدارة العمليات - Ops Dashboard

## 🚀 ابدأ الآن!

### التشغيل السريع

```bash
cd backend
php artisan serve
```

ثم افتح: **http://localhost:8000/admin.html**

أو باستخدام PHP (port 8080):
```bash
php -S localhost:8080 -t public
```

افتح: **http://localhost:8080/admin.html**

## 📚 الملفات المهمة

### 📖 دليل المستخدم
- **[SUMMARY.md](./SUMMARY.md)** - ملخص شامل لما تم إنجازه ✅
- **[UNIFIED_SAVE_SYSTEM.md](./UNIFIED_SAVE_SYSTEM.md)** - شرح النظام الجديد
- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - دليل التثبيت والتشغيل

### 🧪 الاختبار
افتح في المتصفح: **http://localhost:8080/test-api.html**

يحتوي على اختبارات سريعة للنظام

### 💻 الملفات الرئيسية

#### المتطبق
- `admin.html` - لوحة الإدارة الرئيسية
- `violations.html` - صفحة المخالفات
- `branches.html` - صفحة الفروع
- `employees.html` - صفحة الموظفين
- `licenses.html` - صفحة الرخص
- `housings.html` - صفحة السكنات
- `transports.html` - صفحة المواصلات

#### ملفات JavaScript الجديدة
```javascript
js/
├── api-client.js       // عميل API موحد
├── unified-saves.js    // دوال الحفظ
├── render-api.js       // دوال العرض
└── helpers.js          // دوال مساعدة
```

#### الخادم
```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── ViolationController.php
│   │   ├── BranchController.php
│   │   ├── EmployeeController.php
│   │   ├── LicenseController.php
│   │   ├── HousingController.php
│   │   └── TransportController.php
│   └── Models/
│       ├── Violation.php
│       ├── Branch.php
│       ├── Employee.php
│       ├── License.php
│       ├── Housing.php
│       └── Transport.php
├── routes/
│   └── api.php         // جميع المسارات
└── database/
    ├── migrations/
    └── seeders/
```

## 🎯 الميزات الرئيسية

### ✨ نظام الحفظ الموحد
- جميع الأقسام تستخدم نفس نمط الحفظ
- حفظ آمن في قاعدة البيانات MySQL
- دعم التعديل والحذف
- معالجة أخطاء تلقائية

### 📊 الأقسام المدعومة
- ✅ المخالفات (Violations)
- ✅ الفروع (Branches)
- ✅ الموظفين (Employees)
- ✅ الرخص والعقود (Licenses & Contracts)
- ✅ السكنات (Housings)
- ✅ المواصلات (Transports)
- ✅ المهام (Tasks)

### 🔒 الأمان
- بيانات محفوظة بأمان في قاعدة البيانات
- التحقق من صحة البيانات على الخادم
- حماية من الأخطاء الشائعة

## 📱 كيفية الاستخدام

### إضافة مخالفة جديدة
1. افتح **admin.html**
2. اضغط "إضافة مخالفة"
3. ملأ البيانات المطلوبة
4. اضغط "حفظ"
5. ستظهر الرسالة: "تم حفظ المخالفة بنجاح"

### تعديل مخالفة موجودة
1. افتح جدول المخالفات
2. اضغط "تعديل" على السطر المطلوب
3. عدّل البيانات
4. اضغط "حفظ"

### حذف مخالفة
1. افتح جدول المخالفات
2. اضغط "حذف" على السطر المطلوب
3. أكد الحذف

## 🔧 استكشاف الأخطاء

### الخادم لا يستجيب
```bash
# تأكد من تشغيل خادم Laravel
cd backend
php artisan serve
```

### قاعدة البيانات فارغة
```bash
cd backend
php artisan migrate:refresh --force
```

### الملفات لا تُحمل
- تحقق من اسم الملف والمسار
- تأكد من المجلد الصحيح
- استخدم أداة F12 (Developer Tools) للتحقق

## 📊 التقنيات المستخدمة

### Frontend
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Fetch API

### Backend
- PHP 8.1+
- Laravel 12
- MySQL 8.0+
- Eloquent ORM

### أدوات
- Composer
- Node.js (اختياري)
- Git

## 📞 الدعم والمساعدة

للمزيد من المعلومات والتفاصيل:
- اقرأ **SUMMARY.md** لملخص شامل
- اقرأ **UNIFIED_SAVE_SYSTEM.md** لشرح النظام
- اقرأ **INSTALLATION_GUIDE.md** لدليل التثبيت

## 🎓 أمثلة الكود

### حفظ بيانات جديدة
```javascript
// من داخل HTML form
<button onclick="saveViolation()">حفظ</button>
```

### جلب البيانات
```javascript
const violations = await APIClient.violations.list();
console.log(violations);
```

### عرض البيانات في جدول
```javascript
<tbody id="violations-table-body"></tbody>

<script>
  window.addEventListener('load', async () => {
    await renderViolationsTableAPI();
  });
</script>
```

## ✅ قائمة المهام المنجزة

### النظام الأساسي
- [x] نقل من localStorage إلى MySQL
- [x] إنشاء API موحد
- [x] دوال حفظ موحدة
- [x] دوال عرض محدثة
- [x] دوال مساعدة

### التوثيق
- [x] دليل النظام الموحد
- [x] دليل التثبيت
- [x] ملخص شامل
- [x] أمثلة الاستخدام

### الاختبار
- [x] صفحة اختبار تفاعلية
- [x] اختبارات API
- [x] التحقق من قاعدة البيانات

## 🚀 الخطوات التالية

- [ ] إضافة تسجيل الدخول (Authentication)
- [ ] نظام الأدوار والصلاحيات (Roles & Permissions)
- [ ] سجل النشاط (Activity Log)
- [ ] نظام الإخطارات
- [ ] التقارير والإحصائيات
- [ ] تصدير البيانات (PDF/Excel)
- [ ] تطبيق الهاتف المحمول

## 📝 الترخيص

هذا المشروع خاص بـ Olayan Group

---

**الإصدار:** 1.0  
**آخر تحديث:** فبراير 2026  
**الحالة:** ✅ جاهز للاستخدام الإنتاجي

**سؤال؟** اقرأ التوثيق أعلاه أو تحقق من أكواد الأمثلة.
