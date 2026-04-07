# ⚠️ استكشاف الأخطاء والمشاكل الشائعة

## 🔴 المشاكل والحلول

### ❌ خطأ: "Cannot read property 'create' of undefined"

**السبب:** `APIClient` لم يتم تحميله بعد

**الحل:**
```html
<!-- ترتيب التحميل الصحيح -->
<script src="js/api-client.js"></script>      <!-- يجب أن يكون أولاً -->
<script src="js/helpers.js"></script>
<script src="js/unified-saves.js"></script>
<script src="js/render-api.js"></script>
<script src="app.js"></script>
```

---

### ❌ خطأ: "POST http://localhost:8000/api/violations 404 (Not Found)"

**السبب 1:** الخادم غير مشغل

**الحل:**
```bash
cd backend
php artisan serve
```

**السبب 2:** المسار خاطئ

**الحل:** تحقق من `routes/api.php`:
```php
Route::apiResource('violations', ViolationController::class);
```

**السبب 3:** Port خاطئ

**الحل:** استخدم http://localhost:8000 أم http://localhost:8080؟

---

### ❌ خطأ: "CORS error"

**السبب:** CORS غير مفعل

**الحل:** تحقق من `config/cors.php`:
```php
'allowed_origins' => ['*'], // أو ['http://localhost:8080']
```

---

### ❌ خطأ: "Modal لا ينفتح"

**السبب:** Modal ID غير موجود

**الحل:** تحقق من HTML:
```html
<div id="vio-modal" class="modal">
  <!-- محتوى Modal -->
</div>
```

**تحقق أيضاً من:**
```javascript
// التأكد من استدعاء الدالة الصحيحة
window.openModal('vio-modal');
```

---

### ❌ خطأ: "جدول فارغ بدون بيانات"

**السبب 1:** البيانات لم تُجلب من API

**الحل:**
```javascript
// استدعِ الدالة عند تحميل الصفحة
window.addEventListener('load', async function() {
  await renderViolationsTableAPI();
});
```

**السبب 2:** قاعدة البيانات فارغة

**الحل:**
```bash
# أضف بيانات اختبار
php artisan db:seed
```

---

### ❌ خطأ: "TypeError: tbody is null"

**السبب:** ID الجدول غير موجود في HTML

**الحل:** تأكد من وجود:
```html
<tbody id="violations-table-body">
  <!-- يتم ملأها من JavaScript -->
</tbody>
```

---

### ❌ خطأ: "Validation error: The amount field is required"

**السبب:** حقل مطلوب فارغ

**الحل:** تحقق من Form:
```html
<input id="vio-amount" type="number" required>
```

وفي JavaScript:
```javascript
const amount = document.getElementById('vio-amount')?.value || '';
if (!amount) {
  showAPIMessage(false, 'خطأ', 'يجب إدخال المبلغ');
  return;
}
```

---

### ❌ خطأ: "Database connection refused"

**السبب:** MySQL غير مشغل

**الحل:**
```bash
# Windows
mysql -u root -p

# أو استخدم XAMPP/WAMP
```

**تحقق من `.env`:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=ops_dashboard
DB_USERNAME=root
DB_PASSWORD=
```

---

### ❌ خطأ: "No such table: violations"

**السبب:** جدول غير موجود

**الحل:**
```bash
cd backend
php artisan migrate
```

---

### ❌ خطأ: "Call to undefined function localStorage"

**السبب:** محاولة استخدام localStorage في PHP

**الحل:** استخدم `Session` أو `Database` بدلاً من `localStorage`:
```javascript
// في JavaScript فقط
localStorage.setItem('key', 'value');

// في PHP استخدم:
Session::put('key', 'value');
```

---

## 🟡 تحذيرات (Warnings) - ليست أخطاء

### ⚠️ تحذير: "Async function without await"

**السبب:** دالة async بدون await

**الحل:**
```javascript
// ❌ خطأ
async function test() {
  APIClient.violations.list();
}

