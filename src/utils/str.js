/** Persian / latin digit utilities. */

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Convert any latin digits inside a string to Persian digits. */
export function faDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)])
}

/** Zero-padded Persian number, e.g. padFa(3, 2) -> "۰۳". */
export function padFa(value, pad = 2) {
  return faDigits(String(value).padStart(pad, '0'))
}

/** Group a number with Persian thousand separators. */
export function faNumber(value) {
  return faDigits(Number(value).toLocaleString('en-US').replace(/,/g, '٬'))
}
