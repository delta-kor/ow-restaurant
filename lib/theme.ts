export type ScreenTheme = 'system' | 'light' | 'dark'
export function normalizeScreenTheme(value: unknown): ScreenTheme {
  return value === 'light' || value === 'dark' ? value : 'system'
}
export function resolveScreenTheme(value: ScreenTheme, systemDark: boolean): 'light' | 'dark' {
  return value === 'system' ? (systemDark ? 'dark' : 'light') : value
}
// Run before the first paint, using the same setting as SettingsProvider.
export const themeInitScript = `(()=>{let t='system';try{const v=JSON.parse(localStorage.getItem('ow_rest_settings')||'{}').screenTheme;if(v==='light'||v==='dark')t=v}catch{}const d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light'})()`
