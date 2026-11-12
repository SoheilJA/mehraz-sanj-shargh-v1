/**
 * Site navigation map. Rendered by components/navbar.js on every page.
 * `match` is used for active-state detection (pathname prefixes).
 */
export const navigation = {
  items: [
    { type: 'link', label: 'خانه', href: '/index.html', match: ['/', '/index.html'] },
    {
      type: 'dropdown',
      label: 'خدمات',
      href: '/services/index.html',
      match: ['/services/'],
      children: [
        { code: 'SRV-01', label: 'پیاده‌سازی و کنترل هندسی', desc: 'آکس‌بندی، کنترل شاقولی و تراز هندسی سازه‌ها', href: '/services/geometric-control.html' },
        { code: 'SRV-02', label: 'توپوگرافی و As-Built', desc: 'برداشت وضع موجود و مستندسازی ازبیلت', href: '/services/topographic-surveying.html' },
        { code: 'SRV-03', label: 'نقشه‌های UTM و امور ثبتی', desc: 'کاداستر، تفکیک اراضی و جانمایی املاک', href: '/services/utm-cadastre.html' },
        { code: 'SRV-04', label: 'محاسبه احجام خاکی', desc: 'خاکبرداری، خاکریزی و مدل‌سازی سطوح', href: '/services/earthwork-calculation.html' },
      ],
      footer: { label: 'همه خدمات تخصصی', href: '/services/index.html' },
    },
    {
      type: 'dropdown',
      label: 'پروژه‌ها',
      href: '/projects/index.html',
      match: ['/projects/'],
      children: [
        { code: 'PRJ', label: 'کنترل هندسی سازه‌ها', href: '/projects/index.html?cat=structural' },
        { code: 'PRJ', label: 'پایش گودبرداری', href: '/projects/index.html?cat=excavation' },
        { code: 'PRJ', label: 'زیرساخت صنعتی', href: '/projects/index.html?cat=industrial' },
        { code: 'PRJ', label: 'توپوگرافی و ژئودتیک', href: '/projects/index.html?cat=geodetic' },
        { code: 'PRJ', label: 'کاداستر و امور ثبتی', href: '/projects/index.html?cat=cadastre' },
        { code: 'PRJ', label: 'ازبیلت و مدل‌سازی', href: '/projects/index.html?cat=asbuilt' },
      ],
      footer: { label: 'آرشیو کامل پروژه‌ها', href: '/projects/index.html' },
    },
    { type: 'link', label: 'مجله', href: '/journal/index.html', match: ['/journal/'] },
    {
      type: 'dropdown',
      label: 'درباره ما',
      href: '/about.html',
      match: ['/about.html', '/equipment.html', '/faq.html'],
      children: [
        { code: 'ABT', label: 'درباره شرکت', desc: 'معرفی مهراز سنج شرق و رویکرد مهندسی', href: '/about.html' },
        { code: 'EQP', label: 'تجهیزات و فناوری', desc: 'توتال استیشن، GNSS و اکیپ‌های فیلد', href: '/equipment.html' },
        { code: 'FAQ', label: 'پرسش‌های متداول', desc: 'پاسخ به پرسش‌های رایج کارفرمایان', href: '/faq.html' },
      ],
      footer: { label: 'همه صفحات معرفی', href: '/about.html' },
    },
    { type: 'link', label: 'تماس', href: '/contact.html', match: ['/contact.html'] },
  ],
  cta: { label: 'درخواست مشاوره', href: '/contact.html' },
  search: { label: 'جستجو در سایت', href: '/search.html' },
}
