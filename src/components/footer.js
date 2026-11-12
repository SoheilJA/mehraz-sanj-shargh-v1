/**
 * Footer component — rendered on every page from company/service data.
 */
import { company } from '../data/company.js'
import { navigation } from '../data/navigation.js'
import { services } from '../data/services.js'
import { icon } from '../utils/dom.js'

export function mountFooter() {
  const footer = document.getElementById('site-footer')
  if (!footer) return

  const yearFa = '۱۴۰۵'

  const quickLinks = navigation.items
    .map((i) => `<li><a class="footer-link" href="${i.href}">${i.label}</a></li>`)
    .join('')

  const serviceLinks = services
    .map((s) => `<li><a class="footer-link" href="/services/${s.slug}.html">${s.title}</a></li>`)
    .join('')

  footer.innerHTML = `
    <div class="blueprint-grid-dark absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true"></div>
    <div class="wrap relative pt-16 pb-8">
      <div class="grid gap-12 lg:grid-cols-12 border-b border-white/10 pb-14">

        <div class="lg:col-span-4 flex flex-col gap-6">
          <a href="/index.html" class="flex items-center gap-3" aria-label="${company.fullName}">
            <img src="/images/brand/logo.png" alt="لوگوی شرکت مهندسی نقشه‌برداری مهراز سنج شرق"
                 class="h-14 w-14 rounded-[4px] border border-white/15 object-cover" width="56" height="56" />
            <span class="leading-tight">
              <span class="block text-lg font-extrabold text-white">مهراز سنج شرق</span>
              <span class="en-note !text-[0.6rem] text-slate-500">Engineering &amp; Geomatics — Mashhad</span>
            </span>
          </a>
          <p class="text-slate-400 text-sm leading-8 max-w-sm">
            ${company.aboutLead}
          </p>
          <p class="text-gold/90 text-sm">${company.tagline}</p>
        </div>

        <nav class="lg:col-span-2" aria-label="دسترسی سریع">
          <h4 class="footer-heading">دسترسی سریع</h4>
          <ul class="footer-list">${quickLinks}</ul>
        </nav>

        <nav class="lg:col-span-3" aria-label="خدمات">
          <h4 class="footer-heading">خدمات تخصصی</h4>
          <ul class="footer-list">${serviceLinks}</ul>
        </nav>

        <div class="lg:col-span-3">
          <h4 class="footer-heading">اطلاعات تماس</h4>
          <ul class="footer-list">
            <li>
              <a class="footer-link flex items-start gap-2.5" href="${company.phones[0].href}">
                ${icon('phone', 'h-4 w-4 mt-1 shrink-0 text-gold')}
                <span dir="ltr" class="text-right">${company.phones[0].label} / ${company.phones[1].label}</span>
              </a>
            </li>
            <li>
              <a class="footer-link flex items-start gap-2.5" href="mailto:${company.email}">
                ${icon('mail', 'h-4 w-4 mt-1 shrink-0 text-gold')}
                <span dir="ltr" class="text-right">${company.email}</span>
              </a>
            </li>
            <li class="flex items-start gap-2.5 text-slate-400 text-sm leading-7">
              ${icon('map-pin', 'h-4 w-4 mt-1 shrink-0 text-gold')}
              <span>${company.address}</span>
            </li>
            <li class="flex items-start gap-2.5 text-slate-400 text-sm leading-7">
              ${icon('landmark', 'h-4 w-4 mt-1 shrink-0 text-gold')}
              <span>شماره ثبت: <span class="num">${company.registrationNumber}</span></span>
            </li>
            <li class="flex items-start gap-2.5 text-slate-400 text-sm leading-7">
              ${icon('map', 'h-4 w-4 mt-1 shrink-0 text-gold')}
              <span>حوزه فعالیت: ${company.region}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="py-8 text-center text-gold/80 text-sm leading-8">${company.closingStatement}</p>

      <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© ${yearFa} ${company.fullName} — تمامی حقوق محفوظ است.</p>
        <p class="en-note !text-[0.62rem]">${company.latinName} · ${company.website}</p>
      </div>
    </div>
  `
}