// ✅ صحيح
async function test() {
  await APIClient.violations.list();
}
```

---

### ⚠️ تحذير: "Variable is not used"

**السبب:** متغير معرف لكن غير مستخدم

**الحل:** احذفه أو استخدمه
```javascript
// ❌ خطأ
const unused = 5;

// ✅ صحيح
const multiplier = 5;
const result = amount * multiplier;
```

---

## 🟢 نصائح للمطورين

### ✅ تصحيح الأخطاء بسرعة

1. **افتح Developer Tools** (F12 أو Ctrl+Shift+I)
2. **انظر إلى Console** للأخطاء
3. **انظر إلى Network** لرؤية الطلبات
4. **استخدم Debugger** (F10 للـ Step)

### ✅ استخدم console.log

```javascript
// أضف تصحيح
async function saveViolation() {
  console.log('1. Starting save...');
  const data = { /*...*/ };
  console.log('2. Data collected:', data);
  
  try {
    const result = await APIClient.violations.create(data);
    console.log('3. Save successful:', result);
  } catch (error) {
    console.error('4. Error:', error);
  }
}
```

### ✅ استخدم Try-Catch

```javascript
try {
  // كود قد يفشل
  const data = await APIClient.violations.list();
  console.log(data);
} catch (error) {
  console.error('Error fetching data:', error);
  showAPIMessage(false, 'خطأ', 'تعذر جلب البيانات');
}
```

### ✅ تحقق من الاستجابة

```javascript
const response = await fetch(url);
console.log('Status:', response.status);
console.log('Headers:', response.headers);
const json = await response.json();
console.log('Body:', json);
```

---

## 🔧 أدوات مفيدة للتصحيح

### Browser DevTools
```
F12              - فتح Developer Tools
Ctrl+Shift+I     - فتح في Windows
Cmd+Option+I     - فتح في Mac
```

### قائمة Tabs
- **Console** - لرؤية الأخطاء
- **Network** - لرؤية الطلبات
- **Elements** - لفحص HTML
- **Application** - لرؤية localStorage
- **Debugger** - للخطو في الكود

### أوامر مفيدة في Console

```javascript
// اختبر API
await APIClient.violations.list()

// تحقق من البيانات
localStorage.getItem('cache:violations')

// امسح البيانات
localStorage.clear()

// اعد تحميل الجدول
await renderViolationsTableAPI()
```

---

## 📋 قائمة التحقق

قبل الإبلاغ عن خطأ، تحقق من:

- [ ] هل الخادم مشغل؟ (php artisan serve)
- [ ] هل MySQL مشغل؟ (mysql running)
- [ ] هل قاعدة البيانات موجودة؟ (migrate)
- [ ] هل جميع الملفات محملة بالترتيب الصحيح؟
- [ ] هل المتصفح محدث؟ (Clear cache - Ctrl+Shift+Delete)
- [ ] هل استخدمت البيانات الصحيحة؟
- [ ] هل رسالة الخطأ واضحة؟

---

## 📞 الدعم الفني

إذا استمرت المشكلة:

1. **ارجع للتوثيق:** اقرأ UNIFIED_SAVE_SYSTEM.md
2. **افحص الأكواد:** انظر إلى Controller و Model
3. **جرب اختبار API:** http://localhost:8080/test-api.html
4. **استخدم curl:** لاختبار endpoints مباشرة

---

## 🎯 الحل السريع النهائي

إذا فشل كل شيء:

```bash
# 1. احذف قاعدة البيانات
mysql -u root -p < drop_database.sql

# 2. أعد تشغيل الخادم
cd backend
php artisan migrate:refresh --force

# 3. امسح المتصفح
# Ctrl+Shift+Delete (Windows/Linux)
# Cmd+Shift+Delete (Mac)

# 4. أعد تحميل الصفحة
# F5 (Windows/Linux)
# Cmd+R (Mac)
```

---

**آخر تحديث:** فبراير 2026
**الإصدار:** 1.0
