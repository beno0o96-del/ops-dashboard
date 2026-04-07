@extends('layouts.app')

@section('title', 'المساعدة والدعم')

@section('content')
<div class="max-w-4xl mx-auto space-y-6">
    <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">كيف يمكننا مساعدتك؟</h1>
        <p class="text-slate-400">إجابات على الأسئلة الشائعة ومعلومات الدعم الفني</p>
    </div>

    <!-- FAQ Section -->
    <div class="grid gap-6 md:grid-cols-2">
        <!-- Card 1 -->
        <div class="bg-slate-800/50 p-6 rounded-xl border border-white/10">
            <div class="flex items-start gap-4">
                <span class="text-2xl">🔑</span>
                <div>
                    <h3 class="font-bold text-white text-lg mb-2">مشكلة في تسجيل الدخول؟</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">
                        تأكد من استخدام اسم المستخدم `admin` وكلمة المرور `123456`. إذا نسيت كلمة المرور، يرجى التواصل مع مشرف النظام لإعادة تعيينها.
                    </p>
                </div>
            </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-slate-800/50 p-6 rounded-xl border border-white/10">
            <div class="flex items-start gap-4">
                <span class="text-2xl">📋</span>
                <div>
                    <h3 class="font-bold text-white text-lg mb-2">كيف أضيف مهمة جديدة؟</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">
                        انتقل إلى صفحة "المهام" واضغط على زر "مهمة جديدة +" في الزاوية اليسرى العليا. (ملاحظة: قد تكون هذه الصلاحية للمشرفين فقط).
                    </p>
                </div>
            </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-slate-800/50 p-6 rounded-xl border border-white/10">
            <div class="flex items-start gap-4">
                <span class="text-2xl">📱</span>
                <div>
                    <h3 class="font-bold text-white text-lg mb-2">تطبيق الجوال؟</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">
                        النظام متوافق مع جميع المتصفحات على الجوال. يمكنك إضافة اختصار للصفحة الرئيسية على شاشة هاتفك للوصول السريع.
                    </p>
                </div>
            </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-slate-800/50 p-6 rounded-xl border border-white/10">
            <div class="flex items-start gap-4">
                <span class="text-2xl">💬</span>
                <div>
                    <h3 class="font-bold text-white text-lg mb-2">الدعم المباشر</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">
                        لأي مشاكل تقنية عاجلة، يرجى إرسال بريد إلكتروني إلى <a href="mailto:support@olayan.com" class="text-blue-400 hover:underline">support@olayan.com</a> أو الاتصال على التحويلة 1234.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Contact Box -->
    <div class="mt-10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 rounded-2xl border border-white/10 text-center">
        <h2 class="text-2xl font-bold text-white mb-4">لم تجد إجابة؟</h2>
        <p class="text-slate-300 mb-6">فريق الدعم الفني جاهز لمساعدتك في أي وقت.</p>
        <button class="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
            فتح تذكرة دعم فني
        </button>
    </div>
</div>
@endsection
