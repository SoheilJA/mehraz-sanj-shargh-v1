/**
 * Contact form — frontend validation with honest success/error states.
 * There is no backend: on valid submit the form offers real channels
 * (tel / mailto with prefilled subject and body) and clearly states
 * that message delivery requires backend integration.
 */
import { company } from '../data/company.js'
import { services } from '../data/services.js'
import { icon } from '../utils/dom.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^(\+?\d[\d\s-]{7,})$/

export function contactFormHtml() {
  return `
  <form id="contact-form" novalidate class="card p-6 md:p-8">
    <div class="grid md:grid-cols-2 gap-5">
      <div class="field">
        <label for="cf-name">نام و نام خانوادگی <span class="text-golddeep">*</span></label>
        <input id="cf-name" name="name" type="text" autocomplete="name" placeholder="نام کامل شما" />
        <p class="field-error hidden" data-err="name"></p>
      </div>
      <div class="field">
        <label for="cf-phone">شماره تماس <span class="text-golddeep">*</span></label>
        <input id="cf-phone" name="phone" type="tel" inputmode="tel" dir="ltr" placeholder="09xxxxxxxxx" />
        <p class="field-error hidden" data-err="phone"></p>
      </div>
    </div>
    <div class="field mt-5">
      <label for="cf-email">پست الکترونیک</label>
      <input id="cf-email" name="email" type="email" dir="ltr" placeholder="you@example.com" />
      <p class="field-error hidden" data-err="email"></p>
    </div>
    <div class="field mt-5">
      <label for="cf-subject">موضوع درخواست</label>
      <select id="cf-subject" name="subject">
        <option value="consult">درخواست مشاوره تخصصی</option>
        ${services.map((s) => `<option value="${s.slug}">${s.title}</option>`).join('')}
        <option value="other">سایر موارد</option>
      </select>
    </div>
    <div class="field mt-5">
      <label for="cf-message">شرح نیاز شما <span class="text-golddeep">*</span></label>
      <textarea id="cf-message" name="message" rows="5" placeholder="نوع پروژه، مرحله فعلی اجرا و خدمت مورد نیاز را شرح دهید…"></textarea>
      <p class="field-error hidden" data-err="message"></p>
    </div>

    <div class="mt-7 flex flex-col sm:flex-row items-center gap-4">
      <button type="submit" class="btn btn-primary w-full sm:w-auto">
        ${icon('send', 'h-4 w-4')} بررسی و ارسال درخواست
      </button>
      <p class="text-xs leading-6 text-muted">پس از بررسی صحت اطلاعات، مسیرهای ارسال واقعی به شما نمایش داده می‌شود.</p>
    </div>

    <div id="cf-result" class="hidden mt-6" role="status" aria-live="polite"></div>
  </form>`
}

export function mountContactForm(root) {
  const form = (typeof root === 'string' ? document.querySelector(root) : root)?.querySelector('#contact-form')
  if (!form) return

  const showError = (name, msg) => {
    const err = form.querySelector(`[data-err="${name}"]`)
    const field = err?.closest('.field')
    if (!err || !field) return
    err.textContent = msg || ''
    err.classList.toggle('hidden', !msg)
    field.classList.toggle('invalid', Boolean(msg))
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    let ok = true

    if (!data.name || data.name.trim().length < 3) {
      showError('name', 'نام را کامل وارد کنید (حداقل ۳ حرف).')
      ok = false
    } else showError('name', '')

    if (!data.phone || !PHONE_RE.test(data.phone.trim())) {
      showError('phone', 'شماره تماس معتبر وارد کنید؛ مثال: 09154284335')
      ok = false
    } else showError('phone', '')

    if (data.email && !EMAIL_RE.test(data.email.trim())) {
      showError('email', 'نشانی ایمیل معتبر نیست.')
      ok = false
    } else showError('email', '')

    if (!data.message || data.message.trim().length < 10) {
      showError('message', 'شرح نیاز را کامل‌تر بنویسید (حداقل ۱۰ حرف).')
      ok = false
    } else showError('message', '')

    const result = form.querySelector('#cf-result')
    result.classList.remove('hidden')

    if (!ok) {
      result.innerHTML = `
        <div class="border border-red-500/30 bg-red-50 text-red-800 p-4 text-sm leading-7 flex gap-3">
          ${icon('alert-circle', 'h-5 w-5 shrink-0 mt-0.5 text-red-600')}
          <span>اطلاعات فرم کامل نیست؛ لطفاً موارد مشخص‌شده را اصلاح کنید و دوباره تلاش کنید.</span>
        </div>`
      return
    }

    const subjectLabel = form.querySelector(`#cf-subject option[value="${data.subject}"]`)?.textContent || 'درخواست مشاوره'
    const mailto = `mailto:${company.email}?subject=${encodeURIComponent(
      `[وب‌سایت] ${subjectLabel} — ${data.name.trim()}`
    )}&body=${encodeURIComponent(
      `نام: ${data.name.trim()}\nتماس: ${data.phone.trim()}\nایمیل: ${data.email || '—'}\n\n${data.message.trim()}`
    )}`

    result.innerHTML = `
      <div class="border border-gold/40 bg-gold/[0.07] p-5 text-sm leading-8">
        <p class="flex items-center gap-2.5 font-bold text-ink">
          ${icon('check-circle-2', 'h-5 w-5 text-golddeep')} اطلاعات فرم شما بررسی و تأیید شد.
        </p>
        <p class="mt-2 text-inksoft">
          این وب‌سایت هنوز به سامانه پردازش پیام (بک‌اند) متصل نیست؛ برای ارسال واقعی درخواست، از یکی از مسیرهای زیر اقدام کنید:
        </p>
        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <a class="btn btn-gold !h-11 !text-sm" href="${mailto}">
            ${icon('mail', 'h-4 w-4')} ارسال با ایمیل
          </a>
          <a class="btn btn-ghost !h-11 !text-sm" href="${company.phones[0].href}">
            ${icon('phone', 'h-4 w-4')} <span dir="ltr">${company.phones[0].label}</span>
          </a>
          <a class="btn btn-ghost !h-11 !text-sm" href="${company.phones[1].href}">
            ${icon('phone', 'h-4 w-4')} <span dir="ltr">${company.phones[1].label}</span>
          </a>
        </div>
      </div>`
  })
}
