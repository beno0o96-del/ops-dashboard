
# 🚀 دليل التثبيت والتشغيل السريع

## المتطلبات

- PHP 8.1+
- MySQL 8.0+
- Composer
- Node.js (اختياري)

## خطوات التشغيل

### 1. تشغيل Laravel Server

```bash
cd backend
php artisan serve
```

سيتم تشغيل الخادم على: `http://localhost:8000`

**أو استخدام PHP built-in server على port 8080:**

```bash
cd backend
php -S localhost:8080 -t public
```

### 2. فتح الموقع

```
http://localhost:8080/
```

### 3. الدخول إلى لوحة الإدارة

```
http://localhost:8080/admin.html
```

## اختبار النظام

### صفحة الاختبار الموصى بها

```
http://localhost:8080/test-api.html
```

تحتوي على اختبارات سريعة لـ:
- ✅ اتصال API
- ✅ إنشاء مخالفة
- ✅ جلب المخالفات
- ✅ إنشاء فرع
- ✅ جلب الفروع

### اختبار يدوي باستخدام curl

```bash
# اختبار اتصال
curl http://localhost:8080/api/violations

# إنشاء مخالفة
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "تجاوز السرعة",
    "amount": 500,
    "branch": "الرياض"
  }'

# جلب مخالفة واحدة
curl http://localhost:8080/api/violations/1

# تحديث مخالفة
curl -X PUT http://localhost:8080/api/violations/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 600}'

# حذف مخالفة
curl -X DELETE http://localhost:8080/api/violations/1
```

## قاعدة البيانات

### إعادة تعيين قاعدة البيانات

```bash
cd backend
php artisan migrate:refresh --force
```

⚠️ **تحذير:** هذا سيحذف جميع البيانات!

### تشغيل الـ Seeders (اختياري)

```bash
php artisan db:seed
```

### التحقق من البيانات

```bash
# استخدام Laravel Tinker
php artisan tinker

# ثم اكتب:
DB::table('violations')->count()
DB::table('branches')->select('id', 'name', 'type')->get()
```

## حل المشاكل الشائعة

### ❌ "تعذر الاتصال بالسيرفر"

✅ **الحل:**
1. تأكد من تشغيل Laravel: `php artisan serve`
2. تأكد من port (8080 أم 8000)
3. تحقق من console browser للأخطاء

### ❌ "CORS Error"

✅ **الحل:**
- تأكد من تفعيل CORS في `config/cors.php`
- تحقق من `routes/api.php`

### ❌ "404 Not Found"

✅ **الحل:**
1. تحقق من المسار الصحيح
2. تأكد من أن الملفات موجودة في `public/`
3. تحقق من `routes/api.php`

### ❌ "Validation Error"

✅ **الحل:**
- تحقق من الحقول المطلوبة في Controller
- تأكد من صيغة البيانات JSON

## ملفات مهمة

| الملف | الوصف |
|------|---------|
| `admin.html` | لوحة الإدارة الرئيسية |
| `violations.html` | صفحة المخالفات |
| `test-api.html` | صفحة الاختبار |
| `js/api-client.js` | عميل API |
| `js/unified-saves.js` | دوال الحفظ |
| `backend/routes/api.php` | تعريف المسارات |
| `backend/app/Http/Controllers/` | المتحكمات |
| `backend/app/Models/` | النماذج |

## المسارات المتاحة

```
GET    /api/violations              - جلب جميع المخالفات
POST   /api/violations              - إنشاء مخالفة جديدة
GET    /api/violations/{id}         - جلب مخالفة واحدة
PUT    /api/violations/{id}         - تحديث مخالفة
DELETE /api/violations/{id}         - حذف مخالفة
POST   /api/violations/{id}/paid    - تحديث حالة الدفع
POST   /api/violations/{id}/archive - أرشفة مخالفة

GET    /api/branches                - جلب جميع الفروع
POST   /api/branches                - إنشاء فرع جديد
GET    /api/branches/{id}           - جلب فرع واحد
PUT    /api/branches/{id}           - تحديث فرع
DELETE /api/branches/{id}           - حذف فرع

GET    /api/employees               - جلب جميع الموظفين
POST   /api/employees               - إنشاء موظف جديد
GET    /api/employees/{id}          - جلب موظف واحد
PUT    /api/employees/{id}          - تحديث موظف
DELETE /api/employees/{id}          - حذف موظف

GET    /api/licenses                - جلب جميع الرخص
POST   /api/licenses                - إنشاء رخصة جديدة
PUT    /api/licenses/{id}           - تحديث رخصة
DELETE /api/licenses/{id}           - حذف رخصة

GET    /api/housings                - جلب جميع السكنات
POST   /api/housings                - إنشاء سكن جديد
PUT    /api/housings/{id}           - تحديث سكن
DELETE /api/housings/{id}           - حذف سكن

GET    /api/transports              - جلب جميع وسائل النقل
POST   /api/transports              - إنشاء وسيلة نقل جديدة
PUT    /api/transports/{id}         - تحديث وسيلة نقل
DELETE /api/transports/{id}         - حذف وسيلة نقل
```

## الخطوات التالية

1. ✅ النظام جاهز للاستخدام
2. ⏳ يمكن إضافة Authentication (تسجيل الدخول)
3. ⏳ يمكن إضافة التقارير والتصدير
4. ⏳ يمكن إضافة نظام الإخطارات
5. ⏳ يمكن إضافة logging النشاط

## الدعم

للمزيد من المعلومات:
- اقرأ `UNIFIED_SAVE_SYSTEM.md` 
- اطلع على `laravel_integration_guide.js`
- تفقد أكواد Controllers و Models

---

**آخر تحديث:** فبراير 2026 ✅
