import { useLocale } from 'next-intl'
import { getInfoLocale } from '@/lib/info-locales'
export function useInfoLocale() { return getInfoLocale(useLocale()) }
