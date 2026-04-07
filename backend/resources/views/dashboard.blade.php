@extends('layouts.app')

@section('title', 'الرئيسية')

@section('content')
  <section class="hero-section">
    <h1 class="hero-title" data-en="Compliance & Operational Risk Dashboard" data-ar="لوحة الالتزام والمخاطر التشغيلية">Compliance & Operational Risk Dashboard</h1>
    <div class="hero-tagline">
      <span class="dot">•</span>
      <span data-en="Don’t wait for opportunity, create it" data-ar="لا تنتظر الفرصة، بل اصنعها">Don’t wait for opportunity, create it</span>
    </div>
    <div class="hero-divider"></div>
  </section>

  <section class="quick-access">
    <div class="qa-title" data-en="Quick Access" data-ar="وصول سريع">Quick Access</div>
    <div class="qa-grid">
      <a href="{{ url('/violations') }}" class="qa-card">
        <div class="qa-icon">⚠️</div>
        <div class="qa-head" data-en="Violations" data-ar="المخالفات">Violations</div>
        <div class="qa-sub" data-en="Types • Branches • Amounts" data-ar="الأنواع • الفروع • المبالغ">Types • Branches • Amounts</div>
      </a>
      <a href="{{ url('/training') }}" class="qa-card">
        <div class="qa-icon">🏥</div>
        <div class="qa-head" data-en="Training & Health" data-ar="التدريب والصحة">Training & Health</div>
        <div class="qa-sub" data-en="KPIs • OHS" data-ar="المؤشرات • السلامة">KPIs • OHS</div>
      </a>
      <a href="{{ url('/branches') }}" class="qa-card">
        <div class="qa-icon">🏬</div>
        <div class="qa-head" data-en="Branches" data-ar="الفروع">Branches</div>
        <div class="qa-sub" data-en="Operating • Coverage" data-ar="تشغيل • تغطية">Operating • Coverage</div>
      </a>
    </div>
  </section>

  <section class="exec-kpis">
    <div class="kpis-title" data-en="Executive KPIs – 2025" data-ar="مؤشرات تنفيذية – 2025">Executive KPIs – 2025</div>
    <div class="kpis-grid">
      <div class="kpi-card">
        <div class="kpi-label" data-en="OPEN VIOLATIONS" data-ar="مخالفات مفتوحة">OPEN VIOLATIONS</div>
        <div class="kpi-value" id="kpi-open">15</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label" data-en="CLOSED VIOLATIONS" data-ar="مخالفات مغلقة">CLOSED VIOLATIONS</div>
        <div class="kpi-value" id="kpi-closed">128</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label" data-en="TOTAL FINES (SAR)" data-ar="إجمالي الغرامات (ريال)">TOTAL FINES (SAR)</div>
        <div class="kpi-value" id="kpi-fines">335,150</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label" data-en="HEALTH CARDS COMPLIANCE" data-ar="التزام بطاقات الصحة">HEALTH CARDS COMPLIANCE</div>
        <div class="kpi-value" id="kpi-health">74%</div>
      </div>
    </div>
  </section>

  <section class="action-section" style="text-align: center; margin-top: 30px; padding-bottom: 20px;">
    <a href="#" class="open-services" style="display: inline-block; text-decoration: none; font-weight: bold;" data-en="View Detailed Report" data-ar="عرض التقرير المفصل">View Detailed Report</a>
  </section>
@endsection

@push('scripts')
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.App && typeof window.App.updateIndexKPIs === 'function') {
      window.App.updateIndexKPIs();
    }
  });
</script>
@endpush
