/**
 * Engineering process timeline (01 → 05) with a scroll-scrubbed
 * progress rail and step activation.
 */
import { padFa } from '../utils/str.js'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../utils/motion.js'

export const processSteps = [
  {
    title: 'بررسی نیاز پروژه',
    en: 'PROJECT NEEDS',
    desc: 'شناخت هندسه پروژه، مراحل اجرا و سطح دقت مورد نیاز؛ تعیین سامانه مختصات و برنامه برداشت.',
  },
  {
    title: 'برداشت و جمع‌آوری داده',
    en: 'DATA ACQUISITION',
    desc: 'نمونه‌برداری میدانی متراکم با توتال استیشن و GNSS و کنترل کیفیت داده در مبدأ.',
  },
  {
    title: 'تحلیل و محاسبات مهندسی',
    en: 'COMPUTATION',
    desc: 'پردازش شبکه، مدل‌سازی سطوح و محاسبات دقیق بر پایه ضوابط فنی و نقشه‌های مصوب.',
  },
  {
    title: 'پیاده‌سازی و کنترل',
    en: 'LAYOUT & CONTROL',
    desc: 'انتقال نتایج به کارگاه، کنترل مرحله‌ای اجرا و اطلاع‌رسانی فوری انحراف‌ها.',
  },
  {
    title: 'مستندسازی و تحویل خروجی',
    en: 'DOCUMENTATION',
    desc: 'تدوین گزارش‌ها، نقشه‌ها و فایل‌های CAD/Civil و تحویل رسمی به کارفرما.',
  },
]

export function mountProcess(root, steps = processSteps) {
  const holder = typeof root === 'string' ? document.getElementById(root) : root
  if (!holder) return

  holder.innerHTML = `
    <div class="process-rail" style="right: 7px"><div class="process-fill absolute top-0 right-0 w-px bg-gold origin-top" style="height: 100%"></div></div>
    ${steps
      .map(
        (s, i) => `
        <div class="process-step relative ps-10 md:ps-14 pb-12 last:pb-0 ${i === 0 ? 'active' : ''}" data-step="${i}">
          <span class="process-dot"></span>
          <div class="flex items-baseline gap-4 flex-wrap">
            <span class="process-num num">${padFa(i + 1)}</span>
            <h3 class="text-h3 font-extrabold text-ink">${s.title}</h3>
            <span class="en-note">${s.en}</span>
          </div>
          <p class="mt-3 text-muted leading-8 max-w-xl">${s.desc}</p>
        </div>`
      )
      .join('')}`

  const fill = holder.querySelector('.process-fill')
  const stepNodes = holder.querySelectorAll('.process-step')

  if (prefersReducedMotion) {
    stepNodes.forEach((s) => s.classList.add('active'))
    fill.style.height = '100%'
    return
  }

  gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: holder,
        start: 'top 72%',
        end: 'bottom 55%',
        scrub: 0.6,
        onUpdate: (self) => {
          const n = Math.min(stepNodes.length, Math.ceil(self.progress * stepNodes.length + 0.001))
          stepNodes.forEach((s, i) => s.classList.toggle('active', i < n))
        },
      },
    }
  )
}
