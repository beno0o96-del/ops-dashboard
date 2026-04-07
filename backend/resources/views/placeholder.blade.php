@extends('layouts.app')

@section('title', $title ?? 'صفحة جديدة')

@section('content')
  <div class="flex flex-col items-center justify-center h-[60vh] text-center">
    <div class="text-6xl mb-4">🚧</div>
    <h1 class="text-3xl font-bold text-white mb-2">{{ $title ?? 'صفحة قيد الإنشاء' }}</h1>
    <p class="text-slate-400 max-w-md">
      هذه الصفحة لم يتم بناؤها بعد. يمكنك استخدامها كقالب لإضافة المحتوى الخاص بـ {{ $title ?? 'هذه الصفحة' }}.
    </p>
    <a href="/dashboard" class="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
      عودة للرئيسية
    </a>
  </div>
@endsection
