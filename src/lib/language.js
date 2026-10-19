export const isMyanmar = (language) => language === 'mm'

export function getLocalizedValue(item, field, language, fallback = '') {
  const localizedField = language === 'mm' ? `${field}_mm` : `${field}_en`
  return item[localizedField] || item[`${field}_en`] || fallback
}
